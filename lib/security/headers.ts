// ─── Security headers ──────────────────────────────────────────────────────────
//
// HTTP security headers applied via next.config.ts.
// Defined here as a constant so they can be referenced and tested independently.

export interface SecurityHeader {
  key: string
  value: string
}

/**
 * Strict Content Security Policy for TAFM.
 * Self-hosted fonts, no inline scripts, no third-party iframes.
 * Update when adding external services (analytics, CDN, etc.).
 */
export function buildCSP(isDev: boolean = false): string {
  const directives: Record<string, string[]> = {
    'default-src':    ["'self'"],
    'script-src':     ["'self'", ...(isDev ? ["'unsafe-eval'", "'unsafe-inline'"] : [])],
    'style-src':      ["'self'", "'unsafe-inline'"],  // Tailwind inline styles require this
    'img-src':        ["'self'", 'data:', 'blob:', 'https:'],
    'font-src':       ["'self'", 'https://fonts.gstatic.com'],
    'connect-src':    ["'self'", ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : [])],
    'media-src':      ["'self'"],
    'worker-src':     ["'self'", 'blob:'],
    'frame-ancestors': ["'none'"],
    'form-action':    ["'self'"],
    'base-uri':       ["'self'"],
    'upgrade-insecure-requests': [],
  }

  return Object.entries(directives)
    .map(([key, values]) => (values.length > 0 ? `${key} ${values.join(' ')}` : key))
    .join('; ')
}

/**
 * Standard security headers for all TAFM responses.
 */
export function getSecurityHeaders(isDev: boolean = false): SecurityHeader[] {
  return [
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
    {
      key: 'Content-Security-Policy',
      value: buildCSP(isDev),
    },
  ]
}
