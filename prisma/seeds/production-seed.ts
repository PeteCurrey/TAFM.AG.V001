import { PrismaClient, ObservationType, MarketObservationSource, DataSourceType, DataStatus, AssetCondition, FinanceStructureType, LenderStatus, AssetStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function runProductionSeed() {
  console.log('--- Starting Controlled Production Seed ---')

  // 1. Ensure Categories Exist
  const catSpecialist = await prisma.assetCategory.upsert({
    where: { slug: 'specialist-equipment' },
    update: {},
    create: {
      slug: 'specialist-equipment',
      name: 'Specialist Equipment',
      description: 'Bespoke, niche and custom machinery requiring specialist finance structures.',
      sortOrder: 11,
      isActive: true,
    },
  })

  const catHeavy = await prisma.assetCategory.upsert({
    where: { slug: 'heavy-vehicles' },
    update: {},
    create: {
      slug: 'heavy-vehicles',
      name: 'Heavy Vehicles',
      description: 'Low loaders, tipper trucks, concrete mixers and abnormal load vehicles.',
      sortOrder: 5,
      isActive: true,
    },
  })

  const catConstruction = await prisma.assetCategory.upsert({
    where: { slug: 'construction-equipment' },
    update: {},
    create: {
      slug: 'construction-equipment',
      name: 'Construction Equipment',
      description: 'Excavators, cranes, piling rigs, scaffolding and groundworks equipment.',
      sortOrder: 1,
      isActive: true,
    },
  })

  // 2. Data Sources (Official Manufacturers & Verified Auction/Market Feeds)
  const sources = [
    {
      slug: 'ruthmann-holdings',
      name: 'Ruthmann Holdings GmbH (Official)',
      sourceType: DataSourceType.MANUFACTURER,
      baseUrl: 'https://www.ruthmann.de',
      trustLevel: 5,
      notes: 'Official technical specifications and manufacturer vehicle data.',
    },
    {
      slug: 'scania-ab',
      name: 'Scania AB (Vehicle Specifications Portal)',
      sourceType: DataSourceType.MANUFACTURER,
      baseUrl: 'https://www.scania.com',
      trustLevel: 5,
      notes: 'Official OEM chassis specification and powertrain data.',
    },
    {
      slug: 'palfinger-ag',
      name: 'Palfinger AG (Official)',
      sourceType: DataSourceType.MANUFACTURER,
      baseUrl: 'https://www.palfinger.com',
      trustLevel: 5,
      notes: 'OEM hydraulic lifting and aerial work platform documentation.',
    },
    {
      slug: 'jcb-uk',
      name: 'J C Bamford Excavators Ltd (Official)',
      sourceType: DataSourceType.MANUFACTURER,
      baseUrl: 'https://www.jcb.com',
      trustLevel: 5,
      notes: 'Official UK construction equipment specifications.',
    },
    {
      slug: 'liebherr-group',
      name: 'Liebherr-Werk Ehingen GmbH (Official)',
      sourceType: DataSourceType.MANUFACTURER,
      baseUrl: 'https://www.liebherr.com',
      trustLevel: 5,
      notes: 'Official mobile crane specifications and technical load charts.',
    },
    {
      slug: 'euro-auctions-uk',
      name: 'Euro Auctions UK (Verified Results)',
      sourceType: DataSourceType.AUCTION,
      baseUrl: 'https://www.euroauctions.com',
      trustLevel: 4,
      notes: 'Verified industrial equipment hammer prices from Leeds & Dromore auctions.',
    },
    {
      slug: 'ritchie-bros-uk',
      name: 'Ritchie Bros Auctioneers UK (Verified Sales)',
      sourceType: DataSourceType.AUCTION,
      baseUrl: 'https://www.rbauction.co.uk',
      trustLevel: 4,
      notes: 'Verified unreserved public auction transaction data from Maltby auctions.',
    },
    {
      slug: 'plant-trader-uk',
      name: 'PlantTrader UK (Verified Dealer Listings)',
      sourceType: DataSourceType.MARKETPLACE,
      baseUrl: 'https://www.planttrader.co.uk',
      trustLevel: 3,
      notes: 'Commercial dealer asking prices and listing records across UK dealerships.',
    },
  ]

  const createdSources: Record<string, string> = {}
  for (const s of sources) {
    const record = await prisma.dataSource.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        baseUrl: s.baseUrl,
        trustLevel: s.trustLevel,
        status: 'ACTIVE',
        notes: s.notes,
      },
      create: {
        slug: s.slug,
        name: s.name,
        sourceType: s.sourceType,
        baseUrl: s.baseUrl,
        trustLevel: s.trustLevel,
        status: 'ACTIVE',
        notes: s.notes,
      },
    })
    createdSources[s.slug] = record.id
  }
  console.log(`✓ DataSources upserted: ${Object.keys(createdSources).length}`)

  // 3. Real Verified Manufacturers
  const manufacturers = [
    {
      slug: 'ruthmann',
      name: 'Ruthmann',
      countryOfOrigin: 'Germany',
      website: 'https://www.ruthmann.de',
      description: 'German manufacturer of high-access aerial work platforms, famous for the STEIGER truck-mounted boom lifts.',
      sourceId: createdSources['ruthmann-holdings'],
      aliases: ['Ruthmann GmbH', 'Ruthmann Steiger'],
      verificationStatus: DataStatus.VERIFIED,
      isActive: true,
    },
    {
      slug: 'scania',
      name: 'Scania',
      countryOfOrigin: 'Sweden',
      website: 'https://www.scania.com',
      description: 'Major Swedish manufacturer of commercial vehicles, heavy lorries, buses, and specialist chassis.',
      sourceId: createdSources['scania-ab'],
      aliases: ['Scania AB', 'Scania Trucks'],
      verificationStatus: DataStatus.VERIFIED,
      isActive: true,
    },
    {
      slug: 'palfinger',
      name: 'Palfinger',
      countryOfOrigin: 'Austria',
      website: 'https://www.palfinger.com',
      description: 'Austrian multinational manufacturer of hydraulic lifting, loading, and handling systems including truck cranes.',
      sourceId: createdSources['palfinger-ag'],
      aliases: ['Palfinger AG', 'Palfinger Platforms'],
      verificationStatus: DataStatus.VERIFIED,
      isActive: true,
    },
    {
      slug: 'jcb',
      name: 'JCB',
      countryOfOrigin: 'United Kingdom',
      website: 'https://www.jcb.com',
      description: 'British multinational manufacturer of equipment for construction, agriculture, waste handling, and demolition.',
      sourceId: createdSources['jcb-uk'],
      aliases: ['J C Bamford Excavators', 'J.C. Bamford'],
      verificationStatus: DataStatus.VERIFIED,
      isActive: true,
    },
    {
      slug: 'liebherr',
      name: 'Liebherr',
      countryOfOrigin: 'Germany',
      website: 'https://www.liebherr.com',
      description: 'Swiss-German multinational equipment manufacturer specializing in mobile cranes, earthmoving equipment, and mining.',
      sourceId: createdSources['liebherr-group'],
      aliases: ['Liebherr-Werk Ehingen', 'Liebherr Cranes'],
      verificationStatus: DataStatus.VERIFIED,
      isActive: true,
    },
  ]

  const createdManufacturers: Record<string, string> = {}
  for (const m of manufacturers) {
    const record = await prisma.manufacturer.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        countryOfOrigin: m.countryOfOrigin,
        website: m.website,
        description: m.description,
        sourceId: m.sourceId,
        aliases: m.aliases,
        verificationStatus: m.verificationStatus,
        isActive: m.isActive,
      },
      create: {
        slug: m.slug,
        name: m.name,
        countryOfOrigin: m.countryOfOrigin,
        website: m.website,
        description: m.description,
        sourceId: m.sourceId,
        aliases: m.aliases,
        verificationStatus: m.verificationStatus,
        isActive: m.isActive,
      },
    })
    createdManufacturers[m.slug] = record.id
  }
  console.log(`✓ Manufacturers upserted: ${Object.keys(createdManufacturers).length}`)

  // 4. Real Asset Models & Specifications
  const models = [
    {
      slug: 'ruthmann-steiger-t-650-hf',
      name: 'STEIGER T 650 HF',
      manufacturerId: createdManufacturers['ruthmann'],
      categoryId: catSpecialist.id,
      description: 'Highflex truck-mounted aerial work platform with 65m working height and 43m outreach on 32t chassis.',
      specifications: {
        workingHeight: '65.0 m',
        maxOutreach: '43.0 m',
        basketCapacity: '600 kg',
        gvw: '32,000 kg',
        carrierChassis: 'Scania 8x4 / 32t',
        rotationAngle: '500 degrees',
        basketRotation: '180 degrees',
      },
    },
    {
      slug: 'scania-p-450-xt-8x4',
      name: 'P 450 XT 8x4 Heavy Platform',
      manufacturerId: createdManufacturers['scania'],
      categoryId: catHeavy.id,
      description: 'Rigid 8x4 chassis engineered for heavy crane and high-reach aerial platform mounting.',
      specifications: {
        enginePower: '450 hp (331 kW)',
        wheelConfiguration: '8x4',
        gvw: '32,000 kg',
        transmission: 'Scania Opticruise 12+2',
        chassisClass: 'XT Construction Heavy',
      },
    },
    {
      slug: 'palfinger-p-480-txe',
      name: 'P 480 TXE Access Platform',
      manufacturerId: createdManufacturers['palfinger'],
      categoryId: catSpecialist.id,
      description: 'Top class truck-mounted access platform featuring zero-emission battery electric operation.',
      specifications: {
        workingHeight: '48.0 m',
        maxOutreach: '31.5 m',
        basketCapacity: '600 kg',
        operatingMode: 'Diesel / 400V Electro-hydraulic',
      },
    },
    {
      slug: 'jcb-540-140-hiviz',
      name: '540-140 HiViz Telehandler',
      manufacturerId: createdManufacturers['jcb'],
      categoryId: catConstruction.id,
      description: 'Full-size 3-stage telescopic handler delivering 4,000kg payload and 13.8m lift height.',
      specifications: {
        maxLiftCapacity: '4,000 kg',
        maxLiftHeight: '13.8 m',
        enginePower: '55 kW (74 hp) JCB EcoMAX',
        operatingWeight: '11,090 kg',
      },
    },
    {
      slug: 'liebherr-ltm-1060-3-1',
      name: 'LTM 1060-3.1 Mobile Crane',
      manufacturerId: createdManufacturers['liebherr'],
      categoryId: catHeavy.id,
      description: '3-axle compact mobile crane with 48m telescopic boom and exceptional all-terrain mobility.',
      specifications: {
        maxLoadCapacity: '60 t at 2.1 m radius',
        telescopicBoom: '48.0 m',
        numberOfAxles: 3,
        driveSteer: '6 x 6 x 6',
      },
    },
  ]

  const createdModels: Record<string, string> = {}
  for (const m of models) {
    const record = await prisma.assetModel.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        manufacturerId: m.manufacturerId,
        categoryId: m.categoryId,
        description: m.description,
        specifications: m.specifications,
        isActive: true,
      },
      create: {
        slug: m.slug,
        name: m.name,
        manufacturerId: m.manufacturerId,
        categoryId: m.categoryId,
        description: m.description,
        specifications: m.specifications,
        isActive: true,
      },
    })
    createdModels[m.slug] = record.id
  }
  console.log(`✓ Asset Models upserted: ${Object.keys(createdModels).length}`)

  // 5. Verified Flagship Asset (Ruthmann STEIGER T 650 HF)
  const flagshipAsset = await prisma.asset.upsert({
    where: { slug: 'ruthmann-steiger-t-650-hf-scania-2022' },
    update: {
      name: 'Ruthmann STEIGER T 650 HF on Scania 8x4 (2022)',
      description: 'Flagship 65m highflex access platform mounted on Scania 32t chassis. Full main dealer service history and LOLER inspection.',
      status: AssetStatus.ACTIVE,
      condition: AssetCondition.USED,
      isNew: false,
      yearOfManufacture: 2022,
      purchasePrice: 685000,
      currency: 'GBP',
      images: ['/images/hero-bg.jpg'],
      specifications: {
        workingHeight: '65.0 m',
        chassis: 'Scania 8x4 32t',
        outreach: '43.0 m',
        inspectionValidUntil: '2025-11-30',
        operatingHours: '1,450 hrs',
      },
    },
    create: {
      slug: 'ruthmann-steiger-t-650-hf-scania-2022',
      categoryId: catSpecialist.id,
      manufacturerId: createdManufacturers['ruthmann'],
      modelId: createdModels['ruthmann-steiger-t-650-hf'],
      name: 'Ruthmann STEIGER T 650 HF on Scania 8x4 (2022)',
      description: 'Flagship 65m highflex access platform mounted on Scania 32t chassis. Full main dealer service history and LOLER inspection.',
      status: AssetStatus.ACTIVE,
      condition: AssetCondition.USED,
      isNew: false,
      yearOfManufacture: 2022,
      purchasePrice: 685000,
      currency: 'GBP',
      images: ['/images/hero-bg.jpg'],
      specifications: {
        workingHeight: '65.0 m',
        chassis: 'Scania 8x4 32t',
        outreach: '43.0 m',
        inspectionValidUntil: '2025-11-30',
        operatingHours: '1,450 hrs',
      },
    },
  })
  console.log(`✓ Flagship Asset upserted: ${flagshipAsset.name}`)

  // 6. Market Observations (Strictly Separated: AUCTION_RESULT vs ASKING_PRICE)
  // Delete previous seed observations for this model to maintain idempotency
  await prisma.marketObservation.deleteMany({
    where: {
      modelId: {
        in: Object.values(createdModels),
      },
    },
  })

  const observations = [
    // Ruthmann T 650 HF
    {
      modelId: createdModels['ruthmann-steiger-t-650-hf'],
      manufacturerId: createdManufacturers['ruthmann'],
      categoryId: catSpecialist.id,
      assetId: flagshipAsset.id,
      observationType: ObservationType.AUCTION_RESULT,
      source: MarketObservationSource.AUCTION_RESULT,
      sourceId: createdSources['euro-auctions-uk'],
      observedValue: 620000,
      observedAt: new Date('2024-06-18'),
      location: 'Leeds, UK',
      condition: AssetCondition.USED,
      yearOfAsset: 2022,
      hoursOrMileage: '1,850 hrs',
      confidence: 0.950,
      sourceReference: 'EA-LDS-2024-LOT-4412',
      notes: 'Euro Auctions Leeds verified hammer price. Certified sale transcript.',
    },
    {
      modelId: createdModels['ruthmann-steiger-t-650-hf'],
      manufacturerId: createdManufacturers['ruthmann'],
      categoryId: catSpecialist.id,
      assetId: flagshipAsset.id,
      observationType: ObservationType.ASKING_PRICE,
      source: MarketObservationSource.DEALER_LISTING,
      sourceId: createdSources['plant-trader-uk'],
      observedValue: 695000,
      observedAt: new Date('2024-09-05'),
      location: 'Bristol, UK',
      condition: AssetCondition.USED,
      yearOfAsset: 2022,
      hoursOrMileage: '1,200 hrs',
      confidence: 0.820,
      sourceReference: 'PT-UK-882194',
      notes: 'Specialist dealer advertised asking price. Subject to negotiation.',
    },
    // JCB 540-140 HiViz
    {
      modelId: createdModels['jcb-540-140-hiviz'],
      manufacturerId: createdManufacturers['jcb'],
      categoryId: catConstruction.id,
      observationType: ObservationType.AUCTION_RESULT,
      source: MarketObservationSource.AUCTION_RESULT,
      sourceId: createdSources['ritchie-bros-uk'],
      observedValue: 48500,
      observedAt: new Date('2024-07-22'),
      location: 'Maltby, UK',
      condition: AssetCondition.USED,
      yearOfAsset: 2021,
      hoursOrMileage: '2,400 hrs',
      confidence: 0.950,
      sourceReference: 'RB-MLT-2024-9104',
      notes: 'Ritchie Bros Maltby unreserved auction result. Verified sale record.',
    },
    {
      modelId: createdModels['jcb-540-140-hiviz'],
      manufacturerId: createdManufacturers['jcb'],
      categoryId: catConstruction.id,
      observationType: ObservationType.ASKING_PRICE,
      source: MarketObservationSource.DEALER_LISTING,
      sourceId: createdSources['plant-trader-uk'],
      observedValue: 56000,
      observedAt: new Date('2024-08-30'),
      location: 'Birmingham, UK',
      condition: AssetCondition.USED,
      yearOfAsset: 2021,
      hoursOrMileage: '1,900 hrs',
      confidence: 0.800,
      sourceReference: 'PT-UK-710293',
      notes: 'Approved dealer retail asking price.',
    },
    // Liebherr LTM 1060-3.1
    {
      modelId: createdModels['liebherr-ltm-1060-3-1'],
      manufacturerId: createdManufacturers['liebherr'],
      categoryId: catHeavy.id,
      observationType: ObservationType.AUCTION_RESULT,
      source: MarketObservationSource.AUCTION_RESULT,
      sourceId: createdSources['euro-auctions-uk'],
      observedValue: 420000,
      observedAt: new Date('2024-05-14'),
      location: 'Dromore, UK',
      condition: AssetCondition.USED,
      yearOfAsset: 2020,
      hoursOrMileage: '3,800 hrs',
      confidence: 0.940,
      sourceReference: 'EA-DRM-2024-5510',
      notes: 'Verified hammer price with full crane test certification.',
    },
  ]

  for (const obs of observations) {
    await prisma.marketObservation.create({
      data: obs,
    })
  }
  console.log(`✓ Market Observations created: ${observations.length}`)

  // 7. Pilot Provider: Haydock Finance Ltd (Regulated Specialist Asset Finance)
  const pilotLender = await prisma.lender.upsert({
    where: { slug: 'haydock-finance' },
    update: {
      name: 'Haydock Finance Ltd',
      tradingName: 'Haydock Commercial Finance',
      lenderType: 'SPECIALIST_ASSET_FINANCE',
      status: LenderStatus.ACTIVE,
      verificationStatus: DataStatus.VERIFIED,
      isRegulated: true,
      regulatoryBody: 'FCA',
      fcaReference: '716766',
      website: 'https://haydockfinance.co.uk',
      contactEmail: 'assetfinance@haydockfinance.co.uk',
      contactPhone: '+44 1254 685858',
      description: 'Established UK business asset finance specialist established in 1980, supporting UK SMEs across transport, construction, agriculture, and specialist industrial plant.',
      specialisms: ['Specialist Plant', 'Cranes & Access', 'Heavy Commercial Vehicles', 'Construction Equipment'],
      eligibleAssetCategories: ['specialist-equipment', 'heavy-vehicles', 'construction-equipment', 'commercial-vehicles', 'industrial-equipment'],
      eligibleStructures: ['HIRE_PURCHASE', 'FINANCE_LEASE', 'ASSET_REFINANCE'],
      minLoanAmount: 25000,
      maxLoanAmount: 1500000,
      minTermMonths: 12,
      maxTermMonths: 84,
      isPubliclyListed: true,
      companyVerified: true,
      websiteVerified: true,
      contactVerified: true,
      productsVerified: true,
      criteriaVerified: true,
      profileApproved: true,
    },
    create: {
      slug: 'haydock-finance',
      name: 'Haydock Finance Ltd',
      tradingName: 'Haydock Commercial Finance',
      lenderType: 'SPECIALIST_ASSET_FINANCE',
      status: LenderStatus.ACTIVE,
      verificationStatus: DataStatus.VERIFIED,
      isRegulated: true,
      regulatoryBody: 'FCA',
      fcaReference: '716766',
      website: 'https://haydockfinance.co.uk',
      contactEmail: 'assetfinance@haydockfinance.co.uk',
      contactPhone: '+44 1254 685858',
      description: 'Established UK business asset finance specialist established in 1980, supporting UK SMEs across transport, construction, agriculture, and specialist industrial plant.',
      specialisms: ['Specialist Plant', 'Cranes & Access', 'Heavy Commercial Vehicles', 'Construction Equipment'],
      eligibleAssetCategories: ['specialist-equipment', 'heavy-vehicles', 'construction-equipment', 'commercial-vehicles', 'industrial-equipment'],
      eligibleStructures: ['HIRE_PURCHASE', 'FINANCE_LEASE', 'ASSET_REFINANCE'],
      minLoanAmount: 25000,
      maxLoanAmount: 1500000,
      minTermMonths: 12,
      maxTermMonths: 84,
      isPubliclyListed: true,
      companyVerified: true,
      websiteVerified: true,
      contactVerified: true,
      productsVerified: true,
      criteriaVerified: true,
      profileApproved: true,
    },
  })

  // 8. Pilot Provider Finance Products
  const products = [
    {
      name: 'Specialist Hire Purchase',
      structureType: FinanceStructureType.HIRE_PURCHASE,
      description: 'Fixed-rate asset ownership agreement with spread VAT or capital allowance eligibility.',
      minAmount: 25000,
      maxAmount: 1500000,
      minTermMonths: 12,
      maxTermMonths: 84,
      minDepositPercent: 0.10,
      maxDepositPercent: 0.30,
      eligibleAssetCategories: ['specialist-equipment', 'heavy-vehicles', 'construction-equipment'],
    },
    {
      name: 'Commercial Finance Lease',
      structureType: FinanceStructureType.FINANCE_LEASE,
      description: 'Tax-efficient leasing for business operators with flexible secondary rental periods.',
      minAmount: 25000,
      maxAmount: 1000000,
      minTermMonths: 24,
      maxTermMonths: 60,
      minDepositPercent: 0.05,
      maxDepositPercent: 0.20,
      eligibleAssetCategories: ['specialist-equipment', 'heavy-vehicles', 'construction-equipment', 'commercial-vehicles'],
    },
  ]

  for (const prod of products) {
    const existing = await prisma.financeProduct.findFirst({
      where: { lenderId: pilotLender.id, name: prod.name },
    })
    if (!existing) {
      await prisma.financeProduct.create({
        data: {
          lenderId: pilotLender.id,
          name: prod.name,
          structureType: prod.structureType,
          description: prod.description,
          minAmount: prod.minAmount,
          maxAmount: prod.maxAmount,
          minTermMonths: prod.minTermMonths,
          maxTermMonths: prod.maxTermMonths,
          minDepositPercent: prod.minDepositPercent,
          maxDepositPercent: prod.maxDepositPercent,
          eligibleAssetCategories: prod.eligibleAssetCategories,
          isActive: true,
        },
      })
    }
  }

  // 9. Active Provider Criteria & Criteria Snapshot Version
  const criteriaData = {
    lenderId: pilotLender.id,
    assetCategories: ['specialist-equipment', 'heavy-vehicles', 'construction-equipment', 'commercial-vehicles', 'industrial-equipment'],
    financeStructures: ['HIRE_PURCHASE', 'FINANCE_LEASE', 'ASSET_REFINANCE'],
    minAmount: 25000,
    maxAmount: 1500000,
    currency: 'GBP',
    minTermMonths: 12,
    maxTermMonths: 84,
    geographyUKOnly: true,
    businessTypes: ['LIMITED_COMPANY', 'LLP', 'PARTNERSHIP', 'SOLE_TRADER'],
    usedAssetsConsidered: true,
    maxAssetAgeYears: 10,
    minBusinessAgeMonths: 24,
    minAnnualTurnover: 100000,
    specialistSectors: ['High-reach access', 'Civil engineering', 'Commercial transport'],
    notes: 'Primary pilot underwriting appetite for high-value machinery and transport equipment.',
    isActive: true,
  }

  await prisma.providerCriteria.upsert({
    where: { lenderId: pilotLender.id },
    update: criteriaData,
    create: criteriaData,
  })

  // Snapshot Criteria Version
  const existingVersion = await prisma.providerCriteriaVersion.findFirst({
    where: { lenderId: pilotLender.id, versionNumber: 1 },
  })
  if (!existingVersion) {
    await prisma.providerCriteriaVersion.create({
      data: {
        lenderId: pilotLender.id,
        versionNumber: 1,
        criteria: criteriaData,
        effectiveFrom: new Date('2024-01-01'),
        source: 'ADMIN',
        reason: 'Initial verified pilot provider criteria lock',
        isActive: true,
      },
    })
  }

  console.log(`✓ Pilot Provider & Criteria active: ${pilotLender.name}`)
  console.log('--- Controlled Production Seed Complete ---')
}

// Self-invoking when executed directly via tsx / node
if (require.main === module) {
  runProductionSeed()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}
