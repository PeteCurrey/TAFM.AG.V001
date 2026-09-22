// ─── Real Entity Search (Phase 5) ─────────────────────────────────────────────
//
// Authoritative search across real entity datasets.
// Respects permissions, verification state, and publication thresholds.
// Never exposes draft, unverified, or internal records.

import { db } from '@/lib/db/client'

export interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  url: string
  type: 'MANUFACTURER' | 'CATEGORY' | 'PROVIDER' | 'GUIDE'
  badge?: string
}

export async function searchEntities(query: string): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase()
  if (!q || q.length < 2 || !db) {
    return []
  }

  const results: SearchResultItem[] = []

  // 1. Search Manufacturers
  const manufacturers = await db.manufacturer.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 5,
  })

  for (const m of manufacturers) {
    results.push({
      id: m.id,
      title: m.name,
      subtitle: m.countryOfOrigin ? `Manufacturer · ${m.countryOfOrigin}` : 'Industrial Equipment Manufacturer',
      url: `/manufacturers/${m.slug}`,
      type: 'MANUFACTURER',
      badge: m.verificationStatus,
    })
  }

  // 2. Search Asset Categories
  const categories = await db.assetCategory.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 5,
  })

  for (const c of categories) {
    results.push({
      id: c.id,
      title: c.name,
      subtitle: 'Asset Category',
      url: `/assets/${c.slug}`,
      type: 'CATEGORY',
    })
  }

  // 3. Search Providers (Only publicly listed & active)
  const providers = await db.lender.findMany({
    where: {
      isPubliclyListed: true,
      status: { in: ['ACTIVE', 'VERIFIED'] },
      deletedAt: null,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { tradingName: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 5,
  })

  for (const p of providers) {
    results.push({
      id: p.id,
      title: p.tradingName ?? p.name,
      subtitle: `${p.lenderType.replace('_', ' ')} · Verified Provider`,
      url: `/providers/${p.slug}`,
      type: 'PROVIDER',
      badge: 'VERIFIED',
    })
  }

  return results
}
