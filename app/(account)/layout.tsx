import React from 'react'
import Link from 'next/link'

// ─── Account layout ─────────────────────────────────────────────────────────────

const NAV = [
  { href: '/account',               label: 'Overview' },
  { href: '/account/assets',        label: 'My assets' },
  { href: '/account/finance',       label: 'Finance requests' },
  { href: '/account/opportunities', label: 'Opportunities' },
  { href: '/account/documents',     label: 'Documents' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Auth notice */}
      <div className="bg-blue-950/60 border-b border-blue-900/40 px-4 py-2 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <p className="text-xs text-blue-300">
          <strong className="font-medium">Business account area</strong> — Sign-in will be available in a future release.
        </p>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 border-r border-border flex-shrink-0 flex flex-col">
          <div className="px-4 py-5 border-b border-border">
            <p className="text-xs text-text-tertiary uppercase tracking-widest">My account</p>
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
            <Link href="/" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              ← Back to site
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
