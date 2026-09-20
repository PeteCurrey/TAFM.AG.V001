import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  assetClassificationSchema,
  assetSpecExtractionSchema,
  assetIntelligenceSummarySchema,
  imageAnalysisSchema,
  documentExtractionSchema,
} from '@/lib/ai/schemas'

// ─── AI schema validation tests ───────────────────────────────────────────────
//
// Validates that malformed AI outputs are rejected by the Zod schemas.
// These schemas are the last line of defence against AI hallucinations
// entering the system as structured data.

describe('assetClassificationSchema', () => {
  it('accepts a valid classification', () => {
    const result = assetClassificationSchema.safeParse({
      category:           'construction-equipment',
      categoryConfidence: 0.92,
      assetType:          'Excavator',
      isNewAsset:         false,
      estimatedCondition: 'USED',
    })
    expect(result.success).toBe(true)
  })

  it('rejects confidence outside 0-1 range', () => {
    const result = assetClassificationSchema.safeParse({
      category:           'construction-equipment',
      categoryConfidence: 1.5,
      assetType:          'Excavator',
      isNewAsset:         false,
      estimatedCondition: 'USED',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid estimatedCondition value', () => {
    const result = assetClassificationSchema.safeParse({
      category:           'construction-equipment',
      categoryConfidence: 0.8,
      assetType:          'Excavator',
      isNewAsset:         false,
      estimatedCondition: 'PERFECT', // Not a valid enum
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const result = assetClassificationSchema.safeParse({
      category:           'construction-equipment',
      categoryConfidence: 0.8,
      // assetType missing
      isNewAsset:         false,
      estimatedCondition: 'USED',
    })
    expect(result.success).toBe(false)
  })
})

describe('imageAnalysisSchema', () => {
  it('accepts a valid cannotIdentify result', () => {
    const result = imageAnalysisSchema.safeParse({
      identified:           false,
      cannotIdentify:       true,
      cannotIdentifyReason: 'Image is too blurry to identify the asset type',
      visibleFeatures:      [],
      conditionIndicators:  [],
      confidence:           0.0,
      imageQuality:         'POOR',
      disclaimer:           'Image analysis is indicative only. Manufacturer and model identification requires verification from documentation or physical inspection.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid identification result', () => {
    const result = imageAnalysisSchema.safeParse({
      identified:           true,
      cannotIdentify:       false,
      assetCategory:        'construction-equipment',
      manufacturer:         'Caterpillar',
      modelFamily:          '320 series',
      visibleFeatures:      ['yellow paint', 'hydraulic arm', 'tracked undercarriage'],
      conditionIndicators:  [{ indicator: 'body_condition', observed: 'minor surface wear' }],
      confidence:           0.78,
      imageQuality:         'GOOD',
      disclaimer:           'Image analysis is indicative only. Manufacturer and model identification requires verification from documentation or physical inspection.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects wrong disclaimer literal', () => {
    const result = imageAnalysisSchema.safeParse({
      identified:          true,
      cannotIdentify:      false,
      visibleFeatures:     [],
      conditionIndicators: [],
      confidence:          0.8,
      imageQuality:        'GOOD',
      disclaimer:          'This is accurate and verified.', // Wrong literal
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid imageQuality value', () => {
    const result = imageAnalysisSchema.safeParse({
      identified:          true,
      cannotIdentify:      false,
      visibleFeatures:     [],
      conditionIndicators: [],
      confidence:          0.8,
      imageQuality:        'EXCELLENT', // Not in enum
      disclaimer:          'Image analysis is indicative only. Manufacturer and model identification requires verification from documentation or physical inspection.',
    })
    expect(result.success).toBe(false)
  })
})

describe('documentExtractionSchema', () => {
  it('accepts a valid extraction result', () => {
    const result = documentExtractionSchema.safeParse({
      documentType: 'INVOICE',
      extractedFields: [
        { field: 'total_amount', value: '£125,000', confidence: 0.95 },
        { field: 'supplier',     value: 'Acme Plant Ltd', confidence: 0.88 },
      ],
      missingFields:    ['serial_number'],
      overallConfidence: 0.91,
      extractionQuality: 'HIGH',
      disclaimer:       'Document extraction is AI-assisted. Extracted values require verification against original documents. Documents are not authenticated by this process.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid documentType', () => {
    const result = documentExtractionSchema.safeParse({
      documentType:     'BANK_STATEMENT', // Not in enum
      extractedFields:  [],
      missingFields:    [],
      overallConfidence: 0.5,
      extractionQuality: 'MEDIUM',
      disclaimer:       'Document extraction is AI-assisted. Extracted values require verification against original documents. Documents are not authenticated by this process.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects wrong disclaimer literal', () => {
    const result = documentExtractionSchema.safeParse({
      documentType:     'INVOICE',
      extractedFields:  [],
      missingFields:    [],
      overallConfidence: 0.5,
      extractionQuality: 'MEDIUM',
      disclaimer:       'All data is accurate.', // Wrong
    })
    expect(result.success).toBe(false)
  })
})

describe('assetIntelligenceSummarySchema', () => {
  it('accepts a valid intelligence summary', () => {
    const result = assetIntelligenceSummarySchema.safeParse({
      confirmedInformation: [{ field: 'category', value: 'excavator', source: 'PROVIDED' }],
      inferredInformation:  [{ field: 'manufacturer', value: 'Caterpillar', confidence: 0.7, reasoning: 'Yellow paint and logo visible' }],
      missingInformation:   [{ field: 'serial_number', importance: 'IMPORTANT', reason: 'Not provided in description' }],
      verificationRequired: ['manufacturer'],
      overallConfidence:    0.72,
      dataStatus:           'CALCULATED',
      cannotIdentify:       false,
      disclaimer:           'This is an AI-generated analysis and requires human review.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a cannotIdentify result', () => {
    const result = assetIntelligenceSummarySchema.safeParse({
      confirmedInformation: [],
      inferredInformation:  [],
      missingInformation:   [{ field: 'everything', importance: 'CRITICAL', reason: 'Insufficient input to identify asset' }],
      verificationRequired: [],
      overallConfidence:    0.0,
      dataStatus:           'UNKNOWN',
      cannotIdentify:       true,
      cannotIdentifyReason: 'Description too vague to classify',
      disclaimer:           'This is an AI-generated analysis and requires human review.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid dataStatus', () => {
    const result = assetIntelligenceSummarySchema.safeParse({
      confirmedInformation: [],
      inferredInformation:  [],
      missingInformation:   [],
      verificationRequired: [],
      overallConfidence:    0.5,
      dataStatus:           'GUESSED', // Not in enum
      cannotIdentify:       false,
      disclaimer:           'test',
    })
    expect(result.success).toBe(false)
  })
})

describe('assetSpecExtractionSchema', () => {
  it('rejects year outside valid range', () => {
    const result = assetSpecExtractionSchema.safeParse({
      specifications:     { weight: '20t' },
      missingInformation: [],
      confidence:         0.7,
      dataSource:         'PROVIDED',
      yearOfManufacture:  1850, // Too old
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid dataSource', () => {
    const result = assetSpecExtractionSchema.safeParse({
      specifications:     {},
      missingInformation: [],
      confidence:         0.5,
      dataSource:         'FABRICATED', // Not in enum
    })
    expect(result.success).toBe(false)
  })
})
