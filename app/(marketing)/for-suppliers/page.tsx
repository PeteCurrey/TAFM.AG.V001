import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { LeadCaptureForm } from '@/components/marketing/LeadCaptureForm'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'For Equipment Suppliers & OEMs | Commercial Asset Finance Channel',
  description:
    'Turn finance into part of your sales process. Help equipment buyers access structured asset finance without managing individual lender relationships. Suitable for new and used plant, machinery, and commercial vehicles.',
  canonical: '/for-suppliers',
})

const ELIGIBLE_TAXONOMY_SECTORS = [
  { name: 'Construction Equipment', slug: 'construction-equipment', examples: 'Excavators, mobile cranes, dumpers, piling rigs' },
  { name: 'Commercial Vehicles', slug: 'commercial-vehicles', examples: 'HGVs, rigid trucks, tractor units, specialist transport' },
  { name: 'Manufacturing Machinery', slug: 'manufacturing-equipment', examples: 'CNC mills, fiber lasers, press brakes, robotic cells' },
  { name: 'Heavy Plant & Vehicles', slug: 'heavy-vehicles', examples: 'Low loaders, concrete mixers, tippers, sweepers' },
  { name: 'Agricultural Machinery', slug: 'agricultural-equipment', examples: 'Tractors, combines, telehandlers, precision systems' },
  { name: 'Industrial Equipment', slug: 'industrial-equipment', examples: 'Air compressors, generators, materials handling, forklifts' },
  { name: 'Medical & Healthcare', slug: 'medical-equipment', examples: 'Diagnostic imaging, MRI/CT, surgical equipment, dental suites' },
  { name: 'Specialist Equipment', slug: 'specialist-equipment', examples: 'Highflex access platforms, custom machinery, bespoke plant' },
]

const BENEFITS = [
  {
    title: 'Finance Embedded in Your Sales Cycle',
    body: 'When equipment buyers face upfront capital constraints or bank lending delays, deals stall. TAFM gives your sales team an immediate, structured financing path built directly around your commercial quotation.',
  },
  {
    title: 'Structured Customer & Quote Data',
    body: 'Your quotation specification is captured cleanly as structured digital deal data. Lenders receive standardized, complete dossiers, eliminating the back-and-forth queries that delay approvals.',
  },
  {
    title: 'Access to Multiple Specialist Lenders',
    body: 'Different lenders have different risk appetites. A high-street bank might decline a 7-year-old used excavator, while a specialist asset lender readily funds it. TAFM routes your customer to the lenders who actually want the asset.',
  },
  {
    title: 'No Lender Relationships to Manage',
    body: 'You do not need to negotiate lender agency agreements, maintain accreditation portals, or hire internal finance specialists. TAFM manages the network integration while you focus on equipment sales.',
  },
  {
    title: 'You Remain the Supplier of Record',
    body: 'TAFM operates strictly as marketplace infrastructure. Your customer relationship, pricing, and warranty terms remain entirely yours. Upon transaction completion, the finance provider settles directly with you.',
  },
  {
    title: 'Suitable for New & Used Equipment',
    body: 'Our lender network underwrites brand-new factory builds, approved dealer stock, and quality pre-owned commercial assets up to 10–12 years of age.',
  },
]

