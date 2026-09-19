import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Asset category grid ───────────────────────────────────────────────────────
//
// Editorial grid of TAFM's 11 asset categories.
// Used on the homepage and /assets index page.
// Server Component — no client JS required.

const CATEGORIES = [
  { label: 'Construction Equipment',     slug: 'construction-equipment',     desc: 'Excavators, cranes, piling rigs, scaffolding' },
  { label: 'Manufacturing Equipment',    slug: 'manufacturing-equipment',     desc: 'CNC, presses, injection moulding, automation' },
  { label: 'Agricultural Equipment',     slug: 'agricultural-equipment',      desc: 'Tractors, harvesters, irrigation, precision ag' },
  { label: 'Commercial Vehicles',        slug: 'commercial-vehicles',         desc: 'HGVs, LGVs, vans, refrigerated transport' },
  { label: 'Heavy Vehicles',             slug: 'heavy-vehicles',              desc: 'Low loaders, tippers, concrete mixers' },
  { label: 'Medical Equipment',          slug: 'medical-equipment',           desc: 'Imaging, diagnostics, surgical, dental' },
  { label: 'Industrial Equipment',       slug: 'industrial-equipment',        desc: 'Compressors, generators, fork lifts, handling' },
  { label: 'Technology & IT',            slug: 'technology-it-equipment',     desc: 'Servers, networking, broadcast, production' },
  { label: 'Renewable Energy',           slug: 'renewable-energy-equipment',  desc: 'Solar PV, wind, battery storage, heat pumps' },
  { label: 'Hospitality Equipment',      slug: 'hospitality-equipment',       desc: 'Commercial kitchens, HVAC, refrigeration' },
  { label: 'Specialist Equipment',       slug: 'specialist-equipment',        desc: 'Bespoke, niche and custom machinery' },
]

interface AssetCategoryGridProps {
  /** Show links to /assets/[category] */
  linked?: boolean
  className?: string
  /** Number of columns at lg breakpoint (default 3) */
  cols?: 3 | 4
}

export function AssetCategoryGrid({
  linked = true,
  className,
  cols = 3,
}: AssetCategoryGridProps) {
  const gridClass = cols === 4
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={cn(gridClass, 'gap-px bg-[var(--color-border-light)]', className)} role="list">
      {CATEGORIES.map((cat, index) => {
        const content = (
          <>
            <span className="text-label text-[var(--color-text-on-light-muted)] tracking-widest uppercase mb-3 block">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-2 group-hover:text-orange-600 transition-colors duration-[var(--duration-fast)]">
              {cat.label}
            </h3>
            <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)] leading-relaxed">
              {cat.desc}
            </p>
            {linked && (
              <span className="mt-4 text-body-sm text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] block">
                Explore →
              </span>
            )}
          </>
        )

        if (linked) {
          return (
            <Link
              key={cat.slug}
              href={`/assets/${cat.slug}`}
              className="group bg-white p-6 lg:p-8 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
              role="listitem"
              aria-label={`${cat.label} — ${cat.desc}`}
            >
              {content}
            </Link>
          )
        }

        return (
          <div key={cat.slug} className="group bg-white p-6 lg:p-8 flex flex-col" role="listitem">
            {content}
          </div>
        )
      })}
    </div>
  )
}
