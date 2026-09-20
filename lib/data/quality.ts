// ─── Data quality scoring ──────────────────────────────────────────────────────
//
// Never reduce quality to a single meaningless number.
// Always show the components — identity, specification, source, verification, freshness.
//
// Thresholds are deliberately conservative — better to under-claim than over-claim.

import { db } from '@/lib/db/client'
import { logger } from '@/lib/logging'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataQualityComponent {
  score:  number   // 0–1
  label:  string   // e.g. "Identity"
  issues: string[] // specific gaps
  bars:   number   // 0–10 for rendering ████████░░
}

export interface DataQualityReport {
  entityType:    string
  entityId:      string
  identity:      DataQualityComponent
  specification: DataQualityComponent
  sourceQuality: DataQualityComponent
  verification:  DataQualityComponent
  freshness:     DataQualityComponent
  overall:       number // weighted mean — for sorting only, never displayed alone
  issues:        string[] // all issues aggregated
  scoredAt:      Date
}

function makeComponent(
  label: string,
  score: number,
  issues: string[],
): DataQualityComponent {
  return { label, score, issues, bars: Math.round(score * 10) }
}

// ─── Asset quality ────────────────────────────────────────────────────────────

export async function scoreAssetQuality(assetId: string): Promise<DataQualityReport | null> {
  const asset = await db.asset.findUnique({
    where: { id: assetId },
    include: { manufacturer: true, model: true, category: true, valuations: true },
  })
  if (!asset) return null

  // Identity
  const identityIssues: string[] = []
  let identityScore = 1.0
  if (!asset.manufacturerId)    { identityIssues.push('Manufacturer not set'); identityScore -= 0.25 }
  if (!asset.modelId)           { identityIssues.push('Model not set');        identityScore -= 0.20 }
  if (!asset.yearOfManufacture) { identityIssues.push('Year not set');         identityScore -= 0.15 }
  if (!asset.serialNumber)      { identityIssues.push('Serial number missing');identityScore -= 0.10 }

  // Specification
  const specIssues: string[] = []
  let specScore = 1.0
  if (!asset.description)       { specIssues.push('No description');          specScore -= 0.30 }
  if (!asset.specifications)    { specIssues.push('No specifications');        specScore -= 0.30 }
  if (!asset.images?.length)    { specIssues.push('No images');               specScore -= 0.20 }
  if (!asset.locationDescription && !asset.location) { specIssues.push('No location'); specScore -= 0.10 }

  // Source quality — do we know where this asset came from?
  const sourceIssues: string[] = []
  let sourceScore = 0.5 // base: user-submitted assumed
  if (asset.supplierId)         sourceScore += 0.3  // known supplier
  if (asset.documents)          sourceScore += 0.2  // has documents

  // Verification
  const verIssues: string[] = []
  let verScore = 0.0
  if (asset.status === 'ACTIVE')                verScore += 0.4
  if (asset.manufacturer?.verificationStatus === 'VERIFIED') verScore += 0.3
  else if (!asset.manufacturer?.verificationStatus || asset.manufacturer.verificationStatus === 'UNKNOWN') {
    verIssues.push('Manufacturer not verified')
  }
  if (asset.valuations?.length)                 verScore += 0.3
  else verIssues.push('No valuation on record')

  // Freshness
  const now = Date.now()
  const ageMs = now - asset.updatedAt.getTime()
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  const freshnessScore = ageDays < 30 ? 1.0 : ageDays < 90 ? 0.7 : ageDays < 180 ? 0.4 : 0.1
  const freshnessIssues = ageDays > 90 ? [`Last updated ${Math.round(ageDays)} days ago`] : []

  const components = {
    identity:      makeComponent('Identity',      Math.max(0, identityScore), identityIssues),
    specification: makeComponent('Specification', Math.max(0, specScore),     specIssues),
    sourceQuality: makeComponent('Source',        Math.min(1, sourceScore),   sourceIssues),
    verification:  makeComponent('Verification',  Math.min(1, verScore),      verIssues),
    freshness:     makeComponent('Freshness',     freshnessScore,             freshnessIssues),
  }

  const overall = (
    components.identity.score * 0.30 +
    components.specification.score * 0.25 +
    components.sourceQuality.score * 0.20 +
    components.verification.score * 0.15 +
    components.freshness.score * 0.10
  )

  const issues = [
    ...identityIssues, ...specIssues, ...sourceIssues, ...verIssues, ...freshnessIssues,
  ]

  return { entityType: 'asset', entityId: assetId, ...components, overall, issues, scoredAt: new Date() }
}

// ─── Manufacturer quality ─────────────────────────────────────────────────────

