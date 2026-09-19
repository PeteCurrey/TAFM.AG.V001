import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Insights',
  description: 'Knowledge and perspective on UK business asset finance — market commentary, finance structure guides and sector analysis from TAFM.',
  canonical: '/insights',
})

export default function InsightsPage() {
  // TODO: Fetch published insights from CMS/database when content pipeline is established
  const articles: null[] = []

  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Insights', current: true }]} variant="dark" className="mb-12" />
          <AnimateOnScroll>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Insights" subtitle="Knowledge and perspective on UK business asset finance.">
              The TAFM
              <br />
              knowledge hub.
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          {articles.length === 0 ? (
            <AnimateOnScroll>
              <EmptyState
                title="Insights coming soon"
                description="TAFM insights will cover UK asset finance markets, finance structure guidance, sector commentary and transaction intelligence. Check back as content is published."
                isIntegrationBoundary={false}
              />
            </AnimateOnScroll>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Insight cards rendered here when content is available */}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
