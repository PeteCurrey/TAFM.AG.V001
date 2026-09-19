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

export default function AssetFinancePage() {
  return (
    <>
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
          <AnimateOnScroll delay={100} className="mt-10">
            <Button as="a" href="/apply" variant="primary" size="lg">Start an Application</Button>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          <AnimateOnScroll>
            <div className="prose-tafm space-y-6">
              <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)]">What is asset finance?</h2>
              <p className="text-body-lg font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                Asset finance is a broad category of commercial lending structures used by UK businesses to acquire capital equipment without deploying the full purchase price upfront. The equipment itself — or the cash flows it generates — provides the security for the finance.
              </p>
              <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                The UK asset finance market is substantial, providing billions of pounds of funding annually for plant and machinery, vehicles, technology and specialist equipment. It is an established and regulated part of the UK financial services landscape.
              </p>
              <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                TAFM provides the marketplace infrastructure through which businesses can access this market — with one structured application assessed by a network of specialist finance providers.
              </p>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="xl">
        <Container>
          <AnimateOnScroll>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">Ready to explore your options?</h2>
              <p className="text-body font-light text-[var(--color-text-on-light-3)] mb-8">Start your application or use the finance calculator to understand indicative costs.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button as="a" href="/apply" variant="primary" size="md">Start an Application</Button>
                <Button as="a" href="/finance-calculator" variant="outline" size="md">Finance Calculator</Button>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
