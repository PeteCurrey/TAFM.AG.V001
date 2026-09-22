import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'
import { requireBusinessMembership } from '@/lib/auth/context'

export default async function AccountPage() {
  const { user, businessId } = await requireBusinessMembership()

  const business = db
    ? await db.business.findUnique({
        where: { id: businessId },
        include: {
          opportunities: {
            include: {
              asset: { include: { category: true } },
              application: true,
              providerMatches: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          applications: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    : null

  const opportunities = business?.opportunities ?? []
  const applications = business?.applications ?? []

  const activeOpps = opportunities.filter((o) => !['COMPLETED', 'DECLINED', 'WITHDRAWN'].includes(o.status))

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
            BUSINESS WORKSPACE
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight">
            {business?.name ?? 'My Business'}
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
            Structure: <span className="font-mono text-white">{business?.structure?.replace('_', ' ') ?? 'Limited Company'}</span> &middot; 
            Account: <span className="font-mono text-emerald-400">{user.email}</span>
          </p>
        </div>
        <div>
          <Link
            href="/apply"
            className="inline-block bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white px-4 py-2 text-xs uppercase font-mono tracking-wider transition-colors"
          >
            + New finance request
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Active opportunities</p>
          <p className="text-2xl font-light text-white mt-1 font-mono">{activeOpps.length}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Applications submitted</p>
          <p className="text-2xl font-light text-white mt-1 font-mono">{applications.length}</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[var(--color-border-dark)]">
          <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-wider">Potential provider matches</p>
          <p className="text-2xl font-light text-[#FF6A1A] mt-1 font-mono">
            {opportunities.reduce((acc, o) => acc + o.providerMatches.length, 0)}
          </p>
        </div>
      </div>

      {/* Active Opportunities Section */}
      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] mb-8">
        <div className="p-4 border-b border-[var(--color-border-dark)] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white tracking-wide">
            Your Active Opportunities
          </h2>
          <Link href="/account/opportunities" className="text-xs text-[#FF6A1A] hover:underline font-mono">
            View all &rarr;
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-on-dark-muted)]">
              You do not have any active finance requests yet.
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
          <div className="divide-y divide-[var(--color-border-dark)]">
            {opportunities.slice(0, 5).map((opp) => {
              const app = opp.application
              const asset = opp.asset
              return (
                <div key={opp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-white font-semibold">{opp.reference}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-950/60 border border-blue-800/40 text-blue-300">
                        {opp.status}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-on-dark-2)]">
                      {asset?.name ?? 'Commercial Equipment'}
                    </p>
                    <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-0.5 font-mono">
                      Facility: £{Number(app?.requestedAmount ?? asset?.purchasePrice ?? 0).toLocaleString('en-GB')} &middot; {app?.requestedStructure?.replace('_', ' ') ?? 'Asset Finance'}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/account/opportunities/${opp.id}`}
                      className="inline-block bg-[#161616] hover:bg-[#202020] border border-[var(--color-border-dark)] px-3 py-1.5 text-xs text-white font-mono"
                    >
                      Track progress &rarr;
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/assets"
          className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-5 hover:border-[#FF6A1A]/40 transition-colors"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-[#FF6A1A] mb-1">Asset Portfolio</p>
          <p className="text-sm font-medium text-white">Business Assets &amp; Machinery</p>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1">
            View registered business assets, acquisition values, and finance records.
          </p>
        </Link>
        <Link
          href="/account/finance"
          className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-5 hover:border-[#FF6A1A]/40 transition-colors"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-[#FF6A1A] mb-1">Applications</p>
          <p className="text-sm font-medium text-white">Finance Enquiries &amp; Applications</p>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1">
            Monitor formal finance applications, submitted steps, and lender decisions.
          </p>
        </Link>
      </div>
    </div>
  )
}
