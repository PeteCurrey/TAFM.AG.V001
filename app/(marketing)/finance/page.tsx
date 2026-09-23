import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'UK Asset Finance Structures Compared',
  description:
    'Compare the four primary UK business asset finance structures: Hire Purchase, Finance Lease, Operating Lease, and Asset Refinance. Detailed analysis of ownership, balance sheet, VAT, and capital allowances.',
  canonical: '/finance',
})

const COMPARISON_ROWS = [
  {
    feature: 'Legal Ownership',
    hp: 'Transfers to business upon final option fee',
    fl: 'Lender retains title; business benefits from use & sale rebate',
    ol: 'Lender retains title throughout; returned at term end',
    ar: 'Transfers to lender then returns to business at term end',
  },
  {
    feature: 'VAT Treatment',
    hp: '100% VAT payable upfront or deferred to month 3/4',
    fl: 'VAT charged incrementally on each monthly rental',
    ol: 'VAT charged incrementally on each monthly rental',
    ar: 'Typically structured to be VAT neutral on used assets',
  },
  {
    feature: 'Balance Sheet Treatment',
    hp: 'Capitalised as Fixed Asset with corresponding debt liability',
    fl: 'Right of Use asset & lease liability under IFRS 16 / FRS 102',
    ol: 'Right of Use asset under IFRS 16; operating cost for small entities',
    ar: 'Replaces fixed asset with cash equity and finance liability',
  },
  {
    feature: 'Tax & Capital Allowances',
    hp: 'Business claims Capital Allowances (AIA / Full Expensing)',
    fl: 'Monthly rentals generally deductible against taxable profit',
    ol: 'Rentals generally 100% deductible as operational overhead',
    ar: 'Tax treatment reflects underlying asset write-down & interest',
  },
  {
    feature: 'Typical Term',
    hp: '12 – 72 months (up to 84 months for specialist plant)',
    fl: '24 – 60 months (with secondary peppercorn option)',
    ol: '12 – 48 months (matched to specific project or refresh cycle)',
    ar: '24 – 60 months (based on remaining working economic life)',
  },
  {
    feature: 'Residual Value Risk',
    hp: 'Business carries all depreciation & resale upside/risk',
    fl: 'Business typically receives 90–95% of net sale proceeds',
    ol: 'Lender carries 100% of residual value & market risk',
    ar: 'Lender advances 60–80% of independent orderly liquidation value',
  },
  {
    feature: 'Best Suited For',
    hp: 'Long-life assets, permanent fleet, high capital allowance claims',
    fl: 'Preserving upfront cash, commercial vehicles, planned upgrades',
    ol: 'Fast-depreciating technology, fixed contracts, minimal commitment',
    ar: 'Releasing working capital from unencumbered machinery already owned',
  },
]

const STRUCTURE_CARDS = [
  {
    slug: 'hire-purchase',
    name: 'Hire Purchase',
    code: 'HP',
    highlight: 'Ownership Focus',
    summary:
      'The business pays instalments over a fixed term and owns the asset outright at the end. The asset appears on balance sheet from day one with capital allowances claimable.',
    pros: ['Full legal ownership', 'Claim capital allowances', 'Fixed repayments'],
  },
  {
    slug: 'finance-lease',
    name: 'Finance Lease',
    code: 'FL',
    highlight: 'Cash Flow & VAT Efficiency',
    summary:
      'The finance provider owns the asset. The business leases it for its economic life and benefits from use without upfront VAT capital outlay. Retain up to 95% of resale value.',
    pros: ['VAT spread across rentals', 'Preserves upfront capital', 'Flexible secondary term'],
  },
  {
    slug: 'operating-lease',
    name: 'Operating Lease',
    code: 'OL',
    highlight: 'Lowest Monthly Outlay',
    summary:
      'Short-to-medium term lease where the lender takes full residual value risk. Return or upgrade the asset at term end with minimal balance sheet exposure.',
    pros: ['Lowest monthly rentals', 'Zero residual risk', 'Seamless upgrade path'],
  },
  {
    slug: 'asset-refinance',
    name: 'Asset Refinance',
    code: 'AR',
    highlight: 'Working Capital Release',
    summary:
      'Release tied-up equity in assets already owned. The equipment is sold to a finance provider and leased back, providing immediate liquid cash for business growth.',
    pros: ['Immediate cash injection', 'Machinery remains in use', 'Lower rates than loans'],
  },
]

