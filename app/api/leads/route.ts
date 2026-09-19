import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logging'
import { rateLimit } from '@/lib/security/rateLimit'

// ─── Leads API route ───────────────────────────────────────────────────────────
//
// POST /api/leads
// Accepts supplier/lender interest registrations.
// Validates, rate-limits, logs. Future: writes to DB leads table.

const leadSchema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(100),
  email:       z.string().email(),
  role:        z.string().max(100).optional(),
  type:        z.enum(['supplier', 'lender']),
  message:     z.string().max(2000).optional(),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`api:leads:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })

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

  const result = leadSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { companyName, contactName, email, role, type, message } = result.data

  logger.audit('Lead registration via API', { type, hasRole: !!role, hasMessage: !!message })

  logger.info('Lead API — registration received', {
    type,
    company: companyName,
    contact: contactName,
    email,
  }, 'integration')

  // TODO: Write to leads table when DB is connected.
  // TODO: Trigger notification email when RESEND_API_KEY is configured.

  return NextResponse.json({
    success: true,
    message: type === 'supplier'
      ? 'Thank you. Our supplier team will be in touch.'
      : 'Thank you. Our partnerships team will be in touch.',
  })
}
