import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { EmptyState } from '@/components/ui/EmptyState'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

// ─── Asset category data ──────────────────────────────────────────────────────

const CATEGORY_DATA: Record<string, { name: string; description: string; financeNote: string }> = {
  'construction-equipment':    { name: 'Construction Equipment', description: 'Finance for excavators, cranes, piling rigs, scaffolding equipment, dumpers, compactors and groundworks machinery.', financeNote: 'Construction equipment typically qualifies for Hire Purchase or Finance Lease. Assets with strong residual values may also suit Operating Lease structures.' },
  'manufacturing-equipment':   { name: 'Manufacturing Equipment', description: 'Finance for CNC machining centres, presses, injection moulding machines, laser cutters, robotics and automated production equipment.', financeNote: 'High-value manufacturing equipment is well-suited to Hire Purchase and Finance Lease, with terms typically ranging from 3 to 7 years.' },
  'agricultural-equipment':    { name: 'Agricultural Equipment', description: 'Finance for tractors, combine harvesters, telehandlers, irrigation systems, grain dryers and precision agriculture technology.', financeNote: 'Agricultural finance can be structured around seasonal cash flows. Hire Purchase and specialist agricultural lending are common structures.' },
  'commercial-vehicles':       { name: 'Commercial Vehicles', description: 'Finance for HGVs, LGVs, curtainsiders, flatbeds, refrigerated vehicles, minibuses and specialist commercial transport.', financeNote: 'Commercial vehicles are one of the most actively financed asset classes in the UK, with competitive terms available across Hire Purchase, Finance Lease and Contract Hire structures.' },
  'heavy-vehicles':            { name: 'Heavy Vehicles', description: 'Finance for low loaders, tipper trucks, concrete mixers, road sweepers and abnormal load vehicles.', financeNote: 'Heavy vehicles with specialist configurations may require bespoke finance structures and specialist lenders.' },
  'medical-equipment':         { name: 'Medical Equipment', description: 'Finance for MRI and CT scanners, X-ray and ultrasound equipment, surgical systems, ophthalmic equipment and dental chairs.', financeNote: 'Medical equipment finance is a specialist sector with dedicated lenders. Finance Lease and Operating Lease structures are common given the pace of technology change.' },
  'industrial-equipment':      { name: 'Industrial Equipment', description: 'Finance for air compressors, industrial generators, fork lift trucks, overhead cranes and materials handling equipment.', financeNote: 'Industrial equipment finance typically uses Hire Purchase or Finance Lease with terms of 3 to 5 years.' },
  'technology-it-equipment':   { name: 'Technology & IT Equipment', description: 'Finance for servers, data centre infrastructure, networking equipment, broadcast and production technology.', financeNote: 'Technology assets often depreciate rapidly. Operating Lease and Finance Lease structures allow businesses to upgrade without owning obsolete equipment.' },
  'renewable-energy-equipment':{ name: 'Renewable Energy Equipment', description: 'Finance for commercial solar PV arrays, wind turbines, battery energy storage systems, heat pumps and EV charging infrastructure.', financeNote: 'Renewable energy assets can be financed against the energy savings or revenues they generate. Specialist green finance products are available.' },
  'hospitality-equipment':     { name: 'Hospitality Equipment', description: 'Finance for commercial kitchens, refrigeration systems, HVAC, dishwashers, coffee machines and food service equipment.', financeNote: 'Hospitality equipment finance suits businesses seeking to preserve working capital. Finance Lease with options to upgrade is common.' },
  'specialist-equipment':      { name: 'Specialist Equipment', description: 'Finance for bespoke, niche and custom machinery that does not fit a standard category.', financeNote: 'Specialist and bespoke assets require lenders with appetite for non-standard security. TAFM\'s lender network includes specialists in unusual asset types.' },
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const data = CATEGORY_DATA[category]
  if (!data) return {}

  return genMeta({
    title: `${data.name} Finance`,
    description: `${data.description} Finance options including Hire Purchase, Finance Lease and Operating Lease.`,
    canonical: `/assets/${category}`,
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AssetCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const data = CATEGORY_DATA[category]

  if (!data) notFound()

  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Assets', href: '/assets' },
              { label: data.name, current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Asset Finance">
              {data.name}
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimateOnScroll>
              <div className="space-y-6">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">About this category</h2>
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">{data.description}</p>
                <div className="p-6 border-l-2 border-orange-500 bg-orange-50/50">
                  <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed">{data.financeNote}</p>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div>
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-6">Available assets</h2>
                <EmptyState
                  title="No assets listed yet"
                  description="Asset listings will appear here as the marketplace is populated. Finance applications can still be submitted for any asset in this category."
                  action={{ label: 'Start an application', href: '/apply' }}
                />
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll className="mt-16 pt-16 border-t border-[var(--color-border-light)]">
            <div className="flex flex-wrap gap-4">
              <Button as="a" href="/apply" variant="primary" size="md">Finance this asset type</Button>
              <Button as="a" href="/assets" variant="outline" size="md">All categories</Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_DATA).map((category) => ({ category }))
}
