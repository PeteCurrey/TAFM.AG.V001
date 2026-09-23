'use client'

import React, { useState } from 'react'
import { createInformationRequestAction } from '@/app/actions/information-request'

interface InfoRequest {
  id: string
  requestNotes: string
  requestedFields: string[]
  status: string
  borrowerResponse?: string | null
  responseDocuments?: unknown
  respondedAt?: Date | string | null
  createdAt: Date | string
}

export function ProviderInformationRequestManager({
  opportunityId,
  requests,
}: {
  opportunityId: string
  requests: InfoRequest[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('opportunityId', opportunityId)

    const res = await createInformationRequestAction(formData)
    setIsSubmitting(false)

    if (res.success) {
      setSuccess(true)
      setIsOpen(false)
    } else {
      setError(res.error || 'Failed to send request')
    }
  }

  return (
    <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-dark)]">
        <div>
          <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">
            UNDERWRITING DUE DILIGENCE
          </p>
          <h3 className="text-sm font-medium text-white">Information & Document Requests</h3>
        </div>
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded text-xs font-mono transition-colors"
          >
            + Request Info
          </button>
        )}
      </div>

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono rounded">
          &check; Request sent to borrower. Requirement status updated to AWAITING_INFORMATION.
        </div>
      )}

      {isOpen && (
        <form onSubmit={handleCreate} className="bg-black/50 border border-white/10 rounded p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white pb-2 border-b border-white/5">
            <span>New Information Request</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[var(--color-text-on-dark-muted)] hover:text-white"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="p-2.5 bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)] mb-1">
              Required Information / Clarification Description
            </label>
            <textarea
              name="requestNotes"
              required
              rows={3}
              placeholder="e.g. Please provide last 3 months business bank statements and confirm asset delivery address."
              className="w-full bg-[#111111] border border-white/10 rounded p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6A1A]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)] mb-1">
              Document Tags / Specific Fields (comma-separated)
            </label>
            <input
              type="text"
              name="requestedFields"
              placeholder="e.g. Bank Statements, LOLER Certificate, Director Guarantee"
              className="w-full bg-[#111111] border border-white/10 rounded p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6A1A]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 bg-transparent border border-white/10 text-[var(--color-text-on-dark-muted)] hover:text-white rounded text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#FF6A1A] hover:bg-[#e05912] disabled:opacity-50 text-white rounded text-xs font-mono font-medium"
            >
              {isSubmitting ? 'Sending...' : 'Issue Request &rarr;'}
            </button>
          </div>
        </form>
      )}

      {/* Existing Requests */}
      {requests.length === 0 ? (
        <p className="text-xs text-[var(--color-text-on-dark-muted)] italic">
          No additional underwriting information has been requested for this opportunity yet.
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded border text-xs space-y-2 ${
                req.status === 'RESPONDED'
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : 'bg-amber-950/20 border-amber-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded ${
                    req.status === 'RESPONDED'
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-amber-900/60 text-amber-300'
                  }`}
                >
                  {req.status}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-on-dark-muted)]">
                  {new Date(req.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)]">
                  Request:
                </span>
                <p className="text-white mt-0.5">{req.requestNotes}</p>
              </div>

              {req.status === 'RESPONDED' && (
                <div className="mt-2 pt-2 border-t border-white/10 bg-black/40 p-2.5 rounded">
                  <span className="text-[10px] uppercase font-mono text-emerald-400">
                    Borrower Response ({req.respondedAt ? new Date(req.respondedAt).toLocaleDateString('en-GB') : ''}):
                  </span>
                  <p className="text-white mt-1">{req.borrowerResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
