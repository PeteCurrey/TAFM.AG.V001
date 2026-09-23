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
  title: 'Data Governance, Trust & Provenance Architecture | TAFM',
  description:
    'TAFM’s credibility depends on total transparency regarding data origin, verification status, AI boundaries, and market observation taxonomy. Learn how TAFM records, verifies, and audits data.',
  canonical: '/trust',
})

const DATA_STATUSES = [
  {
    status: 'VERIFIED',
    badge: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    definition: 'Independently confirmed by official OEM filings, certified auction records, or Companies House registries.',
    implication: 'Treated as established commercial fact. Eligible for public search indexing and formal criteria matching.',
  },
  {
    status: 'KNOWN',
    badge: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    definition: 'Directly submitted by authenticated commercial suppliers, authorized dealers, or registered applicants.',
    implication: 'Treated as authoritative commercial claims subject to documentary review prior to formal underwriting submission.',
  },
  {
    status: 'INFERRED',
    badge: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
    definition: 'Derived, calculated, or parsed via AI extraction models, statistical regression, or algorithmic synthesis.',
    implication: 'Never treated as primary fact. Explicitly labelled so users and underwriters know it was computationally derived.',
  },
  {
    status: 'UNKNOWN',
    badge: 'border-neutral-500/40 text-neutral-400 bg-neutral-900/40',
    definition: 'Information gaps where authoritative data does not yet exist or has not met verification thresholds.',
    implication: 'TAFM states "Insufficient Data" rather than inventing or extrapolating an unverified estimate.',
  },
]

const OBSERVATION_TYPES = [
  {
    type: 'AUCTION RESULT',
    tag: 'AUCTION_RESULT',
    desc: 'Certified hammer price achieved at unreserved or public equipment auctions (e.g. Euro Auctions, Ritchie Bros). Represents an actual verified arm’s-length transaction.',
    rule: 'Weighted with highest empirical confidence in secondary market valuation calculations.',
  },
  {
    type: 'SALE PRICE',
    tag: 'SALE_PRICE',
    desc: 'Documented bilateral purchase price between independent commercial parties, evidenced by invoices and proof of funds.',
    rule: 'Treated as actual historic transaction evidence.',
  },
  {
    type: 'ASKING PRICE',
    tag: 'ASKING_PRICE',
    desc: 'Advertised retail price listed by commercial equipment dealers or online marketplaces (e.g. PlantTrader).',
    rule: 'NEVER CONFLATED WITH SALE PRICE. An asking price reflects seller aspirations, not concluded transaction value.',
  },
  {
    type: 'DEALER PRICE',
    tag: 'DEALER_PRICE',
    desc: 'Official list price or commercial quote provided directly by an authorized OEM dealership.',
    rule: 'Used for benchmark replacement value, but adjusted for prevailing commercial discount margins.',
  },
  {
    type: 'FORMAL VALUATION',
    tag: 'VALUATION',
    desc: 'Independent plant and machinery appraiser report (desktop or physical inspection) produced by RICS/accredited valuers.',
    rule: 'Only accepted when appraiser identity and methodology are formally recorded.',
  },
  {
    type: 'USER SUBMITTED',
    tag: 'USER_SUBMITTED',
    desc: 'Price or valuation figure self-reported by an applicant prior to documentary verification.',
    rule: 'Treated as provisional until substantiated by a formal supplier quotation.',
  },
]

