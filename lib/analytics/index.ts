import type { AnalyticsEvent } from '@/types/analytics'
import type { AnalyticsProvider } from './provider'
import { noopProvider } from './noop'

// ─── Analytics abstraction ────────────────────────────────────────────────────
//
// Central analytics interface. All event tracking goes through here.
// Never scatter analytics calls directly throughout components.
//
// IMPORTANT: Never include in events:
//   - API keys or secrets
//   - Full financial data (rates, amounts, decisions)
//   - Passwords or authentication tokens
//   - National Insurance numbers or other government IDs
//   - Full document content

let _provider: AnalyticsProvider | null = null

/**
 * Initialise the analytics provider.
 * Called once in the client-side AnalyticsProvider component.
 */
export async function initAnalytics(): Promise<void> {
  const providerName = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID

  if (!providerName || !analyticsId) {
    _provider = noopProvider
    return
  }

  // Future: dynamically load providers based on configuration
  // e.g. PostHog, GA4, Segment
  switch (providerName) {
    case 'posthog':
      // const { posthogProvider } = await import('./posthog')
      // _provider = posthogProvider
      _provider = noopProvider
      break
    case 'ga4':
      // const { ga4Provider } = await import('./ga4')
      // _provider = ga4Provider
      _provider = noopProvider
      break
    default:
      _provider = noopProvider
  }
}

function getProvider(): AnalyticsProvider {
  return _provider ?? noopProvider
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Track a typed analytics event.
 */
export async function track(event: AnalyticsEvent): Promise<void> {
  try {
    await getProvider().track(event)
  } catch {
    // Analytics failures must never break the application
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Analytics] track failed', event.name)
    }
  }
}

/**
 * Identify a user (after authentication).
 * Only include non-sensitive traits.
 */
export async function identify(
  userId: string,
  traits?: Record<string, unknown>,
): Promise<void> {
  try {
    await getProvider().identify(userId, traits)
  } catch {
    // Silent failure
  }
}

/**
 * Track a page view.
 */
export async function page(
  path: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  try {
    await getProvider().page(path, properties)
  } catch {
    // Silent failure
  }
}
