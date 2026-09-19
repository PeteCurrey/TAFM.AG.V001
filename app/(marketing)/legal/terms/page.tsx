import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Use',
  description: 'TAFM Terms of Use — the terms governing use of the tafm.co.uk website and platform.',
  canonical: '/legal/terms',
})

export default function TermsPage() {
  const lastUpdated = new Date('2024-01-01')
  return (
    <>
      <Section variant="dark" spacing="xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/terms' }, { label: 'Terms of Use', current: true }]} variant="dark" className="mb-10" />
          <SectionHeading as="h1" size="display-md" variant="dark" eyebrow="Legal">Terms of Use</SectionHeading>
          <p className="text-body-sm text-[var(--color-text-on-dark-muted)] mt-4 font-light">
            Last updated: {lastUpdated.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </Container>
      </Section>
      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          <div className="space-y-10 text-[var(--color-text-on-light-3)] font-light">
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">1. Acceptance of terms</h2>
              <p className="text-body leading-relaxed">By accessing or using the TAFM website at tafm.co.uk, you agree to be bound by these Terms of Use. If you do not agree to these terms, you must not use the TAFM website or platform.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">2. What TAFM is</h2>
              <p className="text-body leading-relaxed">TAFM is a digital marketplace platform that facilitates connections between businesses seeking asset finance, asset suppliers, and specialist finance providers. TAFM is not a lender, a credit broker, or a financial adviser. TAFM does not make credit decisions and does not guarantee finance outcomes.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">3. No financial advice</h2>
              <p className="text-body leading-relaxed">Nothing on this website constitutes financial advice, investment advice, tax advice or legal advice. Information about finance products and structures is provided for general information purposes only. You should obtain independent financial or legal advice before making any financial commitment.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">4. Finance calculator</h2>
              <p className="text-body leading-relaxed">The TAFM finance calculator produces illustrative estimates only. Outputs are not finance offers, quotes or approvals. Real finance terms, rates and monthly payments will vary materially depending on the lender, asset, applicant and prevailing market conditions.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">5. User obligations</h2>
              <p className="text-body leading-relaxed">You must not use TAFM for any unlawful purpose. You must not provide false, inaccurate or misleading information in any enquiry or application. You must not attempt to circumvent security measures or access systems or data you are not authorised to access.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">6. Intellectual property</h2>
              <p className="text-body leading-relaxed">All content on the TAFM website, including text, graphics, data, software and design elements, is the intellectual property of TAFM or its licensors. You may not reproduce, distribute or create derivative works without prior written permission.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">7. Limitation of liability</h2>
              <p className="text-body leading-relaxed">To the fullest extent permitted by law, TAFM shall not be liable for any direct, indirect, incidental or consequential loss arising from your use of the TAFM website or platform, including but not limited to reliance on information provided on the site or the outcome of any finance application.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">8. Governing law</h2>
              <p className="text-body leading-relaxed">These Terms of Use are governed by the laws of England and Wales. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the English courts.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">9. Changes to these terms</h2>
              <p className="text-body leading-relaxed">We may update these Terms of Use from time to time. Continued use of the TAFM website following any changes constitutes acceptance of the revised terms.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
