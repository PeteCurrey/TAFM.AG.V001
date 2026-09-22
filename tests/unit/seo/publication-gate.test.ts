import { describe, it, expect } from 'vitest'
import { evaluatePublicationGate } from '@/lib/seo/publication-gate'

describe('SEO / GEO Publication Quality Gate', () => {
  it('permits indexation only when all quality criteria are met', () => {
    const result = evaluatePublicationGate({
      entityType: 'asset',
      hasVerifiedIdentity: true,
      contentLength: 450,
      hasStructuredData: true,
      dataCompletenessScore: 0.85,
      isPubliclyListed: true,
      status: 'ACTIVE',
    })

    expect(result.isIndexable).toBe(true)
    expect(result.robotsDirectives.index).toBe(true)
    expect(result.robotsDirectives.follow).toBe(true)
    expect(result.reasons.length).toBe(0)
  })

  it('enforces NOINDEX when entity is in DRAFT or PROVISIONAL status', () => {
    const result = evaluatePublicationGate({
      entityType: 'asset',
      hasVerifiedIdentity: true,
      contentLength: 500,
      hasStructuredData: true,
      status: 'DRAFT',
    })

    expect(result.isIndexable).toBe(false)
    expect(result.robotsDirectives.index).toBe(false)
    expect(result.reasons.some((r) => r.includes('DRAFT'))).toBe(true)
  })

  it('enforces NOINDEX when content is thin (below threshold)', () => {
    const result = evaluatePublicationGate({
      entityType: 'guide',
      hasVerifiedIdentity: true,
      contentLength: 120, // Below 600 min length for guide
      hasStructuredData: true,
      status: 'PUBLISHED',
    })

    expect(result.isIndexable).toBe(false)
    expect(result.robotsDirectives.index).toBe(false)
    expect(result.reasons.some((r) => r.includes('below indexation threshold'))).toBe(true)
  })

  it('enforces NOINDEX when identity is unverified', () => {
    const result = evaluatePublicationGate({
      entityType: 'manufacturer',
      hasVerifiedIdentity: false,
      contentLength: 300,
      hasStructuredData: true,
      status: 'ACTIVE',
    })

    expect(result.isIndexable).toBe(false)
    expect(result.robotsDirectives.index).toBe(false)
    expect(result.reasons.some((r) => r.includes('Identity not verified'))).toBe(true)
  })
})
