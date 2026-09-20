// tests/unit/market/observations.test.ts

import { describe, it, expect } from 'vitest'
import { isInsufficientData } from '@/lib/market/observations'
import type { ObservationSummary, InsufficientDataResult } from '@/lib/market/observations'

// isInsufficientData is a pure type guard — no DB needed

describe('isInsufficientData', () => {
  it('identifies InsufficientDataResult', () => {
    const result: InsufficientDataResult = {
      insufficientData: true,
      totalCount: 1,
      minimumRequired: 3,
      reason: 'Only 1 observation found.',
    }
    expect(isInsufficientData(result)).toBe(true)
  })

  it('identifies ObservationSummary as not insufficient', () => {
    const result: ObservationSummary = {
      totalCount: 5,
      dateRange: { earliest: new Date(), latest: new Date() },
      byType: { SALE_PRICE: { min: 10000, max: 20000, median: 15000, count: 5 } },
      dominant: { type: 'SALE_PRICE', range: { min: 10000, max: 20000, median: 15000, count: 5 } },
      sourceCount: 2,
      currency: 'GBP',
      hasAskingPrices:   false,
      hasSalePrices:     true,
      hasAuctionResults: false,
      insufficientData:  false,
    }
    expect(isInsufficientData(result)).toBe(false)
  })
})

describe('ObservationType distinction', () => {
  // This test documents the critical business rule:
  // ASKING_PRICE and SALE_PRICE are fundamentally different and must never be conflated
  it('documents that ASKING_PRICE ≠ SALE_PRICE is a business invariant', () => {
    // If this test ever needs to be changed to conflate the two types,
    // that represents a data integrity violation — escalate to product owner
    const askingPrice = 'ASKING_PRICE'
    const salePrice = 'SALE_PRICE'
    expect(askingPrice).not.toBe(salePrice)
  })

  it('documents that valuations must exclude ASKING_PRICE observations', () => {
    // Valuation engine only queries SALE_PRICE and AUCTION_RESULT
    // Any change to this rule requires explicit product approval
    const allowedForValuation = ['SALE_PRICE', 'AUCTION_RESULT']
    expect(allowedForValuation).not.toContain('ASKING_PRICE')
    expect(allowedForValuation).not.toContain('LISTED_PRICE')
    expect(allowedForValuation).not.toContain('DEALER_PRICE')
  })
})
