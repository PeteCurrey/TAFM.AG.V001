'use client'

import { useState, useCallback } from 'react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { calculate, validateCalculatorInput } from '@/lib/finance/calculator'
import type { CalculatorResult } from '@/lib/finance/calculator'
import { formatCurrency } from '@/lib/utils'

// ─── Finance calculator page ──────────────────────────────────────────────────

const ILLUSTRATIVE_RATE = 0.072 // 7.2% annual — clearly labelled as illustrative

export default function FinanceCalculatorPage() {
  const [assetValue, setAssetValue] = useState<string>('')
  const [deposit, setDeposit] = useState<string>('')
  const [termMonths, setTermMonths] = useState<number>(48)
  const [result, setResult] = useState<CalculatorResult | null>(null)
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
          <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Finance Calculator" subtitle="An illustrative guide to potential monthly costs. Not a real finance offer or approved rate.">
            Indicative
            <br />
            finance calculator.
          </SectionHeading>
          <div className="mt-6">
            <StatusBadge variant="calculated" label="Illustrative estimates only — not real offers" />
          </div>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container size="narrow">
          {/* Important disclaimer */}
          <div className="mb-10 p-5 border border-amber-200 bg-amber-50 rounded-[var(--radius-md)]">
            <p className="text-body-sm font-light text-amber-800 leading-relaxed">
              <strong className="font-normal">Important:</strong> This calculator provides illustrative estimates only. It uses a single indicative interest rate ({(ILLUSTRATIVE_RATE * 100).toFixed(1)}% per annum) for demonstration purposes. Real finance terms, rates and monthly payments will vary significantly depending on the lender, asset type, your business profile and prevailing market conditions. This output is not a finance offer, quote, or approval.
            </p>
          </div>

          {/* Calculator form */}
          <div className="space-y-6 mb-10">
            <div>
              <label htmlFor="asset-value" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">
                Asset value (£)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-on-light-muted)]">£</span>
                <input
                  id="asset-value"
                  type="text"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  placeholder="e.g. 75000"
                  className="w-full pl-8 pr-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-light"
                  aria-describedby="asset-value-hint"
                />
              </div>
              <p id="asset-value-hint" className="mt-1 text-caption text-[var(--color-text-on-light-muted)]">Total purchase price before VAT</p>
            </div>

            <div>
              <label htmlFor="deposit" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">
                Initial deposit (£)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-on-light-muted)]">£</span>
                <input
                  id="deposit"
                  type="text"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full pl-8 pr-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-light"
                  aria-describedby="deposit-hint"
                />
              </div>
              <p id="deposit-hint" className="mt-1 text-caption text-[var(--color-text-on-light-muted)]">Enter 0 for no deposit</p>
            </div>

            <div>
              <label htmlFor="term" className="block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2">
                Finance term: {termMonths} months ({Math.round(termMonths / 12 * 10) / 10} years)
              </label>
              <input
                id="term"
                type="range"
                min={12}
                max={84}
                step={12}
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full accent-orange-500"
                aria-valuemin={12}
                aria-valuemax={84}
                aria-valuenow={termMonths}
              />
              <div className="flex justify-between text-caption text-[var(--color-text-on-light-muted)] mt-1">
                <span>12 months</span>
                <span>84 months</span>
              </div>
            </div>

            {errors.length > 0 && (
              <div role="alert" className="p-4 border border-red-200 bg-red-50 rounded-[var(--radius-md)]">
                {errors.map((e, i) => (
                  <p key={i} className="text-body-sm text-red-700 font-light">{e}</p>
                ))}
              </div>
            )}

            <Button onClick={handleCalculate} variant="primary" size="lg" fullWidth>
              Calculate indicative cost
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="border border-[var(--color-border-light)] rounded-[var(--radius-md)] overflow-hidden" aria-live="polite" aria-label="Calculator results">
              <div className="bg-[var(--color-surface-light)] p-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-label text-[var(--color-text-on-light-muted)]">Indicative monthly payment</p>
                  <StatusBadge variant="calculated" />
                </div>
                <p className="text-display-lg font-extralight text-[var(--color-text-on-light-primary)]">
                  {formatCurrency(result.monthlyPayment)}
                  <span className="text-body text-[var(--color-text-on-light-muted)] ml-2 font-light">/month</span>
                </p>
                <p className="text-caption text-[var(--color-text-on-light-muted)] mt-1">
                  Using illustrative rate of {(ILLUSTRATIVE_RATE * 100).toFixed(1)}% p.a.
                </p>
              </div>

              <Divider variant="light" spacing="none" />

              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-label text-[var(--color-text-on-light-muted)] mb-1">Amount financed</p>
                  <p className="text-heading-md font-light">{formatCurrency(result.financedAmount)}</p>
                </div>
                <div>
                  <p className="text-label text-[var(--color-text-on-light-muted)] mb-1">Total payable</p>
                  <p className="text-heading-md font-light">{formatCurrency(result.totalPayable)}</p>
                </div>
                <div>
                  <p className="text-label text-[var(--color-text-on-light-muted)] mb-1">Term</p>
                  <p className="text-heading-md font-light">{result.termMonths} months</p>
                </div>
                <div>
                  <p className="text-label text-[var(--color-text-on-light-muted)] mb-1">Total interest</p>
                  <p className="text-heading-md font-light">{formatCurrency(result.totalInterest)}</p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <p className="text-caption text-[var(--color-text-on-light-muted)] leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>

              <div className="px-6 pb-6">
                <Button as="a" href="/apply" variant="primary" fullWidth>
                  Start a real application
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
