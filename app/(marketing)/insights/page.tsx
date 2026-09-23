import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

// Publication gate: noindex until genuine editorial content is published
export const metadata: Metadata = {
  ...generateMetadata({
    title: 'TAFM Insights — Market Commentary & Asset Intelligence',
    description:
      'The TAFM publication hub — research, market observations, finance structure guides, and sector commentary for UK capital equipment.',
    canonical: '/insights',
  }),
  robots: {
    index: false,
    follow: true,
  },
}

const PUBLICATION_CATEGORIES = [
  {
    name: 'Asset Finance',
    description: 'Macro developments, lender appetite trends, interest rate environments, and regulatory policy across UK commercial asset lending.',
    topics: ['Lender appetite trends', 'Bank of England rate impacts', 'Regulatory governance & FCA updates'],
  },
  {
    name: 'Asset Intelligence',
    description: 'Deep dives into machinery depreciation curves, maintenance indicators, and secondary equipment resale performance.',
    topics: ['Equipment depreciation models', 'Highflex access platform longevity', 'Commercial vehicle residual trends'],
  },
  {
    name: 'Market Observations',
    description: 'Empirical data analysis from UK commercial auctions, verified dealer asking prices, and realized transaction benchmarks.',
    topics: ['Auction hammer price analysis', 'Dealer margin compression', 'Secondary market liquidity reports'],
  },
  {
    name: 'Finance Structures',
    description: 'Technical guidance comparing Hire Purchase, Finance Lease, Operating Lease, and Sale & Leaseback under UK tax law.',
    topics: ['Full Expensing & Capital Allowances', 'VAT deferral mechanisms', 'IFRS 16 lease accounting guides'],
  },
  {
    name: 'Industry Sectors',
    description: 'Sector-specific capital expenditure dynamics in Construction, Manufacturing, Agriculture, Transport, and Medical equipment.',
    topics: ['Civil engineering plant replacement', 'British manufacturing automation', 'Agricultural seasonal credit cycles'],
  },
  {
    name: 'Transactions',
    description: 'Anonymised case studies examining how capital equipment acquisitions were structured, underwritten, and funded.',
    topics: ['Refinancing civil fleets', 'Structuring high-ticket access platforms', 'Factory automation deployment'],
  },
  {
    name: 'TAFM Platform',
    description: 'Platform infrastructure updates, criteria versioning improvements, and pilot operational milestones.',
    topics: ['Deterministic matching enhancements', 'Data provenance standards', 'Provider network expansions'],
  },
]

export default function InsightsPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Editorial Hub
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="TAFM Intelligence"
              subtitle="Data-led analysis, structural finance guides, and market observations on UK capital equipment."
            >
              Knowledge & perspective.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Editorial Methodology Notice */}
      <Section variant="light" spacing="none" className="pt-16 pb-12 border-b border-[var(--color-border-light)]">
        <Container>
          <div className="p-8 border-l-4 border-orange-500 bg-[var(--color-surface-off-white)] rounded-r-sm">
            <span className="text-caption font-mono uppercase tracking-wider text-orange-600 block mb-1">
              Publication Policy
            </span>
            <h2 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-2">
              Genuine Editorial Standards — No Synthetic Filler
            </h2>
            <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed max-w-3xl">
              TAFM does not publish auto-generated AI articles or generic filler blog posts. Our publication hub is engineered to host authoritative, data-backed reports anchored in verified auction records and specialist underwriting insights. Articles will be published as empirical datasets and verified case studies mature.
            </p>
          </div>
        </Container>
      </Section>

      {/* Publication Structure Across 7 Pillars */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="Editorial Pillars"
            >
              Publication Structure
            </SectionHeading>
            <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed max-w-2xl">
              TAFM Intelligence reports will be organized across seven core subject domains:
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PUBLICATION_CATEGORIES.map((cat, i) => (
              <AnimateOnScroll key={cat.name} delay={i * 40}>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white h-full flex flex-col justify-between hover:border-orange-500/40 transition-colors">
                  <div>
                    <span className="text-[10px] font-mono text-orange-600 mb-2 block uppercase">
                      PILLAR 0{i + 1}
                    </span>
                    <h3 className="text-heading-sm font-light text-[var(--color-text-on-light-primary)] mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-4">
                      {cat.description}
                    </p>

                    <div className="pt-3 border-t border-[var(--color-border-light)]/60">
                      <span className="text-[11px] font-mono text-[var(--color-text-on-light-muted)] block mb-1.5 uppercase">
                        Planned Focus Areas:
                      </span>
                      <ul className="space-y-1">
                        {cat.topics.map((t) => (
                          <li key={t} className="text-caption font-light text-[var(--color-text-on-light-3)] flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-orange-400" aria-hidden="true" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Action CTAs */}
          <AnimateOnScroll className="mt-16 pt-12 border-t border-[var(--color-border-light)] text-center">
            <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
              Explore Available Commercial Tools
            </h3>
            <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] max-w-lg mx-auto mb-8">
              While editorial pieces are in curation, our commercial finance structures, equipment category guides, and interactive calculators are live and accessible.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button as="a" href="/finance" variant="primary" size="md">
                Explore Finance Structures
              </Button>
              <Button as="a" href="/finance-calculator" variant="outline" size="md">
                Indicative Calculator
              </Button>
              <Button as="a" href="/trust" variant="ghost" size="md">
                Data Methodology
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
