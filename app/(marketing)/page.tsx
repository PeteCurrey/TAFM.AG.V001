import Link from 'next/link'
import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { generateMetadata } from '@/lib/seo/metadata'
import { HeroVisualClient } from '@/components/3d/HeroVisualClient'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = generateMetadata({
  title: 'TAFM — The Asset Finance Marketplace',
  description:
    'TAFM connects UK businesses, asset suppliers and finance providers around the acquisition of business equipment. One application, multiple financing possibilities.',
  canonical: '/',
  ogTitle: 'TAFM — The Asset Finance Marketplace',
  ogDescription: 'One asset. One application. Multiple financing possibilities.',
})

// ─── Asset categories ─────────────────────────────────────────────────────────

const ASSET_CATEGORIES = [
  { label: 'Construction Equipment',     slug: 'construction-equipment',  note: 'Excavators · Cranes · Piling rigs' },
  { label: 'Manufacturing Equipment',    slug: 'manufacturing-equipment', note: 'CNC machines · Presses · Robotics' },
  { label: 'Agricultural Equipment',     slug: 'agricultural-equipment',  note: 'Tractors · Combines · Irrigation' },
  { label: 'Commercial Vehicles',        slug: 'commercial-vehicles',     note: 'HGVs · Vans · Specialist vehicles' },
  { label: 'Medical Equipment',          slug: 'medical-equipment',       note: 'Imaging · Diagnostics · Surgical' },
  { label: 'Industrial Equipment',       slug: 'industrial-equipment',    note: 'Compressors · Generators · Handling' },
  { label: 'Technology & IT',            slug: 'technology-it-equipment', note: 'Servers · Network · Production tech' },
  { label: 'Renewable Energy',           slug: 'renewable-energy-equipment', note: 'Solar · Wind · Storage systems' },
  { label: 'Hospitality Equipment',      slug: 'hospitality-equipment',   note: 'Kitchen · HVAC · Refrigeration' },
  { label: 'Specialist Equipment',       slug: 'specialist-equipment',    note: 'Bespoke · Niche · Custom machinery' },
] as const

// ─── Finance structures ───────────────────────────────────────────────────────

const FINANCE_STRUCTURES = [
  {
    type: 'Hire Purchase',
    description:
      'The business pays instalments over a fixed term and owns the asset outright at the end. The asset appears on balance sheet from day one.',
    detail: 'Suitable for assets with long operational life and strong residual value.',
  },
  {
    type: 'Finance Lease',
    description:
      'The finance provider owns the asset. The business leases it for most of its economic life and benefits from use without capital outlay.',
    detail: 'Often structured with a secondary period or balloon payment.',
  },
  {
    type: 'Operating Lease',
    description:
      'Short-to-medium term lease of an asset. The lender retains risk on residual value. The business returns or upgrades the asset at term.',
    detail: 'Payments may be fully tax-deductible as an operating expense.',
  },
  {
    type: 'Asset Refinance',
    description:
      'Release capital tied up in assets already owned. The asset is sold to a finance provider and leased back, unlocking working capital.',
    detail: 'Useful for businesses with significant owned assets and short-term liquidity needs.',
  },
] as const

// ─── Lifecycle stages ─────────────────────────────────────────────────────────

const LIFECYCLE_STAGES = [
  { label: 'Acquire',    description: 'Identify and source the asset' },
  { label: 'Finance',    description: 'Secure the most suitable funding structure' },
  { label: 'Operate',    description: 'Deploy the asset in your business' },
  { label: 'Value',      description: 'Track performance and residual value' },
  { label: 'Refinance',  description: 'Release equity or restructure terms' },
  { label: 'Resell',     description: 'Exit the asset intelligently' },
] as const

