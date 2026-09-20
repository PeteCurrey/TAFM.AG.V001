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
 * Phase 3 behaviour: always returns INSUFFICIENT_DATA.
 * The architecture is in place — plug in MarketObservation queries in Phase 4.
 */
export async function getValuation(request: ValuationRequest): Promise<ValuationResult> {
  logger.info('Valuation requested', {
    assetId:      request.assetId,
    category:     request.category,
    manufacturer: request.manufacturer,
    model:        request.model,
  }, 'finance')

  // Phase 3: no market data yet — honest unavailable response
  return {
    status:  'INSUFFICIENT_DATA',
    assetId: request.assetId,
    reason:
      'Insufficient verified market evidence is available to produce a reliable valuation estimate for this asset. Market observations are required before a valuation range can be produced.',
    disclaimer: STANDARD_DISCLAIMER,
  }

  // Phase 4 — replace the above with:
  // 1. Query MarketObservation table for this manufacturer/model/year
  // 2. If < 3 observations → INSUFFICIENT_DATA
  // 3. Apply depreciation curve if observations are dated
  // 4. Produce confidence-weighted range
  // 5. Return AVAILABLE with rangeLow, rangeHigh, confidence, method, observations
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
