// ─── Provider eligibility engine ──────────────────────────────────────────────
//
// DETERMINISTIC. No AI. No probabilities.
// Given a finance requirement and a provider's criteria, returns ELIGIBLE,
// NOT_ELIGIBLE, or UNKNOWN for each factor and an overall status.
//
// UNKNOWN is never silently promoted to ELIGIBLE.
// Every factor that cannot be evaluated returns UNKNOWN explicitly.

export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN'

export interface FinanceRequirement {
  assetCategory?:    string     // slug e.g. 'construction-equipment'
  financeStructure?: string     // e.g. 'HIRE_PURCHASE'
  amount?:           number     // GBP
  termMonths?:       number
  assetAgeYears?:    number     // 0 = new
  isNewAsset?:       boolean
  businessType?:     string     // e.g. 'LIMITED_COMPANY'
  geographyUK?:      boolean
  businessAgeMonths?: number
  annualTurnover?:   number
}

export interface ProviderCriteriaInput {
  lenderId:            string
  lenderName?:         string
  assetCategories:     string[]    // empty = all accepted
  financeStructures:   string[]    // empty = all accepted
  minAmount:           number
  maxAmount:           number
  minTermMonths:       number
  maxTermMonths:       number
  geographyUKOnly:     boolean
  businessTypes:       string[]    // empty = all accepted
  maxAssetAgeYears?:   number
  newAssetsOnly:       boolean
  usedAssetsConsidered: boolean
  minBusinessAgeMonths?: number
  minAnnualTurnover?:  number
  isActive:            boolean
}

export interface MatchFactor {
  field:     string
  label:     string
  value?:    string        // what the requirement states
  criterion?: string       // what the provider requires
  status:    EligibilityStatus
  reason:    string
}

export interface EligibilityResult {
  lenderId:  string
  lenderName?: string
  overall:   EligibilityStatus
  factors:   MatchFactor[]
  blockers:  string[]     // factors that returned NOT_ELIGIBLE
  unknowns:  string[]     // factors that returned UNKNOWN
  timestamp: Date
}

// ─── Rules engine ─────────────────────────────────────────────────────────────

export function checkEligibility(
  requirement: FinanceRequirement,
  provider: ProviderCriteriaInput,
): EligibilityResult {
  if (!provider.isActive) {
    return {
      lenderId:  provider.lenderId,
      lenderName: provider.lenderName,
      overall:   'NOT_ELIGIBLE',
      factors:   [{ field: 'provider_active', label: 'Provider active', status: 'NOT_ELIGIBLE', reason: 'Provider is not currently active' }],
      blockers:  ['Provider is not currently active'],
      unknowns:  [],
      timestamp: new Date(),
    }
  }

  const factors: MatchFactor[] = []

  // ── Asset category
  factors.push(evaluateAssetCategory(requirement.assetCategory, provider.assetCategories))

  // ── Finance structure
  factors.push(evaluateFinanceStructure(requirement.financeStructure, provider.financeStructures))

  // ── Amount range
  factors.push(evaluateAmount(requirement.amount, provider.minAmount, provider.maxAmount))

  // ── Term
  factors.push(evaluateTerm(requirement.termMonths, provider.minTermMonths, provider.maxTermMonths))

  // ── Geography
  factors.push(evaluateGeography(requirement.geographyUK, provider.geographyUKOnly))

  // ── Asset age / new vs used
  factors.push(evaluateAssetAge(requirement.assetAgeYears, requirement.isNewAsset, provider.maxAssetAgeYears, provider.newAssetsOnly, provider.usedAssetsConsidered))

  // ── Business type
  factors.push(evaluateBusinessType(requirement.businessType, provider.businessTypes))

  // ── Business age
  if (provider.minBusinessAgeMonths !== undefined && provider.minBusinessAgeMonths > 0) {
    factors.push(evaluateBusinessAge(requirement.businessAgeMonths, provider.minBusinessAgeMonths))
  }

  // ── Annual turnover
  if (provider.minAnnualTurnover !== undefined && provider.minAnnualTurnover > 0) {
    factors.push(evaluateTurnover(requirement.annualTurnover, provider.minAnnualTurnover))
  }

  const blockers  = factors.filter((f) => f.status === 'NOT_ELIGIBLE').map((f) => f.reason)
  const unknowns  = factors.filter((f) => f.status === 'UNKNOWN').map((f) => f.reason)

  // Overall: any blocker → NOT_ELIGIBLE; any unknown (with no blockers) → UNKNOWN; else ELIGIBLE
  let overall: EligibilityStatus
  if (blockers.length > 0) {
    overall = 'NOT_ELIGIBLE'
  } else if (unknowns.length > 0) {
    overall = 'UNKNOWN'
  } else {
    overall = 'ELIGIBLE'
  }

  return { lenderId: provider.lenderId, lenderName: provider.lenderName, overall, factors, blockers, unknowns, timestamp: new Date() }
}

