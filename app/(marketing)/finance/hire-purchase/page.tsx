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
  title: 'Hire Purchase (HP) Asset Finance',
  description:
    'Hire Purchase asset finance explained — ownership model, tax considerations, balance sheet treatment, typical terms, and commercial equipment eligibility.',
  canonical: '/finance/hire-purchase',
})

export default function HirePurchasePage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance', href: '/finance' },
              { label: 'Hire Purchase', current: true },
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
              subtitle="Own the equipment outright after completing the agreed repayment schedule."
            >
              Hire Purchase.
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
                    What is Hire Purchase?
                  </h2>
                  <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-4">
                    Hire Purchase (HP) is an asset finance agreement where a finance provider purchases the equipment directly from the supplier on your behalf. Your business pays an initial deposit followed by fixed monthly instalments over an agreed term (typically 12 to 72 months).
                  </p>
                  <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    Upon payment of all instalments plus a nominal option-to-purchase fee at the end of the term, legal title and outright ownership of the asset transfer automatically to your business.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Ownership Model */}
              <AnimateOnScroll>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                  <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                    Ownership Model & Title
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-light">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">During Agreement</span>
                      <span className="text-[var(--color-text-on-light-primary)] font-medium">Provider retains legal title; business has possession & operational use</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">At Agreement End</span>
                      <span className="text-emerald-700 font-medium">Full legal ownership transfers to business upon final option fee</span>
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
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Long-Life Plant & Machinery</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Heavy engineering tools, CNC machinery, and excavators that retain economic utility well beyond 5–10 years.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Commercial Fleet Vehicles</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        HGVs, tippers, and specialist chassis where ownership at conclusion provides residual value or trade-in equity.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Agricultural Equipment</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Combines, tractors, and grain handling systems, often structured with seasonal payment schedules.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Core Production Infrastructure</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Assets central to daily manufacturing throughput where returning equipment at end of term would disrupt operations.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Commercial Considerations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-4">
                    Key Considerations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border-l-2 border-orange-500 bg-orange-50/40">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">VAT Upfront</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          In standard Hire Purchase, VAT on the full asset purchase price is payable at agreement inception. VAT-registered businesses can typically reclaim this through their standard quarterly VAT return. Some lenders allow VAT deferral (typically up to 3 months) to ease cash flow.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Balance Sheet & Capital Allowances</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Because ownership transfers, the asset appears as a fixed asset on your balance sheet from day one, with corresponding liability. Your business can generally claim capital allowances (such as the Annual Investment Allowance or Full Expensing where eligible).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Maintenance & Insurance</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          The business is responsible for maintaining the asset, servicing to manufacturer standards, and maintaining comprehensive insurance throughout the term.
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
                    Precision Machining Centre (£150,000 + VAT)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-light mb-4 py-3 border-y border-[var(--color-border-light)]">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Deposit (10%)</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">£15,000</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Term</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">60 Months</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">VAT Due</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">£30,000*</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Outcome</span>
                      <span className="font-mono text-base text-emerald-600">Full Ownership</span>
                    </div>
                  </div>
                  <p className="text-caption font-light text-[var(--color-text-on-light-3)]">
                    *The £30,000 VAT is payable upfront (or deferred 90 days), reclaimed on the next VAT quarter, and the remaining £135,000 is amortized over 5 years. Upon the 60th payment and option fee, the machining centre belongs outright to the engineering firm.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Limitations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">
                    Limitations & When NOT to use HP
                  </h2>
                  <ul className="space-y-2 text-body-sm font-light text-[var(--color-text-on-light-3)]" role="list">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Assets with very short lifecycles or rapid technological obsolescence (where returning the asset is preferable).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Businesses with severe cash constraints unable to fund the initial upfront VAT payment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Projects where equipment is required only for a fixed short contract (e.g., 12–18 months).</span>
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
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">12 – 72 months</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Typical Deposit</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">10% – 20%</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">VAT Timing</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">Upfront (deferrable)</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Ownership End</dt>
                    <dd className="text-emerald-700 font-medium">Customer</dd>
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
                  Common Asset Categories
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  <li>
                    <Link href="/assets/manufacturing-equipment" className="text-orange-600 hover:underline">
                      Manufacturing Equipment →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/construction-equipment" className="text-orange-600 hover:underline">
                      Construction Equipment →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/commercial-vehicles" className="text-orange-600 hover:underline">
                      Commercial Vehicles →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/agricultural-equipment" className="text-orange-600 hover:underline">
                      Agricultural Equipment →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <p className="text-caption text-[var(--color-text-on-light-muted)] font-light leading-relaxed">
              Disclaimer: TAFM provides general commercial information regarding UK asset finance structures. We do not provide regulated tax, accounting, or legal advice. Capital allowance eligibility and balance sheet treatments should be verified with your chartered accountant or qualified financial adviser.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
