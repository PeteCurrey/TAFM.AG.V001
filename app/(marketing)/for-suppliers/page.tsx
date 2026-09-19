import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { LeadCaptureForm } from '@/components/marketing/LeadCaptureForm'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Asset Suppliers',
  description: 'TAFM for asset suppliers — turn finance into part of your sales process. Help your customers access structured asset finance without managing lender relationships.',
  canonical: '/for-suppliers',
})

const BENEFITS = [
  {
    title: 'Finance as part of the sale',
    body: 'When a customer cannot immediately fund a capital equipment purchase, the deal is at risk. TAFM provides a structured route for your customers to access asset finance — with your quote at the centre of every application.',
  },
  {
    title: 'No lender relationships to manage',
    body: 'You do not need to develop or maintain relationships with individual finance providers. TAFM manages the lender network. You focus on supplying the asset.',
  },
  {
    title: 'Remain the supplier of record',
    body: 'Your commercial relationship with the customer is preserved throughout. TAFM handles the finance layer. You remain the named supplier on every transaction.',
  },
  {
    title: 'Structured application data',
    body: 'Your quote is captured as structured data — asset specification, price, terms — which becomes part of a standardised application that specialist finance providers can assess efficiently.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Issue your quote', body: 'Provide your standard commercial quote to the customer. The quote details become part of the structured finance application.' },
  { step: '02', title: 'Customer applies via TAFM', body: 'The customer submits their business and asset information through TAFM, referencing your quote and equipment specification.' },
  { step: '03', title: 'Finance is assessed', body: 'Specialist asset finance providers within the TAFM network assess the application. You are not involved in the finance negotiation.' },
  { step: '04', title: 'You are paid on transaction', body: 'Once finance is agreed and drawn down, you receive payment from the finance provider — as with any financed sale.' },
]

export default function ForSuppliersPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'For Suppliers', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="For asset suppliers"
              subtitle="A structured finance channel for your capital equipment sales — without the complexity of managing lender relationships."
            >
              Turn finance into part
              <br />
              of your sales process.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Benefits */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="Why TAFM"
            >
              What we provide for suppliers.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[var(--color-border-light)]">
            {BENEFITS.map((b, i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <div className="p-8 border-b border-r border-[var(--color-border-light)]">
                  <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
                    {b.title}
                  </h3>
                  <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    {b.body}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="The process"
            >
              How it works for suppliers.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="space-y-0">
            {HOW_IT_WORKS.map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 60}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-b border-[var(--color-border-light)]">
                  <div>
                    <span className="text-display-md font-extralight text-orange-500/25 tabular-nums leading-none">
                      {item.step}
                    </span>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Register interest */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimateOnScroll>
              <div>
                <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-6">
                  Supplier network
                </p>
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">
                  Join the TAFM supplier network.
                </h2>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
                  TAFM is currently establishing its supplier network across all major asset categories. If you supply capital equipment to UK businesses, we would like to hear from you.
                </p>
                <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)] leading-relaxed">
                  There is no cost to register interest. Our supplier team will be in touch to discuss fit, process and next steps.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <LeadCaptureForm
                type="supplier"
                heading="Register interest"
                description="Tell us about your business and the types of equipment you supply."
              />
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
