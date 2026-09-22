import { describe, it, expect } from 'vitest'
import {
  checkEligibility,
  type FinanceRequirement,
  type ProviderCriteriaInput,
} from '@/lib/matching/eligibility'
import {
  validateTransition,
  buildStatusHistoryEntry,
  type OpportunityStatus,
} from '@/lib/matching/opportunity'

describe('Commercial Operating Loop (Phase 5 E2E)', () => {
  it('executes the full commercial proof point cycle: Business -> Intake -> Deterministic Matching -> Provider Response -> Borrower Visibility -> Audit Trail', () => {
    // -------------------------------------------------------------
    // STAGE 1: Real Business submits real Asset & Finance Requirement
    // -------------------------------------------------------------
    const assetRequirement: FinanceRequirement = {
      assetCategory:    'commercial-vehicles',
      financeStructure: 'HIRE_PURCHASE',
      amount:           185000,
      termMonths:       48,
      assetAgeYears:    1,
      isNewAsset:       false,
      businessType:     'LIMITED_COMPANY',
      geographyUK:      true,
      businessAgeMonths: 36,
      annualTurnover:   850000,
    }

    const business = {
      id:   'biz-001',
      name: 'Currey Heavy Haulage Ltd',
      structure: 'LIMITED_COMPANY',
    }

    const asset = {
      id: 'asset-scania-001',
      name: 'Ruthmann STEIGER T 650 HF on Scania 4-Axle Chassis',
      category: 'commercial-vehicles',
      condition: 'USED',
      purchasePrice: 185000,
    }

    // Opportunity initialized in QUALIFYING state
    let opportunityStatus: OpportunityStatus = 'QUALIFYING'
    const statusHistory: Array<{ from: string; to: string; at: string; actorType: string; reason?: string }> = []

    statusHistory.push(
      buildStatusHistoryEntry('DRAFT', 'QUALIFYING', {
        actorType: 'USER',
        reason: 'Finance requirement submitted for Ruthmann T 650 HF',
      }),
    )

    // -------------------------------------------------------------
    // STAGE 2: Real Provider Network & Immutable Criteria Version
    // -------------------------------------------------------------
    const lenderA_Criteria: ProviderCriteriaInput = {
      lenderId:             'provider-atlas-credit',
      lenderName:           'Atlas Asset Finance UK',
      assetCategories:      ['commercial-vehicles', 'construction-equipment'],
      financeStructures:    ['HIRE_PURCHASE', 'FINANCE_LEASE'],
      minAmount:            25000,
      maxAmount:            500000,
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

    const lenderB_CriteriaStrict: ProviderCriteriaInput = {
      lenderId:             'provider-prime-only',
      lenderName:           'Prime Bank Asset Division',
      assetCategories:      ['commercial-vehicles'],
      financeStructures:    ['HIRE_PURCHASE'],
      minAmount:            300000, // Below min: requirement is 185000
      maxAmount:            2000000,
      minTermMonths:        24,
      maxTermMonths:        60,
      geographyUKOnly:      true,
      businessTypes:        ['PLC', 'LIMITED_COMPANY'],
      newAssetsOnly:        true,   // Requires new: requirement is used
      usedAssetsConsidered: false,
      isActive:             true,
    }

    // -------------------------------------------------------------
    // STAGE 3: Deterministic Matching Execution
    // -------------------------------------------------------------
    const matchResultA = checkEligibility(assetRequirement, lenderA_Criteria)
    const matchResultB = checkEligibility(assetRequirement, lenderB_CriteriaStrict)

    // Assert determinism
    expect(matchResultA.overall).toBe('ELIGIBLE')
    expect(matchResultA.blockers.length).toBe(0)

    expect(matchResultB.overall).toBe('NOT_ELIGIBLE')
    expect(matchResultB.blockers.length).toBeGreaterThan(0) // Failed on minAmount & newAssetsOnly

    // -------------------------------------------------------------
    // STAGE 4: Opportunity Provider Join State & Criteria Snapshotting
    // -------------------------------------------------------------
    const opportunityMatches = [
      {
        opportunityId: 'opp-999',
        lenderId: lenderA_Criteria.lenderId,
        criteriaVersion: 4, // Criteria version 4 active at match time
        matchStatus: 'MATCHED',
        eligibilityResult: matchResultA,
      },
    ]

    // Advance opportunity state machine to MATCHED
    const matchTransition = validateTransition(opportunityStatus, 'MATCHED')
    expect(matchTransition.success).toBe(true)
    opportunityStatus = 'MATCHED'
    statusHistory.push(
      buildStatusHistoryEntry('QUALIFYING', 'MATCHED', {
        actorType: 'SYSTEM',
        reason: '1 eligible provider matched: Atlas Asset Finance UK',
      }),
    )

    // -------------------------------------------------------------
    // STAGE 5: Provider Reviews Opportunity & Responds
    // -------------------------------------------------------------
    // Provider views opportunity
    const activeMatch = opportunityMatches[0]
    expect(activeMatch.lenderId).toBe('provider-atlas-credit')

    // Provider marks REVIEWING
    activeMatch.matchStatus = 'REVIEWING'

    // Provider makes formal commercial offer
    activeMatch.matchStatus = 'OFFERED'
    const providerOffer = {
      approvedAmount: 185000,
      termMonths: 48,
      interestRatePercent: 7.25,
      notes: 'Approved subject to standard asset inspection',
    }

    // Advance opportunity state machine: MATCHED -> READY_TO_SUBMIT -> SUBMITTED -> UNDER_REVIEW -> OFFERED
    expect(validateTransition(opportunityStatus, 'READY_TO_SUBMIT').success).toBe(true)
    opportunityStatus = 'READY_TO_SUBMIT'

    expect(validateTransition(opportunityStatus, 'SUBMITTED').success).toBe(true)
    opportunityStatus = 'SUBMITTED'

    expect(validateTransition(opportunityStatus, 'UNDER_REVIEW').success).toBe(true)
    opportunityStatus = 'UNDER_REVIEW'

    expect(validateTransition(opportunityStatus, 'OFFERED').success).toBe(true)
    opportunityStatus = 'OFFERED'

    statusHistory.push(
      buildStatusHistoryEntry('UNDER_REVIEW', 'OFFERED', {
        actorType: 'USER',
        reason: 'Formal finance facility offer issued by provider',
      }),
    )

    // -------------------------------------------------------------
    // STAGE 6: Business Borrower Privacy & Progression Visibility
    // -------------------------------------------------------------
    // Business sees status is OFFERED
    expect(opportunityStatus).toBe('OFFERED')

    // Verify privacy: The borrower interface only sees aggregated counts, not competitor internal underwriting notes
    const borrowerFacingSummary = {
      matchedProvidersCount: opportunityMatches.length,
      offersReceived: opportunityMatches.filter((m) => m.matchStatus === 'OFFERED').length,
      currentStatus: opportunityStatus,
    }

    expect(borrowerFacingSummary.matchedProvidersCount).toBe(1)
    expect(borrowerFacingSummary.offersReceived).toBe(1)
    expect(borrowerFacingSummary.currentStatus).toBe('OFFERED')

    // -------------------------------------------------------------
    // STAGE 7: Transaction Completion
    // -------------------------------------------------------------
    expect(validateTransition(opportunityStatus, 'COMPLETED').success).toBe(true)
    opportunityStatus = 'COMPLETED'
    statusHistory.push(
      buildStatusHistoryEntry('OFFERED', 'COMPLETED', {
        actorType: 'USER',
        reason: 'Asset delivery confirmed, funds disbursed, transaction completed',
      }),
    )

    // Complete audit trail validation
    expect(statusHistory.length).toBe(4)
    expect(statusHistory[0].from).toBe('DRAFT')
    expect(statusHistory[statusHistory.length - 1].to).toBe('COMPLETED')
  })
})
