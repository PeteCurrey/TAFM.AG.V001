import React from 'react'
import { db } from '@/lib/db/client'

// ─── Data quality dashboard ────────────────────────────────────────────────────

async function getDataQualityStats() {
  if (!db) return null
  try {
    const [
      totalAssets,
      assetsNoManufacturer,
      assetsNoCategorySlug,
      aiResultsPendingReview,
      aiResultsLowConfidence,
      opportunitiesNoQualityScore,
      unverifiedDocs,
    ] = await Promise.all([
      db.asset.count({ where: { deletedAt: null } }),
      db.asset.count({ where: { deletedAt: null, manufacturerId: null } }),
      db.asset.count({ where: { deletedAt: null, slug: null } }),
      db.aIIntelligenceResult.count({ where: { requiresReview: true, reviewedAt: null } }),
      db.aIIntelligenceResult.count({ where: { confidence: { lt: 0.6 } } }),
      db.opportunity.count({ where: { deletedAt: null, dataQualityScore: null } }),
      db.applicationDocument.count({ where: { status: 'UNDER_REVIEW' } }),
    ])

    return {
      totalAssets,
      assetsNoManufacturer,
      assetsNoCategorySlug,
      aiResultsPendingReview,
      aiResultsLowConfidence,
      opportunitiesNoQualityScore,
      unverifiedDocs,
    }
  } catch { return null }
}

function QualityIssueRow({
  label,
  count,
  total,
  severity,
  description,
}: {
  label:       string
  count:       number
  total?:      number
  severity:    'critical' | 'warning' | 'info'
  description: string
}) {
  const pct   = total && total > 0 ? Math.round((count / total) * 100) : null
  const color = severity === 'critical' ? 'text-red-400' : severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
  const barColor = severity === 'critical' ? 'bg-red-500' : severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'

  return (
    <div className="px-5 py-4 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-text-primary">{label}</span>
        <span className={`text-lg font-extralight ${count === 0 ? 'text-emerald-400' : color}`}>
          {count.toLocaleString()}
          {pct !== null && count > 0 && <span className="text-sm ml-1 font-light text-text-tertiary">({pct}%)</span>}
        </span>
      </div>
      <p className="text-xs text-text-secondary mb-2">{description}</p>
      {pct !== null && (
        <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${count === 0 ? 'bg-emerald-500' : barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}

export default async function DataQualityPage() {
  const stats = await getDataQualityStats()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extralight text-text-primary mb-1">Data quality</h1>
        <p className="text-sm text-text-secondary">Records requiring attention or verification</p>
      </div>

      {!stats ? (
        <div className="border border-amber-900/40 bg-amber-950/20 rounded-sm px-4 py-3">
          <p className="text-xs text-amber-400">Database not connected — data quality metrics unavailable</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Asset data quality */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
              Asset data quality
            </div>
            <QualityIssueRow
              label="Assets missing manufacturer"
              count={stats.assetsNoManufacturer}
              total={stats.totalAssets}
              severity="warning"
              description="Assets where manufacturer has not been associated. Affects matching and SEO entity pages."
            />
            <QualityIssueRow
              label="Assets without URL slug"
              count={stats.assetsNoCategorySlug}
              total={stats.totalAssets}
              severity="info"
              description="Assets that cannot be linked to a canonical SEO page."
            />
          </div>

          {/* AI output quality */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
              AI output quality
            </div>
            <QualityIssueRow
              label="AI results pending human review"
              count={stats.aiResultsPendingReview}
              severity="critical"
              description="AI outputs that have been generated but not yet reviewed by a human. Must be reviewed before use in any decision."
            />
            <QualityIssueRow
              label="AI results with low confidence (&lt;60%)"
              count={stats.aiResultsLowConfidence}
              severity="warning"
              description="AI outputs below the 60% confidence threshold. These carry higher uncertainty and require additional verification."
            />
          </div>

          {/* Opportunity quality */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
              Opportunity quality
            </div>
            <QualityIssueRow
              label="Opportunities without quality score"
              count={stats.opportunitiesNoQualityScore}
              severity="info"
              description="Opportunities that have not yet been assessed for data completeness."
            />
          </div>

          {/* Documents */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
              Documents
            </div>
            <QualityIssueRow
              label="Documents under review"
              count={stats.unverifiedDocs}
              severity="warning"
              description="Application documents that have been uploaded but not yet reviewed or verified."
            />
          </div>

          {/* Data quality principles */}
          <div className="border border-border rounded-sm overflow-hidden lg:col-span-2">
            <div className="px-5 py-3 border-b border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
              Data quality standards
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'VERIFIED',  dot: 'bg-emerald-500', desc: 'Confirmed by document, human review, or authoritative source. Highest reliability.' },
                  { label: 'KNOWN',     dot: 'bg-blue-400',    desc: 'Provided by user or extracted from a reliable source. Not independently verified.' },
                  { label: 'INFERRED',  dot: 'bg-amber-400',   desc: 'AI-generated or logically deduced. Requires verification before use in finance decisions.' },
                ].map((s) => (
                  <div key={s.label} className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${s.dot}`} />
                    <div>
                      <p className="text-xs font-medium text-text-primary mb-1">{s.label}</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
