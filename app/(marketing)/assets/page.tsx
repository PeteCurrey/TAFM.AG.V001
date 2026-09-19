import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Asset Categories',
  description:
    'Browse asset finance by category — construction, manufacturing, agricultural, commercial vehicles, medical, technology and more.',
  canonical: '/assets',
})

const CATEGORIES = [
  { label: 'Construction Equipment',     slug: 'construction-equipment',     note: 'Excavators, cranes, piling rigs, scaffolding and groundworks equipment.' },
  { label: 'Manufacturing Equipment',    slug: 'manufacturing-equipment',     note: 'CNC machines, presses, moulding equipment and automated production lines.' },
  { label: 'Agricultural Equipment',     slug: 'agricultural-equipment',      note: 'Tractors, combine harvesters, irrigation systems and precision agriculture technology.' },
  { label: 'Commercial Vehicles',        slug: 'commercial-vehicles',         note: 'HGVs, LGVs, vans, refrigerated vehicles and specialist commercial transport.' },
  { label: 'Heavy Vehicles',             slug: 'heavy-vehicles',              note: 'Low loaders, tipper trucks, concrete mixers and abnormal load vehicles.' },
  { label: 'Medical Equipment',          slug: 'medical-equipment',           note: 'Imaging systems, diagnostic equipment, surgical and dental equipment.' },
  { label: 'Industrial Equipment',       slug: 'industrial-equipment',        note: 'Air compressors, generators, fork lifts and industrial handling equipment.' },
  { label: 'Technology & IT Equipment',  slug: 'technology-it-equipment',     note: 'Servers, networking infrastructure, production technology and broadcast equipment.' },
  { label: 'Renewable Energy Equipment', slug: 'renewable-energy-equipment',  note: 'Solar PV systems, wind turbines, battery storage and heat pump systems.' },
  { label: 'Hospitality Equipment',      slug: 'hospitality-equipment',       note: 'Commercial kitchen, refrigeration, HVAC and food service equipment.' },
  { label: 'Specialist Equipment',       slug: 'specialist-equipment',        note: 'Bespoke, niche and custom machinery requiring specialist finance structures.' },
]

export default function AssetsPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Assets', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Asset categories" subtitle="Finance for the full spectrum of UK business capital equipment.">
              What are you acquiring?
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="space-y-0">
            {CATEGORIES.map((cat, index) => (
              <AnimateOnScroll key={cat.slug} delay={index * 35}>
                <Link href={`/assets/${cat.slug}`} className="group flex items-start gap-6 py-6 border-b border-[var(--color-border-light)] hover:border-orange-200 transition-all duration-[var(--duration-normal)]">
                  <span className="text-caption text-[var(--color-text-on-light-muted)] w-8 tabular-nums pt-1 flex-shrink-0">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] group-hover:text-orange-600 transition-colors mb-1">{cat.label}</h2>
                    <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)]">{cat.note}</p>
                  </div>
                  <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-[var(--duration-normal)] translate-x-2 group-hover:translate-x-0 pt-1 flex-shrink-0" aria-hidden="true">→</span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
