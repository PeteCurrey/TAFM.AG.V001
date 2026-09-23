import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Asset Refinance & Sale and Leaseback',
  description:
    'Asset Refinance explained — unlock capital from owned plant, machinery and vehicles. Eligibility criteria, valuation requirements, debt restructuring, and cash injection.',
  canonical: '/finance/asset-refinance',
})

export default function AssetRefinancePage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance', href: '/finance' },
              { label: 'Asset Refinance', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Finance Structure"
              subtitle="Release capital from unencumbered machinery or restructure existing asset finance agreements."
            >
              Asset Refinance.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Definition */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">
                    What is Asset Refinance?
                  </h2>
                  <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-4">
                    Asset Refinance (often executed as a Sale and HP Back or Sale and Leaseback) allows a business to release cash tied up in equipment, machinery, or commercial vehicles it already owns or partially owns.
                  </p>
                  <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    A specialist finance provider assesses the current secondary market value of your equipment. They buy the asset from you—injecting immediate capital into your bank account—and agree an amortization schedule over 12 to 60 months. Your operations continue without interruption, as the machinery remains on your premises in constant commercial use.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Ownership Model */}
              <AnimateOnScroll>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                  <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                    Refinance Mechanism
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-light">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Immediate Transaction</span>
                      <span className="text-[var(--color-text-on-light-primary)] font-medium">Lender purchases asset; lump sum cash injected into business</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Operational Possession</span>
                      <span className="text-emerald-700 font-medium">Business maintains full uninterrupted possession & productive use</span>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Typical Use Cases */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-4">
                    Typical Commercial Use Cases
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Unlocking Growth Working Capital</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Funding new contracts, facility expansions, or stock purchases by unlocking capital from paid-off factory machinery.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Debt Consolidation & Restructuring</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Replacing expensive short-term overdrafts or merchant cash advances with structured, lower-rate asset-backed term finance.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Funding Balloon / Residual Payments</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Refinancing an upcoming balloon payment on heavy commercial vehicles or plant to retain the asset over an extended term.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Management Buyouts / Acquisitions</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Leveraging the target company’s existing tangible plant balance sheet to fund transaction equity.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Key Considerations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-4">
                    Key Eligibility & Documentation Criteria
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border-l-2 border-orange-500 bg-orange-50/40">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Proof of Ownership & Clear Title</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          You must prove unencumbered ownership via original purchase invoices, bank proof of payment, or formal finance settlement letters if existing finance is being replaced.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Independent Market Valuation</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Lenders typically lend between 60% and 85% of forced sale value or orderly liquidation value, determined by independent desktop or physical inspection.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Asset Age & Remaining Useful Life</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Refinance appetite is strongest for machinery under 7–10 years old with documented maintenance records and robust secondary resale markets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Example Scenario */}
              <AnimateOnScroll>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white shadow-sm">
                  <span className="text-caption font-mono uppercase tracking-wider text-orange-600 block mb-2">
                    Commercial Example Scenario
                  </span>
                  <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
                    Civil Engineering Fleet Refinance
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-light mb-4 py-3 border-y border-[var(--color-border-light)]">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Assets Owned</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">3x Excavators</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Market Value</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">£240,000</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Cash Released</span>
                      <span className="font-mono text-base text-emerald-600">£180,000 (75%)</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">New Term</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">48 Months</span>
                    </div>
                  </div>
                  <p className="text-caption font-light text-[var(--color-text-on-light-3)]">
                    The contractor owned the machinery outright. By refinancing, they unlocked £180,000 in liquid capital to win a major regional infrastructure contract, repaying the loan in structured monthly instalments while the plant remained active on site.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Limitations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">
                    Limitations & What Cannot Be Refinanced
                  </h2>
                  <ul className="space-y-2 text-body-sm font-light text-[var(--color-text-on-light-3)]" role="list">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Bespoke or custom fixtures with negligible secondary auction market value.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Machinery with missing serial numbers, unknown origins, or unresolved debentures/charges.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Assets nearing the very end of their usable economic operational life.</span>
                    </li>
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-4">
                  Quick Facts
                </h3>
                <dl className="space-y-3 text-sm font-light">
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Typical Terms</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">12 – 60 months</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Advance Rate</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">60% – 85% of valuation</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Valuation Basis</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-medium">Desktop or Physical</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Asset Location</dt>
                    <dd className="text-emerald-700 font-medium">Remains on your site</dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] space-y-3">
                  <Button as="a" href="/apply" variant="primary" fullWidth size="md">
                    Start an Application
                  </Button>
                  <Button as="a" href="/finance-calculator" variant="outline" fullWidth size="sm">
                    Calculate monthly cost
                  </Button>
                </div>
              </div>

              {/* Related Categories */}
              <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white">
                <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                  Common Refinance Assets
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  <li>
                    <Link href="/assets/construction-equipment" className="text-orange-600 hover:underline">
                      Construction Equipment →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/manufacturing-equipment" className="text-orange-600 hover:underline">
                      Manufacturing Plant →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/commercial-vehicles" className="text-orange-600 hover:underline">
                      Commercial Vehicles →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/agricultural-equipment" className="text-orange-600 hover:underline">
                      Agricultural Fleet →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <p className="text-caption text-[var(--color-text-on-light-muted)] font-light leading-relaxed">
              Disclaimer: TAFM provides general information about asset refinance structures. We do not provide regulated debt advisory services. Any refinance agreement is subject to lender credit approval, asset inspection, and verification of unencumbered title.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
