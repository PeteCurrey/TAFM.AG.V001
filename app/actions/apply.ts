'use server'

import { z } from 'zod'
import { rateLimit } from '@/lib/security/rateLimit'
import { logger } from '@/lib/logging'
import { auditService } from '@/lib/audit'
import { emitEvent } from '@/lib/notifications/events'
import { db } from '@/lib/db/client'
import { getSession, createSession } from '@/lib/auth/session'
import { runMatchingForOpportunity } from '@/lib/matching/run'

// ─── Apply server action (Phase 5) ────────────────────────────────────────────
//
// End-to-end commercial intake action.
// Resolves or creates User, Business Organisation, Asset, FinanceApplication,
// and Opportunity. Executes deterministic provider matching immediately.

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
  success:     boolean
  reference?:  string
  opportunityId?: string
  error?:      string
  fieldErrors?: Record<string, string[]>
}

export async function submitApplication(
  _prevState: ApplyResult | null,
  formData: FormData,
): Promise<ApplyResult> {
  const email = formData.get('contactEmail')?.toString().toLowerCase().trim() ?? 'unknown'
  const rl = rateLimit(`apply:${email}`, { limit: 5, windowMs: 60_000 * 60 })
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
    if (raw[field] !== undefined && raw[field] !== '') raw[field] = Number(raw[field])
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

  if (!db) {
    return {
      success:   true,
      reference: `TAFM-${Date.now().toString(36).toUpperCase()}`,
    }
  }

  try {
    // 1. Resolve or create authenticated User
    const existingSession = await getSession()
    let user = existingSession

    if (!user) {
      user = await db.user.upsert({
        where:  { email: data.contactEmail.toLowerCase().trim() },
        update: {
          firstName: data.contactName.split(' ')[0] ?? data.contactName,
          lastName:  data.contactName.split(' ').slice(1).join(' ') || 'Unknown',
          phone:     data.contactPhone ?? null,
          updatedAt: new Date(),
        },
        create: {
          email:     data.contactEmail.toLowerCase().trim(),
          firstName: data.contactName.split(' ')[0] ?? data.contactName,
          lastName:  data.contactName.split(' ').slice(1).join(' ') || 'Unknown',
          phone:     data.contactPhone ?? null,
          role:      'BUSINESS',
          status:    'ACTIVE',
        },
        include: {
          organisations: { include: { business: true } },
          providerMemberships: { include: { lender: true } },
        },
      })

      // Establish session for the applicant
      await createSession(user.id)
    }

    // 2. Resolve or create Business organisation
    let business = user.organisations[0]?.business
    if (!business) {
      business = await db.business.create({
        data: {
          name:          data.businessName,
          structure:     data.businessStructure,
          companyNumber: data.companyNumber ?? null,
          yearsTrading:  data.yearsTrading ?? null,
          annualTurnover: data.annualTurnover ? data.annualTurnover : null,
          contactEmail:  data.contactEmail,
          contactPhone:  data.contactPhone ?? null,
          ownerId:       user.id,
          status:        'ACTIVE',
          dataOrigin:    'REAL_EXTERNAL',
        },
      })

      await db.organisationMembership.create({
        data: {
          userId:     user.id,
          businessId: business.id,
          role:       'OWNER',
        },
      })

      await db.user.update({
        where: { id: user.id },
        data:  { businessId: business.id },
      })
    }

    // 3. Resolve AssetCategory
    let category = await db.assetCategory.findUnique({
      where: { slug: data.assetCategory },
    })

    if (!category) {
      category = await db.assetCategory.findFirst({
        where: { name: { equals: data.assetCategory, mode: 'insensitive' } },
      })
    }

    // Default category if unmatched
    if (!category) {
      category = await db.assetCategory.upsert({
        where:  { slug: 'commercial-equipment' },
        update: {},
        create: {
          slug:        'commercial-equipment',
          name:        'Commercial Equipment',
          description: 'General commercial equipment and business machinery',
        },
      })
    }

    // 4. Create Asset record
    const asset = await db.asset.create({
      data: {
        name:              data.assetDescription.slice(0, 100),
        description:       data.assetDescription,
        categoryId:        category.id,
        yearOfManufacture: data.yearOfManufacture ?? null,
        condition:         data.assetCondition,
        isNew:             data.assetCondition === 'NEW',
        purchasePrice:     data.purchasePrice,
        currency:          'GBP',
        status:            'PENDING_REVIEW',
        dataOrigin:        'REAL_EXTERNAL',
      },
    })

    // 5. Create FinanceApplication
    const application = await db.financeApplication.create({
      data: {
        userId:                 user.id,
        businessId:             business.id,
        assetId:                asset.id,
        assetDescription:       data.assetDescription,
        assetValue:             data.purchasePrice,
        currency:               'GBP',
        supplierName:           data.supplierName ?? null,
        supplierQuoteReference: data.supplierReference ?? null,
        requestedStructure:     data.financeStructure ?? null,
        requestedAmount:        data.requestedAmount,
        requestedDepositAmount: data.depositAmount ?? null,
        requestedTermMonths:    data.termMonths ?? null,
        notes:                  data.notes ?? null,
        status:                 'SUBMITTED',
        currentStep:            'REVIEW',
        completedSteps:         ['ASSET', 'BUSINESS', 'FINANCE'],
        submittedAt:            new Date(),
        dataOrigin:             'REAL_EXTERNAL',
      },
    })

    // 6. Create Opportunity linked to Business organisation
    const opportunity = await db.opportunity.create({
      data: {
        businessId:    business.id,
        applicationId: application.id,
        assetId:       asset.id,
        status:        'QUALIFYING',
        dataOrigin:    'REAL_EXTERNAL',
        statusHistory: [{
          from:      'DRAFT',
          to:        'QUALIFYING',
          at:        new Date().toISOString(),
          actorId:   user.id,
          actorType: 'USER',
          reason:    'Finance requirement submitted via portal',
        }] as any,
      },
    })

    // 7. Execute deterministic matching
    try {
      await runMatchingForOpportunity(opportunity.id)
    } catch (matchingErr) {
      logger.warn('Matching execution deferred', {
        opportunityId: opportunity.id,
        error: matchingErr instanceof Error ? matchingErr.message : String(matchingErr),
      }, 'finance')
    }

    await auditService.log({
      entity:    'FinanceApplication',
      entityId:  application.id,
      action:    'SUBMIT',
      actorId:   user.id,
      actorType: 'USER',
      after: {
        reference: application.reference,
        status: 'SUBMITTED',
        opportunityId: opportunity.id,
        businessId: business.id,
      },
    })

    await emitEvent('APPLICATION_SUBMITTED', {
      applicationId: application.id,
      businessId:    business.id,
    })

    await emitEvent('FINANCE_REQUEST_CREATED', {
      opportunityId:    opportunity.id,
      businessId:       business.id,
      assetDescription: data.assetDescription,
    })

    return {
      success:       true,
      reference:     application.reference,
      opportunityId: opportunity.id,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.warn('Application DB transaction failed', { error: msg }, 'finance')
    return {
      success: false,
      error:   'Unable to process application at this moment. Please check details and try again.',
    }
  }
}
