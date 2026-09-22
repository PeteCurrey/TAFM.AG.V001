import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db/client'
import { requireBusinessMembership } from '@/lib/auth/context'

export default async function AccountOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { businessId } = await requireBusinessMembership()
  const { id } = await params

  if (!db) {
    return notFound()
  }

  // Strict business isolation: can ONLY view if opportunity belongs to this business
  const opp = await db.opportunity.findFirst({
    where: {
      id,
      businessId,
    },
    include: {
      asset: {
        include: {
          category: true,
          manufacturer: true,
        },
      },
      application: true,
      providerMatches: true,
    },
  })

  if (!opp) {
    notFound()
  }

  const asset = opp.asset
  const app = opp.application
  const history = (opp.statusHistory as Array<{ from: string; to: string; at: string; reason?: string }>) || []

  // Aggregate provider states without exposing competing identities or internal notes
  const matches = opp.providerMatches
  const providerSummary = {
    total: matches.length,
    reviewing: matches.filter((m) => m.matchStatus === 'REVIEWING').length,
    interested: matches.filter((m) => m.matchStatus === 'INTERESTED').length,
    offered: matches.filter((m) => m.matchStatus === 'OFFERED').length,
    declined: matches.filter((m) => m.matchStatus === 'DECLINED').length,
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[var(--color-text-on-dark-muted)]">
        <Link href="/account/opportunities" className="hover:text-white">
          Opportunities
        </Link>
        <span>/</span>
        <span className="text-white">{opp.reference}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border-dark)]">
        <div>
          <span className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">
            FINANCE REQUIREMENT
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-1">
            {asset?.name ?? 'Commercial Asset Acquisition'}
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-mono">
            Ref: {opp.reference} &middot; Created on {new Date(opp.createdAt).toLocaleDateString('en-GB')}
          </p>
        </div>
        <div>
          <span className="px-3 py-1 text-xs font-mono uppercase bg-blue-950/60 border border-blue-800/40 text-blue-300">
            {opp.status}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Marketplace Matching Status Card */}
        <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#FF6A1A] mb-2">
            Marketplace Provider Routing
          </h2>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mb-4">
            TAFM has routed this requirement through our deterministic credit-matching engine.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)]">
              <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase">Matched Lenders</p>
              <p className="text-xl font-light text-white mt-1 font-mono">{providerSummary.total}</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)]">
              <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase">Under Review</p>
              <p className="text-xl font-light text-blue-400 mt-1 font-mono">{providerSummary.reviewing}</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)]">
              <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase">Indications</p>
              <p className="text-xl font-light text-purple-400 mt-1 font-mono">{providerSummary.interested}</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)]">
              <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase">Formal Offers</p>
              <p className="text-xl font-light text-emerald-400 mt-1 font-mono">{providerSummary.offered}</p>
            </div>
          </div>
        </div>

        {/* Asset & Requirement Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-4">
              Asset Specifications
            </h3>
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Description</dt>
                <dd className="text-white font-medium mt-0.5">{asset?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Category</dt>
                <dd className="text-white mt-0.5">{asset?.category?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Valuation / Value</dt>
                <dd className="text-white font-mono mt-0.5">
                  £{Number(asset?.purchasePrice ?? app?.assetValue ?? 0).toLocaleString('en-GB')}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Condition</dt>
                <dd className="text-white mt-0.5">{asset?.condition ?? '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-4">
              Finance Structure
            </h3>
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Requested Structure</dt>
                <dd className="text-white font-medium mt-0.5">
                  {app?.requestedStructure?.replace('_', ' ') ?? 'Standard'}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Facility Amount</dt>
                <dd className="text-white font-mono mt-0.5">
                  £{Number(app?.requestedAmount ?? 0).toLocaleString('en-GB')}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Requested Term</dt>
                <dd className="text-white font-mono mt-0.5">{app?.requestedTermMonths ?? 36} months</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-on-dark-muted)]">Deposit Amount</dt>
                <dd className="text-white font-mono mt-0.5">
                  £{Number(app?.requestedDepositAmount ?? 0).toLocaleString('en-GB')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Timeline & Status History */}
        <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-4">
            Application Audit Timeline
          </h3>
          <div className="space-y-4">
            {history.map((h, i) => (
              <div key={i} className="flex items-start gap-4 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">
                    Status updated to <span className="font-mono text-[#FF6A1A] uppercase">{h.to}</span>
                  </p>
                  {h.reason && (
                    <p className="text-[var(--color-text-on-dark-muted)] mt-0.5">{h.reason}</p>
                  )}
                  <p className="text-[10px] text-[var(--color-text-on-dark-muted)] opacity-60 font-mono mt-1">
                    {new Date(h.at).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
