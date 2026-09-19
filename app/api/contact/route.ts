import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logging'
import { rateLimit } from '@/lib/security/rateLimit'

// ─── Contact API route ─────────────────────────────────────────────────────────
//
// POST /api/contact
// Accepts contact form submissions. Validates, rate-limits, logs.
// Future: write to DB leads table, trigger email notification.

const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName:  z.string().min(1).max(100),
  email:     z.string().email(),
  company:   z.string().max(200).optional(),
  reason:    z.enum(['business', 'supplier', 'lender', 'general', 'other']).optional(),
  message:   z.string().min(10).max(3000),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`api:contact:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 })

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000)) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { firstName, lastName, email, reason, message, company } = result.data

  logger.audit('Contact submission via API', {
    reason: reason ?? 'not_specified',
    hasCompany: !!company,
    messageLength: message.length,
  })

  logger.info('Contact API — enquiry received', {
    from: `${firstName} ${lastName}`,
    email,
    reason: reason ?? 'not_specified',
  }, 'integration')

  // TODO: DB write when connected. TODO: email notification when RESEND configured.

  return NextResponse.json({
    success: true,
    message: 'Your enquiry has been received.',
  })
}
