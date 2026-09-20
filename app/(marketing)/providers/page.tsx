// app/(marketing)/providers/page.tsx
import { db } from '@/lib/db/client'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = genMeta({
  title: 'Finance Providers',
  description: 'TAFM works with verified asset finance providers. Browse the TAFM provider network — specialist lenders, banks, and asset finance companies.',
})

export const dynamic = 'force-dynamic'

async function getVerifiedProviders() {
  return db.lender.findMany({
    where: {
      isPubliclyListed: true,
      status: { not: 'INACTIVE' },
      deletedAt: null,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      tradingName: true,
      lenderType: true,
      description: true,
      specialisms: true,
      eligibleAssetCategories: true,
      verificationStatus: true,
      website: true,
      logoUrl: true,
    },
    orderBy: [{ verificationStatus: 'asc' }, { name: 'asc' }],
  })
}

export default async function ProvidersPage() {
  const providers = await getVerifiedProviders()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs tracking-widest text-text-tertiary uppercase mb-4">
            Provider network
          </p>
          <h1 className="text-3xl font-extralight text-text-primary mb-4">
            Finance Providers
          </h1>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            TAFM works with specialist asset finance providers. Provider listings require
            verification before appearing publicly. Criteria are recorded and versioned —
            so matching remains accurate and auditable.
          </p>
        </div>
      </section>

      {/* Provider list */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {providers.length === 0 ? (
          <div className="border border-border rounded p-12 text-center">
            <p className="text-text-tertiary text-sm mb-2">No verified providers listed</p>
            <p className="text-text-tertiary text-xs max-w-md mx-auto">
              TAFM is building its verified provider network. Providers are listed only after
              independent verification. If you are an asset finance provider, you can apply to join.
            </p>
            <div className="mt-8">
              <Link
                href="/for-providers"
                className="inline-block border border-orange-500 text-orange-500 px-6 py-2.5 text-sm hover:bg-orange-500 hover:text-white transition-colors"
              >
                Become a TAFM Provider
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-tertiary text-sm">
                {providers.length} verified provider{providers.length === 1 ? '' : 's'}
              </p>
              <Link
                href="/for-providers"
                className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
              >
                Join the network →
              </Link>
            </div>

            {providers.map(provider => (
              <Link
                key={provider.id}
                href={`/providers/${provider.slug}`}
                className="block border border-border p-6 hover:border-text-tertiary transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-text-primary font-light group-hover:text-orange-500 transition-colors">
                        {provider.tradingName ?? provider.name}
                      </h2>
                      {provider.verificationStatus === 'VERIFIED' && (
                        <span className="text-xs px-2 py-0.5 border border-emerald-600 text-emerald-600">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-text-tertiary text-xs mb-3 uppercase tracking-wider">
                      {provider.lenderType.replace(/_/g, ' ')}
                    </p>
                    {provider.description && (
                      <p className="text-text-secondary text-sm line-clamp-2">
                        {provider.description}
                      </p>
                    )}
                    {provider.specialisms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {provider.specialisms.slice(0, 4).map(s => (
                          <span key={s} className="text-xs text-text-tertiary border border-border px-2 py-0.5">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-text-tertiary text-sm shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Trust note */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-text-tertiary text-xs leading-relaxed max-w-2xl">
            Provider listings on TAFM are subject to verification. Where information has not been
            independently verified, this is clearly stated. TAFM does not guarantee any provider's
            criteria, products, or availability. Provider criteria change — TAFM records versioned
            criteria so you can understand what criteria applied at any point in time.{' '}
            <Link href="/trust" className="text-text-secondary hover:text-text-primary underline">
              How TAFM handles data
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
