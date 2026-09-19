import type { Metadata } from 'next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AssetCategoryGrid } from '@/components/marketing/AssetCategoryGrid'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Asset Categories',
  description:
    'Browse asset finance by category — construction, manufacturing, agricultural, commercial vehicles, medical, technology and more.',
  canonical: '/assets',
})

export default function AssetsPage() {
  return (
    <>
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Assets', current: true }]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Asset categories"
              subtitle="Finance for the full spectrum of UK business capital equipment. Select a category to understand the finance options available."
            >
              What are you acquiring?
            </SectionHeading>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section variant="light" spacing="none">
        <AssetCategoryGrid linked cols={3} />
      </Section>

      <Section variant="light" spacing="2xl">
        <Container>
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-[var(--color-border-light)] pt-12">
              <div>
                <p className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-4">
                  Not sure which category applies?
                </p>
                <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
                  Asset finance is available for most types of business capital equipment. If your asset does not fit a specific category, apply under Specialist Equipment and describe the asset in your application.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <Button as="a" href="/apply" variant="primary" size="md">Start an Application</Button>
                <Button as="a" href="/asset-finance" variant="outline" size="md">About asset finance</Button>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  )
}
