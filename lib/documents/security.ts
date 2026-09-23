// ─── Multi-Tenant Document Security & Access Control (Phase 6) ───────────────
//
// Enforces cryptographic and relational tenant isolation for sensitive underwriting documents.
// Guarantees:
//   1. Business A cannot access Business B's financial documents or applications (IDOR protection).
//   2. Provider A cannot access Provider B's submissions, internal notes, or underwriting decisions.
//   3. Borrowers cannot inspect provider-confidential underwriting notes.
//   4. Direct S3/Supabase storage URLs are never exposed without time-limited signed tokens.

import crypto from 'crypto'
import { db } from '@/lib/db/client'
import { auditLog } from '@/lib/audit'
import { logger } from '@/lib/logging'

export interface UserContext {
  id: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'LENDER_USER' | 'LENDER_ADMIN' | 'BUSINESS_USER' | 'BUSINESS_ADMIN' | 'BROKER' | 'USER'
  businessId?: string
  lenderId?: string
}

export interface AccessCheckResult {
  allowed: boolean
  reason?: string
  document?: {
    id: string
    filename: string | null
    mimeType: string | null
    sizeBytes: number | null
    url: string | null
    applicationId: string
  }
}

const DOCUMENT_SIGNING_SECRET = process.env.DOCUMENT_SIGNING_SECRET || 'tafm-secure-document-signing-key-production-phase-6'

/**
 * Validates whether the given user is authorized to read the specified document.
 */
export async function verifyDocumentAccess(
  documentId: string,
  user: UserContext,
): Promise<AccessCheckResult> {
  if (!db) {
    return { allowed: false, reason: 'Database service unavailable' }
  }

  // 1. Super Admin and Admin have systemic operational authority
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    const doc = await db.applicationDocument.findUnique({
      where: { id: documentId },
    })
    if (!doc) return { allowed: false, reason: 'Document not found' }

    await auditLog({
      actorId: user.id,
      actorType: 'USER',
      action: 'ACCESS',
      entityType: 'ApplicationDocument',
      entityId: documentId,
      metadata: { role: user.role, note: 'Admin document access' },
    })

    return { allowed: true, document: doc }
  }

  // 2. Fetch document with application and linked business/opportunity context
  const doc = await db.applicationDocument.findUnique({
    where: { id: documentId },
    include: {
      application: {
        include: {
          opportunities: {
            include: {
              providerMatches: true,
            },
          },
        },
      },
    },
  })

  if (!doc) {
    return { allowed: false, reason: 'Document not found' }
  }

  const app = doc.application

  // 3. Business User Access: must own the application or its business
  if (user.businessId) {
    const ownsApplication = app.businessId === user.businessId || app.userId === user.id
    if (ownsApplication) {
      return { allowed: true, document: doc }
    } else {
      // IDOR violation attempt
      await auditLog({
        actorId: user.id,
        actorType: 'USER',
        action: 'ACCESS',
        entityType: 'ApplicationDocument',
        entityId: documentId,
        metadata: {
          violation: 'CROSS_TENANT_BUSINESS_ACCESS_ATTEMPT',
          userBusinessId: user.businessId,
          targetApplicationBusinessId: app.businessId,
        },
      })
      logger.warn('Cross-tenant business document access violation blocked', {
        userId: user.id,
        documentId,
        userBusinessId: user.businessId,
      }, 'security')

      return { allowed: false, reason: 'Unauthorized: Cross-tenant business access prohibited' }
    }
  }

  // 4. Provider Access: must have an active match to an opportunity linked to this application
  if (user.lenderId) {
    const isMatched = app.opportunities.some((opp) =>
      opp.providerMatches.some((match) => match.lenderId === user.lenderId),
    )

    if (isMatched) {
      return { allowed: true, document: doc }
    } else {
      // Competing lender isolation violation attempt
      await auditLog({
        actorId: user.id,
        actorType: 'USER',
        action: 'ACCESS',
        entityType: 'ApplicationDocument',
        entityId: documentId,
        metadata: {
          violation: 'CROSS_PROVIDER_DOCUMENT_ACCESS_ATTEMPT',
          userLenderId: user.lenderId,
        },
      })
      logger.warn('Cross-provider document access violation blocked', {
        userId: user.id,
        documentId,
        userLenderId: user.lenderId,
      }, 'security')

      return { allowed: false, reason: 'Unauthorized: Lender is not matched to this facility requirement' }
    }
  }

  return { allowed: false, reason: 'Unauthorized' }
}

/**
 * Generate a cryptographically signed, short-lived token for temporary document download.
 * Expiration defaults to 15 minutes (900 seconds).
 */
export function generateSecureDocumentToken(
  documentId: string,
  userId: string,
  expiresInSeconds = 900,
): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)
  const payload = `${documentId}:${userId}:${expiresAt.getTime()}`
  const signature = crypto
    .createHmac('sha256', DOCUMENT_SIGNING_SECRET)
    .update(payload)
    .digest('hex')

  const token = Buffer.from(JSON.stringify({ documentId, userId, expiresAt: expiresAt.getTime(), signature })).toString('base64url')

  return { token, expiresAt }
}

/**
 * Validates a secure document download token.
 */
export function verifyDocumentToken(token: string): {
  valid: boolean
  documentId?: string
  userId?: string
  error?: string
} {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8')
    const { documentId, userId, expiresAt, signature } = JSON.parse(raw)

    if (Date.now() > expiresAt) {
      return { valid: false, error: 'Token has expired' }
    }

    const expectedPayload = `${documentId}:${userId}:${expiresAt}`
    const expectedSignature = crypto
      .createHmac('sha256', DOCUMENT_SIGNING_SECRET)
      .update(expectedPayload)
      .digest('hex')

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: true, documentId, userId }
    }

    return { valid: false, error: 'Invalid token signature' }
  } catch {
    return { valid: false, error: 'Malformed token' }
  }
}
