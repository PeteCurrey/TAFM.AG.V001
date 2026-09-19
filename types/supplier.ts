import type { Timestamps, UKAddress } from './common'
import type { AssetCategorySlug } from './asset'

// ─── Supplier ─────────────────────────────────────────────────────────────────

export type SupplierStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING_ONBOARDING'
  | 'SUSPENDED'
  | 'ARCHIVED'

export type SupplierType =
  | 'DEALER'
  | 'MANUFACTURER'
  | 'DISTRIBUTOR'
  | 'AUCTION_HOUSE'
  | 'BROKER'
  | 'PRIVATE'
  | 'OTHER'

export interface Supplier extends Timestamps {
  id: string
  slug: string
  name: string
  tradingName?: string
  supplierType: SupplierType
  status: SupplierStatus

  // Contact
  address?: UKAddress
  website?: string
  contactEmail?: string
  contactPhone?: string
  contactName?: string

  // Business details
  companyNumber?: string
  vatNumber?: string
  isVatRegistered: boolean

  // Proposition
  description?: string
  specialisms?: string[]
  assetCategories: AssetCategorySlug[]

  // Presentation
  logoUrl?: string
  coverImageUrl?: string
  displayPriority: number

  // TAFM relationship
  isVerified: boolean
  verifiedAt?: Date
  termsAgreedAt?: Date

  // Internal
  notes?: string
}

export interface SupplierSummary {
  id: string
  slug: string
  name: string
  supplierType: SupplierType
  logoUrl?: string
  assetCategories: AssetCategorySlug[]
  isVerified: boolean
  website?: string
}

// ─── Supplier quote ───────────────────────────────────────────────────────────

export interface SupplierQuote {
  id: string
  supplierId?: string
  supplierName: string
  assetId?: string
  assetDescription: string
  quoteReference?: string
  amount: number
  currency: string
  vatAmount?: number
  totalIncVat?: number
  validUntil?: Date
  notes?: string
  documentUrl?: string
  extractedByAI: boolean
  aiConfidence?: number
  createdAt: Date
}
