import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { TransactionFlow } from '@/components/marketing/TransactionFlow'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'How It Works — The 8-Stage TAFM Process',
  description:
    'Understand how TAFM connects equipment acquisitions with specialist finance providers — from asset specification through deterministic matching to independent underwriting and funded transaction.',
  canonical: '/how-it-works',
})

const STAGES = [
  {
    step: '01',
    actor: 'BORROWER & SUPPLIER',
    actorType: 'external',
    title: 'Identify the Asset',
    description:
      'You have identified the specific capital equipment, plant, or vehicle your business needs and obtained a formal commercial quotation from a recognized supplier.',
    detail:
      'TAFM is asset-centric. Every transaction is anchored to a concrete physical asset with known specifications, serial/model identifiers, and an official supplier quote. General speculative financing enquiries without identified equipment are not supported.',
  },
  {
    step: '02',
    actor: 'BORROWER',
    actorType: 'external',
    title: 'Structure the Requirement',
    description:
      'Define your commercial finance parameters: preferred structure (Hire Purchase, Finance Lease, Operating Lease, or Refinance), initial deposit, and target term length.',
    detail:
      'Different assets require different financing horizons. TAFM captures your preferred structure alongside your trading history, VAT profile, and equipment usage projections to ensure accurate eligibility evaluation.',
  },
  {
    step: '03',
    actor: 'BORROWER',
    actorType: 'external',
    title: 'Submit One Application',
    description:
      'Submit your application once through TAFM’s secure portal with the supplier quote, company information, and financial accounts.',
    detail:
      'No need to approach multiple lenders individually or fill out repetitive proposal forms. One comprehensive submission contains all data required for institutional assessment.',
  },
  {
    step: '04',
    actor: 'TAFM INFRASTRUCTURE',
    actorType: 'tafm',
    title: 'TAFM Checks the Requirement',
    description:
      'TAFM validates the submission for completeness, data integrity, and asset classification standards before any provider matching occurs.',
    detail:
      'Incomplete or incoherent submissions are caught before provider submission. TAFM checks equipment specifications, verifies manufacturer data, and flags missing documentation, eliminating the administrative friction that stalls traditional broker channels.',
  },
  {
    step: '05',
    actor: 'TAFM MATCHING ENGINE',
    actorType: 'tafm',
    title: 'Matching Providers Are Identified',
    description:
      'TAFM evaluates the requirement against versioned, deterministic credit appetite criteria of participating specialist finance providers.',
    detail:
      'Matching is purely deterministic and auditable—not algorithmic guesswork. The platform checks minimum trading age, ticket size, asset category, equipment age at term end, and corporate structure against active criteria snapshots.',
  },
  {
    step: '06',
    actor: 'FINANCE PROVIDERS',
    actorType: 'provider',
    title: 'Providers Assess the Requirement',
    description:
      'Eligible finance providers review the verified asset dossier, supplier quotation, and company accounts to conduct independent underwriting.',
    detail:
      'TAFM does not make credit decisions. Underwriting authority remains strictly with the finance provider. Lenders perform their own KYC, AML, credit searches, and asset risk evaluations according to their internal risk governance.',
  },
  {
    step: '07',
    actor: 'FINANCE PROVIDERS & BORROWER',
    actorType: 'provider',
    title: 'Finance Is Structured',
    description:
      'Participating providers confirm appetite and issue formal finance terms. You review commercial proposals, monthly repayments, and documentation.',
    detail:
      'All terms are presented transparently. If a lender requires additional clarification, information requests are handled securely within the platform without email leakage.',
  },
  {
    step: '08',
    actor: 'ALL PARTIES',
    actorType: 'external',
    title: 'Transaction Completes',
    description:
      'Agreements are executed, the finance provider remits payment directly to the equipment supplier, and the asset is delivered for operational deployment.',
    detail:
      'The transaction closes cleanly. Funds flow directly from the lender to the supplier of record. The asset enters your business operations, beginning its monitored lifecycle.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'How it works', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Operating Methodology
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="The 8-Stage Process"
              subtitle="From equipment specification through deterministic provider matching to funded commercial delivery."
            >
              How TAFM works.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Transaction flow visual */}
      <Section variant="dark-2" spacing="xl" className="border-t border-white/10">
        <Container>
          <AnimateOnScroll>
            <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#080808]">
              <TransactionFlow />
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Distinction Callout: TAFM vs Provider Underwriting */}
      <Section variant="light" spacing="none" className="pt-16 pb-8 border-b border-[var(--color-border-light)]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
            <div className="space-y-2">
              <span className="text-caption font-mono uppercase tracking-wider text-orange-600 block">
                TAFM ROLE: INFRASTRUCTURE & FACILITATION
              </span>
              <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)]">
                Structuring & Deterministic Matching
              </h3>
              <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                TAFM standardizes asset records, validates supplier quotes, and evaluates requirements against versioned provider criteria. Matching indicates high probability of policy fit. Matching is not a credit approval.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-caption font-mono uppercase tracking-wider text-gray-600 block">
                PROVIDER ROLE: CREDIT AUTHORITY
              </span>
              <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)]">
                Independent Underwriting & Pricing
              </h3>
              <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                Regulated finance providers retain exclusive underwriting authority. Each participating lender performs statutory KYC/AML, assesses balance sheet health, sets risk-adjusted pricing, and issues formal commercial agreements.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 8 Detailed Steps */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="space-y-0">
            {STAGES.map((s, index) => (
              <AnimateOnScroll key={s.step} delay={index * 40}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-12 border-b border-[var(--color-border-light)] items-start">
                  {/* Step number and Actor */}
                  <div className="lg:col-span-3 space-y-2">
                    <span className="text-display-md font-extralight text-orange-500/30 font-mono leading-none block">
                      {s.step}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-sm inline-block ${
                        s.actorType === 'tafm'
                          ? 'border-orange-400 text-orange-700 bg-orange-50'
                          : s.actorType === 'provider'
                          ? 'border-blue-400 text-blue-700 bg-blue-50'
                          : 'border-gray-300 text-gray-700 bg-gray-100'
                      }`}
                    >
                      {s.actor}
                    </span>
                  </div>

                  {/* Title, Description & Detail */}
                  <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">
                        {s.title}
                      </h2>
                      <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div className="p-5 bg-[var(--color-surface-off-white)] border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-caption font-mono uppercase tracking-wider text-[var(--color-text-on-light-muted)] mb-2">
                        Operational Detail
                      </h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Action Bar */}
          <AnimateOnScroll className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-body font-light text-[var(--color-text-on-light-primary)] mb-1">
                  Have an asset identified with a supplier quote?
                </p>
                <p className="text-body-sm font-light text-[var(--color-text-on-light-3)]">
                  Start your single submission to initiate deterministic matching against participating providers.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <Button as="a" href="/apply" variant="primary" size="md">
                  Start an Application
                </Button>
                <Button as="a" href="/finance" variant="outline" size="md">
                  Compare finance structures
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
