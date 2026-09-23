// ─── Opportunity Funnel & Matching Diagnostics Service (Phase 6) ─────────────
//
// Provides complete transparency into the credit matching funnel and provider actions.
// Used in the Admin Operational Control Centre to trace an opportunity from intake to completion.

import { db } from '@/lib/db/client'
import {
  checkEligibility,
  type FinanceRequirement,
  type ProviderCriteriaInput,
  type EligibilityResult,
} from '@/lib/matching/eligibility'

export interface ProviderDiagnosticEntry {
  lenderId: string
  lenderName: string
  slug: string
  status: string // 'MATCHED' | 'DISQUALIFIED'
  matchStatus?: string // 'MATCHED' | 'REVIEWING' | 'INTERESTED' | 'OFFERED' | 'DECLINED'
  criteriaVersion?: number
  isExternallyConfirmed?: boolean
  confirmationSource?: string
  overall: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN'
  factors: Array<{ field: string; label: string; status: string; reason: string }>
  blockers: string[]
  offerDetails?: {
    amount: number
    monthlyPayment: number
    termMonths: number
    decisionStatus: string
  }
}

export interface OpportunityDiagnosticsReport {
  opportunityId: string
  reference: string
  status: string
  createdAt: string
  business: {
    id?: string
    name?: string
    companyNumber?: string
    structure?: string
    yearsTrading?: number
    annualTurnover?: number
    sector?: string
  } | null
  asset: {
    id?: string
    name?: string
    category?: string
    manufacturer?: string
    model?: string
    year?: number
    value?: number
    status?: string
  } | null
  application: {
    requestedAmount?: number
    structure?: string
    termMonths?: number
    depositAmount?: number
  } | null
  matchedProviders: ProviderDiagnosticEntry[]
  disqualifiedProviders: ProviderDiagnosticEntry[]
  informationRequests: Array<{
    id: string
    lenderName: string
    notes: string
    requestedFields: string[]
    status: string
    borrowerResponse?: string | null
    createdAt: string
    respondedAt?: string | null
  }>
  timeline: Array<{
    from: string
    to: string
    at: string
    reason?: string
  }>
}

export async function getOpportunityMatchingDiagnostics(
  opportunityId: string,
): Promise<OpportunityDiagnosticsReport | null> {
  if (!db) return null

  const opp = await db.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      business: true,
      application: true,
      asset: {
        include: {
          category: true,
          manufacturer: true,
          model: true,
        },
      },
      providerMatches: {
        include: {
          lender: true,
          criteriaVersion: true,
        },
      },
      informationRequests: {
        include: {
          lender: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  }).catch(() => null)

  if (!opp) return null

  // 1. Build requirement representation
  const app = opp.application
  const asset = opp.asset
  const biz = opp.business

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

  // 2. Fetch all active criteria lenders to evaluate disqualified ones
  const allActiveLenders = await db.lender.findMany({
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
  }).catch(() => [])

  const matchedLenderMap = new Map(opp.providerMatches.map((m) => [m.lenderId, m]))

  const matchedProviders: ProviderDiagnosticEntry[] = []
  const disqualifiedProviders: ProviderDiagnosticEntry[] = []

  for (const lender of allActiveLenders) {
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

    const evalResult: EligibilityResult = checkEligibility(requirement, criteriaInput)
    const existingMatch = matchedLenderMap.get(lender.id)

    if (existingMatch || evalResult.overall === 'ELIGIBLE') {
      matchedProviders.push({
        lenderId: lender.id,
        lenderName: lender.name,
        slug: lender.slug,
        status: 'MATCHED',
        matchStatus: existingMatch?.matchStatus ?? 'MATCHED',
        criteriaVersion: existingMatch?.criteriaVersion?.versionNumber ?? lender.criteriaVersions[0]?.versionNumber ?? 1,
        isExternallyConfirmed: crit.isExternallyConfirmed,
        confirmationSource: crit.confirmationSource ?? 'INTERNAL_SEED',
        overall: evalResult.overall,
        factors: evalResult.factors,
        blockers: evalResult.blockers,
      })
    } else {
      disqualifiedProviders.push({
        lenderId: lender.id,
        lenderName: lender.name,
        slug: lender.slug,
        status: 'DISQUALIFIED',
        criteriaVersion: lender.criteriaVersions[0]?.versionNumber ?? 1,
        isExternallyConfirmed: crit.isExternallyConfirmed,
        confirmationSource: crit.confirmationSource ?? 'INTERNAL_SEED',
        overall: evalResult.overall,
        factors: evalResult.factors,
        blockers: evalResult.blockers,
      })
    }
  }

  const timeline = (opp.statusHistory as Array<{ from: string; to: string; at: string; reason?: string }>) || []

  return {
    opportunityId: opp.id,
    reference: opp.reference,
    status: opp.status,
    createdAt: opp.createdAt.toISOString(),
    business: biz ? {
      id: biz.id,
      name: biz.name,
      companyNumber: biz.companyNumber ?? undefined,
      structure: biz.structure ?? undefined,
      yearsTrading: biz.yearsTrading ?? undefined,
      annualTurnover: biz.annualTurnover ? Number(biz.annualTurnover) : undefined,
      sector: biz.industry ?? undefined,
    } : null,
    asset: asset ? {
      id: asset.id,
      name: asset.name,
      category: asset.category?.name,
      manufacturer: asset.manufacturer?.name,
      model: asset.model?.name,
      year: asset.yearOfManufacture ?? undefined,
      value: asset.purchasePrice ? Number(asset.purchasePrice) : undefined,
      status: asset.status,
    } : null,
    application: app ? {
      requestedAmount: Number(app.requestedAmount),
      structure: app.requestedStructure ?? undefined,
      termMonths: app.requestedTermMonths ?? undefined,
      depositAmount: app.requestedDepositAmount ? Number(app.requestedDepositAmount) : undefined,
    } : null,
    matchedProviders,
    disqualifiedProviders,
    informationRequests: opp.informationRequests.map((req) => ({
      id: req.id,
      lenderName: req.lender.name,
      notes: req.requestNotes,
      requestedFields: req.requestedFields,
      status: req.status,
      borrowerResponse: req.borrowerResponse,
      createdAt: req.createdAt.toISOString(),
      respondedAt: req.respondedAt ? req.respondedAt.toISOString() : null,
    })),
    timeline,
  }
}
