// app/(admin)/admin/providers/[id]/page.tsx
import { db } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import { scoreLenderQuality } from '@/lib/data/quality'

export const revalidate = 0

interface Props { params: Promise<{ id: string }> }

const DataBar = ({ score, label }: { score: number; label: string }) => {
  const filled = Math.round(score * 10)
  const empty = 10 - filled
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-tertiary w-24 shrink-0">{label}</span>
      <span className="font-mono text-xs text-orange-400 tracking-tight">
        {'█'.repeat(filled)}{'░'.repeat(empty)}
      </span>
      <span className="text-xs text-text-tertiary">{Math.round(score * 100)}%</span>
    </div>
  )
}

export default async function AdminProviderDetailPage({ params }: Props) {
  const { id } = await params

  const lender = await db.lender.findUnique({
    where: { id },
    include: {
      criteria:         true,
      criteriaVersions: { orderBy: { versionNumber: 'desc' } },
      financeProducts:  { where: { isActive: true } },
    },
  })
  if (!lender) notFound()

  const quality = await scoreLenderQuality(id)
  const activeVersion = lender.criteriaVersions.find(v => v.isActive)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-extralight text-text-primary">
            {lender.tradingName ?? lender.name}
          </h1>
          <p className="text-text-tertiary text-xs mt-1">
            {lender.lenderType.replace(/_/g, ' ')} ·{' '}
            <span className={
              lender.verificationStatus === 'VERIFIED' ? 'text-emerald-400' :
              lender.verificationStatus === 'PROVISIONAL' ? 'text-amber-400' : 'text-text-tertiary'
            }>
              {lender.verificationStatus}
            </span>
            {lender.isPubliclyListed ? ' · Publicly listed' : ' · Not publicly listed'}
          </p>
        </div>
        {lender.website && (
          <a
            href={lender.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs text-text-tertiary border border-border px-3 py-2 hover:text-text-secondary"
          >
            Website ↗
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — criteria + versions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current criteria */}
          <section className="border border-border">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase">
                Active Criteria
              </h2>
              {activeVersion && (
                <span className="text-xs text-text-tertiary">
                  v{activeVersion.versionNumber} · {new Date(activeVersion.effectiveFrom).toLocaleDateString('en-GB')}
                </span>
              )}
            </div>
            {lender.criteria ? (
              <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ['Asset categories', lender.criteria.assetCategories.join(', ') || 'None set'],
                  ['Finance structures', lender.criteria.financeStructures.join(', ') || 'None set'],
                  ['Min. amount', lender.criteria.minAmount ? `£${Number(lender.criteria.minAmount).toLocaleString()}` : 'Not set'],
                  ['Max. amount', lender.criteria.maxAmount ? `£${Number(lender.criteria.maxAmount).toLocaleString()}` : 'Not set'],
                  ['Min. term', `${lender.criteria.minTermMonths} months`],
                  ['Max. term', `${lender.criteria.maxTermMonths} months`],
                  ['Geography', lender.criteria.geographyUKOnly ? 'UK only' : 'UK + International'],
                  ['Max. asset age', lender.criteria.maxAssetAgeYears ? `${lender.criteria.maxAssetAgeYears} years` : 'No limit'],
                  ['New assets', lender.criteria.newAssetsOnly ? 'New only' : lender.criteria.usedAssetsConsidered ? 'New + Used' : 'New only'],
                  ['Min. business age', lender.criteria.minBusinessAgeMonths ? `${lender.criteria.minBusinessAgeMonths} months` : 'No minimum'],
                  ['Min. turnover', lender.criteria.minAnnualTurnover ? `£${Number(lender.criteria.minAnnualTurnover).toLocaleString()}` : 'No minimum'],
                  ['FCA required', lender.criteria.requiresFCA ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-text-tertiary">{label}</span>
                    <span className="text-text-secondary text-sm">{value}</span>
                  </div>
                ))}
                {lender.criteria.notes && (
                  <div className="col-span-2 mt-2 pt-4 border-t border-border">
                    <span className="text-xs text-text-tertiary">Notes</span>
                    <p className="text-text-secondary text-sm mt-1">{lender.criteria.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-text-tertiary text-sm">No criteria record.</p>
                <p className="text-text-tertiary text-xs mt-1">
                  Criteria must be created before this provider can be matched to requirements.
                </p>
              </div>
            )}
          </section>

          {/* Criteria version history */}
          {lender.criteriaVersions.length > 0 && (
            <section className="border border-border">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-xs tracking-widest text-text-tertiary uppercase">
                  Criteria Version History
                </h2>
                <p className="text-text-tertiary text-xs mt-1">
                  Immutable versions — "what criteria applied when this opportunity was matched?"
                </p>
              </div>
              <div className="divide-y divide-border">
                {lender.criteriaVersions.map(version => (
                  <div key={version.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary text-sm">v{version.versionNumber}</span>
                        {version.isActive && (
                          <span className="text-xs text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5">Active</span>
                        )}
                      </div>
                      <p className="text-text-tertiary text-xs mt-1">
                        Effective: {new Date(version.effectiveFrom).toLocaleDateString('en-GB')}
                        {version.effectiveTo
                          ? ` – ${new Date(version.effectiveTo).toLocaleDateString('en-GB')}`
                          : ' (current)'}
                      </p>
                      {version.reason && (
                        <p className="text-text-tertiary text-xs mt-0.5">Reason: {version.reason}</p>
                      )}
                      {version.changedBy && (
                        <p className="text-text-tertiary text-xs mt-0.5">Changed by: {version.changedBy}</p>
                      )}
                    </div>
                    <span className="text-text-tertiary text-xs shrink-0">
                      {new Date(version.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Finance products */}
          {lender.financeProducts.length > 0 && (
            <section className="border border-border">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-xs tracking-widest text-text-tertiary uppercase">Finance Products</h2>
              </div>
              <div className="divide-y divide-border">
                {lender.financeProducts.map(product => (
                  <div key={product.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-text-primary text-sm">{product.name}</p>
                      <p className="text-text-tertiary text-xs mt-0.5">{product.structureType.replace(/_/g, ' ')}</p>
                      {product.description && (
                        <p className="text-text-tertiary text-xs mt-1">{product.description}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-text-tertiary shrink-0">
                      <p>£{Number(product.minAmount).toLocaleString()} – £{Number(product.maxAmount).toLocaleString()}</p>
                      <p>{product.minTermMonths}–{product.maxTermMonths} months</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar — data quality */}
        <div className="space-y-5">
          {quality && (
            <section className="border border-border">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-xs tracking-widest text-text-tertiary uppercase">Data Quality</h2>
              </div>
              <div className="px-5 py-5 space-y-3">
                <DataBar score={quality.identity.score}      label="Identity" />
                <DataBar score={quality.specification.score} label="Specification" />
                <DataBar score={quality.sourceQuality.score} label="Source" />
                <DataBar score={quality.verification.score}  label="Verification" />
                <DataBar score={quality.freshness.score}     label="Freshness" />
              </div>
              {quality.issues.length > 0 && (
                <div className="px-5 pb-5">
                  <p className="text-xs text-text-tertiary mb-2">Issues</p>
                  <ul className="space-y-1">
                    {quality.issues.map((issue, i) => (
                      <li key={i} className="text-xs text-amber-500 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">·</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Key fields */}
          <section className="border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase">Provider Details</h2>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              {[
                ['Status', lender.status],
                ['Regulated', lender.isRegulated ? 'Yes' : 'No'],
                lender.fcaReference ? ['FCA ref.', lender.fcaReference] : null,
                ['Currency', lender.currency],
                ['UK only', lender.ukOnly ? 'Yes' : 'No'],
                ['New business', lender.newBusinessAppetite ? 'Yes' : 'No'],
                ['Startups', lender.startupsConsidered ? 'Considered' : 'No'],
              ].filter((x): x is [string, string] => x !== null).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-text-tertiary">{label}</span>
                  <span className="text-text-secondary text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
