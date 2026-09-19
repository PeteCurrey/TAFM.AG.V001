// ─── Application layout ───────────────────────────────────────────────────────
//
// Minimal header — no footer clutter during application flow.
// Future: progress indicator, save/resume controls.

import Link from 'next/link'

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh surface-light flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[var(--color-border-light)] bg-white">
        <div className="container-tafm">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
              aria-label="TAFM — Return to homepage"
            >
              <span className="text-[var(--color-text-on-light-primary)] font-light tracking-[0.2em] text-body">
                TAFM
              </span>
              <span className="w-1 h-1 rounded-full bg-orange-500 ml-0.5 mb-1.5" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className="text-body-sm text-[var(--color-text-on-light-3)] hover:text-[var(--color-text-on-light-primary)] transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Application content */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
