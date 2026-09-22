import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'
import { requireProviderMembership } from '@/lib/auth/context'

export default async function ProviderDashboardPage() {
  const { user, lenderId, role } = await requireProviderMembership()

  const provider = db
    ? await db.lender.findUnique({
        where: { id: lenderId },
        include: {
          criteria: true,
          opportunityMatches: {
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
          },
        },
      })
    : null

  const matches = provider?.opportunityMatches ?? []

  const stats = {
    total: matches.length,
    matched: matches.filter((m) => m.matchStatus === 'MATCHED').length,
    reviewing: matches.filter((m) => m.matchStatus === 'REVIEWING').length,
    interested: matches.filter((m) => m.matchStatus === 'INTERESTED').length,
    offered: matches.filter((m) => m.matchStatus === 'OFFERED').length,
    completed: matches.filter((m) => m.matchStatus === 'COMPLETED').length,
    declined: matches.filter((m) => m.matchStatus === 'DECLINED').length,
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
            PROVIDER WORKSPACE
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight">
            {provider?.name ?? 'Provider Organisation'}
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
            Status: <span className="text-emerald-400 font-mono">{provider?.status ?? 'ACTIVE'}</span> &middot; 
            Role: <span className="text-white font-mono">{role}</span> &middot; 
            FCA: <span className="font-mono">{provider?.fcaReference ?? 'Pending'}</span>
          </p>
        </div>
        <div>
          <Link
            href="/provider/opportunities"
            className="inline-block bg-[#161616] hover:bg-[#202020] border border-[var(--color-border-dark)] px-4 py-2 text-xs uppercase tracking-wider text-white transition-colors"
          >
            View all opportunities &rarr;
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">New matches</p>
          <p className="text-2xl font-light text-[#FF6A1A] mt-1 font-mono">{stats.matched}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Under review</p>
          <p className="text-2xl font-light text-blue-400 mt-1 font-mono">{stats.reviewing}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Interested</p>
          <p className="text-2xl font-light text-purple-400 mt-1 font-mono">{stats.interested}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Offered</p>
          <p className="text-2xl font-light text-amber-400 mt-1 font-mono">{stats.offered}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-light text-emerald-400 mt-1 font-mono">{stats.completed}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Declined</p>
          <p className="text-2xl font-light text-[var(--color-text-on-dark-muted)] mt-1 font-mono">{stats.declined}</p>
        </div>
      </div>

      {/* Recent Matched Opportunities Table */}
      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d]">
        <div className="p-4 border-b border-[var(--color-border-dark)] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white tracking-wide">
            Recent Matched Opportunities
          </h2>
          <span className="text-[11px] text-[var(--color-text-on-dark-muted)] font-mono">
            {matches.length} total matched
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-on-dark-muted)]">
              No opportunities currently matched to your criteria.
            </p>
            <p className="text-xs text-[var(--color-text-on-dark-muted)] opacity-60 mt-1">
              New business finance submissions will be matched deterministically against your configured criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)] text-[10px] uppercase font-mono bg-[#111111]">
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Structure</th>
                  <th className="py-3 px-4">Match Status</th>
                  <th className="py-3 px-4">Matched Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {matches.slice(0, 10).map((m) => {
                  const opp = m.opportunity
                  const app = opp.application
                  const asset = opp.asset
                  return (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-white">{opp.reference}</td>
                      <td className="py-3 px-4 text-[var(--color-text-on-dark-2)]">
                        {asset?.name ?? 'Business Asset'}
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
                          Review &rarr;
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
