import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AssetCategoryGrid } from '@/components/marketing/AssetCategoryGrid'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Asset Taxonomy & Equipment Directory',
  description:
    'Browse UK business asset finance by category — construction equipment, commercial vehicles, heavy plant, manufacturing machinery, medical technology, and specialist equipment.',
  canonical: '/assets',
})

const DISCOVERY_STEPS = [
  { step: '01', label: 'Category', desc: 'Identify your operational equipment sector' },
  { step: '02', label: 'Manufacturer', desc: 'Explore OEM engineering profiles & models' },
  { step: '03', label: 'Model Spec', desc: 'Verify chassis, payload, and boom configurations' },
  { step: '04', label: 'Asset Record', desc: 'Access verified inspection & service documentation' },
  { step: '05', label: 'Market Data', desc: 'Compare auction hammer prices vs asking rates' },
  { step: '06', label: 'Finance', desc: 'Route requirement to pre-matched UK lenders' },
]

export default function AssetsPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Assets', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                UK Industrial & Capital Equipment Taxonomy
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Asset Discovery"
              subtitle="Structured financing for UK business capital assets. Select a category to explore equipment specifications, market intelligence, and eligible finance structures."
            >
              Explore Business Equipment.
            </SectionHeading>
          </AnimateOnScroll>

          {/* Discovery Hierarchy Model */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <p className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-6">
              The TAFM Asset Discovery Hierarchy
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {DISCOVERY_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  className="p-4 rounded border border-white/10 bg-white/[0.02] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-caption font-mono text-orange-400">{s.step}</span>
                    {idx < DISCOVERY_STEPS.length - 1 && (
                      <span className="text-neutral-600 text-xs hidden lg:inline">→</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-body-sm font-medium text-white">{s.label}</h3>
                    <p className="text-[11px] text-neutral-400 font-light mt-1 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Verified Production Asset Highlight */}
      <Section variant="dark-2" spacing="lg" className="border-t border-white/10">
        <Container>
          <div className="p-6 sm:p-8 rounded border border-orange-500/30 bg-gradient-to-r from-orange-950/20 via-black to-black flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Featured Verified Asset
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Specialist Equipment · Scania 8x4 (32t)
                </span>
              </div>
              <h2 className="text-heading-lg font-light text-white">
                Ruthmann STEIGER T 650 HF on Scania 8x4 (2022)
              </h2>
              <p className="text-body-sm text-neutral-300 font-light">
                65m highflex access platform with verified Euro Auctions Leeds hammer price (£620,000) and PlantTrader advertised asking price (£695,000).
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                as="a"
                href="/assets/specialist-equipment/ruthmann-steiger-t-650-hf-scania-2022"
                variant="primary"
                size="md"
              >
                Inspect Asset Intelligence →
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Taxonomy Categories */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-label text-neutral-500 uppercase tracking-widest font-mono">
                Primary Taxonomy
              </span>
              <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
                11 Industrial Asset Sectors
              </h2>
              <p className="text-body text-neutral-600 font-light mt-1">
                Each category contains typical equipment configurations, applicable finance structures, and verified market data.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/manufacturers"
                className="text-body-sm text-neutral-700 hover:text-orange-600 font-light underline underline-offset-4"
              >
                Browse Verified Manufacturers Directory →
              </Link>
            </div>
          </div>

          <AssetCategoryGrid linked cols={3} />
        </Container>
      </Section>

      {/* Unsure Banner & Direct Route */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-[var(--color-border-light)] pt-12">
              <div>
                <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-4 font-mono">
                  Bespoke or Cross-Sector Assets
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  Asset finance is available for most commercial machinery. If your acquisition does not cleanly fit one category, our network includes specialist underwriters with appetite for bespoke, non-standard, and custom machinery.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <Button as="a" href="/apply" variant="primary" size="md">Start an Application</Button>
                <Button as="a" href="/finance" variant="outline" size="md">Compare Finance Structures</Button>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
