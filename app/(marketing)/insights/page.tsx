import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Insights & Editorial Architecture | UK Asset Finance Intelligence',
  description:
    'TAFM Editorial Hub — structured commentary, market observations, finance structure analysis, and transaction intelligence across UK commercial equipment sectors.',
  canonical: '/insights',
  robots: 'noindex, follow', // Deliberate publication gate: unindexed until genuine editorial articles are published
})

const EDITORIAL_PILLARS = [
  {
    category: 'Asset Finance',
    tagline: 'Lending Market Analysis & Commercial Trends',
    scope: 'In-depth coverage of UK commercial lending liquidity, interest rate benchmark developments, capital allowance legislative shifts, and SME financing availability.',
  },
  {
    category: 'Market Intelligence',
    tagline: 'Secondary Equipment Values & Auction Trends',
    scope: 'Empirical reports comparing auction hammer prices, dealer asking premiums, and residual value depreciation curves across plant, commercial transport, and industrial machinery.',
  },
  {
    category: 'Asset Intelligence',
    tagline: 'Engineering Specs, Telematics & Provenance',
    scope: 'Technical breakdowns of OEM model innovations, electrification of heavy equipment, stage-V emissions compliance, and digital machine verification.',
  },
  {
    category: 'Finance Structures',
    tagline: 'Structural Guides & Accounting Analysis',
    scope: 'Expert examination of Hire Purchase, Finance Lease, Operating Lease, and Refinance mechanics under UK GAAP, FRS 102, and IFRS 16.',
  },
  {
    category: 'Industry Sectors',
    tagline: 'Sector-Specific Capital Equipment Demand',
    scope: 'Dedicated commentary on construction, haulage, precision manufacturing, agriculture, renewable energy, and healthcare capital investments.',
  },
  {
    category: 'Transaction Intelligence',
    tagline: 'Deal Structuring & Underwriting Dynamics',
    scope: 'Insights into lender appetite configurations, credit committee expectations, documentation quality, and transaction turnaround velocity.',
  },
  {
    category: 'TAFM Platform',
    tagline: 'Marketplace Engineering & Data Standards',
    scope: 'Technical documentation detailing our deterministic criteria matching, data provenance tracking, and API integrations with UK lending desks.',
  },
]

export default function InsightsPage() {
  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Insights', current: true }]}
            variant="dark"
            className="mb-8"
          />

          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                TAFM Editorial Publication
              </span>
            </div>

            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Marketplace Knowledge Hub"
            >
              The TAFM
              <br />
              Knowledge Hub.
            </SectionHeading>

            <p className="text-body-lg font-light text-neutral-300 max-w-3xl leading-relaxed mt-4">
              TAFM is committed to substantive, evidence-based commentary on the UK asset finance market. We do not publish mass AI-generated SEO articles. Every piece in our forthcoming publication is authored by industrial equipment and asset finance specialists.
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. EDITORIAL PILLARS ──────────────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Publication Scope
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              The Seven Editorial Pillars
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Our editorial pipeline covers seven distinct domains across UK business finance and industrial equipment:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDITORIAL_PILLARS.map((pillar) => (
              <div
                key={pillar.category}
                className="p-6 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-orange-600 font-semibold block mb-1">
                    {pillar.category}
                  </span>
                  <h3 className="text-body font-medium text-neutral-900 mb-2">
                    {pillar.tagline}
                  </h3>
                  <p className="text-body-sm font-light text-neutral-600 leading-relaxed">
                    {pillar.scope}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Publication Gate Staging Notice */}
          <div className="mt-12 p-8 rounded border border-neutral-200 bg-neutral-50 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-100 text-amber-900 font-mono text-xs uppercase">
              <span>ⓘ</span>
              <span>Editorial Governance Notice</span>
            </div>
            <h3 className="text-heading-md font-light text-neutral-900">
              Editorial Pipeline in Staging
            </h3>
            <p className="text-body-sm font-light text-neutral-600 leading-relaxed">
              In accordance with TAFM’s Data Truth and Publication Gate policies, this publication remains unindexed until our initial cohort of verified industry case studies, market data analyses, and legal structure commentaries completes peer review.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Button as="a" href="/finance" variant="primary" size="md">
                Explore Finance Structures
              </Button>
              <Button as="a" href="/assets" variant="outline" size="md">
                Browse Asset Taxonomy
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
