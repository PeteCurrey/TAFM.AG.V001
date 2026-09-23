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
  title: 'TAFM — The Asset Finance Marketplace | UK Business Equipment Finance',
  description:
    'TAFM connects UK businesses, equipment suppliers and specialist finance providers around the acquisition of capital equipment. One application, multiple financing possibilities.',
  canonical: '/',
  ogTitle: 'TAFM — The Asset Finance Marketplace',
  ogDescription: 'One asset. One application. Multiple financing possibilities.',
})

// ─── Asset categories taxonomy ───────────────────────────────────────────────

const ASSET_CATEGORIES = [
  { label: 'Construction Equipment',     slug: 'construction-equipment',  note: 'Excavators · Cranes · Piling rigs' },
  { label: 'Commercial Vehicles',        slug: 'commercial-vehicles',     note: 'HGVs · Tractor units · Rigid trucks' },
  { label: 'Manufacturing Machinery',    slug: 'manufacturing-equipment', note: 'CNC mills · Press brakes · Robotics' },
  { label: 'Heavy Plant & Transport',    slug: 'heavy-vehicles',          note: 'Low loaders · Tippers · Mixers' },
  { label: 'Agricultural Machinery',     slug: 'agricultural-equipment',  note: 'Tractors · Combines · Telehandlers' },
  { label: 'Industrial Equipment',       slug: 'industrial-equipment',    note: 'Compressors · Generators · Forklifts' },
  { label: 'Medical & Healthcare',       slug: 'medical-equipment',       note: 'MRI · Diagnostic systems · Surgical' },
  { label: 'Specialist Equipment',       slug: 'specialist-equipment',    note: 'High-reach access · Bespoke plant' },
] as const

// ─── Finance structures ───────────────────────────────────────────────────────

const FINANCE_STRUCTURES = [
  {
    type: 'Hire Purchase',
    slug: 'hire-purchase',
    highlight: 'Ownership Focus',
    description:
      'The business pays instalments over a fixed term and owns the asset outright at the end. The asset appears on balance sheet from day one with full capital allowances claimable.',
    detail: 'Optimal for long-life plant, permanent commercial vehicles, and machinery retained long term.',
  },
  {
    type: 'Finance Lease',
    slug: 'finance-lease',
    highlight: 'VAT & Cash Flow Efficiency',
    description:
      'The finance provider owns the asset. The business leases it for its economic life without large upfront VAT outlay. Up to 95% of secondary resale value is returned to you as a rebate.',
    detail: 'VAT is charged incrementally on monthly rentals rather than paid in full upfront.',
  },
  {
    type: 'Operating Lease',
    slug: 'operating-lease',
    highlight: 'Lowest Monthly Outlay',
    description:
      'Short-to-medium term lease of an asset where the lender retains full residual value risk. Return or upgrade the equipment at term conclusion with minimal balance sheet exposure.',
    detail: 'Ideal for fast-depreciating technology, commercial fleets, or fixed-duration contracts.',
  },
  {
    type: 'Asset Refinance',
    slug: 'asset-refinance',
    highlight: 'Capital Release',
    description:
      'Release liquid capital tied up in plant and machinery your business already owns. The equipment is sold to a finance provider and leased back, keeping operations 100% uninterrupted.',
    detail: 'Reinvest tied-up equity into new expansion contracts or working capital liquidity.',
  },
] as const

// ─── Lifecycle stages ─────────────────────────────────────────────────────────