export default function FinancePage() {
  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Finance Structures', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                UK Business Lending Architecture
              </span>
            </div>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Commercial Structures"
              subtitle="Asset finance is not a single product. Different machinery and business circumstances demand different structures. Compare ownership, tax treatment, VAT, and balance sheet impact below."
            >
              How Assets Are Financed.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. STRUCTURE CARDS ────────────────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Core Methodologies
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              The Four Primary Asset Finance Structures
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Select any structure to read a comprehensive educational guide covering ownership mechanics, accounting standards, and worked commercial scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STRUCTURE_CARDS.map((card, idx) => (
              <AnimateOnScroll key={card.slug} delay={idx * 60}>
                <div className="p-8 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-all flex flex-col justify-between h-full shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-caption font-mono px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                        {card.code}
                      </span>
                      <span className="text-caption font-mono uppercase text-neutral-400">
                        {card.highlight}
                      </span>
                    </div>

                    <h3 className="text-heading-lg font-light text-neutral-900 mb-3">
                      {card.name}
                    </h3>

                    <p className="text-body-sm font-light text-neutral-600 leading-relaxed mb-6">
                      {card.summary}
                    </p>

                    <div className="space-y-2 mb-8">
                      {card.pros.map((pro, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2 text-xs font-light text-neutral-700">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href={`/finance/${card.slug}`}
                      className="text-body-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
                    >
                      Read {card.name} Guide →
                    </Link>
                    <Button as="a" href={`/apply?structure=${encodeURIComponent(card.name)}`} variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. COMPARISON MATRIX ──────────────────────────────────────────── */}
      <Section variant="light" spacing="2xl" className="border-t border-neutral-200 bg-neutral-50/50">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Direct Side-by-Side Comparison
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              Key Structural Distinctions
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Compare ownership, tax position, and accounting implications across all four structures:
            </p>
          </div>

          <div className="overflow-x-auto rounded border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-body-sm font-light">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 font-mono text-xs uppercase text-neutral-700">
                  <th className="p-4 w-1/5">Commercial Feature</th>
                  <th className="p-4 w-1/5">Hire Purchase</th>
                  <th className="p-4 w-1/5">Finance Lease</th>
                  <th className="p-4 w-1/5">Operating Lease</th>
                  <th className="p-4 w-1/5">Asset Refinance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-neutral-900 text-xs uppercase">
                      {row.feature}
                    </td>
                    <td className="p-4 text-neutral-700 leading-relaxed text-xs">
                      {row.hp}
                    </td>
                    <td className="p-4 text-neutral-700 leading-relaxed text-xs">
                      {row.fl}
                    </td>
                    <td className="p-4 text-neutral-700 leading-relaxed text-xs">
                      {row.ol}
                    </td>
                    <td className="p-4 text-neutral-700 leading-relaxed text-xs">
                      {row.ar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Qualified Regulatory Disclaimer */}
          <div className="mt-12 p-6 rounded border border-neutral-200 bg-white">
            <p className="text-body-sm font-light text-neutral-600 leading-relaxed">
              <strong className="font-normal text-neutral-900">Regulatory Disclaimer:</strong> The comparison table and structural definitions on this page are provided for educational and illustrative purposes only. TAFM does not provide financial, legal, or tax advice. Accounting and tax treatments depend on the individual circumstances of your business and prevailing HMRC / UK GAAP rules. We recommend consulting your qualified accountant or tax adviser before entering into any finance commitment.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button as="a" href="/apply" variant="primary" size="md">
              Start an Application
            </Button>
            <Button as="a" href="/finance-calculator" variant="outline" size="md">
              Try Illustrative Calculator
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
