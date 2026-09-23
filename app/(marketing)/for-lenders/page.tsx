import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { LeadCaptureForm } from '@/components/marketing/LeadCaptureForm'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Finance Providers & Institutional Lenders | TAFM',
  description:
    'Institutional asset finance deal flow infrastructure. Receive structured, asset-backed applications matched strictly to your risk criteria. Full underwriting and credit decision autonomy retained by lenders.',
  canonical: '/for-lenders',
})

const DEAL_FLOW_COMPONENTS = [
  {
    title: 'Asset Specification',
    items: ['OEM manufacturer & verified model code', 'Serial number / VIN and year of manufacture', 'Engineering spec, payload, reach, configuration', 'New or used condition with operating hours/mileage'],
  },
  {
    title: 'Supplier Commercial Dossier',
    items: ['Authorised supplier registration & VAT identity', 'Formal itemised pro-forma commercial quotation', 'Delivery schedule, warranty, and title terms', 'Direct settlement verification details'],
  },
  {
    title: 'Applicant Business Profile',
    items: ['Companies House identity & trading history', 'Director & UBO ownership structures (KYC/AML baseline)', 'Sector classification (SIC code) & annual turnover', 'Verified balance sheet and filed accounts'],
  },
  {
    title: 'Structured Finance Requirement',
    items: ['Requested structure (HP, Finance Lease, Refinance)', 'Target facility amount and customer deposit sum', 'Preferred primary term (12–84 months)', 'Balloon or residual preferences where applicable'],
  },
  {
    title: 'Supporting Financial Documentation',
    items: ['Bank statements and management accounts', 'Audited financial reports where required', 'Existing asset debt register (for refinance deals)', 'Complete audit-ready digital document index'],
  },
]

const WHY_TAFM = [
  {
    title: 'Asset-Centric Deal Architecture',
    body: 'Unlike generic corporate credit aggregators, every TAFM transaction is anchored to an identifiable physical asset. Deal packages are enriched with equipment specs, auction market observations, and verified valuations.',
  },
  {
    title: 'Deterministic Criteria Matching',
    body: 'No AI hallucinations or vague keyword routing. Matching is executed through deterministic rule engines evaluating your exact ticket sizes, asset categories, business age, geography, and structure appetites.',
  },
  {
    title: 'Rigorous Data Quality Gates',
    body: 'Incomplete or unverified submissions are filtered out at the gateway. Underwriters receive complete digital dossiers ready for credit committee assessment rather than fragmented email chains.',
  },
  {
    title: 'Versioned Criteria Governance',
    body: 'Lender underwriting criteria are version-controlled and timestamped. When appetite shifts or ticket limits change, updates apply instantly with a full historical audit trail.',
  },
  {
    title: 'Controlled Information Exchange',
    body: 'Underwriters request supplementary data through controlled, encrypted channels. Document provenance is preserved with strict access control and GDPR compliance.',
  },
  {
    title: 'Zero Re-Keying Friction',
    body: 'Designed for modern institutional operations. Applications can be consumed via secure API endpoints or accessed through clean, structured provider portals.',
  },
]

