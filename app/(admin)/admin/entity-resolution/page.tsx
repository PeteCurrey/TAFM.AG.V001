import React from 'react'
import { getPendingResolutionCandidates } from '@/lib/data/entity-resolution'
import { resolveEntityCandidateAction } from '@/app/actions/entity-resolution'

export const dynamic = 'force-dynamic'

export default async function EntityResolutionPage() {
  const candidates = await getPendingResolutionCandidates()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light tracking-tight text-white">Entity Resolution & Deduplication Queue</h1>
            <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
              {candidates.length} Pending Review
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1.5 font-mono">
            Human operator verification for potential entity matches (0.70 – 0.94 confidence threshold)
          </p>
        </div>
      </div>

      {/* Principles Alert */}
      <div className="bg-[#111111] border border-white/10 rounded-lg p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A1A] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]" />
          Zero Silent Assumptions Standard
        </div>
        <p className="text-xs text-[var(--color-text-on-dark-2)] leading-relaxed">
          TAFM never silently merges or aliases entities when confidence is sub-100%. Approving a match updates the
          canonical record's alias dictionary so future occurrences resolve instantly without operator intervention.
          Rejecting a candidate flags the entity for standalone registration.
        </p>
      </div>

      {/* Candidates List */}
      {candidates.length === 0 ? (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-700/40 text-emerald-400 mx-auto flex items-center justify-center font-mono text-lg">
            &check;
          </div>
          <h3 className="text-sm font-medium text-white">All Entities Canonically Resolved</h3>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] max-w-md mx-auto">
            There are no ambiguous manufacturer, model, or category names awaiting operator validation.
            New potential matches will automatically queue here when detected during CSV import or asset intake.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => {
            const confidencePct = Math.round(Number(candidate.confidence) * 100)

            return (
              <div
                key={candidate.id}
                className="bg-[#0D0D0D] border border-white/10 rounded-lg p-6 space-y-4 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[var(--color-text-on-dark-2)] uppercase">
                      {candidate.entityType}
                    </span>
                    <span className="text-xs text-[var(--color-text-on-dark-muted)] font-mono">
                      Queued {new Date(candidate.createdAt).toLocaleDateString()} at{' '}
                      {new Date(candidate.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-on-dark-muted)] font-mono">Match Confidence:</span>
                    <span
                      className={`text-sm font-mono font-medium ${
                        confidencePct >= 85 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {confidencePct}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Raw Intake String */}
                  <div className="bg-black/40 border border-white/5 rounded p-4 space-y-1">
                    <div className="text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)]">
                      Raw Ingestion String
                    </div>
                    <div className="text-base text-white font-mono font-light break-all">
                      &quot;{candidate.sourceRawName}&quot;
                    </div>
                  </div>

                  {/* Right: Proposed Canonical Entity */}
                  <div className="bg-black/40 border border-white/5 rounded p-4 space-y-1">
                    <div className="text-[10px] uppercase font-mono text-[var(--color-text-on-dark-muted)]">
                      Proposed Canonical Match
                    </div>
                    <div className="text-base text-emerald-400 font-mono font-light break-all">
                      {candidate.proposedCanonicalName}
                    </div>
                  </div>
                </div>

                {/* Evidence */}
                <div className="text-xs text-[var(--color-text-on-dark-2)] font-mono bg-white/[0.02] p-3 rounded border border-white/5">
                  <span className="text-[var(--color-text-on-dark-muted)]">Evidence: </span>
                  {candidate.matchingEvidence}
                </div>

                {/* Decision Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  {/* Reject Form */}
                  <form action={resolveEntityCandidateAction}>
                    <input type="hidden" name="candidateId" value={candidate.id} />
                    <input type="hidden" name="action" value="REJECT" />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-transparent hover:bg-white/5 text-[var(--color-text-on-dark-2)] hover:text-white border border-white/10 rounded text-xs font-mono transition-colors"
                    >
                      Reject as Distinct Entity
                    </button>
                  </form>

                  {/* Confirm & Merge Form */}
                  <form action={resolveEntityCandidateAction}>
                    <input type="hidden" name="candidateId" value={candidate.id} />
                    <input type="hidden" name="action" value="MERGE" />
                    {candidate.proposedCanonicalId && (
                      <input type="hidden" name="targetEntityId" value={candidate.proposedCanonicalId} />
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF6A1A] hover:bg-[#e05912] text-white rounded text-xs font-mono font-medium transition-colors"
                    >
                      &check; Confirm Match & Add Alias
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