const LIFECYCLE_STAGES = [
  { label: 'Acquire',    description: 'Source new or used equipment from an authorized UK supplier' },
  { label: 'Finance',    description: 'Structure funding matched deterministically to lender appetite' },
  { label: 'Operate',    description: 'Deploy the machinery immediately into revenue-generating service' },
  { label: 'Value',      description: 'Track ongoing residual value against certified auction benchmarks' },
  { label: 'Refinance',  description: 'Release embedded equity to fund subsequent business expansion' },
  { label: 'Resell / Exit', description: 'Remarket or upgrade the equipment intelligently at lifecycle conclusion' },
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
            alt="Ruthmann STEIGER T 650 HF truck-mounted aerial platform — TAFM asset finance"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center lg:object-[center_right]"
          />
          {/* Directional scrim: darkens text area on the left */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full lg:w-[65%]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(ellipse 50% 50% at 75% 55%, rgba(255,106,26,0.18) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="container-tafm relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center min-h-dvh py-24 lg:py-0">
          <div className="lg:col-span-7 flex flex-col justify-center lg:pr-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                UK Asset Finance Marketplace
              </span>
            </div>

            <h1 className="text-display-xl font-extralight text-white leading-[1.0] tracking-[0.04em] mb-5 drop-shadow-sm">
              THE ASSET
              <br />
              <span className="text-neutral-400">FINANCE</span>
              <br />
              MARKETPLACE
            </h1>

            <p className="text-heading-md font-light text-neutral-300 mb-4 drop-shadow-sm">
              Finance the asset. Not the hassle.
            </p>

            <p className="text-body-sm text-neutral-400 font-light max-w-lg leading-relaxed mb-8 drop-shadow-sm">
              TAFM connects UK businesses, equipment suppliers and specialist finance providers around the acquisition of business equipment. One structured application. Multiple verified financing possibilities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Button as="a" href="/apply" variant="primary" size="md">
                Start an Application
              </Button>
              <Button as="a" href="/assets" variant="secondary" size="md">
                Explore Asset Taxonomy
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-caption text-neutral-500 font-light font-mono">
                Finance subject to status and eligibility. TAFM is a commercial marketplace infrastructure provider.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="container-tafm relative z-10 pb-8 hidden sm:flex justify-start" aria-hidden="true">
          <div className="flex items-center gap-3 opacity-40">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] text-white tracking-widest font-mono uppercase">SCROLL TO EXPLORE MARKETPLACE</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — PROPOSITION & CORE FUNCTION
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl" id="main-content">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="Marketplace Architecture"
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
              <div className="space-y-6">
                <p className="text-body-lg font-light text-neutral-800 leading-relaxed">
                  Acquiring capital equipment involves three distinct parties: the equipment vendor, the acquiring business, and the institutional finance provider. Traditional broker models rely on subjective manual submissions and single-lender bias.
                </p>
                <p className="text-body font-light text-neutral-600 leading-relaxed">
                  TAFM replaces this friction with standardized marketplace infrastructure. We structure application data around verified machine specifications, supplier quotes, and deterministic lender criteria—routing deals exclusively to providers with active appetite.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 text-body text-orange-600 hover:text-orange-700 transition-colors font-medium group"
                  >
                    Explore the 9-stage transaction process
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — ASSET DISCOVERY (TAXONOMY)
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="off-white" spacing="2xl">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="Asset Taxonomy"
                subtitle="Financing solutions across all major UK capital equipment sectors."
                className="mb-0"
              >
                What are you acquiring?
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={80}>
              <Link
                href="/assets"
                className="text-body-sm text-neutral-700 hover:text-orange-600 transition-colors font-light underline underline-offset-4"
              >
                View all 11 asset categories →
              </Link>
            </AnimateOnScroll>
          </div>

          {/* Editorial category list */}
          <div className="space-y-0">
            {ASSET_CATEGORIES.map((cat, index) => (
              <AnimateOnScroll key={cat.slug} delay={index * 30}>
                <Link
                  href={`/assets/${cat.slug}`}
                  className="group flex items-center justify-between py-5 border-b border-neutral-200 hover:border-orange-500 transition-all duration-200"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="text-caption font-mono text-neutral-400 w-6 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-heading-lg font-light text-neutral-900 group-hover:text-orange-600 transition-colors">
                        {cat.label}
                      </span>
                      <span className="hidden sm:inline ml-6 text-body-sm font-light text-neutral-500">
                        {cat.note}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — REAL VERIFIED ASSET INTELLIGENCE FEATURE (SECTION 13)
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark" spacing="2xl" className="border-t border-white/10">
        <Container>
          <div className="mb-12">
            <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
              Live Asset Intelligence Feature
            </span>
            <h2 className="text-display-md font-extralight text-white mt-2">
              Verified Asset & Market Evidence
            </h2>
            <p className="text-body text-neutral-400 font-light mt-2 max-w-2xl">
              An empirical showcase of TAFM asset data: official manufacturer specifications alongside strictly separated public auction hammer prices and dealer asking listings.
            </p>
          </div>

          {/* Verified Asset Dossier Card */}
          <div className="p-8 sm:p-10 rounded border border-white/15 bg-[#0a0a0a] shadow-2xl space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    DATA STATUS: VERIFIED
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Entity ID: Ruthmann STEIGER T 650 HF (2022)
                  </span>
                </div>
                <h3 className="text-display-sm font-extralight text-white">
                  Ruthmann STEIGER T 650 HF on Scania 8x4 (32t)
                </h3>
                <p className="text-body-sm text-neutral-400 font-light mt-1">
                  65m Highflex truck-mounted access platform mounted on Scania P 450 XT 8x4 rigid chassis.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  as="a"
                  href="/assets/specialist-equipment/ruthmann-steiger-t-650-hf-scania-2022"
                  variant="primary"
                  size="md"
                >
                  Inspect Full Asset Record →
                </Button>
              </div>
            </div>

            {/* Specifications Grid */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Verified Engineering Specifications
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded bg-white/[0.02] border border-white/5 font-mono text-xs">
                <div>
                  <span className="text-neutral-500 block">Working Height</span>
                  <span className="text-white text-sm font-medium mt-0.5 block">65.0 m</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Max Outreach</span>
                  <span className="text-white text-sm font-medium mt-0.5 block">43.0 m</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Carrier Chassis</span>
                  <span className="text-white text-sm font-medium mt-0.5 block">Scania 8x4 (32t)</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Safety Certification</span>
                  <span className="text-white text-sm font-medium mt-0.5 block">LOLER Valid</span>
                </div>
              </div>
            </div>

            {/* Real Market Observations Breakdown */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Empirical Market Observations (Strictly Separated)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded border border-emerald-500/30 bg-emerald-950/20">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                    AUCTION HAMMER RESULT (COMPLETED SALE)
                  </span>
                  <span className="text-display-sm font-extralight text-white font-mono block my-1">
                    £620,000
                  </span>
                  <span className="text-caption text-neutral-400 block font-light">
                    Euro Auctions Leeds · Verified Hammer Transcript (Ref: EA-LDS-2024-LOT-4412)
                  </span>
                </div>

                <div className="p-5 rounded border border-amber-500/30 bg-amber-950/20">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                    DEALER ASKING LISTING (ADVERTISED)
                  </span>
                  <span className="text-display-sm font-extralight text-white font-mono block my-1">
                    £695,000
                  </span>
                  <span className="text-caption text-neutral-400 block font-light">
                    PlantTrader UK · Commercial Dealer Advertised Price (Ref: PT-UK-882194)
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-caption font-light text-neutral-400">
                <p>
                  <strong className="text-neutral-300 font-normal">Valuation Governance:</strong> Insufficient verified repeat transaction pairs for an algorithmic valuation. Real observations are displayed independently without artificial conflation.
                </p>
                <Link href="/trust" className="text-orange-400 hover:text-orange-300 font-mono underline shrink-0">
                  Our Data Standards →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — TRANSACTION FLOW
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-2" spacing="2xl" className="border-t border-white/10">
        <Container>
          <AnimateOnScroll>
            <SectionHeading
              as="h2"
              size="display-md"
              variant="dark"
              eyebrow="The Transaction"
              className="mb-16"
              align="center"
            >
              How It Connects
            </SectionHeading>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <TransactionFlow className="mt-4" />
          </AnimateOnScroll>

          <AnimateOnScroll className="text-center mt-16">
            <Button as="a" href="/how-it-works" variant="secondary" size="md">
              Understand the 9-Stage Transaction Process
            </Button>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — FINANCE STRUCTURES
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="display-md"
                variant="light"
                eyebrow="Commercial Financing Structures"
                subtitle="Understanding ownership mechanics and tax treatment is the starting point of capital planning."
                className="mb-0"
              >
                How Assets Are Financed
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={80}>
              <Link
                href="/finance"
                className="text-body-sm text-neutral-700 hover:text-orange-600 transition-colors font-light underline underline-offset-4"
              >
                Compare full comparison matrix →
              </Link>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FINANCE_STRUCTURES.map((structure, index) => (
              <AnimateOnScroll key={structure.type} delay={index * 50}>
                <div className="p-8 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono uppercase text-orange-600 font-semibold">
                        {structure.highlight}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        UK Commercial Structure
                      </span>
                    </div>

                    <h3 className="text-heading-lg font-light text-neutral-900 mb-3">
                      {structure.type}
                    </h3>

                    <p className="text-body-sm font-light text-neutral-600 leading-relaxed mb-4">
                      {structure.description}
                    </p>

                    <p className="text-caption font-light text-neutral-500 leading-relaxed">
                      {structure.detail}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href={`/finance/${structure.slug}`}
                      className="text-body-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
                    >
                      Read {structure.type} Guide →
                    </Link>
                    <Button as="a" href={`/apply?structure=${encodeURIComponent(structure.type)}`} variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — COMMERCIAL PATHWAYS (BUSINESS / SUPPLIER / PROVIDER)
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-3" spacing="2xl" className="border-t border-white/10">
        <Container>
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
              Three Commercial Pathways
            </span>
            <h2 className="text-display-md font-extralight text-white mt-2">
              Who TAFM Connects
            </h2>
            <p className="text-body text-neutral-400 font-light mt-2">
              Dedicated infrastructure designed for each participant in UK equipment financing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pathway 1: For Businesses */}
            <div className="p-8 rounded border border-white/10 bg-[#0a0a0a] flex flex-col justify-between space-y-6">
              <div>
                <span className="text-caption font-mono uppercase text-neutral-400 block mb-2">Pathway 01</span>
                <h3 className="text-heading-lg font-light text-white mb-3">For Businesses</h3>
                <p className="text-body-sm text-neutral-300 font-light leading-relaxed mb-4">
                  Acquire mission-critical machinery and vehicles without depleting your operating liquidity. One structured application is assessed by pre-matched UK lenders with verified appetite.
                </p>
                <ul className="space-y-2 text-caption text-neutral-400 font-light">
                  <li>• Fixed monthly payments protecting cash flow</li>
                  <li>• Suitable for new and pre-owned machinery</li>
                  <li>• Tax-efficient structures & capital allowances</li>
                </ul>
              </div>
              <Button as="a" href="/apply" variant="primary" fullWidth size="md">
                Start an Application
              </Button>
            </div>

            {/* Pathway 2: For Suppliers */}
            <div className="p-8 rounded border border-white/10 bg-[#0a0a0a] flex flex-col justify-between space-y-6">
              <div>
                <span className="text-caption font-mono uppercase text-neutral-400 block mb-2">Pathway 02</span>
                <h3 className="text-heading-lg font-light text-white mb-3">For Suppliers & OEMs</h3>
                <p className="text-body-sm text-neutral-300 font-light leading-relaxed mb-4">
                  Turn finance into part of your sales cycle. When prospective equipment buyers face upfront capital constraints, integrate TAFM to close sales without managing lender agencies.
                </p>
                <ul className="space-y-2 text-caption text-neutral-400 font-light">
                  <li>• Remain the supplier of record on every deal</li>
                  <li>• Zero lender relationship overhead</li>
                  <li>• Direct commercial settlement on transaction</li>
                </ul>
              </div>
              <Button as="a" href="/for-suppliers" variant="secondary" fullWidth size="md">
                Supplier Proposition
              </Button>
            </div>

            {/* Pathway 3: For Finance Providers */}
            <div className="p-8 rounded border border-white/10 bg-[#0a0a0a] flex flex-col justify-between space-y-6">
              <div>
                <span className="text-caption font-mono uppercase text-neutral-400 block mb-2">Pathway 03</span>
                <h3 className="text-heading-lg font-light text-white mb-3">For Finance Providers</h3>
                <p className="text-body-sm text-neutral-300 font-light leading-relaxed mb-4">
                  Access standardized, asset-backed commercial borrowing demand. Submissions include verified equipment specs, supplier pro-formas, and corporate KYC data matched to your criteria.
                </p>
                <ul className="space-y-2 text-caption text-neutral-400 font-light">
                  <li>• Deterministic criteria-based deal matching</li>
                  <li>• 100% provider underwriting & credit autonomy</li>
                  <li>• Digital API and portal deal delivery</li>
                </ul>
              </div>
              <Button as="a" href="/for-lenders" variant="secondary" fullWidth size="md">
                Institutional Proposition
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — ASSET LIFECYCLE
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark" spacing="2xl">
        <Container>
          <AnimateOnScroll>
            <SectionHeading
              as="h2"
              size="display-md"
              variant="dark"
              eyebrow="The Asset Lifecycle"
              subtitle="Capital machinery has an economic lifecycle. TAFM is engineered to support your business at each milestone."
              className="mb-16"
              align="center"
            >
              Beyond The Initial Acquisition
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {LIFECYCLE_STAGES.map((stage, index) => (
              <AnimateOnScroll key={stage.label} delay={index * 60}>
                <div className="p-5 rounded border border-white/10 bg-white/[0.02] flex flex-col items-center text-center group hover:border-orange-500/50 transition-colors h-full">
                  <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center mb-3 group-hover:border-orange-500 transition-colors">
                    <span className="text-caption font-mono text-neutral-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-body font-normal text-white mb-1.5">{stage.label}</h3>
                  <p className="text-caption text-neutral-400 font-light leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9 — TRUST & TRANSPARENCY
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="light" spacing="2xl" className="border-t border-neutral-200">
        <Container>
          <div className="p-8 sm:p-12 rounded border border-neutral-200 bg-white shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
                Data Integrity
              </span>
              <h2 className="text-heading-xl font-light text-neutral-900">
                Grounding Commercial Finance in Verified Facts
              </h2>
              <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                TAFM maintains an immutable distinction between verified facts and computational inferences. We record four explicit data states (`VERIFIED`, `KNOWN`, `INFERRED`, `UNKNOWN`) and never treat asking prices as completed sales.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">VERIFIED</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">KNOWN</span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">INFERRED</span>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">UNKNOWN</span>
              </div>
            </div>

            <div className="shrink-0 space-y-3">
              <Button as="a" href="/trust" variant="outline" size="md">
                Read Data Governance Standards →
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10 — FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <Section variant="dark-2" spacing="2xl" className="border-t border-white/10">
        <Container className="text-center max-w-3xl mx-auto space-y-6">
          <span className="text-label text-neutral-400 font-mono uppercase tracking-widest">
            Ready to Begin
          </span>
          <h2 className="text-display-xl font-extralight text-white tracking-[0.03em]">
            Finance the asset.
          </h2>
          <p className="text-body-lg text-neutral-300 font-light leading-relaxed max-w-xl mx-auto">
            Start your asset finance application. One submission, structured for assessment by specialist UK finance providers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button as="a" href="/apply" variant="primary" size="lg">
              Start an Application
            </Button>
            <Button as="a" href="/finance-calculator" variant="secondary" size="lg">
              Illustrative Calculator
            </Button>
          </div>

          <Divider variant="dark" spacing="lg" className="max-w-xs mx-auto" />

          <p className="text-caption text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
            Finance subject to status and eligibility. TAFM is a commercial marketplace platform and does not provide financial or lending advice.
          </p>
        </Container>
      </Section>
    </>
  )
}
