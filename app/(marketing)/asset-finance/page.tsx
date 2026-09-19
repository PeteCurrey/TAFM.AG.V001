import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Asset Finance for UK Businesses',
  description:
    'TAFM provides access to specialist asset finance for UK businesses acquiring capital equipment. Hire Purchase, Finance Lease, Operating Lease and more.',
  canonical: '/asset-finance',
})

const STRUCTURES = [
  {
    type: 'Hire Purchase',
    code: 'HP',
    summary: 'Business owns the asset at end of term.',
    detail: 'The finance provider purchases the asset. The business repays the cost over an agreed term, plus interest. Ownership transfers at the end, typically on payment of a nominal purchase fee.',
    ownership: 'Business',
    vatTreatment: 'Payable upfront on full asset value',
    balanceSheet: 'Capitalised from commencement',
    typicalFor: 'Assets the business intends to own long-term',
    termRange: '12 – 72 months',
  },
  {
    type: 'Finance Lease',
    code: 'FL',
    summary: 'Lender owns the asset; business leases for most of its life.',
    detail: 'The finance provider retains legal ownership throughout the primary lease period. The business pays rentals covering most of the asset cost. At end of term: secondary period, sale as agent, or return.',
    ownership: 'Finance provider',
    vatTreatment: 'Payable on each rental payment',
    balanceSheet: 'On balance sheet under IFRS 16',
    typicalFor: 'Assets the business wants to use, not necessarily own',
    termRange: '12 – 84 months',
  },
  {
    type: 'Operating Lease',
    code: 'OL',
    summary: 'Shorter term; lender takes residual value risk.',
    detail: 'Similar to Finance Lease but the primary period does not cover the asset\'s full economic life. The lender retains significant residual value risk. Lower monthly payments. Return, extend or upgrade at end of term.',
    ownership: 'Finance provider',
    vatTreatment: 'Payable on each rental payment',
    balanceSheet: 'Typically off balance sheet',
    typicalFor: 'Depreciating assets: vehicles, technology',
    termRange: '12 – 48 months',
  },
  {
    type: 'Asset Refinance',
    code: 'AR',
    summary: 'Release capital from assets already owned.',
    detail: 'The business sells an asset it already owns to a finance provider and immediately leases it back. The business continues to use the asset and receives a cash injection equal to the agreed sale value.',
    ownership: 'Finance provider',
    vatTreatment: 'Dependent on structure',
    balanceSheet: 'Dependent on structure',
    typicalFor: 'Unlocking capital from owned assets',
    termRange: '12 – 60 months',
  },
]

const WHO_WE_SERVE = [
  {
    audience: 'Manufacturing businesses',
    note: 'Acquiring CNC machines, presses, injection moulding equipment and automated production assets.',
  },
  {
    audience: 'Construction firms',
    note: 'Financing excavators, cranes, piling rigs, scaffolding systems and specialist groundworks equipment.',
  },
  {
    audience: 'Agricultural businesses',
    note: 'Tractors, combine harvesters, irrigation systems and precision agriculture technology.',
  },
  {
    audience: 'Commercial transport operators',
    note: 'HGVs, LGVs, refrigerated vehicles, specialist transport and abnormal load vehicles.',
  },
  {
    audience: 'Healthcare providers',
    note: 'Imaging systems, diagnostic equipment, surgical technology and dental equipment.',
  },
  {
    audience: 'Technology-led businesses',
    note: 'Servers, network infrastructure, production technology and broadcast equipment.',
  },
]

