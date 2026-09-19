import type { MetadataRoute } from 'next'

// ─── robots.txt ───────────────────────────────────────────────────────────────

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tafm.co.uk'
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) {
    // Prevent development and staging from being indexed
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/apply/',
          '/account/',
          '/admin/',
          '/_next/',
          '/404',
          '/500',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
