// ─── Opportunity Matching Service (Phase 5) ──────────────────────────────────
//
// DETERMINISTIC execution of provider matching against a real Opportunity.
// Evaluates all active, verified providers with active criteria.
// Stores OpportunityProvider records with full eligibility snapshot and criteria version.
// Never rewrites history — criteria version snapshot guarantees auditability.

import { db } from '@/lib/db/client'
import {
  checkEligibility,
  type FinanceRequirement,
  type ProviderCriteriaInput,
  type EligibilityResult,
} from '@/lib/matching/eligibility'
import {
  validateTransition,
  buildStatusHistoryEntry,
} from '@/lib/matching/opportunity'
import { auditService } from '@/lib/audit'
import { emitEvent } from '@/lib/notifications/events'
import { logger } from '@/lib/logging'

export interface MatchingSummary {
  opportunityId: string
  providersEvaluated: number
  eligibleMatches: number
  unknownMatches: number
  notEligible: number
  matchedLenderIds: string[]
  results: EligibilityResult[]
}

export async function runMatchingForOpportunity(opportunityId: string): Promise<MatchingSummary> {
  if (!db) {
    throw new Error('Database service unavailable')
  }

  // 1. Load Opportunity with related Business, Application, and Asset
  const opportunity = await db.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      business: true,
      application: true,
      asset: {
        include: { category: true },
      },
    },
  })

  if (!opportunity) {
    throw new Error(`Opportunity ${opportunityId} not found`)
  }

  // 2. Build FinanceRequirement from the opportunity entities
  const app = opportunity.application
  const asset = opportunity.asset
  const biz = opportunity.business

  const assetAgeYears = asset?.yearOfManufacture
    ? new Date().getFullYear() - asset.yearOfManufacture
    : undefined

  const requirement: FinanceRequirement = {
    assetCategory: asset?.category?.slug ?? undefined,
    financeStructure: app?.requestedStructure ?? undefined,
    amount: app ? Number(app.requestedAmount) : undefined,
    termMonths: app?.requestedTermMonths ?? undefined,
    assetAgeYears: assetAgeYears !== undefined ? Math.max(0, assetAgeYears) : undefined,
    isNewAsset: asset?.isNew ?? (asset?.condition === 'NEW'),
    businessType: biz?.structure ?? undefined,
    geographyUK: true,
    businessAgeMonths: biz?.yearsTrading ? biz.yearsTrading * 12 : undefined,
    annualTurnover: biz?.annualTurnover ? Number(biz.annualTurnover) : undefined,
  }

  // 3. Load active, verified Lenders with active ProviderCriteria
  const activeLenders = await db.lender.findMany({
    where: {
      status: { in: ['ACTIVE', 'VERIFIED'] },
      deletedAt: null,
      criteria: { isActive: true },
    },
    include: {
      criteria: true,
      criteriaVersions: {
        where: { isActive: true, effectiveTo: null },
        orderBy: { versionNumber: 'desc' },
        take: 1,
      },
    },
  })

  const results: EligibilityResult[] = []
  const matchedLenderIds: string[] = []
  let eligibleCount = 0
  let unknownCount = 0
  let notEligibleCount = 0

  for (const lender of activeLenders) {
    const crit = lender.criteria
    if (!crit) continue

    const criteriaInput: ProviderCriteriaInput = {
      lenderId: lender.id,
      lenderName: lender.name,
      assetCategories: crit.assetCategories,
      financeStructures: crit.financeStructures,
      minAmount: Number(crit.minAmount),
      maxAmount: Number(crit.maxAmount),
      minTermMonths: crit.minTermMonths,
      maxTermMonths: crit.maxTermMonths,
      geographyUKOnly: crit.geographyUKOnly,
      businessTypes: crit.businessTypes,
      maxAssetAgeYears: crit.maxAssetAgeYears ?? undefined,
      newAssetsOnly: crit.newAssetsOnly,
      usedAssetsConsidered: crit.usedAssetsConsidered,
      minBusinessAgeMonths: crit.minBusinessAgeMonths ?? undefined,
      minAnnualTurnover: crit.minAnnualTurnover ? Number(crit.minAnnualTurnover) : undefined,
      isActive: crit.isActive,
    }

    const evalResult = checkEligibility(requirement, criteriaInput)
    results.push(evalResult)

    const activeVersion = lender.criteriaVersions[0]

    // Create or update OpportunityProvider join record
    await db.opportunityProvider.upsert({
      where: {
        opportunityId_lenderId: {
          opportunityId: opportunity.id,
          lenderId: lender.id,
        },
      },
      create: {
        opportunityId: opportunity.id,
        lenderId: lender.id,
        criteriaVersionId: activeVersion?.id ?? null,
        eligibilityResult: evalResult as any,
        matchStatus: evalResult.overall === 'NOT_ELIGIBLE' ? 'DECLINED' : 'MATCHED',
      },
      update: {
        criteriaVersionId: activeVersion?.id ?? null,
        eligibilityResult: evalResult as any,
        matchStatus: evalResult.overall === 'NOT_ELIGIBLE' ? 'DECLINED' : 'MATCHED',
        updatedAt: new Date(),
      },
    })

    if (evalResult.overall === 'ELIGIBLE') {
      eligibleCount++
      matchedLenderIds.push(lender.id)
    } else if (evalResult.overall === 'UNKNOWN') {
      unknownCount++
      matchedLenderIds.push(lender.id)
    } else {
      notEligibleCount++
    }
  }

  // 4. Update Opportunity status if transitioning to MATCHED
  const totalMatches = matchedLenderIds.length
  let nextStatus = opportunity.status

  if (totalMatches > 0 && opportunity.status === 'QUALIFYING') {
    const transition = validateTransition(opportunity.status, 'MATCHED')
    if (transition.success) {
      nextStatus = 'MATCHED'
      const history = (opportunity.statusHistory as any[]) || []
      history.push(
        buildStatusHistoryEntry(opportunity.status, 'MATCHED', {
          actorType: 'SYSTEM',
          reason: `Deterministic matching completed: ${eligibleCount} eligible, ${unknownCount} provisional matches`,
        }),
      )

      await db.opportunity.update({
        where: { id: opportunity.id },
        data: {
          status: 'MATCHED',
          matchedAt: new Date(),
          matchedProviderIds: matchedLenderIds,
          matchAnalysis: {
            totalEvaluated: activeLenders.length,
            eligibleCount,
            unknownCount,
            notEligibleCount,
            requirementSnapshot: requirement,
            evaluatedAt: new Date().toISOString(),
          } as any,
          statusHistory: history as any,
        },
      })

      await auditService.statusChange('Opportunity', opportunity.id, opportunity.status, 'MATCHED', {
        actorType: 'SYSTEM',
        reason: 'Automated deterministic provider matching completed',
      })

      await emitEvent('POTENTIAL_MATCH_FOUND', {
        opportunityId: opportunity.id,
        businessId: opportunity.businessId,
        matchCount: totalMatches,
      })
    }
  } else {
    // Save match analysis even if status is not ready to advance
    await db.opportunity.update({
      where: { id: opportunity.id },
      data: {
        matchedProviderIds: matchedLenderIds,
        matchAnalysis: {
          totalEvaluated: activeLenders.length,
          eligibleCount,
          unknownCount,
          notEligibleCount,
          requirementSnapshot: requirement,
          evaluatedAt: new Date().toISOString(),
        } as any,
      },
    })
  }

  logger.info('Opportunity matching completed', {
    opportunityId,
    activeLenders: activeLenders.length,
    eligibleCount,
    unknownCount,
    notEligibleCount,
  }, 'finance')

  return {
    opportunityId,
    providersEvaluated: activeLenders.length,
    eligibleMatches: eligibleCount,
    unknownMatches: unknownCount,
    notEligible: notEligibleCount,
    matchedLenderIds,
    results,
  }
}
