import type { Timestamps, DataStatus } from './common'

// ─── Finance structure types ──────────────────────────────────────────────────

/**
 * The six core finance structures TAFM supports.
 * Never hard-code assumptions about rates into these definitions.
 */
export type FinanceStructureType =
  | 'HIRE_PURCHASE'
  | 'FINANCE_LEASE'
  | 'OPERATING_LEASE'
  | 'ASSET_REFINANCE'
  | 'COMMERCIAL_LOAN'
  | 'SPECIALIST'

export interface FinanceStructure {
  type: FinanceStructureType
  name: string
  description: string
  keyFeatures: string[]
  ownership: 'IMMEDIATE' | 'END_OF_TERM' | 'LENDER' | 'VARIES'
  vatTreatment: string
  typicalTermMonths: { min: number; max: number }
  typicalDepositPercent?: { min: number; max: number }
  suitableFor: string[]
}

// ─── Finance product (lender product definition) ──────────────────────────────

export interface FinanceProduct extends Timestamps {
  id: string
  lenderId: string
  name: string
  structureType: FinanceStructureType
  description?: string
  eligibleAssetCategories: string[]
  minAmount: number
  maxAmount: number
  currency: string
  minTermMonths: number
  maxTermMonths: number
  minDepositPercent?: number
  maxDepositPercent?: number
  requiresPersonalGuarantee: boolean
  requiresSecurityCharge: boolean
  isActive: boolean
}

// ─── Finance application ──────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INFORMATION_REQUESTED'
  | 'DECISION_PENDING'
  | 'CONDITIONALLY_APPROVED'
  | 'APPROVED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'EXPIRED'
  | 'COMPLETED'

export type ApplicationStep =
  | 'ASSET'
  | 'SUPPLIER'
  | 'PURCHASE'
  | 'BUSINESS'
  | 'FINANCE_REQUIREMENT'
  | 'DOCUMENTS'
  | 'REVIEW'
  | 'SUBMITTED'

export interface FinanceApplication extends Timestamps {
  id: string
  reference: string

  // Applicant
  userId: string
  businessId?: string

  // Asset
  assetId?: string
  assetDescription?: string
  assetValue: number
  currency: string

  // Supplier
  supplierId?: string
  supplierName?: string
  supplierQuoteReference?: string

  // Finance requirement
  requestedStructure?: FinanceStructureType
  requestedAmount: number
  requestedDepositAmount?: number
  requestedTermMonths?: number
  notes?: string

  // Progress
  status: ApplicationStatus
  currentStep: ApplicationStep
  completedSteps: ApplicationStep[]

  // Decisions
  offers: FinanceOffer[]

  // Internal
  internalNotes?: string
  assignedToId?: string
  submittedAt?: Date
  decidedAt?: Date
}

// ─── Finance offer (normalised structure) ─────────────────────────────────────

/**
 * Normalised finance offer — every lender response maps to this structure.
 * ALL values must carry their DataStatus.
 * NEVER fabricate financial figures.
 */
export type OfferDecisionStatus =
  | 'PENDING'
  | 'INDICATIVE'
  | 'APPROVED'
  | 'DECLINED'
  | 'REFERRED'
  | 'WITHDRAWN'
  | 'EXPIRED'

export interface FinanceOffer extends Timestamps {
  id: string
  applicationId: string
  lenderId: string
  financeProductId?: string

  // Core terms
  amount: number
  deposit: number
  termMonths: number
  monthlyPayment: number
  balloon?: number
  interestRate?: number
  apr?: number
  totalPayable: number

  // Data integrity — every financial value must carry its status
  amountStatus: DataStatus
  monthlyPaymentStatus: DataStatus
  interestRateStatus: DataStatus
  totalPayableStatus: DataStatus

  // Fees and charges
  arrangementFee?: number
  brokerFee?: number
  otherFees?: number
  totalFees: number

  // Ownership and legal
  structureType: FinanceStructureType
  ownershipTransferOnCompletion: boolean
  vatTreatment?: string
  earlySettlementTerms?: string

  // Security
  requiresPersonalGuarantee: boolean
  requiresSecurityCharge: boolean
  securityDetails?: string

  // Decision
  decisionStatus: OfferDecisionStatus
  decisionReason?: string
  conditions?: string[]
  validUntil?: Date

  // Traceability — every offer must preserve its origin
  source: 'LENDER_API' | 'MANUAL' | 'CALCULATED' | 'INDICATIVE'
  externalReference?: string
  confidence?: number
  requiresReview: boolean

  // AI involvement flag
  aiGenerated: boolean
  aiJobId?: string
}

// ─── Application document ─────────────────────────────────────────────────────

export type DocumentStatus =
  | 'PENDING_UPLOAD'
  | 'UPLOADED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'

export interface ApplicationDocument extends Timestamps {
  id: string
  applicationId: string
  documentType: string
  status: DocumentStatus
  filename?: string
  mimeType?: string
  sizeBytes?: number
  url?: string
  uploadedBy?: string
  reviewedBy?: string
  reviewNotes?: string
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export type TransactionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DEFAULTED'

export interface Transaction extends Timestamps {
  id: string
  reference: string
  applicationId: string
  offerId: string
  assetId: string
  lenderId: string
  businessId: string
  supplierId?: string
  status: TransactionStatus
  commencedAt?: Date
  completedAt?: Date
  totalFinanced: number
  currency: string
}
