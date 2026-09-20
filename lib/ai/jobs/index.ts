// ─── AI job persistence ────────────────────────────────────────────────────────
//
// Server-side only. Never import in client components.
// All AI operations are tracked here with full DB persistence.
//
// Mapping note: the DB AIJobType enum predates Phase 3. New operation types
// (IMAGE_ANALYSIS, ASSET_DESCRIPTION etc.) are mapped to the closest existing
// enum value. The operationType string on AIIntelligenceResult carries the
// precise type.

import { logger } from '@/lib/logging'
import { db } from '@/lib/db/client'

// Our internal type space — richer than the DB enum
export type AIJobType =
  | 'ASSET_CLASSIFICATION'
  | 'ASSET_DESCRIPTION'
  | 'ASSET_SPEC_EXTRACTION'
  | 'IMAGE_ANALYSIS'
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
  id:           string
  jobType:      AIJobType
  entityType?:  string
  entityId?:    string
  provider:     string
  model:        string
  status:       AIJobStatus
  inputSummary?:  string
  outputSummary?: string
  confidence?:    number
  promptTokens?:    number
  completionTokens?: number
  totalTokens?:     number
  durationMs?:    number
  errorMessage?:  string
  requiresReview: boolean
  reviewedAt?:    Date
  reviewedBy?:    string
  createdAt:    Date
  completedAt?: Date
}

export interface AIJobCreateInput {
  jobType:      AIJobType
  entityType?:  string
  entityId?:    string
  provider:     string
  model:        string
  inputSummary?: string
}

// ─── Map internal job types to DB enum values ─────────────────────────────────
// The DB AIJobType enum is fixed at Phase 2. We map Phase 3 types to the nearest valid value.
type DBJobType =
  | 'ASSET_CLASSIFICATION'
  | 'SUPPLIER_QUOTE_EXTRACTION'
  | 'DOCUMENT_EXTRACTION'
  | 'FINANCE_APPLICATION_ASSIST'
  | 'LENDER_MATCHING'
  | 'OFFER_NORMALISATION'
  | 'APPLICATION_COMPLETENESS'
  | 'ASSET_DESCRIPTION_GENERATION'
  | 'SEO_CONTENT_GENERATION'
  | 'INSIGHT_GENERATION'
  | 'CUSTOMER_ASSIST'
  | 'INTERNAL_OPERATIONS'

function toDBJobType(type: AIJobType): DBJobType {
  const map: Record<AIJobType, DBJobType> = {
    ASSET_CLASSIFICATION:  'ASSET_CLASSIFICATION',
    ASSET_DESCRIPTION:     'ASSET_DESCRIPTION_GENERATION',
    ASSET_SPEC_EXTRACTION: 'ASSET_CLASSIFICATION',      // nearest equivalent
    IMAGE_ANALYSIS:        'ASSET_CLASSIFICATION',      // vision = asset classification
    DOCUMENT_EXTRACTION:   'DOCUMENT_EXTRACTION',
    MARKET_RESEARCH:       'INSIGHT_GENERATION',
    VALUE_ANALYSIS:        'INSIGHT_GENERATION',
    FINANCE_ROUTING:       'FINANCE_APPLICATION_ASSIST',
    PROVIDER_MATCHING:     'LENDER_MATCHING',
    OPPORTUNITY_SUMMARY:   'INSIGHT_GENERATION',
    CONTENT_GENERATION:    'SEO_CONTENT_GENERATION',
  }
  return map[type] ?? 'INTERNAL_OPERATIONS'
}

// ─── DB-persistent job management ────────────────────────────────────────────

export async function createJob(input: AIJobCreateInput): Promise<AIJobRecord> {
  const now = new Date()

  if (db) {
    try {
      const record = await db.aIJob.create({
        data: {
          type:           toDBJobType(input.jobType),
          status:         'QUEUED',
          provider:       input.provider,
          model:          input.model,
          inputReference: input.inputSummary ?? input.jobType,
          entityType:     input.entityType ?? null,
          entityId:       input.entityId   ?? null,
        },
      })

      logger.info('AI job created', { jobId: record.id, jobType: input.jobType }, 'ai')

      return {
        id:             record.id,
        jobType:        input.jobType,
        entityType:     input.entityType,
        entityId:       input.entityId,
        provider:       input.provider,
        model:          input.model,
        status:         'PENDING',
        requiresReview: true,
        createdAt:      record.createdAt,
      }
    } catch (err) {
      logger.warn('DB job create failed — using fallback ID', {
        error: err instanceof Error ? err.message : String(err),
      }, 'ai')
    }
  }

  // Fallback: in-memory ID (DB not available)
  const fallbackId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  logger.info('AI job created (in-memory fallback)', { jobId: fallbackId, jobType: input.jobType }, 'ai')

  return {
    id:             fallbackId,
    jobType:        input.jobType,
    entityType:     input.entityType,
    entityId:       input.entityId,
    provider:       input.provider,
    model:          input.model,
    status:         'PENDING',
    requiresReview: true,
    createdAt:      now,
  }
}

export async function startJob(jobId: string): Promise<void> {
  if (!db) return
  try {
    await db.aIJob.update({
      where: { id: jobId },
      data:  { status: 'RUNNING', startedAt: new Date() },
    })
  } catch {
    // Non-fatal — job may have a fallback ID
  }
}

export async function completeJob(
  jobId: string,
  result: {
    outputSummary?:   string
    confidence?:      number
    promptTokens?:    number
    completionTokens?: number
    totalTokens?:     number
    durationMs?:      number
  },
): Promise<void> {
  logger.info('AI job completed', { jobId, confidence: result.confidence, tokens: result.totalTokens }, 'ai')

  if (!db) return
  try {
    await db.aIJob.update({
      where: { id: jobId },
      data: {
        status:          'COMPLETED',
        outputReference: result.outputSummary ?? null,
        promptTokens:    result.promptTokens    ?? null,
        completionTokens: result.completionTokens ?? null,
        totalTokens:     result.totalTokens      ?? null,
        completedAt:     new Date(),
      },
    })
  } catch {
    // Non-fatal
  }
}

export async function failJob(jobId: string, errorMessage: string): Promise<void> {
  logger.error('AI job failed', { jobId, errorMessage }, 'ai')

  if (!db) return
  try {
    await db.aIJob.update({
      where: { id: jobId },
      data: {
        status:      'FAILED',
        error:       errorMessage.slice(0, 1000),
        completedAt: new Date(),
      },
    })
  } catch {
    // Non-fatal
  }
}
