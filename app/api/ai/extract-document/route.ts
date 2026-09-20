import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security/rateLimit'
import { isAIAvailable } from '@/lib/ai/provider'
import { runAssetIntelligence } from '@/lib/intelligence/pipeline'
import { z } from 'zod'

// ─── Document extraction endpoint ─────────────────────────────────────────────
//
// Accepts text content of an uploaded document and extracts structured fields.
// The document is NOT authenticated — all output requires verification.

const inputSchema = z.object({
  textContent: z.string().min(20, 'Document content required').max(10_000),
  filename:    z.string().max(255).optional(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`ai-document:${ip}`, { limit: 5, windowMs: 60_000 })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests', resetAt: limit.resetAt }, { status: 429 })
  }

  if (!isAIAvailable()) {
    return NextResponse.json({ error: 'AI service not configured', status: 'UNAVAILABLE' }, { status: 503 })
  }

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }

  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const result = await runAssetIntelligence({
    kind:        'document',
    textContent: parsed.data.textContent,
    filename:    parsed.data.filename,
  })

  return NextResponse.json({
    data: result,
    meta: {
      jobId:          result.jobId,
      status:         result.success ? 'COMPLETED' : 'FAILED',
      requiresReview: true,
      disclaimer:     result.disclaimer,
    },
  })
}