// ─── Homepage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — DARK CINEMATIC HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="surface-dark relative min-h-dvh flex flex-col overflow-hidden"
        aria-label="TAFM — The Asset Finance Marketplace"
      >
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded text-body-sm"
        >
          Skip to main content
        </a>

        {/* Subtle orange atmospheric glow — background only */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 65% 40%, rgba(255,106,26,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Hero grid */}
        <div className="container-tafm flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-0 min-h-dvh">
          {/* Left: typography */}
          <div className="flex flex-col justify-center py-24 lg:py-0 lg:pr-16">
            {/* Eyebrow */}
            <p className="text-label text-[var(--color-text-on-dark-muted)] mb-8 tracking-widest">
              UK Asset Finance
            </p>

            {/* Primary headline — architectural weight through scale, not boldness */}
            <h1 className="text-display-2xl font-extralight text-white leading-[1.0] tracking-[0.04em] mb-6">
              THE ASSET
              <br />
              <span className="text-[var(--color-text-on-dark-2)]">FINANCE</span>
              <br />
              MARKETPLACE
            </h1>

            <p
              className="text-heading-lg font-light text-[var(--color-text-on-dark-2)] mb-4"
              style={{ letterSpacing: '0.01em' }}
            >
              Finance the asset.
              <br />
              Not the hassle.
            </p>

            <p className="text-body text-[var(--color-text-on-dark-3)] font-light max-w-md leading-relaxed mb-12">
              TAFM connects businesses, asset suppliers and finance providers around the acquisition of business equipment. One application. Multiple financing possibilities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Button as="a" href="/apply" variant="primary" size="lg">
                Explore asset finance
              </Button>
              <Button as="a" href="/for-suppliers" variant="secondary" size="lg">
                For suppliers
              </Button>
            </div>

            {/* Thin rule */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border-dark)]">
              <p className="text-caption text-[var(--color-text-on-dark-muted)] font-light">
                Finance subject to status and eligibility. Terms and conditions apply.
              </p>
            </div>
          </div>

          {/* Right: 3D visual */}
          <div
            className="hidden lg:flex items-center justify-center relative h-full min-h-[600px]"
            aria-hidden="true"
          >
            <HeroVisualClient />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="container-tafm pb-8 flex justify-start" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 opacity-30">
            <span className="text-caption text-white tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-white/30" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — LIGHT: WHAT TAFM DOES
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl" id="main-content">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="What we do"
                className="mb-0"
              >
                One asset.
                <br />
                One application.
                <br />
                Multiple financing possibilities.
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120}>
              <div className="space-y-8">
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  Acquiring business equipment involves a supplier, a finance provider, and a significant capital decision. TAFM brings these parties together through a single, structured process.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  We do not provide finance directly. We provide the infrastructure for businesses to engage with a network of specialist asset finance providers — with each application matched to products appropriate to the asset and the applicant.
                </p>
                <div className="pt-4">
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 text-body text-orange-500 hover:text-orange-600 transition-colors font-light group"
                  >
                    How the process works
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — LIGHT/EDITORIAL: ASSET CATEGORIES
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="off-white" spacing="2xl">
        <Container>
          <AnimateOnScroll>
            <SectionHeading
              as="h2"
              size="display-md"
              variant="light"
              eyebrow="Asset categories"
              subtitle="Finance for the full spectrum of business capital equipment."
              className="mb-16"
            >
              What are you acquiring?
            </SectionHeading>
          </AnimateOnScroll>

          {/* Editorial category list — not a card grid */}
          <div className="space-y-0">
            {ASSET_CATEGORIES.map((cat, index) => (
              <AnimateOnScroll key={cat.slug} delay={index * 40}>
                <Link
                  href={`/assets/${cat.slug}`}
                  className="group flex items-center justify-between py-5 border-b border-[var(--color-border-light)] hover:border-[var(--color-border-orange)] transition-all duration-[var(--duration-normal)]"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="text-caption text-[var(--color-text-on-light-muted)] w-6 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] group-hover:text-orange-600 transition-colors">
                        {cat.label}
                      </span>
                      <span className="hidden sm:inline ml-6 text-body-sm text-[var(--color-text-on-light-muted)]">
                        {cat.note}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-[var(--duration-normal)] translate-x-2 group-hover:translate-x-0"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12">
            <Link
              href="/assets"
              className="inline-flex items-center gap-2 text-body text-[var(--color-text-on-light-3)] hover:text-orange-500 transition-colors font-light group"
            >
              View all asset categories
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — DARK: THE TRANSACTION FLOW
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-2" spacing="2xl">
        <Container>
          <AnimateOnScroll>
            <SectionHeading
              as="h2"
              size="display-md"
              variant="dark"
              eyebrow="The transaction"
              className="mb-20"
              align="center"
            >
              How it connects
            </SectionHeading>
          </AnimateOnScroll>

          {/* Transaction flow — horizontal on desktop, vertical on mobile */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-0" role="list">
            {[
              { label: 'Business', sub: 'Identifies asset requirement' },
              { label: 'Supplier', sub: 'Provides quote and specification' },
              { label: 'TAFM', sub: 'Structures and manages the application', isHighlight: true },
              { label: 'Finance', sub: 'Assessed by the lender network' },
              { label: 'Transaction', sub: 'Asset acquired' },
            ].map((step, index, arr) => (
              <AnimateOnScroll key={step.label} delay={index * 100} className="flex flex-col md:flex-row items-center" role="listitem">
                {/* Step */}
                <div className="flex flex-col items-center text-center px-6 py-4">
                  <div
                    className={`w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center mb-3 ${
                      step.isHighlight
                        ? 'bg-orange-500/15 border border-[var(--color-border-orange)]'
                        : 'bg-white/5 border border-[var(--color-border-dark)]'
                    }`}
                    aria-hidden="true"
                  >
                    <span className={`text-label ${step.isHighlight ? 'text-orange-400' : 'text-[var(--color-text-on-dark-3)]'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    className={`text-body font-light mb-1 ${
                      step.isHighlight ? 'text-orange-400' : 'text-white'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-caption text-[var(--color-text-on-dark-3)] max-w-[120px] leading-relaxed">
                    {step.sub}
                  </p>
                </div>

                {/* Connector arrow */}
                {index < arr.length - 1 && (
                  <div
                    className="flex-shrink-0 text-orange-500/30 rotate-90 md:rotate-0 my-2 md:my-0"
                    aria-hidden="true"
                  >
                    <svg width="24" height="2" viewBox="0 0 24 2" fill="none">
                      <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1" />
                      <path d="M18 -2L22 1L18 4" stroke="currentColor" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                )}
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="text-center mt-16">
            <Button as="a" href="/how-it-works" variant="secondary" size="md">
              Understand the process
            </Button>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — LIGHT: FINANCE STRUCTURES
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll>
            <SectionHeading
              as="h2"
              size="display-md"
              variant="light"
              eyebrow="Finance structures"
              subtitle="Different assets and businesses suit different structures. Understanding the options is the starting point."
              className="mb-16"
            >
              How assets are financed
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {FINANCE_STRUCTURES.map((structure, index) => (
              <AnimateOnScroll key={structure.type} delay={index * 60}>
                <div
                  className={`p-8 border-b border-[var(--color-border-light)] ${
                    index % 2 === 0 ? 'md:border-r' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-1 h-8 bg-orange-500 flex-shrink-0 mt-1 rounded-full"
                      aria-hidden="true"
                    />
                    <h3 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">
                      {structure.type}
                    </h3>
                  </div>
                  <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-3 pl-5">
                    {structure.description}
                  </p>
                  <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)] pl-5">
                    {structure.detail}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12">
            <div className="flex flex-wrap gap-4">
              <Button as="a" href="/finance" variant="outline" size="md">
                Compare finance structures
              </Button>
              <Button as="a" href="/finance-calculator" variant="ghost" size="md">
                Finance calculator
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — OFF-WHITE: FOR SUPPLIERS
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="off-white" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="For asset suppliers"
                className="mb-0"
              >
                Turn finance into part
                <br />
                of your sales process.
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="space-y-6">
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  When a customer cannot immediately fund an asset purchase, the sale stalls. TAFM provides a structured route for your customers to access finance — with your quote at the centre of the application.
                </p>
                <ul className="space-y-3" role="list">
                  {[
                    'Your quote forms part of the application',
                    'No lender relationships to manage',
                    'Finance does not change your sale terms',
                    'Suitable for new and used equipment',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-2" aria-hidden="true" />
                      <span className="text-body font-light text-[var(--color-text-on-light-3)]">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button as="a" href="/for-suppliers" variant="primary" size="md">
                    Supplier proposition
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — DARK: FOR FINANCE PROVIDERS
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-3" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="dark"
                eyebrow="For finance providers"
                className="mb-0"
              >
                Access qualified
                <br />
                asset-finance demand.
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="space-y-6">
                <p className="text-body-lg font-light text-[var(--color-text-on-dark-2)] leading-relaxed">
                  TAFM is building the infrastructure to connect specialist asset finance providers with structured, asset-backed applications from UK businesses.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-dark-3)] leading-relaxed">
                  Applications are asset-centric. Each submission includes the asset specification, supplier quote, and business details — providing the foundation for informed underwriting decisions.
                </p>
                <div className="pt-4">
                  <Button as="a" href="/for-lenders" variant="secondary" size="md">
                    Finance provider proposition
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — DARK/CINEMATIC: ASSET LIFECYCLE
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark" spacing="2xl">
        {/* Atmospheric background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,106,26,0.04) 0%, transparent 70%)',
          }}
        />

        <Container className="relative">
          <AnimateOnScroll>
            <SectionHeading
              as="h2"
              size="display-md"
              variant="dark"
              eyebrow="The asset lifecycle"
              subtitle="Every asset has a lifecycle. TAFM is being built to support each stage — from acquisition to exit."
              className="mb-20"
              align="center"
            >
              Beyond the transaction
            </SectionHeading>
          </AnimateOnScroll>

          {/* Lifecycle stages — horizontal editorial flow */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4"
            role="list"
          >
            {LIFECYCLE_STAGES.map((stage, index) => (
              <AnimateOnScroll key={stage.label} delay={index * 80} role="listitem">
                <div className="flex flex-col items-center text-center group">
                  {/* Stage number */}
                  <div
                    className="w-10 h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-dark)] flex items-center justify-center mb-4 group-hover:border-[var(--color-border-orange)] transition-colors duration-[var(--duration-normal)]"
                    aria-hidden="true"
                  >
                    <span className="text-label text-[var(--color-text-on-dark-muted)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-body font-light text-white mb-2">{stage.label}</p>
                  <p className="text-caption text-[var(--color-text-on-dark-3)] leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Connector — visible only on large screens between stages */}
                  {index < LIFECYCLE_STAGES.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-5 text-[var(--color-border-dark)] text-xs" aria-hidden="true" />
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9 — LIGHT: INSIGHTS
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="flex items-end justify-between mb-12 gap-8 flex-wrap">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="Insights"
                className="mb-0"
              >
                Knowledge and perspective
                <br />
                on asset finance.
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={80}>
              <Link
                href="/insights"
                className="text-body text-[var(--color-text-on-light-3)] hover:text-orange-500 transition-colors font-light whitespace-nowrap"
              >
                View all insights →
              </Link>
            </AnimateOnScroll>
          </div>

          {/* Insight placeholder — truthful empty state */}
          <AnimateOnScroll>
            <div
              className="border border-[var(--color-border-light)] rounded-[var(--radius-md)] p-12 text-center"
            >
              <p className="text-body-sm text-[var(--color-text-on-light-muted)] font-light mb-2">
                Insights will appear here as content is published.
              </p>
              <Link
                href="/insights"
                className="text-body-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Visit the insights hub
              </Link>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10 — DARK: FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-2" spacing="2xl">
        {/* Atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,106,26,0.07) 0%, transparent 70%)',
          }}
        />

        <Container className="relative text-center">
          <AnimateOnScroll>
            <p className="text-label text-[var(--color-text-on-dark-muted)] mb-8 tracking-widest">
              Ready to begin
            </p>
            <h2 className="text-display-xl font-extralight text-white tracking-[0.04em] mb-4">
              Finance the asset.
            </h2>
            <p className="text-body-lg font-light text-[var(--color-text-on-dark-3)] max-w-lg mx-auto leading-relaxed mb-12">
              Start your asset finance application. One submission, assessed by specialist finance providers.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button as="a" href="/apply" variant="primary" size="lg">
                Start an Application
              </Button>
              <Button as="a" href="/finance-calculator" variant="secondary" size="lg">
                Finance calculator
              </Button>
            </div>

            <Divider variant="dark" spacing="lg" className="max-w-xs mx-auto" />

            <p className="text-caption text-[var(--color-text-on-dark-muted)] font-light max-w-md mx-auto leading-relaxed">
              Finance subject to status and eligibility. TAFM is a marketplace platform and does not provide financial advice or lending services.
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
