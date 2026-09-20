import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security/rateLimit'
import { z } from 'zod'
import { db } from '@/lib/db/client'

// ─── Search API ────────────────────────────────────────────────────────────────
//
// Basic structured search across public asset taxonomy.
// Only exposes ACTIVE, public records.
// Private, DRAFT, deleted records are excluded.
// No authentication required for public search — but permissions checked for
// any protected entities (none yet in Phase 3).

const searchSchema = z.object({
  q:        z.string().min(1).max(200),
  type:     z.enum(['all', 'categories', 'manufacturers', 'finance_types']).default('all'),
  limit:    z.number().int().min(1).max(50).default(20),
})

const FINANCE_TYPES = [
  { id: 'hire-purchase',    label: 'Hire Purchase',    description: 'Business owns asset at end of term' },
  { id: 'finance-lease',    label: 'Finance Lease',    description: 'Lender owns asset; business leases for most of its life' },
  { id: 'operating-lease',  label: 'Operating Lease',  description: 'Short-to-medium term; lender takes residual risk' },
  { id: 'asset-refinance',  label: 'Asset Refinance',  description: 'Release capital from assets already owned' },
]

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limit = rateLimit(`search:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = searchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { q, type, limit: resultLimit } = parsed.data
  const query = q.toLowerCase().trim()

  const results: {
    type:        string
    id:          string
    label:       string
    description?: string
    href:        string
    meta?:       Record<string, string>
  }[] = []

  // ── Asset categories (from DB if available, static fallback)
  if (type === 'all' || type === 'categories') {
    if (db) {
      const cats = await db.assetCategory.findMany({
        where: {
          isActive: true,
          OR: [
            { name:        { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: resultLimit,
        select: { id: true, slug: true, name: true, description: true },
      })
      cats.forEach((c) =>
        results.push({ type: 'category', id: c.id, label: c.name, description: c.description, href: `/assets/${c.slug}` }),
      )
    }
  }

  // ── Manufacturers (from DB)
  if (type === 'all' || type === 'manufacturers') {
    if (db) {
      const mfrs = await db.manufacturer.findMany({
        where: {
          isActive: true,
          name:     { contains: q, mode: 'insensitive' },
        },
        take: resultLimit,
        select: { id: true, slug: true, name: true, countryOfOrigin: true },
      })
      mfrs.forEach((m) =>
        results.push({ type: 'manufacturer', id: m.id, label: m.name, href: `/assets/manufacturer/${m.slug}`, meta: m.countryOfOrigin ? { country: m.countryOfOrigin } : {} }),
      )
    }
  }

  // ── Finance types (static)
  if (type === 'all' || type === 'finance_types') {
    FINANCE_TYPES
      .filter((f) => f.label.toLowerCase().includes(query) || f.description.toLowerCase().includes(query))
      .slice(0, resultLimit)
      .forEach((f) =>
        results.push({ type: 'finance_type', id: f.id, label: f.label, description: f.description, href: `/finance/${f.id}` }),
      )
  }

  return NextResponse.json({
    query: q,
    count: results.length,
    results: results.slice(0, resultLimit),
  })
}
