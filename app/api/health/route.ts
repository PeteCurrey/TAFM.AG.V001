import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db/client'
import { getAIStatus } from '@/lib/ai/provider'
import { env } from '@/lib/config/env'

// ─── Health check endpoint ────────────────────────────────────────────────────
//
// Returns application health status for monitoring and deployment checks.
// NEVER exposes: API keys, connection strings, internal stack traces.

export async function GET(_req: NextRequest) {
  const dbHealth = await checkDatabaseHealth()
  const aiStatus = getAIStatus()

  const health = {
    status: dbHealth.connected ? 'healthy' : 'degraded',
    version: process.env.npm_package_version ?? '0.1.0',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbHealth.connected ? 'connected' : 'unavailable',
        // Never include connection string or error details
      },
      ai: {
        status: aiStatus.available ? 'configured' : 'not_configured',
        provider: aiStatus.provider,
        // Never include API keys
      },
    },
  }

  const statusCode = dbHealth.connected ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
