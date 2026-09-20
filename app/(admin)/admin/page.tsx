import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db/client'

// ─── Admin overview ────────────────────────────────────────────────────────────

async function getStats() {
  if (!db) return null
  try {
    const [opportunities, applications, aiJobs, auditEvents] = await Promise.all([
      db.opportunity.count(),
      db.financeApplication.count(),
      db.aIJob.count(),
      db.auditLog.count(),
    ])
    const pendingReview = await db.aIJob.count({ where: { status: 'REVIEW_REQUIRED' } })
    return { opportunities, applications, aiJobs, auditEvents, pendingReview }
  } catch {
    return null
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  const LINKS = [
    { href: '/admin/opportunities', label: 'Opportunities',   description: 'View and manage all finance opportunities' },
    { href: '/admin/data-quality',  label: 'Data quality',    description: 'Records with low confidence or missing data' },
    { href: '/admin/ai-jobs',       label: 'AI jobs',         description: 'Monitor AI pipeline usage and status' },
    { href: '/admin/audit-log',     label: 'Audit log',       description: 'Full history of consequential actions' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extralight text-text-primary mb-1">Admin overview</h1>
        <p className="text-sm text-text-secondary">TAFM operational dashboard</p>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Opportunities',    value: stats.opportunities },
            { label: 'Applications',     value: stats.applications },
            { label: 'AI jobs run',      value: stats.aiJobs },
            { label: 'Pending AI review',value: stats.pendingReview, accent: stats.pendingReview > 0 },
          ].map((s) => (
            <div key={s.label} className="border border-border rounded-sm p-5 bg-surface-2">
              <p className="text-3xl font-extralight text-text-primary mb-1">
                {s.value.toLocaleString()}
              </p>
              <p className={`text-xs ${s.accent ? 'text-amber-400' : 'text-text-secondary'}`}>{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-amber-900/40 bg-amber-950/20 rounded-sm px-4 py-3 mb-10">
          <p className="text-xs text-amber-400">Database not connected — stats unavailable</p>
        </div>
      )}

      {/* Navigation grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="border border-border rounded-sm p-5 hover:border-orange-500/40 hover:bg-white/[0.02] transition-colors group"
          >
            <p className="text-sm font-medium text-text-primary group-hover:text-orange-400 transition-colors mb-1">
              {l.label}
            </p>
            <p className="text-xs text-text-secondary">{l.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
