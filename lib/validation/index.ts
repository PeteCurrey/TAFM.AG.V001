import { z } from 'zod'

// ─── Validation library ───────────────────────────────────────────────────────
//
// Centralised Zod schemas for all API inputs.
// All API routes must validate through this library — never trust raw input.

// ─── Common schemas ───────────────────────────────────────────────────────────

export const ukCurrencySchema = z
  .number()
  .positive('Amount must be greater than zero')
  .max(100_000_000, 'Amount exceeds maximum supported value')

export const ukPostcodeSchema = z
  .string()
  .regex(
    /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i,
    'Enter a valid UK postcode',
  )
  .transform((v) => v.toUpperCase().replace(/\s+/g, ' ').trim())

export const companyNumberSchema = z
  .string()
  .regex(/^[0-9A-Z]{6,8}$/i, 'Enter a valid Companies House number')

export const uuidSchema = z.string().uuid('Invalid ID format')

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only')
  .min(2)
  .max(120)

export const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// ─── Finance calculator validation ───────────────────────────────────────────

export const calculatorInputSchema = z.object({
  assetValue:  z.number().positive('Asset value must be greater than zero').max(100_000_000),
  deposit:     z.number().min(0, 'Deposit cannot be negative'),
  termMonths:  z.number().int().min(6, 'Term must be at least 6 months').max(84, 'Term cannot exceed 84 months'),
  annualRate:  z.number().min(0).max(1, 'Rate must be between 0 and 1'),
  balloonAmount: z.number().min(0).optional(),
}).refine(
  (data) => data.deposit < data.assetValue,
  { message: 'Deposit must be less than asset value', path: ['deposit'] },
)

// ─── Finance application validation ──────────────────────────────────────────

export const financeApplicationSchema = z.object({
  // Asset
  assetCategory:    z.string().min(1, 'Asset category is required'),
  assetDescription: z.string().min(10, 'Please provide a description of the asset').max(2000),
  assetValue:       z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid asset value'),
  supplierName:     z.string().max(255).optional(),

  // Business
  businessName:     z.string().min(2, 'Business name is required').max(255),
  businessType:     z.enum(['SOLE_TRADER', 'PARTNERSHIP', 'LLP', 'LIMITED_COMPANY', 'PLC', 'OTHER']),
  companyNumber:    z.string().optional(),
  yearsTrading:     z.string().regex(/^\d+$/, 'Enter a whole number').optional(),

  // Contact
  contactEmail:     z.string().email('Enter a valid email address'),
  contactPhone:     z.string().regex(/^(\+44|0)[0-9\s\-]{9,14}$/, 'Enter a valid UK phone number').optional(),

  // Finance
  financeType:      z.enum(['HIRE_PURCHASE', 'FINANCE_LEASE', 'OPERATING_LEASE', 'ASSET_REFINANCE', 'COMMERCIAL_LOAN', 'SPECIALIST']).optional(),
  financeAmount:    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid finance amount'),
  deposit:          z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid deposit amount').optional(),
  termMonths:       z.string().optional(),
  notes:            z.string().max(2000).optional(),
})

export type FinanceApplicationInput = z.infer<typeof financeApplicationSchema>

// ─── Contact form validation ──────────────────────────────────────────────────

export const contactFormSchema = z.object({
  firstName:  z.string().min(1, 'First name is required').max(100),
  lastName:   z.string().min(1, 'Last name is required').max(100),
  email:      z.string().email('Enter a valid email address'),
  company:    z.string().max(255).optional(),
  reason:     z.enum(['business', 'supplier', 'lender', 'general', 'other']).optional(),
  message:    z.string().min(10, 'Please enter your message').max(5000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

// ─── Validation helper ────────────────────────────────────────────────────────

/**
 * Parse and validate with a Zod schema.
 * Returns { data, errors } — never throws.
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
): { data: T; errors: null } | { data: null; errors: z.ZodError } {
  const result = schema.safeParse(input)
  if (result.success) {
    return { data: result.data, errors: null }
  }
  return { data: null, errors: result.error }
}
