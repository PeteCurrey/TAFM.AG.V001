// ─── Central logging abstraction ──────────────────────────────────────────────
//
// Never log:
//   - API keys or secrets
//   - Passwords or hashes
//   - Full financial documents
//   - Unnecessary personal information
//   - Full stack traces in production

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type LogDomain =
  | 'app'
  | 'db'
  | 'ai'
  | 'finance'
  | 'integration'
  | 'security'
  | 'audit'

export interface LogEntry {
  level: LogLevel
  message: string
  domain?: LogDomain
  data?: Record<string, unknown>
  timestamp: string
  environment: string
}

// ─── Sanitisation ────────────────────────────────────────────────────────────

const SENSITIVE_KEYS = [
  'password',
  'passwordHash',
  'apiKey',
  'api_key',
  'secret',
  'token',
  'authorization',
  'creditCard',
  'cardNumber',
  'cvv',
  'nino', // National Insurance Number
  'ssn',
]

function sanitise(data?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!data) return undefined
  const sanitised: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      sanitised[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitised[key] = sanitise(value as Record<string, unknown>)
    } else {
      sanitised[key] = value
    }
  }
  return sanitised
}

// ─── Logger ───────────────────────────────────────────────────────────────────

function log(
  level: LogLevel,
  message: string,
  data?: Record<string, unknown>,
  domain: LogDomain = 'app',
): void {
  const entry: LogEntry = {
    level,
    message,
    domain,
    data: sanitise(data),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'unknown',
  }

  // In production, emit structured JSON for log aggregators
  if (process.env.NODE_ENV === 'production') {
    if (level === 'error') {
      console.error(JSON.stringify(entry))
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry))
    } else {
      console.log(JSON.stringify(entry))
    }
    return
  }

  // In development, use human-readable format
  const prefix = `[${entry.timestamp}] [${domain.toUpperCase()}] [${level.toUpperCase()}]`
  if (level === 'error') {
    console.error(prefix, message, entry.data ?? '')
  } else if (level === 'warn') {
    console.warn(prefix, message, entry.data ?? '')
  } else {
    console.log(prefix, message, entry.data ?? '')
  }
}

export const logger = {
  info: (message: string, data?: Record<string, unknown>, domain?: LogDomain) =>
    log('info', message, data, domain),

  warn: (message: string, data?: Record<string, unknown>, domain?: LogDomain) =>
    log('warn', message, data, domain),

  error: (message: string, data?: Record<string, unknown>, domain?: LogDomain) =>
    log('error', message, data, domain),

  debug: (message: string, data?: Record<string, unknown>, domain?: LogDomain) => {
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, data, domain)
    }
  },

  // Domain-scoped helpers
  security: (message: string, data?: Record<string, unknown>) =>
    log('warn', message, data, 'security'),

  audit: (message: string, data?: Record<string, unknown>) =>
    log('info', message, data, 'audit'),

  ai: (message: string, data?: Record<string, unknown>) =>
    log('info', message, data, 'ai'),

  finance: (message: string, data?: Record<string, unknown>) =>
    log('info', message, data, 'finance'),

  integration: (message: string, data?: Record<string, unknown>) =>
    log('info', message, data, 'integration'),
}
