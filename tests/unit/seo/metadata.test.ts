import { describe, it, expect } from 'vitest'
import { generateMetadata, buildTitle, buildCanonical } from '@/lib/seo/metadata'

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
})
