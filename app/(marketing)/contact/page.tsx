import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { ContactForm } from '@/components/marketing/ContactForm'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Contact TAFM',
  description: 'Get in touch with TAFM — whether you are a business seeking asset finance, an asset supplier, or a finance provider interested in joining the network.',
  canonical: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container size="narrow">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Contact', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Contact"
              subtitle="We respond to all enquiries as quickly as possible."
            >
              Get in touch.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Sidebar */}
            <AnimateOnScroll>
              <div className="space-y-10">
                <div>
                  <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-4">
                    Who we work with
                  </p>
                  <ul className="space-y-3" role="list">
                    {[
                      'UK businesses acquiring capital equipment',
                      'Asset suppliers and equipment dealers',
                      'Finance providers and lenders',
                      'Brokers and intermediaries',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0 mt-2.5" aria-hidden="true" />
                        <span className="text-body-sm font-light text-[var(--color-text-on-light-3)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 border-t border-[var(--color-border-light)]">
                  <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                    Looking to apply?
                  </p>
                  <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                    If you want to explore finance for a specific asset, the fastest route is to{' '}
                    <a href="/apply" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
                      start an application directly
                    </a>.
                  </p>
                </div>

                <div className="pt-8 border-t border-[var(--color-border-light)]">
                  <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                    Important
                  </p>
                  <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)] leading-relaxed">
                    TAFM does not provide financial advice. We are a marketplace platform. Any finance offered is provided by regulated finance providers within the TAFM network.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Form */}
            <AnimateOnScroll delay={100} className="lg:col-span-2">
              <ContactForm />
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
