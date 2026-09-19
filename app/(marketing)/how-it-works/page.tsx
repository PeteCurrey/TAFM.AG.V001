import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { TransactionFlow } from '@/components/marketing/TransactionFlow'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'How It Works',
  description: 'How the TAFM asset finance process works — from asset identification through supplier, application, finance assessment and transaction.',
  canonical: '/how-it-works',
})

const STEPS = [
  {
    step: '01',
    title: 'Identify your asset',
    description: 'You\'ve found the equipment your business needs. You have a supplier quote or a clear specification. This is the starting point — asset and supplier are both identified before you apply.',
    detail: 'TAFM is asset-centric. Every application is anchored to a specific piece of equipment from a specific supplier. General finance enquiries without an identified asset are not how the platform works.',
  },
  {
    step: '02',
    title: 'Start your application',
    description: 'Submit the asset details, your supplier quote and your business information through one structured application. No need to approach multiple lenders individually.',
    detail: 'The application captures: asset specification, supplier details, purchase price, preferred finance structure, term, business financials, and supporting documents. One submission, structured for multiple lenders.',
  },
  {
    step: '03',
    title: 'TAFM reviews and structures',
    description: 'We review the application for completeness and structure the submission for the lender network. We may request additional information or clarification before submission.',
    detail: 'Incomplete submissions are not forwarded to lenders. The review step exists to improve the quality of what lenders receive — reducing the back-and-forth that slows conventional broker processes.',
  },
  {
    step: '04',
    title: 'Finance assessment',
    description: 'Your application is assessed by specialist asset finance providers within the TAFM network. Each lender evaluates the asset, the amount, the finance structure and your business profile.',
    detail: 'Assessment is conducted by the lenders, not by TAFM. TAFM does not make credit decisions. We do not approve or decline applications. Credit decisions are made by regulated finance providers.',
  },
  {
    step: '05',
    title: 'Finance offers',
    description: 'Where finance is available, you will receive offers from lenders for your consideration. Each offer will clearly state its terms, structure, rate and conditions.',
    detail: 'Offers are presented transparently. You are under no obligation to accept any offer. Compare the terms, consult your adviser if appropriate, and make the decision that is right for your business.',
  },
  {
    step: '06',
    title: 'Transaction and asset acquisition',
    description: 'Once you accept an offer and complete the lender\'s requirements, the finance is drawn down and your supplier is paid. You acquire the asset.',
    detail: 'Payment flows from the finance provider to the supplier. You do not handle the funds. The asset is delivered and your finance agreement commences. The asset lifecycle begins.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'How it works', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="The process"
              subtitle="A single, structured application. Multiple specialist finance providers."
            >
              How TAFM works.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Transaction flow visual */}
      <Section variant="dark" spacing="xl" className="border-t border-white/10">
        <Container>
          <AnimateOnScroll>
            <TransactionFlow />
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Steps */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="space-y-0">
            {STEPS.map((s, index) => (
              <AnimateOnScroll key={s.step} delay={index * 50}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12 py-12 border-b border-[var(--color-border-light)]">
                  <div>
                    <span className="text-display-md font-extralight text-orange-500/25 tabular-nums leading-none">
                      {s.step}
                    </span>
                  </div>
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">
                        {s.title}
                      </h2>
                      <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--color-surface-off-white)] rounded-[var(--radius-sm)]">
                      <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  Ready to start? The application process begins with your asset — not with a form. Identify the equipment, get the supplier quote, then apply.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <Button as="a" href="/apply" variant="primary" size="md">Start your application</Button>
                <Button as="a" href="/asset-finance" variant="outline" size="md">About asset finance</Button>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
