import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security/rateLimit'
import { isAIAvailable } from '@/lib/ai/provider'
import { runAssetIntelligence } from '@/lib/intelligence/pipeline'
import { z } from 'zod'

// ─── Image analysis endpoint ───────────────────────────────────────────────────
//
// Accepts a base64-encoded image and runs the vision pipeline.
// cannotIdentify: true is a valid, handled outcome — not an error.

const inputSchema = z.object({
  base64Data: z.string().min(100, 'Image data required'),
  mimeType:   z.enum(['image/jpeg', 'image/png', 'image/webp']),
  description: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`ai-image:${ip}`, { limit: 5, windowMs: 60_000 })
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
    kind:        'image',
    base64Data:  parsed.data.base64Data,
    mimeType:    parsed.data.mimeType,
    description: parsed.data.description,
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
