import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Cookie Policy',
  description: 'TAFM Cookie Policy — how we use cookies and similar technologies on tafm.co.uk.',
  canonical: '/legal/cookies',
})

export default function CookiesPage() {
  return (
    <>
      <Section variant="dark" spacing="xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/terms' }, { label: 'Cookie Policy', current: true }]} variant="dark" className="mb-10" />
          <SectionHeading as="h1" size="display-md" variant="dark" eyebrow="Legal">Cookie Policy</SectionHeading>
        </Container>
      </Section>
      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          <div className="space-y-10 text-[var(--color-text-on-light-3)] font-light">
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">What are cookies?</h2>
              <p className="text-body leading-relaxed">Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work or to work more efficiently, and to provide information to site operators.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Cookies we use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border border-[var(--color-border-light)] rounded-[var(--radius-md)]">
                  <thead className="bg-[var(--color-surface-light)]">
                    <tr>
                      {['Cookie', 'Type', 'Purpose', 'Duration'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-label text-[var(--color-text-on-light-muted)] font-normal border-b border-[var(--color-border-light)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-light)]">
                    {[
                      ['Session', 'Strictly necessary', 'Maintains your session and application progress', 'Session'],
                      ['_tafm_csrf', 'Strictly necessary', 'Cross-site request forgery protection', 'Session'],
                      ['_tafm_analytics', 'Analytics (if consented)', 'Anonymised usage analytics to improve the platform', '12 months'],
                    ].map(([name, type, purpose, duration]) => (
                      <tr key={name} className="hover:bg-[var(--color-surface-off-white)]">
                        <td className="px-4 py-3 font-mono text-[var(--color-text-on-light-2)]">{name}</td>
                        <td className="px-4 py-3">{type}</td>
                        <td className="px-4 py-3">{purpose}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Analytics cookies</h2>
              <p className="text-body leading-relaxed">Where analytics cookies are used, they collect anonymised data about how visitors use our website — pages visited, time on site, referring pages. This data does not identify individual visitors. We use analytics to improve the platform.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Managing cookies</h2>
              <p className="text-body leading-relaxed">You can control and delete cookies through your browser settings. Note that disabling strictly necessary cookies will affect platform functionality. For guidance on managing cookies, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">aboutcookies.org</a>.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Third-party cookies</h2>
              <p className="text-body leading-relaxed">We do not currently use third-party advertising cookies. If we introduce third-party analytics services, they will be listed in this policy and, where required, will only be activated with your consent.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
