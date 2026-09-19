import type { MetadataRoute } from 'next'

// ─── Sitemap ───────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tafm.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static routes — core marketing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/asset-finance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/assets`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/finance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/finance-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/for-suppliers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/for-lenders`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/insights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // Asset category pages
    {
      url: `${SITE_URL}/assets/construction-equipment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/assets/manufacturing-equipment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/assets/agricultural-equipment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/assets/commercial-vehicles`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/assets/heavy-vehicles`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/assets/medical-equipment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/assets/technology-it-equipment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Legal — low priority but must be indexed
    {
      url: `${SITE_URL}/legal/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/financial-disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // TODO: Append dynamic routes when database is populated:
  // const articles = await getPublishedInsights()
  // const articleRoutes = articles.map(a => ({ url: `${SITE_URL}/insights/${a.slug}`, ... }))
  // const categoryRoutes = await getAssetCategoryRoutes()

  return staticRoutes
}
