'use server'

import { z } from 'zod'
import { db } from '@/lib/db/client'
import { requireProviderMembership, requireBusinessMembership } from '@/lib/auth/context'
import { auditLog } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

// Provider creates an information request
const createRequestSchema = z.object({
  opportunityId: z.string().min(1),
  requestNotes: z.string().min(5, 'Request notes must be at least 5 characters'),
  requestedFields: z.string().optional(),
})

export async function createInformationRequestAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { lenderId, user } = await requireProviderMembership()
    if (!db) return { success: false, error: 'Database service unavailable' }

    const opportunityId = formData.get('opportunityId')?.toString() ?? ''
    const requestNotes = formData.get('requestNotes')?.toString() ?? ''
    const requestedFields = formData.get('requestedFields')?.toString() ?? ''

    const parsed = createRequestSchema.safeParse({
      opportunityId,
      requestNotes,
      requestedFields,
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' }
    }

    // Verify provider is matched to this opportunity
    const match = await db.opportunityProvider.findUnique({
      where: {
        opportunityId_lenderId: {
          opportunityId: parsed.data.opportunityId,
          lenderId,
        },
      },
    })

    if (!match) {
      return { success: false, error: 'Provider is not matched to this opportunity' }
    }

    const fieldArray = parsed.data.requestedFields
      ? parsed.data.requestedFields.split(',').map((f) => f.trim()).filter(Boolean)
      : []

    // Create the request
    const request = await db.informationRequest.create({
      data: {
        opportunityId: parsed.data.opportunityId,
        lenderId,
        requestedByUserId: user.id,
        requestNotes: parsed.data.requestNotes,
        requestedFields: fieldArray,
        status: 'PENDING',
      },
    })

    // Update opportunity status if currently MATCHED or UNDER_REVIEW
    const opp = await db.opportunity.findUnique({
      where: { id: parsed.data.opportunityId },
      select: { status: true, statusHistory: true },
    })

    if (opp && (opp.status === 'MATCHED' || opp.status === 'UNDER_REVIEW')) {
      const history = (opp.statusHistory as Array<{ from: string; to: string; at: string; reason?: string }>) || []
      history.push({
        from: opp.status,
        to: 'AWAITING_INFORMATION',
        at: new Date().toISOString(),
        reason: 'Provider requested underwriting information / documentation',
      })

      await db.opportunity.update({
        where: { id: parsed.data.opportunityId },
        data: {
          status: 'AWAITING_INFORMATION',
          statusHistory: history,
        },
      })
    }

    await auditLog({
      actorId: user.id,
      actorType: 'USER',
      action: 'CREATE',
      entityType: 'INFORMATION_REQUEST',
      entityId: request.id,
      metadata: {
        opportunityId: parsed.data.opportunityId,
        lenderId,
      },
    })

    revalidatePath(`/provider/opportunities/${parsed.data.opportunityId}`)
    revalidatePath(`/account/opportunities/${parsed.data.opportunityId}`)

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create information request'
    return { success: false, error: message }
  }
}

// Borrower responds to an information request
const respondRequestSchema = z.object({
  requestId: z.string().min(1),
  borrowerResponse: z.string().min(3, 'Response must be at least 3 characters'),
  documentUrl: z.string().optional(),
})

export async function respondToInformationRequestAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { businessId, user } = await requireBusinessMembership()
    if (!db) return { success: false, error: 'Database service unavailable' }

    const requestId = formData.get('requestId')?.toString() ?? ''
    const borrowerResponse = formData.get('borrowerResponse')?.toString() ?? ''
    const documentUrl = formData.get('documentUrl')?.toString() ?? ''

    const parsed = respondRequestSchema.safeParse({
      requestId,
      borrowerResponse,
      documentUrl,
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid response' }
    }

    // Verify request belongs to an opportunity owned by this business
    const request = await db.informationRequest.findUnique({
      where: { id: parsed.data.requestId },
      include: { opportunity: true },
    })

    if (!request || request.opportunity.businessId !== businessId) {
      return { success: false, error: 'Unauthorized: request does not belong to your business' }
    }

    const docPayload = parsed.data.documentUrl ? [{ url: parsed.data.documentUrl, uploadedAt: new Date().toISOString() }] : null

    await db.informationRequest.update({
      where: { id: parsed.data.requestId },
      data: {
        status: 'RESPONDED',
        borrowerResponse: parsed.data.borrowerResponse,
        responseDocuments: docPayload ? JSON.parse(JSON.stringify(docPayload)) : undefined,
        respondedAt: new Date(),
      },
    })

    // Advance opportunity back to UNDER_REVIEW
    const opp = request.opportunity
    if (opp.status === 'AWAITING_INFORMATION') {
      const history = (opp.statusHistory as Array<{ from: string; to: string; at: string; reason?: string }>) || []
      history.push({
        from: opp.status,
        to: 'UNDER_REVIEW',
        at: new Date().toISOString(),
        reason: 'Borrower submitted requested underwriting response',
      })

      await db.opportunity.update({
        where: { id: opp.id },
        data: {
          status: 'UNDER_REVIEW',
          statusHistory: history,
        },
      })
    }

    await auditLog({
      actorId: user.id,
      actorType: 'USER',
      action: 'UPDATE',
      entityType: 'INFORMATION_REQUEST',
      entityId: request.id,
      metadata: {
        opportunityId: opp.id,
        status: 'RESPONDED',
      },
    })

    revalidatePath(`/account/opportunities/${opp.id}`)
    revalidatePath(`/provider/opportunities/${opp.id}`)

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to respond to information request'
    return { success: false, error: message }
  }
}
