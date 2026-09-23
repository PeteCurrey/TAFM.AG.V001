import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { generateMetadata } from '@/lib/seo/metadata'
import { TransactionFlow } from '@/components/marketing/TransactionFlow'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = generateMetadata({
  title: 'TAFM — The Asset Finance Marketplace',
  description:
    'One asset. One application. Multiple financing possibilities. TAFM connects UK businesses, equipment suppliers and specialist finance providers around capital assets.',
  canonical: '/',
  ogTitle: 'TAFM — The Asset Finance Marketplace',
  ogDescription: 'One asset. One application. Multiple financing possibilities.',
})

// ─── Asset categories (10 real TAFM categories) ───────────────────────────────

const ASSET_CATEGORIES = [
  { label: 'Construction Equipment',      slug: 'construction-equipment',     note: 'Excavators · Cranes · Piling rigs · Groundworks' },
  { label: 'Manufacturing Equipment',     slug: 'manufacturing-equipment',    note: 'CNC machining · Presses · Robotics · Automation' },
  { label: 'Agricultural Equipment',      slug: 'agricultural-equipment',     note: 'Tractors · Combines · Telehandlers · Harvesting' },
  { label: 'Commercial Vehicles',         slug: 'commercial-vehicles',        note: 'HGVs · LGVs · Curtainsiders · Tankers' },
  { label: 'Heavy Vehicles',              slug: 'heavy-vehicles',             note: 'Low loaders · Tippers · Mixers · Sweepers' },
  { label: 'Industrial Equipment',        slug: 'industrial-equipment',       note: 'Compressors · Generators · Materials handling' },
  { label: 'Medical Equipment',           slug: 'medical-equipment',          note: 'MRI & CT · Diagnostic imaging · Surgical systems' },
  { label: 'Technology & IT Equipment',   slug: 'technology-it-equipment',    note: 'Servers · Data centre · Broadcast · Networking' },
  { label: 'Renewable Energy Equipment',  slug: 'renewable-energy-equipment', note: 'Solar PV · Wind turbines · Battery storage · EV' },
  { label: 'Specialist Equipment',        slug: 'specialist-equipment',       note: 'Bespoke access · Heavy lifting · Niche machinery' },
] as const

// ─── Finance structures ───────────────────────────────────────────────────────

const FINANCE_STRUCTURES = [
  {
    type: 'Hire Purchase',
    slug: 'hire-purchase',
    headline: 'Own the asset after completion of the agreement.',
    description:
      'The business pays structured instalments over a fixed term and acquires legal ownership outright upon final payment. The asset appears on balance sheet from commencement.',
    detail: 'Ideal for equipment with long operational life, predictable depreciation, and where outright ownership is the commercial goal.',
  },
  {
    type: 'Finance Lease',
    slug: 'finance-lease',
    headline: 'Finance the use of the asset while the provider retains ownership.',
    description:
      'The finance provider retains legal title while the business gains full operational use. Rentals can be offset against taxable profit, with VAT spread across monthly rentals.',
    detail: 'Ideal for businesses seeking operational flexibility, lower upfront VAT commitment, or secondary rental periods.',
  },
  {
    type: 'Operating Lease',
    slug: 'operating-lease',
    headline: 'Structure use around the asset and residual-value profile.',
    description:
      'Short-to-medium term lease where the lender takes residual value risk. Monthly payments are calculated on the depreciation during the lease period rather than capital cost.',
    detail: 'Well suited to rapidly depreciating technology, fleet commercial vehicles, and assets subject to scheduled cyclical replacement.',
  },
  {
    type: 'Asset Refinance',
    slug: 'asset-refinance',
    headline: 'Release capital from assets already owned, subject to provider criteria.',
    description:
      'Unlocks working capital tied up in existing unencumbered or partially paid machinery. The asset is sold to a finance provider and leased back without interrupting operations.',
    detail: 'Dependent on clear equipment title, documented maintenance provenance, and verified secondary market valuation.',
  },
] as const

