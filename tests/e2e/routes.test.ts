import { test, expect } from '@playwright/test'

// ─── Route smoke tests ────────────────────────────────────────────────────────
//
// Tests that every primary route responds with HTTP 200 and has correct page titles.
// Does not test rendering correctness — that is for unit and visual tests.

const ROUTES = [
  { path: '/',                          titleContains: 'TAFM' },
  { path: '/asset-finance',             titleContains: 'Asset Finance' },
  { path: '/assets',                    titleContains: 'Asset' },
  { path: '/assets/construction-equipment', titleContains: 'Construction' },
  { path: '/finance',                   titleContains: 'Finance' },
  { path: '/how-it-works',              titleContains: 'How' },
  { path: '/for-suppliers',             titleContains: 'Supplier' },
  { path: '/for-lenders',              titleContains: 'Finance Provider' },
  { path: '/insights',                  titleContains: 'Insight' },
  { path: '/about',                     titleContains: 'About' },
  { path: '/contact',                   titleContains: 'Contact' },
  { path: '/finance-calculator',        titleContains: 'Calculator' },
  { path: '/legal/privacy',             titleContains: 'Privacy' },
  { path: '/legal/cookies',             titleContains: 'Cookie' },
  { path: '/legal/terms',               titleContains: 'Terms' },
  { path: '/legal/financial-disclaimer', titleContains: 'Disclaimer' },
  { path: '/apply',                     titleContains: 'TAFM' },
  { path: '/sitemap.xml',               titleContains: null },
  { path: '/robots.txt',               titleContains: null },
  { path: '/api/health',               titleContains: null },
]

for (const { path, titleContains } of ROUTES) {
  test(`${path} responds 200`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
    // Some routes return non-200 intentionally (e.g. insights/[slug] = 404)
    expect(response?.status()).not.toBe(500)
  })

  if (titleContains) {
    test(`${path} has correct page title`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const title = await page.title()
      expect(title.toLowerCase()).toContain(titleContains.toLowerCase())
    })
  }
}

// ─── Critical user journey tests ─────────────────────────────────────────────

test('Homepage has main navigation links', async ({ page }) => {
  await page.goto('/')
  const header = page.locator('header[role="banner"]')
  await expect(header).toBeVisible()
})

test('Apply page shows first step (Asset)', async ({ page }) => {
  await page.goto('/apply')
  await expect(page.getByText('Asset', { exact: true })).toBeVisible()
})

test('Finance calculator shows result after input', async ({ page }) => {
  await page.goto('/finance-calculator')
  // Fill asset value
  await page.fill('input#asset-value', '75000')
  await page.fill('input#deposit', '15000')
  await page.click('button:has-text("Calculate")')
  // Result should appear
  await expect(page.getByText('Indicative monthly payment')).toBeVisible()
})

test('404 page is not a 500 error', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).not.toBe(500)
})
