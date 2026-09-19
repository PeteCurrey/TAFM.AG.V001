import type { Metadata, Viewport } from 'next'
import { Work_Sans } from 'next/font/google'
import { rootMetadata } from '@/lib/seo/metadata'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema'
import '@/app/globals.css'

// ─── Font loading ─────────────────────────────────────────────────────────────

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  display: 'swap',
  variable: '--font-work-sans',
  preload: true,
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = rootMetadata

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const orgSchema = generateOrganizationSchema()
  const siteSchema = generateWebSiteSchema()

  return (
    <html lang="en-GB" className={workSans.variable} suppressHydrationWarning>
      <head>
        {/* Structured data: sitewide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {/* DNS prefetch for future CDN/image domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className="surface-dark antialiased">
        {children}
      </body>
    </html>
  )
}
