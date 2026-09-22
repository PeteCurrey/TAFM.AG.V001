'use server'

import { z } from 'zod'
import { db } from '@/lib/db/client'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { createSession, destroySession } from '@/lib/auth/session'
import { auditService } from '@/lib/audit'
import { rateLimit } from '@/lib/security/rateLimit'
import { redirect } from 'next/navigation'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  businessName: z.string().min(2, 'Business name is required').optional(),
  accountType: z.enum(['BUSINESS', 'PROVIDER']).default('BUSINESS'),
})

export interface AuthActionResult {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function signInAction(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = formData.get('email')?.toString().toLowerCase().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const returnUrl = formData.get('returnUrl')?.toString() || ''

  // Rate limiting: 5 attempts per 15 minutes per email
  const rl = rateLimit(`signin:${email}`, { limit: 5, windowMs: 15 * 60 * 1000 })
  if (!rl.allowed) {
    return {
      success: false,
      error: 'Too many sign-in attempts. Please wait 15 minutes before trying again.',
    }
  }

  const parsed = signInSchema.safeParse({ email, password })
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid email or password format.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  if (!db) {
    return { success: false, error: 'Database service is currently unavailable.' }
  }

  const user = await db.user.findUnique({
    where: { email },
    include: {
      organisations: { include: { business: true } },
      providerMemberships: { include: { lender: true } },
    },
  })

  if (!user || !user.passwordHash) {
    return { success: false, error: 'Invalid email or password.' }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return { success: false, error: 'Invalid email or password.' }
  }

  // Update last login
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  // Create session
  await createSession(user.id)

  await auditService.log({
    entity: 'User',
    entityId: user.id,
    action: 'ACCESS',
    actorId: user.id,
    actorType: 'USER',
    after: { email: user.email, role: user.role, type: 'SIGN_IN' },
  })

  // Determine redirection target
  let destination = '/account'
  if (returnUrl && returnUrl.startsWith('/')) {
    destination = returnUrl
  } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    destination = '/admin'
  } else if (user.role === 'PROVIDER' || user.providerMemberships.length > 0) {
    destination = '/provider'
  }

  redirect(destination)
}

export async function signUpAction(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = formData.get('email')?.toString().toLowerCase().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const firstName = formData.get('firstName')?.toString().trim() ?? ''
  const lastName = formData.get('lastName')?.toString().trim() ?? ''
  const businessName = formData.get('businessName')?.toString().trim() || undefined
  const accountType = (formData.get('accountType')?.toString() ?? 'BUSINESS') as 'BUSINESS' | 'PROVIDER'

  // Rate limiting: 3 registrations per hour per IP
  const rl = rateLimit(`signup:${email}`, { limit: 3, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return {
      success: false,
      error: 'Registration limit reached. Please try again later.',
    }
  }

  const parsed = signUpSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
    businessName,
    accountType,
  })

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  if (!db) {
    return { success: false, error: 'Database service is currently unavailable.' }
  }

  const existing = await db.user.findUnique({
    where: { email },
  })

  if (existing && existing.passwordHash) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in.',
    }
  }

  const hashedPassword = await hashPassword(password)
  const isBootstrapAdmin = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase() === email

  let targetRole = accountType === 'PROVIDER' ? 'PROVIDER' : 'BUSINESS'
  if (isBootstrapAdmin) {
    targetRole = 'ADMIN'
  }

  let user = existing
  if (existing) {
    // If existing placeholder user from earlier form, upgrade with password
    user = await db.user.update({
      where: { id: existing.id },
      data: {
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: targetRole as any,
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    })
  } else {
    // Create new user
    user = await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: targetRole as any,
        status: 'ACTIVE',
      },
    })
  }

  // Create Business organisation if businessName provided
  if (businessName && user) {
    const business = await db.business.create({
      data: {
        name: businessName,
        structure: 'LIMITED_COMPANY',
        ownerId: user.id,
        contactEmail: email,
        status: 'ACTIVE',
      },
    })

    await db.organisationMembership.create({
      data: {
        userId: user.id,
        businessId: business.id,
        role: 'OWNER',
      },
    })

    await db.user.update({
      where: { id: user.id },
      data: { businessId: business.id },
    })
  }

  // Auto-login upon registration
  if (user) {
    await createSession(user.id)
    await auditService.log({
      entity: 'User',
      entityId: user.id,
      action: 'CREATE',
      actorId: user.id,
      actorType: 'USER',
      after: { email, role: targetRole, type: 'SIGN_UP' },
    })
  }

  const dest = targetRole === 'ADMIN' ? '/admin' : targetRole === 'PROVIDER' ? '/provider' : '/account'
  redirect(dest)
}

export async function signOutAction(): Promise<void> {
  await destroySession()
  redirect('/sign-in')
}
