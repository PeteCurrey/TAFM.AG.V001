// ─── Data source management ────────────────────────────────────────────────────
//
// CRUD helpers for DataSource records.
// Every externally sourced entity or observation must link to a DataSource.
// "Where did this number come from?" must always have an answer.

import { db } from '@/lib/db/client'
import type { DataSource, DataSourceStatus, DataSourceType } from '@prisma/client'

export type { DataSource }

export interface CreateDataSourceInput {
  slug:            string
  name:            string
  sourceType:      DataSourceType
  baseUrl?:        string
  trustLevel?:     number
  updateFrequency?: string
  notes?:          string
}

export interface ListDataSourcesFilter {
  sourceType?: DataSourceType
  status?:     DataSourceStatus
  isActive?:   boolean
}

export async function getDataSource(id: string): Promise<DataSource | null> {
  return db.dataSource.findUnique({ where: { id } })
}

export async function getDataSourceBySlug(slug: string): Promise<DataSource | null> {
  return db.dataSource.findUnique({ where: { slug } })
}

export async function listDataSources(
  filter: ListDataSourcesFilter = {},
): Promise<DataSource[]> {
  return db.dataSource.findMany({
    where: {
      sourceType: filter.sourceType,
      status:     filter.status,
      isActive:   filter.isActive ?? true,
    },
    orderBy: [{ trustLevel: 'desc' }, { name: 'asc' }],
  })
}

export async function createDataSource(input: CreateDataSourceInput): Promise<DataSource> {
  return db.dataSource.create({
    data: {
      slug:            input.slug,
      name:            input.name,
      sourceType:      input.sourceType,
      baseUrl:         input.baseUrl,
      trustLevel:      input.trustLevel ?? 1,
      updateFrequency: input.updateFrequency,
      notes:           input.notes,
    },
  })
}

/**
 * Record the outcome of an import attempt against this source.
 * Called after each ImportJob completes or fails.
 */
export async function updateSourceLastImport(
  id: string,
  success: boolean,
): Promise<void> {
  await db.dataSource.update({
    where: { id },
    data: {
      lastAttemptAt:          new Date(),
      lastSuccessfulImportAt: success ? new Date() : undefined,
    },
  })
}
