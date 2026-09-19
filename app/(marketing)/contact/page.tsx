'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'

// Note: metadata export doesn't work in client components.
// For production, move form logic to a separate client component.

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement form submission via API when email integration is configured
    // Simulating submission for now
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container size="narrow">
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Contact">
              Get in touch.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          {submitted ? (
            <AnimateOnScroll>
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-green-100 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-3">Message received</h2>
                <p className="text-body font-light text-[var(--color-text-on-light-3)]">We will respond as soon as possible.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <AnimateOnScroll>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">First name *</label>
                    <input id="first-name" name="firstName" type="text" required autoComplete="given-name" className="w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">Last name *</label>
                    <input id="last-name" name="lastName" type="text" required autoComplete="family-name" className="w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">Email address *</label>
                  <input id="email" name="email" type="email" required autoComplete="email" className="w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">Company name</label>
                  <input id="company" name="company" type="text" autoComplete="organization" className="w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light" />
                </div>
                <div>
                  <label htmlFor="reason" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">Reason for contact</label>
                  <select id="reason" name="reason" className="w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light bg-white">
                    <option value="">Select an option</option>
                    <option value="business">I am a business seeking finance</option>
                    <option value="supplier">I am an asset supplier</option>
                    <option value="lender">I am a finance provider</option>
                    <option value="general">General enquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">Message *</label>
                  <textarea id="message" name="message" rows={5} required className="w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light resize-y" />
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                  Send message
                </Button>
                <p className="text-caption text-[var(--color-text-on-light-muted)] text-center">
                  TAFM does not provide financial advice. For finance enquiries, please{' '}
                  <a href="/apply" className="text-orange-500 hover:text-orange-600">start an application</a>.
                </p>
              </form>
            </AnimateOnScroll>
          )}
        </Container>
      </Section>
    </>
  )
}
