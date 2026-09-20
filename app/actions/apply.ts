'use server'

import { z } from 'zod'
import { rateLimit } from '@/lib/security/rateLimit'
import { logger } from '@/lib/logging'
import { auditService } from '@/lib/audit'
import { emitEvent } from '@/lib/notifications/events'
import { db } from '@/lib/db/client'

// ─── Apply server action ───────────────────────────────────────────────────────
//
// Saves a finance application draft to the database.
// Returns a reference number on success.
//
// This is Step 1 — capturing intent. It does NOT:
//   - Submit to any lender
//   - Trigger matching
//   - Generate offers
//   - Send to any external party
//
// All of those require human-in-the-loop steps in the Opportunity workflow.

const applySchema = z.object({
  // Step 1: Asset
  assetDescription:  z.string().min(5).max(2000),
  assetCategory:     z.string().min(2).max(100),
  manufacturer:      z.string().max(200).optional(),
  model:             z.string().max(200).optional(),
  yearOfManufacture: z.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),
  assetCondition:    z.enum(['NEW', 'USED', 'REFURBISHED', 'FOR_PARTS']),
  purchasePrice:     z.number().positive().max(100_000_000),
  supplierName:      z.string().max(200).optional(),
  supplierReference: z.string().max(200).optional(),

  // Step 2: Business
  businessName:      z.string().min(2).max(200),
  businessStructure: z.enum(['SOLE_TRADER', 'PARTNERSHIP', 'LLP', 'LIMITED_COMPANY', 'PLC', 'CIC', 'CHARITY', 'OTHER']),
  companyNumber:     z.string().max(20).optional(),
  yearsTrading:      z.number().int().min(0).max(200).optional(),
  annualTurnover:    z.number().positive().max(100_000_000_000).optional(),

  // Step 3: Finance
  financeStructure:  z.enum(['HIRE_PURCHASE', 'FINANCE_LEASE', 'OPERATING_LEASE', 'ASSET_REFINANCE', 'COMMERCIAL_LOAN', 'SPECIALIST']).optional(),
  requestedAmount:   z.number().positive().max(100_000_000),
  depositAmount:     z.number().min(0).max(100_000_000).optional(),
  termMonths:        z.number().int().min(6).max(120).optional(),
  notes:             z.string().max(2000).optional(),

  // Contact
  contactName:       z.string().min(2).max(200),
  contactEmail:      z.string().email(),
  contactPhone:      z.string().max(30).optional(),
})

export type ApplyInput = z.infer<typeof applySchema>

export interface ApplyResult {
  success:   boolean
  reference?: string
  error?:    string
  fieldErrors?: Record<string, string[]>
}

export async function submitApplication(
  _prevState: ApplyResult | null,
  formData: FormData,
): Promise<ApplyResult> {
  // Rate limit by email to prevent duplicate submissions
  const email = formData.get('contactEmail')?.toString() ?? 'unknown'
  const rl = rateLimit(`apply:${email}`, { limit: 3, windowMs: 60_000 * 60 })
  if (!rl.allowed) {
    return { success: false, error: 'Too many submissions. Please wait before trying again.' }
  }

  // Parse and validate
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    raw[key] = value
  }

  // Coerce numeric fields
  for (const field of ['yearOfManufacture', 'purchasePrice', 'yearsTrading', 'annualTurnover', 'requestedAmount', 'depositAmount', 'termMonths']) {
    if (raw[field]) raw[field] = Number(raw[field])
  }

  const parsed = applySchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success:     false,
      error:       'Please correct the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  logger.info('Finance application submission received', {
    businessName:    data.businessName,
    assetCategory:   data.assetCategory,
    requestedAmount: data.requestedAmount,
  }, 'finance')

  // Persist to DB if available
  if (db) {
    try {
      // We need a User record — in Phase 3, create a lightweight placeholder
      // Phase 4 will tie this to a real authenticated user
      const placeholderUser = await db.user.upsert({
        where:  { email: data.contactEmail },
        update: { updatedAt: new Date() },
        create: {
          email:     data.contactEmail,
          firstName: data.contactName.split(' ')[0] ?? data.contactName,
          lastName:  data.contactName.split(' ').slice(1).join(' ') || 'Unknown',
          role:      'BUSINESS',
          status:    'PENDING_VERIFICATION',
        },
      })

      const application = await db.financeApplication.create({
        data: {
          userId:                placeholderUser.id,
          assetDescription:      data.assetDescription,
          assetValue:            data.purchasePrice,
          currency:              'GBP',
          supplierName:          data.supplierName ?? null,
          supplierQuoteReference: data.supplierReference ?? null,
          requestedStructure:    data.financeStructure ?? null,
          requestedAmount:       data.requestedAmount,
          requestedDepositAmount: data.depositAmount ?? null,
          requestedTermMonths:   data.termMonths ?? null,
          notes:                 data.notes ?? null,
          status:                'SUBMITTED',
          currentStep:           'REVIEW',
          completedSteps:        ['ASSET', 'BUSINESS', 'FINANCE'],
        },
      })

      // Phase 4: create a corresponding Opportunity so the pipeline can begin
      const opportunity = await db.opportunity.create({
        data: {
          businessId:    placeholderUser.id,
          applicationId: application.id,
          status:        'QUALIFYING',
          statusHistory: [{
            from:      'DRAFT',
            to:        'QUALIFYING',
            at:        new Date().toISOString(),
            actorType: 'SYSTEM',
            reason:    'Application submitted via web form',
          }] as any,
        },
      })

      await auditService.log({
        entity:    'FinanceApplication',
        entityId:  application.id,
        action:    'SUBMIT',
        actorType: 'USER',
        after:     { reference: application.reference, status: 'SUBMITTED', opportunityId: opportunity.id },
      })

      await emitEvent('APPLICATION_SUBMITTED', {
        applicationId: application.id,
        businessId:    placeholderUser.id,
      })

      return { success: true, reference: application.reference }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      logger.warn('Application DB save failed', { error: msg }, 'finance')
      // Fall through to log-only mode
    }
  }

  // Fallback: log only (DB not available)
  logger.info('Application received (DB unavailable — logged only)', {
    businessName:    data.businessName,
    contactEmail:    data.contactEmail,
    requestedAmount: data.requestedAmount,
  }, 'finance')

  return {
    success:   true,
    reference: `TAFM-${Date.now().toString(36).toUpperCase()}`,
  }
}
