// app/(marketing)/providers/[slug]/page.tsx
import { db } from '@/lib/db/client'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const provider = await db.lender.findUnique({
    where: { slug, isPubliclyListed: true },
    select: { name: true, tradingName: true, description: true },
  })
  if (!provider) return {}
  const displayName = provider.tradingName ?? provider.name
  return genMeta({
    title: `${displayName} — Asset Finance Provider`,
    description: provider.description ?? `${displayName} is an asset finance provider on the TAFM platform.`,
  })
}

async function getProvider(slug: string) {
  return db.lender.findUnique({
    where: { slug, isPubliclyListed: true, deletedAt: null },
    include: {
      financeProducts: { where: { isActive: true } },
      criteria: true,
    },
  })
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  HIRE_PURCHASE:   'Hire Purchase',
  FINANCE_LEASE:   'Finance Lease',
  OPERATING_LEASE: 'Operating Lease',
  ASSET_REFINANCE: 'Asset Refinance',
  COMMERCIAL_LOAN: 'Commercial Loan',
  SPECIALIST:      'Specialist Finance',
}

export default async function ProviderProfilePage({ params }: Props) {
  const { slug } = await params
  const provider = await getProvider(slug)
  if (!provider) notFound()

  const displayName = provider.tradingName ?? provider.name
  const isVerified = provider.verificationStatus === 'VERIFIED'
  const isProvisional = provider.verificationStatus === 'PROVISIONAL'

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <nav className="text-xs text-text-tertiary mb-4">
                <Link href="/providers" className="hover:text-text-secondary">Providers</Link>
                <span className="mx-2">›</span>
                <span className="text-text-secondary">{displayName}</span>
              </nav>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-extralight text-text-primary">{displayName}</h1>
                {isVerified && (
                  <span className="text-xs px-2 py-0.5 border border-emerald-600 text-emerald-600">Verified</span>
                )}
              </div>
              <p className="text-text-tertiary text-xs uppercase tracking-wider">
                {provider.lenderType.replace(/_/g, ' ')}
                {provider.isRegulated && provider.regulatoryBody
                  ? ` · Regulated by ${provider.regulatoryBody}`
                  : ''}
              </p>
            </div>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="shrink-0 text-xs text-text-tertiary border border-border px-4 py-2 hover:border-text-secondary hover:text-text-secondary transition-colors"
              >
                Visit website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Verification notice */}
          {!isVerified && (
            <div className="border border-amber-600/30 bg-amber-600/5 p-4">
              <p className="text-xs text-amber-600 leading-relaxed">
                {isProvisional
                  ? 'This provider profile is based on publicly available information that has not yet been independently verified by TAFM.'
                  : 'TAFM has not independently verified this information. Details are provided for informational purposes only and should be confirmed directly with the provider.'}
              </p>
            </div>
          )}

          {/* About */}
          {provider.description && (
            <div>
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">About</h2>
              <p className="text-text-secondary leading-relaxed">{provider.description}</p>
            </div>
          )}

          {/* Finance products */}
          {provider.financeProducts.length > 0 && (
            <div>
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">Finance Products</h2>
              <div className="space-y-2">
                {provider.financeProducts.map(product => (
                  <div key={product.id} className="border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-text-primary text-sm font-light">
                          {PRODUCT_TYPE_LABELS[product.structureType] ?? product.structureType}
                        </p>
                        {product.description && (
                          <p className="text-text-tertiary text-xs mt-1">{product.description}</p>
                        )}
                      </div>
                      <div className="text-right text-xs text-text-tertiary shrink-0">
                        <p>£{Number(product.minAmount).toLocaleString()} – £{Number(product.maxAmount).toLocaleString()}</p>
                        <p>{product.minTermMonths}–{product.maxTermMonths} months</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Asset specialisms */}
          {provider.specialisms.length > 0 && (
            <div>
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">Asset Specialisms</h2>
              <div className="flex flex-wrap gap-2">
                {provider.specialisms.map(s => (
                  <span key={s} className="text-xs text-text-secondary border border-border px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Eligible categories */}
          {provider.eligibleAssetCategories.length > 0 && (
            <div>
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">Asset Categories</h2>
              <div className="flex flex-wrap gap-2">
                {provider.eligibleAssetCategories.map(c => (
                  <span key={c} className="text-xs text-text-tertiary border border-border px-3 py-1">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key facts */}
          <div className="border border-border p-5 space-y-4">
            <h3 className="text-xs tracking-widest text-text-tertiary uppercase">Key Facts</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-text-tertiary">Geography</dt>
                <dd className="text-text-secondary text-right">
                  {provider.ukOnly ? 'UK only' : 'UK + International'}
                </dd>
              </div>
              {provider.minLoanAmount && Number(provider.minLoanAmount) > 0 && (
                <div className="flex justify-between gap-2">
                  <dt className="text-text-tertiary">Min. finance</dt>
                  <dd className="text-text-secondary">£{Number(provider.minLoanAmount).toLocaleString()}</dd>
                </div>
              )}
              {provider.maxLoanAmount && Number(provider.maxLoanAmount) > 0 && (
                <div className="flex justify-between gap-2">
                  <dt className="text-text-tertiary">Max. finance</dt>
                  <dd className="text-text-secondary">£{Number(provider.maxLoanAmount).toLocaleString()}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-text-tertiary">Term range</dt>
                <dd className="text-text-secondary">{provider.minTermMonths}–{provider.maxTermMonths} months</dd>
              </div>
              {provider.startupsConsidered && (
                <div className="flex justify-between gap-2">
                  <dt className="text-text-tertiary">Startups</dt>
                  <dd className="text-text-secondary">Considered</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-text-tertiary">Regulated</dt>
                <dd className="text-text-secondary">{provider.isRegulated ? 'Yes' : 'No'}</dd>
              </div>
              {provider.fcaReference && (
                <div className="flex justify-between gap-2">
                  <dt className="text-text-tertiary">FCA ref.</dt>
                  <dd className="text-text-secondary font-mono text-xs">{provider.fcaReference}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Application route */}
          <div className="border border-border p-5">
            <h3 className="text-xs tracking-widest text-text-tertiary uppercase mb-3">Application Route</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Finance requirements are submitted through TAFM and assessed against provider criteria.
              TAFM does not guarantee that any requirement will result in an offer.
            </p>
            <Link
              href="/apply"
              className="block text-center border border-orange-500 text-orange-500 px-4 py-2.5 text-sm hover:bg-orange-500 hover:text-white transition-colors"
            >
              Start finance request
            </Link>
          </div>

          {/* Data note */}
          <div className="p-4 bg-surface-secondary">
            <p className="text-xs text-text-tertiary leading-relaxed">
              Provider criteria change. TAFM records dated, versioned criteria.{' '}
              <Link href="/trust" className="underline hover:text-text-secondary">
                How TAFM handles data
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