export default function TrustPage() {
  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Trust & Data Governance', current: true }]}
            variant="dark"
            className="mb-8"
          />

          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Institutional Data Integrity & Methodology
              </span>
            </div>

            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Marketplace Credibility"
            >
              Data, Trust & Provenance.
            </SectionHeading>

            <p className="text-body-lg font-light text-neutral-300 max-w-3xl leading-relaxed mt-4">
              TAFM is founded on total honesty regarding what we know, what we do not know, and how every data point was established. We do not invent market values, inflate approval statistics, or blur the boundary between asking prices and actual sales.
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. THE 4 DATA STATES ─────────────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Core Data Model
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              The Four Explicit Data States
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Every critical entity record on TAFM carries an explicit data provenance tag:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DATA_STATUSES.map((s) => (
              <div
                key={s.status}
                className="p-8 rounded border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono uppercase font-semibold border ${s.badge}`}>
                    {s.status}
                  </span>
                  <span className="text-[11px] font-mono uppercase text-neutral-400">
                    Provenance Class
                  </span>
                </div>
                <h3 className="text-heading-md font-normal text-neutral-900 mb-2">
                  Status: {s.status}
                </h3>
                <p className="text-body-sm font-light text-neutral-700 leading-relaxed mb-4">
                  {s.definition}
                </p>
                <div className="pt-4 border-t border-neutral-100 text-xs font-light text-neutral-500 leading-relaxed">
                  <strong className="font-medium text-neutral-800">Operational Rule:</strong> {s.implication}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. MARKET OBSERVATION TAXONOMY ────────────────────────────────── */}
      <Section variant="light" spacing="2xl" className="border-t border-neutral-200 bg-neutral-50/50">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Empirical Market Data
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              Market Observation Taxonomy
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Never combine asking prices, auction results, and book values into a single ambiguous "market value".
            </p>
          </div>

          <div className="p-6 rounded border-2 border-orange-500 bg-white mb-10 shadow-sm">
            <h3 className="text-heading-md font-normal text-neutral-900 mb-1">
              Absolute Rule: An Asking Price is Never Treated as a Sale Price
            </h3>
            <p className="text-body-sm font-light text-neutral-700 leading-relaxed">
              In commercial plant and equipment markets, asking prices on dealer portals can differ by 15% to 30% from actual transacted cash settlements. TAFM rigorously segments dealer listings from completed auction hammer results and bilateral sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OBSERVATION_TYPES.map((obs) => (
              <div
                key={obs.tag}
                className="p-6 rounded border border-neutral-200 bg-white shadow-sm hover:border-orange-500/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-medium">
                      {obs.type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {obs.tag}
                    </span>
                  </div>
                  <p className="text-body-sm font-light text-neutral-600 leading-relaxed mb-4">
                    {obs.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 text-caption font-light text-neutral-500 font-mono">
                  {obs.rule}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. THE ROLE OF AI ─────────────────────────────────────────────── */}
      <Section variant="dark-2" spacing="2xl" className="border-t border-white/10">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
                Responsible Automation
              </span>
              <h2 className="text-display-md font-extralight text-white">
                The Role of AI on TAFM
              </h2>
              <p className="text-body text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
                We believe artificial intelligence is exceptionally powerful for structuring unstructured technical data, but must never substitute for human credit responsibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="p-6 rounded border border-white/10 bg-[#0d0d0d] space-y-3">
                <span className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider font-semibold block">
                  ✓ What AI Does on TAFM
                </span>
                <p className="text-body-sm text-neutral-300 font-light leading-relaxed">
                  Extracts structured specifications from PDF quotes and engineering brochures. Categorises equipment into our 11 industrial taxonomies. Identifies model variants and standardises technical specifications for underwriting dossiers.
                </p>
              </div>

              <div className="p-6 rounded border border-white/10 bg-[#0d0d0d] space-y-3">
                <span className="text-[11px] font-mono uppercase text-red-400 tracking-wider font-semibold block">
                  ✕ What AI NEVER Does on TAFM
                </span>
                <p className="text-body-sm text-neutral-300 font-light leading-relaxed">
                  AI NEVER makes credit decisions. AI NEVER determines lender approvals or declines. AI outputs are NEVER treated as verified facts—they remain classified as `INFERRED` until reviewed by human specialists.
                </p>
              </div>
            </div>

            <div className="p-5 rounded bg-white/[0.02] border border-white/5 text-center text-caption text-neutral-400 font-light">
              Underwriting autonomy and regulatory credit assessment remain 100% with authorized institutional lenders.
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5. DATA PROVENANCE & AUDITABILITY ─────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
                Verification Pipeline
              </span>
              <h2 className="text-heading-xl font-light text-neutral-900">
                How Provenance is Maintained
              </h2>
              <p className="text-body text-neutral-700 font-light leading-relaxed">
                When a price, specification, or provider profile appears on TAFM, the question <em className="font-serif">"Where did this number come from?"</em> always has a definitive, timestamped answer.
              </p>
              <ul className="space-y-3 text-body-sm text-neutral-600 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-600 font-mono font-bold">01</span>
                  <span><strong className="font-medium text-neutral-900">Source Logging:</strong> Every observation references a specific DataSource ID, certified auction lot, or dealer URL.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-600 font-mono font-bold">02</span>
                  <span><strong className="font-medium text-neutral-900">Versioned Criteria:</strong> Lender underwriting criteria are version-controlled with effective-from dates and reason codes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-600 font-mono font-bold">03</span>
                  <span><strong className="font-medium text-neutral-900">Immutable Audit Trail:</strong> Critical application milestones and data edits are logged permanently in audit records.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 p-8 rounded border border-neutral-200 bg-neutral-50 space-y-6">
              <h3 className="text-body font-medium text-neutral-900 font-mono uppercase text-xs">
                Explore Verified Marketplace Data
              </h3>
              <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                Experience TAFM’s data provenance in action on our verified entity records:
              </p>
              <div className="space-y-3">
                <Link
                  href="/assets/specialist-equipment/ruthmann-steiger-t-650-hf-scania-2022"
                  className="block p-4 rounded border border-neutral-200 bg-white hover:border-orange-500 text-body-sm font-light text-neutral-800 transition-colors"
                >
                  <span className="font-medium block text-neutral-900">Verified Asset: Ruthmann STEIGER T 650 HF</span>
                  <span className="text-xs text-neutral-500 mt-0.5 block">Inspect separated auction hammer prices vs dealer asking listings.</span>
                </Link>
                <Link
                  href="/providers"
                  className="block p-4 rounded border border-neutral-200 bg-white hover:border-orange-500 text-body-sm font-light text-neutral-800 transition-colors"
                >
                  <span className="font-medium block text-neutral-900">Verified Provider: Haydock Finance Ltd</span>
                  <span className="text-xs text-neutral-500 mt-0.5 block">Review verified FCA reference 716766 and published appetite criteria.</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
