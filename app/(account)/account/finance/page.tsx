import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'
import { requireBusinessMembership } from '@/lib/auth/context'

export default async function AccountFinancePage() {
  const { businessId } = await requireBusinessMembership()

  const applications = db
    ? await db.financeApplication.findMany({
        where: { businessId },
        include: {
          asset: true,
          offers: {
            include: { lender: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
            FINANCIAL ENQUIRIES
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight">Finance Requests</h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
            Formal financing applications and submitted underwriting requests.
          </p>
        </div>
        <div>
          <Link
            href="/apply"
            className="inline-block bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white px-4 py-2 text-xs uppercase font-mono tracking-wider transition-colors"
          >
            + New application
          </Link>
        </div>
      </div>

      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d]">
        {applications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-on-dark-muted)]">
              No finance applications submitted yet.
            </p>
            <div className="mt-4">
              <Link
                href="/apply"
                className="inline-block bg-[#161616] hover:bg-[#202020] border border-[var(--color-border-dark)] px-4 py-2 text-xs uppercase tracking-wider text-white"
              >
                Apply for finance &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)] text-[10px] uppercase font-mono bg-[#111111]">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Asset Value</th>
                  <th className="py-3 px-4">Requested Facility</th>
                  <th className="py-3 px-4">Structure</th>
                  <th className="py-3 px-4">Application Status</th>
                  <th className="py-3 px-4">Offers</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-white">{app.reference}</td>
                    <td className="py-3 px-4 font-mono text-white">
                      £{Number(app.assetValue).toLocaleString('en-GB')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#FF6A1A]">
                      £{Number(app.requestedAmount).toLocaleString('en-GB')}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-on-dark-muted)]">
                      {app.requestedStructure?.replace('_', ' ') ?? 'Standard'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-950/60 border border-blue-800/40 text-blue-300">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {app.offers.length} offer{app.offers.length === 1 ? '' : 's'}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--color-text-on-dark-muted)] font-mono">
                      {new Date(app.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
