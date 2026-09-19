import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Financial Disclaimer',
  description: 'TAFM Financial Disclaimer — important information about the nature of finance information and calculations provided on tafm.co.uk.',
  canonical: '/legal/financial-disclaimer',
})

export default function FinancialDisclaimerPage() {
  return (
    <>
      <Section variant="dark" spacing="xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/terms' }, { label: 'Financial Disclaimer', current: true }]} variant="dark" className="mb-10" />
          <SectionHeading as="h1" size="display-md" variant="dark" eyebrow="Legal">Financial Disclaimer</SectionHeading>
        </Container>
      </Section>
      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          <div className="space-y-8 text-[var(--color-text-on-light-3)] font-light">

            {/* Prominent disclaimer box */}
            <div className="p-6 border border-amber-200 bg-amber-50 rounded-[var(--radius-md)]">
              <p className="text-body font-light text-amber-900 leading-relaxed">
                <strong className="font-normal">TAFM is not authorised or regulated by the Financial Conduct Authority (FCA) to provide financial advice or to arrange regulated credit agreements.</strong> Information on this website is provided for general information purposes only and does not constitute financial advice, investment advice, credit advice or a recommendation to enter into any finance arrangement.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Nature of the TAFM platform</h2>
              <p className="text-body leading-relaxed">TAFM is a digital marketplace platform. It connects businesses seeking asset finance with specialist finance providers. TAFM does not itself provide finance, make credit decisions, or underwrite finance agreements. Any finance agreement you enter into will be with a regulated finance provider, not with TAFM.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Finance information on this website</h2>
              <p className="text-body leading-relaxed">Descriptions of finance structures (including Hire Purchase, Finance Lease, Operating Lease and Asset Refinance) are provided for general educational purposes. They represent the common characteristics of these products but individual products from individual lenders will have their own specific terms, conditions and eligibility criteria.</p>
              <p className="text-body leading-relaxed">Finance availability, rates and terms are subject to the individual lender's credit assessment of the applicant, the asset, the amount and the prevailing market conditions at the time of application. TAFM makes no representation about the likelihood of any application being approved.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Finance calculator</h2>
              <p className="text-body leading-relaxed">The TAFM finance calculator is an illustrative tool only. It produces indicative monthly payment estimates using a fixed illustrative interest rate. The outputs:</p>
              <ul className="space-y-2 pl-4">
                {[
                  'Do not represent a finance offer from any lender',
                  'Do not represent an approval or indicative approval from any lender',
                  'Do not constitute a binding quote',
                  'Do not account for fees, charges or other costs that may apply',
                  'Are based on a fixed illustrative rate which does not reflect the rate you may be offered',
                  'May not reflect the true cost of finance in all circumstances',
                ].map(i => (
                  <li key={i} className="flex items-start gap-3"><span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0 mt-2.5" aria-hidden="true" /><span className="text-body">{i}</span></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Asset valuations and market data</h2>
              <p className="text-body leading-relaxed">Where indicative asset values or market data are displayed, they represent estimates based on available information and are clearly labelled with their confidence status (Verified / Provisional / Calculated / User Provided / Unknown). TAFM does not guarantee the accuracy of any valuation or market data. Do not rely on TAFM data as the sole basis for any financial decision.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">Independent advice</h2>
              <p className="text-body leading-relaxed">Before entering into any finance agreement, you should seek independent financial advice from an FCA-authorised adviser who can assess your specific circumstances. You should also seek independent legal and tax advice where appropriate.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">AI-generated information</h2>
              <p className="text-body leading-relaxed">Where TAFM uses artificial intelligence to assist in the preparation of asset descriptions, classifications or other outputs, such AI-generated content is clearly identified and has not been verified by an authorised professional. AI outputs should not be relied upon as professional assessments or valuations.</p>
            </div>

          </div>
        </Container>
      </Section>
    </>
  )
}
