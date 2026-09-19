import type { Timestamps, UKAddress } from './common'
import type { AssetCategorySlug } from './asset'
import type { FinanceStructureType } from './finance'

// ─── Lender ───────────────────────────────────────────────────────────────────

export type LenderStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_ONBOARDING' | 'SUSPENDED'

export type LenderType =
  | 'BANK'
  | 'SPECIALIST_LENDER'
  | 'CHALLENGER_BANK'
  | 'BROKER_FUNDER'
  | 'PRIVATE_CREDIT'
  | 'CAPTIVE_FINANCE'
  | 'OTHER'

export interface Lender extends Timestamps {
  id: string
  slug: string
  name: string
  tradingName?: string
  lenderType: LenderType
  status: LenderStatus

  // Regulatory
  fcaReference?: string
  isRegulated: boolean
  regulatoryBody?: string

  // Contact
  address?: UKAddress
  website?: string
  contactEmail?: string
  contactPhone?: string

  // Proposition
  description?: string
  specialisms?: string[]
  eligibleAssetCategories: AssetCategorySlug[]
  eligibleStructures: FinanceStructureType[]
  minLoanAmount: number
  maxLoanAmount: number
  currency: string
  minTermMonths: number
  maxTermMonths: number

  // Appetite
  newBusinessAppetite: boolean
  startupsConsidered: boolean
  adverseCreditConsidered: boolean
  ukOnly: boolean

  // Integration
  apiIntegrationStatus: 'NONE' | 'IN_PROGRESS' | 'ACTIVE' | 'SUSPENDED'
  apiEndpoint?: string

  // Presentation
  logoUrl?: string
  displayPriority: number

  // Internal
  notes?: string
}

/**
 * Lender summary for list views.
 * Never include API credentials or internal notes.
 */
export interface LenderSummary {
  id: string
  slug: string
  name: string
  lenderType: LenderType
  logoUrl?: string
  specialisms: string[]
  eligibleAssetCategories: AssetCategorySlug[]
  eligibleStructures: FinanceStructureType[]
  minLoanAmount: number
  maxLoanAmount: number
  apiIntegrationStatus: 'NONE' | 'IN_PROGRESS' | 'ACTIVE' | 'SUSPENDED'
}
