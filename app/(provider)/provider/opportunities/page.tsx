import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'
import { requireProviderMembership } from '@/lib/auth/context'

export default async function ProviderOpportunitiesListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { lenderId } = await requireProviderMembership()
  const { status: filterStatus } = await searchParams

  const matches = db
    ? await db.opportunityProvider.findMany({
        where: {
          lenderId,
          ...(filterStatus ? { matchStatus: filterStatus } : {}),
        },
        include: {
          opportunity: {
            include: {
              asset: { include: { category: true } },
              application: true,
              business: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'New Matches', value: 'MATCHED' },
    { label: 'Reviewing', value: 'REVIEWING' },
    { label: 'Info Requested', value: 'INFORMATION_REQUESTED' },
    { label: 'Interested', value: 'INTERESTED' },
    { label: 'Offered', value: 'OFFERED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Declined', value: 'DECLINED' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
          OPPORTUNITY PIPELINE
        </p>
        <h1 className="text-2xl font-light text-white tracking-tight">Matched Opportunities</h1>
        <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
          Opportunities deterministically matched to your current credit appetite and eligibility criteria.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-[var(--color-border-dark)] pb-4">
        {statusOptions.map((opt) => {
          const isActive = (filterStatus ?? '') === opt.value
          return (
            <Link
              key={opt.value}
              href={opt.value ? `/provider/opportunities?status=${opt.value}` : '/provider/opportunities'}
              className={`px-3 py-1 text-xs uppercase font-mono transition-colors ${
                isActive
                  ? 'bg-[#FF6A1A] text-white'
                  : 'bg-[#121212] text-[var(--color-text-on-dark-2)] hover:text-white border border-[var(--color-border-dark)]'
              }`}
            >
              {opt.label}
            </Link>
          )
        })}
      </div>

      {/* List */}
      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d]">
        {matches.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-on-dark-muted)]">
              No opportunities found matching this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)] text-[10px] uppercase font-mono bg-[#111111]">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Asset & Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Structure</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {matches.map((m) => {
                  const opp = m.opportunity
                  const app = opp.application
                  const asset = opp.asset
                  return (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-white">
                        <span className="font-semibold">{opp.reference}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-white font-medium">{asset?.name ?? 'Business Asset'}</p>
                        <p className="text-[11px] text-[var(--color-text-on-dark-muted)] font-mono">
                          {asset?.category?.name ?? 'Commercial Equipment'}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-mono text-white">
                        £{Number(app?.requestedAmount ?? asset?.purchasePrice ?? 0).toLocaleString('en-GB')}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-on-dark-muted)]">
                        {app?.requestedStructure?.replace('_', ' ') ?? 'Standard'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase ${
                          m.matchStatus === 'MATCHED' ? 'bg-orange-950/60 text-[#FF6A1A] border border-orange-800/40' :
                          m.matchStatus === 'INTERESTED' ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40' :
                          m.matchStatus === 'OFFERED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' :
                          m.matchStatus === 'DECLINED' ? 'bg-zinc-900 text-zinc-400' :
                          'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        }`}>
                          {m.matchStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-on-dark-muted)] font-mono">
                        {new Date(m.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/provider/opportunities/${opp.id}`}
                          className="text-[#FF6A1A] hover:underline font-mono"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
