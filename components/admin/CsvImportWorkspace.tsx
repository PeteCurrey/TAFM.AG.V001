'use client'

import React, { useState, useTransition } from 'react'
import { previewImportAction, commitImportAction } from '@/app/actions/import'
import type { ImportPreviewResult, ImportCommitResult } from '@/lib/data/csv-import-service'

const SAMPLE_MANUFACTURERS = `name,website,country
Ruthmann,https://www.ruthmann.de,Germany
Scania,https://www.scania.com,Sweden
Palfinger,https://www.palfinger.com,Austria
JCB,https://www.jcb.com,United Kingdom
Caterpillar,https://www.cat.com,United States`

const SAMPLE_MARKET_DATA = `assetName,observationType,observedValue,source,date
Ruthmann STEIGER T 650 HF,SALE_PRICE,385000,AUCTION_RESULT,2026-02-15
Scania P360 8x4 Platform,ASKING_PRICE,185000,DEALER_LISTING,2026-03-01
JCB 3CX Eco,SALE_PRICE,62000,DEALER_LISTING,2026-01-20`

export function CsvImportWorkspace() {
  const [entityType, setEntityType] = useState<'manufacturer' | 'market_observation'>('manufacturer')
  const [csvText, setCsvText] = useState(SAMPLE_MANUFACTURERS)
  const [sourceSlug, setSourceSlug] = useState('verified-industry-import')
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null)
  const [commitResult, setCommitResult] = useState<ImportCommitResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTypeChange = (type: 'manufacturer' | 'market_observation') => {
    setEntityType(type)
    setPreview(null)
    setCommitResult(null)
    setError(null)
    setCsvText(type === 'manufacturer' ? SAMPLE_MANUFACTURERS : SAMPLE_MARKET_DATA)
    setSourceSlug(type === 'manufacturer' ? 'verified-industry-import' : 'verified-auction-import')
  }

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCommitResult(null)
    startTransition(async () => {
      const res = await previewImportAction(entityType, csvText)
      if (res.success && res.preview) {
        setPreview(res.preview)
      } else {
        setError(res.error ?? 'Preview failed')
      }
    })
  }

  const handleCommit = () => {
    setError(null)
    startTransition(async () => {
      const res = await commitImportAction(entityType, csvText, sourceSlug)
      if (res.success && res.result) {
        setCommitResult(res.result)
        setPreview(null)
      } else {
        setError(res.error ?? 'Commit failed')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('manufacturer')}
          className={`py-2 px-4 text-xs font-mono uppercase tracking-wider transition-colors border ${
            entityType === 'manufacturer'
              ? 'bg-[#FF6A1A] text-white border-[#FF6A1A]'
              : 'bg-[#121212] text-[var(--color-text-on-dark-muted)] border-[var(--color-border-dark)] hover:text-white'
          }`}
        >
          Manufacturers Dataset
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('market_observation')}
          className={`py-2 px-4 text-xs font-mono uppercase tracking-wider transition-colors border ${
            entityType === 'market_observation'
              ? 'bg-[#FF6A1A] text-white border-[#FF6A1A]'
              : 'bg-[#121212] text-[var(--color-text-on-dark-muted)] border-[var(--color-border-dark)] hover:text-white'
          }`}
        >
          Market Observations Dataset
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs">
          {error}
        </div>
      )}

      {commitResult && (
        <div className="border border-emerald-800 bg-emerald-950/30 p-6 space-y-2">
          <p className="text-xs font-mono text-emerald-400 uppercase">
            IMPORT JOB COMMITTED &middot; {commitResult.reference}
          </p>
          <h3 className="text-base font-medium text-white">Import Committed Successfully</h3>
          <p className="text-xs text-[var(--color-text-on-dark-2)]">
            Processed {commitResult.recordsSeen} records. Created {commitResult.recordsCreated} new entities. Rejected {commitResult.recordsRejected} records.
          </p>
        </div>
      )}

      {/* CSV Input Form */}
      <form onSubmit={handlePreview} className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-white">
              Paste or Edit CSV Records
            </h3>
            <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-0.5">
              Every import undergoes validation, normalisation, and duplicate detection prior to commit.
            </p>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
              Source Attribution Slug
            </label>
            <input
              type="text"
              value={sourceSlug}
              onChange={(e) => setSourceSlug(e.target.value)}
              className="bg-[#121212] border border-[var(--color-border-dark)] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6A1A] font-mono"
            />
          </div>
        </div>

        <div>
          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] p-3 text-xs text-white font-mono focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white text-xs font-mono uppercase py-2.5 px-6 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Validating CSV...' : 'Generate import preview &rarr;'}
        </button>
      </form>

      {/* Preview Section */}
      {preview && (
        <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-dark)] pb-4">
            <div>
              <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">
                PREVIEW REPORT
              </p>
              <h3 className="text-base font-medium text-white">Validation &amp; Duplicate Analysis</h3>
            </div>
            <button
              type="button"
              disabled={isPending || preview.ready + preview.requireReview === 0}
              onClick={handleCommit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase py-2 px-5 transition-colors disabled:opacity-40"
            >
              Commit import ({preview.ready + preview.requireReview} records) &rarr;
            </button>
          </div>

          {/* Breakdown summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)] text-center">
              <p className="text-lg font-light text-white font-mono">{preview.recordsDetected}</p>
              <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase mt-0.5">Detected</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)] text-center">
              <p className="text-lg font-light text-emerald-400 font-mono">{preview.ready}</p>
              <p className="text-[10px] text-emerald-400 uppercase mt-0.5">Ready to Commit</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)] text-center">
              <p className="text-lg font-light text-amber-400 font-mono">{preview.requireReview}</p>
              <p className="text-[10px] text-amber-400 uppercase mt-0.5">Require Review</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)] text-center">
              <p className="text-lg font-light text-purple-400 font-mono">{preview.potentialDuplicates}</p>
              <p className="text-[10px] text-purple-400 uppercase mt-0.5">Duplicates</p>
            </div>
            <div className="p-3 bg-[#121212] border border-[var(--color-border-dark)] text-center">
              <p className="text-lg font-light text-red-400 font-mono">{preview.invalid}</p>
              <p className="text-[10px] text-red-400 uppercase mt-0.5">Invalid</p>
            </div>
          </div>

          {/* Records Table */}
          <div className="border border-[var(--color-border-dark)] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)] text-[10px] uppercase font-mono bg-[#111111]">
                  <th className="py-2.5 px-3">Row</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Entity Name</th>
                  <th className="py-2.5 px-3">Notes / Duplicate Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {preview.previewRecords.map((r) => (
                  <tr key={r.rowIndex} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono text-[var(--color-text-on-dark-muted)]">{r.rowIndex}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-[9px] font-mono uppercase ${
                        r.status === 'READY' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' :
                        r.status === 'REQUIRE_REVIEW' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                        r.status === 'DUPLICATE' ? 'bg-purple-950/60 text-purple-400 border border-purple-800' :
                        'bg-red-950/60 text-red-400 border border-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-white">{r.name}</td>
                    <td className="py-2.5 px-3 text-[var(--color-text-on-dark-muted)]">{r.reason ?? 'Verified schema match'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
