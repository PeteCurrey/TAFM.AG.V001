// ─── Market observation summaries ─────────────────────────────────────────────
//
// Aggregate market observations into a structured summary.
//
// Critical rules:
//   - Minimum 3 observations required before any statistics are calculated.
//   - ASKING_PRICE observations are never mixed with SALE_PRICE for median calculation.
//   - The UI must make the distinction explicit: what type of price is this?
//   - Returns null if below threshold — never fabricate statistics.

import { db } from '@/lib/db/client'
import type { ObservationType } from '@prisma/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ObservationFilter {
  assetId?:        string
  manufacturerId?: string
  modelId?:        string
  categoryId?:     string
  observationType?: ObservationType
  minYear?:        number
  maxYear?:        number
}

export interface PriceRange {
  min:    number
  max:    number
  median: number
  count:  number
}

export interface ObservationSummary {
  totalCount:  number
  dateRange:   { earliest: Date; latest: Date }
  byType:      Partial<Record<ObservationType, PriceRange>>
  // Headline figures — only for the dominant type, clearly labelled
  dominant?:   { type: ObservationType; range: PriceRange }
  sourceCount: number // number of distinct sources
  currency:    string
  // Asking prices are never presented as sale prices
  hasAskingPrices:     boolean
  hasSalePrices:       boolean
  hasAuctionResults:   boolean
  insufficientData:    false
}

export interface InsufficientDataResult {
  insufficientData: true
  totalCount:       number
  minimumRequired:  number
  reason:           string
}

const MINIMUM_OBSERVATIONS = 3

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Get a market intelligence summary for a given filter set.
 *
 * Returns InsufficientDataResult if < 3 observations — never fabricate statistics.
 * The caller must handle InsufficientDataResult and display an honest message.
 */
export async function getObservationSummary(
  filter: ObservationFilter,
): Promise<ObservationSummary | InsufficientDataResult> {
  // Must have at least one entity filter — we never aggregate everything
  if (!filter.assetId && !filter.manufacturerId && !filter.modelId && !filter.categoryId) {
    return {
      insufficientData: true,
      totalCount:       0,
      minimumRequired:  MINIMUM_OBSERVATIONS,
      reason:           'At least one entity filter (asset, manufacturer, model, or category) is required.',
    }
  }

  const observations = await db.marketObservation.findMany({
    where: {
      isActive:       true,
      assetId:        filter.assetId,
      manufacturerId: filter.manufacturerId,
      modelId:        filter.modelId,
      categoryId:     filter.categoryId,
      observationType: filter.observationType,
      ...(filter.minYear || filter.maxYear ? {
        yearOfAsset: {
          gte: filter.minYear,
          lte: filter.maxYear,
        },
      } : {}),
    },
    select: {
      observationType: true,
      observedValue:   true,
      observedAt:      true,
      currency:        true,
      sourceId:        true,
    },
    orderBy: { observedAt: 'desc' },
  })

  if (observations.length < MINIMUM_OBSERVATIONS) {
    return {
      insufficientData: true,
      totalCount:       observations.length,
      minimumRequired:  MINIMUM_OBSERVATIONS,
      reason: observations.length === 0
        ? 'No market observations are available for this asset.'
        : `Only ${observations.length} observation${observations.length === 1 ? '' : 's'} found. A minimum of ${MINIMUM_OBSERVATIONS} is required to calculate reliable statistics.`,
    }
  }

  // Group by observation type
  const byType: Partial<Record<ObservationType, number[]>> = {}
  for (const obs of observations) {
    const type = obs.observationType
    if (!byType[type]) byType[type] = []
    byType[type]!.push(Number(obs.observedValue))
  }

  const typeRanges: Partial<Record<ObservationType, PriceRange>> = {}
  for (const [type, values] of Object.entries(byType)) {
    if (values && values.length >= 1) {
      typeRanges[type as ObservationType] = {
        min:    Math.min(...values),
        max:    Math.max(...values),
        median: median(values),
        count:  values.length,
      }
    }
  }

  // Dominant type = most observations
  let dominantType: ObservationType | undefined
  let dominantCount = 0
  for (const [type, range] of Object.entries(typeRanges)) {
    if ((range as PriceRange).count > dominantCount) {
      dominantCount = (range as PriceRange).count
      dominantType = type as ObservationType
    }
  }

  const dates = observations.map(o => o.observedAt)
  const sourceIds = new Set(observations.map(o => o.sourceId).filter(Boolean))
  const currencies = observations.map(o => o.currency)
  const currency = currencies[0] ?? 'GBP' // majority currency

  return {
    totalCount:          observations.length,
    dateRange:           { earliest: new Date(Math.min(...dates.map(d => d.getTime()))), latest: new Date(Math.max(...dates.map(d => d.getTime()))) },
    byType:              typeRanges,
    dominant:            dominantType ? { type: dominantType, range: typeRanges[dominantType]! } : undefined,
    sourceCount:         sourceIds.size,
    currency,
    hasAskingPrices:     !!typeRanges.ASKING_PRICE,
    hasSalePrices:       !!typeRanges.SALE_PRICE,
    hasAuctionResults:   !!typeRanges.AUCTION_RESULT,
    insufficientData:    false,
  }
}

export function isInsufficientData(
  result: ObservationSummary | InsufficientDataResult,
): result is InsufficientDataResult {
  return result.insufficientData === true
}
