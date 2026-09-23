// tests/unit/security/authorization-negative.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateSecureDocumentToken,
  verifyDocumentToken,
  verifyDocumentAccess,
  type UserContext,
} from '@/lib/documents/security'
import { calculateStringSimilarity } from '@/lib/data/entity-resolution'
import { db } from '@/lib/db/client'

// Mock database client for unit tests
vi.mock('@/lib/db/client', () => ({
  db: {
    applicationDocument: {
      findUnique: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}))

// Mock auditLog module
vi.mock('@/lib/audit', () => ({
  auditLog: vi.fn().mockResolvedValue(true),
  auditService: {
    log: vi.fn().mockResolvedValue(true),
  },
}))

describe('Multi-Tenant Document Security & Authorization (Negative Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('prohibits Business B user from accessing Business A documents (IDOR Prevention)', async () => {
    const mockDoc = {
      id: 'doc_123',
      filename: 'accounts_2023.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 102400,
      url: 'https://storage.tafm.co.uk/docs/doc_123.pdf',
      applicationId: 'app_1',
      application: {
        id: 'app_1',
        businessId: 'business_A',
        userId: 'user_A',
        opportunities: [
          {
            id: 'opp_1',
            providerMatches: [{ lenderId: 'lender_A' }],
          },
        ],
      },
    }

    vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

    const attackerContext: UserContext = {
      id: 'user_B',
      role: 'BUSINESS_USER',
      businessId: 'business_B', // Different tenant
    }

    const result = await verifyDocumentAccess('doc_123', attackerContext)

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Cross-tenant business access prohibited')
  })

  it('allows Business A user to access Business A documents', async () => {
    const mockDoc = {
      id: 'doc_123',
      filename: 'accounts_2023.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 102400,
      url: 'https://storage.tafm.co.uk/docs/doc_123.pdf',
      applicationId: 'app_1',
      application: {
        id: 'app_1',
        businessId: 'business_A',
        userId: 'user_A',
        opportunities: [],
      },
    }

    vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

    const legitimateContext: UserContext = {
      id: 'user_A',
      role: 'BUSINESS_USER',
      businessId: 'business_A',
    }

    const result = await verifyDocumentAccess('doc_123', legitimateContext)

    expect(result.allowed).toBe(true)
    expect(result.document?.id).toBe('doc_123')
  })

  it('prohibits unmatched competing Lender B from accessing application documents', async () => {
    const mockDoc = {
      id: 'doc_123',
      filename: 'bank_statements.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 51200,
      url: 'https://storage.tafm.co.uk/docs/doc_123.pdf',
      applicationId: 'app_1',
      application: {
        id: 'app_1',
        businessId: 'business_A',
        userId: 'user_A',
        opportunities: [
          {
            id: 'opp_1',
            // Only lender_A is matched to this opportunity
            providerMatches: [{ lenderId: 'lender_A' }],
          },
        ],
      },
    }

    vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

    const competingLenderContext: UserContext = {
      id: 'lender_user_B',
      role: 'LENDER_USER',
      lenderId: 'lender_B', // Competitor, not matched
    }

    const result = await verifyDocumentAccess('doc_123', competingLenderContext)

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Lender is not matched')
  })

  it('allows matched Lender A to access application documents', async () => {
    const mockDoc = {
      id: 'doc_123',
      filename: 'bank_statements.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 51200,
      url: 'https://storage.tafm.co.uk/docs/doc_123.pdf',
      applicationId: 'app_1',
      application: {
        id: 'app_1',
        businessId: 'business_A',
        userId: 'user_A',
        opportunities: [
          {
            id: 'opp_1',
            providerMatches: [{ lenderId: 'lender_A' }],
          },
        ],
      },
    }

    vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

    const matchedLenderContext: UserContext = {
      id: 'lender_user_A',
      role: 'LENDER_USER',
      lenderId: 'lender_A',
    }

    const result = await verifyDocumentAccess('doc_123', matchedLenderContext)

    expect(result.allowed).toBe(true)
  })

  it('allows Super Admin operational access to any document', async () => {
    const mockDoc = {
      id: 'doc_123',
      filename: 'financials.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 80000,
      url: 'https://storage.tafm.co.uk/docs/doc_123.pdf',
      applicationId: 'app_1',
    }

    vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

    const adminContext: UserContext = {
      id: 'admin_1',
      role: 'SUPER_ADMIN',
    }

    const result = await verifyDocumentAccess('doc_123', adminContext)

    expect(result.allowed).toBe(true)
  })
})

describe('Cryptographic Document Download Token Security', () => {
  it('generates and successfully validates an untampered token', () => {
    const docId = 'doc_secret_77'
    const userId = 'usr_42'

    const { token } = generateSecureDocumentToken(docId, userId, 300)
    const verification = verifyDocumentToken(token)

    expect(verification.valid).toBe(true)
    expect(verification.documentId).toBe(docId)
    expect(verification.userId).toBe(userId)
  })

  it('rejects an expired token', () => {
    const docId = 'doc_secret_77'
    const userId = 'usr_42'

    // Expire immediately (-10 seconds)
    const { token } = generateSecureDocumentToken(docId, userId, -10)
    const verification = verifyDocumentToken(token)

    expect(verification.valid).toBe(false)
    expect(verification.error).toBe('Token has expired')
  })

  it('rejects a tampered token payload where documentId is modified', () => {
    const { token } = generateSecureDocumentToken('doc_A', 'usr_1', 600)

    // Decode, tamper payload, and re-encode
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'))
    decoded.documentId = 'doc_B_tampered'
    const tamperedToken = Buffer.from(JSON.stringify(decoded)).toString('base64url')

    const verification = verifyDocumentToken(tamperedToken)

    expect(verification.valid).toBe(false)
    expect(verification.error).toBe('Invalid token signature')
  })

  it('gracefully handles malformed token strings', () => {
    const result = verifyDocumentToken('invalid-non-base64-random-junk')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Malformed token')
  })
})

describe('Entity Resolution String Similarity Algorithm', () => {
  it('returns 1.0 for identical strings', () => {
    expect(calculateStringSimilarity('Ruthmann', 'Ruthmann')).toBe(1.0)
    expect(calculateStringSimilarity('scania', 'SCANIA')).toBe(1.0)
  })

  it('returns 0.0 for strings with no bigram overlap', () => {
    expect(calculateStringSimilarity('AAA', 'ZZZ')).toBe(0.0)
  })

  it('detects high similarity for typical manufacturer name variations', () => {
    const similarity = calculateStringSimilarity('Ruthmann Steiger', 'Ruthmann')
    // Should have substantial bigram overlap
    expect(similarity).toBeGreaterThan(0.65)
  })

  it('distinguishes distinct manufacturers with low similarity', () => {
    const similarity = calculateStringSimilarity('Liebherr', 'Palfinger')
    expect(similarity).toBeLessThan(0.3)
  })
})
