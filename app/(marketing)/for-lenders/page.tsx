import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { LeadCaptureForm } from '@/components/marketing/LeadCaptureForm'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Finance Providers',
  description: 'TAFM for asset finance lenders — access structured, asset-backed applications from UK businesses. Build your presence in the growing asset finance marketplace.',
  canonical: '/for-lenders',
})

const PROPOSITION = [
  {
    title: 'Structured application data',
    body: 'Every TAFM application is asset-centric and structured. Submissions include the asset specification, supplier quote, business financial information and stated finance requirement — providing a consistent, underwritable foundation.',
  },
  {
    title: 'Asset-backed by design',
    body: 'TAFM is not a personal finance broker or general lending aggregator. Every deal originates from a real asset acquisition requirement — equipment, vehicles, machinery — with a named supplier and formal quotation.',
  },
  {
    title: 'Qualified deal flow',
    body: 'Applications are reviewed for completeness before submission to the lender network. Incomplete, incoherent or ineligible submissions do not reach lenders. You receive submissions that are structured for assessment.',
  },
  {
    title: 'API integration model',
    body: 'The target operating model for volume lenders is API integration — structured application data delivered in a format your underwriting systems can consume directly. No re-keying. No PDF submissions.',
  },
  {
    title: 'Sector and asset class targeting',
    body: 'Lenders can configure their appetite by asset category, ticket size, business profile and finance structure type. You receive deal flow matched to your stated criteria.',
  },
  {
    title: 'Transparent marketplace terms',
    body: 'Lender participation is governed by clear marketplace terms. We do not operate as a broker in the traditional sense. Commercial arrangements are established upfront and transparently.',
  },
]

const WHAT_YOU_RECEIVE = [
  'Structured, asset-backed application submissions',
  'Asset specification and supplier quote for every deal',
  'Business financial profile, trading history and sector',
  'Finance requirement — amount, structure preference, term',
  'Supporting documentation — accounts, bank statements',
  'TAFM completeness and data quality assessment',
]

export default function ForLendersPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'For Finance Providers', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="For finance providers"
              subtitle="Structured, asset-backed deal flow from UK businesses acquiring capital equipment."
            >
              Access qualified
              <br />
              asset-finance demand.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Proposition */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="The TAFM proposition"
            >
              Built for specialist asset finance providers.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[var(--color-border-light)]">
            {PROPOSITION.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <div className="p-8 border-b border-r border-[var(--color-border-light)]">
                  <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* What you receive */}
      <Section variant="dark" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <AnimateOnScroll>
              <SectionHeading
                as="h2"
                size="heading-xl"
                variant="dark"
                eyebrow="Per application"
              >
                What every submission includes.
              </SectionHeading>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <ul className="space-y-0" role="list">
                {WHAT_YOU_RECEIVE.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 py-5 border-b border-white/10">
                    <span
                      className="text-caption text-orange-500/60 tabular-nums w-6 flex-shrink-0 pt-0.5"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-body font-light text-[var(--color-text-on-dark-2)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      {/* Lender onboarding */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimateOnScroll>
              <div>
                <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-6">
                  Lender network
                </p>
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">
                  Join the TAFM lender network.
                </h2>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-4">
                  TAFM is currently building its lender network. We are in conversations with specialist asset finance providers across the UK market.
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
                  Lender onboarding requires FCA authorisation verification and agreement to TAFM's marketplace participation terms. API integration is the target model for volume lenders.
                </p>
                <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)] leading-relaxed">
                  This is not a broker referral arrangement. We are building structured marketplace infrastructure. If that is relevant to your business, we would like to speak with you.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <LeadCaptureForm
                type="lender"
                heading="Register interest"
                description="Tell us about your organisation, the asset classes you lend against, and your typical ticket size."
              />
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
