import { logger } from '@/lib/logging'

// ─── Rate limiting ────────────────────────────────────────────────────────────
//
// In-memory rate limiter for Phase 1.
// Redis-backed implementation should be used in production for multi-instance deployments.
// Replace this module with ioredis or Upstash Redis when scaling.

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store — resets on server restart
// NOT suitable for multi-instance deployments
const store = new Map<string, RateLimitEntry>()

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 60_000) // Clean every minute

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  limit: number
}

/**
 * Check and increment rate limit for a given key.
 * Key should be derived from IP address + route, never from user data.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60_000 },
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // If no entry or window has expired, reset
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    store.set(key, newEntry)
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt: new Date(newEntry.resetAt),
      limit: config.limit,
    }
  }

  entry.count++

  if (entry.count > config.limit) {
    logger.security('Rate limit exceeded', { key: key.slice(0, 20) }) // Truncate key for logs
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.resetAt),
      limit: config.limit,
    }
  }

  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetAt: new Date(entry.resetAt),
    limit: config.limit,
  }
}

// ─── Rate limit configs ───────────────────────────────────────────────────────

export const RATE_LIMITS = {
  api: { limit: 60, windowMs: 60_000 },          // 60 req/min for general API
  aiEndpoints: { limit: 10, windowMs: 60_000 },   // 10 req/min for AI endpoints
  applicationSubmit: { limit: 5, windowMs: 300_000 }, // 5 submissions per 5 min
  contactForm: { limit: 3, windowMs: 300_000 },   // 3 contact submissions per 5 min
} as const
