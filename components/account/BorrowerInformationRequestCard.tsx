'use client'

import React, { useState } from 'react'
import { respondToInformationRequestAction } from '@/app/actions/information-request'

interface RequestData {
  id: string
  requestNotes: string
  requestedFields: string[]
  status: string
  borrowerResponse?: string | null
  respondedAt?: Date | string | null
  createdAt: Date | string
}

export function BorrowerInformationRequestCard({ request }: { request: RequestData }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (request.status === 'RESPONDED' || success) {
    return (
      <div className="border border-emerald-800/40 bg-emerald-950/20 rounded p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-medium">
              Information Request Responded
            </span>
          </div>
          <span className="text-[11px] font-mono text-[var(--color-text-on-dark-muted)]">
            {request.respondedAt
              ? new Date(request.respondedAt).toLocaleDateString('en-GB')
              : 'Submitted'}
          </span>
        </div>
        <div className="text-xs text-[var(--color-text-on-dark-2)] bg-black/40 p-3 rounded border border-white/5 space-y-1">
          <p className="text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)]">Request from Underwriters:</p>
          <p className="italic text-white">&quot;{request.requestNotes}&quot;</p>
        </div>
        <div className="text-xs text-[var(--color-text-on-dark-2)] bg-black/40 p-3 rounded border border-white/5 space-y-1">
          <p className="text-[10px] uppercase font-mono text-emerald-400">Your Response:</p>
          <p className="text-white">{request.borrowerResponse || 'Response received and attached to underwriting file.'}</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('requestId', request.id)

    const res = await respondToInformationRequestAction(formData)
    setIsSubmitting(false)

    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.error || 'Failed to submit response')
    }
  }

  return (
    <div className="border border-amber-700/60 bg-amber-950/20 rounded p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-medium">
            Action Required: Underwriter Information Request
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-400/80">
          Received {new Date(request.createdAt).toLocaleDateString('en-GB')}
        </span>
      </div>

      <div className="bg-black/50 border border-amber-800/30 rounded p-4 space-y-2">
        <p className="text-xs text-white leading-relaxed">{request.requestNotes}</p>
        {request.requestedFields && request.requestedFields.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {request.requestedFields.map((field, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-amber-900/40 border border-amber-700/40 text-amber-200 text-[10px] font-mono rounded"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-mono rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-mono text-[var(--color-text-on-dark-muted)] uppercase mb-1">
            Your Response / Clarification
          </label>
          <textarea
            name="borrowerResponse"
            required
            rows={3}
            placeholder="Provide requested details or explanations here..."
            className="w-full bg-[#111111] border border-white/10 rounded p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[var(--color-text-on-dark-muted)] uppercase mb-1">
            Supporting Document Link / Reference (Optional)
          </label>
          <input
            type="text"
            name="documentUrl"
            placeholder="e.g. https://... or document reference code"
            className="w-full bg-[#111111] border border-white/10 rounded p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#e05912] disabled:opacity-50 text-white text-xs font-mono rounded transition-colors flex items-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Underwriting Response &rarr;'}
        </button>
      </form>
    </div>
  )
}
