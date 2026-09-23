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
  title: 'Operating Lease Asset Finance',
  description:
    'Operating Lease asset finance explained — residual value risk, lower monthly rentals, technology refresh cycles, tax deductions, and return considerations.',
  canonical: '/finance/operating-lease',
})

export default function OperatingLeasePage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance', href: '/finance' },
              { label: 'Operating Lease', current: true },
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
              subtitle="Pay only for the equipment's depreciation during the lease period, with residual value risk held by the lender."
            >
              Operating Lease.
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
                    What is an Operating Lease?
                  </h2>
                  <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-4">
                    An Operating Lease is a rental agreement where a business leases equipment for a defined period that is substantially shorter than the asset’s full economic lifespan (typically 12 to 48 months).
                  </p>
                  <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    The finance provider introduces a calculated residual value (the anticipated value of the asset at the end of the lease) and takes the commercial risk on that value. Because the business is only funding the difference between the initial cost and the forecasted residual value, monthly rental payments are significantly lower than Hire Purchase or standard Finance Lease.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Ownership Model */}
              <AnimateOnScroll>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                  <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                    Ownership Model & Residual Risk
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-light">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Legal Ownership</span>
                      <span className="text-[var(--color-text-on-light-primary)] font-medium">Provider owns the equipment at all times</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Residual Value Risk</span>
                      <span className="text-emerald-700 font-medium">Held entirely by the finance provider</span>
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
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">High-Tech & IT Infrastructure</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Data storage, blade servers, and production workstations that require scheduled upgrades every 24–36 months to prevent obsolescence.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Materials Handling & Forklifts</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Warehouse reach trucks, pallet lifters, and electric counterbalance forklifts with predictable usage and maintenance packages.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Fleet Vans & Light Commercials</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Delivery vans and service fleets operating on high mileage where returning vehicles at contract conclusion eliminates disposal headaches.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Diagnostic Medical Tech</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Ultrasound and clinical imaging scanners where advancing medical software makes ownership unappealing.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Key Considerations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-4">
                    Key Considerations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border-l-2 border-emerald-500 bg-emerald-50/40">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Lower Monthly Commitments</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Because you are not financing the full capital value down to zero, monthly payments are typically the lowest of all asset finance structures.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Tax & P&L Treatment</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Lease rentals are generally treated as operational expenditure (OPEX) and are fully tax-deductible against taxable trading income.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-amber-500 bg-amber-50/40">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Return Conditions & De-Hire Standards</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          At the end of the term, the equipment is returned to the lessor. It must meet agreed return conditions (fair wear and tear). Excess hours or damage beyond standard wear will incur penalty charges.
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
                    Warehouse Forklift Fleet (3x Reach Trucks £75,000 + VAT)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-light mb-4 py-3 border-y border-[var(--color-border-light)]">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Initial Advance</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">3x Rentals</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Term</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">36 Months</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Residual Assumed</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">£30,000 (40%)</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Outcome</span>
                      <span className="font-mono text-base text-emerald-600">Return & Refresh</span>
                    </div>
                  </div>
                  <p className="text-caption font-light text-[var(--color-text-on-light-3)]">
                    The distribution business funds £45,000 of depreciation rather than the full £75,000 price. At month 36, trucks are returned to the lessor and replaced with newer battery-tech models without marketing, selling, or disposal liabilities.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Limitations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">
                    Limitations & Restrictions
                  </h2>
                  <ul className="space-y-2 text-body-sm font-light text-[var(--color-text-on-light-3)]" role="list">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>No equity or ownership builds up in the asset for your business.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Modifications or permanent physical customizations to machinery are strictly controlled or prohibited.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Operating hours and mileage must be monitored to avoid excess wear surcharges.</span>
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
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">12 – 48 months</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Residual Risk</dt>
                    <dd className="text-emerald-700 font-medium">Provider</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Monthly Cost</dt>
                    <dd className="text-emerald-700 font-medium">Lowest relative payments</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">At Term End</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-medium">Return or Upgrade</dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] space-y-3">
                  <Button as="a" href="/apply" variant="primary" fullWidth size="md">
                    Start an Application
                  </Button>
                  <Button as="a" href="/finance-calculator" variant="outline" fullWidth size="sm">
                    Calculate indicative cost
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
                    <Link href="/assets/technology-it-equipment" className="text-orange-600 hover:underline">
                      Technology & IT →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/commercial-vehicles" className="text-orange-600 hover:underline">
                      Commercial Vehicles →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/industrial-equipment" className="text-orange-600 hover:underline">
                      Industrial Handling →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/medical-equipment" className="text-orange-600 hover:underline">
                      Medical Equipment →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <p className="text-caption text-[var(--color-text-on-light-muted)] font-light leading-relaxed">
              Disclaimer: TAFM provides informational guides and criteria matching. We do not provide regulated tax, accounting, or legal advice. Lease classifications under IFRS 16 / FRS 102 should be verified with your professional accounting adviser.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
