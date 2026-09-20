// tests/unit/data/quality.test.ts

import { describe, it, expect } from 'vitest'
import { shouldIndex } from '@/lib/data/quality'
import type { DataQualityReport } from '@/lib/data/quality'

// shouldIndex is a pure function — no DB needed

function makeReport(overrides: Partial<{
  identity:      number
  specification: number
  source:        number
  verification:  number
  freshness:     number
  overall:       number
}>): DataQualityReport {
  const s = (score: number, label: string) => ({
    score,
    label,
    issues: score < 0.5 ? [`${label} below threshold`] : [],
    bars:   Math.round(score * 10),
  })
  return {
    entityType:    'asset',
    entityId:      'test-id',
    identity:      s(overrides.identity      ?? 0.8, 'Identity'),
    specification: s(overrides.specification ?? 0.7, 'Specification'),
    sourceQuality: s(overrides.source        ?? 0.6, 'Source'),
    verification:  s(overrides.verification  ?? 0.5, 'Verification'),
    freshness:     s(overrides.freshness     ?? 0.9, 'Freshness'),
    overall:       overrides.overall ?? 0.7,
    issues:        [],
    scoredAt:      new Date(),
  }
}

describe('shouldIndex', () => {
  it('returns false for null report', () => {
    expect(shouldIndex(null)).toBe(false)
  })

  it('returns true for high-quality report', () => {
    expect(shouldIndex(makeReport({}))).toBe(true)
  })

  it('returns false when identity is below 0.5', () => {
    expect(shouldIndex(makeReport({ identity: 0.4 }))).toBe(false)
  })

  it('returns false when specification is below 0.3', () => {
    expect(shouldIndex(makeReport({ specification: 0.2 }))).toBe(false)
  })

  it('returns false when verification is below 0.2', () => {
    expect(shouldIndex(makeReport({ verification: 0.1 }))).toBe(false)
  })

  it('returns false when overall is below 0.4', () => {
    expect(shouldIndex(makeReport({ overall: 0.3 }))).toBe(false)
  })

  it('returns true at exact thresholds', () => {
    expect(shouldIndex(makeReport({
      identity:      0.5,
      specification: 0.3,
      verification:  0.2,
      overall:       0.4,
    }))).toBe(true)
  })
})
