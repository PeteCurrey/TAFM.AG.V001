import React from 'react'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/context'

// ─── Admin layout (Phase 5) ──────────────────────────────────────────────────
//
// Protected server-side authoritative layout.
// Only accessible to authenticated users with ADMIN or SUPER_ADMIN role.

const NAV: Array<{ href: string; label: string } | { divider: true; label: string }> = [
  // Core pipeline
  { href: '/admin',                        label: 'Overview' },
  { href: '/admin/leads',                  label: 'Leads' },
  { href: '/admin/opportunities',          label: 'Opportunities' },
  // Divider: Providers
  { divider: true,                         label: 'Providers' },
  { href: '/admin/providers',              label: 'Provider list' },
  { href: '/admin/provider-applications',  label: 'Applications' },
  // Divider: Data
  { divider: true,                         label: 'Data' },
  { href: '/admin/data-readiness',         label: 'Data readiness' },
  { href: '/admin/entity-resolution',      label: 'Entity resolution' },
  { href: '/admin/import',                 label: 'CSV Import' },
  { href: '/admin/manufacturers',          label: 'Manufacturers' },
  { href: '/admin/market-data',            label: 'Market data' },
  { href: '/admin/data-quality',           label: 'Data quality' },
  { href: '/admin/assets',                 label: 'Assets' },
  { href: '/admin/businesses',             label: 'Businesses' },
  // Divider: System
  { divider: true,                         label: 'System' },
  { href: '/admin/content',               label: 'Content' },
  { href: '/admin/ai-jobs',               label: 'AI jobs' },
  { href: '/admin/audit-log',             label: 'Audit log' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await requireAdmin()

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col text-white">
      {/* Admin top status bar */}
      <div className="bg-[#111111] border-b border-[var(--color-border-dark)] px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
          <span className="font-mono text-[11px] text-[var(--color-text-on-dark-2)] uppercase tracking-wider">
            ADMIN CONSOLE &middot; {adminUser.email}
          </span>
          <span className="px-1.5 py-0.5 bg-orange-950/60 border border-orange-800/60 text-[#FF6A1A] text-[10px] uppercase font-mono">
            {adminUser.role}
          </span>
        </div>
        <div className="flex items-center gap-4">
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
              TAFM Administration
            </p>
          </div>
          <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
            {NAV.map((item, i) => {
              if ('divider' in item) {
                return (
                  <div key={`divider-${i}`} className="px-4 pt-4 pb-1">
                    <p className="text-[9px] text-[var(--color-text-on-dark-muted)] uppercase tracking-widest opacity-60 font-mono">
                      {item.label}
                    </p>
                  </div>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-xs text-[var(--color-text-on-dark-2)] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="px-4 py-4 border-t border-[var(--color-border-dark)]">
            <p className="text-[10px] text-[var(--color-text-on-dark-muted)]">
              Authoritative Server Security
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  )
}
