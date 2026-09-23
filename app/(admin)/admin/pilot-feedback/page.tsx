import React from 'react'
import { db } from '@/lib/db/client'
import { requireAdmin } from '@/lib/auth/context'
import { PilotFeedbackStatusUpdater } from '@/components/pilot/PilotFeedbackStatusUpdater'
import { PilotFeedbackModal } from '@/components/pilot/PilotFeedbackModal'

export const dynamic = 'force-dynamic'

export default async function PilotFeedbackAdminPage() {
  await requireAdmin()

  const feedbacks = await db.pilotFeedback.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const blockers = feedbacks.filter((f) => f.severity === 'BLOCKER')
  const highs = feedbacks.filter((f) => f.severity === 'HIGH')
  const mediums = feedbacks.filter((f) => f.severity === 'MEDIUM')
  const lows = feedbacks.filter((f) => f.severity === 'LOW')

  const openCount = feedbacks.filter((f) => f.status === 'OPEN').length
  const inProgressCount = feedbacks.filter((f) => f.status === 'IN_PROGRESS').length
  const resolvedCount = feedbacks.filter((f) => f.status === 'RESOLVED').length

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'BLOCKER':
        return 'bg-red-950/80 border-red-600 text-red-300'
      case 'HIGH':
        return 'bg-amber-950/80 border-amber-600 text-amber-300'
      case 'MEDIUM':
        return 'bg-yellow-950/60 border-yellow-700 text-yellow-300'
      default:
        return 'bg-blue-950/60 border-blue-800 text-blue-300'
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-dark)]">
        <div>
          <p className="text-[11px] text-amber-400 font-mono uppercase tracking-widest">
            PHASE 7 &middot; OPERATIONAL VALIDATION
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight mt-1">
            Pilot Feedback & Triage
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-mono">
            Direct operational observations, friction logs, and blocker triage from live borrowers, providers, and operators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PilotFeedbackModal userType="ADMIN" buttonLabel="+ Log Admin Observation" />
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0e0e0e] border border-red-900/50 rounded-lg">
          <p className="text-[10px] font-mono uppercase text-red-400 tracking-wider">Active Blockers</p>
          <p className="text-3xl font-light text-white mt-1">{blockers.filter(b => b.status === 'OPEN').length}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{blockers.length} total logged</p>
        </div>
        <div className="p-4 bg-[#0e0e0e] border border-amber-900/50 rounded-lg">
          <p className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">High Severity</p>
          <p className="text-3xl font-light text-white mt-1">{highs.filter(h => h.status === 'OPEN').length}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{highs.length} total logged</p>
        </div>
        <div className="p-4 bg-[#0e0e0e] border border-zinc-800 rounded-lg">
          <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">In Progress Triage</p>
          <p className="text-3xl font-light text-white mt-1">{inProgressCount}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{openCount} unaddressed open</p>
        </div>
        <div className="p-4 bg-[#0e0e0e] border border-emerald-900/50 rounded-lg">
          <p className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Resolved</p>
          <p className="text-3xl font-light text-white mt-1">{resolvedCount}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">Audited & closed</p>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="border border-[var(--color-border-dark)] bg-[#0c0c0c] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-dark)] bg-[#111111] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
            Feedback & Friction Log ({feedbacks.length})
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">
            Ordered by newest first
          </span>
        </div>

        {feedbacks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-zinc-400 font-mono">No pilot feedback logged yet.</p>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Borrowers and providers can submit operational feedback via the floating button in their portals, or admins can log friction observations directly.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-dark)]">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-6 hover:bg-[#121212] transition-colors space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold border rounded ${getSeverityBadge(f.severity)}`}>
                      {f.severity}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 rounded">
                      {f.category.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-950/60 text-blue-300 border border-blue-800/40 rounded">
                      {f.userType}
                    </span>
                    {f.opportunityId && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        Opp: {f.opportunityId.slice(0, 10)}...
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    {new Date(f.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{f.summary}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                    {f.details}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-500">
                    Status & Resolution Triage:
                  </div>
                  <PilotFeedbackStatusUpdater
                    id={f.id}
                    currentStatus={f.status}
                    initialNotes={f.resolutionNotes}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
