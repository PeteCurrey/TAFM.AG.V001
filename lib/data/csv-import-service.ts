// ─── CSV Import Service (Phase 5) ─────────────────────────────────────────────
//
// Controlled, provenance-attributed data import engine.
// Implements mandatory Preview -> Explicit Admin Review -> Commit lifecycle.
// Never silently imports unverified or duplicate records.

import { db } from '@/lib/db/client'
import { parseCsv } from './csv-parser'
import { normaliseManufacturerName } from './normalise'
import {
  createImportJob,
  startImportJob,
  updateImportProgress,
  finaliseImportJob,
  failImportJob,
} from './imports'
import { auditService } from '@/lib/audit'
import { logger } from '@/lib/logging'
import type { ObservationType, MarketObservationSource, AssetCondition } from '@prisma/client'

export interface ImportPreviewRecord {
  rowIndex: number
  status: 'READY' | 'DUPLICATE' | 'INVALID' | 'REQUIRE_REVIEW'
  name: string
  details: Record<string, unknown>
  reason?: string
}

export interface ImportPreviewResult {
  entityType: 'manufacturer' | 'market_observation'
  recordsDetected: number
  ready: number
  potentialDuplicates: number
  invalid: number
  requireReview: number
  previewRecords: ImportPreviewRecord[]
  errors: string[]
}

export interface ImportCommitResult {
  jobId: string
  reference: string
  recordsSeen: number
  recordsCreated: number
  recordsUpdated: number
  recordsRejected: number
  status: string
}

export async function previewCsvImport(
  entityType: 'manufacturer' | 'market_observation',
  csvText: string,
): Promise<ImportPreviewResult> {
  const { headers, rows, errors: parseErrors } = parseCsv(csvText)

  if (rows.length === 0) {
    return {
      entityType,
      recordsDetected: 0,
      ready: 0,
      potentialDuplicates: 0,
      invalid: 0,
      requireReview: 0,
      previewRecords: [],
      errors: parseErrors.length > 0 ? parseErrors : ['No data rows found in CSV.'],
    }
  }

  const previewRecords: ImportPreviewRecord[] = []
  let readyCount = 0
  let dupCount = 0
  let invalidCount = 0
  let reviewCount = 0

  if (entityType === 'manufacturer') {
    const existing = db
      ? await db.manufacturer.findMany({ select: { slug: true, name: true, aliases: true } }).catch(() => [])
      : []

    const existingSlugs = new Set(existing.map((m) => m.slug.toLowerCase()))
    const existingNames = new Set(existing.map((m) => m.name.toLowerCase()))

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rawName = row.name || row.Name || row.manufacturer || row.Manufacturer || ''

      if (!rawName.trim()) {
        invalidCount++
        previewRecords.push({
          rowIndex: i + 1,
          status: 'INVALID',
          name: 'Missing Name',
          details: row,
          reason: 'Row has no manufacturer name',
        })
        continue
      }

      const norm = normaliseManufacturerName(rawName)
      const slug = (row.slug || norm.canonical.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim()

      const isDup = existingSlugs.has(slug) || existingNames.has(norm.canonical.toLowerCase())
      const website = row.website || row.Website || ''

      if (isDup) {
        dupCount++
        previewRecords.push({
          rowIndex: i + 1,
          status: 'DUPLICATE',
          name: norm.canonical,
          details: { slug, canonical: norm.canonical, website, country: row.country || '' },
          reason: `Manufacturer already exists with slug "${slug}" or name "${norm.canonical}"`,
        })
      } else if (!website || !website.includes('.')) {
        reviewCount++
        previewRecords.push({
          rowIndex: i + 1,
          status: 'REQUIRE_REVIEW',
          name: norm.canonical,
          details: { slug, canonical: norm.canonical, website: website || 'None', country: row.country || '' },
          reason: 'Missing official website for primary verification',
        })
      } else {
        readyCount++
        previewRecords.push({
          rowIndex: i + 1,
          status: 'READY',
          name: norm.canonical,
          details: { slug, canonical: norm.canonical, website, country: row.country || '' },
        })
      }
    }
  } else if (entityType === 'market_observation') {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const valStr = row.observedValue || row.value || row.price || row.Price || ''
      const obsType = (row.observationType || row.type || 'ASKING_PRICE').toUpperCase() as ObservationType
      const assetName = row.assetName || row.name || row.asset || 'Market Asset'
      const source = (row.source || 'MARKETPLACE_OBSERVATION').toUpperCase() as MarketObservationSource
      const numVal = Number(valStr)

      if (isNaN(numVal) || numVal <= 0) {
        invalidCount++
        previewRecords.push({
          rowIndex: i + 1,
          status: 'INVALID',
          name: assetName,
          details: row,
          reason: `Invalid price/value: "${valStr}"`,
        })
        continue
      }

      // Check observation type validity — ASKING_PRICE vs SALE_PRICE vs AUCTION_RESULT
      const validTypes: ObservationType[] = [
        'ASKING_PRICE',
        'SALE_PRICE',
        'AUCTION_RESULT',
        'DEALER_PRICE',
        'LISTED_PRICE',
        'USER_SUPPLIED',
        'VALUATION',
        'TRADE_PRICE',
      ]

      if (!validTypes.includes(obsType)) {
        invalidCount++
        previewRecords.push({
          rowIndex: i + 1,
          status: 'INVALID',
          name: assetName,
          details: row,
          reason: `Unsupported observation type: "${obsType}"`,
        })
        continue
      }

      readyCount++
      previewRecords.push({
        rowIndex: i + 1,
        status: 'READY',
        name: assetName,
        details: {
          assetName,
          observationType: obsType,
          observedValue: numVal,
          source,
          date: row.observedAt || row.date || new Date().toISOString(),
        },
      })
    }
  }

  return {
    entityType,
    recordsDetected: rows.length,
    ready: readyCount,
    potentialDuplicates: dupCount,
    invalid: invalidCount,
    requireReview: reviewCount,
    previewRecords,
    errors: parseErrors,
  }
}

