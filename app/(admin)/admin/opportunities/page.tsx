import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'

// ─── Opportunities list ────────────────────────────────────────────────────────

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

async function getOpportunities() {
  if (!db) return []
  try {
    return await db.opportunity.findMany({
      where:   { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take:    100,
      select: {
        id:           true,
        reference:    true,
        businessId:   true,
        assetId:      true,
        status:       true,
        dataQualityScore: true,
        createdAt:    true,
        updatedAt:    true,
        assignedToId: true,
        matchedProviderIds: true,
      },
    })
  } catch { return [] }
}

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extralight text-text-primary mb-1">Opportunities</h1>
          <p className="text-sm text-text-secondary">{opportunities.length} records</p>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="border border-border rounded-sm p-12 text-center">
          <p className="text-text-secondary text-sm mb-2">No opportunities yet</p>
          <p className="text-text-tertiary text-xs">
            Opportunities are created when a business submits a finance application.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[180px_1fr_120px_100px_80px_120px] gap-4 px-4 py-2.5 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
            <div>Reference</div>
            <div>Business ID</div>
            <div>Status</div>
            <div>Data quality</div>
            <div>Providers</div>
            <div>Created</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {opportunities.map((opp) => {
              const statusStyle = STATUS_STYLES[opp.status] ?? STATUS_STYLES.DRAFT
              const qualityPct  = opp.dataQualityScore
                ? Math.round(Number(opp.dataQualityScore) * 100)
                : null

              return (
                <Link
                  key={opp.id}
                  href={`/admin/opportunities/${opp.id}`}
                  className="grid grid-cols-[180px_1fr_120px_100px_80px_120px] gap-4 px-4 py-3 text-xs hover:bg-white/[0.02] transition-colors"
                >
                  <div className="text-orange-400 font-mono">{opp.reference.slice(0, 12)}…</div>
                  <div className="text-text-secondary truncate">{opp.businessId.slice(0, 16)}…</div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    <span className={statusStyle.text}>{opp.status}</span>
                  </div>
                  <div className={`${qualityPct !== null ? (qualityPct > 70 ? 'text-emerald-400' : qualityPct > 40 ? 'text-amber-400' : 'text-red-400') : 'text-text-tertiary'}`}>
                    {qualityPct !== null ? `${qualityPct}%` : '—'}
                  </div>
                  <div className="text-text-secondary">{opp.matchedProviderIds.length}</div>
                  <div className="text-text-tertiary">{new Date(opp.createdAt).toLocaleDateString('en-GB')}</div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
