import React from 'react'
import Link from 'next/link'

// ─── Provider portal layout ────────────────────────────────────────────────────

const NAV = [
  { href: '/provider',              label: 'Overview' },
  { href: '/provider/opportunities', label: 'Opportunities' },
  { href: '/provider/criteria',     label: 'My criteria' },
  { href: '/provider/profile',      label: 'Profile' },
]

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Auth notice */}
      <div className="bg-indigo-950/60 border-b border-indigo-900/40 px-4 py-2 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        <p className="text-xs text-indigo-300">
          <strong className="font-medium">Provider portal</strong> — Authentication and onboarding will be available in a future release.
        </p>
      </div>

      <div className="flex flex-1">
        <aside className="w-52 border-r border-border flex-shrink-0 flex flex-col">
          <div className="px-4 py-5 border-b border-border">
            <p className="text-xs text-text-tertiary uppercase tracking-widest">Provider Portal</p>
          </div>
          <nav className="flex-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.03] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-border">
            <Link href="/for-lenders" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              ← Provider information
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
