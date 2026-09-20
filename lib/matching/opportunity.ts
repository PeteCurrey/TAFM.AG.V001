// ─── Opportunity status management ────────────────────────────────────────────
//
// Manages valid status transitions for the Opportunity object.
// Every transition is validated against a rules map.
// Invalid transitions are rejected — they never silently succeed.

import { auditService } from '@/lib/audit'

export type OpportunityStatus =
  | 'DRAFT'
  | 'QUALIFYING'
  | 'MATCHED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'OFFERED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'WITHDRAWN'

// Which statuses can each status transition TO
const VALID_TRANSITIONS: Record<OpportunityStatus, OpportunityStatus[]> = {
  DRAFT:        ['QUALIFYING', 'WITHDRAWN'],
  QUALIFYING:   ['MATCHED', 'DRAFT', 'WITHDRAWN'],
  MATCHED:      ['SUBMITTED', 'QUALIFYING', 'WITHDRAWN'],
  SUBMITTED:    ['UNDER_REVIEW', 'WITHDRAWN'],
  UNDER_REVIEW: ['OFFERED', 'DECLINED', 'SUBMITTED'],
  OFFERED:      ['COMPLETED', 'DECLINED', 'WITHDRAWN'],
  COMPLETED:    [],
  DECLINED:     [],
  WITHDRAWN:    [],
}

export interface StatusTransitionResult {
  success: boolean
  error?:  string
  from:    OpportunityStatus
  to:      OpportunityStatus
}

/**
 * Validate a status transition.
 * Returns { success: true } if the transition is valid, { success: false, error } otherwise.
 */
export function validateTransition(
  from: OpportunityStatus,
  to: OpportunityStatus,
): StatusTransitionResult {
  const allowed = VALID_TRANSITIONS[from] ?? []

  if (!allowed.includes(to)) {
    return {
      success: false,
      error: `Invalid transition: ${from} → ${to}. Allowed: ${allowed.length > 0 ? allowed.join(', ') : 'none (terminal status)'}`,
      from,
      to,
    }
  }

  return { success: true, from, to }
}

/**
 * Build a status history entry.
 * Call this every time status changes — append to the statusHistory JSON array.
 */
export function buildStatusHistoryEntry(
  from: OpportunityStatus,
  to: OpportunityStatus,
  opts?: { actorId?: string; actorType?: string; reason?: string },
): {
  from:      string
  to:        string
  at:        string
  actorId?:  string
  actorType: string
  reason?:   string
} {
  return {
    from,
    to,
    at:        new Date().toISOString(),
    actorId:   opts?.actorId,
    actorType: opts?.actorType ?? 'USER',
    reason:    opts?.reason,
  }
}

/**
 * Write an audit event for an opportunity status change.
 * Thin wrapper around auditService.statusChange.
 */
export async function auditOpportunityTransition(
  opportunityId: string,
  from: OpportunityStatus,
  to: OpportunityStatus,
  opts?: { actorId?: string; reason?: string },
): Promise<void> {
  await auditService.statusChange(
    'Opportunity',
    opportunityId,
    from,
    to,
    { actorId: opts?.actorId, actorType: 'USER', reason: opts?.reason },
  )
}

/**
 * Return all terminal statuses (no further transitions possible).
 */
export function isTerminalStatus(status: OpportunityStatus): boolean {
  return VALID_TRANSITIONS[status]?.length === 0
}

/**
 * Return what transitions are available from a given status.
 */
export function availableTransitions(status: OpportunityStatus): OpportunityStatus[] {
  return VALID_TRANSITIONS[status] ?? []
}