// ─── Lifecycle stages ─────────────────────────────────────────────────────────

const LIFECYCLE_STAGES = [
  { step: '01', label: 'Acquire',   description: 'Identify equipment, supplier specifications and quote' },
  { step: '02', label: 'Finance',   description: 'Match requirement to specialist provider appetite' },
  { step: '03', label: 'Operate',   description: 'Deploy asset into commercial operations' },
  { step: '04', label: 'Value',     description: 'Track residual value and secondary market demand' },
  { step: '05', label: 'Refinance', description: 'Restructure equity or release capital mid-cycle' },
  { step: '06', label: 'Resell',    description: 'Exit, upgrade or remarket through verified channels' },
] as const

// ─── Homepage Component ───────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-dvh flex flex-col justify-between overflow-hidden bg-[#050505]"
        aria-label="TAFM — The Asset Finance Marketplace"
      >
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded text-body-sm"
        >
          Skip to main content
        </a>

        {/* Hero photographic background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Ruthmann STEIGER T 650 HF highflex access platform on Scania chassis — TAFM verified asset intelligence"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center lg:object-[center_right]"
          />
          {/* Directional scrim: darkens the left side for crisp typography */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full lg:w-[65%]"
            aria-hidden="true"
          />
          {/* Subtle top & bottom blend */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505] pointer-events-none"
            aria-hidden="true"
          />
          {/* Warm amber/orange rim light */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(ellipse 50% 50% at 75% 55%, rgba(255,106,26,0.18) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Hero content grid */}
        <div className="container-tafm relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center min-h-dvh">
          <div className="lg:col-span-7 flex flex-col justify-center py-24 lg:py-0 lg:pr-12">
            {/* System Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
              <p className="text-label text-[var(--color-text-on-dark-muted)] tracking-widest uppercase">
                UK Asset Finance Infrastructure
              </p>
            </div>

            {/* Primary headline */}
            <h1 className="text-display-xl font-extralight text-white leading-[1.0] tracking-[0.03em] mb-6 drop-shadow-sm">
              THE ASSET
              <br />
              <span className="text-[var(--color-text-on-dark-2)]">FINANCE</span>
              <br />
              MARKETPLACE
            </h1>

            {/* Core proposition */}
            <p className="text-heading-lg font-light text-white mb-4 tracking-tight drop-shadow-sm">
              One asset. One application. Multiple financing possibilities.
            </p>

            <p className="text-body font-light text-[var(--color-text-on-dark-2)] max-w-xl leading-relaxed mb-8 drop-shadow-sm">
              TAFM is the infrastructure layer connecting real capital equipment, commercial borrowers and specialist finance providers. Discover equipment intelligence, structure your requirement, and connect with eligible lenders without multiple fragmented applications.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Button as="a" href="/apply" variant="primary" size="lg">
                Start an Application
              </Button>
              <Button as="a" href="/assets" variant="secondary" size="lg">
                Explore Assets
              </Button>
            </div>

            {/* Verification & status badge */}
            <div className="mt-12 pt-6 border-t border-[var(--color-border-dark)] flex flex-wrap items-center gap-6">
              <div>
                <p className="text-caption text-[var(--color-text-on-dark-muted)] font-light">
                  Finance subject to status and eligibility. TAFM is an asset finance infrastructure platform, not a direct lender.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5 relative h-full pointer-events-none" aria-hidden="true" />
        </div>

        {/* Scroll indicator */}
        <div className="container-tafm relative z-10 pb-8 flex justify-start" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <span className="text-caption text-white tracking-widest font-mono text-[10px]">SCROLL TO EXPLORE</span>
            <div className="w-px h-8 bg-white/40" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — ASSET DISCOVERY: WHAT ARE YOU FINANCING?
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl" id="main-content">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="Asset Discovery"
                subtitle="Explore equipment categories supported by the TAFM provider network."
                className="mb-0"
              >
                What are you financing?
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <Link
                href="/assets"
                className="inline-flex items-center gap-2 text-body text-orange-600 hover:text-orange-700 font-light group"
              >
                View all categories
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </AnimateOnScroll>
          </div>

          {/* Architectural category list */}
          <div className="border-t border-[var(--color-border-light)]">
            {ASSET_CATEGORIES.map((cat, index) => (
              <AnimateOnScroll key={cat.slug} delay={index * 30}>
                <Link
                  href={`/assets/${cat.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-[var(--color-border-light)] hover:border-orange-500/50 hover:bg-orange-50/20 px-3 -mx-3 transition-all duration-200"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="text-caption font-mono text-[var(--color-text-on-light-muted)] w-6 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-heading-md font-light text-[var(--color-text-on-light-primary)] group-hover:text-orange-600 transition-colors">
                        {cat.label}
                      </span>
                      <span className="block sm:inline sm:ml-6 text-body-sm text-[var(--color-text-on-light-muted)] font-light mt-0.5 sm:mt-0">
                        {cat.note}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                    <span className="text-xs uppercase tracking-wider font-light">Explore category</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12 p-6 border border-[var(--color-border-light)] rounded-[var(--radius-sm)] bg-[var(--color-surface-off-white)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-body font-light text-[var(--color-text-on-light-primary)]">
                  Have an asset outside standard classifications?
                </p>
                <p className="text-body-sm font-light text-[var(--color-text-on-light-3)]">
                  TAFM supports bespoke machinery and niche industrial assets under Specialist Equipment.
                </p>
              </div>
              <Button as="a" href="/apply" variant="outline" size="sm" className="whitespace-nowrap">
                Submit custom requirement
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — SHOW THE TAFM SYSTEM (8-NODE VISUAL FLOW)
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-2" spacing="2xl">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <AnimateOnScroll>
              <p className="text-label text-[var(--color-text-on-dark-muted)] tracking-widest uppercase mb-4">
                Operating Architecture
              </p>
              <h2 className="text-display-md font-extralight text-white mb-6">
                The TAFM System
              </h2>
              <p className="text-body-lg font-light text-[var(--color-text-on-dark-2)] leading-relaxed">
                How an asset acquisition moves from manufacturer quote through deterministic structuring to independent provider underwriting.
              </p>
            </AnimateOnScroll>
          </div>

          {/* Visual 8-Node Flow */}
          <AnimateOnScroll>
            <div className="p-8 lg:p-12 border border-[var(--color-border-dark)] rounded-[var(--radius-md)] bg-[#080808]">
              <TransactionFlow />

              <div className="mt-12 pt-8 border-t border-[var(--color-border-dark)] grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-heading-sm font-light text-white mb-2">01. TAFM Structures & Facilitates</h3>
                  <p className="text-body-sm font-light text-[var(--color-text-on-dark-3)] leading-relaxed">
                    We capture the complete asset record, supplier quotation, and business profile into a standardised, verifiable application file.
                  </p>
                </div>
                <div>
                  <h3 className="text-heading-sm font-light text-white mb-2">02. Matching Is Not Approval</h3>
                  <p className="text-body-sm font-light text-[var(--color-text-on-dark-3)] leading-relaxed">
                    Matching reflects strict eligibility against published provider appetite criteria. It identifies participating providers with genuine appetite for the asset class.
                  </p>
                </div>
                <div>
                  <h3 className="text-heading-sm font-light text-white mb-2">03. Independent Underwriting</h3>
                  <p className="text-body-sm font-light text-[var(--color-text-on-dark-3)] leading-relaxed">
                    Each participating finance provider retains independent credit authority, conducting direct KYC/AML checks, rate pricing, and final commercial underwriting.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="text-center mt-12">
            <Button as="a" href="/how-it-works" variant="secondary" size="md">
              Detailed 8-stage process guide
            </Button>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — ASSET INTELLIGENCE SHOWCASE (Ruthmann STEIGER T 650 HF)
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark" spacing="2xl" className="border-t border-[var(--color-border-dark)]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Asset specification & overview */}
            <div className="lg:col-span-6 space-y-6">
              <AnimateOnScroll>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-orange-500/40 bg-orange-500/10 rounded-sm mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                  <span className="text-caption font-mono uppercase tracking-wider text-orange-400">
                    Flagship Verified Asset Record
                  </span>
                </div>

                <h2 className="text-display-md font-extralight text-white leading-tight mb-2">
                  Ruthmann STEIGER
                  <br />
                  <span className="text-[var(--color-text-on-dark-2)]">T 650 HF on Scania 8x4</span>
                </h2>
                <p className="text-body font-light text-[var(--color-text-on-dark-2)] leading-relaxed mb-6">
                  65m highflex access platform mounted on a 32-tonne Scania chassis. Fully verified asset specification with documented manufacturer provenance and external market observations.
                </p>

                {/* Technical Specifications Grid */}
                <div className="border border-[var(--color-border-dark)] rounded-sm p-6 bg-[#080808] space-y-4">
                  <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-dark-muted)]">
                    Verified Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-light">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-dark-muted)]">Working Height</span>
                      <span className="text-white font-mono text-base">65.0 m</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-dark-muted)]">Max Outreach</span>
                      <span className="text-white font-mono text-base">43.0 m</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-dark-muted)]">Chassis / GVW</span>
                      <span className="text-white font-mono text-base">Scania 8x4 (32t)</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-dark-muted)]">Year of Manufacture</span>
                      <span className="text-white font-mono text-base">2022</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-dark-muted)]">Operating Hours</span>
                      <span className="text-white font-mono text-base">1,450 hrs</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-dark-muted)]">Inspection</span>
                      <span className="text-emerald-400 font-mono text-base">Valid LOLER</span>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right: Market Observations (Strictly Separated: AUCTION vs ASKING) */}
            <div className="lg:col-span-6 space-y-6">
              <AnimateOnScroll delay={100}>
                <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#080808]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-label tracking-widest uppercase text-white font-light">
                      Market Observations
                    </h3>
                    <span className="text-caption font-mono text-[var(--color-text-on-dark-muted)]">
                      PROVENANCE: EXTERNAL
                    </span>
                  </div>

                  {/* Observation 1: Auction Result */}
                  <div className="mb-6 p-5 border-l-2 border-emerald-500 bg-[#0d0d0d] rounded-r-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono tracking-wider uppercase text-emerald-400 font-medium">
                        AUCTION RESULT (COMPLETED SALE)
                      </span>
                      <span className="text-caption font-mono text-[var(--color-text-on-dark-muted)]">
                        June 2024
                      </span>
                    </div>
                    <div className="text-display-sm font-extralight text-white font-mono my-1">
                      £620,000
                    </div>
                    <p className="text-caption text-[var(--color-text-on-dark-3)] font-light">
                      Source: Euro Auctions Leeds (Certified hammer price, Lot #4412). Reflects realised cash transaction at public commercial auction.
                    </p>
                  </div>

                  {/* Observation 2: Asking Price */}
                  <div className="mb-6 p-5 border-l-2 border-blue-500 bg-[#0d0d0d] rounded-r-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono tracking-wider uppercase text-blue-400 font-medium">
                        ASKING PRICE (DEALER ADVERTISED)
                      </span>
                      <span className="text-caption font-mono text-[var(--color-text-on-dark-muted)]">
                        September 2024
                      </span>
                    </div>
                    <div className="text-display-sm font-extralight text-white font-mono my-1">
                      £695,000
                    </div>
                    <p className="text-caption text-[var(--color-text-on-dark-3)] font-light">
                      Source: PlantTrader UK dealer listing. Advertised commercial asking price; subject to dealer trade terms and bilateral negotiation.
                    </p>
                  </div>

                  {/* Valuation Confidence Disclaimer — MANDATORY ASSET FINANCE RULE */}
                  <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-sm">
                    <p className="text-caption text-amber-300 font-light leading-relaxed">
                      <strong>Valuation Notice:</strong> Insufficient verified transaction data for a formal valuation.
                      TAFM presents real individual market observations but does not invent a synthetic automated valuation until robust statistical confidence thresholds are met. An asking price is never conflated with a sale price.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button as="a" href="/assets/specialist-equipment" variant="secondary" size="sm">
                      View specialist category
                    </Button>
                    <Button as="a" href="/apply" variant="primary" size="sm">
                      Finance this asset type
                    </Button>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — FINANCE BUILT AROUND THE ASSET
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="max-w-3xl mb-16">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="Commercial Structures"
                subtitle="Understanding available financing structures is the foundation of capital equipment acquisition."
              >
                Finance built around the asset.
              </SectionHeading>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[var(--color-border-light)]">
            {FINANCE_STRUCTURES.map((structure, index) => (
              <AnimateOnScroll key={structure.type} delay={index * 50}>
                <div className="p-8 lg:p-10 border-b border-r border-[var(--color-border-light)] hover:bg-orange-50/10 transition-colors flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-1 h-7 bg-orange-500 flex-shrink-0 mt-1 rounded-full" aria-hidden="true" />
                      <div>
                        <h3 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">
                          {structure.type}
                        </h3>
                        <p className="text-body-sm font-medium text-orange-600 mt-1">
                          {structure.headline}
                        </p>
                      </div>
                    </div>
                    <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-4 pl-5">
                      {structure.description}
                    </p>
                    <p className="text-caption font-light text-[var(--color-text-on-light-muted)] pl-5 mb-6">
                      {structure.detail}
                    </p>
                  </div>

                  <div className="pl-5 pt-4 border-t border-[var(--color-border-light)]/60">
                    <Link
                      href={`/finance/${structure.slug}`}
                      className="inline-flex items-center gap-1.5 text-body-sm text-orange-600 hover:text-orange-700 font-light group"
                    >
                      {structure.type} guide & considerations
                      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Important regulatory callout */}
          <AnimateOnScroll className="mt-12 p-6 border border-[var(--color-border-light)] rounded-[var(--radius-sm)] bg-[var(--color-surface-light)]">
            <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
              <strong className="font-medium text-[var(--color-text-on-light-primary)]">Commercial Availability:</strong> Different structures suit different asset depreciation curves and corporate tax positions. Not every structure is available for every asset type or borrower profile. TAFM provides informational guides and deterministic criteria matching, not regulated financial or tax advice.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-8 flex flex-wrap gap-4">
            <Button as="a" href="/finance" variant="outline" size="md">
              Compare all finance structures
            </Button>
            <Button as="a" href="/finance-calculator" variant="ghost" size="md">
              Indicative finance calculator
            </Button>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — THREE SIDES OF THE PLATFORM
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-3" spacing="2xl">
        <Container>
          <div className="max-w-3xl mb-16">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="dark"
                eyebrow="Marketplace Triad"
                subtitle="TAFM aligns the three parties essential to every commercial equipment transaction."
              >
                Three sides of the platform.
              </SectionHeading>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* For Businesses */}
            <AnimateOnScroll delay={40}>
              <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#090909] flex flex-col justify-between h-full">
                <div>
                  <div className="w-10 h-10 rounded-sm border border-orange-500/40 bg-orange-500/10 flex items-center justify-center mb-6">
                    <span className="text-orange-400 font-mono text-xs">01</span>
                  </div>
                  <h3 className="text-heading-lg font-light text-white mb-2">
                    For Businesses
                  </h3>
                  <p className="text-body-sm font-medium text-orange-400 mb-4">
                    Find finance for the asset you need.
                  </p>
                  <p className="text-body-sm font-light text-[var(--color-text-on-dark-3)] leading-relaxed mb-6">
                    Explore verified machinery records, structure your requirement parameters, and submit one comprehensive application. Your requirement is assessed by participating specialist lenders without fragmented negotiations.
                  </p>
                </div>
                <div className="pt-6 border-t border-[var(--color-border-dark)]">
                  <Button as="a" href="/apply" variant="primary" size="md" fullWidth>
                    Start an Application
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>

            {/* For Suppliers */}
            <AnimateOnScroll delay={80}>
              <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#090909] flex flex-col justify-between h-full">
                <div>
                  <div className="w-10 h-10 rounded-sm border border-white/20 bg-white/5 flex items-center justify-center mb-6">
                    <span className="text-white/60 font-mono text-xs">02</span>
                  </div>
                  <h3 className="text-heading-lg font-light text-white mb-2">
                    For Suppliers
                  </h3>
                  <p className="text-body-sm font-medium text-white/80 mb-4">
                    Keep finance inside the sale.
                  </p>
                  <p className="text-body-sm font-light text-[var(--color-text-on-dark-3)] leading-relaxed mb-6">
                    Help your customers access asset-backed funding with your quotation at the core of the application. You remain the supplier of record, maintain sale terms, and avoid managing multiple lender relationships.
                  </p>
                </div>
                <div className="pt-6 border-t border-[var(--color-border-dark)]">
                  <Button as="a" href="/for-suppliers" variant="secondary" size="md" fullWidth>
                    For Suppliers
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>

            {/* For Finance Providers */}
            <AnimateOnScroll delay={120}>
              <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#090909] flex flex-col justify-between h-full">
                <div>
                  <div className="w-10 h-10 rounded-sm border border-white/20 bg-white/5 flex items-center justify-center mb-6">
                    <span className="text-white/60 font-mono text-xs">03</span>
                  </div>
                  <h3 className="text-heading-lg font-light text-white mb-2">
                    For Finance Providers
                  </h3>
                  <p className="text-body-sm font-medium text-white/80 mb-4">
                    Structured asset-backed demand.
                  </p>
                  <p className="text-body-sm font-light text-[var(--color-text-on-dark-3)] leading-relaxed mb-6">
                    Receive verified submissions containing equipment specifications, supplier quotes, borrower accounts, and auditable criteria matching. You retain complete underwriting authority and commercial terms control.
                  </p>
                </div>
                <div className="pt-6 border-t border-[var(--color-border-dark)]">
                  <Button as="a" href="/for-lenders" variant="secondary" size="md" fullWidth>
                    For Finance Providers
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — ASSET LIFECYCLE
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark" spacing="2xl">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,106,26,0.05) 0%, transparent 70%)',
          }}
        />

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <AnimateOnScroll>
              <p className="text-label text-[var(--color-text-on-dark-muted)] tracking-widest uppercase mb-4">
                Full Lifecycle Perspective
              </p>
              <h2 className="text-display-md font-extralight text-white mb-6">
                Beyond the transaction
              </h2>
              <p className="text-body-lg font-light text-[var(--color-text-on-dark-2)] leading-relaxed">
                TAFM is building an infrastructure layer around the entire asset lifecycle — supporting equipment from origination to secondary remarketing.
              </p>
            </AnimateOnScroll>
          </div>

          {/* Lifecycle stages */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" role="list">
            {LIFECYCLE_STAGES.map((stage, index) => (
              <AnimateOnScroll key={stage.label} delay={index * 60} role="listitem">
                <div className="p-6 border border-[var(--color-border-dark)] rounded-sm bg-[#080808] flex flex-col items-center text-center h-full hover:border-orange-500/40 transition-colors">
                  <span className="text-caption font-mono text-orange-400 mb-2">{stage.step}</span>
                  <h3 className="text-body font-light text-white mb-2">{stage.label}</h3>
                  <p className="text-caption font-light text-[var(--color-text-on-dark-3)] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12 text-center">
            <p className="text-caption font-light text-[var(--color-text-on-dark-muted)] max-w-xl mx-auto">
              Notice: TAFM is progressively developing its lifecycle infrastructure. While initial focus is commercial origination and matching, our data models are engineered for ongoing residual tracking.
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — TRUST & TRANSPARENCY PREVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <AnimateOnScroll>
                <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)]">
                  Data Governance
                </p>
                <h2 className="text-display-md font-extralight text-[var(--color-text-on-light-primary)] leading-tight">
                  Truthful by design.
                  <br />
                  Data provenance first.
                </h2>
                <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  TAFM’s credibility rests on rigorous data classification. Every material data point is explicitly tagged as Verified, Known, Inferred, or Unknown.
                </p>
                <ul className="space-y-3 font-light text-body-sm text-[var(--color-text-on-light-3)]" role="list">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Asking prices vs Sale prices:</strong> Never combined or conflated into artificial values.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Deterministic criteria:</strong> Lenders evaluate versioned, auditable underwriting rules.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>AI Boundaries:</strong> AI assists with document extraction, not automated credit decisions.</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button as="a" href="/trust" variant="outline" size="md">
                    Read our Trust & Data methodology
                  </Button>
                </div>
              </AnimateOnScroll>
            </div>

            <div className="lg:col-span-6">
              <AnimateOnScroll delay={100}>
                <div className="p-8 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)] space-y-6">
                  <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)]">
                    TAFM Data Classification Standard
                  </h3>
                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-3 border border-emerald-300 bg-emerald-50/50 rounded-sm">
                      <span className="text-emerald-800 font-semibold">VERIFIED</span>
                      <p className="font-sans text-[var(--color-text-on-light-2)] mt-1">Confirmed directly by manufacturer specification or certified auction transcript.</p>
                    </div>
                    <div className="p-3 border border-blue-300 bg-blue-50/50 rounded-sm">
                      <span className="text-blue-800 font-semibold">KNOWN</span>
                      <p className="font-sans text-[var(--color-text-on-light-2)] mt-1">Documented dealer asking price or published provider appetite criteria.</p>
                    </div>
                    <div className="p-3 border border-amber-300 bg-amber-50/50 rounded-sm">
                      <span className="text-amber-800 font-semibold">INFERRED</span>
                      <p className="font-sans text-[var(--color-text-on-light-2)] mt-1">Calculated indicative amortization or statistical range with stated confidence.</p>
                    </div>
                    <div className="p-3 border border-gray-300 bg-gray-50/50 rounded-sm">
                      <span className="text-gray-800 font-semibold">UNKNOWN</span>
                      <p className="font-sans text-[var(--color-text-on-light-2)] mt-1">Explicitly marked when market observation volume is insufficient for valuation.</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9 — FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-2" spacing="2xl">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,106,26,0.08) 0%, transparent 70%)',
          }}
        />

        <Container className="relative text-center">
          <AnimateOnScroll>
            <p className="text-label text-[var(--color-text-on-dark-muted)] tracking-widest uppercase mb-6">
              Start Your Requirement
            </p>
            <h2 className="text-display-xl font-extralight text-white tracking-[0.03em] mb-4">
              Finance the asset.
            </h2>
            <p className="text-body-lg font-light text-[var(--color-text-on-dark-2)] max-w-xl mx-auto leading-relaxed mb-10">
              One application. Structured asset intelligence. Assessed by specialist asset finance providers.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button as="a" href="/apply" variant="primary" size="lg">
                Start an Application
              </Button>
              <Button as="a" href="/finance-calculator" variant="secondary" size="lg">
                Finance Calculator
              </Button>
            </div>

            <Divider variant="dark" spacing="lg" className="max-w-xs mx-auto" />

            <p className="text-caption text-[var(--color-text-on-dark-muted)] font-light max-w-md mx-auto leading-relaxed">
              Finance subject to status and eligibility. TAFM is a commercial infrastructure and marketplace platform. Credit decisions are made independently by participating finance providers.
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
