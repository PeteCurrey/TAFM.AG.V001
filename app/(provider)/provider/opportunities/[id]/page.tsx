import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db/client'
import { requireProviderMembership } from '@/lib/auth/context'
import { ProviderResponseActions } from '@/components/provider/ProviderResponseActions'
import { ProviderInformationRequestManager } from '@/components/provider/ProviderInformationRequestManager'

export default async function ProviderOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { lenderId } = await requireProviderMembership()
  const { id: opportunityId } = await params

  if (!db) {
    return notFound()
  }

  // Strict RLS: query must match BOTH opportunityId AND the authenticated lenderId
  const match = await db.opportunityProvider.findUnique({
    where: {
      opportunityId_lenderId: {
        opportunityId,
        lenderId,
      },
    },
    include: {
      opportunity: {
        include: {
          asset: {
            include: {
              category: true,
              manufacturer: true,
            },
          },
          application: true,
          business: true,
        },
      },
      criteriaVersion: true,
    },
  })

  if (!match) {
    notFound()
  }

  const opp = match.opportunity
  const asset = opp.asset
  const app = opp.application
  const biz = opp.business
  const evalResult = match.eligibilityResult as Record<string, unknown>
  const factors = (evalResult?.factors as Array<{ field: string; label: string; status: string; reason: string }>) || []

  const infoRequests = await db.informationRequest.findMany({
    where: {
      opportunityId,
      lenderId,
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="p-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[var(--color-text-on-dark-muted)]">
        <Link href="/provider/opportunities" className="hover:text-white">
          Opportunities
        </Link>
        <span>/</span>
        <span className="text-white">{opp.reference}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border-dark)]">
        <div>
          <span className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">
            MATCHED OPPORTUNITY
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-1">
            {asset?.name ?? 'Commercial Asset Acquisition'}
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-mono">
            Ref: {opp.reference} &middot; Matched on {new Date(match.createdAt).toLocaleDateString('en-GB')}
          </p>
        </div>
        <div>
          <span className={`px-3 py-1 text-xs font-mono uppercase border ${
            match.matchStatus === 'MATCHED' ? 'bg-orange-950/60 text-[#FF6A1A] border-orange-800/40' :
            match.matchStatus === 'INTERESTED' ? 'bg-purple-950/60 text-purple-300 border-purple-800/40' :
            match.matchStatus === 'OFFERED' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40' :
            match.matchStatus === 'DECLINED' ? 'bg-zinc-900 text-zinc-400 border-zinc-700' :
            'bg-blue-950/60 text-blue-300 border-blue-800/40'
          }`}>
            {match.matchStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Asset & Requirement */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Section */}
          <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-4">
              1. Asset Specifications
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Description</p>
                <p className="text-white font-medium mt-0.5">{asset?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Category</p>
                <p className="text-white font-medium mt-0.5">{asset?.category?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Manufacturer / Make</p>
                <p className="text-white font-medium mt-0.5">{asset?.manufacturer?.name ?? 'Identified from quote'}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Condition & Age</p>
                <p className="text-white font-medium mt-0.5">
                  {asset?.condition ?? '—'} {asset?.yearOfManufacture ? `(${asset.yearOfManufacture})` : ''}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Purchase Price / Asset Value</p>
                <p className="text-white font-mono text-sm mt-0.5">
                  £{Number(asset?.purchasePrice ?? app?.assetValue ?? 0).toLocaleString('en-GB')}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Supplier / Vendor</p>
                <p className="text-white mt-0.5">{app?.supplierName ?? 'Direct dealer purchase'}</p>
              </div>
            </div>
          </div>

          {/* Finance Requirement */}
          <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-4">
              2. Finance Requirement
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Requested Finance Structure</p>
                <p className="text-white font-medium mt-0.5">
                  {app?.requestedStructure?.replace('_', ' ') ?? 'Standard Asset Finance'}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Requested Facility Amount</p>
                <p className="text-white font-mono text-sm mt-0.5">
                  £{Number(app?.requestedAmount ?? 0).toLocaleString('en-GB')}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Deposit Amount</p>
                <p className="text-white font-mono mt-0.5">
                  £{Number(app?.requestedDepositAmount ?? 0).toLocaleString('en-GB')}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Requested Term</p>
                <p className="text-white font-mono mt-0.5">{app?.requestedTermMonths ?? 36} months</p>
              </div>
            </div>
            {app?.notes && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-dark)] text-xs">
                <p className="text-[var(--color-text-on-dark-muted)]">Application Notes</p>
                <p className="text-white mt-1 leading-relaxed">{app.notes}</p>
              </div>
            )}
          </div>

          {/* Business Profile */}
          <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-4">
              3. Business Borrower Profile
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Company Name</p>
                <p className="text-white font-medium mt-0.5">{biz?.name ?? 'Confidential'}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Legal Structure</p>
                <p className="text-white font-medium mt-0.5">{biz?.structure?.replace('_', ' ') ?? '—'}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Trading History</p>
                <p className="text-white font-medium mt-0.5">{biz?.yearsTrading ?? 1}+ years</p>
              </div>
              <div>
                <p className="text-[var(--color-text-on-dark-muted)]">Annual Turnover</p>
                <p className="text-white font-mono mt-0.5">
                  £{Number(biz?.annualTurnover ?? 0).toLocaleString('en-GB')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Matching Rationale & Actions */}
        <div className="space-y-6">
          {/* Matching Rationale */}
          <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-on-dark-muted)] mb-3">
              Matching Audit Rationale
            </h3>
            <p className="text-[11px] text-[var(--color-text-on-dark-muted)] mb-4 leading-relaxed">
              Matched deterministically against Criteria Version {match.criteriaVersion?.versionNumber ?? 1}.
            </p>

            <div className="space-y-2">
              {factors.map((f, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-xs py-1 border-b border-[var(--color-border-dark)] last:border-0">
                  <span className="text-[var(--color-text-on-dark-2)] text-[11px]">{f.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 ${
                    f.status === 'ELIGIBLE' ? 'text-emerald-400 bg-emerald-950/40' :
                    f.status === 'NOT_ELIGIBLE' ? 'text-red-400 bg-red-950/40' :
                    'text-amber-400 bg-amber-950/40'
                  }`}>
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Due Diligence / Information Requests */}
          <ProviderInformationRequestManager
            opportunityId={opp.id}
            requests={infoRequests}
          />

          {/* Action Box */}
          <ProviderResponseActions
            opportunityId={opp.id}
            lenderId={lenderId}
            currentStatus={match.matchStatus}
          />
        </div>
      </div>
    </div>
  )
}
