// ─── SEO / GEO Publication Gate (Phase 5) ────────────────────────────────────
//
// Automated quality gate determining whether an entity or page is indexable.
// If an entity lacks sufficient real data, verification, or substantive content,
// it is automatically tagged with robots: { index: false, follow: true }.
// Prevents thin page indexation and protects domain authority.

export interface PublicationGateInput {
  entityType: 'asset' | 'manufacturer' | 'category' | 'guide' | 'provider'
  hasVerifiedIdentity: boolean
  contentLength: number
  hasStructuredData: boolean
  dataCompletenessScore?: number // 0 to 1
  isPubliclyListed?: boolean
  status?: string
}

export interface PublicationGateResult {
  isIndexable: boolean
  reasons: string[]
  robotsDirectives: {
    index: boolean
    follow: boolean
  }
}

const MIN_CONTENT_LENGTH: Record<string, number> = {
  asset: 200,
  manufacturer: 150,
  category: 300,
  guide: 600,
  provider: 200,
}

export function evaluatePublicationGate(input: PublicationGateInput): PublicationGateResult {
  const reasons: string[] = []

  // Rule 1: Status must be active/published
  if (input.status && !['ACTIVE', 'PUBLISHED', 'VERIFIED'].includes(input.status)) {
    reasons.push(`Status is "${input.status}" — draft or provisional entities are never indexed`)
  }

  // Rule 2: Explicit public listing flag
  if (input.isPubliclyListed === false) {
    reasons.push('Entity is explicitly marked as not publicly listed')
  }

  // Rule 3: Verified identity
  if (!input.hasVerifiedIdentity) {
    reasons.push('Identity not verified against official or verified source')
  }

  // Rule 4: Substantive content threshold
  const minLength = MIN_CONTENT_LENGTH[input.entityType] ?? 200
  if (input.contentLength < minLength) {
    reasons.push(`Content length (${input.contentLength} chars) is below indexation threshold of ${minLength} chars`)
  }

  // Rule 5: Data completeness threshold
  if (input.dataCompletenessScore !== undefined && input.dataCompletenessScore < 0.6) {
    reasons.push(`Data completeness score (${Math.round(input.dataCompletenessScore * 100)}%) is below 60% threshold`)
  }

  const isIndexable = reasons.length === 0

  return {
    isIndexable,
    reasons,
    robotsDirectives: {
      index: isIndexable,
      follow: true, // Always allow following links
    },
  }
}
