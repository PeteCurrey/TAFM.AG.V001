'use server'

import { z } from 'zod'
import { db } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'
import { auditService } from '@/lib/audit'
import { logger } from '@/lib/logging'
import { revalidatePath } from 'next/cache'

const feedbackSchema = z.object({
  severity: z.enum(['BLOCKER', 'HIGH', 'MEDIUM', 'LOW']),
  category: z.enum([
    'REGISTRATION',
    'ONBOARDING',
    'ASSET_CREATION',
    'FINANCE_REQUIREMENT',
    'MATCHING',
    'PROVIDER_RESPONSE',
    'INFORMATION_REQUEST',
    'DOCUMENTS',
    'TERMINOLOGY',
    'OTHER',
  ]),
  userType: z.enum(['BORROWER', 'PROVIDER', 'ADMIN', 'BROKER']),
  summary: z.string().min(3).max(200),
  details: z.string().min(5).max(3000),
  opportunityId: z.string().optional().nullable(),
})

export interface FeedbackResult {
  success: boolean
  id?: string
  error?: string
}

export async function submitPilotFeedbackAction(
  input: z.infer<typeof feedbackSchema>
): Promise<FeedbackResult> {
  const parsed = feedbackSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    }
  }

  const { severity, category, userType, summary, details, opportunityId } = parsed.data

  try {
    const session = await getSession()
    const userId = session?.id ?? null

    const feedback = await db.pilotFeedback.create({
      data: {
        severity,
        category,
        userType,
        userId,
        opportunityId: opportunityId || null,
        summary,
        details,
        status: 'OPEN',
      },
    })

    await auditService.log({
      entity: 'PilotFeedback',
      entityId: feedback.id,
      action: 'CREATE',
      actorId: userId ?? 'ANONYMOUS',
      actorType: 'USER',
      after: {
        severity,
        category,
        summary,
        userType,
      },
    })

    logger.info('Pilot feedback submitted', {
      id: feedback.id,
      severity,
      category,
      userType,
    }, 'app')

    revalidatePath('/admin/pilot-feedback')
    revalidatePath('/admin/pilot-operations')

    return {
      success: true,
      id: feedback.id,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error('Failed to submit pilot feedback', { error: msg }, 'app')
    return {
      success: false,
      error: 'Failed to record feedback. Please try again.',
    }
  }
}

export async function updatePilotFeedbackStatusAction({
  id,
  status,
  resolutionNotes,
}: {
  id: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DEFERRED'
  resolutionNotes?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return { success: false, error: 'Unauthorized' }
    }

    const updated = await db.pilotFeedback.update({
      where: { id },
      data: {
        status,
        resolutionNotes: resolutionNotes || null,
      },
    })

    await auditService.log({
      entity: 'PilotFeedback',
      entityId: id,
      action: 'UPDATE',
      actorId: session.id,
      actorType: 'USER',
      after: {
        status,
        resolutionNotes,
      },
    })

    revalidatePath('/admin/pilot-feedback')
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Unable to update status' }
  }
}
