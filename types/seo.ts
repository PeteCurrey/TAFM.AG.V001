// ─── SEO configuration types ──────────────────────────────────────────────────

/**
 * SEO configuration for all indexable pages.
 * No page should be allowed to have empty or default metadata.
 */
export interface SEOConfig {
  title: string
  description: string
  canonical?: string

  // Indexing control
  robots?: string // e.g. "index, follow" | "noindex, nofollow"

  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: OGImage
  ogType?: 'website' | 'article'

  // Twitter/X
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string

  // Structured data
  schema?: StructuredDataObject | StructuredDataObject[]

  // Breadcrumbs
  breadcrumbs?: BreadcrumbItem[]

  // Editorial metadata
  primaryKeyword?: string
  secondaryKeywords?: string[]
  lastUpdated?: Date
  contentStatus?: 'PUBLISHED' | 'DRAFT' | 'REVIEW'

  // Programmatic page metadata
  entityType?: string
  entitySlug?: string
}

export interface OGImage {
  url: string
  width?: number
  height?: number
  alt: string
  type?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// ─── Structured data (JSON-LD) ────────────────────────────────────────────────

export type StructuredDataType =
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'Product'
  | 'LocalBusiness'
  | 'FinancialService'

export interface StructuredDataObject {
  '@context': 'https://schema.org'
  '@type': StructuredDataType
  [key: string]: unknown
}

// ─── Sitemap entry ────────────────────────────────────────────────────────────

export interface SitemapEntry {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

// ─── Internal linking ─────────────────────────────────────────────────────────

export interface RelatedEntity {
  id: string
  title: string
  href: string
  description?: string
  type: 'asset' | 'finance' | 'manufacturer' | 'supplier' | 'insight' | 'category'
}
