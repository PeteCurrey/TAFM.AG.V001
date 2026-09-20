import React from 'react'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db/client'
import { availableTransitions } from '@/lib/matching/opportunity'
import type { OpportunityStatus } from '@/lib/matching/opportunity'

// ─── Opportunity workspace ─────────────────────────────────────────────────────

async function getOpportunity(id: string) {
  if (!db) return null
  try {
    return await db.opportunity.findUnique({
      where: { id },
    })
  } catch { return null }
}

async function getAuditHistory(entityId: string) {
  if (!db) return []
  try {
    return await db.auditLog.findMany({
      where:   { entityType: 'Opportunity', entityId },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })
  } catch { return [] }
}

async function getAIResults(entityId: string) {
  if (!db) return []
  try {
    return await db.aIIntelligenceResult.findMany({
      where:   { entityId },
      orderBy: { createdAt: 'desc' },
      take:    10,
    })
  } catch { return [] }
}

const PANEL_HEADER = 'px-5 py-3 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider'
const PANEL = 'border border-border rounded-sm overflow-hidden'
const ROW = 'grid grid-cols-[160px_1fr] gap-3 px-5 py-2.5 border-b border-border last:border-0'
const LABEL = 'text-xs text-text-secondary'
const VALUE = 'text-xs text-text-primary'

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
  DRAFT:        { dot: 'bg-neutral-500',  text: 'text-neutral-400' },
  QUALIFYING:   { dot: 'bg-blue-400',     text: 'text-blue-400' },
  MATCHED:      { dot: 'bg-indigo-400',   text: 'text-indigo-400' },
  SUBMITTED:    { dot: 'bg-orange-400',   text: 'text-orange-400' },
  UNDER_REVIEW: { dot: 'bg-amber-400',    text: 'text-amber-400' },
  OFFERED:      { dot: 'bg-emerald-400',  text: 'text-emerald-400' },
  COMPLETED:    { dot: 'bg-emerald-500',  text: 'text-emerald-500' },
  DECLINED:     { dot: 'bg-red-500',      text: 'text-red-400' },
  WITHDRAWN:    { dot: 'bg-neutral-600',  text: 'text-neutral-500' },
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [opp, auditLogs, aiResults] = await Promise.all([
    getOpportunity(id),
    getAuditHistory(id),
    getAIResults(id),
  ])

  if (!opp) notFound()

  const statusStyle  = STATUS_STYLES[opp.status] ?? STATUS_STYLES.DRAFT
  const transitions  = availableTransitions(opp.status as OpportunityStatus)
  const statusHistory = Array.isArray(opp.statusHistory) ? opp.statusHistory as unknown[] : []
  const qualityScore = opp.dataQualityScore ? Math.round(Number(opp.dataQualityScore) * 100) : null

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-tertiary mb-1 font-mono">{opp.reference}</p>
          <h1 className="text-2xl font-extralight text-text-primary mb-1">Opportunity workspace</h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
            <span className={`text-sm font-medium ${statusStyle.text}`}>{opp.status}</span>
          </div>
        </div>

        {/* Status transitions */}
        {transitions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">Advance to:</span>
            {transitions.map((t) => {
              const ts = STATUS_STYLES[t] ?? STATUS_STYLES.DRAFT
              return (
                <button
                  key={t}
                  disabled
                  title="Status transitions require authentication (Phase 4)"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-sm text-xs text-text-secondary hover:border-text-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${ts.dot}`} />
                  {t}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left column */}
        <div className="space-y-4">

          {/* Core data */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>Opportunity data</div>
            <div className={ROW}><span className={LABEL}>ID</span><span className={`${VALUE} font-mono`}>{opp.id}</span></div>
            <div className={ROW}><span className={LABEL}>Reference</span><span className={`${VALUE} font-mono`}>{opp.reference}</span></div>
            <div className={ROW}><span className={LABEL}>Business ID</span><span className={`${VALUE} font-mono`}>{opp.businessId}</span></div>
            <div className={ROW}><span className={LABEL}>Asset ID</span><span className={`${VALUE} font-mono`}>{opp.assetId ?? '—'}</span></div>
            <div className={ROW}><span className={LABEL}>Application ID</span><span className={`${VALUE} font-mono`}>{opp.applicationId ?? '—'}</span></div>
            <div className={ROW}><span className={LABEL}>Assigned to</span><span className={VALUE}>{opp.assignedToId ?? 'Unassigned'}</span></div>
            <div className={ROW}><span className={LABEL}>Created</span><span className={VALUE}>{new Date(opp.createdAt).toLocaleString('en-GB')}</span></div>
            <div className={ROW}><span className={LABEL}>Updated</span><span className={VALUE}>{new Date(opp.updatedAt).toLocaleString('en-GB')}</span></div>
          </div>

          {/* Match analysis */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>Match analysis</div>
            {opp.matchAnalysis ? (
              <div className="px-5 py-4">
                <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap">
                  {JSON.stringify(opp.matchAnalysis, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="px-5 py-4">
                <p className="text-xs text-text-tertiary">No match analysis yet. Run eligibility check to generate.</p>
              </div>
            )}
          </div>

          {/* Status history */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>Status history ({statusHistory.length})</div>
            {statusHistory.length === 0 ? (
              <div className="px-5 py-4">
                <p className="text-xs text-text-tertiary">No status transitions recorded.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {(statusHistory as Array<Record<string, unknown>>).map((entry, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-4 text-xs">
                    <span className="text-text-tertiary w-36 font-mono">
                      {typeof entry.at === 'string' ? new Date(entry.at).toLocaleString('en-GB') : '—'}
                    </span>
                    <span className="text-text-secondary">{String(entry.from ?? '—')}</span>
                    <span className="text-text-tertiary">→</span>
                    <span className="text-text-primary">{String(entry.to ?? '—')}</span>
                    {Boolean(entry.reason) && <span className="text-text-tertiary">({String(entry.reason)})</span>}
                    {Boolean(entry.actorId) && <span className="text-text-tertiary">by {String(entry.actorId)}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI intelligence results */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>AI intelligence results ({aiResults.length})</div>
            {aiResults.length === 0 ? (
              <div className="px-5 py-4">
                <p className="text-xs text-text-tertiary">No AI intelligence results for this opportunity.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {aiResults.map((r) => (
                  <div key={r.id} className="px-5 py-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-text-primary">{r.operationType}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${
                        r.dataStatus === 'VERIFIED'     ? 'border-emerald-800 text-emerald-400' :
                        r.dataStatus === 'PROVISIONAL'  ? 'border-blue-800 text-blue-400'       :
                        r.dataStatus === 'USER_PROVIDED'? 'border-blue-800 text-blue-400'       :
                        r.dataStatus === 'CALCULATED'   ? 'border-amber-800 text-amber-400'     :
                        'border-border text-text-tertiary'
                      }`}>{r.dataStatus}</span>
                      {r.requiresReview && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm border border-amber-800 text-amber-400">Review required</span>
                      )}
                      <span className="text-xs text-text-tertiary ml-auto">
                        {Math.round(Number(r.confidence) * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-text-tertiary">{new Date(r.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Data quality */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>Data quality</div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-text-secondary">Overall score</span>
                <span className={`text-lg font-light ${
                  qualityScore === null      ? 'text-text-tertiary' :
                  qualityScore > 70          ? 'text-emerald-400'   :
                  qualityScore > 40          ? 'text-amber-400'     : 'text-red-400'
                }`}>
                  {qualityScore !== null ? `${qualityScore}%` : 'Not assessed'}
                </span>
              </div>
              {qualityScore !== null && (
                <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      qualityScore > 70 ? 'bg-emerald-500' :
                      qualityScore > 40 ? 'bg-amber-400'   : 'bg-red-500'
                    }`}
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
              )}
              <p className="text-xs text-text-tertiary mt-3">
                Data quality scoring requires human review to assess completeness, 
                document verification, and AI output validation.
              </p>
            </div>
          </div>

          {/* Matched providers */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>Matched providers ({opp.matchedProviderIds.length})</div>
            {opp.matchedProviderIds.length === 0 ? (
              <div className="px-5 py-4">
                <p className="text-xs text-text-tertiary">No providers matched yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {opp.matchedProviderIds.map((pid) => (
                  <div key={pid} className="px-5 py-2.5 text-xs text-text-secondary font-mono">{pid}</div>
                ))}
              </div>
            )}
          </div>

          {/* Audit log */}
          <div className={PANEL}>
            <div className={PANEL_HEADER}>Audit log ({auditLogs.length})</div>
            {auditLogs.length === 0 ? (
              <div className="px-5 py-4">
                <p className="text-xs text-text-tertiary">No audit events recorded.</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="px-5 py-2.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-text-primary">{log.action}</span>
                      <span className="text-xs text-text-tertiary ml-auto">
                        {new Date(log.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    {log.reason && <p className="text-xs text-text-tertiary">{log.reason}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {opp.internalNotes && (
            <div className={PANEL}>
              <div className={PANEL_HEADER}>Internal notes</div>
              <div className="px-5 py-4">
                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{opp.internalNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
