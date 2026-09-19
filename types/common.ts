// ─── Common shared types across the TAFM domain ───────────────────────────────

// ─── Data integrity ───────────────────────────────────────────────────────────

/**
 * Indicates the reliability of a data value.
 * Critical for finance offers — never allow UNKNOWN to become a guessed value.
 */
export type DataStatus =
  | 'VERIFIED'      // Confirmed by authoritative source
  | 'PROVISIONAL'   // Indicative, subject to change
  | 'CALCULATED'    // Derived from validated inputs
  | 'USER_PROVIDED' // Submitted by a user, not yet verified
  | 'UNKNOWN'       // Source or reliability unclear

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: Record<string, unknown>
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ─── Audit trail ──────────────────────────────────────────────────────────────

/**
 * Audit record for any important mutation in the system.
 * Financial and application data must be fully auditable.
 */
export interface AuditRecord {
  id: string
  entityType: string
  entityId: string
  action: AuditAction
  actorId: string | null
  actorType: 'USER' | 'SYSTEM' | 'AI' | 'INTEGRATION'
  previousValue?: unknown
  newValue?: unknown
  source?: string
  reason?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'SUBMIT'
  | 'APPROVE'
  | 'DECLINE'
  | 'WITHDRAW'
  | 'REVIEW'
  | 'EXPORT'
  | 'ACCESS'

// ─── Soft deletes & timestamps ────────────────────────────────────────────────

export interface Timestamps {
  createdAt: Date
  updatedAt: Date
}

export interface SoftDeletable extends Timestamps {
  deletedAt: Date | null
}

// ─── UK geography ─────────────────────────────────────────────────────────────

export interface UKAddress {
  line1: string
  line2?: string
  city: string
  county?: string
  postcode: string
  country: 'GB'
}

export type Territory = 'GB' | 'US' // Extensible for future markets

// ─── Currency ─────────────────────────────────────────────────────────────────

export type Currency = 'GBP' | 'USD' | 'EUR'

export interface Money {
  amount: number
  currency: Currency
}

// ─── File attachments ─────────────────────────────────────────────────────────

export interface FileAttachment {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  url: string
  uploadedAt: Date
  uploadedBy: string
}

export type DocumentType =
  | 'INVOICE'
  | 'QUOTE'
  | 'SPECIFICATION'
  | 'FINANCIAL_STATEMENT'
  | 'BANK_STATEMENT'
  | 'TAX_RETURN'
  | 'IDENTITY_DOCUMENT'
  | 'PROOF_OF_ADDRESS'
  | 'COMPANY_ACCOUNTS'
  | 'ASSET_VALUATION'
  | 'INSURANCE_CERTIFICATE'
  | 'OTHER'
