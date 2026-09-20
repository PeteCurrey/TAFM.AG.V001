import { z } from 'zod'

// ─── AI structured output schemas ─────────────────────────────────────────────
//
// All AI operations must return validated, structured outputs.
// These schemas are used with OpenAI's structured output / function calling.
// Never trust raw AI text — always validate through Zod.

// ─── Asset classification ─────────────────────────────────────────────────────

export const assetClassificationSchema = z.object({
  category: z.string().describe('The primary asset category slug (e.g. construction-equipment)'),
  categoryConfidence: z.number().min(0).max(1).describe('Confidence in category classification (0-1)'),
  subCategory: z.string().optional().describe('Sub-category if applicable'),
  assetType: z.string().describe('Specific type of asset (e.g. excavator, CNC lathe)'),
  isNewAsset: z.boolean().describe('Whether this appears to be a new (unused) asset'),
  estimatedCondition: z.enum(['NEW', 'USED', 'REFURBISHED', 'FOR_PARTS', 'UNKNOWN']),
  notes: z.string().optional().describe('Any relevant observations about the classification'),
})

export type AssetClassificationOutput = z.infer<typeof assetClassificationSchema>

// ─── Asset description ────────────────────────────────────────────────────────

export const assetDescriptionSchema = z.object({
  headline: z.string().max(120).describe('Concise asset headline for listings'),
  description: z.string().max(1000).describe('Professional asset description'),
  keyFeatures: z.array(z.string()).max(8).describe('Key features or specification highlights'),
  seoTitle: z.string().max(70).describe('SEO-optimised page title'),
  seoDescription: z.string().max(160).describe('SEO meta description'),
  confidence: z.number().min(0).max(1),
  requiresHumanReview: z.literal(true).describe('AI descriptions always require human review'),
})

export type AssetDescriptionOutput = z.infer<typeof assetDescriptionSchema>

// ─── Asset spec extraction ────────────────────────────────────────────────────

export const assetSpecExtractionSchema = z.object({
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  variant: z.string().optional(),
  yearOfManufacture: z.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),
  serialNumber: z.string().optional(),
  specifications: z.record(z.string()).describe('Key-value specification pairs'),
  missingInformation: z.array(z.string()).describe('Fields that could not be determined'),
  confidence: z.number().min(0).max(1),
  dataSource: z.enum(['PROVIDED', 'INFERRED', 'UNKNOWN']).describe('How this data was obtained'),
})

export type AssetSpecExtractionOutput = z.infer<typeof assetSpecExtractionSchema>

// ─── Finance routing ──────────────────────────────────────────────────────────

