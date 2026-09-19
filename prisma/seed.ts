import { PrismaClient } from '@prisma/client'
import { logger } from '@/lib/logging'

// ─── Prisma seed ──────────────────────────────────────────────────────────────
//
// Seeds foundational taxonomy data — categories, not invented asset records.
// NEVER seed: fake lenders, fake businesses, fake assets, fake rates.
// Only seed: asset categories, finance structure definitions.

const prisma = new PrismaClient()

async function seed() {
  logger.info('Starting database seed...', {}, 'db')

  // Asset categories
  const categories = [
    { slug: 'construction-equipment',     name: 'Construction Equipment',     description: 'Excavators, cranes, piling rigs, scaffolding and groundworks equipment.' },
    { slug: 'manufacturing-equipment',    name: 'Manufacturing Equipment',    description: 'CNC machines, presses, injection moulding machines and automated production equipment.' },
    { slug: 'agricultural-equipment',     name: 'Agricultural Equipment',     description: 'Tractors, combine harvesters, irrigation systems and precision agriculture technology.' },
    { slug: 'commercial-vehicles',        name: 'Commercial Vehicles',        description: 'HGVs, LGVs, vans, refrigerated vehicles and specialist commercial transport.' },
    { slug: 'heavy-vehicles',             name: 'Heavy Vehicles',             description: 'Low loaders, tipper trucks, concrete mixers and abnormal load vehicles.' },
    { slug: 'medical-equipment',          name: 'Medical Equipment',          description: 'Imaging systems, diagnostic equipment, surgical and dental equipment.' },
    { slug: 'industrial-equipment',       name: 'Industrial Equipment',       description: 'Air compressors, generators, fork lifts and industrial handling equipment.' },
    { slug: 'technology-it-equipment',    name: 'Technology & IT Equipment',  description: 'Servers, network infrastructure, production technology and broadcast equipment.' },
    { slug: 'renewable-energy-equipment', name: 'Renewable Energy Equipment', description: 'Solar PV, wind turbines, battery storage and heat pump systems.' },
    { slug: 'hospitality-equipment',      name: 'Hospitality Equipment',      description: 'Commercial kitchen, refrigeration, HVAC and food service equipment.' },
    { slug: 'specialist-equipment',       name: 'Specialist Equipment',       description: 'Bespoke, niche and custom machinery requiring specialist finance structures.' },
  ]

  for (const [index, cat] of categories.entries()) {
    await prisma.assetCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: index + 1,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        sortOrder: index + 1,
        isActive: true,
      },
    })
  }

  logger.info(`Seeded ${categories.length} asset categories.`, {}, 'db')
  logger.info('Seed complete. No fake assets, lenders or businesses were created.', {}, 'db')
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