export default function ForSuppliersPage() {
  return (
    <>
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'For Suppliers', current: true }]}
            variant="dark"
            className="mb-8"
          />

          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Equipment Vendor & Dealer Proposition
              </span>
            </div>

            <SectionHeading
              as="h1"
              size="display-xl"
              variant="dark"
              eyebrow="Commercial Sales Infrastructure"
            >
              Turn finance into part
              <br />
              of your sales process.
            </SectionHeading>

            <p className="text-body-lg font-light text-neutral-300 max-w-2xl leading-relaxed mt-4">
              Help your customers fund equipment purchases with structured asset finance. Your quote sits at the centre of the application—unlocking sales without managing lender relationships.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button as="a" href="#register-interest" variant="primary" size="lg">
                Register as a Supplier
              </Button>
              <Button as="a" href="/how-it-works" variant="ghost" size="lg">
                How It Works
              </Button>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* ── 2. THE PROBLEM VS THE TAFM SOLUTION ──────────────────────────── */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* The Problem */}
            <div className="p-8 sm:p-10 rounded border border-red-200 bg-red-50/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-caption font-mono uppercase text-red-700 tracking-wider font-semibold">
                    The Commercial Friction
                  </span>
                </div>
                <h2 className="text-heading-xl font-light text-neutral-900 mb-4">
                  Why Equipment Deals Stall
                </h2>
                <p className="text-body text-neutral-700 font-light leading-relaxed mb-6">
                  Your customer genuinely wants and needs the machinery. However, deploying £50,000 to £500,000+ from their working capital would jeopardise their project cash flow. When they approach their traditional clearing bank, underwriting can take 6–8 weeks with rigid security requirements—putting the purchase on hold.
                </p>
                <div className="space-y-3 border-t border-red-200/60 pt-4 text-body-sm text-neutral-600 font-light">
                  <p>• Lengthy bank approval cycles stall customer orders</p>
                  <p>• Suppliers lack time to manage dozens of separate lender portals</p>
                  <p>• Single-broker dependencies lead to single-point declines</p>
                </div>
              </div>
            </div>

            {/* The TAFM Solution */}
            <div className="p-8 sm:p-10 rounded border border-emerald-200 bg-emerald-50/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-caption font-mono uppercase text-emerald-800 tracking-wider font-semibold">
                    The TAFM Solution
                  </span>
                </div>
                <h2 className="text-heading-xl font-light text-neutral-900 mb-4">
                  A Structured 5-Step Resolution
                </h2>
                <div className="space-y-4 text-body-sm text-neutral-700 font-light">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-emerald-600 font-bold">01</span>
                    <p><strong className="font-medium text-neutral-900">Supplier Quote:</strong> You issue your standard commercial quotation specifying equipment and price.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-emerald-600 font-bold">02</span>
                    <p><strong className="font-medium text-neutral-900">Structured Application:</strong> The customer applies via TAFM with your quote integrated into the deal data.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-emerald-600 font-bold">03</span>
                    <p><strong className="font-medium text-neutral-900">Provider Matching:</strong> TAFM routes the application to specialist lenders with verified appetite for that asset.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-emerald-600 font-bold">04</span>
                    <p><strong className="font-medium text-neutral-900">Finance Assessment:</strong> Matched underwriters assess the application rapidly on an asset-backed basis.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-emerald-600 font-bold">05</span>
                    <p><strong className="font-medium text-neutral-900">Supplier Paid:</strong> Once terms are signed, the lender pays you directly, and you release the equipment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3. COMMERCIAL BENEFITS ────────────────────────────────────────── */}
      <Section variant="light" spacing="2xl" className="border-t border-neutral-200 bg-neutral-50/50">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Commercial Advantages
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              Why Equipment Suppliers Partner with TAFM
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              Engineered specifically for plant, machinery, vehicle, and technical equipment vendors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, idx) => (
              <AnimateOnScroll key={idx} delay={idx * 40}>
                <div className="p-6 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-heading-md font-normal text-neutral-900 mb-3">
                      {b.title}
                    </h3>
                    <p className="text-body-sm font-light text-neutral-600 leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 4. APPLICABLE TAXONOMY CATEGORIES ──────────────────────────────── */}
      <Section variant="light" spacing="2xl" className="border-t border-neutral-200">
        <Container>
          <div className="mb-12">
            <span className="text-label text-neutral-500 uppercase font-mono tracking-widest">
              Eligible Sectors
            </span>
            <h2 className="text-heading-xl font-light text-neutral-900 mt-2">
              Supported Equipment Categories
            </h2>
            <p className="text-body text-neutral-600 font-light mt-1">
              TAFM’s participating finance providers have defined underwriting criteria across these industrial sectors:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ELIGIBLE_TAXONOMY_SECTORS.map((cat) => (
              <div
                key={cat.slug}
                className="p-5 rounded border border-neutral-200 bg-white hover:border-orange-500/50 transition-colors"
              >
                <h3 className="text-body font-medium text-neutral-900">
                  {cat.name}
                </h3>
                <p className="text-caption font-light text-neutral-500 mt-2 leading-relaxed">
                  {cat.examples}
                </p>
                <Link
                  href={`/assets/${cat.slug}`}
                  className="inline-block mt-3 text-caption text-orange-600 hover:text-orange-700 font-medium"
                >
                  View Category →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 5. REGISTRATION CAPTURE ───────────────────────────────────────── */}
      <Section variant="dark" spacing="2xl" id="register-interest" className="border-t border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-label text-orange-400 font-mono uppercase tracking-widest">
                Partner Onboarding
              </span>
              <h2 className="text-display-md font-extralight text-white">
                Register as a TAFM Supplier Partner.
              </h2>
              <p className="text-body text-neutral-300 font-light leading-relaxed">
                Connect your dealership or equipment distributorship with the TAFM network. Our partner team will reach out to configure your profile, verify your equipment lines, and provide direct quoting integration.
              </p>
              <div className="p-4 rounded border border-white/10 bg-white/[0.02] text-[11px] text-neutral-400 font-light leading-relaxed">
                <strong className="text-white font-normal">Data Governance:</strong> TAFM does not publish supplier names or logos until verified against Companies House and authorised by your commercial leadership.
              </div>
            </div>

            <div className="lg:col-span-7 p-8 rounded border border-white/10 bg-[#0d0d0d] shadow-2xl">
              <LeadCaptureForm type="supplier" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
