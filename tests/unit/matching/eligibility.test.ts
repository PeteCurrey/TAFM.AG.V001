import { describe, it, expect } from 'vitest'
import {
  checkEligibility,
  type FinanceRequirement,
  type ProviderCriteriaInput,
} from '@/lib/matching/eligibility'

// ─── Provider eligibility engine tests ────────────────────────────────────────

const BASE_PROVIDER: ProviderCriteriaInput = {
  lenderId:            'lender-001',
  lenderName:          'Test Provider',
  assetCategories:     ['construction-equipment', 'manufacturing-equipment'],
  financeStructures:   ['HIRE_PURCHASE', 'FINANCE_LEASE'],
  minAmount:           10_000,
  maxAmount:           500_000,
  minTermMonths:       12,
  maxTermMonths:       60,
  geographyUKOnly:     true,
  businessTypes:       ['LIMITED_COMPANY', 'LLP', 'PLC'],
  maxAssetAgeYears:    10,
  newAssetsOnly:       false,
  usedAssetsConsidered: true,
  minBusinessAgeMonths: 24,
  isActive:            true,
}

const BASE_REQUIREMENT: FinanceRequirement = {
  assetCategory:    'construction-equipment',
  financeStructure: 'HIRE_PURCHASE',
  amount:           150_000,
  termMonths:       36,
  assetAgeYears:    3,
  isNewAsset:       false,
  businessType:     'LIMITED_COMPANY',
  geographyUK:      true,
  businessAgeMonths: 60,
}

describe('checkEligibility', () => {
  it('returns ELIGIBLE when all criteria are met', () => {
    const result = checkEligibility(BASE_REQUIREMENT, BASE_PROVIDER)
    expect(result.overall).toBe('ELIGIBLE')
    expect(result.blockers).toHaveLength(0)
    expect(result.unknowns).toHaveLength(0)
  })

  it('returns NOT_ELIGIBLE when asset category is not supported', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, assetCategory: 'medical-equipment' },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
    expect(result.blockers.length).toBeGreaterThan(0)
    expect(result.blockers[0]).toContain('medical-equipment')
  })

  it('returns NOT_ELIGIBLE when amount is below minimum', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, amount: 5_000 },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
    expect(result.blockers.some((b) => b.includes('below'))).toBe(true)
  })

  it('returns NOT_ELIGIBLE when amount exceeds maximum', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, amount: 750_000 },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
    expect(result.blockers.some((b) => b.includes('exceeds'))).toBe(true)
  })

  it('returns NOT_ELIGIBLE when term is too short', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, termMonths: 6 },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
  })

  it('returns NOT_ELIGIBLE when term exceeds maximum', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, termMonths: 84 },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
  })

  it('returns NOT_ELIGIBLE when asset is too old', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, assetAgeYears: 15 },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
    expect(result.blockers.some((b) => b.includes('exceeds'))).toBe(true)
  })

  it('returns NOT_ELIGIBLE for non-UK geography on UK-only provider', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, geographyUK: false },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
  })

  it('returns NOT_ELIGIBLE for unsupported business type', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, businessType: 'SOLE_TRADER' },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
  })

  it('returns NOT_ELIGIBLE for business below minimum trading age', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, businessAgeMonths: 12 },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
  })

  it('returns UNKNOWN when asset category is not provided', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, assetCategory: undefined },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('UNKNOWN')
    expect(result.unknowns.length).toBeGreaterThan(0)
  })

  it('returns UNKNOWN when amount is not provided', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, amount: undefined },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('UNKNOWN')
  })

  it('UNKNOWN does not promote to ELIGIBLE (blockers win)', () => {
    const result = checkEligibility(
      {
        ...BASE_REQUIREMENT,
        assetCategory: 'medical-equipment', // NOT_ELIGIBLE
        amount:        undefined,           // UNKNOWN
      },
      BASE_PROVIDER,
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
  })

  it('returns NOT_ELIGIBLE for inactive provider regardless of criteria', () => {
    const result = checkEligibility(
      BASE_REQUIREMENT,
      { ...BASE_PROVIDER, isActive: false },
    )
    expect(result.overall).toBe('NOT_ELIGIBLE')
    expect(result.blockers[0]).toContain('not currently active')
  })

  it('returns ELIGIBLE when provider accepts all categories (empty array)', () => {
    const result = checkEligibility(
      { ...BASE_REQUIREMENT, assetCategory: 'specialist-equipment' },
      { ...BASE_PROVIDER, assetCategories: [] },
    )
    const catFactor = result.factors.find((f) => f.field === 'asset_category')
    expect(catFactor?.status).toBe('ELIGIBLE')
  })

  it('exposes all factors in the result', () => {
    const result = checkEligibility(BASE_REQUIREMENT, BASE_PROVIDER)
    const fields = result.factors.map((f) => f.field)
    expect(fields).toContain('asset_category')
    expect(fields).toContain('finance_structure')
    expect(fields).toContain('amount')
    expect(fields).toContain('term')
    expect(fields).toContain('geography')
    expect(fields).toContain('asset_age')
    expect(fields).toContain('business_type')
  })
})
