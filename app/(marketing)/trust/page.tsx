import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

export const metadata: Metadata = genMeta({
  title: 'Data Governance, Trust & Methodology',
  description:
    'How TAFM handles data integrity — 4 data status tiers, strict market observation rules (asking price vs sale price), deterministic matching provenance, and strict AI boundaries.',
  canonical: '/trust',
})

const DATA_STATUSES = [
  {
    status: 'VERIFIED',
    badgeClass: 'border-emerald-600 text-emerald-400 bg-emerald-950/20',
    title: 'Direct Authoritative Evidence',
    description:
      'Information confirmed directly by an official source (e.g., manufacturer technical specification, certified public auction transcript, Companies House statutory filing, or FCA register entry). Recorded with immutable source attribution.',
  },
  {
    status: 'KNOWN',
    badgeClass: 'border-blue-600 text-blue-400 bg-blue-950/20',
    title: 'Documented External Source',
    description:
      'Information documented from a recognized external source (e.g., published dealer equipment asking price, supplier quotation, or published lender policy document) that has not yet undergone secondary external confirmation.',
  },
  {
    status: 'INFERRED',
    badgeClass: 'border-amber-600 text-amber-400 bg-amber-950/20',
    title: 'Calculated or Derived Value',
    description:
      'Values mathematically derived or estimated (e.g., illustrative amortization repayments, statistical depreciation curves, or entity matching confidence scores). Never presented as verified primary fact.',
  },
  {
    status: 'UNKNOWN',
    badgeClass: 'border-gray-600 text-gray-400 bg-gray-900/30',
    title: 'Explicit Absence of Data',
    description:
      'Information that does not exist in the system or where observation volume is insufficient for statistical confidence. TAFM explicitly states when data is unknown rather than substituting synthetic placeholders.',
  },
]

const MARKET_DATA_TYPES = [
  {
    type: 'ASKING PRICE',
    definition: 'Advertised asking price from dealer listing or classified advertisement.',
    treatment: 'Treated as an offer to negotiate. Never treated as a sale price or formal valuation.',
  },
  {
    type: 'SALE PRICE',
    definition: 'Verified bilateral transaction price between willing buyer and willing seller.',
    treatment: 'Documented with transactional evidence. Distinguishes retail trade from trade wholesale.',
  },
  {
    type: 'AUCTION RESULT',
    definition: 'Public hammer price achieved at certified commercial equipment auction.',
    treatment: 'Reflects realized liquidation value on a specific date, location, and asset condition.',
  },
  {
    type: 'DEALER PRICE',
    definition: 'Trade wholesale or distributor benchmark provided by verified equipment dealer.',
    treatment: 'Used to calibrate trade entry points; distinguished from advertised retail prices.',
  },
  {
    type: 'VALUATION',
    definition: 'Formal appraisal derived from sufficient volume of verified transactions.',
    treatment: 'Never displayed unless minimum sample size (>=3 verified points) and statistical thresholds are met.',
  },
  {
    type: 'USER SUBMITTED',
    definition: 'Purchase price or estimate submitted by an applicant or equipment owner.',
    treatment: 'Treated as unverified customer representation until backed by supplier invoice or proof of purchase.',
  },
]

