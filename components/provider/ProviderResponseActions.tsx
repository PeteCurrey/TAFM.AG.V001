'use client'

import React, { useState, useTransition } from 'react'
import { submitProviderResponse } from '@/app/actions/provider-opportunity'

interface Props {
  opportunityId: string
  lenderId: string
  currentStatus: string
}

export function ProviderResponseActions({ opportunityId, lenderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [term, setTerm] = useState<string>('36')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleAction = (action: string) => {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const res = await submitProviderResponse({
        opportunityId,
        lenderId,
        action: action as any,
        notes: notes || undefined,
        approvedAmount: amount ? Number(amount) : undefined,
        termMonths: term ? Number(term) : undefined,
      })

      if (!res.success) {
        setError(res.error ?? 'Action failed')
      } else {
        setSuccess(true)
        setSelectedAction('')
        setNotes('')
      }
    })
  }

  return (
    <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-dark)]">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">
            PROVIDER ACTIONS
          </p>
          <h3 className="text-base font-medium text-white">Record Response</h3>
        </div>
        <div>
          <span className="text-[11px] font-mono text-[var(--color-text-on-dark-muted)]">
            Current status: <strong className="text-white uppercase">{currentStatus}</strong>
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs">
          Response successfully recorded in audit log and updated in pipeline.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setSelectedAction('REVIEW')}
          className={`py-2 px-3 text-xs uppercase font-mono transition-colors border ${
            selectedAction === 'REVIEW'
              ? 'bg-blue-900/60 text-white border-blue-600'
              : 'bg-[#141414] text-[var(--color-text-on-dark-2)] border-[var(--color-border-dark)] hover:text-white'
          }`}
        >
          Reviewing
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('REQUEST_INFORMATION')}
          className={`py-2 px-3 text-xs uppercase font-mono transition-colors border ${
            selectedAction === 'REQUEST_INFORMATION'
              ? 'bg-amber-900/60 text-white border-amber-600'
              : 'bg-[#141414] text-[var(--color-text-on-dark-2)] border-[var(--color-border-dark)] hover:text-white'
          }`}
        >
          Request Info
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('INTERESTED')}
          className={`py-2 px-3 text-xs uppercase font-mono transition-colors border ${
            selectedAction === 'INTERESTED'
              ? 'bg-purple-900/60 text-white border-purple-600'
              : 'bg-[#141414] text-[var(--color-text-on-dark-2)] border-[var(--color-border-dark)] hover:text-white'
          }`}
        >
          Express Interest
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('OFFERED')}
          className={`py-2 px-3 text-xs uppercase font-mono transition-colors border ${
            selectedAction === 'OFFERED'
              ? 'bg-emerald-900/60 text-white border-emerald-600'
              : 'bg-[#141414] text-[var(--color-text-on-dark-2)] border-[var(--color-border-dark)] hover:text-white'
          }`}
        >
          Make Offer
        </button>
      </div>

      {selectedAction && (
        <div className="space-y-4 pt-4 border-t border-[var(--color-border-dark)]">
          {selectedAction === 'INTERESTED' && (
            <div className="p-3 bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
              <strong className="font-semibold text-purple-100">Preliminary Appetite Only:</strong> This records non-binding commercial interest in the opportunity. It does <em>not</em> constitute a credit approval, financial offer, or commitment to lend.
            </div>
          )}

          {selectedAction === 'OFFERED' && (
            <>
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-200">
                <strong className="font-semibold text-emerald-100">Formal Indicative Terms:</strong> Record proposed indicative facility amount and term. All facilities remain subject to final credit underwriting, satisfactory documentation, and KYC/AML verification.
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
                    Indicative Facility (£)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
                    Term (Months)
                  </label>
                  <input
                    type="number"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="36"
                    className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
              {selectedAction === 'REQUEST_INFORMATION' ? 'Required information details' : 'Underwriter notes / Commercial commentary'}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add precise notes or terms..."
              className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleAction(selectedAction)}
              className="bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white text-xs font-mono uppercase py-2 px-5 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Recording...' : `Confirm ${selectedAction.replace('_', ' ')}`}
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction('')}
              className="text-xs text-[var(--color-text-on-dark-muted)] hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Decline action separate button */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border-dark)] flex items-center justify-between">
        <p className="text-[11px] text-[var(--color-text-on-dark-muted)]">
          Outside current risk or asset appetite?
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAction('DECLINE')}
          className="text-xs text-zinc-500 hover:text-red-400 font-mono transition-colors"
        >
          Decline Opportunity &rarr;
        </button>
      </div>
    </div>
  )
}
