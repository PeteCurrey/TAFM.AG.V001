// ─── Session Management ────────────────────────────────────────────────────────
//
// Authoritative server-side session handling.
// Session tokens are cryptographically random 32-byte hex strings.
// Sessions are stored in the database and tied to HttpOnly, SameSite=Lax cookies.

import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/db/client'
import type { User, OrganisationMembership, ProviderMembership, Business, Lender } from '@prisma/client'

export const SESSION_COOKIE_NAME = 'tafm_session'
const SESSION_DURATION_DAYS = 30

export interface AuthenticatedUser extends User {
  organisations: (OrganisationMembership & { business: Business })[]
  providerMemberships: (ProviderMembership & { lender: Lender })[]
}

/**
 * Generate a cryptographically secure random session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a new persistent session for a user in the database
 * and attach the session cookie to the response.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expires = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)

  if (db) {
    await db.session.create({
      data: {
        sessionToken: token,
        userId,
        expires,
      },
    })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  })

  return token
}

/**
 * Validate the current session token from cookies against the database.
 * Returns the AuthenticatedUser with organisations and provider memberships,
 * or null if invalid or expired.
 */
export async function getSession(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token || !db) {
    return null
  }

  const session = await db.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        include: {
          organisations: {
            include: { business: true },
          },
          providerMemberships: {
            include: { lender: true },
          },
        },
      },
    },
  })

  if (!session) {
    return null
  }

  // Check expiration
  if (session.expires < new Date()) {
    await destroySession()
    return null
  }

  // Check if user is active
  if (session.user.status === 'SUSPENDED' || session.user.deletedAt) {
    return null
  }

  return session.user
}

/**
 * Revoke the current session in DB and clear the session cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token && db) {
    try {
      await db.session.delete({
        where: { sessionToken: token },
      })
    } catch {
      // Ignored if session already deleted
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}
