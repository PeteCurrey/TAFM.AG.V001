import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { TransactionFlow } from '@/components/marketing/TransactionFlow'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'How It Works — The 9-Stage Asset Finance Transaction',
  description:
    'Detailed step-by-step visual breakdown of the TAFM transaction: from asset identification and supplier quote through structured criteria matching, lender underwriting, transaction execution, and ongoing asset lifecycle.',
  canonical: '/how-it-works',
})

const TRANSACTION_STAGES = [
  {
    stage: '01',
    name: 'Business',
    title: 'Commercial Requirement Identified',
    role: 'Commercial Applicant / SME Operator',
    whatHappens:
      'The business identifies a capital equipment requirement necessary to support revenue generation, replace ageing infrastructure, or fulfil a commercial contract.',
    whoIsResponsible: 'The acquiring business entity (Directors / Financial Controller / Proprietor).',
    informationRecorded:
      'Company registration number, business trading history, operating sector, annual turnover, and acquisition rationale.',
    whatTafmDoes:
      'Provides educational guidance on finance structures and pre-qualification data requirements.',
    whatTafmDoesNotDo:
      'TAFM does not advise on whether equipment acquisition is commercially prudent for the business.',
  },
  {
    stage: '02',
    name: 'Asset',
    title: 'Asset Specification & Engineering Review',
    role: 'Equipment Identification',
    whatHappens:
      'A specific piece of machinery, vehicle, or technology is selected. Detailed technical specifications, year of manufacture, hours/mileage, and configuration are established.',
    whoIsResponsible: 'The business and equipment supplier.',
    informationRecorded:
      'Manufacturer, model name, chassis/serial number, new or used condition, working hours/mileage, LOLER or safety certifications.',
    whatTafmDoes:
      'Validates asset taxonomy against official manufacturer engineering models and checks for independent market observations.',
    whatTafmDoesNotDo:
      'TAFM does not conduct physical on-site mechanical inspections or guarantee mechanical fitness for purpose.',
  },
  {
    stage: '03',
    name: 'Supplier Quote',
    title: 'Supplier Commercial Quotation',
    role: 'Equipment Vendor / OEM Dealer',
    whatHappens:
      'The authorised equipment supplier issues a formal commercial pro-forma quotation specifying the purchase price, delivery terms, and warranty terms.',
    whoIsResponsible: 'The supplier of record.',
    informationRecorded:
      'Supplier VAT number, company registration, formal quote document, itemised net purchase price, delivery terms, and payment terms.',
    whatTafmDoes:
      'Ingests the supplier quote as structured transaction data, ensuring the supplier is identifiable as a verified commercial vendor.',
    whatTafmDoesNotDo:
      'TAFM does not negotiate equipment pricing, alter supplier quotation terms, or take possession of equipment.',
  },
  {
    stage: '04',
    name: 'TAFM',
    title: 'Structuring & Completeness Validation',
    role: 'Marketplace Infrastructure',
    whatHappens:
      'TAFM structures the application into a standardised, asset-centric deal dossier combining business profile, asset specification, supplier quote, and stated finance preferences.',
    whoIsResponsible: 'TAFM marketplace platform & data governance.',
    informationRecorded:
      'Standardised XML/JSON deal dossier, complete documentation index, verification status tags, and criteria eligibility scores.',
    whatTafmDoes:
      'Assesses application completeness, normalises asset specifications, and verifies that the deal matches current lender criteria.',
    whatTafmDoesNotDo:
      'TAFM DOES NOT MAKE CREDIT DECISIONS. TAFM does not score credit risk, underwrite applications, or approve financing.',
  },
  {
    stage: '05',
    name: 'Matched Providers',
    title: 'Deterministic Provider Criteria Matching',
    role: 'Eligible Lender Discovery',
    whatHappens:
      'The application is matched exclusively to finance providers whose published, versioned underwriting criteria indicate an active appetite for this asset class, ticket size, and business profile.',
    whoIsResponsible: 'TAFM deterministic matching engine.',
    informationRecorded:
      'List of eligible institutional finance providers, matching criteria version IDs, and timestamped match records.',
    whatTafmDoes:
      'Routes the structured deal dossier only to regulated lenders with pre-verified appetite, eliminating indiscriminate shotgun submissions.',
    whatTafmDoesNotDo:
      'TAFM does not favour individual lenders or route applications based on preferential commission arrangements.',
  },
  {
    stage: '06',
    name: 'Underwriting',
    title: 'Independent Lender Underwriting & KYC/AML',
    role: 'Regulated Finance Providers',
    whatHappens:
      'Matched finance providers conduct formal credit underwriting, corporate credit bureau checks, fraud screening, and anti-money laundering (AML) compliance in accordance with their regulatory duties.',
    whoIsResponsible: 'Regulated credit underwriters at participating finance providers.',
    informationRecorded:
      'Credit committee decisions, underwriting covenants, security charges (e.g. debentures or director personal guarantees where applicable).',
    whatTafmDoes:
      'Provides the structured submission and facilitates secure information requests between provider and applicant.',
    whatTafmDoesNotDo:
      'TAFM plays NO role in underwriting decisions. We cannot overturn a lender decline, modify lender credit policies, or waive KYC checks.',
  },
  {
    stage: '07',
    name: 'Finance Offer',
    title: 'Formal Finance Terms Issued',
    role: 'Lender Term Sheet Issuance',
    whatHappens:
      'Where approved, the provider issues a formal term sheet detailing interest rate, monthly rental, document fees, deposit requirements, and covenants.',
    whoIsResponsible: 'The approving finance provider.',
    informationRecorded:
      'Documented APR / margin, primary term months, deposit required, balloon/option fee, and validity expiry date.',
    whatTafmDoes:
      'Presents offers transparently to the business with standardised breakdowns to facilitate clear side-by-side comparison.',
    whatTafmDoesNotDo:
      'TAFM does not represent any offer as legally binding until formal agreements are countersigned by both parties.',
  },
  {
    stage: '08',
    name: 'Transaction',
    title: 'Execution, Drawdown & Supplier Settlement',
    role: 'Commercial Settlement',
    whatHappens:
      'The business executes formal finance agreements. The finance provider draws down funds, pays the equipment supplier directly, and the asset is delivered.',
    whoIsResponsible: 'Lender, business, and supplier.',
    informationRecorded:
      'Signed agreement documents, delivery and acceptance certificate, proof of supplier payment, and commencement date.',
    whatTafmDoes:
      'Records transaction execution status and archives data provenance for auditability.',
    whatTafmDoesNotDo:
      'TAFM never handles client funds or holds money in escrow. Funds transfer directly from lender to supplier.',
  },
  {
    stage: '09',
    name: 'Asset Lifecycle',
    title: 'In-Service Monitoring, Valuation & Exit',
    role: 'Long-Term Asset Management',
    whatHappens:
      'The asset enters operational service. Over its working life, TAFM supports ongoing equipment tracking, periodic secondary valuation reviews, potential refinancing, and eventual disposal or replacement.',
    whoIsResponsible: 'Operating business & TAFM platform intelligence.',
    informationRecorded:
      'Historical valuation tracking, maintenance milestones, refinancing opportunities, and secondary market benchmark prices.',
    whatTafmDoes:
      'Provides ongoing market observations and refinance matching when working capital release is desired.',
    whatTafmDoesNotDo:
      'TAFM does not enforce equipment maintenance schedules or service intervals.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'How It Works', current: true }]}
            variant="dark"
            className="mb-8"
          />

          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                End-to-End Commercial Flow
              </span>
            </div>

            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="The TAFM Architecture"
              subtitle="The UK asset finance market is built around three parties: the acquiring business, the equipment supplier, and the institutional finance provider. TAFM provides the transparent digital marketplace infrastructure connecting them."
            >
              How The Transaction Connects.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. TRANSACTION FLOW COMPONENT ─────────────────────────────────── */}
      <Section variant="dark-2" spacing="xl" className="border-t border-white/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
              Sequential Process Pipeline
            </span>
            <h2 className="text-heading-lg font-light text-white mt-1">
              From Equipment Discovery to In-Service Operation
            </h2>
          </div>
          <TransactionFlow />
        </Container>
      </Section>

      {/* ── 3. UNDERWRITING BOUNDARY CALLOUT ──────────────────────────────── */}
      <Section variant="light" spacing="lg" className="border-t border-neutral-200">
        <Container>
          <div className="p-8 rounded border-2 border-orange-500 bg-orange-50/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <h3 className="text-heading-md font-normal text-neutral-900 font-mono text-sm uppercase">
                  Critical Institutional Principle: Underwriting Independence
                </h3>
              </div>
              <p className="text-body-sm font-light text-neutral-700 leading-relaxed">
                <strong className="font-semibold text-neutral-900">TAFM does not underwrite applications or make credit decisions.</strong> We structure data, validate asset specifications, and route submissions deterministically according to strict lender criteria. Credit assessment, pricing, terms, and final approval or decline decisions remain solely with regulated finance providers.
              </p>
            </div>
            <Link
              href="/trust"
              className="text-body-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4 shrink-0 font-mono"
            >
              Read Data Governance Standards →
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── 4. DETAILED 9-STAGE STAGES ────────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-16">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Stage-by-Stage Breakdown
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              Responsibilities & Information Governance
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Every stage has clear operational responsibilities, documented data inputs, and definitive boundaries regarding what TAFM does and does not do.
            </p>
          </div>

          <div className="space-y-12">
            {TRANSACTION_STAGES.map((s) => (
              <div
                key={s.stage}
                id={`stage-${s.stage}`}
                className="p-8 rounded border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                  <div className="flex items-center gap-4">
                    <span className="text-display-md font-extralight text-orange-600 font-mono leading-none">
                      {s.stage}
                    </span>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                        {s.role}
                      </span>
                      <h3 className="text-heading-lg font-light text-neutral-900">
                        {s.title}
                      </h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded bg-neutral-100 text-neutral-700 font-mono text-xs uppercase self-start sm:self-auto">
                    Stage: {s.name}
                  </span>
                </div>

                {/* 2-column description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-b border-neutral-100">
                  <div>
                    <h4 className="text-body-sm font-medium text-neutral-900 font-mono text-xs uppercase mb-1">
                      What Happens
                    </h4>
                    <p className="text-body-sm text-neutral-700 font-light leading-relaxed">
                      {s.whatHappens}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-body-sm font-medium text-neutral-900 font-mono text-xs uppercase mb-1">
                      Who Is Responsible
                    </h4>
                    <p className="text-body-sm text-neutral-700 font-light leading-relaxed">
                      {s.whoIsResponsible}
                    </p>
                  </div>
                </div>

                {/* Data Recorded */}
                <div className="py-6 border-b border-neutral-100">
                  <h4 className="text-body-sm font-medium text-neutral-900 font-mono text-xs uppercase mb-1">
                    Information & Data Captured
                  </h4>
                  <p className="text-body-sm font-light text-neutral-600 font-mono leading-relaxed bg-neutral-50 p-3 rounded border border-neutral-200">
                    {s.informationRecorded}
                  </p>
                </div>

                {/* What TAFM Does vs Does Not Do */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="p-4 rounded border border-emerald-200 bg-emerald-50/20">
                    <span className="text-[11px] font-mono uppercase font-semibold text-emerald-800 block mb-1">
                      ✓ What TAFM Does
                    </span>
                    <p className="text-body-sm text-neutral-700 font-light leading-relaxed">
                      {s.whatTafmDoes}
                    </p>
                  </div>

                  <div className="p-4 rounded border border-red-200 bg-red-50/20">
                    <span className="text-[11px] font-mono uppercase font-semibold text-red-800 block mb-1">
                      ✕ What TAFM Does NOT Do
                    </span>
                    <p className="text-body-sm text-neutral-700 font-light leading-relaxed">
                      {s.whatTafmDoesNotDo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 5. NEXT STEPS & CONVERSION ────────────────────────────────────── */}
      <Section variant="dark-2" spacing="2xl">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <span className="text-label text-neutral-400 font-mono uppercase tracking-widest">
              Ready to Begin Stage 01
            </span>
            <h2 className="text-display-md font-extralight text-white">
              Start Your Asset Finance Journey.
            </h2>
            <p className="text-body text-neutral-300 font-light leading-relaxed">
              Have you identified an equipment need? Submit your requirement through our structured application for deterministic matching against verified UK lenders.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button as="a" href="/apply" variant="primary" size="lg">
                Start an Application
              </Button>
              <Button as="a" href="/for-suppliers" variant="outline" size="lg">
                Supplier Registration
              </Button>
            </div>
            <p className="text-caption text-neutral-500 font-light pt-4 border-t border-white/5">
              TAFM is a commercial marketplace infrastructure platform. Finance subject to status and eligibility.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
