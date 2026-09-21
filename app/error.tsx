'use client'

import { useEffect } from 'react'

// ─── Global error boundary ─────────────────────────────────────────────────────
//
// Next.js renders this when an unhandled error occurs in the root layout or any
// descendant. The error and digest are logged to the browser console so the
// real cause is visible.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log full details so the browser console shows the real error
    console.error('[TAFM] Unhandled application error:', error)
    if (error.digest) console.error('[TAFM] Error digest:', error.digest)
  }, [error])

  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          padding: '48px 24px',
          background: '#050505',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#888', marginBottom: '16px', textTransform: 'uppercase' }}>
          TAFM · System error
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 300, marginBottom: '12px', letterSpacing: '0.04em' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '14px', color: '#666', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.6 }}>
          An unexpected error occurred. Check the browser console for details.
          {error.digest && (
            <> Error ID: <code style={{ fontSize: '12px', color: '#888' }}>{error.digest}</code></>
          )}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: '#FF6A1A',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '13px',
            letterSpacing: '0.03em',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
