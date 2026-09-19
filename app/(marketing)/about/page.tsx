import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'About TAFM',
  description: 'About TAFM — The Asset Finance Marketplace. A digital marketplace and transaction infrastructure platform for UK business asset finance.',
  canonical: '/about',
})

export default function AboutPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="About TAFM">
              The Asset Finance
              <br />
              Marketplace.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          <AnimateOnScroll>
            <div className="space-y-8">
              <div className="space-y-5">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">What TAFM is</h2>
                <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                  TAFM is a digital marketplace and transaction infrastructure platform for business asset finance in the United Kingdom.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  The platform is designed to connect businesses seeking to acquire capital equipment, the suppliers who provide that equipment, and the specialist finance providers who fund the acquisition — through a single, structured process.
                </p>
              </div>

              <div className="space-y-5 pt-4">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">What TAFM is not</h2>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  TAFM does not provide finance directly. We are not a lender. We do not make credit decisions or approve finance applications.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  Finance decisions are made by the regulated finance providers within the TAFM network. TAFM provides the marketplace infrastructure through which applications are submitted and offers are returned.
                </p>
              </div>

              <div className="space-y-5 pt-4">
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">Our market</h2>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  TAFM operates in the UK business asset finance market. Our initial focus is on capital equipment across construction, manufacturing, agriculture, commercial vehicles, industrial equipment, technology and specialist assets.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  The platform architecture is designed to support additional territories in future. Our initial market is the United Kingdom.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
