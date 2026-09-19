import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Finance Providers',
  description: 'TAFM for asset finance lenders — access structured, asset-backed applications from UK businesses. Build your presence in the growing asset finance marketplace.',
  canonical: '/for-lenders',
})

export default function ForLendersPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'For Finance Providers', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="For finance providers">
              Access qualified
              <br />
              asset-finance demand.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <AnimateOnScroll>
              <div className="space-y-6">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">The TAFM proposition</h2>
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  TAFM is building infrastructure to connect specialist asset finance providers with structured, asset-backed applications from UK businesses seeking capital equipment finance.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  Every application is asset-centric. Submissions include the asset specification, supplier quote, business information and finance requirement — providing a structured foundation for underwriting decisions.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  We are currently building our lender network. If you are a specialist asset finance provider with appetite for structured UK asset finance demand, we would like to speak with you.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="space-y-4">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">What you receive</h2>
                {[
                  'Structured, asset-backed application submissions',
                  'Asset specification and supplier quote',
                  'Business financial profile and history',
                  'Finance requirement — amount, structure, term',
                  'Application documents — accounts, bank statements',
                  'TAFM assessment and completeness score',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 py-3 border-b border-[var(--color-border-light)]">
                    <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0 mt-2.5" aria-hidden="true" />
                    <span className="text-body font-light text-[var(--color-text-on-light-3)]">{item}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll>
            <div className="p-8 border border-[var(--color-border-dark)] bg-[var(--color-brand-black)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md font-light text-white mb-4">Lender onboarding</h3>
              <p className="text-body font-light text-[var(--color-text-on-dark-3)] leading-relaxed mb-6">
                We are establishing our lender network. Onboarding will require FCA authorisation verification and agreement to TAFM&apos;s marketplace terms. API integration is the target operating model for volume lenders.
              </p>
              <Button as="a" href="/contact" variant="primary" size="md">Register interest</Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
