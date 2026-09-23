import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { LeadCaptureForm } from '@/components/marketing/LeadCaptureForm'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Finance Providers — Structured Asset-Backed Demand',
  description:
    'TAFM for institutional asset finance lenders — access verified, structured applications with equipment provenance, supplier quotes, and deterministic criteria matching.',
  canonical: '/for-lenders',
})

const INFORMATION_PROVIDED = [
  {
    title: 'Verified Asset Dossier',
    desc: 'Exact manufacturer, model number, specifications, working hours, and secondary market observations.',
  },
  {
    title: 'Supplier of Record Quotation',
    desc: 'Formal commercial quotation with serial identifiers, VAT breakdown, and delivery schedule from a UK dealer.',
  },
  {
    title: 'Verified Business Profile',
    desc: 'Companies House incorporation data, directors, registered office, trading sector, and operational history.',
  },
  {
    title: 'Structured Finance Requirement',
    desc: 'Requested structure (HP, Lease, Refinance), customer deposit contribution, and proposed amortization term.',
  },
  {
    title: 'Supporting Financial Documentation',
    desc: 'Filed statutory accounts, recent bank statements, and management accounts uploaded via secure HMAC-signed links.',
  },
  {
    title: 'Deterministic Matching Rationale',
    desc: 'Audit trail showing exact versioned criteria matches against your published underwriting parameters.',
  },
]

const PROVIDER_AUTONOMY = [
  'Independent credit risk assessment and scorecard execution',
  'Commercial risk-adjusted rate pricing and fee setting',
  'Statutory KYC, AML, PEP, and ultimate beneficial owner (UBO) verification',
  'Sole authority over deal approval, conditional sanction, or decline',
  'Issuance of formal regulated or exempt commercial finance agreements',
  'Final decision on security, personal guarantees, and debentures',
]

export default function ForLendersPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'For Finance Providers', current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Institutional Lending Channel
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="For Finance Providers"
              subtitle="Access qualified, asset-backed commercial requirements matched to your verified underwriting criteria."
            >
              Structured asset-finance
              <br />
              demand.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Institutional Clarity Banner: Provider Retains Full Underwriting Autonomy */}
      <Section variant="light" spacing="none" className="pt-16 pb-12 border-b border-[var(--color-border-light)]">
        <Container>
          <div className="p-8 border-l-4 border-orange-500 bg-[var(--color-surface-off-white)] rounded-r-sm">
            <h2 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
              Independent Credit Authority & Provider Control
            </h2>
            <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-6">
              TAFM is an asset finance infrastructure and marketplace platform. TAFM does not make credit decisions, issue binding sanctions, or set financial terms. Participating finance providers retain complete autonomy over:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROVIDER_AUTONOMY.map((item, i) => (
                <div key={i} className="p-3 bg-white border border-[var(--color-border-light)] rounded-sm flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" aria-hidden="true" />
                  <span className="text-body-sm font-light text-[var(--color-text-on-light-primary)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* What Every Submission Includes */}
      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll className="mb-16">
            <SectionHeading
              as="h2"
              size="heading-xl"
              variant="light"
              eyebrow="Deal File Structure"
            >
              What every TAFM submission provides.
            </SectionHeading>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INFORMATION_PROVIDED.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 40}>
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white h-full flex flex-col justify-between">
                  <div>
                    <span className="text-caption font-mono text-orange-600 mb-2 block">
                      ITEM 0{i + 1}
                    </span>
                    <h3 className="text-heading-sm font-light text-[var(--color-text-on-light-primary)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Onboarding & Criteria Management */}
      <Section variant="dark-2" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <AnimateOnScroll className="lg:col-span-5">
              <div>
                <p className="text-label tracking-widest uppercase text-white/50 mb-4">
                  Provider Integration
                </p>
                <h2 className="text-heading-xl font-light text-white mb-4">
                  Establish Your Verified Appetite Criteria.
                </h2>
                <p className="text-body font-light text-white/70 leading-relaxed mb-6">
                  TAFM encodes your lending policy into deterministic matching parameters: minimum turnover, trading history, eligible asset categories, and ticket boundaries.
                </p>
                <div className="p-5 border border-white/10 bg-[#0d0d0d] space-y-3 rounded-sm">
                  <h4 className="text-caption font-mono uppercase text-orange-400">
                    Criteria Provenance Model
                  </h4>
                  <p className="text-caption text-white/60 leading-relaxed">
                    Provider criteria are versioned and dated. Every match records an auditable snapshot of the criteria rules in effect when the application was evaluated, ensuring full compliance transparency.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100} className="lg:col-span-7">
              <div className="p-8 border border-[var(--color-border-dark)] rounded-sm bg-[#090909]">
                <LeadCaptureForm
                  type="lender"
                  heading="Register Provider Interest"
                  description="Share your asset finance specialisms and appetite parameters."
                />
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
