import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { LeadCaptureForm } from '@/components/marketing/LeadCaptureForm'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Equipment Suppliers — Turn Finance into Part of Your Sales Process',
  description:
    'TAFM for machinery dealers and asset suppliers — help your buyers fund equipment acquisitions with your quotation at the core. You remain supplier of record with zero lender management overhead.',
  canonical: '/for-suppliers',
})

const SUPPLIER_CHAIN = [
  { step: '01', node: 'Customer', desc: 'Identifies machine & confirms purchase intent' },
  { step: '02', node: 'Asset', desc: 'Equipment specifications, options & chassis verified' },
  { step: '03', node: 'Supplier Quote', desc: 'Your formal quotation anchors the transaction' },
  { step: '04', node: 'TAFM', desc: 'Structures requirement & matches eligible providers' },
  { step: '05', node: 'Finance Providers', desc: 'Institutional lenders receive verified deal file' },
  { step: '06', node: 'Underwriting', desc: 'Direct credit review & statutory KYC/AML' },
  { step: '07', node: 'Funded Sale', desc: 'Lender remits invoice payment directly to supplier' },
]

const KEY_PILLARS = [
  {
    title: 'Supplier of Record',
    body: 'Your commercial relationship with your buyer remains completely intact. TAFM provides the financial structuring layer; you issue the machine invoice, maintain delivery schedules, and handle standard aftersales.',
  },
  {
    title: 'Your Quote Anchors the Deal',
    body: 'The structured finance requirement is built directly around your formal quotation and machinery specifications. Lenders evaluate the exact equipment, ensuring valuation accuracy and rapid underwriting.',
  },
  {
    title: 'Zero Direct Lender Management',
    body: 'You do not need to sign restrictive single-lender broker agreements, manage complex credit appetite sheets, or chase individual underwriters. TAFM’s deterministic matching routes the deal to participating providers.',
  },
  {
    title: 'No Fragmented Buyer Applications',
    body: 'Your customer completes a single structured submission rather than applying separately with multiple brokers or lenders, reducing deal abandonment and speeding up time to invoice settlement.',
  },
]

export default function ForSuppliersPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'For Suppliers', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                B2B Commercial Enablement
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="For Equipment Suppliers"
              subtitle="Turn equipment finance into an integrated part of your commercial sales cycle."
            >
              Turn finance into part
              <br />
              of your sales process.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Supplier Transaction Chain Visual */}
      <Section variant="dark-2" spacing="xl" className="border-t border-white/10">
        <Container>
          <AnimateOnScroll>
            <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#080808]">
              <h2 className="text-label tracking-widest uppercase text-white/60 mb-6 text-center">
                The Supplier Commercial Sales Chain
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {SUPPLIER_CHAIN.map((item, idx) => (
                  <div key={item.step} className="p-4 border border-white/10 rounded-sm bg-[#0d0d0d] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-orange-400">{item.step}</span>
                        {idx < SUPPLIER_CHAIN.length - 1 && (
                          <span className="text-white/20 text-xs hidden lg:inline">→</span>
                        )}
                      </div>
                      <h3 className="text-body font-medium text-white mb-1">{item.node}</h3>
                    </div>
                    <p className="text-caption text-white/50 leading-relaxed mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-caption font-light text-white/40 max-w-2xl mx-auto">
                  Payment flows directly from the approved finance provider into your supplier bank account upon customer delivery and receipt sign-off.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Proposition Pillars */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="Commercial Architecture"
            >
              Designed around the machinery sale.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[var(--color-border-light)]">
            {KEY_PILLARS.map((b, i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <div className="p-8 lg:p-10 border-b border-r border-[var(--color-border-light)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full" aria-hidden="true" />
                    <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)]">
                      {b.title}
                    </h3>
                  </div>
                  <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed pl-4">
                    {b.body}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Register Interest Form */}
      <Section variant="light" spacing="2xl" className="border-t border-[var(--color-border-light)]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <AnimateOnScroll className="lg:col-span-5">
              <div>
                <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-4">
                  Partner Network
                </p>
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">
                  Join the TAFM Supplier Network.
                </h2>
                <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-6">
                  TAFM is establishing relationships with equipment manufacturers and authorised dealers across construction, manufacturing, transport, agriculture, and specialist machinery sectors.
                </p>
                <div className="p-5 border-l-2 border-orange-500 bg-orange-50/40 space-y-2">
                  <p className="text-body-sm font-medium text-[var(--color-text-on-light-primary)]">
                    No listing fees or network subscriptions
                  </p>
                  <p className="text-caption font-light text-[var(--color-text-on-light-3)]">
                    Register your commercial details to discuss integrating structured finance options into your quotes and equipment proposals.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100} className="lg:col-span-7">
              <div className="p-8 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                <LeadCaptureForm
                  type="supplier"
                  heading="Register Supplier Interest"
                  description="Tell us about your machinery dealerships and typical equipment ticket size."
                />
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
