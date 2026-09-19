import type { AnalyticsEvent } from '@/types/analytics'
import type { AnalyticsProvider } from './provider'

// ─── No-op analytics provider ────────────────────────────────────────────────
//
// Used when no analytics provider is configured.
// Silently accepts all events without sending them anywhere.
// Logs in development so events can be inspected.

export const noopProvider: AnalyticsProvider = {
  name: 'noop',

  async track(event: AnalyticsEvent): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics:noop]', event.name, event.properties)
    }
  },

  async identify(_userId: string, _traits?: Record<string, unknown>): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics:noop] identify', { _userId })
    }
  },

  async page(_path: string, _properties?: Record<string, unknown>): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics:noop] page', _path)
    }
  },
}
