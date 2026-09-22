// ─── Notification event architecture ──────────────────────────────────────────
//
// Typed event definitions for the TAFM notification system.
// Events are emitted now — delivery (email/SMS/webhook) is wired later.
//
// Current behaviour: log all events to the audit/logger system.
// Future: route to email (Resend), SMS, push, or webhook based on event type.

import { logger } from '@/lib/logging'
import {
  buildOpportunityCreatedEmail,
  buildProviderMatchEmail,
  sendEmail,
} from './email'

// ─── Event type definitions ───────────────────────────────────────────────────

export type NotificationEventType =
  | 'FINANCE_REQUEST_CREATED'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'POTENTIAL_MATCH_FOUND'
  | 'PROVIDER_RESPONSE_RECEIVED'
  | 'DOCUMENT_REQUIRED'
  | 'DOCUMENT_UPLOADED'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'OPPORTUNITY_STATUS_CHANGED'
  | 'AI_ANALYSIS_COMPLETE'
  | 'AI_REVIEW_FLAGGED'
  | 'DATA_QUALITY_ALERT'
  | 'APPLICATION_SUBMITTED'
  | 'OFFER_RECEIVED'

export interface NotificationPayloadMap {
  FINANCE_REQUEST_CREATED:         { opportunityId: string; businessId: string; assetDescription?: string }
  ADDITIONAL_INFORMATION_REQUIRED: { opportunityId: string; businessId: string; fields: string[]; message?: string }
  POTENTIAL_MATCH_FOUND:           { opportunityId: string; businessId: string; matchCount: number }
  PROVIDER_RESPONSE_RECEIVED:      { opportunityId: string; lenderId: string; responseType: string }
  DOCUMENT_REQUIRED:               { opportunityId: string; businessId: string; documentTypes: string[] }
  DOCUMENT_UPLOADED:               { opportunityId: string; documentType: string; uploadedBy: string }
  HUMAN_REVIEW_REQUIRED:           { entityType: string; entityId: string; reason: string; assignedTo?: string }
  OPPORTUNITY_STATUS_CHANGED:      { opportunityId: string; from: string; to: string; reason?: string }
  AI_ANALYSIS_COMPLETE:            { jobId: string; entityId?: string; dataStatus: string; confidence: number }
  AI_REVIEW_FLAGGED:               { jobId: string; reason: string; entityId?: string }
  DATA_QUALITY_ALERT:              { entityType: string; entityId: string; issues: string[] }
  APPLICATION_SUBMITTED:           { applicationId: string; businessId: string }
  OFFER_RECEIVED:                  { opportunityId: string; offerId: string; lenderId: string }
}

export interface NotificationEvent<T extends NotificationEventType = NotificationEventType> {
  type:      T
  payload:   NotificationPayloadMap[T]
  actorId?:  string
  timestamp: Date
}

// ─── Event emitter ────────────────────────────────────────────────────────────

/**
 * Emit a typed notification event.
 *
 * Current implementation: structured log entry (fully auditable).
 * Future: route to delivery provider (email/SMS/webhook) based on event type + subscriber preferences.
 *
 * This function NEVER throws. Notification failures must not crash business operations.
 */
export async function emitEvent<T extends NotificationEventType>(
  type: T,
  payload: NotificationPayloadMap[T],
  opts?: { actorId?: string },
): Promise<void> {
  const event: NotificationEvent<T> = {
    type,
    payload,
    actorId:   opts?.actorId,
    timestamp: new Date(),
  }

  try {
    // Current behaviour: structured log
    logger.info(`Notification event: ${type}`, {
      type,
      payload,
      actorId: opts?.actorId,
    }, 'app')

    // Controlled email dispatch
    if (type === 'FINANCE_REQUEST_CREATED') {
      const p = payload as NotificationPayloadMap['FINANCE_REQUEST_CREATED']
      const email = buildOpportunityCreatedEmail(p.opportunityId, p.businessId)
      await sendEmail(email)
    } else if (type === 'POTENTIAL_MATCH_FOUND') {
      const p = payload as NotificationPayloadMap['POTENTIAL_MATCH_FOUND']
      const email = buildProviderMatchEmail('Approved Provider Network', p.opportunityId)
      await sendEmail(email)
    }

  } catch (err) {
    // Non-fatal — log and continue
    logger.warn('Failed to emit notification event', {
      type,
      error: err instanceof Error ? err.message : String(err),
    }, 'app')
  }

  void event // suppress unused warning until delivery is wired
}
