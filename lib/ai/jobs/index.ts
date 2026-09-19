// ─── AI job types ─────────────────────────────────────────────────────────────
//
// Server-side only. Never import in client components.
// All AI operations must be tracked through this system.

import { logger } from '@/lib/logging'

export type AIJobType =
  | 'ASSET_CLASSIFICATION'
  | 'ASSET_DESCRIPTION'
  | 'ASSET_SPEC_EXTRACTION'
  | 'DOCUMENT_EXTRACTION'
  | 'MARKET_RESEARCH'
  | 'VALUE_ANALYSIS'
  | 'FINANCE_ROUTING'
  | 'PROVIDER_MATCHING'
  | 'OPPORTUNITY_SUMMARY'
  | 'CONTENT_GENERATION'

export type AIJobStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'

export interface AIJobRecord {
  id: string
  jobType: AIJobType
  entityType?: string
  entityId?: string
  provider: string
  model: string
  status: AIJobStatus
  inputSummary?: string       // Non-sensitive summary only
  outputSummary?: string      // Non-sensitive summary only
  confidence?: number         // 0–1
  tokensUsed?: number
  durationMs?: number
  errorMessage?: string
  requiresReview: boolean
  reviewedAt?: Date
  reviewedBy?: string
  createdAt: Date
  completedAt?: Date
}

export interface AIJobCreateInput {
  jobType: AIJobType
  entityType?: string
  entityId?: string
  provider: string
  model: string
}

// ─── In-memory job store (development only) ───────────────────────────────────
// Production: replace with database persistence via Prisma

const jobStore = new Map<string, AIJobRecord>()

let jobCounter = 0
function generateJobId(): string {
  return `job_${Date.now()}_${++jobCounter}`
}

// ─── Job management functions ─────────────────────────────────────────────────

export function createJob(input: AIJobCreateInput): AIJobRecord {
  const job: AIJobRecord = {
    id: generateJobId(),
    jobType: input.jobType,
    entityType: input.entityType,
    entityId: input.entityId,
    provider: input.provider,
    model: input.model,
    status: 'PENDING',
    requiresReview: true, // All AI outputs require review by default
    createdAt: new Date(),
  }

  jobStore.set(job.id, job)
  logger.info('AI job created', { jobId: job.id, jobType: job.jobType }, 'ai')
  return job
}

export function startJob(jobId: string): AIJobRecord | null {
  const job = jobStore.get(jobId)
  if (!job) return null
  const updated = { ...job, status: 'RUNNING' as const }
  jobStore.set(jobId, updated)
  return updated
}

export function completeJob(
  jobId: string,
  result: {
    outputSummary?: string
    confidence?: number
    tokensUsed?: number
    durationMs?: number
  },
): AIJobRecord | null {
  const job = jobStore.get(jobId)
  if (!job) return null
  const updated: AIJobRecord = {
    ...job,
    status: 'COMPLETED',
    outputSummary: result.outputSummary,
    confidence: result.confidence,
    tokensUsed: result.tokensUsed,
    durationMs: result.durationMs,
    completedAt: new Date(),
  }
  jobStore.set(jobId, updated)
  logger.info('AI job completed', {
    jobId,
    confidence: result.confidence,
    tokens: result.tokensUsed,
  }, 'ai')
  return updated
}

export function failJob(jobId: string, errorMessage: string): AIJobRecord | null {
  const job = jobStore.get(jobId)
  if (!job) return null
  const updated: AIJobRecord = {
    ...job,
    status: 'FAILED',
    errorMessage,
    completedAt: new Date(),
  }
  jobStore.set(jobId, updated)
  logger.error('AI job failed', { jobId, errorMessage }, 'ai')
  return updated
}

export function getJob(jobId: string): AIJobRecord | null {
  return jobStore.get(jobId) ?? null
}

export function listJobs(entityId?: string): AIJobRecord[] {
  const jobs = Array.from(jobStore.values())
  if (entityId) return jobs.filter((j) => j.entityId === entityId)
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
