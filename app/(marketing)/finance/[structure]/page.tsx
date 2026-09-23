import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

interface StructureData {
  name: string
  code: string
  tagline: string
  whatItIs: string
  howOwnershipWorks: string
  typicalUseCases: string[]
  termConsiderations: string
  vatConsiderations: string
  accountingConsiderations: string
  residualValueConsiderations: string
  strengths: string[]
  limitations: string[]
  exampleScenario: {
    title: string
    assetDescription: string
    assetCost: string
    deposit: string
    term: string
    monthlyRental: string
    finalPayment: string
    commercialOutcome: string
  }
  relatedAssetCategories: Array<{ name: string; slug: string }>
}

const STRUCTURES: Record<string, StructureData> = {
  'hire-purchase': {
    name: 'Hire Purchase',
    code: 'HP',
    tagline: 'Spread the cost of business equipment and gain outright legal ownership at the end of the term.',
    whatItIs:
      'Hire Purchase is a traditional asset finance structure where the finance provider purchases the asset on your behalf and hires it to your business over an agreed repayment term. You make fixed monthly payments and, upon payment of a nominal option-to-purchase fee at the end of the agreement, full legal title and ownership transfers to your business.',
    howOwnershipWorks:
      'During the active financing term, the finance provider holds legal title as security for the debt, while your business holds beneficial ownership and operational control. Once all scheduled instalments and the option fee are settled, legal title formally passes to your business.',
    typicalUseCases: [
      'Acquiring plant and machinery with long economic lifespans (10+ years)',
      'Financing commercial vehicles intended for permanent fleet integration',
      'Assets where your business wishes to claim capital allowances against taxable corporation profits',
      'Equipment with strong residual value that your business wants to retain permanently or resell later',
    ],
    termConsiderations:
      'Typical repayment terms span 12 to 72 months (and up to 84 months for high-ticket plant). The finance term is generally matched to the asset’s anticipated operational lifecycle.',
    vatConsiderations:
      'For VAT-registered businesses, 100% of the VAT on the total purchase price is usually payable upfront at agreement inception (or deferred to month 3 or 4 to align with your next quarterly VAT reclaim). Interest payments are exempt from VAT.',
    accountingConsiderations:
      'The asset appears on your balance sheet from day one as a fixed asset, with a corresponding liability for the finance outstanding. Your business can generally claim capital allowances (such as the Annual Investment Allowance or Full Expensing for qualifying new plant and machinery). Interest charges can be offset as a financing expense in your profit & loss account.',
    residualValueConsiderations:
      'Because ownership transfers to you, the residual value risk and upside belong entirely to your business. If the asset retains high value at the end of term, that equity belongs to you. Balloon payments can be structured to lower monthly payments if agreed with the lender.',
    strengths: [
      'Full legal ownership at the conclusion of the agreement',
      'Fixed monthly payments unaffected by interest rate fluctuations',
      'Claim capital allowances and full expensing where eligible',
      'Retain 100% of secondary market value upon eventual equipment resale',
      'No mileage or usage penalties at end of term',
    ],
    limitations: [
      'Full VAT is required upfront or in early months, impacting near-term cash flow',
      'Monthly instalments are typically higher than lease equivalents as you are amortising 100% of the capital cost',
      'Your business carries full obsolescence risk if technology advances rapidly',
      'The asset and liability must sit on your balance sheet',
    ],
    exampleScenario: {
      title: 'Construction Firm Acquires £120,000 Excavator',
      assetDescription: 'New 20-tonne Crawler Excavator with GPS 3D Guidance System',
      assetCost: '£120,000 + VAT',
      deposit: '£12,000 (10% deposit) + £24,000 VAT (reclaimed on next return)',
      term: '60 months (5 years)',
      monthlyRental: '£2,150 / month (illustrative indicative amortisation)',
      finalPayment: '£150 nominal Option-to-Purchase fee',
      commercialOutcome:
        'The contractor claims £120,000 under the Annual Investment Allowance in Year 1, reclaims the full VAT on their next quarter, and owns the excavator unencumbered at month 60 for ongoing site operations.',
    },
    relatedAssetCategories: [
      { name: 'Construction Equipment', slug: 'construction-equipment' },
      { name: 'Commercial Vehicles', slug: 'commercial-vehicles' },
      { name: 'Manufacturing Equipment', slug: 'manufacturing-equipment' },
      { name: 'Agricultural Equipment', slug: 'agricultural-equipment' },
    ],
  },

  'finance-lease': {
    name: 'Finance Lease',
    code: 'FL',
    tagline: 'Acquire high-value machinery without large upfront capital or VAT outlay while retaining operational flexibility.',
    whatItIs:
      'A Finance Lease is a commercial rental agreement where the finance company buys the asset and leases it to your business for the majority of its useful economic life. Unlike Hire Purchase, your business does not automatically take legal title at the end, but you retain operational control and benefit from the majority of the equipment’s economic value.',
    howOwnershipWorks:
      'Legal ownership remains with the finance provider throughout the primary lease term and any secondary period. At the end of the primary period, your business typically has three options: (1) enter a secondary "peppercorn" lease period, (2) sell the asset to an independent third party as the lender’s agent and retain the majority of net sale proceeds (often 90–95%), or (3) return the equipment.',
    typicalUseCases: [
      'Businesses wanting to avoid paying the entire VAT amount upfront',
      'Fleet vehicles and high-value industrial machinery with planned refresh cycles',
      'Companies seeking to offset monthly rental payments against taxable income as operational expenses',
      'Assets where technological refresh is anticipated after 3 to 5 years',
    ],
    termConsiderations:
      'Primary periods typically range from 24 to 60 months. Secondary periods (annual peppercorn rentals) allow continued use at a fraction of the original rental cost.',
    vatConsiderations:
      'VAT is not paid upfront on the purchase price. Instead, VAT is charged incrementally on each monthly lease payment, substantially improving cash flow at acquisition. For commercial vehicles and equipment, this VAT is typically reclaimable in accordance with normal HMRC rules.',
    accountingConsiderations:
      'Under UK GAAP / FRS 102 and IFRS 16, finance leases must generally be recognised on the balance sheet as a "Right of Use" asset with a matching lease liability. The depreciation of the asset and finance charges are charged to profit & loss.',
    residualValueConsiderations:
      'Leases can be structured with a balloon payment at the end of the primary term to keep ongoing rentals lower. When the asset is sold at term end, your business typically receives an agreed rebate of rentals equivalent to 90–95% of the net sale value.',
    strengths: [
      'No upfront VAT lump sum required—VAT is spread across each monthly rental',
      'Lower initial capital requirement preserves working capital for operations',
      'Flexible end-of-term options including secondary peppercorn rental or sales rebate',
      'Potential for balloon structures to reduce monthly overheads',
      'Hedge against rapid technological obsolescence',
    ],
    limitations: [
      'Your business cannot take direct legal ownership of the asset (sale must be to an unconnected third party)',
      'Balance sheet presentation under IFRS 16 treats the lease as an asset and liability',
      'Secondary rentals or sales rebate procedures must be formally managed at term expiry',
    ],
    exampleScenario: {
      title: 'Haulage Operator Leases Three Articulated HGVs',
      assetDescription: 'Three Euro-6 Tractor Units (£90,000 each = £270,000 total)',
      assetCost: '£270,000 + VAT',
      deposit: '£27,000 initial rental (10%) + VAT on initial rental only',
      term: '48 months (4 years)',
      monthlyRental: '£5,450 + VAT / month',
      finalPayment: 'Optional £45,000 balloon payment or sale as agent',
      commercialOutcome:
        'The haulier saved £54,000 in upfront VAT at day one, maintained predictable fleet expenses, and at month 48 sold the units through approved auction, retaining 95% of the £75,000 net proceeds as a rebate of rentals to fund the next fleet replacement.',
    },
    relatedAssetCategories: [
      { name: 'Commercial Vehicles', slug: 'commercial-vehicles' },
      { name: 'Heavy Vehicles', slug: 'heavy-vehicles' },
      { name: 'Manufacturing Equipment', slug: 'manufacturing-equipment' },
      { name: 'Specialist Equipment', slug: 'specialist-equipment' },
    ],
  },

  'operating-lease': {
    name: 'Operating Lease',
    code: 'OL',
    tagline: 'Short-to-medium term equipment usage with minimal balance sheet impact and zero residual value risk.',
    whatItIs:
      'An Operating Lease is an asset funding arrangement where your business hires an asset for a duration substantially shorter than its total economic life. The finance provider assumes the residual value risk at the end of the term, calculating rentals based on the difference between the equipment’s purchase cost and its anticipated future value.',
    howOwnershipWorks:
      'The finance provider or lessor retains legal title and takes full residual value risk at the end of the agreement. Your business simply uses the asset and returns it at term end in agreed condition, with no obligation to purchase or remarket the equipment.',
    typicalUseCases: [
      'High-depreciation assets that become obsolete quickly (IT, telecoms, diagnostic equipment)',
      'Contract-specific machinery required for a defined project duration (e.g. 24–36 month civil engineering contracts)',
      'Businesses requiring regular equipment upgrades to maintain modern energy efficiency standards',
      'Companies wanting the lowest possible monthly outlay without balloon commitments',
    ],
    termConsiderations:
      'Agreements are generally shorter, typically 12 to 48 months, reflecting the period over which the asset is needed.',
    vatConsiderations:
      'VAT is charged on each rental payment as it falls due. For equipment and qualifying commercial vehicles, VAT is fully reclaimable by VAT-registered businesses.',
    accountingConsiderations:
      'Under UK GAAP for small entities (FRS 102 Section 1A), operating leases may often be expensed directly through the profit and loss account as an operational overhead. For larger entities subject to IFRS 16, lease liabilities are capitalised as Right of Use assets unless qualifying for short-term or low-value exemptions.',
    residualValueConsiderations:
      'The finance company carries 100% of the residual value risk. If secondary market values crash, your business is unaffected. However, return conditions (fair wear and tear, maintenance logs, operating hours) must be strictly maintained to avoid de-hire penalties.',
    strengths: [
      'Lowest monthly payments among standard asset finance structures',
      'Lender carries all secondary market depreciation and obsolescence risk',
      'Seamless upgrade path to newer equipment models at contract conclusion',
      'Rentals often fully tax-deductible as operating expenditure',
      'Ideal for project-specific or fixed-term commercial contracts',
    ],
    limitations: [
      'Your business builds zero equity in the asset',
      'Strict adherence to operating hour limits and return condition schedules',
      'Early termination can incur significant settlement fees',
      'Not suited to long-life assets intended for permanent business operation',
    ],
    exampleScenario: {
      title: 'Private Healthcare Clinic Equips Diagnostic Imaging Suite',
      assetDescription: 'High-Field MRI Scanner and Diagnostic Workstations',
      assetCost: '£450,000 + VAT',
      deposit: 'One month advance rental',
      term: '36 months (3 years)',
      monthlyRental: '£9,800 + VAT / month',
      finalPayment: 'Nil (Equipment returned and upgraded)',
      commercialOutcome:
        'The clinic avoids a £450k capital outlay and technological obsolescence. At month 36, the scanner is handed back to the lessor and replaced with the next-generation imaging unit under a fresh lease.',
    },
    relatedAssetCategories: [
      { name: 'Medical Equipment', slug: 'medical-equipment' },
      { name: 'Technology & IT Equipment', slug: 'technology-it-equipment' },
      { name: 'Commercial Vehicles', slug: 'commercial-vehicles' },
      { name: 'Hospitality Equipment', slug: 'hospitality-equipment' },
    ],
  },

  'asset-refinance': {
    name: 'Asset Refinance',
    code: 'AR',
    tagline: 'Unlock tied-up working capital from machinery and commercial vehicles your business already owns.',
    whatItIs:
      'Asset Refinance (also known as Sale and HP Back or Sale and Leaseback) allows a business to release cash equity tied up in existing, unencumbered machinery or vehicles. The finance provider purchases the equipment based on an independent valuation and leases or hires it back to your business over an agreed term, allowing uninterrupted operational use.',
    howOwnershipWorks:
      'Your business sells its unencumbered asset to the finance provider, generating an immediate lump-sum cash injection. You then retain continuous possession and operational use while paying regular instalments. Ownership can either return to your business at term end (Sale and HP Back) or conclude via lease mechanisms.',
    typicalUseCases: [
      'Raising working capital to fund business growth, acquisitions, or seasonal cash flow requirements',
      'Restructuring existing debt into lower-cost, asset-backed repayment terms',
      'Refinancing equipment coming to the end of a primary lease with an existing lender',
      'Unlocking embedded equity in high-value plant to fund deposits on new machinery acquisitions',
    ],
    termConsiderations:
      'Refinance terms typically range from 24 to 60 months, depending on the asset’s age, operational condition, and remaining economic working life.',
    vatConsiderations:
      'Where the asset is sold to the finance provider, VAT treatment depends on whether the original transaction qualified as a second-hand goods margin scheme or standard VAT. Most commercial equipment refinance transactions are structured to be tax-neutral under HMRC rules.',
    accountingConsiderations:
      'The transaction replaces fixed asset value with liquid cash on the balance sheet, with a corresponding finance liability. Any gain or loss on sale may be amortised over the lease term depending on applicable UK GAAP standards.',
    residualValueConsiderations:
      'Advance rates typically range from 60% to 80% of the asset’s orderly liquidation value (OLV) or forced sale value (FSV) as determined by an accredited independent plant and machinery valuation.',
    strengths: [
      'Immediate cash injection without disrupting business operations',
      'No need to sell off revenue-generating machinery to raise capital',
      'Asset-backed lending typically offers lower interest margins than unsecured commercial loans',
      'Flexible term structures tailored to current business cash flow',
    ],
    limitations: [
      'Assets must be unencumbered (or have sufficient equity after clearing existing finance balances)',
      'Requires independent physical or desktop inspection and valuation',
      'Asset must have an identifiable secondary market resale demand',
      'Older equipment (typically > 10–12 years) may not qualify',
    ],
    exampleScenario: {
      title: 'Precision Engineering Firm Releases £180,000 Capital for Expansion',
      assetDescription: 'Two 5-Axis CNC Milling Centres owned outright',
      assetCost: 'Original acquisition: £320,000 (Current market valuation: £240,000)',
      deposit: 'Nil (Asset equity forms the security)',
      term: '48 months (4 years)',
      monthlyRental: '£4,350 / month',
      finalPayment: '£150 option-to-purchase fee at month 48',
      commercialOutcome:
        'The company received an immediate £180,000 liquidity injection (75% loan-to-value) to hire senior engineers and purchase raw materials for a major aerospace contract, with the machines remaining fully operational on the shop floor.',
    },
    relatedAssetCategories: [
      { name: 'Manufacturing Equipment', slug: 'manufacturing-equipment' },
      { name: 'Construction Equipment', slug: 'construction-equipment' },
      { name: 'Heavy Vehicles', slug: 'heavy-vehicles' },
      { name: 'Specialist Equipment', slug: 'specialist-equipment' },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(STRUCTURES).map((structure) => ({ structure }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ structure: string }>
}): Promise<Metadata> {
  const { structure } = await params
  const data = STRUCTURES[structure]
  if (!data) return {}

  return genMeta({
    title: `${data.name} Guide | UK Business Asset Finance`,
    description: `${data.tagline} Comprehensive guide covering ownership, term, VAT, accounting treatment, strengths, limitations, and worked scenarios.`,
    canonical: `/finance/${structure}`,
    ogType: 'article',
  })
}

export default async function FinanceStructurePage({
  params,
}: {
  params: Promise<{ structure: string }>
}) {
  const { structure } = await params
  const data = STRUCTURES[structure]

  if (!data) {
    notFound()
  }

  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance Structures', href: '/finance' },
              { label: data.name, current: true },
            ]}
            variant="dark"
            className="mb-8"
          />

          <AnimateOnScroll>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-caption font-mono uppercase px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                UK Asset Finance Structure · {data.code}
              </span>
              <span className="text-caption font-mono uppercase px-2.5 py-1 rounded bg-white/5 text-neutral-400 border border-white/10">
                Commercial Lending Guide
              </span>
            </div>

            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Commercial Finance Education">
              {data.name}
            </SectionHeading>

            <p className="text-body-lg font-light text-neutral-300 max-w-3xl leading-relaxed mt-4">
              {data.tagline}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button as="a" href={`/apply?structure=${encodeURIComponent(data.name)}`} variant="primary" size="lg">
                Apply for {data.name}
              </Button>
              <Button as="a" href="/finance-calculator" variant="ghost" size="lg">
                Finance Calculator
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. CORE DEFINITION & MECHANICS ────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8 space-y-12">
              {/* What It Is */}
              <div>
                <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
                  Definition & Overview
                </span>
                <h2 className="text-heading-xl font-light text-neutral-900 mt-2 mb-4">
                  What is {data.name}?
                </h2>
                <p className="text-body-lg text-neutral-700 font-light leading-relaxed">
                  {data.whatItIs}
                </p>
              </div>

              {/* How Ownership Works */}
              <div className="p-6 rounded border border-neutral-200 bg-neutral-50 space-y-3">
                <span className="text-label text-orange-600 uppercase font-mono tracking-widest">
                  Legal & Beneficial Title
                </span>
                <h3 className="text-heading-md font-normal text-neutral-900">
                  How Ownership Works
                </h3>
                <p className="text-body text-neutral-700 font-light leading-relaxed">
                  {data.howOwnershipWorks}
                </p>
              </div>

              {/* Typical Use Cases */}
              <div>
                <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
                  Operational Applications
                </span>
                <h2 className="text-heading-xl font-light text-neutral-900 mt-2 mb-4">
                  Typical Use Cases
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.typicalUseCases.map((useCase, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                      <p className="text-body-sm text-neutral-700 font-light leading-relaxed">
                        {useCase}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax, VAT & Accounting Considerations */}
              <div className="space-y-6 pt-4 border-t border-neutral-200">
                <h2 className="text-heading-xl font-light text-neutral-900">
                  Financial, Tax & Accounting Considerations
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded border border-neutral-200 bg-white space-y-2">
                    <h3 className="text-body font-medium text-neutral-900 font-mono text-sm uppercase text-orange-600">
                      VAT Treatment
                    </h3>
                    <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                      {data.vatConsiderations}
                    </p>
                  </div>

                  <div className="p-6 rounded border border-neutral-200 bg-white space-y-2">
                    <h3 className="text-body font-medium text-neutral-900 font-mono text-sm uppercase text-orange-600">
                      Accounting Treatment (IFRS 16 / UK GAAP)
                    </h3>
                    <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                      {data.accountingConsiderations}
                    </p>
                  </div>

                  <div className="p-6 rounded border border-neutral-200 bg-white space-y-2">
                    <h3 className="text-body font-medium text-neutral-900 font-mono text-sm uppercase text-orange-600">
                      Term Considerations
                    </h3>
                    <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                      {data.termConsiderations}
                    </p>
                  </div>

                  <div className="p-6 rounded border border-neutral-200 bg-white space-y-2">
                    <h3 className="text-body font-medium text-neutral-900 font-mono text-sm uppercase text-orange-600">
                      Residual Value & Balloon Risk
                    </h3>
                    <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                      {data.residualValueConsiderations}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths & Limitations Matrix */}
              <div className="pt-6 border-t border-neutral-200 space-y-6">
                <h2 className="text-heading-xl font-light text-neutral-900">
                  Commercial Strengths & Limitations
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Strengths */}
                  <div className="p-6 rounded border border-emerald-200 bg-emerald-50/30 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <h3 className="text-body font-medium text-emerald-900 font-mono text-sm uppercase">
                        Commercial Strengths
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {data.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-body-sm text-neutral-700 font-light">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  <div className="p-6 rounded border border-neutral-300 bg-neutral-50/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neutral-500" />
                      <h3 className="text-body font-medium text-neutral-900 font-mono text-sm uppercase">
                        Commercial Limitations
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {data.limitations.map((lim, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-body-sm text-neutral-600 font-light">
                          <span className="text-neutral-400 font-bold">—</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Real Example Scenario */}
              <div className="pt-6 border-t border-neutral-200 space-y-6">
                <div>
                  <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
                    Illustrative Case Study
                  </span>
                  <h2 className="text-heading-xl font-light text-neutral-900 mt-1">
                    Worked Scenario: {data.exampleScenario.title}
                  </h2>
                </div>

                <div className="p-8 rounded border border-neutral-200 bg-white shadow-sm space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-neutral-200 font-mono text-xs">
                    <div>
                      <span className="text-neutral-400 block uppercase">Asset Cost</span>
                      <span className="text-neutral-900 text-sm font-medium mt-0.5 block">{data.exampleScenario.assetCost}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block uppercase">Initial Deposit</span>
                      <span className="text-neutral-900 text-sm font-medium mt-0.5 block">{data.exampleScenario.deposit}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block uppercase">Term</span>
                      <span className="text-neutral-900 text-sm font-medium mt-0.5 block">{data.exampleScenario.term}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block uppercase">Indicative Rental</span>
                      <span className="text-neutral-900 text-sm font-medium mt-0.5 block">{data.exampleScenario.monthlyRental}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-body-sm font-medium text-neutral-900 uppercase font-mono text-xs mb-1">
                      Commercial Outcome
                    </h4>
                    <p className="text-body text-neutral-700 font-light leading-relaxed">
                      {data.exampleScenario.commercialOutcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Sidebar & Navigation */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              {/* Quick Application Action */}
              <div className="p-6 rounded border border-neutral-200 bg-white shadow-sm space-y-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block">
                  Next Step
                </span>
                <h3 className="text-heading-md font-light text-neutral-900">
                  Ready to apply for {data.name}?
                </h3>
                <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                  Submit your asset quote and business details through one structured application. TAFM matches your criteria with active UK lenders.
                </p>
                <div className="space-y-3 pt-2">
                  <Button
                    as="a"
                    href={`/apply?structure=${encodeURIComponent(data.name)}`}
                    variant="primary"
                    fullWidth
                    size="md"
                  >
                    Start an Application
                  </Button>
                  <Button as="a" href="/finance-calculator" variant="outline" fullWidth size="sm">
                    Open Finance Calculator
                  </Button>
                </div>
              </div>

              {/* Related Asset Categories */}
              <div className="p-6 rounded border border-neutral-200 bg-white space-y-3">
                <h3 className="text-label tracking-widest uppercase text-neutral-500 font-mono text-xs">
                  Common Equipment Categories
                </h3>
                <ul className="space-y-2 text-body-sm font-light">
                  {data.relatedAssetCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link href={`/assets/${cat.slug}`} className="text-orange-600 hover:underline">
                        {cat.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other Finance Structures */}
              <div className="p-6 rounded border border-neutral-200 bg-neutral-50 space-y-3">
                <h3 className="text-label tracking-widest uppercase text-neutral-500 font-mono text-xs">
                  Compare Other Structures
                </h3>
                <ul className="space-y-2 text-body-sm font-light">
                  {Object.entries(STRUCTURES)
                    .filter(([key]) => key !== structure)
                    .map(([key, val]) => (
                      <li key={key}>
                        <Link href={`/finance/${key}`} className="text-neutral-700 hover:text-orange-600 hover:underline">
                          {val.name} ({val.code}) →
                        </Link>
                      </li>
                    ))}
                  <li className="pt-2 border-t border-neutral-200">
                    <Link href="/finance" className="text-neutral-900 font-medium hover:underline text-xs uppercase font-mono">
                      Full Structure Comparison Grid →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Regulatory Disclaimer Callout */}
              <div className="p-5 rounded bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed font-light">
                <strong className="text-neutral-700 font-normal">Regulatory Notice:</strong> TAFM provides commercial information for UK business operators. We do not provide financial, tax, or legal advice. Consult an independent accountant or financial adviser before entering into any finance agreement.
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
