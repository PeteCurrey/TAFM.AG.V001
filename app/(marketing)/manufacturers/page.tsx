// app/(marketing)/manufacturers/page.tsx
import { db } from '@/lib/db/client'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = genMeta({
  title: 'Asset Manufacturers',
  description: 'Browse the TAFM manufacturer directory. Verified manufacturer profiles connected to asset categories, finance types, and market intelligence.',
})

export const dynamic = 'force-dynamic'

export default async function ManufacturersPage() {
  const manufacturers = await db.manufacturer.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { assets: true, assetModels: true } },
    },
    orderBy: { name: 'asc' },
  })

  const grouped = manufacturers.reduce<Record<string, typeof manufacturers>>((acc, m) => {
    const letter = m.name[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(m)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs tracking-widest text-text-tertiary uppercase mb-4">
            Entity directory
          </p>
          <h1 className="text-3xl font-extralight text-text-primary mb-4">
            Manufacturers
          </h1>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            Manufacturer profiles are verified before publication. Each profile connects to
            asset models, market observations, and finance data where available.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        {manufacturers.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <p className="text-text-tertiary text-sm">No manufacturer profiles published yet.</p>
            <p className="text-text-tertiary text-xs mt-2 max-w-sm mx-auto">
              Manufacturer profiles are added and verified before listing. The directory grows as
              verified data is recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-text-tertiary text-sm">
              {manufacturers.length} manufacturer{manufacturers.length !== 1 ? 's' : ''}
            </p>
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([letter, list]) => (
              <div key={letter}>
                <div className="text-xs tracking-widest text-text-tertiary uppercase border-b border-border pb-2 mb-4">
                  {letter}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map(mfr => (
                    <Link
                      key={mfr.id}
                      href={`/manufacturers/${mfr.slug}`}
                      className="border border-border p-4 hover:border-text-tertiary transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-text-primary text-sm font-light group-hover:text-orange-500 transition-colors truncate">
                            {mfr.name}
                          </p>
                          {mfr.countryOfOrigin && (
                            <p className="text-text-tertiary text-xs mt-0.5">{mfr.countryOfOrigin}</p>
                          )}
                        </div>
                        {mfr.verificationStatus === 'VERIFIED' && (
                          <span className="text-xs text-emerald-600 shrink-0">✓</span>
                        )}
                      </div>
                      {(mfr._count.assetModels > 0 || mfr._count.assets > 0) && (
                        <p className="text-text-tertiary text-xs mt-2">
                          {mfr._count.assetModels > 0 ? `${mfr._count.assetModels} model${mfr._count.assetModels !== 1 ? 's' : ''}` : ''}
                          {mfr._count.assetModels > 0 && mfr._count.assets > 0 ? ' · ' : ''}
                          {mfr._count.assets > 0 ? `${mfr._count.assets} asset${mfr._count.assets !== 1 ? 's' : ''}` : ''}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