export default function ForLendersPage() {
  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'For Finance Providers', current: true }]}
            variant="dark"
            className="mb-8"
          />

          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Institutional Deal Flow Infrastructure
              </span>
            </div>

            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Institutional Asset Finance"
            >
              Access qualified,
              <br />
              asset-backed deal flow.
            </SectionHeading>

            <p className="text-body-lg font-light text-neutral-300 max-w-2xl leading-relaxed mt-4">
              TAFM connects banks, specialist lenders, and asset finance institutions with structured, high-quality UK business borrowing requirements—matched strictly to your defined credit appetite.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button as="a" href="#join-network" variant="primary" size="lg">
                Join the Finance Provider Network
              </Button>
              <Button as="a" href="/providers" variant="ghost" size="lg">
                View Provider Directory
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. STRUCTURED DEAL FLOW DOSSIER ───────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Standardised Submissions
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              The 5 Components of Every TAFM Deal Package
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Every submission delivered to your underwriting desk contains complete, structured transaction data:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEAL_FLOW_COMPONENTS.map((comp, idx) => (
              <div
                key={idx}
                className="p-6 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-orange-600 text-xs font-semibold">0{idx + 1}</span>
                  <h3 className="text-body font-medium text-neutral-900">{comp.title}</h3>
                </div>
                <ul className="space-y-2 text-body-sm font-light text-neutral-600">
                  {comp.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <span className="text-neutral-400 mt-1 font-mono text-xs">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. PROVIDER AUTONOMY & CONTROL ────────────────────────────────── */}
      <Section variant="dark-2" spacing="2xl" className="border-t border-white/10">
        <Container>
          <div className="p-8 sm:p-12 rounded border border-white/10 bg-[#0d0d0d] max-w-4xl mx-auto space-y-8">
            <div>
              <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
                Underwriting Governance
              </span>
              <h2 className="text-heading-xl font-light text-white mt-2">
                Providers Retain Full Operational & Credit Autonomy
              </h2>
              <p className="text-body text-neutral-300 font-light mt-3 leading-relaxed">
                TAFM is not a broker presenting subjective opinions, nor an automated credit decision engine. We provide the structured intake and deterministic matching infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm text-neutral-300 font-light">
              <div className="p-4 rounded border border-white/5 bg-white/[0.02]">
                <strong className="text-white font-medium block mb-1">Underwriting & Credit Policy</strong>
                You apply your own internal credit risk models, affordability metrics, and committee reviews.
              </div>
              <div className="p-4 rounded border border-white/5 bg-white/[0.02]">
                <strong className="text-white font-medium block mb-1">Approval & Decline Discretion</strong>
                You maintain absolute discretion to approve, refer, condition, or decline any application.
              </div>
              <div className="p-4 rounded border border-white/5 bg-white/[0.02]">
                <strong className="text-white font-medium block mb-1">Risk Pricing & Margin</strong>
                Your treasury determines margin, APR, document fees, and rate card parameters.
              </div>
              <div className="p-4 rounded border border-white/5 bg-white/[0.02]">
                <strong className="text-white font-medium block mb-1">KYC, AML & Documentation</strong>
                You execute your own regulatory compliance verification and issue your proprietary legal agreements.
              </div>
            </div>

            <div className="p-4 rounded border border-amber-500/30 bg-amber-950/20 text-caption font-mono text-amber-200">
              IMPORTANT: TAFM matching signifies deterministic criteria compatibility. Matching NEVER implies credit approval or commitment to lend.
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4. WHY TAFM ───────────────────────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Institutional Value Proposition
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              Why Institutional Lenders Partner with TAFM
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Purpose-built infrastructure for commercial equipment lending:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_TAFM.map((item, idx) => (
              <AnimateOnScroll key={idx} delay={idx * 40}>
                <div className="p-6 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors shadow-sm h-full">
                  <h3 className="text-body font-medium text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-body-sm font-light text-neutral-600 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 5. PROVIDER ONBOARDING CAPTURE ────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" id="join-network" className="border-t border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
                Lender Onboarding
              </span>
              <h2 className="text-display-md font-extralight text-white">
                Join the TAFM Finance Provider Network.
              </h2>
              <p className="text-body text-neutral-300 font-light leading-relaxed">
                We partner with UK banks, specialist asset finance funds, and niche equipment lenders. Our institutional team will verify your corporate identity, record your specific asset appetites, and set up deterministic matching.
              </p>
              <div className="p-4 rounded border border-white/10 bg-white/[0.02] text-[11px] text-neutral-400 font-light leading-relaxed">
                <strong className="text-white font-normal">Confidentiality:</strong> Your detailed underwriting criteria and risk parameters are protected under strict commercial confidentiality and are never published publicly.
              </div>
            </div>

            <div className="lg:col-span-7 p-8 rounded border border-white/10 bg-[#0d0d0d] shadow-2xl">
              <LeadCaptureForm type="lender" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
