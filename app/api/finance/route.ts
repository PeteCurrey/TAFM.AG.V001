import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security/rateLimit'
import { validate, calculatorInputSchema } from '@/lib/validation'
import { calculate } from '@/lib/finance/calculator'

// ─── Finance API routes ────────────────────────────────────────────────────────

// POST /api/finance/calculate — Illustrative finance calculation
export async function POST(req: NextRequest) {
  // Rate limiting — finance calculations are server-side for security
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const rateLimitResult = rateLimit(`finance:${ip}`, { limit: 30, windowMs: 60_000 })
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', resetAt: rateLimitResult.resetAt },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { data: input, errors } = validate(calculatorInputSchema, body)

  if (errors) {
    return NextResponse.json(
      { error: 'Validation failed', issues: errors.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const result = calculate(input!)

    return NextResponse.json({
      data: result,
      meta: {
        status: 'CALCULATED',
        disclaimer:
          'This result is an illustrative estimate only. It does not represent a finance offer, approved rate or commitment from any lender.',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Calculation failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 422 },
    )
  }
}
