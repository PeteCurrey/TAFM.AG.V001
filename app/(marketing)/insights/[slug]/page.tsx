import { notFound } from 'next/navigation'

// ─── Individual insight page ───────────────────────────────────────────────────
//
// Architecture placeholder.
// Full implementation requires a content pipeline (MDX, CMS, or DB-backed).

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // TODO: Fetch article by slug from content pipeline
  // const article = await getArticleBySlug(slug)
  // if (!article) notFound()

  // Return 404 until content pipeline is established
  notFound()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return {
    title: `Insight — ${slug}`,
    robots: 'noindex',
  }
}
