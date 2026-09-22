'use server'

import { z } from 'zod'
import { db } from '@/lib/db/client'
import { requireProviderMembership } from '@/lib/auth/context'
import { auditService } from '@/lib/audit'
import { emitEvent } from '@/lib/notifications/events'
import { validateTransition, buildStatusHistoryEntry } from '@/lib/matching/opportunity'
import { revalidatePath } from 'next/cache'

// ─── Provider Opportunity Actions (Phase 5) ──────────────────────────────────
//
// Authoritative provider workflow actions.
// Every action strictly verifies that the authenticated user belongs to the
// provider organisation (Lender) that holds the OpportunityProvider match.
// Prevents IDOR and cross-provider data leakage.

const providerResponseSchema = z.object({
  opportunityId: z.string().min(1),
  lenderId:      z.string().min(1),
  action:        z.enum([
    'REVIEW',
    'REQUEST_INFORMATION',
    'INTERESTED',
    'DECLINE',
    'SUBMIT_TO_CREDIT',
    'OFFERED',
    'COMPLETED',
  ]),
  notes:         z.string().max(2000).optional(),
  fields:        z.array(z.string()).optional(),
  indicativeRate: z.number().positive().optional(),
  approvedAmount: z.number().positive().optional(),
  termMonths:    z.number().int().positive().optional(),
  reason:        z.string().max(1000).optional(),
})

export interface ProviderResponseResult {
  success: boolean
  error?:   string
}

export async function submitProviderResponse(
  input: z.infer<typeof providerResponseSchema>,
): Promise<ProviderResponseResult> {
  const parsed = providerResponseSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid response parameters' }
  }

  const {
    opportunityId,
    lenderId,
    action,
    notes,
    fields,
    indicativeRate,
    approvedAmount,
    termMonths,
    reason,
  } = parsed.data

  // 1. Strict server-side authorization check: user must belong to this lender
  const { user } = await requireProviderMembership(lenderId)

  if (!db) {
    return { success: false, error: 'Database service unavailable' }
  }

  // 2. Fetch the specific OpportunityProvider match
  const match = await db.opportunityProvider.findUnique({
    where: {
      opportunityId_lenderId: {
        opportunityId,
        lenderId,
      },
    },
    include: {
      opportunity: true,
      lender: true,
    },
  })

  if (!match) {
    return { success: false, error: 'Opportunity match not found for this provider organisation' }
  }

  const now = new Date()
  let newMatchStatus = match.matchStatus
  const currentResponse = (match.providerResponse as Record<string, unknown>) || {}

  switch (action) {
    case 'REVIEW':
      newMatchStatus = 'REVIEWING'
      currentResponse.reviewedAt = now.toISOString()
      currentResponse.reviewedBy = user.id
      break

    case 'REQUEST_INFORMATION':
      newMatchStatus = 'INFORMATION_REQUESTED'
      currentResponse.informationRequestedAt = now.toISOString()
      currentResponse.informationRequestedBy = user.id
      currentResponse.requestedFields = fields ?? []
      currentResponse.requestMessage = notes ?? ''

      await emitEvent('ADDITIONAL_INFORMATION_REQUIRED', {
        opportunityId,
        businessId: match.opportunity.businessId,
        fields: fields ?? [],
        message: notes,
      })
      break

    case 'INTERESTED':
      // Expressing interest is NOT an approval
      newMatchStatus = 'INTERESTED'
      currentResponse.expressedInterestAt = now.toISOString()
      currentResponse.expressedInterestBy = user.id
      currentResponse.interestNotes = notes ?? ''
      if (indicativeRate) currentResponse.indicativeRate = indicativeRate
      break

    case 'DECLINE':
      newMatchStatus = 'DECLINED'
      currentResponse.declinedAt = now.toISOString()
      currentResponse.declinedBy = user.id
      currentResponse.declineReason = reason ?? notes ?? 'Declined by provider'
      break

    case 'SUBMIT_TO_CREDIT':
      newMatchStatus = 'SUBMITTED_TO_CREDIT'
      currentResponse.submittedToCreditAt = now.toISOString()
      currentResponse.submittedToCreditBy = user.id
      break

    case 'OFFERED':
      // Real commercial offer
      newMatchStatus = 'OFFERED'
      currentResponse.offeredAt = now.toISOString()
      currentResponse.offeredBy = user.id
      currentResponse.approvedAmount = approvedAmount
      currentResponse.termMonths = termMonths
      currentResponse.offerNotes = notes ?? ''

      // Also create FinanceOffer record in database
      if (match.opportunity.applicationId) {
        await db.financeOffer.create({
          data: {
            applicationId: match.opportunity.applicationId,
            lenderId: match.lenderId,
            amount: approvedAmount ?? 0,
            deposit: 0,
            termMonths: termMonths ?? 36,
            monthlyPayment: 0,
            totalPayable: approvedAmount ?? 0,
            structureType: 'HIRE_PURCHASE',
            decisionStatus: 'APPROVED',
            decisionReason: notes ?? 'Provider commercial approval',
            source: 'PROVIDER_PORTAL',
          },
        })
      }

      // Check if Opportunity state machine can transition to OFFERED
      const canTransitionToOffered = validateTransition(match.opportunity.status, 'OFFERED')
      if (canTransitionToOffered.success) {
        const history = (match.opportunity.statusHistory as any[]) || []
        history.push(
          buildStatusHistoryEntry(match.opportunity.status, 'OFFERED', {
            actorId: user.id,
            actorType: 'PROVIDER',
            reason: `Formal finance offer issued by ${match.lender.name}`,
          }),
        )

        await db.opportunity.update({
          where: { id: opportunityId },
          data: {
            status: 'OFFERED',
            offeredAt: now,
            statusHistory: history as any,
          },
        })
      }
      break

    case 'COMPLETED':
      newMatchStatus = 'COMPLETED'
      currentResponse.completedAt = now.toISOString()
      currentResponse.completedBy = user.id

      const canTransitionToCompleted = validateTransition(match.opportunity.status, 'COMPLETED')
      if (canTransitionToCompleted.success) {
        const history = (match.opportunity.statusHistory as any[]) || []
        history.push(
          buildStatusHistoryEntry(match.opportunity.status, 'COMPLETED', {
            actorId: user.id,
            actorType: 'PROVIDER',
            reason: `Transaction completed with ${match.lender.name}`,
          }),
        )

        await db.opportunity.update({
          where: { id: opportunityId },
          data: {
            status: 'COMPLETED',
            completedAt: now,
            statusHistory: history as any,
          },
        })
      }
      break
  }

  // 3. Update OpportunityProvider match record
  await db.opportunityProvider.update({
    where: {
      opportunityId_lenderId: {
        opportunityId,
        lenderId,
      },
    },
    data: {
      matchStatus: newMatchStatus,
      providerResponse: currentResponse as any,
      viewedAt: match.viewedAt ?? now,
      respondedAt: now,
      updatedAt: now,
    },
  })

  // 4. Immutable audit log
  await auditService.log({
    entity: 'OpportunityProvider',
    entityId: `${opportunityId}:${lenderId}`,
    action: 'STATUS_CHANGE',
    actorId: user.id,
    actorType: 'USER',
    after: {
      action,
      newMatchStatus,
      lenderName: match.lender.name,
    },
  })

  await emitEvent('PROVIDER_RESPONSE_RECEIVED', {
    opportunityId,
    lenderId,
    responseType: action,
  })

  revalidatePath(`/provider/opportunities/${opportunityId}`)
  revalidatePath('/provider')
  revalidatePath('/account/opportunities')

  return { success: true }
}
