'use server'

import { requireAdmin } from '@/lib/auth/context'
import {
  previewCsvImport,
  commitCsvImport,
  type ImportPreviewResult,
  type ImportCommitResult,
} from '@/lib/data/csv-import-service'
import { revalidatePath } from 'next/cache'

export async function previewImportAction(
  entityType: 'manufacturer' | 'market_observation',
  csvText: string,
): Promise<{ success: boolean; preview?: ImportPreviewResult; error?: string }> {
  await requireAdmin()

  if (!csvText || !csvText.trim()) {
    return { success: false, error: 'CSV file or input text is empty' }
  }

  try {
    const preview = await previewCsvImport(entityType, csvText)
    return { success: true, preview }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function commitImportAction(
  entityType: 'manufacturer' | 'market_observation',
  csvText: string,
  sourceSlug: string,
): Promise<{ success: boolean; result?: ImportCommitResult; error?: string }> {
  const admin = await requireAdmin()

  if (!csvText || !csvText.trim()) {
    return { success: false, error: 'CSV data is required' }
  }

  try {
    const result = await commitCsvImport(entityType, csvText, sourceSlug || 'manual-admin-import', admin.id)

    if (entityType === 'manufacturer') {
      revalidatePath('/admin/manufacturers')
    } else {
      revalidatePath('/admin/market-data')
    }

    revalidatePath('/admin/data-quality')
    return { success: true, result }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}
