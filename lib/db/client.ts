import { PrismaClient } from '@prisma/client'
import { logger } from '@/lib/logging'

// ─── Prisma client singleton ───────────────────────────────────────────────────
//
// Prevents multiple Prisma Client instances during hot-reloading in development.
// See: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Strip surrounding quotes from DATABASE_URL — Vercel can store the literal
  // quoted string if the env var was copy-pasted with quotes from a .env file.
  // Must be done here (not in env.ts) to avoid webpack's DefinePlugin turning
  // NEXT_PUBLIC_ LValue assignments into invalid syntax at build time.
  const rawDbUrl = process.env.DATABASE_URL
  if (rawDbUrl) {
    const clean = rawDbUrl.trim().replace(/^["']+|["']+$/g, '').trim()
    if (clean !== rawDbUrl) process.env.DATABASE_URL = clean
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
  })
}

export const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma

  // Log queries in development (not in production — may contain sensitive data)
  // @ts-expect-error — Prisma event typing
  prisma.$on('query', (e: { query: string; duration: number }) => {
    logger.info('DB Query', { duration: `${e.duration}ms` })
  })
}

// ─── Connection health check ───────────────────────────────────────────────────

/**
 * Check whether the database is reachable.
 * Used in the health endpoint — does not expose connection details.
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean
  error?: string
}> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { connected: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    // Log internally but return sanitised status
    logger.error('Database health check failed', { error: message }, 'db')
    return { connected: false, error: 'Database unreachable' }
  }
}

export default prisma

// ── Named alias — Phase 3+ files import { db } for readability
// db is null-safe in nature: always defined when DATABASE_URL is present,
// callers guard with `if (db)` for graceful degradation when DB is absent.
export const db = prisma
