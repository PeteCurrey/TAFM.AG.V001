// ─── Entity normalisation ──────────────────────────────────────────────────────
//
// Prevents "Caterpillar 320", "CAT 320", "Cat 320 Next Gen"
// being treated as three unrelated concepts.
//
// Strategy:
//   1. Canonical slug generation (lowercase, no punctuation, hyphenated)
//   2. Manufacturer alias resolution (DB lookup on aliases[] field)
//   3. Duplicate detection before insert

import { db } from '@/lib/db/client'
import { logger } from '@/lib/logging'

// ─── Slug generation ──────────────────────────────────────────────────────────

/**
 * Generate a canonical URL slug from a raw string.
 * Consistent across manufacturer names, model names, and categories.
 * e.g. "JCB 3CX Backhoe Loader" → "jcb-3cx-backhoe-loader"
 */
export function toSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '')           // trim leading/trailing hyphens
}

export function normaliseManufacturerName(name: string): { canonical: string; slug: string } {
  const canonical = name.trim()
  const slug = toSlug(canonical)
  return { canonical, slug }
}

// ─── Manufacturer resolution ──────────────────────────────────────────────────

export interface ManufacturerResolution {
  id:         string
  name:       string
  slug:       string
  confidence: 'EXACT' | 'ALIAS' | 'FUZZY' | 'NOT_FOUND'
  matchedOn?: string // which field or alias matched
}

/**
 * Resolve a raw manufacturer name to a canonical Manufacturer record.
 *
 * Lookup order:
 * 1. Exact name match (case-insensitive)
 * 2. Slug match
 * 3. Alias array match (e.g. "CAT" → Caterpillar)
 *
 * Returns NOT_FOUND if no match — never fabricates a manufacturer.
 */
export async function resolveManufacturer(
  rawName: string,
): Promise<ManufacturerResolution> {
  if (!rawName?.trim()) {
    return { id: '', name: '', slug: '', confidence: 'NOT_FOUND' }
  }

  const normalised = rawName.trim()
  const slug = toSlug(normalised)

  // 1. Exact name (case-insensitive)
  const byName = await db.manufacturer.findFirst({
    where: { name: { equals: normalised, mode: 'insensitive' }, isActive: true },
  })
  if (byName) {
    return { id: byName.id, name: byName.name, slug: byName.slug, confidence: 'EXACT', matchedOn: 'name' }
  }

  // 2. Slug match
  const bySlug = await db.manufacturer.findFirst({
    where: { slug, isActive: true },
  })
  if (bySlug) {
    return { id: bySlug.id, name: bySlug.name, slug: bySlug.slug, confidence: 'EXACT', matchedOn: 'slug' }
  }

  // 3. Alias match — check if any manufacturer's aliases array contains this name
  const upper = normalised.toUpperCase()
  const byAlias = await db.manufacturer.findFirst({
    where: {
      isActive: true,
      aliases: { has: upper },
    },
  })
  if (byAlias) {
    logger.info('Manufacturer resolved via alias', {
      rawName: normalised,
      resolvedTo: byAlias.name,
      alias: upper,
    }, 'integration')
    return {
      id: byAlias.id, name: byAlias.name, slug: byAlias.slug,
      confidence: 'ALIAS', matchedOn: `alias:${upper}`,
    }
  }

  // Also try the raw casing in aliases
  const byAliasRaw = await db.manufacturer.findFirst({
    where: {
      isActive: true,
      aliases: { has: normalised },
    },
  })
  if (byAliasRaw) {
    return {
      id: byAliasRaw.id, name: byAliasRaw.name, slug: byAliasRaw.slug,
      confidence: 'ALIAS', matchedOn: `alias:${normalised}`,
    }
  }

  return { id: '', name: normalised, slug, confidence: 'NOT_FOUND' }
}

// ─── Duplicate detection ──────────────────────────────────────────────────────

/**
 * Check if a Manufacturer record already exists by name or slug.
 * Call before creating a new record during import.
 */
export async function findDuplicateManufacturer(
  name: string,
): Promise<{ exists: boolean; existingId?: string; existingSlug?: string }> {
  const slug = toSlug(name)
  const existing = await db.manufacturer.findFirst({
    where: {
      OR: [
        { name: { equals: name, mode: 'insensitive' } },
        { slug },
      ],
    },
  })

  if (existing) {
    return { exists: true, existingId: existing.id, existingSlug: existing.slug }
  }
  return { exists: false }
}

/**
 * Check for a duplicate market observation.
 * Same asset + source + observedAt + value = likely duplicate.
 */
export async function findDuplicateMarketObservation(opts: {
  assetId?:    string
  manufacturerId?: string
  modelId?:    string
  sourceUrl?:  string
  observedAt:  Date
  value:       number
}): Promise<boolean> {
  const count = await db.marketObservation.count({
    where: {
      assetId:        opts.assetId,
      manufacturerId: opts.manufacturerId,
      modelId:        opts.modelId,
      sourceUrl:      opts.sourceUrl,
      observedAt:     opts.observedAt,
      observedValue:  opts.value,
    },
  })
  return count > 0
}
