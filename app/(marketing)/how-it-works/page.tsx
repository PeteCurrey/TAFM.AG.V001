import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'How It Works',
  description: 'How the TAFM asset finance process works — from asset identification through supplier, application, finance assessment and transaction.',
  canonical: '/how-it-works',
})

const STEPS = [
  { step: '01', title: 'Identify your asset', description: 'You\'ve found the equipment you need. You have a quote from a supplier or you know what you\'re looking for. This is the starting point.' },
  { step: '02', title: 'Start your application', description: 'Submit the asset details, your supplier quote and your business information through one structured application. No need to approach multiple lenders.' },
  { step: '03', title: 'TAFM reviews and prepares', description: 'We review the application for completeness and structure the submission for the lender network. We may request additional information or documents.' },
  { step: '04', title: 'Finance assessment', description: 'Your application is assessed by specialist asset finance providers within the TAFM network. Each lender evaluates the asset, the amount, and your business profile.' },
  { step: '05', title: 'Finance offers', description: 'Where finance is available, you will receive offers from lenders for your consideration. Each offer will clearly state its terms, structure and conditions.' },
  { step: '06', title: 'Transaction and asset acquisition', description: 'Once you accept an offer and complete the lender\'s requirements, the finance is drawn down and your supplier is paid. You acquire the asset.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'How it works', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="The process" subtitle="A single, structured application. Multiple specialist finance providers.">
              How TAFM works.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="space-y-0">
            {STEPS.map((s, index) => (
              <AnimateOnScroll key={s.step} delay={index * 60}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-10 border-b border-[var(--color-border-light)]">
                  <div className="flex items-start gap-4">
                    <span className="text-display-md font-extralight text-orange-500/30 tabular-nums leading-none">{s.step}</span>
                  </div>
                  <div className="md:col-span-3">
                    <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">{s.title}</h2>
                    <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-16 pt-8 border-t border-[var(--color-border-light)]">
            <div className="flex flex-wrap gap-4">
              <Button as="a" href="/apply" variant="primary" size="md">Start your application</Button>
              <Button as="a" href="/asset-finance" variant="outline" size="md">About asset finance</Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
