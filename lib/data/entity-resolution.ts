// ─── Entity Resolution Engine (Phase 6) ───────────────────────────────────────
//
// Solves ambiguous entity matching during intake, imports, and manual entry.
// Categorises entity resolution outcomes into:
//   - EXACT (1.00)
//   - ALIAS (0.95)
//   - POTENTIAL_MATCH (0.70 - 0.94) -> Queued for human review via EntityResolutionCandidate
//   - NOT_FOUND (< 0.70)
//
// Never silently forces a match when uncertainty exists.

import { db } from '@/lib/db/client'
import { toSlug } from '@/lib/data/normalise'
import { logger } from '@/lib/logging'
import { auditLog } from '@/lib/audit'

export type ResolutionConfidence = 'EXACT' | 'ALIAS' | 'POTENTIAL_MATCH' | 'NOT_FOUND'

export interface EntityMatchResult {
  rawName: string
  entityType: 'MANUFACTURER' | 'ASSET_MODEL' | 'CATEGORY'
  resolution: ResolutionConfidence
  score: number
  matchedId?: string
  matchedName?: string
  evidence: string
  candidateId?: string
}

/**
 * Calculates string similarity using Dice coefficient of bigrams.
 * Returns a value between 0 and 1.
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '')
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (s1 === s2) return 1.0
  if (s1.length < 2 || s2.length < 2) return 0.0

  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>()
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2)
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1)
    }
    return bigrams
  }

  const b1 = getBigrams(s1)
  const b2 = getBigrams(s2)

  let intersection = 0
  for (const [bigram, count1] of b1.entries()) {
    const count2 = b2.get(bigram) || 0
    intersection += Math.min(count1, count2)
  }

  const total = (s1.length - 1) + (s2.length - 1)
  return total > 0 ? (2.0 * intersection) / total : 0.0
}

/**
 * Resolves a raw manufacturer name against the database.
 * If a potential match is found with confidence between 0.70 and 0.94,
 * an EntityResolutionCandidate is created for human operator review.
 */
export async function resolveManufacturerWithCandidate(
  rawName: string,
): Promise<EntityMatchResult> {
  const trimmed = rawName?.trim()
  if (!trimmed) {
    return {
      rawName: '',
      entityType: 'MANUFACTURER',
      resolution: 'NOT_FOUND',
      score: 0,
      evidence: 'Empty input string provided',
    }
  }

  if (!db) {
    return {
      rawName: trimmed,
      entityType: 'MANUFACTURER',
      resolution: 'NOT_FOUND',
      score: 0,
      evidence: 'Database unavailable',
    }
  }

  const slug = toSlug(trimmed)

  // 1. Exact match (by name or slug)
  const exact = await db.manufacturer.findFirst({
    where: {
      OR: [
        { name: { equals: trimmed, mode: 'insensitive' } },
        { slug: { equals: slug } },
      ],
      isActive: true,
    },
  }).catch(() => null)

  if (exact) {
    return {
      rawName: trimmed,
      entityType: 'MANUFACTURER',
      resolution: 'EXACT',
      score: 1.0,
      matchedId: exact.id,
      matchedName: exact.name,
      evidence: `Exact match found on ${exact.slug === slug ? 'slug' : 'name'}`,
    }
  }

  // 2. Alias match
  const upper = trimmed.toUpperCase()
  const aliasMatch = await db.manufacturer.findFirst({
    where: {
      isActive: true,
      OR: [
        { aliases: { has: upper } },
        { aliases: { has: trimmed } },
      ],
    },
  }).catch(() => null)

  if (aliasMatch) {
    return {
      rawName: trimmed,
      entityType: 'MANUFACTURER',
      resolution: 'ALIAS',
      score: 0.95,
      matchedId: aliasMatch.id,
      matchedName: aliasMatch.name,
      evidence: `Matched known alias: "${trimmed}" -> ${aliasMatch.name}`,
    }
  }

  // 3. Fuzzy search for potential matches (human review queue)
  const allManufacturers = await db.manufacturer.findMany({
    where: { isActive: true },
    select: { id: true, name: true, aliases: true },
  }).catch(() => [])

  let bestMatch: { id: string; name: string; score: number } | null = null

  for (const m of allManufacturers) {
    const nameScore = calculateStringSimilarity(trimmed, m.name)
    if (!bestMatch || nameScore > bestMatch.score) {
      bestMatch = { id: m.id, name: m.name, score: nameScore }
    }

    // Check similarity with aliases as well
    for (const alias of m.aliases) {
      const aliasScore = calculateStringSimilarity(trimmed, alias)
      if (!bestMatch || aliasScore > bestMatch.score) {
        bestMatch = { id: m.id, name: m.name, score: aliasScore }
      }
    }
  }

  if (bestMatch && bestMatch.score >= 0.70) {
    const evidence = `Similarity score ${(bestMatch.score * 100).toFixed(1)}% with existing manufacturer "${bestMatch.name}"`
    
    // Store candidate for human admin review
    const candidate = await db.entityResolutionCandidate.create({
      data: {
        entityType: 'MANUFACTURER',
        sourceRawName: trimmed,
        proposedCanonicalId: bestMatch.id,
        proposedCanonicalName: bestMatch.name,
        confidence: bestMatch.score,
        matchingEvidence: evidence,
        status: 'PENDING',
      },
    }).catch(() => null)

    return {
      rawName: trimmed,
      entityType: 'MANUFACTURER',
      resolution: 'POTENTIAL_MATCH',
      score: Number(bestMatch.score.toFixed(3)),
      matchedId: bestMatch.id,
      matchedName: bestMatch.name,
      evidence,
      candidateId: candidate?.id,
    }
  }

  return {
    rawName: trimmed,
    entityType: 'MANUFACTURER',
    resolution: 'NOT_FOUND',
    score: bestMatch ? Number(bestMatch.score.toFixed(3)) : 0,
    evidence: 'No matching entity found above the 0.70 confidence threshold',
  }
}

