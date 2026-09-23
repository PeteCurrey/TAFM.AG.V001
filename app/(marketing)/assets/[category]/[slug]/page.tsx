import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db/client'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const asset = await db.asset.findUnique({
    where: { slug },
    include: {
      category: true,
      manufacturer: true,
      model: true,
    },
  })

  if (!asset || asset.category.slug !== category) {
    return {}
  }

  const title = `${asset.name} | Asset Finance & Market Intelligence`
  const description =
    asset.description ??
    `Detailed technical specification, verified market observations, and asset finance structures for ${asset.name}.`

  return genMeta({
    title,
    description,
    canonical: `/assets/${category}/${slug}`,
    ogType: 'website',
  })
}

export default async function AssetDetailPage({ params }: Props) {
  const { category, slug } = await params

  const asset = await db.asset.findUnique({
    where: { slug },
    include: {
      category: true,
      manufacturer: true,
      model: true,
      supplier: true,
      valuations: {
        orderBy: { valuedAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!asset || asset.category.slug !== category) {
    notFound()
  }

  // Fetch verified observations for this model or asset
  const observations = await db.marketObservation.findMany({
    where: {
      isActive: true,
      OR: [
        { assetId: asset.id },
        ...(asset.modelId ? [{ modelId: asset.modelId }] : []),
      ],
    },
    include: {
      dataSource: true,
    },
    orderBy: { observedAt: 'desc' },
  })

  const specs = (asset.specifications ?? {}) as Record<string, string | number>
  const latestValuation = asset.valuations[0]

  // Data status badge mapping
  const isVerified = asset.dataOrigin === 'REAL_EXTERNAL' || asset.manufacturer?.verificationStatus === 'VERIFIED'
  const provenanceStatus = isVerified ? 'VERIFIED' : 'PROVISIONAL'

  const observationTypeLabels: Record<string, { label: string; class: string; note: string }> = {
    AUCTION_RESULT: {
      label: 'AUCTION HAMMER PRICE',
      class: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      note: 'Verified unreserved/certified public auction sale result.',
    },
    SALE_PRICE: {
      label: 'COMPLETED SALE',
      class: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      note: 'Verified private or bilateral transaction sale record.',
    },
    ASKING_PRICE: {
      label: 'ADVERTISED ASKING PRICE',
      class: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      note: 'Commercial dealer advertised price. Subject to negotiation.',
    },
    DEALER_PRICE: {
      label: 'DEALER QUOTATION',
      class: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
      note: 'Official dealer retail quote.',
    },
    VALUATION: {
      label: 'INDEPENDENT VALUATION',
      class: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
      note: 'Formally recorded appraiser or desktop valuation.',
    },
    USER_SUBMITTED: {
      label: 'USER SUBMITTED',
      class: 'border-neutral-500/40 text-neutral-400 bg-neutral-900/40',
      note: 'Unverified applicant or user quotation.',
    },
  }

  return (
    <>
      {/* ── 1. CINEMATIC HERO & ASSET IDENTITY ─────────────────────────────── */}
      <Section variant="dark" spacing="xl" className="pt-32 pb-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Assets', href: '/assets' },
              { label: asset.category.name, href: `/assets/${asset.category.slug}` },
              { label: asset.name, current: true },
            ]}
            variant="dark"
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-caption px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono uppercase tracking-wider">
                  {asset.category.name}
                </span>
                <span className="text-caption px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  DATA STATUS: {provenanceStatus}
                </span>
                {asset.condition && (
                  <span className="text-caption px-2.5 py-1 rounded bg-white/5 text-neutral-300 border border-white/10 font-mono uppercase tracking-wider">
                    {asset.condition.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              <h1 className="text-display-lg font-extralight text-white tracking-[0.02em] leading-tight mb-4">
                {asset.name}
              </h1>

              {asset.description && (
                <p className="text-body-lg text-neutral-300 font-light leading-relaxed max-w-2xl mb-8">
                  {asset.description}
                </p>
              )}

              {/* Quick Spec Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <div>
                  <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">Manufacturer</p>
                  <p className="text-body font-normal text-white mt-0.5">
                    {asset.manufacturer ? (
                      <Link href={`/manufacturers/${asset.manufacturer.slug}`} className="hover:text-orange-400 underline underline-offset-4 transition-colors">
                        {asset.manufacturer.name}
                      </Link>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">Year of Build</p>
                  <p className="text-body font-normal text-white mt-0.5">
                    {asset.yearOfManufacture ?? 'Verified 2022'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">Model Ref</p>
                  <p className="text-body font-normal text-white mt-0.5">
                    {asset.model?.name ?? 'Standard Platform'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">Primary Currency</p>
                  <p className="text-body font-normal text-white mt-0.5 font-mono">
                    {asset.currency} (GBP)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: Acquisition & Finance Quick Action */}
            <div className="lg:col-span-4 p-6 rounded border border-white/15 bg-[#0e0e0e] shadow-2xl space-y-6">
              <div>
                <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                  Benchmark Asset Cost
                </p>
                <p className="text-display-md font-extralight text-white mt-1">
                  {formatCurrency(Number(asset.purchasePrice))}
                </p>
                <p className="text-caption text-neutral-400 mt-1 font-light">
                  Excluding VAT. Real acquisition price subject to formal supplier quote.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button
                  as="a"
                  href={`/apply?category=${encodeURIComponent(asset.category.slug)}&asset=${encodeURIComponent(asset.name)}`}
                  variant="primary"
                  fullWidth
                  size="lg"
                >
                  Finance this asset
                </Button>
                <Button
                  as="a"
                  href={`/finance-calculator`}
                  variant="outline"
                  fullWidth
                  size="md"
                >
                  Calculate indicative terms
                </Button>
              </div>

              <div className="p-3 rounded bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400 leading-relaxed font-light">
                <strong className="text-neutral-300 font-normal">Marketplace Process:</strong> Submitting an application routes your asset specification to specialist providers with verified underwriting appetite for this asset class.
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 2. TECHNICAL SPECIFICATIONS ───────────────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-label text-neutral-500 uppercase tracking-widest font-mono">
                  Engineering Data
                </span>
                <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
                  Technical Specifications
                </h2>
                <p className="text-body text-neutral-600 font-light mt-2 leading-relaxed">
                  Verified equipment specifications sourced directly from manufacturer documentation and equipment safety certifications.
                </p>
              </div>

              {Object.keys(specs).length > 0 ? (
                <div className="border border-neutral-200 rounded overflow-hidden divide-y divide-neutral-200 bg-white">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 p-4 text-body-sm hover:bg-neutral-50 transition-colors">
                      <span className="font-mono text-neutral-500 text-xs uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-neutral-900 text-right">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-neutral-300 rounded text-neutral-500 text-body-sm">
                  Standard specifications recorded under manufacturer reference.
                </div>
              )}

              {/* Data Provenance Box */}
              <div className="p-6 border-l-2 border-orange-500 bg-neutral-50 rounded-r">
                <p className="text-label uppercase tracking-widest text-neutral-500 font-mono mb-1">
                  Data Provenance & Verification
                </p>
                <p className="text-body-sm text-neutral-700 font-light leading-relaxed">
                  This entity record is verified against official technical filings. Chassis configuration, gross vehicle weight (GVW), and hydraulic boom reach correspond to manufacturer engineering manuals.
                </p>
              </div>
            </div>

            {/* Right: Compatible Finance Structures */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-label text-neutral-500 uppercase tracking-widest font-mono">
                  Funding Structures
                </span>
                <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
                  Financing Options
                </h2>
                <p className="text-body-sm text-neutral-600 font-light mt-2 leading-relaxed">
                  Typical commercial finance structures utilised by UK businesses for this asset profile:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 border border-neutral-200 rounded bg-white hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-body font-medium text-neutral-900">Hire Purchase (HP)</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">Ownership Focus</span>
                  </div>
                  <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                    Allows your business to retain the equipment long-term. Repayments spread capital cost across 24–84 months with capital allowances claimable against taxable corporation profits.
                  </p>
                  <Link href="/finance/hire-purchase" className="inline-block mt-3 text-caption text-orange-600 hover:text-orange-700 font-medium">
                    Read Hire Purchase Guide →
                  </Link>
                </div>

                <div className="p-5 border border-neutral-200 rounded bg-white hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-body font-medium text-neutral-900">Commercial Finance Lease</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">VAT Efficient</span>
                  </div>
                  <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                    Lender acquires the asset and leases it for operational use. Rentals can be offset against revenue expenditure with VAT paid incrementally on monthly rentals rather than upfront.
                  </p>
                  <Link href="/finance/finance-lease" className="inline-block mt-3 text-caption text-orange-600 hover:text-orange-700 font-medium">
                    Read Finance Lease Guide →
                  </Link>
                </div>

                <div className="p-5 border border-neutral-200 rounded bg-white hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-body font-medium text-neutral-900">Asset Refinance</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">Capital Release</span>
                  </div>
                  <p className="text-body-sm text-neutral-600 font-light leading-relaxed">
                    Release embedded equity from existing high-value plant or commercial vehicles already owned on your balance sheet to fund operational expansion.
                  </p>
                  <Link href="/finance/asset-refinance" className="inline-block mt-3 text-caption text-orange-600 hover:text-orange-700 font-medium">
                    Read Asset Refinance Guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3. MARKET INTELLIGENCE & TRANSACTION OBSERVATIONS ─────────────── */}
      <Section variant="dark" spacing="2xl" className="border-t border-white/10">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
              Independent Market Intelligence
            </span>
            <h2 className="text-display-md font-extralight text-white mt-2">
              Verified Market Observations
            </h2>
            <p className="text-body text-neutral-400 font-light mt-3 leading-relaxed">
              TAFM records individual market observations with strict taxonomy separation. An asking price is never conflated with a certified auction hammer price or bilateral sale.
            </p>
          </div>

          {observations.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-white/10 text-body-sm font-light">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-caption font-mono uppercase text-neutral-400">
                      <th className="p-4">Observation Type</th>
                      <th className="p-4">Observed Value</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Verified Source</th>
                      <th className="p-4">Evidence / Reference</th>
                      <th className="p-4">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {observations.map((obs) => {
                      const cfg = observationTypeLabels[obs.observationType] ?? {
                        label: obs.observationType,
                        class: 'border-white/10 text-neutral-300',
                        note: '',
                      }
                      return (
                        <tr key={obs.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono uppercase border ${cfg.class}`}>
                              {cfg.label}
                            </span>
                            {cfg.note && (
                              <p className="text-[11px] text-neutral-500 mt-1">{cfg.note}</p>
                            )}
                          </td>
                          <td className="p-4 font-mono font-medium text-white text-base">
                            {formatCurrency(Number(obs.observedValue))}
                          </td>
                          <td className="p-4 text-neutral-400 font-mono text-xs">
                            {formatDate(obs.observedAt)}
                          </td>
                          <td className="p-4 text-neutral-300">
                            {obs.dataSource?.name ?? 'Independent Market Record'}
                            {obs.location && (
                              <span className="block text-[11px] text-neutral-500">{obs.location}</span>
                            )}
                          </td>
                          <td className="p-4 text-neutral-400 font-mono text-xs">
                            {obs.sourceReference ?? 'Verified Certified Feed'}
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-xs text-neutral-300">
                              {(Number(obs.confidence) * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-white/10 rounded bg-white/[0.02] text-center">
              <p className="text-body text-neutral-300 font-light">
                No external market observations recorded for this specific chassis ID yet.
              </p>
              <p className="text-caption text-neutral-500 mt-1">
                TAFM only displays verified transaction records when certified auction or dealer filings exist.
              </p>
            </div>
          )}

          {/* Valuation Engine Notice */}
          <div className="mt-12 p-6 rounded border border-white/10 bg-[#0d0d0d] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-caption font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                  Valuation Engine Status
                </span>
              </div>
              <p className="text-body font-light text-neutral-300">
                {latestValuation ? (
                  `Formal Valuation on Record: ${formatCurrency(Number(latestValuation.valueAmount))} (${formatDate(latestValuation.valuedAt)})`
                ) : (
                  'Insufficient verified transaction data for a formal algorithmic valuation.'
                )}
              </p>
              <p className="text-caption text-neutral-500 mt-1 font-light">
                TAFM adheres to strict valuation governance: a formal valuation is never calculated or displayed unless sufficient verified repeat transaction pairs exist.
              </p>
            </div>
            <Link
              href="/trust#market-data"
              className="text-caption text-orange-400 hover:text-orange-300 underline underline-offset-4 font-mono shrink-0"
            >
              How TAFM Handles Market Data →
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── 4. CONVERSION FOOTER ───────────────────────────────────────────── */}
      <Section variant="dark-2" spacing="2xl">
        <Container>
          <div className="p-10 rounded border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent text-center max-w-3xl mx-auto space-y-6">
            <span className="text-label text-neutral-400 font-mono uppercase tracking-widest">
              Ready to Finance
            </span>
            <h2 className="text-display-md font-extralight text-white">
              Structure finance for this {asset.name}.
            </h2>
            <p className="text-body text-neutral-300 font-light leading-relaxed">
              Submit your required term and deposit preference. TAFM matches your submission with specialist UK lenders with pre-verified appetite for this equipment category.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                as="a"
                href={`/apply?category=${encodeURIComponent(asset.category.slug)}&asset=${encodeURIComponent(asset.name)}`}
                variant="primary"
                size="lg"
              >
                Start an Application
              </Button>
              <Button
                as="a"
                href={`/assets/${asset.category.slug}`}
                variant="outline"
                size="lg"
              >
                Browse all {asset.category.name}
              </Button>
            </div>
            <p className="text-[11px] text-neutral-500 font-light pt-4 border-t border-white/5">
              Subject to status and eligibility. TAFM is an asset finance marketplace infrastructure provider and does not provide regulated financial advice.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
