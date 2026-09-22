import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'
import { requireBusinessMembership } from '@/lib/auth/context'

export default async function AccountAssetsPage() {
  const { businessId } = await requireBusinessMembership()

  const applications = db
    ? await db.financeApplication.findMany({
        where: { businessId },
        include: {
          asset: {
            include: { category: true, manufacturer: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const assets = applications.map((a) => a.asset).filter(Boolean)

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
            EQUIPMENT PORTFOLIO
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight">Business Assets</h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
            Equipment, commercial machinery, and vehicles financed or currently in appraisal.
          </p>
        </div>
        <div>
          <Link
            href="/apply"
            className="inline-block bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white px-4 py-2 text-xs uppercase font-mono tracking-wider transition-colors"
          >
            + Add equipment
          </Link>
        </div>
      </div>

      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d]">
        {assets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-on-dark-muted)]">
              No equipment or assets registered yet.
            </p>
            <div className="mt-4">
              <Link
                href="/apply"
                className="inline-block bg-[#161616] hover:bg-[#202020] border border-[var(--color-border-dark)] px-4 py-2 text-xs uppercase tracking-wider text-white"
              >
                Register an asset enquiry &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)] text-[10px] uppercase font-mono bg-[#111111]">
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {assets.map((asset) => (
                  <tr key={asset!.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{asset!.name}</td>
                    <td className="py-3 px-4 text-[var(--color-text-on-dark-2)]">
                      {asset!.category?.name ?? 'Commercial'}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-on-dark-muted)]">
                      {asset!.condition} {asset!.yearOfManufacture ? `(${asset!.yearOfManufacture})` : ''}
                    </td>
                    <td className="py-3 px-4 font-mono text-white">
                      £{Number(asset!.purchasePrice).toLocaleString('en-GB')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                        {asset!.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--color-text-on-dark-muted)] font-mono">
                      {new Date(asset!.createdAt).toLocaleDateString('en-GB')}
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