export default function TrustPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Trust & Transparency', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Data Methodology & Governance
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Integrity & Provenance"
              subtitle="TAFM's credibility depends on complete transparency about what we know, what we infer, and what is unknown."
            >
              Trust & data transparency.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* 1. DATA STATUS FRAMEWORK */}
      <Section variant="light" spacing="2xl" id="data-status">
        <Container>
          <div className="max-w-3xl mb-12">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="heading-xl"
                variant="light"
                eyebrow="Section 01"
              >
                Data Status Framework
              </SectionHeading>
              <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                Every material data point within TAFM—from equipment specifications to provider underwriting appetite—carries an explicit provenance classification. We do not blend assumptions with verified records.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DATA_STATUSES.map((item) => (
              <AnimateOnScroll key={item.status}>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-mono border rounded-sm ${item.badgeClass}`}>
                        {item.status}
                      </span>
                      <h3 className="text-heading-sm font-light text-[var(--color-text-on-light-primary)]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* 2. MARKET DATA INTEGRITY */}
      <Section variant="off-white" spacing="2xl" id="market-data">
        <Container>
          <div className="max-w-3xl mb-12">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="heading-xl"
                variant="light"
                eyebrow="Section 02"
              >
                Market Data Integrity
              </SectionHeading>
              <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-6">
                Equipment valuation requires precise data hygiene. We track 6 distinct market data types, each reflecting a specific observation context.
              </p>

              {/* MANDATORY PROMPT STATEMENT */}
              <div className="p-5 border-l-4 border-orange-500 bg-orange-50/60 rounded-r-sm">
                <p className="text-body-sm font-medium text-orange-950 uppercase tracking-wide mb-1">
                  Core Market Rule:
                </p>
                <p className="text-heading-sm font-light text-orange-900 leading-snug">
                  An asking price is not treated as a sale price or valuation.
                </p>
                <p className="text-caption font-light text-orange-800 mt-2">
                  Asking prices indicate seller aspirations; auction results indicate realized liquidation cash; sale prices indicate bilateral agreements. TAFM never averages or conflates these into artificial values.
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKET_DATA_TYPES.map((m) => (
              <AnimateOnScroll key={m.type}>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white h-full flex flex-col justify-between">
                  <div>
                    <span className="text-caption font-mono uppercase text-orange-600 block mb-2">
                      {m.type}
                    </span>
                    <h3 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">
                      {m.definition}
                    </h3>
                    <p className="text-caption font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                      {m.treatment}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="mt-8 p-4 border border-[var(--color-border-light)] bg-white rounded-sm">
            <p className="text-caption text-[var(--color-text-on-light-muted)] font-light">
              <strong>Formal Valuation Rule:</strong> Where fewer than three verified transaction observations exist for an asset model within a relevant timeframe, TAFM explicitly renders: <em>"Insufficient verified transaction data for a formal valuation."</em>
            </p>
          </div>
        </Container>
      </Section>

      {/* 3. STRICT AI BOUNDARIES */}
      <Section variant="dark-2" spacing="2xl" id="ai-boundaries">
        <Container>
          <div className="max-w-3xl mb-12">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="heading-xl"
                variant="dark"
                eyebrow="Section 03"
              >
                AI Capabilities & Strict Boundaries
              </SectionHeading>
              <p className="text-body font-light text-white/70 leading-relaxed">
                Artificial Intelligence plays a defined, constrained operational support role within TAFM. We are explicit about what AI does and does NOT do.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What AI Assists With */}
            <AnimateOnScroll>
              <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#080808] h-full">
                <span className="text-caption font-mono uppercase text-emerald-400 block mb-2">
                  PERMITTED AI CAPABILITIES
                </span>
                <h3 className="text-heading-md font-light text-white mb-4">
                  What AI may assist with:
                </h3>
                <ul className="space-y-3 font-light text-sm text-white/80" role="list">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Data Extraction:</strong> Extracting equipment specifications, working hours, and VIN numbers from supplier invoices and spec sheets.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Asset Classification:</strong> Categorising complex machinery into standardized taxonomy codes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Market Intelligence:</strong> Normalizing raw auction listings and parsing certified hammer results.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Structured Analysis:</strong> Formatting borrower submission dossiers to ensure complete provider review packages.</span>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>

            {/* What AI Strictly NEVER Does */}
            <AnimateOnScroll delay={80}>
              <div className="p-8 border border-red-500/30 rounded-sm bg-[#0d0707] h-full">
                <span className="text-caption font-mono uppercase text-red-400 block mb-2">
                  STRICT NON-NEGOTIABLE BOUNDARIES
                </span>
                <h3 className="text-heading-md font-light text-white mb-4">
                  What AI does NOT do:
                </h3>
                <ul className="space-y-3 font-light text-sm text-white/80" role="list">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span><strong>No Lender Credit Decisions:</strong> AI never makes credit approvals, declines, or risk sanctions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span><strong>No Synthetic Approvals:</strong> AI cannot generate automated finance offers or commit capital.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span><strong>No Hallucinated Facts:</strong> AI never turns estimates, inferred numbers, or asking prices into verified facts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span><strong>No Underwriting Replacement:</strong> AI does not replace direct regulated human underwriting by participating finance providers.</span>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* 4. SECURITY & AUDIT TRAIL */}
      <Section variant="light" spacing="2xl" id="security">
        <Container>
          <div className="max-w-3xl mb-12">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="heading-xl"
                variant="light"
                eyebrow="Section 04"
              >
                Security & Immutable Audit Logging
              </SectionHeading>
              <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                Commercial finance involves sensitive corporate balance sheets, asset valuations, and personal identity data. TAFM enforces strict multi-tenant isolation.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
              <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Cryptographic Tokens</h4>
              <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                Borrower financial accounts and invoices are protected by time-bound, HMAC-signed download URLs. No private commercial documents are ever publicly indexable or linkable.
              </p>
            </div>
            <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
              <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Multi-Tenant Isolation</h4>
              <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                Borrowers cannot access documents or details of other businesses. Participating lenders can only access files for opportunities formally submitted to them.
              </p>
            </div>
            <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
              <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Immutable Provenance</h4>
              <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                Criteria versions, matching factor evaluations, and state changes are recorded in append-only database audit logs to guarantee non-repudiation.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--color-border-light)] flex flex-wrap gap-4 items-center justify-between">
            <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)]">
              Questions regarding our data methodology or criteria governance?
            </p>
            <div className="flex gap-4">
              <Link href="/contact" className="text-body-sm text-orange-600 hover:underline">
                Contact Data Governance Team →
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
