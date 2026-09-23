// tests/unit/security/pilot-security-validation.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateSecureDocumentToken,
  verifyDocumentToken,
  verifyDocumentAccess,
  type UserContext,
} from '@/lib/documents/security'
import { getOperationalStateAudit, getCommercialFunnelAudit } from '@/lib/pilot/operational-state'
import { submitPilotFeedbackAction, updatePilotFeedbackStatusAction } from '@/app/actions/pilot-feedback'
import { db } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

// Mock db client
vi.mock('@/lib/db/client', () => ({
  db: {
    applicationDocument: {
      findUnique: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    pilotFeedback: {
      create: vi.fn(),
      update: vi.fn(),
    },
    manufacturer: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    asset: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    marketObservation: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    lender: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    providerCriteria: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    financeApplication: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    opportunity: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    opportunityProvider: {
      count: vi.fn(),
    },
    financeOffer: {
      count: vi.fn(),
    },
    informationRequest: {
      count: vi.fn(),
    },
    providerBillingRecord: {
      count: vi.fn(),
    },
  },
}))

// Mock audit log & session
vi.mock('@/lib/audit', () => ({
  auditLog: vi.fn().mockResolvedValue(true),
  auditService: {
    log: vi.fn().mockResolvedValue(true),
  },
}))

vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Phase 7: Pilot Security, Data Segregation & Operational Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1. Live Document Security & Multi-Tenant Negative Tests', () => {
    it('rejects access when an unmatched Provider attempts to access borrower docs', async () => {
      const mockDoc = {
        id: 'doc_sec_001',
        filename: 'vat_return_q3.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 204800,
        url: 'https://storage.tafm.co.uk/docs/doc_sec_001.pdf',
        applicationId: 'app_1',
        application: {
          id: 'app_1',
          businessId: 'business_A',
          userId: 'user_A',
          opportunities: [
            {
              id: 'opp_1',
              providerMatches: [{ lenderId: 'lender_haydock' }],
            },
          ],
        },
      }

      vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

      // An uninvited / unmatched provider attempts to view document
      const unmatchedProviderContext: UserContext = {
        id: 'user_rogue_provider',
        role: 'LENDER_USER',
        lenderId: 'lender_unmatched_competitor',
      }

      const result = await verifyDocumentAccess('doc_sec_001', unmatchedProviderContext)
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('Lender is not matched to this facility requirement')
    })

    it('permits matched pilot provider to access document', async () => {
      const mockDoc = {
        id: 'doc_sec_001',
        filename: 'vat_return_q3.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 204800,
        url: 'https://storage.tafm.co.uk/docs/doc_sec_001.pdf',
        applicationId: 'app_1',
        application: {
          id: 'app_1',
          businessId: 'business_A',
          userId: 'user_A',
          opportunities: [
            {
              id: 'opp_1',
              providerMatches: [{ lenderId: 'lender_haydock' }],
            },
          ],
        },
      }

      vi.mocked(db!.applicationDocument.findUnique).mockResolvedValue(mockDoc as any)

      const matchedProviderContext: UserContext = {
        id: 'user_haydock_underwriter',
        role: 'LENDER_USER',
        lenderId: 'lender_haydock',
      }

      const result = await verifyDocumentAccess('doc_sec_001', matchedProviderContext)
      expect(result.allowed).toBe(true)
      expect(result.document?.id).toBe('doc_sec_001')
    })

    it('rejects tampered or forged HMAC tokens for document download', () => {
      const { token: originalToken } = generateSecureDocumentToken('doc_sec_001', 'user_A', 3600)
      const raw = Buffer.from(originalToken, 'base64url').toString('utf8')
      const parsed = JSON.parse(raw)
      parsed.signature = 'bad_signature_xyz'
      const tamperedToken = Buffer.from(JSON.stringify(parsed)).toString('base64url')

      const verification = verifyDocumentToken(tamperedToken)
      expect(verification.valid).toBe(false)
      expect(verification.error).toBe('Invalid token signature')
    })

    it('rejects expired HMAC tokens for document download', () => {
      // Token expired 10 seconds ago
      const { token: expiredToken } = generateSecureDocumentToken('doc_sec_001', 'user_A', -10)
      const verification = verifyDocumentToken(expiredToken)
      expect(verification.valid).toBe(false)
      expect(verification.error).toBe('Token has expired')
    })
  })

  describe('2. Data Origin Segregation & Provenance Audit', () => {
    it('correctly audits 4 Operating States with criteria confirmation', async () => {
      vi.mocked(db!.manufacturer.count).mockResolvedValue(5)
      vi.mocked(db!.manufacturer.findMany).mockResolvedValue([
        { id: 'm1', name: 'Ruthmann', verificationStatus: 'VERIFIED', sourceId: 'src_1', assets: [] },
        { id: 'm2', name: 'Palfinger', verificationStatus: 'VERIFIED', sourceId: 'src_2', assets: [] },
        { id: 'm3', name: 'Bronto Skylift', verificationStatus: 'VERIFIED', sourceId: 'src_3', assets: [] },
        { id: 'm4', name: 'Wumag', verificationStatus: 'VERIFIED', sourceId: 'src_4', assets: [] },
        { id: 'm5', name: 'CTE', verificationStatus: 'VERIFIED', sourceId: 'src_5', assets: [] },
      ] as any)
      vi.mocked(db!.asset.count).mockResolvedValue(5)
      vi.mocked(db!.asset.findMany).mockResolvedValue([
        { id: 'a1', name: 'T650 HF', verificationStatus: 'VERIFIED', isVerified: true } as any,
      ])
      vi.mocked(db!.marketObservation.count).mockResolvedValue(5)
      vi.mocked(db!.marketObservation.findMany).mockResolvedValue([
        { id: 'mo1', assetName: 'T650 HF', isVerified: true } as any,
      ])
      vi.mocked(db!.lender.count).mockResolvedValue(1)
      vi.mocked(db!.lender.findMany).mockResolvedValue([
        { id: 'l1', name: 'Haydock Finance Ltd', isAccredited: true, status: 'ACTIVE' } as any,
      ])
      vi.mocked(db!.providerCriteria.count).mockResolvedValue(1)
      vi.mocked(db!.providerCriteria.findMany).mockResolvedValue([
        {
          id: 'c1',
          lenderId: 'l1',
          isExternallyConfirmed: true,
          confirmationSource: 'Haydock Rate Card Q1 2025',
          reviewDate: new Date('2026-12-31'),
        } as any,
      ])

      const audit = await getOperationalStateAudit()

      expect(audit.manufacturers.state1).toBe(5)
      expect(audit.providers.state2).toBe(1)
      expect(audit.criteria.state2).toBe(1)
      expect(audit.criteria.details[0].isExternallyConfirmed).toBe(true)
    })

    it('strictly segregates REAL_EXTERNAL funnel activity from SEED/TEST data', async () => {
      vi.mocked(db!.financeApplication.count).mockImplementation(((args?: any) => {
        if (args?.where?.dataOrigin === 'REAL_EXTERNAL') return Promise.resolve(2)
        return Promise.resolve(10)
      }) as any)

      vi.mocked(db!.opportunity.count).mockImplementation(((args?: any) => {
        if (args?.where?.dataOrigin === 'REAL_EXTERNAL') return Promise.resolve(2)
        return Promise.resolve(8)
      }) as any)

      vi.mocked(db!.opportunityProvider.count).mockResolvedValue(2 as any)
      vi.mocked(db!.financeOffer.count).mockResolvedValue(0 as any)
      vi.mocked(db!.informationRequest.count).mockResolvedValue(0 as any)
      vi.mocked(db!.providerBillingRecord.count).mockResolvedValue(0 as any)

      const funnel = await getCommercialFunnelAudit()

      expect(funnel.realExternal.applicationsSubmitted).toBe(2)
      expect(funnel.realExternal.opportunitiesSubmitted).toBe(2)
      expect(funnel.seedOrTest.applicationsSubmitted).toBe(10)
      expect(funnel.billing.activeBillingRecords).toBe(0)
      expect(funnel.billing.totalInvoicedGbp).toBe(0)
    })
  })

  describe('3. Operational Feedback Loop Security & Triage', () => {
    it('allows borrower to submit operational feedback', async () => {
      vi.mocked(getSession).mockResolvedValue({ id: 'user_borrower_1', role: 'BUSINESS' } as any)
      vi.mocked(db!.pilotFeedback.create).mockResolvedValue({
        id: 'fb_1',
        severity: 'HIGH',
        category: 'FINANCE_REQUIREMENT',
        userType: 'BORROWER',
        summary: 'Step 3 confusing term dropdown',
        details: 'Needed explanation of balloon payments.',
        status: 'OPEN',
      } as any)

      const res = await submitPilotFeedbackAction({
        severity: 'HIGH',
        category: 'FINANCE_REQUIREMENT',
        userType: 'BORROWER',
        summary: 'Step 3 confusing term dropdown',
        details: 'Needed explanation of balloon payments.',
      })

      expect(res.success).toBe(true)
      expect(res.id).toBe('fb_1')
      expect(db!.pilotFeedback.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            severity: 'HIGH',
            userType: 'BORROWER',
            status: 'OPEN',
          }),
        })
      )
    })

    it('prohibits non-admin user from updating feedback status', async () => {
      vi.mocked(getSession).mockResolvedValue({ id: 'user_borrower_1', role: 'BUSINESS' } as any)

      const res = await updatePilotFeedbackStatusAction({
        id: 'fb_1',
        status: 'RESOLVED',
        resolutionNotes: 'Unauthorized attempt',
      })

      expect(res.success).toBe(false)
      expect(res.error).toBe('Unauthorized')
    })

    it('allows super admin to triage feedback and record resolution notes', async () => {
      vi.mocked(getSession).mockResolvedValue({ id: 'admin_1', role: 'SUPER_ADMIN' } as any)
      vi.mocked(db!.pilotFeedback.update).mockResolvedValue({
        id: 'fb_1',
        status: 'RESOLVED',
        resolutionNotes: 'Added tooltip to balloon payment input',
      } as any)

      const res = await updatePilotFeedbackStatusAction({
        id: 'fb_1',
        status: 'RESOLVED',
        resolutionNotes: 'Added tooltip to balloon payment input',
      })

      expect(res.success).toBe(true)
      expect(db!.pilotFeedback.update).toHaveBeenCalledWith({
        where: { id: 'fb_1' },
        data: {
          status: 'RESOLVED',
          resolutionNotes: 'Added tooltip to balloon payment input',
        },
      })
    })
  })
})
