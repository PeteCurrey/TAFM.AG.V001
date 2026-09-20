// tests/integration/finance-journey.test.ts

import { describe, it, expect } from 'vitest'
import { checkEligibility, type FinanceRequirement, type ProviderCriteriaInput } from '@/lib/matching/eligibility'
import { validateTransition, buildStatusHistoryEntry, type OpportunityStatus } from '@/lib/matching/opportunity'

describe('Finance Journey Integration', () => {
  it('walks through requirement submission -> deterministic eligibility -> opportunity status progression', () => {
    // 1. User requirement
    const requirement: FinanceRequirement = {
      assetCategory:    'construction-equipment',
      financeStructure: 'HIRE_PURCHASE',
      amount:           85000,
      termMonths:       36,
      assetAgeYears:    1,
      isNewAsset:       false,
      businessType:     'LIMITED_COMPANY',
      geographyUK:      true,
      businessAgeMonths: 36,
      annualTurnover:   500000,
    }

    // 2. Active Provider Criteria snapshot
    const criteria: ProviderCriteriaInput = {
      lenderId:             'provider-1',
      lenderName:           'Northern Asset Finance',
      assetCategories:      ['construction-equipment', 'transport'],
      financeStructures:    ['HIRE_PURCHASE', 'FINANCE_LEASE'],
      minAmount:            25000,
      maxAmount:            250000,
      minTermMonths:        12,
      maxTermMonths:        60,
      geographyUKOnly:      true,
      businessTypes:        ['LIMITED_COMPANY', 'LLP'],
      maxAssetAgeYears:     5,
      newAssetsOnly:        false,
      usedAssetsConsidered: true,
      minBusinessAgeMonths: 24,
      minAnnualTurnover:    250000,
      isActive:             true,
    }

    // 3. Eligibility assessment (Deterministic)
    const result = checkEligibility(requirement, criteria)
    expect(result.overall).toBe('ELIGIBLE')
    expect(result.blockers.length).toBe(0)
    expect(result.unknowns.length).toBe(0)

    // 4. Opportunity progression through the commercial state machine
    let currentStatus: OpportunityStatus = 'DRAFT'

    // Transition: DRAFT -> QUALIFYING
    let transition = validateTransition(currentStatus, 'QUALIFYING')
    expect(transition.success).toBe(true)
    const entry1 = buildStatusHistoryEntry(currentStatus, 'QUALIFYING', 'SYSTEM', 'Finance application submitted')
    expect(entry1.to).toBe('QUALIFYING')
    currentStatus = 'QUALIFYING'

    // Transition: QUALIFYING -> MATCHED
    transition = validateTransition(currentStatus, 'MATCHED')
    expect(transition.success).toBe(true)
    const entry2 = buildStatusHistoryEntry(currentStatus, 'MATCHED', 'SYSTEM', 'Matched to eligible provider')
    expect(entry2.to).toBe('MATCHED')
    currentStatus = 'MATCHED'

    // Transition: MATCHED -> READY_TO_SUBMIT (Phase 4 intermediate gate)
    transition = validateTransition(currentStatus, 'READY_TO_SUBMIT')
    expect(transition.success).toBe(true)
    const entry3 = buildStatusHistoryEntry(currentStatus, 'READY_TO_SUBMIT', 'USER', 'Documentation and terms confirmed')
    expect(entry3.to).toBe('READY_TO_SUBMIT')
    currentStatus = 'READY_TO_SUBMIT'

    // Transition: READY_TO_SUBMIT -> SUBMITTED
    transition = validateTransition(currentStatus, 'SUBMITTED')
    expect(transition.success).toBe(true)
    const entry4 = buildStatusHistoryEntry(currentStatus, 'SUBMITTED', 'USER', 'Submitted to provider portal')
    expect(entry4.to).toBe('SUBMITTED')
    currentStatus = 'SUBMITTED'

    // Transition: SUBMITTED -> UNDER_REVIEW
    transition = validateTransition(currentStatus, 'UNDER_REVIEW')
    expect(transition.success).toBe(true)
    currentStatus = 'UNDER_REVIEW'

    // Transition: UNDER_REVIEW -> OFFERED
    transition = validateTransition(currentStatus, 'OFFERED')
    expect(transition.success).toBe(true)
    currentStatus = 'OFFERED'

    // Transition: OFFERED -> COMPLETED
    transition = validateTransition(currentStatus, 'COMPLETED')
    expect(transition.success).toBe(true)
    currentStatus = 'COMPLETED'
  })

  it('correctly halts or flags when requirement has unknown fields or blockers', () => {
    const requirementWithUnknowns: FinanceRequirement = {
      assetCategory:    'specialist-marine',
      amount:           50000,
      // missing financeStructure, termMonths, etc.
    }

    const strictCriteria: ProviderCriteriaInput = {
      lenderId:             'provider-strict',
      assetCategories:      ['construction-equipment'],
      financeStructures:    ['HIRE_PURCHASE'],
      minAmount:            100000, // requirement amount 50000 is below min
      maxAmount:            500000,
      minTermMonths:        24,
      maxTermMonths:        60,
      geographyUKOnly:      true,
      businessTypes:        [],
      newAssetsOnly:        true,
      usedAssetsConsidered: false,
      isActive:             true,
    }

    const result = checkEligibility(requirementWithUnknowns, strictCriteria)
    expect(result.overall).toBe('NOT_ELIGIBLE')
    expect(result.blockers.length).toBeGreaterThan(0)
    // Unknown fields must be reported explicitly
    expect(result.unknowns.length).toBeGreaterThan(0)

    // And state machine must not jump directly from DRAFT to SUBMITTED
    const invalidJump = validateTransition('DRAFT', 'SUBMITTED')
    expect(invalidJump.success).toBe(false)
  })
})