export default function AssetFinancePage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Asset Finance', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Asset Finance"
              subtitle="Structured finance for the acquisition of business capital equipment across all major asset categories."
            >
              Finance built
              <br />
              around the asset.
            </SectionHeading>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100} className="mt-10 flex flex-wrap gap-4">
            <Button as="a" href="/apply" variant="primary" size="lg">Start an Application</Button>
            <Button as="a" href="/finance-calculator" variant="ghost" size="lg">Finance Calculator</Button>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* What is asset finance */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimateOnScroll>
              <div className="space-y-5">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">
                  What is asset finance?
                </h2>
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  Asset finance is a broad category of commercial lending structures used by UK businesses to acquire capital equipment without deploying the full purchase price upfront. The equipment itself — or the cash flows it generates — provides the security for the finance.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  The UK asset finance market is a substantial, established part of the commercial lending landscape. It provides access to critical infrastructure — plant, machinery, vehicles, technology — for businesses across every sector.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  TAFM provides the marketplace infrastructure through which businesses access this market — with one structured application assessed by a network of specialist finance providers.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="space-y-0">
                {[
                  { label: 'Asset-backed', body: 'The asset itself is the primary security. No general charge over the whole business is required in most structures.' },
                  { label: 'Cash flow preservation', body: 'Businesses preserve working capital by spreading the cost of an asset over its useful working life.' },
                  { label: 'Tax efficiency', body: 'Different structures offer different tax treatments — capital allowances, rental deductions, VAT timing.' },
                  { label: 'Speed of access', body: 'Specialist asset finance lenders can move faster than general commercial lenders on equipment acquisitions.' },
                ].map((item, i) => (
                  <AnimateOnScroll key={i} delay={i * 50}>
                    <div className="py-5 border-b border-[var(--color-border-light)]">
                      <div className="flex items-start gap-3">
                        <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0 mt-2.5" aria-hidden="true" />
                        <div>
                          <p className="text-body font-light text-[var(--color-text-on-light-primary)] mb-1">{item.label}</p>
                          <p className="text-body-sm font-light text-[var(--color-text-on-light-3)]">{item.body}</p>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* Finance structures */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="Finance structures"
              subtitle="The main structures used to finance business asset acquisition in the UK. Each has different ownership, tax and balance sheet implications."
            >
              The structures available.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="space-y-0">
            {STRUCTURES.map((s, index) => (
              <AnimateOnScroll key={s.type} delay={index * 60}>
                <div className="py-12 border-b border-[var(--color-border-light)] grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left: name + metadata */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-0.5 h-7 bg-orange-500" aria-hidden="true" />
                      <h3 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">
                        {s.type}
                      </h3>
                    </div>
                    <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] mb-6 pl-3.5">
                      {s.summary}
                    </p>
                    <dl className="space-y-3 pl-3.5">
                      {[
                        { dt: 'Term', dd: s.termRange },
                        { dt: 'Ownership', dd: s.ownership },
                        { dt: 'VAT', dd: s.vatTreatment },
                        { dt: 'Balance sheet', dd: s.balanceSheet },
                      ].map(({ dt, dd }) => (
                        <div key={dt}>
                          <dt className="text-label text-[var(--color-text-on-light-muted)] tracking-wider uppercase mb-0.5">{dt}</dt>
                          <dd className="text-body-sm font-light text-[var(--color-text-on-light-2)]">{dd}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* Right: description + typical use */}
                  <div className="lg:col-span-3 space-y-5">
                    <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                      {s.detail}
                    </p>
                    <div className="p-4 bg-[var(--color-surface-off-white)] rounded-[var(--radius-sm)]">
                      <p className="text-label tracking-wider uppercase text-[var(--color-text-on-light-muted)] mb-1">
                        Typically used for
                      </p>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)]">
                        {s.typicalFor}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Disclaimer */}
          <AnimateOnScroll className="mt-10 p-6 border border-[var(--color-border-light)] rounded-[var(--radius-sm)]">
            <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
              <strong className="font-normal text-[var(--color-text-on-light-2)]">Important:</strong>{' '}
              This page provides general information about asset finance structures. It does not constitute financial advice. The suitability of any finance structure depends on your specific circumstances, tax position and the assets being financed. Seek independent financial or tax advice before committing to any agreement.
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Who we serve */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-12">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="Sectors"
            >
              Businesses we work with.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[var(--color-border-light)]">
            {WHO_WE_SERVE.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 40}>
                <div className="p-6 border-b border-r border-[var(--color-border-light)]">
                  <h3 className="text-heading-sm font-light text-[var(--color-text-on-light-primary)] mb-2">
                    {item.audience}
                  </h3>
                  <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="dark" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll>
              <h2 className="text-heading-xl font-light text-white">
                Ready to explore your options?
              </h2>
              <p className="mt-4 text-body font-light text-[var(--color-text-on-dark-3)] leading-relaxed">
                Start your application or use the finance calculator to understand indicative costs before applying.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100} className="flex flex-wrap gap-4 lg:justify-end">
              <Button as="a" href="/apply" variant="primary" size="lg">Start an Application</Button>
              <Button as="a" href="/finance-calculator" variant="ghost" size="lg">Finance Calculator</Button>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
