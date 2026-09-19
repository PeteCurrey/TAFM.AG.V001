import type { Timestamps } from './common'
import { z } from 'zod'

// ─── AI providers ─────────────────────────────────────────────────────────────

export type AIProviderName = 'openai' | 'anthropic' | 'google' | 'local'

export type AIModel =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'o1-preview'
  | 'o1-mini'
  | 'gpt-3.5-turbo'
  | string // Allow future models

// ─── AI provider interface ────────────────────────────────────────────────────

/**
 * Provider-agnostic AI interface.
 * Business logic must never call OpenAI directly — always use this abstraction.
 */
export interface AIProviderInterface {
  name: AIProviderName
  complete(request: AICompletionRequest): Promise<AICompletionResponse>
  structured<T>(request: AIStructuredRequest<T>): Promise<AIStructuredResponse<T>>
  embed?(texts: string[]): Promise<number[][]>
}

// ─── AI requests ──────────────────────────────────────────────────────────────

export interface AICompletionRequest {
  model?: AIModel
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  metadata?: Record<string, string>
}

export interface AIStructuredRequest<T> extends AICompletionRequest {
  schema: z.ZodSchema<T>
  schemaName: string
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ─── AI responses ─────────────────────────────────────────────────────────────

export interface AICompletionResponse {
  content: string
  model: string
  usage: AITokenUsage
  finishReason: 'stop' | 'length' | 'error' | string
}

export interface AIStructuredResponse<T> {
  result: T
  confidence?: number
  warnings?: string[]
  requiresReview: boolean
  source: 'AI'
  model: string
  usage: AITokenUsage
  createdAt: Date
}

export interface AITokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCostGbp?: number
}

// ─── AI jobs (async processing) ───────────────────────────────────────────────

export type AIJobType =
  | 'ASSET_CLASSIFICATION'
  | 'SUPPLIER_QUOTE_EXTRACTION'
  | 'DOCUMENT_EXTRACTION'
  | 'FINANCE_APPLICATION_ASSIST'
  | 'LENDER_MATCHING'
  | 'OFFER_NORMALISATION'
  | 'APPLICATION_COMPLETENESS'
  | 'ASSET_DESCRIPTION_GENERATION'
  | 'SEO_CONTENT_GENERATION'
  | 'INSIGHT_GENERATION'
  | 'CUSTOMER_ASSIST'
  | 'INTERNAL_OPERATIONS'

export type AIJobStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVIEW_REQUIRED'

export interface AIJob extends Timestamps {
  id: string
  type: AIJobType
  status: AIJobStatus
  provider: AIProviderName
  model: AIModel

  // Input/output references (not the full payloads — stored separately)
  inputReference: string
  outputReference?: string

  // Error
  error?: string

  // Timing
  startedAt?: Date
  completedAt?: Date

  // Cost
  costEstimateGbp?: number
  actualUsage?: AITokenUsage

  // Traceability
  initiatedBy?: string
  entityType?: string
  entityId?: string
}

// ─── AI capability schemas ────────────────────────────────────────────────────

/**
 * Base schema for all structured AI outputs.
 * AI is an assistant — never a source of truth for financial or legal decisions.
 */
export const AIOutputBaseSchema = z.object({
  confidence: z.number().min(0).max(1).optional(),
  warnings: z.array(z.string()).optional(),
  requiresReview: z.boolean(),
  source: z.literal('AI'),
  createdAt: z.string().datetime(),
})

export type AIOutputBase = z.infer<typeof AIOutputBaseSchema>

// Asset classification output
export const AssetClassificationSchema = AIOutputBaseSchema.extend({
  suggestedCategory: z.string(),
  suggestedManufacturer: z.string().optional(),
  suggestedModel: z.string().optional(),
  isNew: z.boolean().optional(),
  estimatedYearOfManufacture: z.number().optional(),
  notes: z.string().optional(),
})
export type AssetClassification = z.infer<typeof AssetClassificationSchema>

// Document extraction output
export const DocumentExtractionSchema = AIOutputBaseSchema.extend({
  documentType: z.string(),
  extractedFields: z.record(z.unknown()),
  missingFields: z.array(z.string()).optional(),
})
export type DocumentExtraction = z.infer<typeof DocumentExtractionSchema>

// Application completeness output
export const ApplicationCompletenessSchema = AIOutputBaseSchema.extend({
  completenessScore: z.number().min(0).max(1),
  missingItems: z.array(z.string()),
  suggestions: z.array(z.string()),
})
export type ApplicationCompleteness = z.infer<typeof ApplicationCompletenessSchema>
