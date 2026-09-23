import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOpportunityMatchingDiagnostics } from '@/lib/matching/diagnostics'
import { db } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

async function getAuditHistory(entityId: string) {
  if (!db) return []
  try {
    return await db.auditLog.findMany({
      where: { entityType: 'Opportunity', entityId },
      orderBy: { createdAt: 'desc' },
      take: 25,
    })
  } catch {
    return []
  }
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [report, auditLogs] = await Promise.all([
    getOpportunityMatchingDiagnostics(id),
    getAuditHistory(id),
  ])

  if (!report) notFound()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-on-dark-muted)]">
        <Link href="/admin/opportunities" className="hover:text-white">
          Opportunities
        </Link>
        <span>/</span>
        <span className="text-white">{report.reference}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light tracking-tight text-white">
              Opportunity Operational Control Centre
            </h1>
            <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
              {report.status}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1.5 font-mono">
            Ref: {report.reference} &middot; Ingested {new Date(report.createdAt).toLocaleString('en-GB')}
          </p>
        </div>
      </div>

      {/* Commercial Entity Triad (Business, Asset, Application) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Business */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6A1A]">
              1. Business Profile
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-on-dark-muted)]">
              {report.business?.structure?.replace('_', ' ') ?? 'Entity'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-sm font-medium text-white">{report.business?.name ?? '—'}</p>
            <p className="text-[var(--color-text-on-dark-muted)] font-mono">
              Co. No: {report.business?.companyNumber ?? 'Unverified'}
            </p>
            <div className="pt-2 text-[var(--color-text-on-dark-2)] space-y-1">
              <div className="flex justify-between">
                <span>Trading History:</span>
                <span className="text-white font-mono">{report.business?.yearsTrading ?? '—'} yrs</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Turnover:</span>
                <span className="text-white font-mono">
                  £{report.business?.annualTurnover?.toLocaleString('en-GB') ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6A1A]">
              2. Collateral Asset
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {report.asset?.status ?? 'ACTIVE'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-sm font-medium text-white">{report.asset?.name ?? '—'}</p>
            <p className="text-[var(--color-text-on-dark-muted)] font-mono">
              {report.asset?.manufacturer} &middot; {report.asset?.category}
            </p>
            <div className="pt-2 text-[var(--color-text-on-dark-2)] space-y-1">
              <div className="flex justify-between">
                <span>Year:</span>
                <span className="text-white font-mono">{report.asset?.year ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span>Declared Value:</span>
                <span className="text-white font-mono">
                  £{report.asset?.value?.toLocaleString('en-GB') ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Facility Requirement */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6A1A]">
              3. Finance Facility
            </span>
            <span className="text-[10px] font-mono text-blue-400">
              {report.application?.structure?.replace('_', ' ') ?? 'Standard'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-lg font-mono text-white font-light">
              £{report.application?.requestedAmount?.toLocaleString('en-GB') ?? '—'}
            </p>
            <div className="pt-2 text-[var(--color-text-on-dark-2)] space-y-1">
              <div className="flex justify-between">
                <span>Requested Term:</span>
                <span className="text-white font-mono">{report.application?.termMonths ?? '—'} months</span>
              </div>
              <div className="flex justify-between">
                <span>Proposed Deposit:</span>
                <span className="text-white font-mono">
                  £{report.application?.depositAmount?.toLocaleString('en-GB') ?? '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deterministic Matching Diagnostics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white tracking-wide uppercase font-mono">
            Deterministic Provider Matching Diagnostics
          </h2>
          <span className="text-xs font-mono text-[var(--color-text-on-dark-muted)]">
            {report.matchedProviders.length} Matched &middot; {report.disqualifiedProviders.length} Disqualified
          </span>
        </div>

        {/* Matched Providers */}
        <div className="space-y-3">
          {report.matchedProviders.map((match) => (
            <div
              key={match.lenderId}
              className="bg-[#0D0D0D] border border-emerald-800/40 rounded-lg p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-white">{match.lenderName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 rounded">
                    Criteria v{match.criteriaVersion}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[var(--color-text-on-dark-muted)]">Provider Response:</span>
                  <span className="text-emerald-400 uppercase font-medium">{match.matchStatus}</span>
                </div>
              </div>

              {/* Factors Evaluated */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {match.factors.map((f, idx) => (
                  <div key={idx} className="p-2.5 bg-black/40 border border-white/5 rounded">
                    <div className="text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)]">
                      {f.label}
                    </div>
                    <div
                      className={`text-[11px] font-mono mt-1 ${
                        f.status === 'ELIGIBLE' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      &check; {f.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Disqualified Providers */}
          {report.disqualifiedProviders.length > 0 && (
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)]">
                Disqualified Lenders ({report.disqualifiedProviders.length})
              </h3>
              {report.disqualifiedProviders.map((disq) => (
                <div
                  key={disq.lenderId}
                  className="bg-[#0A0A0A] border border-white/5 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="text-white font-medium">{disq.lenderName}</span>
                    <p className="text-[var(--color-text-on-dark-muted)] text-[11px] mt-0.5 font-mono">
                      Reason: {disq.blockers.join('; ') || 'Criteria appetite out of range'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-red-950/50 border border-red-800/40 text-red-400 text-[10px] font-mono rounded self-start sm:self-auto">
                    DISQUALIFIED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Underwriting Information Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white tracking-wide uppercase font-mono">
            Underwriting Information Requests ({report.informationRequests.length})
          </h2>
        </div>

        {report.informationRequests.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 text-xs text-[var(--color-text-on-dark-muted)] font-mono">
            No information requests have been logged for this facility.
          </div>
        ) : (
          <div className="space-y-3">
            {report.informationRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="font-mono text-white">Issued by {req.lenderName}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded ${
                      req.status === 'RESPONDED'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <div className="text-[var(--color-text-on-dark-2)]">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)]">Request:</span>
                  <p className="mt-0.5 text-white">{req.notes}</p>
                </div>
                {req.borrowerResponse && (
                  <div className="bg-black/40 p-3 rounded border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-emerald-400">Borrower Response:</span>
                    <p className="text-white">{req.borrowerResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status History & Audit Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] pb-2 border-b border-white/5">
            Status Transition History
          </h3>
          {report.timeline.length === 0 ? (
            <p className="text-xs text-[var(--color-text-on-dark-muted)] italic">No transitions recorded.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {report.timeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-mono text-white">{entry.from} &rarr; {entry.to}</span>
                    {entry.reason && (
                      <p className="text-[11px] text-[var(--color-text-on-dark-muted)] mt-0.5">{entry.reason}</p>
                    )}
                    <span className="text-[10px] font-mono text-[var(--color-text-on-dark-muted)] opacity-60">
                      {new Date(entry.at).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] pb-2 border-b border-white/5">
            Audit Trail
          </h3>
          {auditLogs.length === 0 ? (
            <p className="text-xs text-[var(--color-text-on-dark-muted)] italic">No audit records.</p>
          ) : (
            <div className="space-y-2.5 text-xs max-h-60 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="font-mono text-white text-[11px]">{log.action}</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-on-dark-muted)]">
                    {new Date(log.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
