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
  title: 'Finance Lease Asset Finance',
  description:
    'Finance Lease explained — ownership model, monthly VAT treatment, primary and secondary periods, commercial equipment use cases, and tax considerations.',
  canonical: '/finance/finance-lease',
})

export default function FinanceLeasePage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance', href: '/finance' },
              { label: 'Finance Lease', current: true },
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
              subtitle="Finance the full operational use of equipment while the provider retains legal ownership."
            >
              Finance Lease.
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
                    What is a Finance Lease?
                  </h2>
                  <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-4">
                    A Finance Lease is a commercial agreement where the finance provider buys the equipment specified by your business and leases it to you for an agreed primary period (typically 24 to 60 months).
                  </p>
                  <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    Unlike Hire Purchase, legal ownership remains with the finance company throughout. The business pays regular rental payments that cover the full capital cost and finance charges. At the end of the primary period, the business can typically enter a secondary 'peppercorn' rental period or act as agent in selling the asset to a third party, retaining the vast majority of sales proceeds.
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
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Legal Title</span>
                      <span className="text-[var(--color-text-on-light-primary)] font-medium">Retained by finance provider throughout agreement</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">At Agreement Conclusion</span>
                      <span className="text-orange-600 font-medium">Continue leasing (peppercorn rental) or sell as agent to 3rd party (retain up to 95–99% of proceeds)</span>
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
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Commercial Vehicles & HGVs</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Haulage and logistics operators who prefer spreading VAT across monthly rentals without paying a large upfront sum.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Industrial Plant & Machinery</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Machinery required for long-term production where secondary peppercorn extensions allow continued low-cost operation.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Technology & Telecommunications</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Data centres, telephony, and production hardware where cash conservation is prioritized over owning hardware at end-of-life.
                      </p>
                    </div>
                    <div className="p-5 border border-[var(--color-border-light)] rounded-sm">
                      <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)] mb-2">Medical & Laboratory Systems</h4>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        Specialist diagnostic systems where clinical practices want structured monthly operating costs matched to revenue.
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
                    <div className="flex items-start gap-4 p-4 border-l-2 border-orange-500 bg-orange-50/40">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">VAT Spread Across Rentals</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          A major cash-flow advantage: VAT is not payable in a single lump sum upfront. Instead, VAT is charged on each monthly rental, making it far easier to budget and manage quarterly working capital.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Tax & Rental Deductibility</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Monthly lease rentals can typically be offset directly against trading profits as an allowable business expense, reducing your Corporation Tax liability over the primary lease term.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border-l-2 border-gray-400 bg-gray-50">
                      <div>
                        <h4 className="text-body font-medium text-[var(--color-text-on-light-primary)]">Secondary Peppercorn Period</h4>
                        <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] leading-relaxed mt-1">
                          Once the primary term concludes, your business can keep running the machinery by paying a nominal annual secondary rental (often called a 'peppercorn rent'), typically equal to one month’s payment per year.
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
                    HGV Articulated Tractor Unit (£110,000 + VAT)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-light mb-4 py-3 border-y border-[var(--color-border-light)]">
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Initial Rental (3x)</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">£6,600 + VAT</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Primary Term</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">48 Months</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">Monthly Rental</span>
                      <span className="font-mono text-base text-[var(--color-text-on-light-primary)]">£2,200 + VAT</span>
                    </div>
                    <div>
                      <span className="block text-caption text-[var(--color-text-on-light-muted)]">End Option</span>
                      <span className="font-mono text-base text-orange-600">Peppercorn / Resell</span>
                    </div>
                  </div>
                  <p className="text-caption font-light text-[var(--color-text-on-light-3)]">
                    The logistics firm avoids paying £22,000 upfront VAT. Over 4 years, rentals are offset against revenue. At month 48, the company either extends for £2,200/year or sells the truck to a third party, retaining 95% of the market sale price.
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
                      <span>The lessee cannot legally buy the asset directly from the lessor at agreement end (due to UK VAT rules); it must be sold to an unconnected third party or leased in secondary period.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>The lessee carries the risk of maintenance, insurance, and residual disposal value.</span>
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
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">24 – 60 months</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Initial Rental</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-mono">1 to 6 rentals in advance</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">VAT Timing</dt>
                    <dd className="text-emerald-700 font-medium">Spread across monthly rentals</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border-light)]">
                    <dt className="text-[var(--color-text-on-light-muted)]">Legal Title</dt>
                    <dd className="text-[var(--color-text-on-light-primary)] font-medium">Finance Provider</dd>
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
                    <Link href="/assets/commercial-vehicles" className="text-orange-600 hover:underline">
                      Commercial Vehicles →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/heavy-vehicles" className="text-orange-600 hover:underline">
                      Heavy Vehicles →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/industrial-equipment" className="text-orange-600 hover:underline">
                      Industrial Equipment →
                    </Link>
                  </li>
                  <li>
                    <Link href="/assets/technology-it-equipment" className="text-orange-600 hover:underline">
                      Technology & IT →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <p className="text-caption text-[var(--color-text-on-light-muted)] font-light leading-relaxed">
              Disclaimer: TAFM provides general information about asset finance structures. We do not provide regulated tax, accounting, or legal advice. Lease accounting standards (such as IFRS 16) require review by your financial controller or chartered accountant.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