export const financeRoutingSchema = z.object({
  recommendedStructures: z.array(
    z.object({
      structureType: z.enum(['HIRE_PURCHASE', 'FINANCE_LEASE', 'OPERATING_LEASE', 'ASSET_REFINANCE', 'COMMERCIAL_LOAN', 'SPECIALIST']),
      rationale: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ).max(3).describe('Top 1-3 recommended finance structures with rationale'),
  considerations: z.array(z.string()).describe('Important factors that affect finance suitability'),
  requiresSpecialistInput: z.boolean(),
  confidence: z.number().min(0).max(1),
  disclaimer: z.literal('This is an AI-generated indicative routing only. It does not constitute financial advice. Finance suitability must be assessed by a qualified finance provider.'),
})

export type FinanceRoutingOutput = z.infer<typeof financeRoutingSchema>

// ─── Value analysis ───────────────────────────────────────────────────────────

export const valueAnalysisSchema = z.object({
  valueStatus: z.enum(['SUFFICIENT_DATA', 'INSUFFICIENT_DATA', 'CANNOT_ASSESS']),
  indicativeRangeLow: z.number().optional().describe('Lower bound of indicative value range (GBP)'),
  indicativeRangeHigh: z.number().optional().describe('Upper bound of indicative value range (GBP)'),
  confidence: z.number().min(0).max(1),
  dataPoints: z.array(z.string()).describe('Sources or factors considered'),
  limitations: z.array(z.string()).describe('Limitations of this analysis'),
  requiresVerification: z.literal(true).describe('All AI value analysis requires professional verification'),
  disclaimer: z.string().describe('Mandatory disclaimer about indicative nature'),
})

export type ValueAnalysisOutput = z.infer<typeof valueAnalysisSchema>

// ─── Asset intelligence summary ───────────────────────────────────────────────
//
// Full structured intelligence output for an asset.
// Distinguishes CONFIRMED (from provided data) from INFERRED (by AI) from MISSING.

export const assetIntelligenceSummarySchema = z.object({
  confirmedInformation: z.array(z.object({
    field:       z.string(),
    value:       z.string(),
    source:      z.enum(['PROVIDED', 'DOCUMENT', 'IMAGE']),
  })).describe('Fields confirmed from provided input'),

  inferredInformation: z.array(z.object({
    field:       z.string(),
    value:       z.string(),
    confidence:  z.number().min(0).max(1),
    reasoning:   z.string(),
  })).describe('Fields inferred by AI — NOT confirmed'),

  missingInformation: z.array(z.object({
    field:       z.string(),
    importance:  z.enum(['CRITICAL', 'IMPORTANT', 'OPTIONAL']),
    reason:      z.string(),
  })).describe('Fields that could not be determined'),

  verificationRequired: z.array(z.string())
    .describe('Fields that require human or document verification before use'),

  overallConfidence:  z.number().min(0).max(1),
  // Uses DB DataStatus enum values: VERIFIED | PROVISIONAL | CALCULATED | USER_PROVIDED | UNKNOWN
  dataStatus:         z.enum(['VERIFIED', 'PROVISIONAL', 'CALCULATED', 'USER_PROVIDED', 'UNKNOWN']),
  cannotIdentify:     z.boolean(),
  cannotIdentifyReason: z.string().optional(),
  disclaimer:         z.string().describe('Mandatory: this output is AI-generated and requires review'),
})

export type AssetIntelligenceSummaryOutput = z.infer<typeof assetIntelligenceSummarySchema>

// ─── Image analysis result ────────────────────────────────────────────────────
//
// Result of AI analysis of an asset image.
// cannotIdentify: true is a VALID and expected outcome — never manufacture an ID.

export const imageAnalysisSchema = z.object({
  identified:           z.boolean(),
  cannotIdentify:       z.boolean(),
  cannotIdentifyReason: z.string().optional()
    .describe('Required when cannotIdentify is true'),

  assetCategory:    z.string().optional().describe('Broad category if identifiable'),
  manufacturer:     z.string().optional().describe('Manufacturer name if readable'),
  modelFamily:      z.string().optional().describe('Model family or series if identifiable'),
  specificModel:    z.string().optional().describe('Exact model only if clearly identifiable from image'),

  visibleFeatures: z.array(z.string())
    .describe('Observable physical features — state only what is visible'),

  conditionIndicators: z.array(z.object({
    indicator: z.string(),
    observed:  z.string(),
  })).describe('Observable condition evidence — do not speculate'),

  confidence:       z.number().min(0).max(1),
  imageQuality:     z.enum(['GOOD', 'ADEQUATE', 'POOR', 'UNUSABLE']),
  disclaimer:       z.literal('Image analysis is indicative only. Manufacturer and model identification requires verification from documentation or physical inspection.'),
})

export type ImageAnalysisOutput = z.infer<typeof imageAnalysisSchema>

// ─── Document extraction result ───────────────────────────────────────────────
//
// Result of AI extraction from an uploaded document.
// All extracted fields carry individual confidence scores.
// Never treat extracted data as verified — documents may be altered.

export const documentExtractionSchema = z.object({
  documentType: z.enum([
    'INVOICE',
    'SPECIFICATION_SHEET',
    'ASSET_SCHEDULE',
    'REGISTRATION_DOCUMENT',
    'VALUATION_REPORT',
    'PURCHASE_AGREEMENT',
    'UNKNOWN',
  ]),

  extractedFields: z.array(z.object({
    field:       z.string(),
    value:       z.string(),
    confidence:  z.number().min(0).max(1),
    rawText:     z.string().optional().describe('The literal text from the document'),
  })),

  missingFields:   z.array(z.string()).describe('Expected fields not found in document'),

  overallConfidence: z.number().min(0).max(1),
  extractionQuality: z.enum(['HIGH', 'MEDIUM', 'LOW', 'FAILED']),
  notes:           z.string().optional(),

  disclaimer: z.literal('Document extraction is AI-assisted. Extracted values require verification against original documents. Documents are not authenticated by this process.'),
})

export type DocumentExtractionOutput = z.infer<typeof documentExtractionSchema>
