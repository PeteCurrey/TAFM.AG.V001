'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/context'
import { applyResolutionDecision } from '@/lib/data/entity-resolution'
import { revalidatePath } from 'next/cache'

const resolveSchema = z.object({
  candidateId: z.string().min(1),
  action: z.enum(['MERGE', 'REJECT']),
  targetEntityId: z.string().optional(),
  reason: z.string().optional(),
})

export async function resolveEntityCandidateAction(
  formData: FormData,
): Promise<void> {
  try {
    const admin = await requireAdmin()

    const candidateId = formData.get('candidateId')?.toString() ?? ''
    const action = formData.get('action')?.toString() ?? ''
    const targetEntityId = formData.get('targetEntityId')?.toString() || undefined
    const reason = formData.get('reason')?.toString() || undefined

    const parsed = resolveSchema.safeParse({
      candidateId,
      action,
      targetEntityId,
      reason,
    })

    if (!parsed.success) {
      return
    }

    await applyResolutionDecision({
      candidateId: parsed.data.candidateId,
      action: parsed.data.action,
      targetEntityId: parsed.data.targetEntityId,
      reviewerId: admin.id,
      reason: parsed.data.reason,
    })

    revalidatePath('/admin/entity-resolution')
    revalidatePath('/admin/manufacturers')
    revalidatePath('/admin/data-readiness')
  } catch {
    // Audit handled within applyResolutionDecision
  }
}
