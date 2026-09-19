import type { AnalyticsEvent } from '@/types/analytics'

// ─── Analytics provider interface ────────────────────────────────────────────

export interface AnalyticsProvider {
  name: string
  track(event: AnalyticsEvent): Promise<void>
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>
  page(path: string, properties?: Record<string, unknown>): Promise<void>
}
