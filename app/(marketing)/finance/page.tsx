import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Finance Structures Guide',
  description:
    'Compare UK business asset finance structures — Hire Purchase, Finance Lease, Operating Lease, and Asset Refinance. Understand ownership models, VAT timing, and balance sheet treatments.',
  canonical: '/finance',
})

const STRUCTURES = [
  {
    type: 'Hire Purchase',
    slug: 'hire-purchase',
    summary: 'The business owns the asset outright after completion of the agreement.',
    description:
      'The finance provider purchases the asset and the business repays the cost over an agreed term plus interest. Ownership transfers to the business upon payment of all instalments and an option-to-purchase fee.',
    keyPoints: [
      'Asset appears on balance sheet from day one with capital allowances',
      'Full VAT is paid upfront (or deferred 90 days) and reclaimed via quarterly return',
      'Fixed monthly repayments allow predictable financial planning',
      'Ideal for assets with long working lifespans and strong residual retention',
    ],
    typicalTerm: '12 – 72 months',
    ownershipOutcome: 'Business (outright ownership)',
    vatTiming: 'Upfront (deferral options available)',
  },
  {
    type: 'Finance Lease',
    slug: 'finance-lease',
    summary: 'The finance provider owns the asset; the business leases it for its economic life.',
    description:
      'The provider retains legal ownership while the business has full operational use. Monthly rentals cover the capital cost and interest. At term conclusion, the business can enter a secondary peppercorn period or sell the asset as agent to a third party, retaining up to 95–99% of proceeds.',
    keyPoints: [
      'VAT is spread across each monthly rental rather than paid in a lump sum',
      'Monthly lease rentals can typically be offset directly against trading profits',
      'Secondary peppercorn periods allow low-cost ongoing machine operation',
      'Ideal for commercial vehicles, IT infrastructure, and general plant',
    ],
    typicalTerm: '24 – 60 months',
    ownershipOutcome: 'Finance Provider (secondary lease / sale as agent)',
    vatTiming: 'Payable on each monthly rental',
  },
  {
    type: 'Operating Lease',
    slug: 'operating-lease',
    summary: 'Short-to-medium term lease where the lender takes residual value risk.',
    description:
      'The business pays for the equipment’s anticipated depreciation during the lease period rather than its full purchase price. At the end of the term, the equipment is returned or upgraded, shielding the business from secondary market disposal risk.',
    keyPoints: [
      'Lowest monthly payments among asset finance structures',
      'Lender absorbs residual value and obsolescence risk',
      'Rentals generally treated as operating expenses (OPEX)',
      'Ideal for assets with rapid technology refresh cycles or fleet vehicles',
    ],
    typicalTerm: '12 – 48 months',
    ownershipOutcome: 'Finance Provider (returned / upgraded at term end)',
    vatTiming: 'Payable on each monthly rental',
  },
  {
    type: 'Asset Refinance',
    slug: 'asset-refinance',
    summary: 'Release equity and capital from assets and machinery already owned.',
    description:
      'The business sells an owned, unencumbered (or partially paid) asset to a finance provider and immediately leases or hires it back. The business receives an immediate capital lump sum while keeping the machinery in continuous operation.',
    keyPoints: [
      'Unlocks working capital without disrupting day-to-day operations',
      'Advance rates typically 60% – 85% of verified market valuation',
      'Can be used to consolidate debt or fund business expansion',
      'Requires verified title, maintenance history, and secondary market demand',
    ],
    typicalTerm: '12 – 60 months',
    ownershipOutcome: 'Finance Provider during term; returns upon completion',
    vatTiming: 'Depends on underlying HP or Leaseback structure',
  },
]

export default function FinancePage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance structures', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Finance structures"
              subtitle="The four primary commercial structures used to fund business equipment in the UK."
            >
              How assets are financed.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="space-y-0">
            {STRUCTURES.map((s, index) => (
              <AnimateOnScroll key={s.type} delay={index * 60}>
                <div className="py-12 border-b border-[var(--color-border-light)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Header & Key Metrics */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-7 bg-orange-500 rounded-full" aria-hidden="true" />
                      <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">
                        {s.type}
                      </h2>
                    </div>
                    <p className="text-body-sm font-medium text-orange-600 pl-4">
                      {s.summary}
                    </p>

                    <div className="pl-4 pt-2 grid grid-cols-1 gap-2 text-xs font-light">
                      <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                        <span className="text-[var(--color-text-on-light-muted)]">Typical Term</span>
                        <span className="font-mono text-[var(--color-text-on-light-primary)]">{s.typicalTerm}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                        <span className="text-[var(--color-text-on-light-muted)]">Ownership End</span>
                        <span className="font-medium text-[var(--color-text-on-light-primary)]">{s.ownershipOutcome}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                        <span className="text-[var(--color-text-on-light-muted)]">VAT Timing</span>
                        <span className="text-[var(--color-text-on-light-primary)]">{s.vatTiming}</span>
                      </div>
                    </div>

                    <div className="pl-4 pt-2">
                      <Link
                        href={`/finance/${s.slug}`}
                        className="inline-flex items-center gap-2 text-body-sm text-orange-600 hover:text-orange-700 font-light group"
                      >
                        Deep dive: {s.type} guide
                        <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Description & Bullet Points */}
                  <div className="lg:col-span-8 space-y-5">
                    <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                      {s.description}
                    </p>
                    <div className="p-5 bg-[var(--color-surface-off-white)] border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-caption font-mono uppercase tracking-wider text-[var(--color-text-on-light-muted)] mb-3">
                        Structural Characteristics
                      </h4>
                      <ul className="space-y-2.5" role="list">
                        {s.keyPoints.map((point) => (
                          <li key={point} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-2" aria-hidden="true" />
                            <span className="text-body-sm font-light text-[var(--color-text-on-light-2)]">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Regulatory Disclaimer */}
          <AnimateOnScroll className="mt-12 p-6 border border-[var(--color-border-light)] rounded-[var(--radius-sm)] bg-[var(--color-surface-light)]">
            <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
              <strong className="font-medium text-[var(--color-text-on-light-primary)]">Commercial & Financial Notice:</strong> This guide provides general commercial information about UK asset finance structures. TAFM is a financial infrastructure and marketplace platform, not a direct lender, and does not provide regulated financial, accounting, or tax advice. Suitability depends on your specific balance sheet, cash flow, and tax status. Seek independent professional advice prior to signing any binding agreement.
            </p>
          </AnimateOnScroll>

          {/* Action CTAs */}
          <AnimateOnScroll className="mt-12">
            <div className="flex flex-wrap gap-4">
              <Button as="a" href="/apply" variant="primary" size="md">
                Start an Application
              </Button>
              <Button as="a" href="/finance-calculator" variant="outline" size="md">
                Finance Calculator
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
