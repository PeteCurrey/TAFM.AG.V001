// app/(marketing)/manufacturers/[slug]/page.tsx
import { db } from '@/lib/db/client'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import { shouldIndex } from '@/lib/data/quality'
import { scoreManufacturerQuality } from '@/lib/data/quality'
import { getObservationSummary, isInsufficientData } from '@/lib/market/observations'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const mfr = await db.manufacturer.findUnique({
    where: { slug, isActive: true },
    select: { name: true, description: true },
  })
  if (!mfr) return {}
  return genMeta({
    title: `${mfr.name} — Asset Finance`,
    description: mfr.description ?? `${mfr.name} assets and asset finance information on TAFM.`,
  })
}

export default async function ManufacturerPage({ params }: Props) {
  const { slug } = await params

  const mfr = await db.manufacturer.findUnique({
    where: { slug, isActive: true },
    include: {
      assetModels: {
        where: { isActive: true },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { name: 'asc' },
      },
    },
  })
  if (!mfr) notFound()

  const [quality, marketSummary] = await Promise.all([
    scoreManufacturerQuality(mfr.id),
    getObservationSummary({ manufacturerId: mfr.id }),
  ])

  const indexable = shouldIndex(quality)

  return (
    <main className="min-h-screen bg-background">
      {!indexable && (
        // noindex via metadata — this just shows the data state in dev
        <></>
      )}

      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <nav className="text-xs text-text-tertiary mb-4">
            <Link href="/manufacturers" className="hover:text-text-secondary">Manufacturers</Link>
            <span className="mx-2">›</span>
            <span className="text-text-secondary">{mfr.name}</span>
          </nav>
          <div className="flex items-start gap-4 justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extralight text-text-primary">{mfr.name}</h1>
                {mfr.verificationStatus === 'VERIFIED' && (
                  <span className="text-xs px-2 py-0.5 border border-emerald-600 text-emerald-600">Verified</span>
                )}
              </div>
              {mfr.countryOfOrigin && (
                <p className="text-text-tertiary text-xs">{mfr.countryOfOrigin}</p>
              )}
            </div>
            {mfr.website && (
              <a
                href={mfr.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs text-text-tertiary border border-border px-4 py-2 hover:border-text-secondary hover:text-text-secondary transition-colors shrink-0"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {mfr.description ? (
            <div>
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">About</h2>
              <p className="text-text-secondary leading-relaxed">{mfr.description}</p>
            </div>
          ) : (
            <div className="border border-border p-5">
              <p className="text-text-tertiary text-sm">No description available.</p>
              <p className="text-text-tertiary text-xs mt-1">
                TAFM has not yet recorded a verified description for this manufacturer.
              </p>
            </div>
          )}

          {/* Models */}
          {mfr.assetModels.length > 0 && (
            <div>
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">
                Models ({mfr.assetModels.length})
              </h2>
              <div className="space-y-2">
                {mfr.assetModels.map(model => (
                  <div key={model.id} className="border border-border p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-text-primary text-sm">{model.name}</p>
                      <p className="text-text-tertiary text-xs mt-0.5">{model.category.name}</p>
                    </div>
                    <Link
                      href={`/assets/${model.category.slug}`}
                      className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                      Browse category →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market intelligence */}
          <div>
            <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">
              Market Intelligence
            </h2>
            {isInsufficientData(marketSummary) ? (
              <div className="border border-border p-5">
                <p className="text-text-tertiary text-sm">Insufficient market observations.</p>
                <p className="text-text-tertiary text-xs mt-1 leading-relaxed">
                  {marketSummary.reason}
                </p>
              </div>
            ) : (
              <div className="border border-border p-5 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-text-tertiary text-xs mb-1">Observations</p>
                    <p className="text-text-primary text-lg font-extralight">{marketSummary.totalCount}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs mb-1">Date range</p>
                    <p className="text-text-secondary text-xs">
                      {marketSummary.dateRange.earliest.toLocaleDateString('en-GB')}
                      {' – '}
                      {marketSummary.dateRange.latest.toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs mb-1">Sources</p>
                    <p className="text-text-primary text-lg font-extralight">{marketSummary.sourceCount}</p>
                  </div>
                </div>
                {marketSummary.dominant && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-text-tertiary text-xs mb-2">
                      {marketSummary.dominant.type.replace(/_/g, ' ')} — not a sale price
                      {marketSummary.dominant.type === 'ASKING_PRICE' ? ' (asking prices only)' : ''}
                    </p>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-text-tertiary text-xs">Median</p>
                        <p className="text-text-primary">£{marketSummary.dominant.range.median.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-text-tertiary text-xs">Range</p>
                        <p className="text-text-primary text-sm">
                          £{marketSummary.dominant.range.min.toLocaleString()} – £{marketSummary.dominant.range.max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {marketSummary.hasAskingPrices && !marketSummary.hasSalePrices && (
                      <p className="text-amber-600 text-xs mt-3 leading-relaxed">
                        These figures are based on <strong>asking prices only</strong> — not confirmed sale prices.
                        Asking prices may not reflect actual transaction values.
                      </p>
                    )}
                  </div>
                )}
                <p className="text-text-tertiary text-xs pt-2 border-t border-border">
                  Market data is indicative only. Source: {marketSummary.sourceCount} data source{marketSummary.sourceCount !== 1 ? 's' : ''}.
                  TAFM does not guarantee accuracy or completeness.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="border border-border p-5">
            <h3 className="text-xs tracking-widest text-text-tertiary uppercase mb-4">Finance this asset</h3>
            <p className="text-text-tertiary text-xs leading-relaxed mb-4">
              Looking to finance a {mfr.name} asset? Submit your requirement and TAFM will assess
              it against verified provider criteria.
            </p>
            <Link
              href="/apply"
              className="block text-center border border-orange-500 text-orange-500 px-4 py-2.5 text-sm hover:bg-orange-500 hover:text-white transition-colors"
            >
              Finance request
            </Link>
          </div>

          {!mfr.verificationStatus || mfr.verificationStatus === 'UNKNOWN' ? (
            <div className="border border-amber-600/20 p-4">
              <p className="text-xs text-amber-600 leading-relaxed">
                TAFM has not independently verified all information for this manufacturer.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
