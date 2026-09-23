import React from 'react'
import Link from 'next/link'
import { requireAuth } from '@/lib/auth/context'
import { PilotFeedbackModal } from '@/components/pilot/PilotFeedbackModal'

// ─── Account layout (Phase 5) ─────────────────────────────────────────────────
//
// Protected business borrower workspace.
// Enforces server-side authentication and organisation scoping.

const NAV = [
  { href: '/account',               label: 'Overview' },
  { href: '/account/assets',        label: 'Business assets' },
  { href: '/account/finance',       label: 'Finance requests' },
  { href: '/account/opportunities', label: 'Active opportunities' },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth('/account')
  const primaryBusiness = user.organisations[0]?.business

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col text-white">
      {/* Account top status bar */}
      <div className="bg-[#0e0e0e] border-b border-[var(--color-border-dark)] px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[11px] text-[var(--color-text-on-dark-2)] uppercase tracking-wider">
            {primaryBusiness?.name ?? `${user.firstName} ${user.lastName}`} &middot; {user.email}
          </span>
          <span className="px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] uppercase font-mono">
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <PilotFeedbackModal userType="BORROWER" />
          <Link
            href="/apply"
            className="text-[#FF6A1A] hover:underline"
          >
            + New finance request
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
              Business Portal
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
