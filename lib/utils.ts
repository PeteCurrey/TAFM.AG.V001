import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Class name utility ────────────────────────────────────────────────────────

/**
 * Merge Tailwind CSS class names safely, resolving conflicts.
 * Uses clsx for conditional logic and tailwind-merge for conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Format a number as GBP currency.
 * Defaults to GBP for UK market; currency can be overridden for future territories.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'GBP',
  locale: string = 'en-GB',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number as a compact currency value (e.g. £1.2m, £450k).
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'GBP',
  locale: string = 'en-GB',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

// ─── Dates ────────────────────────────────────────────────────────────────────

/**
 * Format a date in a human-readable format.
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  locale: string = 'en-GB',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

/**
 * Format a date as ISO 8601 string (for structured data, canonical dates).
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

// ─── Strings ──────────────────────────────────────────────────────────────────

/**
 * Convert a string to a URL-safe slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncate a string to a maximum length, appending an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

// ─── Numbers ──────────────────────────────────────────────────────────────────

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation between two values.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Round to a specified number of decimal places.
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

// ─── Environment ──────────────────────────────────────────────────────────────

/**
 * Returns true if running in a production environment.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Returns true if running in a development environment.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Returns true if running on the server (Node.js context).
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

// ─── URL ──────────────────────────────────────────────────────────────────────

/**
 * Build an absolute URL from a path, using the configured site URL.
 */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tafm.co.uk'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
