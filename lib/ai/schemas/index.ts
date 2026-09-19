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