// ─── Individual factor evaluators ─────────────────────────────────────────────

function evaluateAssetCategory(required?: string, accepted?: string[]): MatchFactor {
  const field = 'asset_category'
  const label = 'Asset category'

  if (!required) {
    return { field, label, status: 'UNKNOWN', reason: 'Asset category not specified in requirement' }
  }
  if (!accepted || accepted.length === 0) {
    return { field, label, value: required, criterion: 'All categories', status: 'ELIGIBLE', reason: 'Provider accepts all asset categories' }
  }
  if (accepted.includes(required)) {
    return { field, label, value: required, criterion: accepted.join(', '), status: 'ELIGIBLE', reason: `Asset category "${required}" is supported` }
  }
  return { field, label, value: required, criterion: accepted.join(', '), status: 'NOT_ELIGIBLE', reason: `Asset category "${required}" is not supported by this provider` }
}

function evaluateFinanceStructure(required?: string, accepted?: string[]): MatchFactor {
  const field = 'finance_structure'
  const label = 'Finance structure'

  if (!required) {
    return { field, label, status: 'UNKNOWN', reason: 'Finance structure not specified in requirement' }
  }
  if (!accepted || accepted.length === 0) {
    return { field, label, value: required, criterion: 'All structures', status: 'ELIGIBLE', reason: 'Provider accepts all finance structures' }
  }
  if (accepted.includes(required)) {
    return { field, label, value: required, criterion: accepted.join(', '), status: 'ELIGIBLE', reason: `Finance structure "${required}" is supported` }
  }
  return { field, label, value: required, criterion: accepted.join(', '), status: 'NOT_ELIGIBLE', reason: `Finance structure "${required}" is not offered by this provider` }
}

function evaluateAmount(required?: number, min?: number, max?: number): MatchFactor {
  const field = 'amount'
  const label = 'Finance amount'

  if (required === undefined || required === null) {
    return { field, label, status: 'UNKNOWN', reason: 'Finance amount not specified' }
  }
  const fmt = (n: number) => `£${n.toLocaleString('en-GB')}`
  if (min !== undefined && required < min) {
    return { field, label, value: fmt(required), criterion: `Min ${fmt(min)}`, status: 'NOT_ELIGIBLE', reason: `Amount ${fmt(required)} is below provider minimum ${fmt(min)}` }
  }
  if (max !== undefined && max > 0 && required > max) {
    return { field, label, value: fmt(required), criterion: `Max ${fmt(max)}`, status: 'NOT_ELIGIBLE', reason: `Amount ${fmt(required)} exceeds provider maximum ${fmt(max)}` }
  }
  return { field, label, value: fmt(required), criterion: `${min ? fmt(min) : '—'} – ${max ? fmt(max) : '—'}`, status: 'ELIGIBLE', reason: 'Amount is within provider range' }
}

function evaluateTerm(required?: number, min?: number, max?: number): MatchFactor {
  const field = 'term'
  const label = 'Finance term'

  if (!required) {
    return { field, label, status: 'UNKNOWN', reason: 'Finance term not specified' }
  }
  if (min !== undefined && required < min) {
    return { field, label, value: `${required} months`, criterion: `Min ${min} months`, status: 'NOT_ELIGIBLE', reason: `Term of ${required} months is below provider minimum of ${min} months` }
  }
  if (max !== undefined && required > max) {
    return { field, label, value: `${required} months`, criterion: `Max ${max} months`, status: 'NOT_ELIGIBLE', reason: `Term of ${required} months exceeds provider maximum of ${max} months` }
  }
  return { field, label, value: `${required} months`, criterion: `${min ?? '—'}–${max ?? '—'} months`, status: 'ELIGIBLE', reason: 'Term is within provider range' }
}

