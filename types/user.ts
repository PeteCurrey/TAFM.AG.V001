import type { Timestamps, UKAddress } from './common'

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole =
  | 'BUSINESS'    // Business seeking finance
  | 'SUPPLIER'    // Asset supplier
  | 'LENDER'      // Finance provider
  | 'ADMIN'       // TAFM administrator
  | 'SUPER_ADMIN' // Full platform access

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'

export interface User extends Timestamps {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  status: UserStatus
  emailVerifiedAt?: Date
  lastLoginAt?: Date
  // Business association (for BUSINESS role)
  businessId?: string
  // Supplier association (for SUPPLIER role)
  supplierId?: string
  // Lender association (for LENDER role)
  lenderId?: string
}

// Safe public-facing user summary (no sensitive data)
export interface UserSummary {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
}

// ─── Business ─────────────────────────────────────────────────────────────────

export type BusinessStructure =
  | 'SOLE_TRADER'
  | 'PARTNERSHIP'
  | 'LLP'
  | 'LIMITED_COMPANY'
  | 'PLC'
  | 'CIC'
  | 'CHARITY'
  | 'OTHER'

export type BusinessStatus = 'ACTIVE' | 'INACTIVE' | 'DISSOLVED' | 'PENDING_VERIFICATION'

export interface Business extends Timestamps {
  id: string
  name: string
  tradingName?: string
  structure: BusinessStructure
  status: BusinessStatus

  // Registration
  companyNumber?: string
  vatNumber?: string
  isVatRegistered: boolean

  // Regulatory
  industry?: string
  sicCode?: string

  // Contact
  address?: UKAddress
  website?: string
  contactEmail?: string
  contactPhone?: string

  // Financial profile (from application data only — not stored permanently without consent)
  yearsTrading?: number
  annualTurnover?: number
  currency?: string

  // TAFM relationship
  verifiedAt?: Date
  ownerId: string
  users: string[] // user IDs
}

export interface BusinessSummary {
  id: string
  name: string
  structure: BusinessStructure
  companyNumber?: string
  yearsTrading?: number
  status: BusinessStatus
}
