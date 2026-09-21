import type { StructuredDataObject, BreadcrumbItem } from '@/types/seo'
import { getSiteUrl } from '@/lib/utils'

const SITE_URL = getSiteUrl()
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'TAFM'

// ─── Organisation ─────────────────────────────────────────────────────────────

export function generateOrganizationSchema(): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'TAFM',
    url: SITE_URL,
    description:
      'TAFM is a digital marketplace and transaction infrastructure platform for business asset finance in the UK.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@tafm.co.uk',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    sameAs: [],
  }
}

// ─── Website ──────────────────────────────────────────────────────────────────

export function generateWebSiteSchema(): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'The Asset Finance Marketplace for UK businesses.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/assets?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─── Web page ─────────────────────────────────────────────────────────────────

export function generateWebPageSchema(config: {
  name: string
  description: string
  url: string
  lastModified?: Date
  breadcrumbs?: BreadcrumbItem[]
}): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.name,
    description: config.description,
    url: config.url,
    isPartOf: { '@id': SITE_URL },
    ...(config.lastModified && {
      dateModified: config.lastModified.toISOString(),
    }),
    ...(config.breadcrumbs && {
      breadcrumb: generateBreadcrumbSchema(config.breadcrumbs),
    }),
  }
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export function generateBreadcrumbSchema(
  breadcrumbs: BreadcrumbItem[],
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href && { item: `${SITE_URL}${crumb.href}` }),
    })),
  }
}

// ─── Article ──────────────────────────────────────────────────────────────────

export function generateArticleSchema(config: {
  title: string
  description: string
  url: string
  publishedAt: Date
  updatedAt?: Date
  author?: string
  imageUrl?: string
}): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.description,
    url: config.url,
    datePublished: config.publishedAt.toISOString(),
    dateModified: (config.updatedAt ?? config.publishedAt).toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    isPartOf: { '@id': SITE_URL },
    ...(config.imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: config.imageUrl,
      },
    }),
  }
}

// ─── Financial service ────────────────────────────────────────────────────────

export function generateFinancialServiceSchema(): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: SITE_NAME,
    description:
      'Asset finance marketplace connecting UK businesses with finance providers for business equipment acquisition.',
    url: SITE_URL,
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
      '@id': 'https://www.wikidata.org/wiki/Q145',
    },
    serviceType: 'Asset Finance',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
