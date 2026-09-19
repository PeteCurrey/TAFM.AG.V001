import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy',
  description: 'TAFM Privacy Policy — how we collect, use and protect personal data.',
  canonical: '/legal/privacy',
  robots: 'index, follow',
})

export default function PrivacyPage() {
  const lastUpdated = new Date('2024-01-01')
  return (
    <>
      <Section variant="dark" spacing="xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/terms' }, { label: 'Privacy Policy', current: true }]} variant="dark" className="mb-10" />
          <SectionHeading as="h1" size="display-md" variant="dark" eyebrow="Legal">Privacy Policy</SectionHeading>
          <p className="text-body-sm text-[var(--color-text-on-dark-muted)] mt-4 font-light">
            Last updated: {lastUpdated.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </Container>
      </Section>
      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          <div className="space-y-10 text-[var(--color-text-on-light-3)] font-light">
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">1. Who we are</h2>
              <p className="text-body leading-relaxed">TAFM is a digital marketplace platform for UK business asset finance. This Privacy Policy explains how TAFM collects, uses and protects personal data in connection with the tafm.co.uk website and its associated services.</p>
              <p className="text-body leading-relaxed">TAFM is the data controller for personal data collected through this website. If you have questions about this policy or how we handle your data, please contact us at: <a href="mailto:privacy@tafm.co.uk" className="text-orange-500 hover:text-orange-600">privacy@tafm.co.uk</a></p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">2. Data we collect</h2>
              <p className="text-body leading-relaxed">We collect personal data when you:</p>
              <ul className="space-y-2 list-none pl-4">
                {['Submit a finance enquiry or application', 'Complete the contact form', 'Register an account on the platform', 'Interact with the TAFM website (via analytics)'].map(i => (
                  <li key={i} className="flex items-start gap-3"><span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0 mt-2.5" aria-hidden="true" /><span className="text-body">{i}</span></li>
                ))}
              </ul>
              <p className="text-body leading-relaxed">Data collected may include: name, email address, telephone number, company name and company registration details, business financial information provided as part of a finance application, asset details and supplier quotes, and device/browser analytics data.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">3. How we use your data</h2>
              <p className="text-body leading-relaxed">We use personal data to: process finance enquiries and applications, communicate with you about your enquiry or application, pass structured application data to appropriate finance providers within our network (with your consent), improve the TAFM platform and user experience, and comply with legal and regulatory obligations.</p>
              <p className="text-body leading-relaxed">We do not sell personal data to third parties. We do not use personal data for unsolicited marketing without your consent.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">4. Legal basis for processing</h2>
              <p className="text-body leading-relaxed">We process personal data on the following legal bases: contractual necessity (processing required to deliver the services you have requested), legitimate interests (improving our platform, fraud prevention, security), consent (where you have explicitly agreed to specific processing), and legal obligation (where required by law or regulation).</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">5. Data sharing</h2>
              <p className="text-body leading-relaxed">We may share personal data with: finance providers within the TAFM network where you have submitted a finance application; technology service providers who process data on our behalf under data processing agreements; regulatory authorities where required by law. We do not share data with third parties for their own marketing purposes.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">6. Data retention</h2>
              <p className="text-body leading-relaxed">We retain personal data for as long as necessary to fulfil the purposes for which it was collected, to comply with legal and regulatory requirements, and to defend against legal claims. Finance application data is retained in accordance with financial services record-keeping obligations.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">7. Your rights</h2>
              <p className="text-body leading-relaxed">Under UK GDPR, you have the right to: access the personal data we hold about you, correct inaccurate personal data, request deletion of your personal data (subject to legal obligations), object to certain processing, and lodge a complaint with the ICO (Information Commissioner's Office) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">ico.org.uk</a>.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">8. Cookies</h2>
              <p className="text-body leading-relaxed">We use cookies and similar technologies to operate the website and understand how it is used. See our <a href="/legal/cookies" className="text-orange-500 hover:text-orange-600">Cookie Policy</a> for details.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">9. Changes to this policy</h2>
              <p className="text-body leading-relaxed">We may update this Privacy Policy from time to time. Material changes will be communicated on this page. We encourage you to review this policy periodically.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
