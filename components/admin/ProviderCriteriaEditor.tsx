'use client'

import React, { useState, useTransition } from 'react'
import { saveProviderCriteria } from '@/app/actions/admin-provider'

interface Props {
  lenderId: string
  initialCriteria?: {
    minAmount: number
    maxAmount: number
    minTermMonths: number
    maxTermMonths: number
    geographyUKOnly: boolean
    newAssetsOnly: boolean
    usedAssetsConsidered: boolean
    maxAssetAgeYears?: number | null
    minBusinessAgeMonths?: number | null
    minAnnualTurnover?: number | null
    assetCategories: string[]
    financeStructures: string[]
    businessTypes: string[]
  } | null
}

const ALL_CATEGORIES = [
  { slug: 'construction-equipment', label: 'Construction Equipment' },
  { slug: 'commercial-vehicles',    label: 'Commercial Vehicles' },
  { slug: 'manufacturing-machinery',label: 'Manufacturing Machinery' },
  { slug: 'agricultural-equipment', label: 'Agricultural Equipment' },
  { slug: 'aviation-marine',        label: 'Aviation & Marine' },
  { slug: 'technology-it',          label: 'Technology & IT' },
]

const ALL_STRUCTURES = [
  'HIRE_PURCHASE',
  'FINANCE_LEASE',
  'OPERATING_LEASE',
  'ASSET_REFINANCE',
  'COMMERCIAL_LOAN',
]

const ALL_BUSINESS_TYPES = [
  'LIMITED_COMPANY',
  'LLP',
  'PARTNERSHIP',
  'SOLE_TRADER',
  'PLC',
]

