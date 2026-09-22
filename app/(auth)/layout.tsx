import React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-between text-white selection:bg-[#FF6A1A] selection:text-white">
      {/* Top minimal bar */}
      <header className="border-b border-[var(--color-border-dark)] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-light tracking-[0.2em] text-white text-lg">TAFM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]" />
        </Link>
        <Link
          href="/"
          className="text-xs text-[var(--color-text-on-dark-muted)] hover:text-white transition-colors"
        >
          ← Return to site
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[var(--color-border-dark)] p-8 shadow-2xl">
          {children}
        </div>
      </main>

      {/* Bottom info */}
      <footer className="border-t border-[var(--color-border-dark)] px-6 py-4 text-center">
        <p className="text-xs text-[var(--color-text-on-dark-muted)]">
          TAFM &copy; {new Date().getFullYear()} &middot; Secured by deterministic enterprise architecture.
        </p>
      </footer>
    </div>
  )
}
