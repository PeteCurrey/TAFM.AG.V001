// ─── Finance calculator ───────────────────────────────────────────────────────
//
// Pure calculation functions for illustrative finance estimates.
//
// IMPORTANT:
//   - These calculations produce ILLUSTRATIVE estimates only.
//   - They must NEVER be presented as real lender offers or approved rates.
//   - Real finance terms come from actual lender integrations, not this module.
//   - All outputs must be labelled with DataStatus: 'CALCULATED'

import { round } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalculatorInput {
  assetValue: number    // Total purchase price (GBP)
  deposit: number       // Deposit amount (GBP)
  termMonths: number    // Finance term in months
  annualRate: number    // Annual interest rate as decimal (e.g. 0.07 for 7%)
  balloonAmount?: number // Optional balloon/residual payment at end of term
}

export interface CalculatorResult {
  // Inputs (echoed back for traceability)
  assetValue: number
  deposit: number
  termMonths: number
  annualRate: number
  balloonAmount: number

  // Calculated outputs
  financedAmount: number
  monthlyPayment: number
  totalPayable: number
  totalInterest: number
  effectiveMonthlyRate: number

  // Data integrity flag — always CALCULATED, never VERIFIED
  status: 'CALCULATED'

  // Mandatory disclosure
  disclaimer: string
}

export interface CalculatorError {
  field: string
  message: string
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateCalculatorInput(
  input: Partial<CalculatorInput>,
): CalculatorError[] {
  const errors: CalculatorError[] = []

  if (!input.assetValue || input.assetValue <= 0) {
    errors.push({ field: 'assetValue', message: 'Asset value must be greater than zero.' })
  }

  if (input.deposit === undefined || input.deposit < 0) {
    errors.push({ field: 'deposit', message: 'Deposit must be zero or greater.' })
  }

  if (input.assetValue && input.deposit && input.deposit >= input.assetValue) {
    errors.push({ field: 'deposit', message: 'Deposit must be less than the asset value.' })
  }

  if (!input.termMonths || input.termMonths < 6 || input.termMonths > 84) {
    errors.push({ field: 'termMonths', message: 'Term must be between 6 and 84 months.' })
  }

  if (input.annualRate === undefined || input.annualRate < 0 || input.annualRate > 1) {
    errors.push({ field: 'annualRate', message: 'Annual rate must be between 0% and 100%.' })
  }

  return errors
}

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculate illustrative monthly payments using the standard annuity formula.
 * Used for Hire Purchase and Finance Lease structures.
 *
 * Formula: PMT = (P * r) / (1 - (1 + r)^-n)
 * where P = principal, r = monthly rate, n = number of periods
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  balloonAmount: number = 0,
): number {
  if (annualRate === 0) {
    // Zero-rate: simple division
    return round((principal - balloonAmount) / termMonths, 2)
  }

  const monthlyRate = annualRate / 12
  const denominator = 1 - Math.pow(1 + monthlyRate, -termMonths)

  // Adjust principal for balloon payment (present value of balloon)
  const balloonPV = balloonAmount / Math.pow(1 + monthlyRate, termMonths)
  const adjustedPrincipal = principal - balloonPV

  const payment = (adjustedPrincipal * monthlyRate) / denominator

  return round(payment, 2)
}

// ─── Main calculate function ──────────────────────────────────────────────────

const CALCULATOR_DISCLAIMER =
  'This calculation is an illustrative estimate only. It does not represent a real finance offer, approved rate, or commitment from any lender. Actual finance terms, rates and monthly payments will vary based on the specific lender, asset, applicant credit profile, and prevailing market conditions. TAFM does not guarantee any specific rate or approval outcome.'

export function calculate(input: CalculatorInput): CalculatorResult {
  const errors = validateCalculatorInput(input)
  if (errors.length > 0) {
    throw new Error(`Calculator input validation failed: ${errors.map((e) => e.message).join('; ')}`)
  }

  const balloonAmount = input.balloonAmount ?? 0
  const financedAmount = round(input.assetValue - input.deposit, 2)
  const monthlyPayment = calculateMonthlyPayment(
    financedAmount,
    input.annualRate,
    input.termMonths,
    balloonAmount,
  )
  const totalPayable = round(monthlyPayment * input.termMonths + balloonAmount, 2)
  const totalInterest = round(totalPayable - financedAmount, 2)
  const effectiveMonthlyRate = round(input.annualRate / 12, 6)

  return {
    assetValue: input.assetValue,
    deposit: input.deposit,
    termMonths: input.termMonths,
    annualRate: input.annualRate,
    balloonAmount,
    financedAmount,
    monthlyPayment,
    totalPayable,
    totalInterest,
    effectiveMonthlyRate,
    status: 'CALCULATED',
    disclaimer: CALCULATOR_DISCLAIMER,
  }
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

/**
 * Calculate deposit as a percentage of asset value.
 */
export function depositPercentage(assetValue: number, deposit: number): number {
  return round((deposit / assetValue) * 100, 1)
}

/**
 * Calculate the implied annual rate from monthly payment (for display only).
 * Iterative Newton's method approximation.
 */
export function impliedRate(
  principal: number,
  monthlyPayment: number,
  termMonths: number,
): number {
  let rate = 0.007 // Initial guess: ~8.4% annual
  for (let i = 0; i < 100; i++) {
    const f =
      (principal * rate) / (1 - Math.pow(1 + rate, -termMonths)) - monthlyPayment
    const df =
      principal *
      ((1 - Math.pow(1 + rate, -termMonths) - termMonths * rate * Math.pow(1 + rate, -termMonths - 1)) /
        Math.pow(1 - Math.pow(1 + rate, -termMonths), 2))
    rate -= f / df
    if (Math.abs(f) < 0.0001) break
  }
  return round(rate * 12, 4) // Convert monthly to annual
}