/**
 * Fetch pending resolution candidates for admin review.
 */
export async function getPendingResolutionCandidates(entityType?: string) {
  if (!db) return []

  return db.entityResolutionCandidate.findMany({
    where: {
      status: 'PENDING',
      ...(entityType ? { entityType } : {}),
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])
}

/**
 * Execute an operator's decision on an entity resolution candidate.
 * If approved/merged: appends the sourceRawName to the target manufacturer's aliases array.
 */
export async function applyResolutionDecision(params: {
  candidateId: string
  action: 'MERGE' | 'REJECT'
  targetEntityId?: string
  reviewerId?: string
  reason?: string
}) {
  if (!db) throw new Error('Database is unavailable')

  const candidate = await db.entityResolutionCandidate.findUnique({
    where: { id: params.candidateId },
  })

  if (!candidate) {
    throw new Error('Candidate not found')
  }

  if (params.action === 'MERGE') {
    const targetId = params.targetEntityId || candidate.proposedCanonicalId
    if (!targetId) {
      throw new Error('Target entity ID is required to merge')
    }

    if (candidate.entityType === 'MANUFACTURER') {
      const target = await db.manufacturer.findUnique({
        where: { id: targetId },
        select: { id: true, aliases: true, name: true },
      })

      if (!target) throw new Error('Target manufacturer not found')

      // Add to aliases if not already included
      const currentAliases = target.aliases || []
      const newAlias = candidate.sourceRawName.trim()
      const updatedAliases = Array.from(new Set([...currentAliases, newAlias, newAlias.toUpperCase()]))

      await db.manufacturer.update({
        where: { id: targetId },
        data: { aliases: updatedAliases },
      })

      await auditLog({
        actorId: params.reviewerId || 'SYSTEM_ADMIN',
        actorType: 'USER',
        action: 'UPDATE',
        entityType: 'MANUFACTURER',
        entityId: targetId,
        metadata: {
          addedAlias: newAlias,
          candidateId: candidate.id,
          reason: params.reason || 'Operator merged entity resolution candidate',
        },
      })
    }

    await db.entityResolutionCandidate.update({
      where: { id: candidate.id },
      data: {
        status: 'APPROVED',
        reviewerId: params.reviewerId,
        decisionReason: params.reason || 'Approved by operator',
        decisionAt: new Date(),
      },
    })

    logger.info('Entity resolution candidate approved & merged', {
      candidateId: candidate.id,
      sourceRawName: candidate.sourceRawName,
      targetId,
    }, 'db')

    return { success: true, action: 'MERGE' }
  } else {
    // REJECT
    await db.entityResolutionCandidate.update({
      where: { id: candidate.id },
      data: {
        status: 'REJECTED',
        reviewerId: params.reviewerId,
        decisionReason: params.reason || 'Rejected as distinct entity by operator',
        decisionAt: new Date(),
      },
    })

    await auditLog({
      actorId: params.reviewerId || 'SYSTEM_ADMIN',
      actorType: 'USER',
      action: 'REJECT',
      entityType: 'ENTITY_RESOLUTION_CANDIDATE',
      entityId: candidate.id,
      metadata: {
        sourceRawName: candidate.sourceRawName,
        reason: params.reason,
      },
    })

    return { success: true, action: 'REJECT' }
  }
}
