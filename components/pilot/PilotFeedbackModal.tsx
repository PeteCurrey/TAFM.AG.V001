'use client'

import React, { useState, useTransition } from 'react'
import { submitPilotFeedbackAction } from '@/app/actions/pilot-feedback'

interface Props {
  userType: 'BORROWER' | 'PROVIDER' | 'ADMIN' | 'BROKER'
  opportunityId?: string
  className?: string
  buttonLabel?: string
}

export function PilotFeedbackModal({
  userType,
  opportunityId,
  className = '',
  buttonLabel = 'Pilot Feedback',
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [severity, setSeverity] = useState<'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM')
  const [category, setCategory] = useState<any>('OTHER')
  const [summary, setSummary] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (summary.trim().length < 3) {
      setError('Summary must be at least 3 characters.')
      return
    }

    if (details.trim().length < 5) {
      setError('Details must be at least 5 characters.')
      return
    }

    startTransition(async () => {
      const res = await submitPilotFeedbackAction({
        severity,
        category,
        userType,
        summary: summary.trim(),
        details: details.trim(),
        opportunityId: opportunityId || null,
      })

      if (!res.success) {
        setError(res.error || 'Failed to submit feedback')
      } else {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setIsOpen(false)
          setSummary('')
          setDetails('')
        }, 1800)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider uppercase bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded transition-colors"}
        title="Report friction, terminology issues, or feedback during pilot"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-lg bg-[#111111] border border-[var(--color-border-dark)] rounded-lg p-6 shadow-2xl relative text-left"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-dark)]">
              <div>
                <p className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">
                  PILOT OPERATIONS FEEDBACK
                </p>
                <h3 className="text-base font-semibold text-white">Log Operational Friction / Observation</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-mono p-1"
              >
                &times;
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-lg">
                  ✓
                </div>
                <h4 className="text-sm font-medium text-white">Feedback Logged</h4>
                <p className="text-xs text-zinc-400">
                  Logged in audit trail and forwarded to TAFM pilot triage operations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                      Severity
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full bg-[#181818] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="BLOCKER">🔴 BLOCKER (Prevents task)</option>
                      <option value="HIGH">🟠 HIGH (Major friction)</option>
                      <option value="MEDIUM">🟡 MEDIUM (Issue / confusion)</option>
                      <option value="LOW">🔵 LOW (Cosmetic / tweak)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                      Workflow Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#181818] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="FINANCE_REQUIREMENT">Finance Requirement</option>
                      <option value="PROVIDER_RESPONSE">Provider Response</option>
                      <option value="INFORMATION_REQUEST">Information Request</option>
                      <option value="DOCUMENTS">Documents & Proofs</option>
                      <option value="MATCHING">Matching & Criteria</option>
                      <option value="TERMINOLOGY">Terminology Confusion</option>
                      <option value="ONBOARDING">Onboarding & Access</option>
                      <option value="OTHER">Other Operational Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Summary / Headline
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="e.g. Unclear document request specification for used trailer"
                    className="w-full bg-[#181818] border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Detailed Observations & Recommendations
                  </label>
                  <textarea
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe what occurred, any confusing steps, or missing capability..."
                    className="w-full bg-[#181818] border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-dark)]">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-zinc-400 hover:text-white px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold text-xs px-4 py-2 rounded transition-colors"
                  >
                    {isPending ? 'Logging...' : 'Submit Pilot Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
