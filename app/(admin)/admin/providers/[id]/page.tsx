// app/(admin)/admin/providers/[id]/page.tsx
import { db } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import { scoreLenderQuality } from '@/lib/data/quality'
import { ProviderVerificationPanel } from '@/components/admin/ProviderVerificationPanel'
import { ProviderCriteriaEditor } from '@/components/admin/ProviderCriteriaEditor'
import Link from 'next/link'

export const revalidate = 0

interface Props { params: Promise<{ id: string }> }

const DataBar = ({ score, label }: { score: number; label: string }) => {
  const filled = Math.round(score * 10)
  const empty = 10 - filled
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--color-text-on-dark-muted)] w-24 shrink-0">{label}</span>
      <span className="font-mono text-xs text-[#FF6A1A] tracking-tight">
        {'█'.repeat(filled)}{'░'.repeat(empty)}
      </span>
      <span className="text-xs text-[var(--color-text-on-dark-muted)] font-mono">{Math.round(score * 100)}%</span>
    </div>
  )
}

export default async function AdminProviderDetailPage({ params }: Props) {
  const { id } = await params

  if (!db) {
    notFound()
  }

  const lender = await db.lender.findUnique({
    where: { id },
    include: {
      criteria:         true,
      criteriaVersions: { orderBy: { versionNumber: 'desc' } },
      financeProducts:  { where: { isActive: true } },
      memberships:      { include: { user: true } },
      opportunityMatches: {
        include: { opportunity: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!lender) notFound()

  const quality = await scoreLenderQuality(id)
  const activeVersion = lender.criteriaVersions.find(v => v.isActive)

  return (
    <div className="p-8 max-w-6xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-on-dark-muted)]">
        <Link href="/admin/providers" className="hover:text-white">
          Providers
        </Link>
        <span>/</span>
        <span className="text-white">{lender.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--color-border-dark)] pb-6">
        <div>
          <span className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">
            PROVIDER PROFILE &middot; {lender.slug}
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-1">
            {lender.tradingName ?? lender.name}
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-mono">
            Type: {lender.lenderType.replace(/_/g, ' ')} &middot;{' '}
            Status: <span className="text-emerald-400">{lender.status}</span> &middot;{' '}
            Verification:{' '}
            <span className={
              lender.verificationStatus === 'VERIFIED' ? 'text-emerald-400' :
              lender.verificationStatus === 'PROVISIONAL' ? 'text-amber-400' : 'text-zinc-500'
            }>
              {lender.verificationStatus}
            </span>
            {lender.isPubliclyListed ? ' · Publicly listed' : ' · Hidden'}
          </p>
        </div>
        {lender.website && (
          <a
            href={lender.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs text-[var(--color-text-on-dark-muted)] border border-[var(--color-border-dark)] px-3 py-2 hover:text-white transition-colors"
          >
            Website ↗
          </a>
        )}
      </div>

      {/* Verification Panel */}
      <ProviderVerificationPanel lender={lender} />

      {/* Criteria Editor */}
      <ProviderCriteriaEditor
        lenderId={lender.id}
        initialCriteria={
          lender.criteria
            ? {
                minAmount: Number(lender.criteria.minAmount),
                maxAmount: Number(lender.criteria.maxAmount),
                minTermMonths: lender.criteria.minTermMonths,
                maxTermMonths: lender.criteria.maxTermMonths,
                geographyUKOnly: lender.criteria.geographyUKOnly,
                newAssetsOnly: lender.criteria.newAssetsOnly,
                usedAssetsConsidered: lender.criteria.usedAssetsConsidered,
                maxAssetAgeYears: lender.criteria.maxAssetAgeYears,
                minBusinessAgeMonths: lender.criteria.minBusinessAgeMonths,
                minAnnualTurnover: lender.criteria.minAnnualTurnover ? Number(lender.criteria.minAnnualTurnover) : null,
                assetCategories: lender.criteria.assetCategories,
                financeStructures: lender.criteria.financeStructures,
                businessTypes: lender.criteria.businessTypes,
              }
            : null
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Criteria version history */}
        <div className="lg:col-span-2 space-y-6">
          <section className="border border-[var(--color-border-dark)] bg-[#0d0d0d]">
            <div className="px-5 py-4 border-b border-[var(--color-border-dark)]">
              <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-on-dark-muted)]">
                Criteria Version History
              </h2>
              <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1">
                Immutable audit trail — snapshots capture exactly what criteria applied to past matches.
              </p>
            </div>
            <div className="divide-y divide-[var(--color-border-dark)]">
              {lender.criteriaVersions.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--color-text-on-dark-muted)]">
                  No criteria versions saved yet.
                </div>
              ) : (
                lender.criteriaVersions.map((version) => (
                  <div key={version.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-mono font-medium">v{version.versionNumber}</span>
                        {version.isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1">
                        Effective from {new Date(version.effectiveFrom).toLocaleDateString('en-GB')}
                        {version.effectiveTo && ` to ${new Date(version.effectiveTo).toLocaleDateString('en-GB')}`}
                      </p>
                      {version.reason && (
                        <p className="text-xs text-[var(--color-text-on-dark-2)] mt-1 italic">
                          "{version.reason}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--color-text-on-dark-muted)] uppercase">
                      Source: {version.source ?? 'ADMIN'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right — Data quality & metadata */}
        <div className="space-y-6">
          <section className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-5">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-on-dark-muted)] mb-4">
              Data Quality Score
            </h2>
            <div className="space-y-3">
              <DataBar score={quality?.overall ?? 0} label="Overall" />
              <DataBar score={quality?.identity.score ?? 0} label="Identity" />
              <DataBar score={quality?.specification.score ?? 0} label="Criteria" />
              <DataBar score={quality?.sourceQuality.score ?? 0} label="Sources" />
              <DataBar score={quality?.verification.score ?? 0} label="Verification" />
            </div>
          </section>

          <section className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-5 text-xs space-y-3">
            <h3 className="font-mono uppercase text-[var(--color-text-on-dark-muted)]">Record Metadata</h3>
            <div>
              <span className="text-[var(--color-text-on-dark-muted)]">Record ID:</span>
              <p className="font-mono text-white mt-0.5">{lender.id}</p>
            </div>
            <div>
              <span className="text-[var(--color-text-on-dark-muted)]">Created:</span>
              <p className="text-white mt-0.5 font-mono">{new Date(lender.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <span className="text-[var(--color-text-on-dark-muted)]">Recent Matches:</span>
              <p className="text-[#FF6A1A] mt-0.5 font-mono">{lender.opportunityMatches.length} opportunities</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
