import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Suppliers',
  description: 'TAFM for asset suppliers — turn finance into part of your sales process. Help your customers access structured asset finance without managing lender relationships.',
  canonical: '/for-suppliers',
})

export default function ForSuppliersPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'For Suppliers', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="For asset suppliers">
              Turn finance into part
              <br />
              of your sales process.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <AnimateOnScroll>
              <div className="space-y-6">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">The problem we solve</h2>
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  When a customer cannot immediately fund a capital equipment purchase, the sale is at risk. Some sales teams refer customers to brokers informally. Others lose the deal entirely.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  TAFM provides a structured, professional route for your customers to access asset finance — with your quote at the centre of every application. You remain the supplier of record throughout.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="space-y-5">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">How it works for suppliers</h2>
                {[
                  { title: 'Provide your quote', body: 'Issue your standard commercial quote to the customer. The quote details become part of the finance application.' },
                  { title: 'Customer applies via TAFM', body: 'The customer submits their application through TAFM, referencing your quote and equipment specification.' },
                  { title: 'Finance is assessed', body: 'Specialist asset finance providers assess the application. You are not involved in the finance negotiation.' },
                  { title: 'You are paid on transaction', body: 'Once finance is agreed and drawn down, you receive payment from the finance provider — as with any financed sale.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                      <span className="text-caption text-orange-500 font-light">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-body font-light text-[var(--color-text-on-light-primary)] mb-1">{item.title}</h3>
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)]">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll>
            <div className="p-8 border border-[var(--color-border-light)] rounded-[var(--radius-md)] bg-[var(--color-surface-off-white)]">
              <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-4">Supplier onboarding</h3>
              <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
                TAFM is currently establishing its supplier network. If you supply capital equipment to UK businesses and would like to explore a formal relationship, please get in touch.
              </p>
              <Button as="a" href="/contact" variant="primary" size="md">Register interest</Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