function evaluateGeography(isUK?: boolean, ukOnly?: boolean): MatchFactor {
  const field = 'geography'
  const label = 'Geography'

  if (isUK === undefined) {
    return { field, label, status: 'UNKNOWN', reason: 'Business geography not confirmed' }
  }
  if (ukOnly && !isUK) {
    return { field, label, value: 'Non-UK', criterion: 'UK only', status: 'NOT_ELIGIBLE', reason: 'Provider operates in UK only' }
  }
  return { field, label, value: 'UK', criterion: ukOnly ? 'UK only' : 'UK + International', status: 'ELIGIBLE', reason: 'Geography requirement met' }
}

function evaluateAssetAge(
  ageYears?: number,
  isNew?: boolean,
  maxAge?: number,
  newOnly?: boolean,
  usedConsidered?: boolean,
): MatchFactor {
  const field = 'asset_age'
  const label = 'Asset age / condition'

  if (ageYears === undefined && isNew === undefined) {
    return { field, label, status: 'UNKNOWN', reason: 'Asset age not provided' }
  }
  const effectivelyNew = isNew === true || ageYears === 0

  if (newOnly && !effectivelyNew) {
    return { field, label, value: isNew ? 'New' : `${ageYears}yr`, criterion: 'New assets only', status: 'NOT_ELIGIBLE', reason: 'Provider accepts new assets only' }
  }
  if (!usedConsidered && !effectivelyNew) {
    return { field, label, value: `${ageYears}yr`, criterion: 'New assets only', status: 'NOT_ELIGIBLE', reason: 'Provider does not consider used assets' }
  }
  if (maxAge !== undefined && ageYears !== undefined && ageYears > maxAge) {
    return { field, label, value: `${ageYears}yr`, criterion: `Max ${maxAge}yr`, status: 'NOT_ELIGIBLE', reason: `Asset age ${ageYears} years exceeds provider maximum of ${maxAge} years` }
  }
  return { field, label, value: effectivelyNew ? 'New' : `${ageYears}yr`, criterion: maxAge ? `Max ${maxAge}yr` : 'Any age', status: 'ELIGIBLE', reason: 'Asset age/condition meets provider criteria' }
}

function evaluateBusinessType(required?: string, accepted?: string[]): MatchFactor {
  const field = 'business_type'
  const label = 'Business type'

  if (!required) {
    return { field, label, status: 'UNKNOWN', reason: 'Business type not specified' }
  }
  if (!accepted || accepted.length === 0) {
    return { field, label, value: required, criterion: 'All types', status: 'ELIGIBLE', reason: 'Provider accepts all business types' }
  }
  if (accepted.includes(required)) {
    return { field, label, value: required, criterion: accepted.join(', '), status: 'ELIGIBLE', reason: `Business type "${required}" is supported` }
  }
  return { field, label, value: required, criterion: accepted.join(', '), status: 'NOT_ELIGIBLE', reason: `Business type "${required}" is not supported by this provider` }
}

function evaluateBusinessAge(actual?: number, minimum?: number): MatchFactor {
  const field = 'business_age'
  const label = 'Business trading age'

  if (actual === undefined) {
    return { field, label, status: 'UNKNOWN', reason: 'Business trading period not provided' }
  }
  if (minimum && actual < minimum) {
    return { field, label, value: `${actual} months`, criterion: `Min ${minimum} months`, status: 'NOT_ELIGIBLE', reason: `Business has traded ${actual} months — provider requires ${minimum} months minimum` }
  }
  return { field, label, value: `${actual} months`, criterion: `Min ${minimum} months`, status: 'ELIGIBLE', reason: 'Business trading age meets minimum requirement' }
}

function evaluateTurnover(actual?: number, minimum?: number): MatchFactor {
  const field = 'turnover'
  const label = 'Annual turnover'

  if (actual === undefined) {
    return { field, label, status: 'UNKNOWN', reason: 'Annual turnover not provided' }
  }
  const fmt = (n: number) => `£${n.toLocaleString('en-GB')}`
  if (minimum && actual < minimum) {
    return { field, label, value: fmt(actual), criterion: `Min ${fmt(minimum)}`, status: 'NOT_ELIGIBLE', reason: `Turnover ${fmt(actual)} is below provider minimum ${fmt(minimum)}` }
  }
  return { field, label, value: fmt(actual), criterion: `Min ${fmt(minimum ?? 0)}`, status: 'ELIGIBLE', reason: 'Turnover meets minimum requirement' }
}
