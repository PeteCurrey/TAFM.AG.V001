import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'

// ─── Marketing layout ─────────────────────────────────────────────────────────

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AnalyticsProvider>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </AnalyticsProvider>
  )
}
