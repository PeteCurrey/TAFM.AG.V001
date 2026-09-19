import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Finance Structures',
  description: 'Understand the main asset finance structures available in the UK — Hire Purchase, Finance Lease, Operating Lease and Asset Refinance.',
  canonical: '/finance',
})

const STRUCTURES = [
  {
    type: 'Hire Purchase',
    summary: 'The business owns the asset at the end of the term.',
    description: 'The finance provider purchases the asset and the business repays the cost over an agreed term, plus interest. Ownership transfers to the business at the end of the agreement, often upon payment of a nominal purchase fee.',
    keyPoints: [
      'Asset appears on the balance sheet from commencement',
      'Capital allowances available to the business',
      'VAT is payable upfront on the full asset value (for VAT-registered businesses)',
      'Suitable for assets the business intends to own long-term',
    ],
    typicalTerm: '12 – 72 months',
    ownershipOutcome: 'Business',
  },
  {
    type: 'Finance Lease',
    summary: 'The lender owns the asset; the business leases it for most of its life.',
    description: 'The finance provider retains legal ownership of the asset throughout the primary lease period. The business pays rentals covering most of the asset\'s cost. At the end, the business can enter a secondary period, sell the asset (as agent), or return it.',
    keyPoints: [
      'Asset may appear on balance sheet under IFRS 16',
      'Rentals can be offset against taxable profit',
      'VAT is payable on each rental payment (not upfront)',
      'Suitable for assets the business wants to use but not necessarily own',
    ],
    typicalTerm: '12 – 84 months',
    ownershipOutcome: 'Finance provider (lender)',
  },
  {
    type: 'Operating Lease',
    summary: 'Short-to-medium term use; lender takes residual value risk.',
    description: 'Similar to Finance Lease but with a shorter primary period that does not cover the asset\'s full economic life. The lender retains significant residual value risk. The business returns, extends or upgrades the asset at the end of the term.',
    keyPoints: [
      'Lower monthly payments than HP or Finance Lease',
      'Rentals are typically fully tax-deductible as operating expenditure',
      'Technology risk remains with the lender',
      'Suitable for depreciating assets such as vehicles and technology',
    ],
    typicalTerm: '12 – 48 months',
    ownershipOutcome: 'Finance provider (lender)',
  },
  {
    type: 'Asset Refinance',
    summary: 'Release capital from assets already owned.',
    description: 'The business sells an asset it already owns to a finance provider and immediately leases it back. The business continues to use the asset and receives a cash injection equal to the agreed sale value.',
    keyPoints: [
      'Unlocks capital tied up in owned assets',
      'Business retains use of the asset',
      'Useful for short-term working capital needs',
      'Dependent on the asset having sufficient residual value',
    ],
    typicalTerm: '12 – 60 months',
    ownershipOutcome: 'Finance provider (lender)',
  },
]

export default function FinancePage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Finance structures', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Finance structures" subtitle="The main structures used to finance business asset acquisition in the UK.">
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
                <div className="py-12 border-b border-[var(--color-border-light)] grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1 h-6 bg-orange-500 rounded-full" aria-hidden="true" />
                      <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">{s.type}</h2>
                    </div>
                    <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] pl-4">{s.summary}</p>
                    <div className="mt-4 pl-4 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-label text-[var(--color-text-on-light-muted)] mb-1">Typical term</p>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)]">{s.typicalTerm}</p>
                      </div>
                      <div>
                        <p className="text-label text-[var(--color-text-on-light-muted)] mb-1">Ownership</p>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)]">{s.ownershipOutcome}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">{s.description}</p>
                    <ul className="space-y-2" role="list">
                      {s.keyPoints.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0 mt-2.5" aria-hidden="true" />
                          <span className="text-body-sm font-light text-[var(--color-text-on-light-3)]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12 p-6 border border-[var(--color-border-light)] rounded-[var(--radius-md)] bg-[var(--color-surface-light)]">
            <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
              <strong className="font-normal text-[var(--color-text-on-light-2)]">Important:</strong> This page provides general information about asset finance structures. It does not constitute financial advice. The suitability of any finance structure for your business depends on your specific circumstances, tax position and the assets being financed. You should seek independent financial or tax advice before committing to any finance agreement.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-12">
            <div className="flex flex-wrap gap-4">
              <Button as="a" href="/apply" variant="primary" size="md">Start an Application</Button>
              <Button as="a" href="/finance-calculator" variant="outline" size="md">Finance Calculator</Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