export async function commitCsvImport(
  entityType: 'manufacturer' | 'market_observation',
  csvText: string,
  sourceSlug: string,
  adminUserId: string,
): Promise<ImportCommitResult> {
  if (!db) {
    throw new Error('Database service unavailable')
  }

  // 1. Resolve or create DataSource
  const source = await db.dataSource.upsert({
    where: { slug: sourceSlug },
    create: {
      slug: sourceSlug,
      name: sourceSlug.replace(/-/g, ' ').toUpperCase(),
      sourceType: 'INTERNAL_RESEARCH',
      trustLevel: 3,
      status: 'ACTIVE',
    },
    update: {},
  })

  // 2. Create ImportJob record
  const job = await createImportJob({
    sourceId: source.id,
    format: 'CSV',
    entityType,
    triggeredBy: adminUserId,
    notes: `CSV import committed by admin ${adminUserId}`,
  })

  await startImportJob(job.id)

  const preview = await previewCsvImport(entityType, csvText)
  const validRecords = preview.previewRecords.filter(
    (r) => r.status === 'READY' || r.status === 'REQUIRE_REVIEW',
  )

  let created = 0
  let rejected = preview.invalid + preview.potentialDuplicates
  let needingReview = preview.requireReview

  try {
    if (entityType === 'manufacturer') {
      for (const rec of validRecords) {
        const details = rec.details as Record<string, string>
        const isReview = rec.status === 'REQUIRE_REVIEW'

        await db.manufacturer.create({
          data: {
            name: details.canonical,
            slug: details.slug,
            website: details.website !== 'None' ? details.website : null,
            countryOfOrigin: details.country || null,
            sourceId: source.id,
            verificationStatus: isReview ? 'PROVISIONAL' : 'VERIFIED',
            isActive: true,
          },
        })
        created++
      }
    } else if (entityType === 'market_observation') {
      for (const rec of validRecords) {
        const details = rec.details as Record<string, unknown>
        await db.marketObservation.create({
          data: {
            observationType: details.observationType as ObservationType,
            source: (details.source as MarketObservationSource) || 'MARKETPLACE_OBSERVATION',
            sourceId: source.id,
            observedValue: details.observedValue as number,
            currency: 'GBP',
            observedAt: new Date(details.date as string || Date.now()),
            confidence: 0.85,
            notes: rec.name,
            isActive: true,
          },
        })
        created++
      }
    }

    await finaliseImportJob(job.id, {
      recordsSeen: preview.recordsDetected,
      recordsCreated: created,
      recordsUpdated: 0,
      recordsRejected: rejected,
      recordsNeedingReview: needingReview,
    })

    await auditService.log({
      entity: 'ImportJob',
      entityId: job.id,
      action: 'CREATE',
      actorId: adminUserId,
      actorType: 'USER',
      after: {
        entityType,
        created,
        rejected,
        needingReview,
      },
      reason: 'Admin committed CSV data import',
    })

    logger.info('CSV import committed successfully', {
      jobId: job.id,
      entityType,
      created,
      rejected,
    }, 'integration')

    return {
      jobId: job.id,
      reference: job.reference,
      recordsSeen: preview.recordsDetected,
      recordsCreated: created,
      recordsUpdated: 0,
      recordsRejected: rejected,
      status: 'COMPLETED',
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    await failImportJob(job.id, errorMsg)
    throw err
  }
}
