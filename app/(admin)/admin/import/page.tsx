import React from 'react'
import { CsvImportWorkspace } from '@/components/admin/CsvImportWorkspace'

export const revalidate = 0

export default function AdminImportPage() {
  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div>
        <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest mb-1">
          INGESTION PIPELINE
        </p>
        <h1 className="text-2xl font-light text-white tracking-tight">Controlled Data Import</h1>
        <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
          Import authentic manufacturers and market observations with preview verification, normalisation, and source attribution.
        </p>
      </div>

      <CsvImportWorkspace />
    </div>
  )
}
