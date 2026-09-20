'use client'

import React from 'react'
import type { EligibilityStatus, MatchFactor } from '@/lib/matching/eligibility'

// ─── MatchAnalysis component ───────────────────────────────────────────────────
//
// Renders a transparent, factor-by-factor match analysis table.
// Every factor shows its value, criterion, and outcome.
// No opaque scores. No invented confidence percentages.
// UNKNOWN is displayed prominently — it is never silently promoted.

const STATUS_STYLES: Record<EligibilityStatus, { dot: string; label: string; bg: string }> = {
  ELIGIBLE:     { dot: 'bg-emerald-500',    label: 'Met',     bg: 'bg-emerald-950/30 border-emerald-900/50' },
  NOT_ELIGIBLE: { dot: 'bg-red-500',        label: 'Not met', bg: 'bg-red-950/30 border-red-900/50' },
  UNKNOWN:      { dot: 'bg-amber-400',      label: 'Unknown', bg: 'bg-amber-950/30 border-amber-900/50' },
}

interface MatchAnalysisProps {
  lenderName?: string
  overall:     EligibilityStatus
  factors:     MatchFactor[]
  blockers:    string[]
  unknowns:    string[]
  className?:  string
}

export function MatchAnalysis({
  lenderName,
  overall,
  factors,
  blockers,
  unknowns,
  className = '',
}: MatchAnalysisProps) {
  const overallStyles = STATUS_STYLES[overall]

  return (
    <div className={`border border-border rounded-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Match analysis
          </span>
          {lenderName && (
            <span className="text-xs text-text-tertiary">— {lenderName}</span>
          )}
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-xs font-medium ${overallStyles.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${overallStyles.dot}`} />
          {overall === 'ELIGIBLE'     && 'Potential match'}
          {overall === 'NOT_ELIGIBLE' && 'Not eligible'}
          {overall === 'UNKNOWN'      && 'Further information required'}
        </div>
      </div>

      {/* Factor table */}
      <div className="divide-y divide-border">
        {factors.map((factor) => {
          const styles = STATUS_STYLES[factor.status]
          return (
            <div key={factor.field} className="grid grid-cols-[1fr_1fr_1fr_100px] gap-3 px-4 py-2.5 text-xs">
              <div className="text-text-secondary font-medium">{factor.label}</div>
              <div className="text-text-primary">{factor.value ?? <span className="text-text-tertiary italic">Not provided</span>}</div>
              <div className="text-text-secondary">{factor.criterion ?? '—'}</div>
              <div className={`flex items-center gap-1.5 justify-end`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
                <span className="text-text-secondary">{styles.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_1fr_100px] gap-3 px-4 py-2 border-t border-border bg-surface-2 text-[10px] text-text-tertiary uppercase tracking-wider">
        <div>Factor</div>
        <div>Requirement</div>
        <div>Criterion</div>
        <div className="text-right">Status</div>
      </div>

      {/* Blockers summary */}
      {blockers.length > 0 && (
        <div className="px-4 py-3 border-t border-red-900/40 bg-red-950/20">
          <p className="text-xs font-medium text-red-400 mb-1.5">Not eligible — {blockers.length} criterion not met</p>
          <ul className="space-y-0.5">
            {blockers.map((b, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                <span className="text-red-500 mt-0.5">×</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Unknowns summary */}
      {blockers.length === 0 && unknowns.length > 0 && (
        <div className="px-4 py-3 border-t border-amber-900/40 bg-amber-950/20">
          <p className="text-xs font-medium text-amber-400 mb-1.5">Further information required before eligibility can be confirmed</p>
          <ul className="space-y-0.5">
            {unknowns.map((u, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">?</span>
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Eligible summary */}
      {overall === 'ELIGIBLE' && (
        <div className="px-4 py-3 border-t border-emerald-900/40 bg-emerald-950/20">
          <p className="text-xs text-emerald-400">
            All available criteria are met. This provider may be eligible to review this opportunity.
            Final eligibility is subject to provider assessment and is not guaranteed.
          </p>
        </div>
      )}
    </div>
  )
}
