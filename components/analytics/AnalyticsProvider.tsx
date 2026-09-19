'use client'

import { useEffect } from 'react'
import { initAnalytics } from '@/lib/analytics'

// ─── Analytics provider ────────────────────────────────────────────────────────
//
// Client-side wrapper that initialises the analytics provider once on mount.
// No PII or sensitive data is passed here.

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics().catch(() => {
      // Analytics failures must never break the application
    })
  }, [])

  return <>{children}</>
}
