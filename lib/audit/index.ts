import { Prisma } from '@prisma/client'
import { db } from '@/lib/db/client'
import { logger } from '@/lib/logging'

// ─── Audit service ─────────────────────────────────────────────────────────────
//
// Central service for writing structured audit events to the database.
// Every consequential action on a financial platform must be auditable.
//
// Rules:
//   - Audit events are WRITE-ONLY. They are never edited or deleted.
//   - The `before` and `after` fields capture state snapshots — not diffs.
//   - Sensitive fields (passwords, keys, tokens) must NEVER appear in audit logs.
//   - Failures to write audit events should be logged but MUST NOT crash the caller.
//
// Usage:
//   await auditService.log({ entity: 'Opportunity', entityId, action: 'STATUS_CHANGE',
//     actorId, before: { status: 'DRAFT' }, after: { status: 'QUALIFYING' } })

export type AuditEntityType =
  | 'User'
  | 'Business'
  | 'Asset'
  | 'Opportunity'
  | 'FinanceApplication'
  | 'FinanceOffer'
  | 'ApplicationDocument'
  | 'Lender'
  | 'Supplier'
  | 'ProviderCriteria'
  | 'ProviderCriteriaVersion'
  | 'ProviderApplication'
  | 'MarketObservation'
  | 'AIIntelligenceResult'
  | 'AIJob'
  | 'Lead'
  | 'DataSource'
  | 'ImportJob'
  | 'Resource'

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'SUBMIT'
  | 'APPROVE'
  | 'DECLINE'
  | 'WITHDRAW'
  | 'REVIEW'
  | 'EXPORT'
  | 'ACCESS'
  | 'VERIFY'
  | 'REJECT'
  | 'MATCH'
  | 'ASSIGN'

export interface AuditEventInput {
  entity: AuditEntityType
  entityId: string
  action: AuditActionType
  actorId?: string
  actorType?: 'USER' | 'SYSTEM' | 'AI'
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  reason?: string
  source?: string
  ipAddress?: string
  userAgent?: string
}

export const auditService = {
  /**
   * Write an audit event to the database.
   *
   * This method NEVER throws. Audit failures are logged but do not
   * propagate to callers — the business operation must not be blocked
   * by an audit system failure.
   */
  async log(event: AuditEventInput): Promise<void> {
    try {
      if (!db) {
        logger.warn('Audit event skipped — database not configured', {
          entity: event.entity,
          action: event.action,
        }, 'audit')
        return
      }

      await db.auditLog.create({
        data: {
          entityType: event.entity,
          entityId: event.entityId,
          action: event.action as Parameters<typeof db.auditLog.create>[0]['data']['action'],
          actorId: event.actorId ?? null,
          actorType: event.actorType ?? 'USER',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          previousValue: (event.before as any) ?? Prisma.DbNull,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newValue:      (event.after  as any) ?? Prisma.DbNull,
          reason: event.reason ?? null,
          source: event.source ?? null,
          ipAddress: event.ipAddress ?? null,
          userAgent: event.userAgent ?? null,
        },
      })

      logger.audit(`${event.entity} ${event.action}`, {
        entityId: event.entityId,
        actorId: event.actorId,
        reason: event.reason,
      })
    } catch (err) {
      // Never crash the caller on audit failure
      logger.warn('Failed to write audit event', {
        entity: event.entity,
        entityId: event.entityId,
        action: event.action,
        error: err instanceof Error ? err.message : String(err),
      }, 'audit')
    }
  },

  /**
   * Write an audit event for a status transition.
   * Convenience wrapper that always sets action to STATUS_CHANGE.
   */
  async statusChange(
    entity: AuditEntityType,
    entityId: string,
    previousStatus: string,
    newStatus: string,
    opts?: { actorId?: string; actorType?: AuditEventInput['actorType']; reason?: string },
  ): Promise<void> {
    return this.log({
      entity,
      entityId,
      action: 'STATUS_CHANGE',
      actorId: opts?.actorId,
      actorType: opts?.actorType,
      before: { status: previousStatus },
      after: { status: newStatus },
      reason: opts?.reason,
      source: 'status_transition',
    })
  },
}
