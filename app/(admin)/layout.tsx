import React from 'react'
import Link from 'next/link'

// ─── Admin layout ──────────────────────────────────────────────────────────────
//
// Shell for the admin area. Protected in Phase 4 when auth is wired.
// Phase 3: renders with a visible AUTH_PENDING state — never silently accessible.

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Admin auth notice */}
      <div className="bg-amber-950/60 border-b border-amber-900/40 px-4 py-2 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <p className="text-xs text-amber-300">
          <strong className="font-medium">Admin area</strong> — Authentication not yet wired to session provider.
          Access control is in progress.
        </p>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border flex-shrink-0 flex flex-col">
          <div className="px-4 py-5 border-b border-border">
            <p className="text-xs text-text-tertiary uppercase tracking-widest">TAFM Admin</p>
          </div>
          <nav className="flex-1 py-3 overflow-y-auto">
            {NAV.map((item, i) => {
              if ('divider' in item) {
                return (
                  <div key={`divider-${i}`} className="px-4 pt-4 pb-1">
                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest opacity-50">
                      {item.label}
                    </p>
                  </div>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.03] transition-colors"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="px-4 py-4 border-t border-border">
            <Link href="/" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              ← Back to site
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
