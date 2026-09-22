// ─── Authorization & Context Guards ───────────────────────────────────────────
//
// Server-side authoritative security helpers.
// Used across Server Actions and Route Handlers.
// Never trusts client-provided identity or role parameters.

import { redirect } from 'next/navigation'
import { getSession, type AuthenticatedUser } from './session'
import type { UserRole } from '@prisma/client'

/**
 * Require an authenticated session.
 * If none exists, redirects to /sign-in with return URL.
 */
export async function requireAuth(returnUrl?: string): Promise<AuthenticatedUser> {
  const user = await getSession()
  if (!user) {
    const dest = returnUrl ? `/sign-in?returnUrl=${encodeURIComponent(returnUrl)}` : '/sign-in'
    redirect(dest)
  }
  return user
}

/**
 * Require the current user to have one of the specified roles.
 * Redirects to / if unauthorized.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect('/')
  }
  return user
}

/**
 * Require an active ADMIN or SUPER_ADMIN role.
 * Redirects to / if not admin.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole(['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Require the current user to be a verified member of a specific business organisation.
 * If businessId is omitted, returns the user's primary business membership.
 */
export async function requireBusinessMembership(businessId?: string): Promise<{
  user: AuthenticatedUser
  businessId: string
  role: string
}> {
  const user = await requireAuth()

  if (businessId) {
    const membership = user.organisations.find((m) => m.businessId === businessId)
    if (!membership && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      redirect('/account')
    }
    return {
      user,
      businessId,
      role: membership?.role ?? 'ADMIN_OVERRIDE',
    }
  }

  // Find primary organisation or fallback
  const firstMembership = user.organisations[0]
  if (!firstMembership && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/apply')
  }

  return {
    user,
    businessId: firstMembership?.businessId ?? '',
    role: firstMembership?.role ?? 'ADMIN_OVERRIDE',
  }
}

/**
 * Require the current user to be an authorized member of a specific provider organisation.
 * Prevents IDOR attacks where a provider user attempts to query another provider's data.
 */
export async function requireProviderMembership(lenderId?: string): Promise<{
  user: AuthenticatedUser
  lenderId: string
  role: string
}> {
  const user = await requireAuth()

  if (lenderId) {
    const membership = user.providerMemberships.find((m) => m.lenderId === lenderId)
    if (!membership && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      redirect('/provider')
    }
    return {
      user,
      lenderId,
      role: membership?.role ?? 'ADMIN_OVERRIDE',
    }
  }

  // Find primary provider membership
  const firstMembership = user.providerMemberships[0]
  if (!firstMembership && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/for-providers')
  }

  return {
    user,
    lenderId: firstMembership?.lenderId ?? '',
    role: firstMembership?.role ?? 'ADMIN_OVERRIDE',
  }
}
