// ─── Account layout ───────────────────────────────────────────────────────────
//
// Placeholder — authentication boundary will be implemented here.
// Full account dashboard with sidebar navigation planned for Phase 2.

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh surface-light">
      {/* Auth boundary will be enforced here */}
      {/* Future: account sidebar, user context */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
