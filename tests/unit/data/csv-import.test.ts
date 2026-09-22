import { describe, it, expect } from 'vitest'
import { parseCsv } from '@/lib/data/csv-parser'
import { previewCsvImport } from '@/lib/data/csv-import-service'

describe('CSV Parser & Ingestion Engine (RFC 4180)', () => {
  it('parses standard comma-separated values with headers', () => {
    const csv = `name,website,country\nRuthmann,https://www.ruthmann.de,Germany\nScania,https://www.scania.com,Sweden`
    const res = parseCsv(csv)

    expect(res.headers).toEqual(['name', 'website', 'country'])
    expect(res.rows.length).toBe(2)
    expect(res.rows[0].name).toBe('Ruthmann')
    expect(res.rows[1].country).toBe('Sweden')
  })

  it('handles quotes, commas inside quotes, and escaped quotes properly', () => {
    const csv = `title,description\n"Steiger T 650 HF","Aerial platform, 65m working height, ""world class"""\n"Scania P360","8x4 chassis, heavy duty"`
    const res = parseCsv(csv)

    expect(res.rows.length).toBe(2)
    expect(res.rows[0].description).toBe('Aerial platform, 65m working height, "world class"')
  })

  it('generates an import preview flagging missing required fields as INVALID', async () => {
    const csv = `name,website,country\n,https://empty-name.com,UK\nPalfinger,https://www.palfinger.com,Austria`
    const preview = await previewCsvImport('manufacturer', csv)

    expect(preview.recordsDetected).toBe(2)
    expect(preview.invalid).toBe(1)
    expect(preview.previewRecords.find((r) => r.status === 'INVALID')?.reason).toContain('manufacturer name')
  })

  it('flags manufacturers with missing official websites as REQUIRE_REVIEW', async () => {
    const csv = `name,website,country\nBespoke Trailer Builder,,UK`
    const preview = await previewCsvImport('manufacturer', csv)

    expect(preview.requireReview).toBe(1)
    expect(preview.previewRecords[0].status).toBe('REQUIRE_REVIEW')
  })

  it('validates market observations and isolates observation types strictly', async () => {
    const csv = `assetName,observationType,observedValue,source,date
Ruthmann T650HF,SALE_PRICE,350000,AUCTION_RESULT,2026-01-01
Scania 8x4,ASKING_PRICE,180000,DEALER_LISTING,2026-02-01
Invalid Asset,UNKNOWN_TYPE,50000,DEALER_LISTING,2026-02-01
Negative Value,SALE_PRICE,-1000,AUCTION_RESULT,2026-02-01`

    const preview = await previewCsvImport('market_observation', csv)
    expect(preview.recordsDetected).toBe(4)
    expect(preview.ready).toBe(2)
    expect(preview.invalid).toBe(2) // UNKNOWN_TYPE and -1000 are invalid
  })
})
