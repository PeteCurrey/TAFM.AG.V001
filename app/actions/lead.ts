'use server'

import { z } from 'zod'
import { logger } from '@/lib/logging'
import { rateLimit } from '@/lib/security/rateLimit'
import { headers } from 'next/headers'

// ─── Lead capture server action ───────────────────────────────────────────────
// Used by: /for-suppliers, /for-lenders

const leadSchema = z.object({
  companyName:  z.string().min(1, 'Company name is required').max(200),
  contactName:  z.string().min(1, 'Contact name is required').max(100),
  email:        z.string().email('A valid email address is required'),
  role:         z.string().max(100).optional(),
  type:         z.enum(['supplier', 'lender']),
  message:      z.string().max(2000).optional(),
})

export type LeadFormState = {
  status: 'idle' | 'success' | 'error' | 'rate_limited'
  errors?: Partial<Record<keyof z.infer<typeof leadSchema>, string>>
  message?: string
}

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })
  if (!limit.allowed) {
    return { status: 'rate_limited', message: 'Too many submissions. Please try again later.' }
  }

  const raw = {
    companyName: formData.get('companyName'),
    contactName: formData.get('contactName'),
    email:       formData.get('email'),
    role:        formData.get('role') || undefined,
    type:        formData.get('type'),
    message:     formData.get('message') || undefined,
  }

  const result = leadSchema.safeParse(raw)

  if (!result.success) {
    const fieldErrors: LeadFormState['errors'] = {}
    for (const [field, messages] of Object.entries(result.error.flatten().fieldErrors)) {
      fieldErrors[field as keyof typeof fieldErrors] = messages?.[0]
    }
    return { status: 'error', errors: fieldErrors }
  }

  const { companyName, contactName, email, role, type, message } = result.data

  logger.audit('Lead registration received', {
    type,
    hasRole: !!role,
    hasMessage: !!message,
  })

  try {
    const { db } = await import('@/lib/db/client')
    const lead = await db.lead.create({
      data: {
        companyName,
        contactName,
        email,
        role,
        type,
        message,
        status: 'NEW',
        source: type === 'supplier' ? 'FOR_SUPPLIERS' : type === 'lender' ? 'FOR_LENDERS' : 'FOR_PROVIDERS',
        ipAddress: ip,
      },
    })

    logger.info('Lead persisted', {
      leadId:  lead.id,
      type,
      company: companyName,
    }, 'integration')
  } catch (err) {
    // Non-fatal — log and continue; lead is still captured in audit log
    logger.warn('Lead DB write failed', {
      error: err instanceof Error ? err.message : String(err),
    }, 'integration')
  }

  // TODO: Send notification email when RESEND_API_KEY is configured.

  return {
    status: 'success',
    message: type === 'supplier'
      ? 'Thank you for your interest. Our supplier team will be in touch to discuss the next steps.'
      : 'Thank you for your interest. Our partnerships team will be in touch to discuss the opportunity.',
  }
}
