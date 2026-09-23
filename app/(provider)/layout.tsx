import React from 'react'
import Link from 'next/link'
import { requireProviderMembership } from '@/lib/auth/context'
import { PilotFeedbackModal } from '@/components/pilot/PilotFeedbackModal'

// ─── Provider layout (Phase 5) ────────────────────────────────────────────────
//
// Protected finance provider portal.
// Enforces provider membership so users only see their organisation's opportunities.

const NAV = [
  { href: '/provider',               label: 'Overview' },
  { href: '/provider/opportunities', label: 'Opportunities' },
]

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { user, lenderId, role } = await requireProviderMembership()
  const providerOrg = user.providerMemberships.find((m) => m.lenderId === lenderId)?.lender

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col text-white">
      {/* Provider top status bar */}
      <div className="bg-[#0b101b] border-b border-blue-900/40 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-mono text-[11px] text-[var(--color-text-on-dark-2)] uppercase tracking-wider">
            {providerOrg?.name ?? 'Provider Organisation'} &middot; {user.email}
          </span>
          <span className="px-1.5 py-0.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 text-[10px] uppercase font-mono">
            {role}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <PilotFeedbackModal userType="PROVIDER" />
          <Link
            href="/"
            className="text-[var(--color-text-on-dark-muted)] hover:text-white transition-colors"
          >
            Public site &rarr;
          </Link>
          <a
            href="/sign-out"
            className="text-[var(--color-text-on-dark-muted)] hover:text-red-400 transition-colors"
          >
            Sign out
          </a>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 border-r border-[var(--color-border-dark)] flex-shrink-0 flex flex-col bg-[#080808]">
          <div className="px-4 py-5 border-b border-[var(--color-border-dark)]">
            <p className="text-[10px] text-[var(--color-text-on-dark-muted)] uppercase tracking-widest font-mono">
              Provider Portal
            </p>
          </div>
          <nav className="flex-1 py-3 space-y-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 text-xs text-[var(--color-text-on-dark-2)] hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-[var(--color-border-dark)]">
            <Link href="/" className="text-xs text-[var(--color-text-on-dark-muted)] hover:text-white transition-colors">
              &larr; Back to site
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  )
}