export async function scoreManufacturerQuality(
  manufacturerId: string,
): Promise<DataQualityReport | null> {
  const mfr = await db.manufacturer.findUnique({
    where: { id: manufacturerId },
    include: { assetModels: true },
  })
  if (!mfr) return null

  const identityIssues: string[] = []
  let identityScore = 1.0
  if (!mfr.countryOfOrigin) { identityIssues.push('Country of origin missing'); identityScore -= 0.2 }
  if (!mfr.website)         { identityIssues.push('Website missing');           identityScore -= 0.2 }
  if (!mfr.logoUrl)         { identityIssues.push('Logo missing');              identityScore -= 0.1 }

  const specIssues: string[] = []
  let specScore = 1.0
  if (!mfr.description)     { specIssues.push('No description');               specScore -= 0.5 }
  if (!mfr.aliases?.length) { specIssues.push('No aliases — normalisation may miss variants'); specScore -= 0.2 }

  const verScore = mfr.verificationStatus === 'VERIFIED' ? 1.0
    : mfr.verificationStatus === 'PROVISIONAL' ? 0.5
    : 0.1
  const verIssues = verScore < 1.0 ? [`Verification status: ${mfr.verificationStatus}`] : []

  const sourceScore = mfr.sourceId ? 0.8 : 0.2
  const sourceIssues = !mfr.sourceId ? ['No data source recorded'] : []

  const ageDays = (Date.now() - mfr.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  const freshnessScore = ageDays < 90 ? 1.0 : ageDays < 365 ? 0.6 : 0.3
  const freshnessIssues = ageDays > 365 ? [`Last updated ${Math.round(ageDays / 30)} months ago`] : []

  const components = {
    identity:      makeComponent('Identity',      Math.max(0, identityScore), identityIssues),
    specification: makeComponent('Specification', Math.max(0, specScore),     specIssues),
    sourceQuality: makeComponent('Source',        sourceScore,                sourceIssues),
    verification:  makeComponent('Verification',  verScore,                   verIssues),
    freshness:     makeComponent('Freshness',     freshnessScore,             freshnessIssues),
  }

  const overall = (
    components.identity.score * 0.25 +
    components.specification.score * 0.25 +
    components.sourceQuality.score * 0.20 +
    components.verification.score * 0.20 +
    components.freshness.score * 0.10
  )

  const issues = [
    ...identityIssues, ...specIssues, ...sourceIssues, ...verIssues, ...freshnessIssues,
  ]

  return {
    entityType: 'manufacturer', entityId: manufacturerId,
    ...components, overall, issues, scoredAt: new Date(),
  }
}

// ─── Lender / provider quality ─────────────────────────────────────────────────

export async function scoreLenderQuality(
  lenderId: string,
): Promise<DataQualityReport | null> {
  const lender = await db.lender.findUnique({
    where: { id: lenderId },
    include: { criteria: true, criteriaVersions: true, financeProducts: true },
  })
  if (!lender) return null

  const identityIssues: string[] = []
  let identityScore = 1.0
  if (!lender.website)      { identityIssues.push('Website missing');          identityScore -= 0.2 }
  if (!lender.description)  { identityIssues.push('No description');           identityScore -= 0.2 }
  if (!lender.fcaReference && lender.isRegulated) {
    identityIssues.push('FCA reference missing for regulated lender'); identityScore -= 0.3
  }

  const specIssues: string[] = []
  let specScore = 1.0
  if (!lender.criteria)              { specIssues.push('No criteria record');    specScore -= 0.4 }
  if (!lender.financeProducts.length){ specIssues.push('No finance products');   specScore -= 0.3 }
  if (!lender.eligibleAssetCategories.length) {
    specIssues.push('No eligible asset categories set'); specScore -= 0.2
  }

  const verScore = lender.verificationStatus === 'VERIFIED' ? 1.0
    : lender.verificationStatus === 'PROVISIONAL' ? 0.5 : 0.1
  const verIssues = verScore < 1.0 ? [`Verification: ${lender.verificationStatus}`] : []

  // Criteria currency — how recently was criteria verified?
  const activeVersion = lender.criteriaVersions.find(v => v.isActive)
  let freshnessScore = 0.3
  const freshnessIssues: string[] = []
  if (activeVersion) {
    const ageDays = (Date.now() - activeVersion.effectiveFrom.getTime()) / (1000 * 60 * 60 * 24)
    freshnessScore = ageDays < 90 ? 1.0 : ageDays < 180 ? 0.7 : ageDays < 365 ? 0.4 : 0.2
    if (ageDays > 180) freshnessIssues.push(`Criteria last reviewed ${Math.round(ageDays / 30)} months ago`)
  } else {
    freshnessIssues.push('No versioned criteria record — criteria currency unknown')
  }

  const sourceScore = lender.verificationStatus === 'VERIFIED' ? 0.9 : 0.3
  const sourceIssues = lender.verificationStatus !== 'VERIFIED' ? ['Provider not yet independently verified'] : []

  const components = {
    identity:      makeComponent('Identity',      Math.max(0, identityScore), identityIssues),
    specification: makeComponent('Specification', Math.max(0, specScore),     specIssues),
    sourceQuality: makeComponent('Source',        sourceScore,                sourceIssues),
    verification:  makeComponent('Verification',  verScore,                   verIssues),
    freshness:     makeComponent('Freshness',     freshnessScore,             freshnessIssues),
  }

  const overall = (
    components.identity.score * 0.20 +
    components.specification.score * 0.30 +
    components.sourceQuality.score * 0.15 +
    components.verification.score * 0.20 +
    components.freshness.score * 0.15
  )

  const issues = [
    ...identityIssues, ...specIssues, ...sourceIssues, ...verIssues, ...freshnessIssues,
  ]

  logger.info('Lender quality scored', { lenderId, overall: overall.toFixed(3) }, 'app')

  return {
    entityType: 'lender', entityId: lenderId,
    ...components, overall, issues, scoredAt: new Date(),
  }
}

// ─── Indexability threshold ────────────────────────────────────────────────────

/**
 * Determine whether an entity meets the minimum content/data quality threshold
 * to be publicly indexed by search engines.
 *
 * Below threshold → NOINDEX. This prevents TAFM becoming a site full of thin pages.
 */
export function shouldIndex(report: DataQualityReport | null): boolean {
  if (!report) return false
  // All components must be above a meaningful floor
  return (
    report.identity.score >= 0.5 &&
    report.specification.score >= 0.3 &&
    report.verification.score >= 0.2 &&
    report.overall >= 0.4
  )
}
