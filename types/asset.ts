import type { SoftDeletable, UKAddress, Money, FileAttachment } from './common'

// ─── Asset taxonomy ───────────────────────────────────────────────────────────

/**
 * Top-level asset categories.
 * Extensible — do not hard-code category assumptions in UI logic.
 */
export type AssetCategorySlug =
  | 'construction-equipment'
  | 'manufacturing-equipment'
  | 'agricultural-equipment'
  | 'commercial-vehicles'
  | 'heavy-vehicles'
  | 'medical-equipment'
  | 'industrial-equipment'
  | 'technology-it-equipment'
  | 'renewable-energy-equipment'
  | 'hospitality-equipment'
  | 'specialist-equipment'
  | 'other'

export interface AssetCategory {
  id: string
  slug: AssetCategorySlug
  name: string
  description: string
  parentId: string | null
  icon?: string
  sortOrder: number
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

// ─── Manufacturer ─────────────────────────────────────────────────────────────

export interface Manufacturer {
  id: string
  slug: string
  name: string
  countryOfOrigin?: string
  website?: string
  logoUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Asset model ──────────────────────────────────────────────────────────────

export interface AssetModel {
  id: string
  slug: string
  name: string
  manufacturerId: string
  manufacturer?: Manufacturer
  categoryId: string
  category?: AssetCategory
  description?: string
  specifications?: Record<string, string | number>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Core asset record ────────────────────────────────────────────────────────

export type AssetCondition = 'NEW' | 'USED' | 'REFURBISHED' | 'FOR_PARTS'

export type AssetStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'RESERVED'
  | 'FINANCED'
  | 'INACTIVE'
  | 'SOLD'
  | 'ARCHIVED'

/**
 * Core Asset entity.
 * TAFM is asset-centric. All finance flows originate from a specific asset.
 */
export interface Asset extends SoftDeletable {
  id: string
  slug?: string

  // Classification
  categoryId: string
  category?: AssetCategory
  manufacturerId?: string
  manufacturer?: Manufacturer
  modelId?: string
  model?: AssetModel

  // Identity
  name: string
  description?: string
  serialNumber?: string
  yearOfManufacture?: number
  condition: AssetCondition
  isNew: boolean

  // Supplier
  supplierId?: string

  // Valuation
  purchasePrice: number
  currency: string
  vatApplicable: boolean
  vatRate?: number
  estimatedUsefulLifeYears?: number
  residualValueEstimate?: number

  // Location
  location?: UKAddress
  locationDescription?: string

  // Documentation
  images: string[]
  documents: FileAttachment[]
  specifications?: Record<string, string | number>

  // Lifecycle
  status: AssetStatus
}

// ─── Asset summary (list views) ───────────────────────────────────────────────

export interface AssetSummary {
  id: string
  slug?: string
  name: string
  categoryId: string
  categoryName: string
  manufacturerName?: string
  modelName?: string
  condition: AssetCondition
  isNew: boolean
  purchasePrice: number
  currency: string
  primaryImageUrl?: string
  status: AssetStatus
  createdAt: Date
}

// ─── Asset valuation ─────────────────────────────────────────────────────────

export interface AssetValuation {
  id: string
  assetId: string
  valuedAt: Date
  valueAmount: number
  currency: string
  valuationType: 'OPEN_MARKET' | 'FORCED_SALE' | 'INSURANCE' | 'DESKTOP' | 'FULL_INSPECTION'
  valuedById?: string
  notes?: string
  source: 'MANUAL' | 'AUTOMATED' | 'THIRD_PARTY'
  createdAt: Date
}
