import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security/rateLimit'
import { validate, paginationSchema } from '@/lib/validation'
import { z } from 'zod'

// ─── Assets API route ──────────────────────────────────────────────────────────
//
// Returns asset data. Currently returns empty set with metadata.
// When the database is populated with real assets, this route will query Prisma.
// Rate-limited to prevent scraping.

const assetQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).optional(),
  search: z.string().max(200).optional(),
})

export async function GET(req: NextRequest) {
  // Rate limiting — key from IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const rateLimitResult = rateLimit(`assets:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', resetAt: rateLimitResult.resetAt },
      { status: 429 },
    )
  }

  // Parse and validate query parameters
  const searchParams = Object.fromEntries(req.nextUrl.searchParams)
  const { data: query, errors } = validate(assetQuerySchema, {
    page: searchParams.page ?? 1,
    limit: searchParams.limit ?? 20,
    category: searchParams.category,
    condition: searchParams.condition,
    search: searchParams.search,
  })

  if (errors) {
    return NextResponse.json(
      { error: 'Invalid query parameters', issues: errors.flatten().fieldErrors },
      { status: 400 },
    )
  }

  // TODO: Replace with real Prisma query when asset data is available:
  // const assets = await prisma.asset.findMany({
  //   where: {
  //     status: 'ACTIVE',
  //     ...(query.category && { category: { slug: query.category } }),
  //     ...(query.condition && { condition: query.condition }),
  //     ...(query.search && { OR: [
  //       { name: { contains: query.search, mode: 'insensitive' } },
  //       { description: { contains: query.search, mode: 'insensitive' } },
  //     ]}),
  //   },
  //   skip: (query.page - 1) * query.limit,
  //   take: query.limit,
  //   orderBy: { createdAt: 'desc' },
  // })

  return NextResponse.json({
    data: [],
    meta: {
      page: query?.page ?? 1,
      limit: query?.limit ?? 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
      status: 'NO_ASSETS_AVAILABLE',
      message: 'The asset marketplace is currently being established. Asset listings will appear here as the platform is populated.',
    },
  })
}
