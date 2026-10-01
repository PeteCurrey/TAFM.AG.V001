import { describe, it, expect } from 'vitest'
import { generateMetadata, buildTitle, buildCanonical } from '@/lib/seo/metadata'
import sitemap from '@/app/sitemap'

// ─── SEO metadata tests ───────────────────────────────────────────────────────

describe('SEO Metadata', () => {

  describe('generateMetadata', () => {
    it('appends site name to title if not already present', () => {
      const meta = generateMetadata({
        title: 'Asset Finance',
        description: 'Test description',
      })
      expect(String(meta.title)).toContain('TAFM')
    })

    it('does not double-append site name', () => {
      const meta = generateMetadata({
        title: 'TAFM Homepage',
        description: 'Test',
      })
      const titleStr = String(meta.title)
      const tafmCount = (titleStr.match(/TAFM/g) ?? []).length
      expect(tafmCount).toBe(1)
    })

    it('populates OpenGraph title from title if not specified', () => {
      const meta = generateMetadata({
        title: 'Asset Finance',
        description: 'Test description',
      })
      expect(meta.openGraph?.title).toBeTruthy()
    })

    it('uses custom ogTitle when provided', () => {
      const meta = generateMetadata({
        title: 'Asset Finance',
        description: 'Test',
        ogTitle: 'Custom OG Title',
      })
      expect(meta.openGraph?.title).toBe('Custom OG Title')
    })

    it('sets canonical URL when provided', () => {
      const meta = generateMetadata({
        title: 'Asset Finance',
        description: 'Test',
        canonical: '/asset-finance',
      })
      expect(meta.alternates?.canonical).toContain('/asset-finance')
    })

    it('populates description', () => {
      const meta = generateMetadata({
        title: 'Test',
        description: 'A meaningful description for search engines.',
      })
      expect(meta.description).toBe('A meaningful description for search engines.')
    })

    it('sets twitter card type', () => {
      const meta = generateMetadata({
        title: 'Test',
        description: 'Desc',
        twitterCard: 'summary',
      })
      // Cast to any — Next.js Twitter type union changed; value is still set correctly at runtime
      expect((meta.twitter as any)?.card).toBe('summary')
    })

    it('defaults twitter card to summary_large_image', () => {
      const meta = generateMetadata({
        title: 'Test',
        description: 'Desc',
      })
      expect((meta.twitter as any)?.card).toBe('summary_large_image')
    })

    it('sets robots directive when provided', () => {
      const meta = generateMetadata({
        title: 'Draft Page',
        description: 'Under construction',
        robots: 'noindex, follow',
      })
      expect(meta.robots).toBe('noindex, follow')
    })
  })

  describe('buildTitle', () => {
    it('appends TAFM to the page title', () => {
      expect(buildTitle('Asset Finance')).toContain('| TAFM')
    })

    it('includes the page title', () => {
      expect(buildTitle('How It Works')).toContain('How It Works')
    })
  })

  describe('buildCanonical', () => {
    it('produces an absolute URL', () => {
      const canonical = buildCanonical('/asset-finance')
      expect(canonical).toMatch(/^https?:\/\//)
    })

    it('includes the provided path', () => {
      const canonical = buildCanonical('/assets/construction-equipment')
      expect(canonical).toContain('/assets/construction-equipment')
    })
  })

  describe('sitemap indexation gate', () => {
    it('excludes thin/unpopulated categories and includes verified specialist-equipment', () => {
      const entries = sitemap()
      const urls = entries.map((e) => e.url)

      // Verified populated route must be in sitemap
      expect(urls.some((u) => u.includes('/assets/specialist-equipment'))).toBe(true)
      expect(urls.some((u) => u.includes('/assets/specialist-equipment/ruthmann-steiger-t-650-hf-scania-2022'))).toBe(true)

      // Thin/placeholder categories must NOT be in XML sitemap (Section 3 requirement)
      expect(urls.some((u) => u.includes('/assets/construction-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/manufacturing-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/agricultural-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/commercial-vehicles'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/heavy-vehicles'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/industrial-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/medical-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/technology-it-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/renewable-energy-equipment'))).toBe(false)
      expect(urls.some((u) => u.includes('/assets/hospitality-equipment'))).toBe(false)

      // Draft / gated insights must NOT be in sitemap
      expect(urls.some((u) => u.includes('/insights'))).toBe(false)
    })
  })
})
