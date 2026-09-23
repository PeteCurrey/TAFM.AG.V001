'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { calculate, validateCalculatorInput } from '@/lib/finance/calculator'
import type { CalculatorResult } from '@/lib/finance/calculator'
import { formatCurrency } from '@/lib/utils'

// ─── Finance calculator page ──────────────────────────────────────────────────

// Explicit demonstration rate — strictly labelled as non-market demonstration parameter
const ILLUSTRATIVE_RATE = 0.072 // 7.2% demonstration annual rate

export default function FinanceCalculatorPage() {
  const [assetValue, setAssetValue] = useState<string>('75000')
  const [deposit, setDeposit] = useState<string>('7500')
  const [termMonths, setTermMonths] = useState<number>(48)
  const [result, setResult] = useState<CalculatorResult | null>(() => {
    return calculate({
      assetValue: 75000,
      deposit: 7500,
      termMonths: 48,
      annualRate: ILLUSTRATIVE_RATE,
    })
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleCalculate = useCallback(() => {
    const input = {
      assetValue: parseFloat(assetValue.replace(/,/g, '')) || 0,
      deposit: parseFloat(deposit.replace(/,/g, '')) || 0,
      termMonths,
      annualRate: ILLUSTRATIVE_RATE,
    }

    const validationErrors = validateCalculatorInput(input)
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.message))
      setResult(null)
      return
    }

    setErrors([])
    const calc = calculate(input)
    setResult(calc)
  }, [assetValue, deposit, termMonths])

  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container size="narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Finance Structures', href: '/finance' },
              { label: 'Finance Calculator', current: true },
            ]}
            variant="dark"
            className="mb-8"
          />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-caption font-mono uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Demonstration Tool
            </span>
            <span className="text-caption font-mono uppercase px-2.5 py-1 rounded bg-white/5 text-neutral-400 border border-white/10">
              Illustrative Only
            </span>
          </div>

          <SectionHeading
            as="h1"
            size="display-xl"
            variant="dark"
            eyebrow="Illustrative Calculator"
            subtitle="Explore how deposit amounts and repayment terms influence estimated monthly cash flow. Real terms and interest margins are determined by lender underwriting."
          >
            Indicative Equipment Finance Calculator.
          </SectionHeading>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          {/* Prominent Mandatory Disclosure */}
          <div className="mb-10 p-6 border-l-4 border-amber-500 bg-amber-50/60 rounded-r shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
              <span>⚠</span>
              <span>Important Commercial & Regulatory Disclosure</span>
            </div>
            <p className="text-body-sm font-light text-amber-900 leading-relaxed">
              This calculator provides <strong className="font-semibold">purely illustrative mathematical estimates</strong>. It employs a benchmark 7.2% annual demonstration rate solely to model payment profiles. <strong className="font-semibold">This rate is NOT a market average, standard offering, or guaranteed rate.</strong> Real commercial interest rates, arrangement fees, and deposit requirements vary according to asset category, age, supplier provenance, and your business’s creditworthiness.
            </p>
          </div>

          {/* Calculator form */}
          <div className="p-8 rounded border border-neutral-200 bg-white shadow-sm space-y-6 mb-10">
            <div>
              <label htmlFor="asset-value" className="block text-body-sm font-medium text-neutral-900 mb-1.5">
                Asset Acquisition Price (excl. VAT)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-mono">£</span>
                <input
                  id="asset-value"
                  type="text"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  placeholder="e.g. 75,000"
                  className="w-full pl-8 pr-4 py-3 text-body font-mono border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-light"
                  aria-describedby="asset-value-hint"
                />
              </div>
              <p id="asset-value-hint" className="mt-1 text-caption text-neutral-500">
                Total commercial purchase price quoted by your equipment supplier.
              </p>
            </div>

            <div>
              <label htmlFor="deposit" className="block text-body-sm font-medium text-neutral-900 mb-1.5">
                Initial Deposit / Advance Payment (£)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-mono">£</span>
                <input
                  id="deposit"
                  type="text"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="e.g. 7,500 (10%)"
                  className="w-full pl-8 pr-4 py-3 text-body font-mono border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-light"
                  aria-describedby="deposit-hint"
                />
              </div>
              <p id="deposit-hint" className="mt-1 text-caption text-neutral-500">
                Typical UK asset finance deposits range from 10% to 20% depending on asset age and security.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="term" className="text-body-sm font-medium text-neutral-900">
                  Repayment Term
                </label>
                <span className="font-mono text-sm text-orange-600 font-medium">
                  {termMonths} months ({Math.round((termMonths / 12) * 10) / 10} years)
                </span>
              </div>
              <input
                id="term"
                type="range"
                min={12}
                max={84}
                step={12}
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
                aria-valuemin={12}
                aria-valuemax={84}
                aria-valuenow={termMonths}
              />
              <div className="flex justify-between text-caption text-neutral-400 mt-1 font-mono">
                <span>12m</span>
                <span>24m</span>
                <span>36m</span>
                <span>48m</span>
                <span>60m</span>
                <span>72m</span>
                <span>84m</span>
              </div>
            </div>

            {errors.length > 0 && (
              <div role="alert" className="p-4 border border-red-200 bg-red-50 rounded">
                {errors.map((e, i) => (
                  <p key={i} className="text-body-sm text-red-700 font-light">{e}</p>
                ))}
              </div>
            )}

            <Button onClick={handleCalculate} variant="primary" size="lg" fullWidth>
              Update Indicative Estimate
            </Button>
          </div>

          {/* Results Output */}
          {result && (
            <div className="border border-neutral-300 rounded overflow-hidden shadow-lg" aria-live="polite">
              {/* Top Banner */}
              <div className="bg-[#0e0e0e] text-white p-6 sm:p-8 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    ILLUSTRATIVE ONLY
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Model: {result.termMonths} Months @ 7.2% Demonstration Rate
                  </span>
                </div>

                <p className="text-display-lg font-extralight text-white font-mono">
                  {formatCurrency(result.monthlyPayment)}
                  <span className="text-body-lg text-neutral-400 ml-2 font-sans font-light">/ month</span>
                </p>

                <div className="mt-4 p-3 rounded bg-red-950/40 border border-red-500/30 text-[12px] text-red-200 font-mono tracking-wide">
                  THIS IS NOT A QUOTE, APPROVAL OR FINANCE OFFER.
                </div>
              </div>

              {/* Metric Breakdown */}
              <div className="bg-white p-6 sm:p-8 grid grid-cols-2 gap-6 border-b border-neutral-200 font-mono">
                <div>
                  <p className="text-[11px] uppercase text-neutral-400 tracking-wider">Amount Financed</p>
                  <p className="text-heading-md font-normal text-neutral-900 mt-1">
                    {formatCurrency(result.financedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-neutral-400 tracking-wider">Initial Deposit</p>
                  <p className="text-heading-md font-normal text-neutral-900 mt-1">
                    {formatCurrency(result.deposit)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-neutral-400 tracking-wider">Indicative Interest</p>
                  <p className="text-heading-md font-normal text-neutral-900 mt-1">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-neutral-400 tracking-wider">Total Repayable</p>
                  <p className="text-heading-md font-normal text-neutral-900 mt-1">
                    {formatCurrency(result.totalPayable)}
                  </p>
                </div>
              </div>

              {/* Contextual Links & Action */}
              <div className="bg-neutral-50 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-body-sm font-medium text-neutral-900 uppercase font-mono text-xs mb-3">
                    Learn How This Payment Is Structured
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/finance/hire-purchase"
                      className="p-3 rounded border border-neutral-200 bg-white hover:border-orange-500 text-body-sm font-light text-neutral-700 flex items-center justify-between transition-colors group"
                    >
                      <span>Hire Purchase (HP) Guide</span>
                      <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link
                      href="/finance/finance-lease"
                      className="p-3 rounded border border-neutral-200 bg-white hover:border-orange-500 text-body-sm font-light text-neutral-700 flex items-center justify-between transition-colors group"
                    >
                      <span>Finance Lease Guide</span>
                      <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-4">
                  <Button as="a" href="/apply" variant="primary" size="lg" className="flex-1">
                    Start a Real Application
                  </Button>
                  <Button as="a" href="/assets" variant="outline" size="lg">
                    Browse Asset Taxonomy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
