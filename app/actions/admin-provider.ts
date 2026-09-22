'use server'

import { z } from 'zod'
import { db } from '@/lib/db/client'
import { requireAdmin } from '@/lib/auth/context'
import { auditService } from '@/lib/audit'
import { revalidatePath } from 'next/cache'
import { hashPassword } from '@/lib/auth/password'
import type { LenderStatus, DataStatus } from '@prisma/client'

// ─── Admin Provider Verification & Criteria Actions (Phase 5) ─────────────────

const verificationChecklistSchema = z.object({
  lenderId:         z.string().min(1),
  companyVerified:  z.boolean(),
  websiteVerified:  z.boolean(),
  contactVerified:  z.boolean(),
  productsVerified: z.boolean(),
  criteriaVerified: z.boolean(),
  profileApproved:  z.boolean(),
  status:           z.enum(['APPLIED', 'UNDER_REVIEW', 'VERIFIED', 'ACTIVE', 'INACTIVE', 'PENDING_ONBOARDING', 'SUSPENDED', 'REJECTED']),
  isPubliclyListed: z.boolean(),
  notes:            z.string().optional(),
})

export async function updateProviderVerification(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin()

  if (!db) {
    return { success: false, error: 'Database service unavailable' }
  }

  const lenderId = formData.get('lenderId')?.toString() ?? ''
  const companyVerified = formData.get('companyVerified') === 'true'
  const websiteVerified = formData.get('websiteVerified') === 'true'
  const contactVerified = formData.get('contactVerified') === 'true'
  const productsVerified = formData.get('productsVerified') === 'true'
  const criteriaVerified = formData.get('criteriaVerified') === 'true'
  const profileApproved = formData.get('profileApproved') === 'true'
  const status = (formData.get('status')?.toString() ?? 'UNDER_REVIEW') as LenderStatus
  const isPubliclyListed = formData.get('isPubliclyListed') === 'true'
  const notes = formData.get('notes')?.toString() ?? ''

  const parsed = verificationChecklistSchema.safeParse({
    lenderId,
    companyVerified,
    websiteVerified,
    contactVerified,
    productsVerified,
    criteriaVerified,
    profileApproved,
    status,
    isPubliclyListed,
    notes,
  })

  if (!parsed.success) {
    return { success: false, error: 'Invalid verification parameters' }
  }

  const prev = await db.lender.findUnique({ where: { id: lenderId } })
  if (!prev) return { success: false, error: 'Provider not found' }

  const verificationStatus: DataStatus = (companyVerified && contactVerified && productsVerified)
    ? 'VERIFIED'
    : (companyVerified || websiteVerified)
    ? 'PROVISIONAL'
    : 'UNKNOWN'

  await db.lender.update({
    where: { id: lenderId },
    data: {
      companyVerified,
      websiteVerified,
      contactVerified,
      productsVerified,
      criteriaVerified,
      profileApproved,
      status,
      isPubliclyListed,
      verificationStatus,
      verifiedById: admin.id,
      notes: notes || prev.notes,
      updatedAt: new Date(),
    },
  })

  await auditService.log({
    entity: 'Lender',
    entityId: lenderId,
    action: 'VERIFY',
    actorId: admin.id,
    actorType: 'USER',
    before: { status: prev.status, verificationStatus: prev.verificationStatus },
    after: { status, verificationStatus, companyVerified, profileApproved },
    reason: notes || 'Admin verification update',
  })

  revalidatePath(`/admin/providers/${lenderId}`)
  revalidatePath('/admin/providers')
  return { success: true }
}

const criteriaInputSchema = z.object({
  lenderId:              z.string().min(1),
  minAmount:             z.number().min(0),
  maxAmount:             z.number().positive(),
  minTermMonths:         z.number().int().positive(),
  maxTermMonths:         z.number().int().positive(),
  geographyUKOnly:       z.boolean(),
  newAssetsOnly:         z.boolean(),
  usedAssetsConsidered:  z.boolean(),
  maxAssetAgeYears:      z.number().int().optional(),
  minBusinessAgeMonths:  z.number().int().optional(),
  minAnnualTurnover:     z.number().optional(),
  assetCategories:       z.array(z.string()),
  financeStructures:     z.array(z.string()),
  businessTypes:         z.array(z.string()),
  reason:                z.string().min(1, 'Reason for criteria change is mandatory for audit trail'),
})

