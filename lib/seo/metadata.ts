import type { Metadata } from 'next'
import type { SEOConfig, OGImage } from '@/types/seo'
import { absoluteUrl, getSiteUrl } from '@/lib/utils'

// ─── Default metadata ─────────────────────────────────────────────────────────

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'TAFM'
const SITE_URL = getSiteUrl()

const DEFAULT_OG_IMAGE: OGImage = {
  url: `${SITE_URL}/images/og-default.jpg`,
  width: 1200,
  height: 630,
  alt: 'TAFM — The Asset Finance Marketplace',
}

// ─── Metadata factory ─────────────────────────────────────────────────────────

/**
 * Generate Next.js Metadata from a SEOConfig.
 * No page should call this with empty or default values.
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    canonical,
    robots = 'index, follow',
    ogTitle,
    ogDescription,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    breadcrumbs,
  } = config

  const resolvedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const resolvedOgTitle = ogTitle ?? title
  const resolvedOgDesc = ogDescription ?? description
  const resolvedTwitterTitle = twitterTitle ?? resolvedOgTitle
  const resolvedTwitterDesc = twitterDescription ?? resolvedOgDesc
  const resolvedTwitterImage = twitterImage ?? ogImage.url
  const resolvedCanonical = canonical ? absoluteUrl(canonical) : undefined

  return {
    title: resolvedTitle,
    description,
    robots,
    alternates: resolvedCanonical
      ? {
          canonical: resolvedCanonical,
        }
      : undefined,
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDesc,
      type: ogType,
      url: resolvedCanonical ?? SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width ?? 1200,
          height: ogImage.height ?? 630,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: resolvedTwitterTitle,
      description: resolvedTwitterDesc,
      images: [resolvedTwitterImage],
    },
  }
}

// ─── Root metadata defaults ───────────────────────────────────────────────────

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TAFM — The Asset Finance Marketplace',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'TAFM connects UK businesses, asset suppliers and finance providers around the acquisition of business equipment. One application, multiple financing possibilities.',
  applicationName: SITE_NAME,
  keywords: [
    'asset finance',
    'business finance',
    'equipment finance',
    'hire purchase',
    'finance lease',
    'asset finance marketplace',
    'UK business finance',
  ],
  authors: [{ name: 'TAFM', url: SITE_URL }],
  creator: 'TAFM',
  publisher: 'TAFM',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'TAFM — The Asset Finance Marketplace',
    description:
      'One asset. One application. Multiple financing possibilities.',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAFM — The Asset Finance Marketplace',
    description: 'One asset. One application. Multiple financing possibilities.',
    images: [DEFAULT_OG_IMAGE.url],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'GB',
    'geo.placename': 'United Kingdom',
  },
}

// ─── Page-level metadata helpers ──────────────────────────────────────────────

export function buildTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`
}

export function buildCanonical(path: string): string {
  return absoluteUrl(path)
}
