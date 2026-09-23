// ─── Formal Data Readiness Engine (Phase 6) ──────────────────────────────────
//
// Authoritative operational health and readiness auditor.
// Strictly separates "record exists" from "record is trustworthy/publishable".
// Evaluates data across:
//   - Manufacturers
//   - Assets
//   - Providers
//   - Provider Criteria
//   - Market Observations
//   - Media / Images

import { db } from '@/lib/db/client'

export interface EntityReadinessMetrics {
  domain: string
  totalRecords: number
  verifiedRecords: number
  provisionalRecords: number
  unknownRecords: number
  blockedFromPublication: number
  missingProvenance: number
  staleRecords: number
  requiringReview: number
  readinessPercentage: number
}

export interface DataReadinessReport {
  generatedAt: string
  overallReadinessScore: number
  isProductionPublishable: boolean
  domains: EntityReadinessMetrics[]
  summaryNotes: string[]
}

export async function calculateDataReadiness(): Promise<DataReadinessReport> {
  if (!db) {
    return {
      generatedAt: new Date().toISOString(),
      overallReadinessScore: 0,
      isProductionPublishable: false,
      domains: [],
      summaryNotes: ['Database connection is unavailable'],
    }
  }

  const staleDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)

  // 1. Manufacturers
  const manufacturers = await db.manufacturer.findMany({
    select: {
      id: true,
      verificationStatus: true,
      sourceId: true,
      updatedAt: true,
      website: true,
      isActive: true,
    },
  }).catch(() => [])

  const mTotal = manufacturers.length
  const mVerified = manufacturers.filter((m) => m.verificationStatus === 'VERIFIED').length
  const mProvisional = manufacturers.filter((m) => m.verificationStatus === 'PROVISIONAL').length
  const mUnknown = manufacturers.filter((m) => m.verificationStatus === 'UNKNOWN').length
  const mMissingProv = manufacturers.filter((m) => !m.sourceId).length
  const mStale = manufacturers.filter((m) => m.updatedAt < staleDate).length
  const mBlocked = manufacturers.filter((m) => m.verificationStatus !== 'VERIFIED' || !m.website || !m.isActive).length
  const mReview = mProvisional + mUnknown

  const manufacturerMetrics: EntityReadinessMetrics = {
    domain: 'Manufacturers',
    totalRecords: mTotal,
    verifiedRecords: mVerified,
    provisionalRecords: mProvisional,
    unknownRecords: mUnknown,
    blockedFromPublication: mBlocked,
    missingProvenance: mMissingProv,
    staleRecords: mStale,
    requiringReview: mReview,
    readinessPercentage: mTotal > 0 ? Math.round((mVerified / mTotal) * 100) : 0,
  }

  // 2. Assets
  const assets = await db.asset.findMany({
    select: {
      id: true,
      status: true,
      categoryId: true,
      images: true,
      updatedAt: true,
      purchasePrice: true,
    },
  }).catch(() => [])

  const aTotal = assets.length
  const aVerified = assets.filter((a) => a.status === 'ACTIVE' && a.categoryId).length
  const aProvisional = assets.filter((a) => a.status === 'PENDING_REVIEW').length
  const aUnknown = assets.filter((a) => a.status === 'DRAFT' || !a.categoryId).length
  const aMissingProv = assets.filter((a) => !a.categoryId).length
  const aStale = assets.filter((a) => a.updatedAt < staleDate).length
  const aBlocked = assets.filter((a) => a.status !== 'ACTIVE').length

  const assetMetrics: EntityReadinessMetrics = {
    domain: 'Assets / Equipment',
    totalRecords: aTotal,
    verifiedRecords: aVerified,
    provisionalRecords: aProvisional,
    unknownRecords: aUnknown,
    blockedFromPublication: aBlocked,
    missingProvenance: aMissingProv,
    staleRecords: aStale,
    requiringReview: aUnknown + aProvisional,
    readinessPercentage: aTotal > 0 ? Math.round((aVerified / aTotal) * 100) : 0,
  }

  // 3. Providers (Lenders)
  const lenders = await db.lender.findMany({
    select: {
      id: true,
      status: true,
      verificationStatus: true,
      companyVerified: true,
      websiteVerified: true,
      contactVerified: true,
      productsVerified: true,
      criteriaVerified: true,
      profileApproved: true,
      isPubliclyListed: true,
      updatedAt: true,
    },
  }).catch(() => [])

  const lTotal = lenders.length
  const lVerified = lenders.filter(
    (l) => l.companyVerified && l.contactVerified && l.criteriaVerified && l.status === 'ACTIVE',
  ).length
  const lProvisional = lenders.filter((l) => l.status === 'VERIFIED' || l.status === 'UNDER_REVIEW').length
  const lUnknown = lenders.filter((l) => l.status === 'APPLIED' || l.status === 'PENDING_ONBOARDING').length
  const lBlocked = lenders.filter((l) => !l.isPubliclyListed || l.status !== 'ACTIVE').length
  const lReview = lenders.filter((l) => !l.profileApproved || !l.criteriaVerified).length

  const providerMetrics: EntityReadinessMetrics = {
    domain: 'Providers',
    totalRecords: lTotal,
    verifiedRecords: lVerified,
    provisionalRecords: lProvisional,
    unknownRecords: lUnknown,
    blockedFromPublication: lBlocked,
    missingProvenance: 0,
    staleRecords: lenders.filter((l) => l.updatedAt < staleDate).length,
    requiringReview: lReview,
    readinessPercentage: lTotal > 0 ? Math.round((lVerified / lTotal) * 100) : 0,
  }

  // 4. Provider Criteria & Versions
  const criteria = await db.providerCriteria.findMany({
    select: {
      id: true,
      isActive: true,
      updatedAt: true,
      lender: { select: { verificationStatus: true } },
    },
  }).catch(() => [])

  const cTotal = criteria.length
  const cVerified = criteria.filter((c) => c.isActive && c.lender.verificationStatus === 'VERIFIED').length
  const cProvisional = criteria.filter((c) => c.isActive && c.lender.verificationStatus !== 'VERIFIED').length
  const cUnknown = criteria.filter((c) => !c.isActive).length

  const criteriaMetrics: EntityReadinessMetrics = {
    domain: 'Lending Criteria',
    totalRecords: cTotal,
    verifiedRecords: cVerified,
    provisionalRecords: cProvisional,
    unknownRecords: cUnknown,
    blockedFromPublication: cUnknown,
    missingProvenance: 0,
    staleRecords: criteria.filter((c) => c.updatedAt < staleDate).length,
    requiringReview: cProvisional + cUnknown,
    readinessPercentage: cTotal > 0 ? Math.round((cVerified / cTotal) * 100) : 0,
  }

  // 5. Market Observations (Asking vs Sale vs Auction)
  const observations = await db.marketObservation.findMany({
    select: {
      id: true,
      observationType: true,
      sourceId: true,
      observedAt: true,
      confidence: true,
    },
  }).catch(() => [])

  const oTotal = observations.length
  const oVerified = observations.filter(
    (o) => (o.observationType === 'SALE_PRICE' || o.observationType === 'AUCTION_RESULT') && o.sourceId,
  ).length
  const oProvisional = observations.filter((o) => o.observationType === 'ASKING_PRICE' || o.observationType === 'DEALER_PRICE').length
  const oUnknown = observations.filter((o) => !o.sourceId).length
  const oBlocked = oProvisional + oUnknown

  const marketMetrics: EntityReadinessMetrics = {
    domain: 'Market Observations',
    totalRecords: oTotal,
    verifiedRecords: oVerified,
    provisionalRecords: oProvisional,
    unknownRecords: oUnknown,
    blockedFromPublication: oBlocked,
    missingProvenance: oUnknown,
    staleRecords: observations.filter((o) => o.observedAt < staleDate).length,
    requiringReview: oUnknown,
    readinessPercentage: oTotal > 0 ? Math.round((oVerified / oTotal) * 100) : 0,
  }

  // 6. Media / Photographic Assets
  const assetsWithImages = assets.filter((a) => a.images && a.images.length > 0)
  const mediaTotal = assetsWithImages.length
  const mediaVerified = assetsWithImages.filter((a) => a.status === 'ACTIVE').length

  const mediaMetrics: EntityReadinessMetrics = {
    domain: 'Media & Imagery',
    totalRecords: mediaTotal,
    verifiedRecords: mediaVerified,
    provisionalRecords: mediaTotal - mediaVerified,
    unknownRecords: 0,
    blockedFromPublication: mediaTotal - mediaVerified,
    missingProvenance: 0,
    staleRecords: 0,
    requiringReview: mediaTotal - mediaVerified,
    readinessPercentage: mediaTotal > 0 ? Math.round((mediaVerified / mediaTotal) * 100) : 0,
  }

  const allDomains = [
    manufacturerMetrics,
    assetMetrics,
    providerMetrics,
    criteriaMetrics,
    marketMetrics,
    mediaMetrics,
  ]

  const totalPossible = allDomains.reduce((acc, d) => acc + d.totalRecords, 0)
  const totalVerified = allDomains.reduce((acc, d) => acc + d.verifiedRecords, 0)
  const overallScore = totalPossible > 0 ? Math.round((totalVerified / totalPossible) * 100) : 0

  const summaryNotes: string[] = []
  if (mVerified === 0) summaryNotes.push('Initial verified manufacturers dataset not yet populated.')
  if (lVerified === 0) summaryNotes.push('No pilot providers currently in full ACTIVE verified state.')
  if (oVerified === 0) summaryNotes.push('No verified transaction/auction observations; valuation engine operating in INSUFFICIENT_DATA mode.')

  return {
    generatedAt: new Date().toISOString(),
    overallReadinessScore: overallScore,
    isProductionPublishable: overallScore >= 70 && mVerified > 0 && lVerified > 0,
    domains: allDomains,
    summaryNotes,
  }
}
