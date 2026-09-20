'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { db } from '@/lib/db/client'
import { rateLimit } from '@/lib/security/rateLimit'
import { auditService } from '@/lib/audit'
import { logger } from '@/lib/logging'

// ─── Provider application server action ────────────────────────────────────────
//
// Captures "Become a TAFM Provider" form submissions.
// Writes to provider_applications table.
// Does NOT automatically create a Lender record.
// Human review is REQUIRED before any provider is made active.

const schema = z.object({
  companyName:     z.string().min(2).max(200),
  companyNumber:   z.string().max(20).optional(),
  contactName:     z.string().min(2).max(100),
  contactEmail:    z.string().email(),
  contactPhone:    z.string().max(30).optional(),
  website:         z.string().url().optional().or(z.literal('')),
  providerType:    z.enum(['BANK', 'SPECIALIST_LENDER', 'ASSET_FINANCE_PROVIDER', 'BROKER', 'MANUFACTURER_FINANCE', 'DEALER_FINANCE', 'OTHER']),
  description:     z.string().max(2000).optional(),
  financeProducts: z.array(z.string()).default([]),
  assetSpecialisms: z.array(z.string()).default([]),
  geographyUK:     z.boolean().default(true),
  geographyNotes:  z.string().max(500).optional(),
  typicalDealMin:  z.number().positive().optional(),
  typicalDealMax:  z.number().positive().optional(),
})

export type ProviderApplicationFormState = {
  status: 'idle' | 'success' | 'error' | 'rate_limited'
  errors?: Partial<Record<string, string>>
  message?: string
  reference?: string
}

export async function submitProviderApplication(
  _prev: ProviderApplicationFormState,
  formData: FormData,
): Promise<ProviderApplicationFormState> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  const limit = rateLimit(`provider-application:${ip}`, { limit: 3, windowMs: 24 * 60 * 60 * 1000 })
  if (!limit.allowed) {
    return { status: 'rate_limited', message: 'Too many applications submitted. Please try again tomorrow.' }
  }

  // Parse multi-value fields
  const financeProducts = formData.getAll('financeProducts').map(String).filter(Boolean)
  const assetSpecialisms = formData.getAll('assetSpecialisms').map(String).filter(Boolean)

  const raw = {
    companyName:     formData.get('companyName'),
    companyNumber:   formData.get('companyNumber') || undefined,
    contactName:     formData.get('contactName'),
    contactEmail:    formData.get('contactEmail'),
    contactPhone:    formData.get('contactPhone') || undefined,
    website:         formData.get('website') || undefined,
    providerType:    formData.get('providerType'),
    description:     formData.get('description') || undefined,
    financeProducts,
    assetSpecialisms,
    geographyUK:     formData.get('geographyUK') === 'true',
    geographyNotes:  formData.get('geographyNotes') || undefined,
    typicalDealMin:  formData.get('typicalDealMin') ? Number(formData.get('typicalDealMin')) : undefined,
    typicalDealMax:  formData.get('typicalDealMax') ? Number(formData.get('typicalDealMax')) : undefined,
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [field, messages] of Object.entries(result.error.flatten().fieldErrors)) {
      fieldErrors[field] = messages?.[0] ?? 'Invalid value'
    }
    return { status: 'error', errors: fieldErrors }
  }

  const data = result.data

  try {
    const application = await db.providerApplication.create({
      data: {
        companyName:     data.companyName,
        companyNumber:   data.companyNumber,
        contactName:     data.contactName,
        contactEmail:    data.contactEmail,
        contactPhone:    data.contactPhone,
        website:         data.website || null,
        providerType:    data.providerType,
        description:     data.description,
        financeProducts: data.financeProducts,
        assetSpecialisms: data.assetSpecialisms,
        geographyUK:     data.geographyUK,
        geographyNotes:  data.geographyNotes,
        typicalDealMin:  data.typicalDealMin,
        typicalDealMax:  data.typicalDealMax,
        currency:        'GBP',
        status:          'SUBMITTED',
      },
    })

    await auditService.log({
      action:   'SUBMIT',
      entity:   'ProviderApplication',
      entityId: application.id,
      after:    { reference: application.reference, company: data.companyName, status: 'SUBMITTED' },
      ipAddress: ip,
    })

    logger.info('Provider application submitted', {
      reference:   application.reference,
      company:     data.companyName,
      type:        data.providerType,
    }, 'integration')

    return {
      status:    'success',
      reference: application.reference,
      message:   'Your application has been received. Our team will review it and be in touch. Applications are subject to verification before any provider is listed on TAFM.',
    }
  } catch (err) {
    logger.warn('Provider application failed', {
      company: data.companyName,
      error:   err instanceof Error ? err.message : String(err),
    }, 'integration')
    return { status: 'error', message: 'Unable to submit your application. Please try again.' }
  }
}
