// ─── AI usage tracking ────────────────────────────────────────────────────────
//
// Server-side only. Tracks token consumption and costs per provider/model.
// Never expose usage data to clients.

import { logger } from '@/lib/logging'

export interface UsageRecord {
  id: string
  timestamp: Date
  provider: string
  model: string
  jobType: string
  jobId?: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCostUSD?: number
}

export interface UsageSummary {
  provider: string
  model: string
  totalJobs: number
  totalTokens: number
  totalPromptTokens: number
  totalCompletionTokens: number
  estimatedTotalCostUSD?: number
  periodStart: Date
  periodEnd: Date
}

// ─── In-memory usage store (development only) ─────────────────────────────────
// Production: persist to database — usage tracking is required for cost control

const usageStore: UsageRecord[] = []
let usageCounter = 0

// ─── Usage tracking functions ─────────────────────────────────────────────────

/**
 * Approximate cost per 1k tokens (indicative only, subject to change).
 * Update when provider pricing changes.
 */
const COST_PER_1K_TOKENS: Record<string, number> = {
  'gpt-4o':               0.005,
  'gpt-4o-mini':          0.00015,
  'gpt-4-turbo':          0.01,
  'gpt-3.5-turbo':        0.0005,
}

function estimateCost(model: string, totalTokens: number): number | undefined {
  const rate = COST_PER_1K_TOKENS[model]
  if (!rate) return undefined
  return Math.round((totalTokens / 1000) * rate * 10000) / 10000
}

export function recordUsage(params: {
  provider: string
  model: string
  jobType: string
  jobId?: string
  promptTokens: number
  completionTokens: number
}): UsageRecord {
  const record: UsageRecord = {
    id: `usage_${Date.now()}_${++usageCounter}`,
    timestamp: new Date(),
    provider: params.provider,
    model: params.model,
    jobType: params.jobType,
    jobId: params.jobId,
    promptTokens: params.promptTokens,
    completionTokens: params.completionTokens,
    totalTokens: params.promptTokens + params.completionTokens,
    estimatedCostUSD: estimateCost(params.model, params.promptTokens + params.completionTokens),
  }

  usageStore.push(record)

  logger.info('Usage recorded', {
    provider: record.provider,
    model: record.model,
    tokens: record.totalTokens,
    estimatedCostUSD: record.estimatedCostUSD,
  }, 'ai')

  return record
}

export function getUsageSummary(
  provider?: string,
  since?: Date,
): UsageSummary[] {
  const start = since ?? new Date(0)
  const end = new Date()

  const filtered = usageStore.filter(
    (r) => r.timestamp >= start && (!provider || r.provider === provider),
  )

  // Group by provider + model
  const groups = new Map<string, UsageRecord[]>()
  for (const record of filtered) {
    const key = `${record.provider}::${record.model}`
    const group = groups.get(key) ?? []
    group.push(record)
    groups.set(key, group)
  }

  return Array.from(groups.entries()).map(([key, records]) => {
    const [prov, model] = key.split('::')
    return {
      provider: prov,
      model,
      totalJobs: records.length,
      totalTokens: records.reduce((s, r) => s + r.totalTokens, 0),
      totalPromptTokens: records.reduce((s, r) => s + r.promptTokens, 0),
      totalCompletionTokens: records.reduce((s, r) => s + r.completionTokens, 0),
      estimatedTotalCostUSD: records.reduce(
        (s, r) => s + (r.estimatedCostUSD ?? 0), 0,
      ),
      periodStart: start,
      periodEnd: end,
    }
  })
}

export function getTotalUsage(): {
  totalJobs: number
  totalTokens: number
  estimatedTotalCostUSD: number
} {
  return {
    totalJobs: usageStore.length,
    totalTokens: usageStore.reduce((s, r) => s + r.totalTokens, 0),
    estimatedTotalCostUSD: usageStore.reduce(
      (s, r) => s + (r.estimatedCostUSD ?? 0), 0,
    ),
  }
}
