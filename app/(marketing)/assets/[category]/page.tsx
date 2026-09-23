import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { generateMetadata as genMeta } from '@/lib/seo/metadata'

// ─── Asset category data ──────────────────────────────────────────────────────

interface CategoryDetail {
  name: string
  description: string
  equipmentTypes: string[]
  commonStructures: Array<{ name: string; slug: string; note: string }>
  financeNote: string
  verifiedManufacturers: string[]
  relatedSlugs: string[]
}

const CATEGORY_DATA: Record<string, CategoryDetail> = {
  'construction-equipment': {
    name: 'Construction Equipment',
    description:
      'Heavy plant and earthmoving equipment essential for civil engineering, commercial development, quarrying, and groundworks.',
    equipmentTypes: [
      'Tracked & Wheeled Excavators',
      'Tower & Mobile Telescopic Cranes',
      'Articulated Dump Trucks & Site Dumpers',
      'Piling Rigs & Rotary Drilling Equipment',
      'Compactors, Rollers & Trenching Units',
      'Bulldozers & Motor Graders',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'Standard for long-life excavators and plant' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Spreads VAT across rentals to protect project liquidity' },
      { name: 'Asset Refinance', slug: 'asset-refinance', note: 'Release capital from existing unencumbered fleet' },
    ],
    financeNote:
      'Construction equipment typically qualifies for Hire Purchase or Finance Lease with terms from 24 to 72 months. Assets with strong secondary auction resale value retain high advance ratios.',
    verifiedManufacturers: ['JCB', 'Liebherr'],
    relatedSlugs: ['heavy-vehicles', 'industrial-equipment', 'specialist-equipment'],
  },
  'manufacturing-equipment': {
    name: 'Manufacturing Equipment',
    description:
      'Precision production machinery, automated assembly systems, and fabrication tools for modern British industrial production.',
    equipmentTypes: [
      '5-Axis CNC Machining Centres & Lathes',
      'Fiber Laser Cutters & Waterjet Systems',
      'Hydraulic & Mechanical Press Brakes',
      'Robotic Welding Cells & Pick-and-Place Arms',
      'Injection Moulding & Extrusion Lines',
      'Automated Quality Inspection & CMM Machines',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'Ideal for equipment with 10+ year operational life' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Offset monthly payments directly against corporation tax' },
      { name: 'Asset Refinance', slug: 'asset-refinance', note: 'Unlock equity from installed production lines' },
    ],
    financeNote:
      'High-value manufacturing assets are well-suited to Hire Purchase and Finance Lease over 3 to 7 years. Capital allowances (such as Full Expensing) can often be applied.',
    verifiedManufacturers: [],
    relatedSlugs: ['industrial-equipment', 'technology-it-equipment', 'specialist-equipment'],
  },
  'agricultural-equipment': {
    name: 'Agricultural Equipment',
    description:
      'Tractors, harvesting machinery, and precision farming systems designed for commercial agriculture, arable farming, and livestock.',
    equipmentTypes: [
      'High-Horsepower Agricultural Tractors',
      'Combine & Forage Harvesters',
      'Telescopic Handlers & Farm Loaders',
      'Irrigation & Automated Slurry Systems',
      'Grain Drying, Storage & Handling Plants',
      'Precision GPS Guidance & Spraying Booms',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'Can be structured with seasonal cash flow repayments' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Low initial outlay with deferred VAT options' },
    ],
    financeNote:
      'Agricultural asset finance can be structured with seasonal, annual, or balloon repayments to mirror harvest cycles and single farm payment timing.',
    verifiedManufacturers: ['JCB'],
    relatedSlugs: ['heavy-vehicles', 'commercial-vehicles', 'construction-equipment'],
  },
  'commercial-vehicles': {
    name: 'Commercial Vehicles',
    description:
      'Road transport fleets, delivery vehicles, and freight logistics transport for UK distribution and trade operators.',
    equipmentTypes: [
      'Articulated Tractor Units (4x2 and 6x2)',
      'Curtainsider, Box & Flatbed Rigid Trucks',
      'Refrigerated Transport & Temperature-Controlled Vans',
      'Dropside & Tipper Commercials',
      'Medium & Large Panel Delivery Vans',
    ],
    commonStructures: [
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Most common structure; VAT paid monthly with peppercorn option' },
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'For vehicles retained until end of useful life' },
      { name: 'Operating Lease', slug: 'operating-lease', note: 'Low monthly payments with vehicle return at term end' },
    ],
    financeNote:
      'Commercial vehicles are among the most liquid asset classes in the UK. Competitive underwriting terms are available across HP, Finance Lease, and Contract Hire.',
    verifiedManufacturers: ['Scania'],
    relatedSlugs: ['heavy-vehicles', 'specialist-equipment', 'construction-equipment'],
  },
  'heavy-vehicles': {
    name: 'Heavy Vehicles',
    description:
      'Specialised heavy transport, multi-axle chassis, road maintenance, and heavy construction logistics vehicles.',
    equipmentTypes: [
      'Multi-Axle Heavy Haulage Tractor Units (6x4 and 8x4)',
      'Low Loader Trailers & Step-Frame Transporters',
      '8-Wheeler Tipper Trucks & Muckaway Units',
      'Volumetric Concrete Mixers & Batching Trucks',
      'Municipal Road Sweepers & Gully Suckers',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'Build equity in custom heavy chassis configurations' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Flexible secondary extensions' },
      { name: 'Asset Refinance', slug: 'asset-refinance', note: 'Refinance existing fleet to fund expansion' },
    ],
    financeNote:
      'Heavy multi-axle chassis with bespoke superstructures require lenders with dedicated underwriting appetite for non-standard heavy transport.',
    verifiedManufacturers: ['Scania'],
    relatedSlugs: ['commercial-vehicles', 'construction-equipment', 'specialist-equipment'],
  },
  'medical-equipment': {
    name: 'Medical Equipment',
    description:
      'Clinical diagnostics, medical imaging systems, and surgical apparatus for private hospitals, NHS trusts, and diagnostic clinics.',
    equipmentTypes: [
      'Magnetic Resonance Imaging (MRI) Scanners',
      'Computed Tomography (CT) & PET Scanners',
      'Diagnostic Ultrasound & Mammography Units',
      'Minimally Invasive Robotic Surgery Platforms',
      'Ophthalmic Laser & Optical Coherence Systems',
      'Digital Dental Imaging & Operatory Suites',
    ],
    commonStructures: [
      { name: 'Operating Lease', slug: 'operating-lease', note: 'Avoid obsolescence as technology evolves rapidly' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Spread capital costs across equipment lifetime' },
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'For long-term clinical suites' },
    ],
    financeNote:
      'Medical equipment finance requires specialist underwriting familiar with clinical governance, maintenance contracts, and regulatory lifespans.',
    verifiedManufacturers: [],
    relatedSlugs: ['technology-it-equipment', 'industrial-equipment', 'specialist-equipment'],
  },
  'industrial-equipment': {
    name: 'Industrial Equipment',
    description:
      'Facilities plant, materials handling machinery, power generation, and environmental engineering systems for factories and warehouses.',
    equipmentTypes: [
      'Rotary Screw Air Compressors & Nitrogen Generators',
      'Standby & Prime Power Diesel/Gas Generators',
      'Electric Counterbalance & Reach Forklift Trucks',
      'Overhead Gantry Cranes & Hoist Systems',
      'Industrial Chiller & Boiler Installations',
      'Automated Conveyor & Palletising Systems',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'For permanent infrastructure installations' },
      { name: 'Operating Lease', slug: 'operating-lease', note: 'Common for warehouse forklift fleets' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Monthly rental tax deductions' },
    ],
    financeNote:
      'Industrial infrastructure typically benefits from standard 36 to 60 month terms, often including bundled maintenance covenants.',
    verifiedManufacturers: ['Liebherr'],
    relatedSlugs: ['manufacturing-equipment', 'renewable-energy-equipment', 'specialist-equipment'],
  },
  'technology-it-equipment': {
    name: 'Technology & IT Equipment',
    description:
      'Enterprise server infrastructure, network switching, broadcast production technology, and corporate compute clusters.',
    equipmentTypes: [
      'High-Density Blade Servers & Storage Area Networks (SAN)',
      'Enterprise Core Switches & Optical Networking',
      'Broadcast 4K Cameras & Post-Production Suites',
      'Automated Robotics & Autonomous Mobile Robots (AMRs)',
      'High-Performance Compute (HPC) AI Accelerators',
    ],
    commonStructures: [
      { name: 'Operating Lease', slug: 'operating-lease', note: 'Facilitates 24–36 month technology replacement cycles' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Preserves capital for software and deployment' },
    ],
    financeNote:
      'Due to steep depreciation and rapid generational turnover, technology hardware is primarily funded through structured leasing models.',
    verifiedManufacturers: [],
    relatedSlugs: ['medical-equipment', 'manufacturing-equipment', 'industrial-equipment'],
  },
  'renewable-energy-equipment': {
    name: 'Renewable Energy Equipment',
    description:
      'Commercial solar arrays, battery energy storage, wind generation, and commercial EV charging hubs for industrial sites.',
    equipmentTypes: [
      'Commercial Rooftop & Ground-Mount Solar PV Arrays',
      'Commercial Battery Energy Storage Systems (BESS)',
      'High-Capacity Fleet EV Charging Infrastructure',
      'Commercial Biomass & Ground-Source Heat Pumps',
      'Wind Turbine Installations & Grid Inverters',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'Longer terms (up to 84 months) aligned with energy payback' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Tax-efficient operational funding' },
      { name: 'Asset Refinance', slug: 'asset-refinance', note: 'Refinance operational solar to fund new installations' },
    ],
    financeNote:
      'Renewable assets are frequently underwritten on the basis of energy cost reduction and verified Power Purchase Agreements (PPAs).',
    verifiedManufacturers: [],
    relatedSlugs: ['industrial-equipment', 'manufacturing-equipment', 'specialist-equipment'],
  },
  'specialist-equipment': {
    name: 'Specialist Equipment',
    description:
      'Niche, bespoke, and heavy-duty machinery that does not fit standard mass-production classifications—including truck-mounted access platforms and specialist lifting.',
    equipmentTypes: [
      'Truck-Mounted Highflex Access Platforms (up to 90m)',
      'Heavy-Lift Knuckle-Boom Cranes & Demolition Rigs',
      'Forestry Harvesters & Forwarders',
      'Specialist Rail & Track Maintenance Machinery',
      'Bespoke Industrial Processing & Recycling Plant',
    ],
    commonStructures: [
      { name: 'Hire Purchase', slug: 'hire-purchase', note: 'Build equity in high-value bespoke machinery' },
      { name: 'Finance Lease', slug: 'finance-lease', note: 'Monthly VAT benefits on large ticket sizes' },
      { name: 'Asset Refinance', slug: 'asset-refinance', note: 'Unlock capital from established specialist assets' },
    ],
    financeNote:
      'Specialist equipment requires lenders with proven appetite for niche machinery, verified secondary remarketing values, and bespoke underwriting guidelines.',
    verifiedManufacturers: ['Ruthmann', 'Palfinger', 'Scania'],
    relatedSlugs: ['construction-equipment', 'heavy-vehicles', 'manufacturing-equipment'],
  },
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const data = CATEGORY_DATA[category]
  if (!data) return {}

  return genMeta({
    title: `${data.name} Finance`,
    description: `${data.description} Structured finance options including Hire Purchase, Finance Lease, and Refinance on TAFM.`,
    canonical: `/assets/${category}`,
  })
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function AssetCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const data = CATEGORY_DATA[category]

  if (!data) notFound()

  const isSpecialist = category === 'specialist-equipment'

  return (
    <>
      {/* Hero */}
      <Section variant="dark" spacing="2xl" className="pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Assets', href: '/assets' },
              { label: data.name, current: true },
            ]}
            variant="dark"
            className="mb-12"
          />
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/10 bg-white/5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              <span className="text-caption font-mono uppercase tracking-wider text-white/70">
                Asset Category Intelligence
              </span>
            </div>
            <SectionHeading as="h1" size="display-xl" variant="dark" eyebrow="Equipment Sector">
              {data.name}
            </SectionHeading>
            <p className="text-body-lg font-light text-[var(--color-text-on-dark-2)] max-w-2xl leading-relaxed mt-4">
              {data.description}
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Main Content Area */}
      <Section variant="light" spacing="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Cols: Overview, Equipment Types, Structures */}
            <div className="lg:col-span-8 space-y-12">
              {/* Category Introduction & Equipment Types */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">
                    Equipment Types Financed
                  </h2>
                  <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-6">
                    TAFM facilitates asset finance applications across new and used machinery in this sector. Typical equipment configurations include:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.equipmentTypes.map((type) => (
                      <div
                        key={type}
                        className="p-4 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)] flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" aria-hidden="true" />
                        <span className="text-body-sm font-light text-[var(--color-text-on-light-primary)]">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Finance Structures & Considerations */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">
                    Financing Considerations
                  </h2>
                  <div className="p-6 border-l-2 border-orange-500 bg-orange-50/40 mb-6">
                    <p className="text-body font-light text-[var(--color-text-on-light-primary)] leading-relaxed">
                      {data.financeNote}
                    </p>
                  </div>

                  <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
                    Applicable Commercial Structures
                  </h3>
                  <div className="space-y-3">
                    {data.commonStructures.map((s) => (
                      <div
                        key={s.name}
                        className="p-4 border border-[var(--color-border-light)] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-500/40 transition-colors"
                      >
                        <div>
                          <Link href={`/finance/${s.slug}`} className="text-body font-medium text-orange-600 hover:underline">
                            {s.name} →
                          </Link>
                          <p className="text-caption font-light text-[var(--color-text-on-light-3)] mt-0.5">
                            {s.note}
                          </p>
                        </div>
                        <Button as="a" href={`/finance/${s.slug}`} variant="outline" size="sm" className="whitespace-nowrap">
                          Structure details
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Verified Assets Section */}
              <AnimateOnScroll>
                <div>
                  <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-6">
                    Verified Assets in this Category
                  </h2>

                  {isSpecialist ? (
                    /* Real Verified Flagship Asset Card */
                    <div className="border border-[var(--color-border-light)] rounded-sm overflow-hidden bg-white shadow-sm">
                      <div className="relative h-64 sm:h-80 w-full bg-[#050505]">
                        <Image
                          src="/images/hero-bg.jpg"
                          alt="Ruthmann STEIGER T 650 HF access platform"
                          fill
                          className="object-cover object-center"
                        />
                        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-sm border border-emerald-500/50 rounded-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                          <span className="text-caption font-mono uppercase text-emerald-400">
                            Verified Production Record
                          </span>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8 space-y-6">
                        <div>
                          <p className="text-caption font-mono uppercase text-orange-600 mb-1">
                            Ruthmann Holdings GmbH · 2022
                          </p>
                          <h3 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)]">
                            Ruthmann STEIGER T 650 HF on Scania 8x4 (2022)
                          </h3>
                          <p className="text-body-sm font-light text-[var(--color-text-on-light-2)] mt-2 leading-relaxed">
                            Flagship 65m highflex access platform mounted on Scania 32t chassis. Full main dealer service history and valid LOLER inspection.
                          </p>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--color-surface-off-white)] rounded-sm text-xs font-light">
                          <div>
                            <span className="text-[var(--color-text-on-light-muted)] block">Working Height</span>
                            <span className="font-mono text-sm text-[var(--color-text-on-light-primary)] font-medium">65.0 m</span>
                          </div>
                          <div>
                            <span className="text-[var(--color-text-on-light-muted)] block">Max Outreach</span>
                            <span className="font-mono text-sm text-[var(--color-text-on-light-primary)] font-medium">43.0 m</span>
                          </div>
                          <div>
                            <span className="text-[var(--color-text-on-light-muted)] block">Chassis / GVW</span>
                            <span className="font-mono text-sm text-[var(--color-text-on-light-primary)] font-medium">Scania 8x4 (32t)</span>
                          </div>
                          <div>
                            <span className="text-[var(--color-text-on-light-muted)] block">Operating Hours</span>
                            <span className="font-mono text-sm text-[var(--color-text-on-light-primary)] font-medium">1,450 hrs</span>
                          </div>
                        </div>

                        {/* Market Observations (Strictly Separated) */}
                        <div className="space-y-3 pt-2">
                          <h4 className="text-caption font-mono uppercase tracking-wider text-[var(--color-text-on-light-muted)]">
                            Real Market Observations
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border-l-2 border-emerald-500 bg-emerald-50/30 rounded-r-sm">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                                AUCTION RESULT (COMPLETED SALE)
                              </span>
                              <span className="font-mono text-heading-md text-[var(--color-text-on-light-primary)] block my-0.5">
                                £620,000
                              </span>
                              <span className="text-caption text-[var(--color-text-on-light-3)] block">
                                Euro Auctions Leeds · June 2024
                              </span>
                            </div>

                            <div className="p-4 border-l-2 border-blue-500 bg-blue-50/30 rounded-r-sm">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-800 font-semibold block">
                                ASKING PRICE (DEALER ADVERTISED)
                              </span>
                              <span className="font-mono text-heading-md text-[var(--color-text-on-light-primary)] block my-0.5">
                                £695,000
                              </span>
                              <span className="text-caption text-[var(--color-text-on-light-3)] block">
                                PlantTrader UK · Sept 2024
                              </span>
                            </div>
                          </div>

                          <div className="p-3 border border-amber-300 bg-amber-50/50 rounded-sm">
                            <p className="text-caption text-amber-900 font-light">
                              <strong>Valuation Status:</strong> Insufficient verified transaction data for a formal valuation. Real observations are shown independently without algorithmic conflation.
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-4">
                          <Button as="a" href={`/assets/specialist-equipment/ruthmann-steiger-t-650-hf-scania-2022`} variant="primary" size="md">
                            View Full Asset Specification & Observations →
                          </Button>
                          <Button as="a" href="/apply?category=specialist-equipment&asset=Ruthmann%20STEIGER%20T%20650%20HF" variant="secondary" size="md">
                            Finance this asset
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Intentional Empty State — Section 11 Requirement */
                    <div className="p-8 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                      <div className="inline-flex items-center gap-2 px-3 py-1 border border-orange-500/30 bg-orange-50 rounded-sm mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                        <span className="text-caption font-mono uppercase tracking-wider text-orange-700">
                          Data Progression
                        </span>
                      </div>
                      <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
                        VERIFIED ASSET DATA IS BEING BUILT
                      </h3>
                      <p className="text-body font-light text-[var(--color-text-on-light-2)] leading-relaxed mb-6">
                        TAFM is progressively building a verified asset intelligence database for {data.name.toLowerCase()}. We publish records only when manufacturer technical specifications and independent market observations have been rigorously validated.
                      </p>
                      <div className="space-y-3 mb-8">
                        <p className="text-body-sm font-medium text-[var(--color-text-on-light-primary)]">
                          In the meantime, you can:
                        </p>
                        <ul className="space-y-2 text-body-sm font-light text-[var(--color-text-on-light-3)]" role="list">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold">·</span>
                            <span>Explore available commercial finance structures above.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold">·</span>
                            <span>Start a finance application with your supplier’s quote for any asset in this category.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 font-bold">·</span>
                            <span>Register as an equipment supplier to connect your inventory directly with participating finance providers.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button as="a" href="/apply" variant="primary" size="md">
                          Finance an asset in this category
                        </Button>
                        <Button as="a" href="/for-suppliers" variant="outline" size="md">
                          Register as an equipment supplier
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right 4 Cols: Sidebar */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              {/* Category Actions */}
              <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-[var(--color-surface-off-white)]">
                <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-4">
                  Finance Action
                </h3>
                <p className="text-body-sm font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
                  Have an equipment quote from a UK supplier? Submit your requirement through TAFM for deterministic provider matching.
                </p>
                <div className="space-y-3">
                  <Button as="a" href="/apply" variant="primary" fullWidth size="md">
                    Finance an asset in this category
                  </Button>
                  <Button as="a" href="/finance-calculator" variant="outline" fullWidth size="sm">
                    Finance calculator
                  </Button>
                </div>
              </div>

              {/* Verified Manufacturers (Only if in database) */}
              {data.verifiedManufacturers.length > 0 && (
                <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white">
                  <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                    Represented Manufacturers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.verifiedManufacturers.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1 border border-[var(--color-border-light)] text-xs font-mono text-[var(--color-text-on-light-primary)] rounded-sm bg-[var(--color-surface-off-white)]"
                      >
                        {m} (Verified)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Categories Navigation */}
              <div className="p-6 border border-[var(--color-border-light)] rounded-sm bg-white">
                <h3 className="text-label tracking-widest uppercase text-[var(--color-text-on-light-muted)] mb-3">
                  Related Categories
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  {data.relatedSlugs.map((slug) => {
                    const related = CATEGORY_DATA[slug]
                    if (!related) return null
                    return (
                      <li key={slug}>
                        <Link href={`/assets/${slug}`} className="text-orange-600 hover:underline">
                          {related.name} →
                        </Link>
                      </li>
                    )
                  })}
                  <li>
                    <Link href="/assets" className="text-[var(--color-text-on-light-3)] hover:text-black">
                      All asset categories →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_DATA).map((category) => ({ category }))
}
