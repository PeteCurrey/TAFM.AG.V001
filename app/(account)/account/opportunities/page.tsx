import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'
import { requireBusinessMembership } from '@/lib/auth/context'

export default async function AccountOpportunitiesPage() {
  const { businessId } = await requireBusinessMembership()

  const opportunities = db
    ? await db.opportunity.findMany({
        where: { businessId },
        include: {
          asset: { include: { category: true } },
          application: true,
          providerMatches: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
            PORTFOLIO
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight">Finance Opportunities</h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
            Commercial equipment requirements progressing through TAFM matching and provider review.
          </p>
        </div>
        <div>
          <Link
            href="/apply"
            className="inline-block bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white px-4 py-2 text-xs uppercase font-mono tracking-wider transition-colors"
          >
            + New request
          </Link>
        </div>
      </div>

      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d]">
        {opportunities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-on-dark-muted)]">
              No finance opportunities currently registered.
            </p>
            <div className="mt-4">
              <Link
                href="/apply"
                className="inline-block bg-[#161616] hover:bg-[#202020] border border-[var(--color-border-dark)] px-4 py-2 text-xs uppercase tracking-wider text-white"
              >
                Start an application &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)] text-[10px] uppercase font-mono bg-[#111111]">
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Equipment / Asset</th>
                  <th className="py-3 px-4">Required Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Matches</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {opportunities.map((opp) => {
                  const app = opp.application
                  const asset = opp.asset
                  return (
                    <tr key={opp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-white font-medium">{opp.reference}</td>
                      <td className="py-3 px-4">
                        <p className="text-white font-medium">{asset?.name ?? 'Commercial Asset'}</p>
                        <p className="text-[11px] text-[var(--color-text-on-dark-muted)]">{asset?.category?.name ?? 'Equipment'}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-white">
                        £{Number(app?.requestedAmount ?? asset?.purchasePrice ?? 0).toLocaleString('en-GB')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-950/60 border border-blue-800/40 text-blue-300">
                          {opp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#FF6A1A]">
                        {opp.providerMatches.length} providers
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-on-dark-muted)] font-mono">
                        {new Date(opp.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/account/opportunities/${opp.id}`}
                          className="text-[#FF6A1A] hover:underline font-mono"
                        >
                          View timeline &rarr;
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
