// ─── Valuation engine ─────────────────────────────────────────────────────────
//
// IMPORTANT: This is a foundation, not a finished valuation engine.
// We do NOT generate fake valuations. We do NOT invent numbers.
//
// Inputs → evidence check → if insufficient: VALUATION_UNAVAILABLE
//                         → if sufficient: structured range with method + confidence
//
// Phase 3: always returns VALUATION_UNAVAILABLE (no real market data yet).
// Phase 4: wire to MarketObservation query, aggregate observed values,
//          apply depreciation curve, produce confidence-weighted range.

import { logger } from '@/lib/logging'

export type ValuationStatus =
  | 'AVAILABLE'          // Sufficient evidence — range produced
  | 'INSUFFICIENT_DATA'  // Not enough observations to produce reliable estimate
  | 'ASSET_NOT_FOUND'    // Asset identity not confirmed
  | 'CATEGORY_UNSUPPORTED' // Valuation not yet available for this asset type
  | 'ERROR'              // Internal error

export interface ValuationRequest {
  assetId?:         string
  category?:        string
  manufacturer?:    string
  model?:           string
  yearOfManufacture?: number
  condition?:       string
  hoursOrMileage?:  string
  location?:        string
}

export interface ValuationResult {
  status:       ValuationStatus
  assetId?:     string
  reason:       string
  rangeLow?:    number     // GBP — only present when status = AVAILABLE
  rangeHigh?:   number     // GBP — only present when status = AVAILABLE
  currency?:    string
  confidence?:  number     // 0–1 — only present when status = AVAILABLE
  method?:      string     // e.g. 'MARKET_OBSERVATIONS' — only when AVAILABLE
  observations?: number    // count of market data points used
  asAtDate?:    Date
  disclaimer:   string
}

const STANDARD_DISCLAIMER =
  'Valuations are indicative estimates based on available market data. They do not constitute a formal valuation and should not be relied upon for accounting, insurance, or legal purposes. A formal valuation by a qualified professional is required for regulated use.'

/**
 * Get a valuation for an asset.
 *
 * Phase 4 behaviour:
 *   1. Query MarketObservation for sale prices + auction results for this entity
 *   2. If < 3 observations → INSUFFICIENT_DATA (honest)
 *   3. If sufficient → produce confidence-weighted range from SALE_PRICE + AUCTION_RESULT
 *      (ASKING_PRICE observations are excluded from valuations — they are not sale prices)
 *   4. Return AVAILABLE with rangeLow, rangeHigh, confidence, observations count
 */
export async function getValuation(request: ValuationRequest): Promise<ValuationResult> {
  logger.info('Valuation requested', {
    assetId:      request.assetId,
    category:     request.category,
    manufacturer: request.manufacturer,
    model:        request.model,
  }, 'finance')

  try {
    const { db } = await import('@/lib/db/client')

    // Only use SALE_PRICE and AUCTION_RESULT — never ASKING_PRICE for valuations
    const observations = await db.marketObservation.findMany({
      where: {
        isActive: true,
        observationType: { in: ['SALE_PRICE', 'AUCTION_RESULT'] },
        ...(request.assetId ? { assetId: request.assetId } : {}),
        ...(request.manufacturer && !request.assetId ? {
          manufacturer: {
            name: { contains: request.manufacturer, mode: 'insensitive' },
          },
        } : {}),
      },
      select: { observedValue: true, observedAt: true, observationType: true, condition: true },
      orderBy: { observedAt: 'desc' },
      take: 50,
    })

    if (observations.length < 3) {
      return {
        status:  'INSUFFICIENT_DATA',
        assetId: request.assetId,
        reason:
          `Only ${observations.length} verified sale price observation${observations.length === 1 ? '' : 's'} found. ` +
          'A minimum of 3 is required to produce a reliable valuation estimate. ' +
          'As more market data is recorded, a valuation range will become available.',
        disclaimer: STANDARD_DISCLAIMER,
      }
    }

    const values = observations.map(o => Number(o.observedValue))
    const sorted = [...values].sort((a, b) => a - b)
    const p25 = sorted[Math.floor(sorted.length * 0.25)]
    const p75 = sorted[Math.floor(sorted.length * 0.75)]
    const mid = sorted[Math.floor(sorted.length / 2)]

    // Confidence scales with observation count — capped at 0.75 (market data alone)
    const confidence = Math.min(0.75, 0.3 + (observations.length / 20) * 0.45)

    return {
      status:       'AVAILABLE',
      assetId:      request.assetId,
      reason:       `Based on ${observations.length} verified market observations (sale prices and auction results).`,
      rangeLow:     Math.round(p25),
      rangeHigh:    Math.round(p75),
      currency:     'GBP',
      confidence:   Math.round(confidence * 100) / 100,
      method:       'MARKET_OBSERVATIONS',
      observations: observations.length,
      asAtDate:     new Date(),
      disclaimer:   STANDARD_DISCLAIMER,
    }
  } catch (err) {
    logger.warn('Valuation query failed', {
      assetId: request.assetId,
      error:   err instanceof Error ? err.message : String(err),
    }, 'finance')

    return {
      status:     'ERROR',
      assetId:    request.assetId,
      reason:     'An error occurred while retrieving market data. Please try again.',
      disclaimer: STANDARD_DISCLAIMER,
    }
  }
}

/**
 * Check whether a valuation is likely to be available for a given category.
 * Used to set UI expectations before running a full valuation query.
 *
 * Phase 3: always returns false (no market data ingested yet).
 */
export function isValuationLikelyAvailable(_category?: string): boolean {
  return false
}
