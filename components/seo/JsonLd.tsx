import type { StructuredDataObject } from '@/types/seo'

// ─── JSON-LD structured data injector ────────────────────────────────────────

interface JsonLdProps {
  data: StructuredDataObject | StructuredDataObject[]
}

/**
 * Renders JSON-LD structured data as a <script> tag.
 * Use in Server Components for SEO structured data.
 * Never include user-generated or unvalidated data without sanitisation.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(Array.isArray(data) ? data : [data])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
