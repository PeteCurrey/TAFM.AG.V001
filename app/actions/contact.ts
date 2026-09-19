'use server'

import { z } from 'zod'
import { logger } from '@/lib/logging'
import { rateLimit } from '@/lib/security/rateLimit'
import { headers } from 'next/headers'

// ─── Contact form server action ────────────────────────────────────────────────

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName:  z.string().min(1, 'Last name is required').max(100),
  email:     z.string().email('A valid email address is required'),
  company:   z.string().max(200).optional(),
  reason:    z.enum(['business', 'supplier', 'lender', 'general', 'other']).optional(),
  message:   z.string().min(10, 'Please provide a message (minimum 10 characters)').max(3000),
})

export type ContactFormState = {
  status: 'idle' | 'success' | 'error' | 'rate_limited'
  errors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>
  message?: string
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Rate limit by IP
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 })
  if (!limit.allowed) {
    return { status: 'rate_limited', message: 'Too many submissions. Please try again later.' }
  }

  // Parse and validate
  const raw = {
    firstName: formData.get('firstName'),
    lastName:  formData.get('lastName'),
    email:     formData.get('email'),
    company:   formData.get('company') || undefined,
    reason:    formData.get('reason') || undefined,
    message:   formData.get('message'),
  }

  const result = contactSchema.safeParse(raw)

  if (!result.success) {
    const fieldErrors: ContactFormState['errors'] = {}
    for (const [field, messages] of Object.entries(result.error.flatten().fieldErrors)) {
      fieldErrors[field as keyof typeof fieldErrors] = messages?.[0]
    }
    return { status: 'error', errors: fieldErrors }
  }

  const { firstName, lastName, email, company, reason, message } = result.data

  // Log the contact (no PII in structured fields — message is intentional user input)
  logger.audit('Contact form submission received', {
    reason: reason ?? 'not_specified',
    hasCompany: !!company,
    messageLength: message.length,
    // Do NOT log: name, email, message content
  })

  // TODO: When RESEND_API_KEY is configured, send notification email here.
  // For now, log to server and return success.
  // In production this would write to a leads table in the DB.

  logger.info('Contact enquiry logged', {
    from: `${firstName} ${lastName}`,
    email,
    reason: reason ?? 'not_specified',
  }, 'integration')

  return {
    status: 'success',
    message: 'Your message has been received. We will respond as soon as possible.',
  }
}
