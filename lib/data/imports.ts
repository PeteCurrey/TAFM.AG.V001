// ─── Import job lifecycle ──────────────────────────────────────────────────────
//
// Every data import must create an ImportJob record.
// No silent imports. Every record seen/created/rejected/needing-review is tracked.

import { db } from '@/lib/db/client'
import type { ImportJob, ImportFormat } from '@prisma/client'
import { logger } from '@/lib/logging'

export type { ImportJob }

export interface CreateImportJobInput {
  sourceId?:   string
  format:      ImportFormat
  entityType:  string
  notes?:      string
  triggeredBy?: string
}

export interface ImportProgress {
  recordsSeen:          number
  recordsCreated:       number
  recordsUpdated:       number
  recordsRejected:      number
  recordsNeedingReview: number
  errors?:              unknown[]
}

export async function createImportJob(input: CreateImportJobInput): Promise<ImportJob> {
  const job = await db.importJob.create({
    data: {
      sourceId:   input.sourceId,
      format:     input.format,
      entityType: input.entityType,
      notes:      input.notes,
      triggeredBy: input.triggeredBy ?? 'SYSTEM',
      status:     'PENDING',
    },
  })

  logger.info('Import job created', {
    jobId:      job.id,
    entityType: job.entityType,
    format:     job.format,
    sourceId:   job.sourceId,
  }, 'integration')

  return job
}

export async function startImportJob(id: string): Promise<void> {
  await db.importJob.update({
    where: { id },
    data: { status: 'RUNNING', startedAt: new Date() },
  })
}

export async function updateImportProgress(
  id: string,
  progress: Partial<ImportProgress>,
): Promise<void> {
  await db.importJob.update({
    where: { id },
    data: {
      recordsSeen:          progress.recordsSeen,
      recordsCreated:       progress.recordsCreated,
      recordsUpdated:       progress.recordsUpdated,
      recordsRejected:      progress.recordsRejected,
      recordsNeedingReview: progress.recordsNeedingReview,
    },
  })
}

export async function finaliseImportJob(
  id: string,
  result: ImportProgress & { hasErrors?: boolean },
): Promise<ImportJob> {
  const status = result.hasErrors ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED'

  const job = await db.importJob.update({
    where: { id },
    data: {
      status,
      completedAt:          new Date(),
      recordsSeen:          result.recordsSeen,
      recordsCreated:       result.recordsCreated,
      recordsUpdated:       result.recordsUpdated,
      recordsRejected:      result.recordsRejected,
      recordsNeedingReview: result.recordsNeedingReview,
      errors:               result.errors ? (result.errors as any) : undefined,
    },
  })

  logger.info('Import job completed', {
    jobId:   job.id,
    status,
    created: result.recordsCreated,
    updated: result.recordsUpdated,
    rejected: result.recordsRejected,
  }, 'integration')

  return job
}

export async function failImportJob(id: string, error: string): Promise<void> {
  await db.importJob.update({
    where: { id },
    data: {
      status:      'FAILED',
      completedAt: new Date(),
      errors:      [{ message: error, at: new Date().toISOString() }] as any,
    },
  })

  logger.warn('Import job failed', { jobId: id, error }, 'integration')
}