export async function saveProviderCriteria(
  input: z.infer<typeof criteriaInputSchema>,
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin()

  if (!db) {
    return { success: false, error: 'Database service unavailable' }
  }

  const parsed = criteriaInputSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid criteria parameters' }
  }

  const data = parsed.data
  const now = new Date()

  // Find existing criteria
  const existingCriteria = await db.providerCriteria.findUnique({
    where: { lenderId: data.lenderId },
  })

  // Get current highest version number
  const latestVersion = await db.providerCriteriaVersion.findFirst({
    where: { lenderId: data.lenderId },
    orderBy: { versionNumber: 'desc' },
  })

  const newVersionNumber = (latestVersion?.versionNumber ?? 0) + 1

  // Close previous active version
  if (latestVersion && !latestVersion.effectiveTo) {
    await db.providerCriteriaVersion.update({
      where: { id: latestVersion.id },
      data: { effectiveTo: now, isActive: false },
    })
  }

  // Snapshot new criteria version
  const criteriaSnapshot = {
    assetCategories:      data.assetCategories,
    financeStructures:    data.financeStructures,
    minAmount:            data.minAmount,
    maxAmount:            data.maxAmount,
    minTermMonths:        data.minTermMonths,
    maxTermMonths:        data.maxTermMonths,
    geographyUKOnly:      data.geographyUKOnly,
    businessTypes:        data.businessTypes,
    maxAssetAgeYears:     data.maxAssetAgeYears,
    newAssetsOnly:        data.newAssetsOnly,
    usedAssetsConsidered: data.usedAssetsConsidered,
    minBusinessAgeMonths: data.minBusinessAgeMonths,
    minAnnualTurnover:    data.minAnnualTurnover,
    updatedAt:            now.toISOString(),
    updatedBy:            admin.id,
  }

  const newVersion = await db.providerCriteriaVersion.create({
    data: {
      lenderId:      data.lenderId,
      versionNumber: newVersionNumber,
      criteria:      criteriaSnapshot as any,
      effectiveFrom: now,
      changedBy:     admin.id,
      reason:        data.reason,
      source:        'ADMIN',
      isActive:      true,
    },
  })

  // Update or create active ProviderCriteria
  await db.providerCriteria.upsert({
    where: { lenderId: data.lenderId },
    create: {
      lenderId:              data.lenderId,
      assetCategories:       data.assetCategories,
      financeStructures:     data.financeStructures,
      minAmount:             data.minAmount,
      maxAmount:             data.maxAmount,
      minTermMonths:         data.minTermMonths,
      maxTermMonths:         data.maxTermMonths,
      geographyUKOnly:       data.geographyUKOnly,
      businessTypes:         data.businessTypes,
      maxAssetAgeYears:      data.maxAssetAgeYears ?? null,
      newAssetsOnly:         data.newAssetsOnly,
      usedAssetsConsidered:  data.usedAssetsConsidered,
      minBusinessAgeMonths:  data.minBusinessAgeMonths ?? null,
      minAnnualTurnover:     data.minAnnualTurnover ?? null,
      notes:                 data.reason,
      isActive:              true,
    },
    update: {
      assetCategories:       data.assetCategories,
      financeStructures:     data.financeStructures,
      minAmount:             data.minAmount,
      maxAmount:             data.maxAmount,
      minTermMonths:         data.minTermMonths,
      maxTermMonths:         data.maxTermMonths,
      geographyUKOnly:       data.geographyUKOnly,
      businessTypes:         data.businessTypes,
      maxAssetAgeYears:      data.maxAssetAgeYears ?? null,
      newAssetsOnly:         data.newAssetsOnly,
      usedAssetsConsidered:  data.usedAssetsConsidered,
      minBusinessAgeMonths:  data.minBusinessAgeMonths ?? null,
      minAnnualTurnover:     data.minAnnualTurnover ?? null,
      notes:                 data.reason,
      isActive:              true,
      updatedAt:             now,
    },
  })

  // Update lender criteriaVerified flag
  await db.lender.update({
    where: { id: data.lenderId },
    data: { criteriaVerified: true, updatedAt: now },
  })

  await auditService.log({
    entity: 'ProviderCriteria',
    entityId: data.lenderId,
    action: 'UPDATE',
    actorId: admin.id,
    actorType: 'USER',
    after: { versionNumber: newVersionNumber, reason: data.reason },
    reason: data.reason,
  })

  revalidatePath(`/admin/providers/${data.lenderId}`)
  return { success: true }
}

export async function addProviderUser(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin()

  if (!db) {
    return { success: false, error: 'Database service unavailable' }
  }

  const lenderId = formData.get('lenderId')?.toString() ?? ''
  const email = formData.get('email')?.toString().toLowerCase().trim() ?? ''
  const firstName = formData.get('firstName')?.toString().trim() ?? 'Provider'
  const lastName = formData.get('lastName')?.toString().trim() ?? 'User'
  const role = formData.get('role')?.toString().trim() ?? 'MEMBER'

  if (!lenderId || !email) {
    return { success: false, error: 'Email and provider ID are required' }
  }

  // Find or create user
  let user = await db.user.findUnique({ where: { email } })
  if (!user) {
    const tempPassword = await hashPassword('TempProvider123!')
    user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        role: 'PROVIDER',
        status: 'ACTIVE',
        passwordHash: tempPassword,
        lenderId,
      },
    })
  } else {
    await db.user.update({
      where: { id: user.id },
      data: { role: 'PROVIDER', lenderId },
    })
  }

  // Create ProviderMembership
  await db.providerMembership.upsert({
    where: {
      userId_lenderId: {
        userId: user.id,
        lenderId,
      },
    },
    create: {
      userId: user.id,
      lenderId,
      role,
    },
    update: {
      role,
      updatedAt: new Date(),
    },
  })

  await auditService.log({
    entity: 'ProviderMembership',
    entityId: `${user.id}:${lenderId}`,
    action: 'CREATE',
    actorId: admin.id,
    actorType: 'USER',
    after: { email, lenderId, role },
  })

  revalidatePath(`/admin/providers/${lenderId}`)
  return { success: true }
}
