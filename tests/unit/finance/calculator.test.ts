import { describe, it, expect } from 'vitest'
import {
  calculate,
  validateCalculatorInput,
  calculateMonthlyPayment,
  depositPercentage,
} from '@/lib/finance/calculator'

// ─── Finance calculator tests ─────────────────────────────────────────────────

describe('Finance Calculator', () => {

  describe('validateCalculatorInput', () => {
    it('returns no errors for valid input', () => {
      const errors = validateCalculatorInput({
        assetValue: 50000,
        deposit: 5000,
        termMonths: 48,
        annualRate: 0.07,
      })
      expect(errors).toHaveLength(0)
    })

    it('requires assetValue > 0', () => {
      const errors = validateCalculatorInput({ assetValue: 0, deposit: 0, termMonths: 24, annualRate: 0.07 })
      expect(errors.some(e => e.field === 'assetValue')).toBe(true)
    })

    it('rejects deposit >= assetValue', () => {
      const errors = validateCalculatorInput({ assetValue: 50000, deposit: 50000, termMonths: 24, annualRate: 0.07 })
      expect(errors.some(e => e.field === 'deposit')).toBe(true)
    })

    it('rejects term < 6 months', () => {
      const errors = validateCalculatorInput({ assetValue: 50000, deposit: 0, termMonths: 3, annualRate: 0.07 })
      expect(errors.some(e => e.field === 'termMonths')).toBe(true)
    })

    it('rejects term > 84 months', () => {
      const errors = validateCalculatorInput({ assetValue: 50000, deposit: 0, termMonths: 100, annualRate: 0.07 })
      expect(errors.some(e => e.field === 'termMonths')).toBe(true)
    })

    it('rejects negative annual rate', () => {
      const errors = validateCalculatorInput({ assetValue: 50000, deposit: 0, termMonths: 24, annualRate: -0.01 })
      expect(errors.some(e => e.field === 'annualRate')).toBe(true)
    })

    it('rejects rate > 100%', () => {
      const errors = validateCalculatorInput({ assetValue: 50000, deposit: 0, termMonths: 24, annualRate: 1.1 })
      expect(errors.some(e => e.field === 'annualRate')).toBe(true)
    })
  })

  describe('calculateMonthlyPayment', () => {
    it('returns a positive payment for typical inputs', () => {
      const payment = calculateMonthlyPayment(50000, 0.07, 48)
      expect(payment).toBeGreaterThan(0)
    })

    it('handles zero interest rate as simple division', () => {
      const payment = calculateMonthlyPayment(48000, 0, 48)
      expect(payment).toBe(1000)
    })

    it('reduces monthly payment with balloon', () => {
      const withoutBalloon = calculateMonthlyPayment(50000, 0.07, 48)
      const withBalloon = calculateMonthlyPayment(50000, 0.07, 48, 10000)
      expect(withBalloon).toBeLessThan(withoutBalloon)
    })
  })

  describe('calculate', () => {
    it('returns a result with status CALCULATED', () => {
      const result = calculate({
        assetValue: 75000,
        deposit: 15000,
        termMonths: 60,
        annualRate: 0.07,
      })
      expect(result.status).toBe('CALCULATED')
    })

    it('financedAmount = assetValue - deposit', () => {
      const result = calculate({
        assetValue: 75000,
        deposit: 15000,
        termMonths: 60,
        annualRate: 0.07,
      })
      expect(result.financedAmount).toBe(60000)
    })

    it('totalPayable > financedAmount for positive rate', () => {
      const result = calculate({
        assetValue: 75000,
        deposit: 15000,
        termMonths: 60,
        annualRate: 0.07,
      })
      expect(result.totalPayable).toBeGreaterThan(result.financedAmount)
    })

    it('totalInterest = totalPayable - financedAmount', () => {
      const result = calculate({
        assetValue: 50000,
        deposit: 10000,
        termMonths: 48,
        annualRate: 0.08,
      })
      expect(result.totalInterest).toBeCloseTo(result.totalPayable - result.financedAmount, 0)
    })

    it('includes a non-empty disclaimer', () => {
      const result = calculate({
        assetValue: 50000,
        deposit: 0,
        termMonths: 36,
        annualRate: 0.065,
      })
      expect(result.disclaimer).toBeTruthy()
      expect(result.disclaimer.length).toBeGreaterThan(50)
    })

    it('throws on invalid input', () => {
      expect(() =>
        calculate({
          assetValue: -1000,
          deposit: 0,
          termMonths: 24,
          annualRate: 0.07,
        }),
      ).toThrow()
    })
  })

  describe('depositPercentage', () => {
    it('calculates correct percentage', () => {
      expect(depositPercentage(100000, 20000)).toBe(20)
    })

    it('returns 0 for no deposit', () => {
      expect(depositPercentage(100000, 0)).toBe(0)
    })
  })
})