export function ProviderCriteriaEditor({ lenderId, initialCriteria }: Props) {
  const [isPending, startTransition] = useTransition()
  const [minAmount, setMinAmount] = useState(initialCriteria?.minAmount ?? 10000)
  const [maxAmount, setMaxAmount] = useState(initialCriteria?.maxAmount ?? 500000)
  const [minTerm, setMinTerm] = useState(initialCriteria?.minTermMonths ?? 12)
  const [maxTerm, setMaxTerm] = useState(initialCriteria?.maxTermMonths ?? 60)
  const [ukOnly, setUkOnly] = useState(initialCriteria?.geographyUKOnly ?? true)
  const [newOnly, setNewOnly] = useState(initialCriteria?.newAssetsOnly ?? false)
  const [usedConsidered, setUsedConsidered] = useState(initialCriteria?.usedAssetsConsidered ?? true)
  const [maxAge, setMaxAge] = useState(initialCriteria?.maxAssetAgeYears ?? 7)
  const [minBizAge, setMinBizAge] = useState(initialCriteria?.minBusinessAgeMonths ?? 24)
  const [minTurnover, setMinTurnover] = useState(initialCriteria?.minAnnualTurnover ?? 100000)

  const [categories, setCategories] = useState<string[]>(initialCriteria?.assetCategories ?? [])
  const [structures, setStructures] = useState<string[]>(initialCriteria?.financeStructures ?? [])
  const [businessTypes, setBusinessTypes] = useState<string[]>(initialCriteria?.businessTypes ?? [])
  const [reason, setReason] = useState('')

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const toggleCategory = (slug: string) => {
    setCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    )
  }

  const toggleStructure = (str: string) => {
    setStructures((prev) =>
      prev.includes(str) ? prev.filter((s) => s !== str) : [...prev, str],
    )
  }

  const toggleBusinessType = (bt: string) => {
    setBusinessTypes((prev) =>
      prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setFeedback({ type: 'error', message: 'A reason for criteria update is required for the audit trail.' })
      return
    }

    setFeedback(null)
    startTransition(async () => {
      const res = await saveProviderCriteria({
        lenderId,
        minAmount: Number(minAmount),
        maxAmount: Number(maxAmount),
        minTermMonths: Number(minTerm),
        maxTermMonths: Number(maxTerm),
        geographyUKOnly: ukOnly,
        newAssetsOnly: newOnly,
        usedAssetsConsidered: usedConsidered,
        maxAssetAgeYears: maxAge ? Number(maxAge) : undefined,
        minBusinessAgeMonths: minBizAge ? Number(minBizAge) : undefined,
        minAnnualTurnover: minTurnover ? Number(minTurnover) : undefined,
        assetCategories: categories,
        financeStructures: structures,
        businessTypes,
        reason: reason.trim(),
      })

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Criteria version saved and snapshotted. Deterministic matching updated.',
        })
        setReason('')
      } else {
        setFeedback({ type: 'error', message: res.error ?? 'Save failed.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6 space-y-6">
      <div className="border-b border-[var(--color-border-dark)] pb-3">
        <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">DETERMINISTIC ELIGIBILITY</p>
        <h3 className="text-sm font-medium text-white">Lending Appetite &amp; Criteria Configuration</h3>
        <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1">
          Every change creates an immutable Criteria Version snapshot to preserve historical matching auditability.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Numeric Ranges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Min Facility (£)
          </label>
          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Max Facility (£)
          </label>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Min Term (Months)
          </label>
          <input
            type="number"
            value={minTerm}
            onChange={(e) => setMinTerm(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Max Term (Months)
          </label>
          <input
            type="number"
            value={maxTerm}
            onChange={(e) => setMaxTerm(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
      </div>

      {/* Asset Criteria */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Max Asset Age (Years)
          </label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Min Trading Age (Months)
          </label>
          <input
            type="number"
            value={minBizAge}
            onChange={(e) => setMinBizAge(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Min Annual Turnover (£)
          </label>
          <input
            type="number"
            value={minTurnover}
            onChange={(e) => setMinTurnover(Number(e.target.value))}
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
          <input
            type="checkbox"
            checked={ukOnly}
            onChange={(e) => setUkOnly(e.target.checked)}
            className="accent-[#FF6A1A]"
          />
          UK Geography Only
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
          <input
            type="checkbox"
            checked={usedConsidered}
            onChange={(e) => setUsedConsidered(e.target.checked)}
            className="accent-[#FF6A1A]"
          />
          Consider Used Assets
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
          <input
            type="checkbox"
            checked={newOnly}
            onChange={(e) => setNewOnly(e.target.checked)}
            className="accent-[#FF6A1A]"
          />
          New Assets Only
        </label>
      </div>

      {/* Asset Categories Checklist */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-2">
          Eligible Asset Categories (Empty = All)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className={`p-2 border text-xs cursor-pointer transition-colors ${
                categories.includes(cat.slug)
                  ? 'bg-orange-950/40 border-[#FF6A1A] text-white'
                  : 'bg-[#121212] border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)]'
              }`}
            >
              <input
                type="checkbox"
                checked={categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="sr-only"
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {/* Structures Checklist */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-2">
          Supported Finance Structures (Empty = All)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_STRUCTURES.map((str) => (
            <label
              key={str}
              className={`p-2 border text-xs cursor-pointer transition-colors ${
                structures.includes(str)
                  ? 'bg-blue-950/40 border-blue-600 text-white'
                  : 'bg-[#121212] border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)]'
              }`}
            >
              <input
                type="checkbox"
                checked={structures.includes(str)}
                onChange={() => toggleStructure(str)}
                className="sr-only"
              />
              {str.replace('_', ' ')}
            </label>
          ))}
        </div>
      </div>

      {/* Business Types Checklist */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-2">
          Accepted Business Entities (Empty = All)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_BUSINESS_TYPES.map((bt) => (
            <label
              key={bt}
              className={`p-2 border text-xs cursor-pointer transition-colors ${
                businessTypes.includes(bt)
                  ? 'bg-purple-950/40 border-purple-600 text-white'
                  : 'bg-[#121212] border-[var(--color-border-dark)] text-[var(--color-text-on-dark-muted)]'
              }`}
            >
              <input
                type="checkbox"
                checked={businessTypes.includes(bt)}
                onChange={() => toggleBusinessType(bt)}
                className="sr-only"
              />
              {bt.replace('_', ' ')}
            </label>
          ))}
        </div>
      </div>

      {/* Mandatory Audit Reason */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
          Reason for Criteria Change (Mandatory Audit Log)
        </label>
        <input
          type="text"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Q4 commercial risk update — increased maximum facility to £500,000"
          className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white text-xs font-mono uppercase py-2.5 px-6 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Snapshotting version...' : 'Save criteria & create snapshot'}
      </button>
    </form>
  )
}
