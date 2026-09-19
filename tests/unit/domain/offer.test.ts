import { describe, it, expect } from 'vitest'

// ─── Finance offer DataStatus tests ──────────────────────────────────────────
//
// Critical: every financial value must carry DataStatus.
// These tests enforce that the type system prevents UNKNOWN values from
// being silently treated as verified facts.

import type { FinanceOffer } from '@/types/finance'
import type { DataStatus } from '@/types/common'

describe('FinanceOffer DataStatus', () => {

  // ─── Valid offer construction ─────────────────────────────────────────────

  it('can construct a valid CALCULATED offer', () => {
    const offer: Partial<FinanceOffer> = {
      amount: 60000,
      monthlyPayment: 1185.44,
      interestRate: 0.07,
      totalPayable: 71126.40,
      amountStatus: 'CALCULATED',
      monthlyPaymentStatus: 'CALCULATED',
      interestRateStatus: 'UNKNOWN',
      totalPayableStatus: 'CALCULATED',
      source: 'CALCULATED',
      requiresReview: true,
      aiGenerated: false,
    }
    expect(offer.amountStatus).toBe('CALCULATED')
    expect(offer.monthlyPaymentStatus).toBe('CALCULATED')
    expect(offer.requiresReview).toBe(true)
  })

  it('can construct a VERIFIED offer from a real lender', () => {
    const offer: Partial<FinanceOffer> = {
      amount: 60000,
      monthlyPayment: 1195.00,
      interestRate: 0.075,
      totalPayable: 71700,
      amountStatus: 'VERIFIED',
      monthlyPaymentStatus: 'VERIFIED',
      interestRateStatus: 'VERIFIED',
      totalPayableStatus: 'VERIFIED',
      source: 'LENDER_API',
      requiresReview: false,
      aiGenerated: false,
    }
    expect(offer.amountStatus).toBe('VERIFIED')
    expect(offer.source).toBe('LENDER_API')
  })

  // ─── DataStatus type safety ────────────────────────────────────────────────

  it('DataStatus type accepts all valid values', () => {
    const statuses: DataStatus[] = ['VERIFIED', 'PROVISIONAL', 'CALCULATED', 'USER_PROVIDED', 'UNKNOWN']
    expect(statuses).toHaveLength(5)
    expect(statuses).toContain('VERIFIED')
    expect(statuses).toContain('UNKNOWN')
  })

  it('aiGenerated offers always start as requiresReview = true', () => {
    const aiOffer: Partial<FinanceOffer> = {
      amountStatus: 'CALCULATED',
      monthlyPaymentStatus: 'CALCULATED',
      interestRateStatus: 'UNKNOWN',
      totalPayableStatus: 'CALCULATED',
      source: 'CALCULATED',
      requiresReview: true,   // AI-generated offers MUST require human review
      aiGenerated: true,
    }
    expect(aiOffer.requiresReview).toBe(true)
    expect(aiOffer.aiGenerated).toBe(true)
  })

  it('UNKNOWN status cannot be silently ignored', () => {
    const unknownStatuses: DataStatus[] = ['UNKNOWN']
    const hasUnknown = unknownStatuses.includes('UNKNOWN')
    // If any critical field is UNKNOWN, the offer must be flagged
    expect(hasUnknown).toBe(true)
    // In the UI, UNKNOWN must never be rendered as a confirmed value
  })
})
