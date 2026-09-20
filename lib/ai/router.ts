import { env } from '@/lib/config/env'

// ─── Model routing layer ───────────────────────────────────────────────────────
//
// Selects the appropriate AI model based on the task type.
// All model selection logic lives HERE — never hardcoded in callers.
//
// Task categories:
//   IMAGE_ANALYSIS       → needs vision capability → primary (gpt-4o)
//   DOCUMENT_EXTRACTION  → needs long context + structured extraction → primary
//   TEXT_CLASSIFICATION  → fast, high-volume → fast model
//   SPEC_EXTRACTION      → moderate complexity → fast model
//   COMPLEX_ANALYSIS     → needs reasoning → reasoning model
//   FINANCE_ROUTING      → regulatory sensitivity → primary
//   CONTENT_GENERATION   → volume content → fast model
//   DEFAULT              → primary model

export type AITask =
  | 'IMAGE_ANALYSIS'
  | 'DOCUMENT_EXTRACTION'
  | 'TEXT_CLASSIFICATION'
  | 'SPEC_EXTRACTION'
  | 'COMPLEX_ANALYSIS'
  | 'FINANCE_ROUTING'
  | 'CONTENT_GENERATION'
  | 'DEFAULT'

export interface ModelConfig {
  model: string
  provider: 'openai'
  temperature?: number
  maxTokens?: number
  supportsVision: boolean
  supportsStructuredOutput: boolean
  notes: string
}

const MODEL_ROUTING: Record<AITask, ModelConfig> = {
  IMAGE_ANALYSIS: {
    model: env.ai.models.primary,       // gpt-4o — has vision
    provider: 'openai',
    temperature: 0.1,
    maxTokens: 1024,
    supportsVision: true,
    supportsStructuredOutput: true,
    notes: 'Vision-capable model required for image analysis',
  },
  DOCUMENT_EXTRACTION: {
    model: env.ai.models.primary,       // gpt-4o — long context + structured
    provider: 'openai',
    temperature: 0.0,
    maxTokens: 2048,
    supportsVision: false,
    supportsStructuredOutput: true,
    notes: 'Structured extraction from document text',
  },
  TEXT_CLASSIFICATION: {
    model: env.ai.models.fast,          // gpt-4o-mini — efficient
    provider: 'openai',
    temperature: 0.1,
    maxTokens: 512,
    supportsVision: false,
    supportsStructuredOutput: true,
    notes: 'Fast classification — cost-efficient at volume',
  },
  SPEC_EXTRACTION: {
    model: env.ai.models.fast,          // gpt-4o-mini
    provider: 'openai',
    temperature: 0.0,
    maxTokens: 1024,
    supportsVision: false,
    supportsStructuredOutput: true,
    notes: 'Specification extraction from text input',
  },
  COMPLEX_ANALYSIS: {
    model: env.ai.models.primary,       // gpt-4o — reasoning
    provider: 'openai',
    temperature: 0.2,
    maxTokens: 4096,
    supportsVision: false,
    supportsStructuredOutput: true,
    notes: 'Complex reasoning tasks — use sparingly due to cost',
  },
  FINANCE_ROUTING: {
    model: env.ai.models.primary,       // gpt-4o — financial sensitivity
    provider: 'openai',
    temperature: 0.1,
    maxTokens: 1024,
    supportsVision: false,
    supportsStructuredOutput: true,
    notes: 'Finance-related — use primary model for reliability',
  },
  CONTENT_GENERATION: {
    model: env.ai.models.fast,          // gpt-4o-mini — volume content
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 2048,
    supportsVision: false,
    supportsStructuredOutput: false,
    notes: 'Content generation — human review mandatory before publish',
  },
  DEFAULT: {
    model: env.ai.models.primary,
    provider: 'openai',
    temperature: 0.2,
    maxTokens: 1024,
    supportsVision: false,
    supportsStructuredOutput: true,
    notes: 'Default routing — use primary model',
  },
}

/**
 * Select the appropriate model configuration for a given task type.
 * Always use this rather than hardcoding models in route handlers or services.
 */
export function selectModel(task: AITask): ModelConfig {
  return MODEL_ROUTING[task] ?? MODEL_ROUTING.DEFAULT
}

/**
 * Get a summary of all routing configuration.
 * Used in admin/debug endpoints — never exposed publicly.
 */
export function getRoutingTable(): Record<AITask, ModelConfig> {
  return MODEL_ROUTING
}
