import React from 'react'
import Link from 'next/link'
import { calculateDataReadiness } from '@/lib/data/readiness'

export const dynamic = 'force-dynamic'

export default async function DataReadinessPage() {
  const report = await calculateDataReadiness()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light tracking-tight text-white">Data Readiness & Production Gate</h1>
            <span
              className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded ${
                report.isProductionPublishable
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
              }`}
            >
              {report.isProductionPublishable ? 'Production Publishable' : 'Publication Blocked'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1.5 font-mono">
            Auditing record existence vs. verified provenance vs. commercial operational eligibility
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light text-white font-mono">{report.overallReadinessScore}%</div>
          <div className="text-[11px] text-[var(--color-text-on-dark-muted)] font-mono">
            Audited {new Date(report.generatedAt).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Operational Principles Alert */}
      <div className="bg-[#111111] border border-white/10 rounded-lg p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A1A] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]" />
          Controlled Operational Standard
        </div>
        <p className="text-xs text-[var(--color-text-on-dark-2)] leading-relaxed">
          TAFM enforces strict multi-state entity readiness. An asset, manufacturer, provider, or market price record
          must have verified primary provenance before being indexed or used in deterministic finance calculations.
          Provisional or synthetic data is strictly prohibited from generating public borrower quotes or commercial valuations.
        </p>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {report.domains.map((d) => (
          <div
            key={d.domain}
            className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 flex flex-col justify-between hover:border-white/20 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-sm font-medium text-white">{d.domain}</span>
                <span
                  className={`text-xs font-mono font-medium ${
                    d.readinessPercentage >= 70
                      ? 'text-emerald-400'
                      : d.readinessPercentage >= 40
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {d.readinessPercentage}% Ready
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    d.readinessPercentage >= 70
                      ? 'bg-emerald-500'
                      : d.readinessPercentage >= 40
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${d.readinessPercentage}%` }}
                />
              </div>

              {/* Counts Breakdown */}
              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[var(--color-text-on-dark-2)]">
                  <span>Total Records:</span>
                  <span className="text-white">{d.totalRecords}</span>
                </div>
                <div className="flex justify-between text-emerald-400/90">
                  <span>Verified:</span>
                  <span>{d.verifiedRecords}</span>
                </div>
                <div className="flex justify-between text-amber-400/90">
                  <span>Provisional:</span>
                  <span>{d.provisionalRecords}</span>
                </div>
                <div className="flex justify-between text-red-400/90">
                  <span>Unknown / Unverified:</span>
                  <span>{d.unknownRecords}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-on-dark-muted)]">
                  <span>Missing Provenance:</span>
                  <span>{d.missingProvenance}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-on-dark-muted)]">
                  <span>Publication Blocked:</span>
                  <span className={d.blockedFromPublication > 0 ? 'text-amber-400' : 'text-white'}>
                    {d.blockedFromPublication}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-[var(--color-text-on-dark-muted)]">
                {d.requiringReview} require action
              </span>
              {d.requiringReview > 0 ? (
                <span className="text-amber-400 font-mono">Needs review</span>
              ) : (
                <span className="text-emerald-400 font-mono">Nominal</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Notes & Gate Issues */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-medium text-white tracking-wide uppercase font-mono">
          Gate Conditions & Publication Status
        </h2>
        {report.summaryNotes.length > 0 ? (
          <ul className="space-y-2">
            {report.summaryNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-amber-300 font-mono">
                <span className="text-amber-500 font-bold">&bull;</span>
                {note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-emerald-400 font-mono">
            &check; All domains meet the baseline verified threshold for controlled production operation.
          </p>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono">
          <Link
            href="/admin/import"
            className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-colors"
          >
            Import Verified Data &rarr;
          </Link>
          <Link
            href="/admin/providers"
            className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-colors"
          >
            Manage Providers &rarr;
          </Link>
          <Link
            href="/admin/market-data"
            className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-colors"
          >
            Review Market Observations &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
