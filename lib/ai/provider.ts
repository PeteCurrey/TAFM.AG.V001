import type { AIProviderInterface } from '@/types/ai'
import { env } from '@/lib/config/env'

// ─── AI provider factory ──────────────────────────────────────────────────────
//
// Returns the appropriate provider based on configuration.
// Defaults to OpenAI if configured. Future providers can be added here.
// Business logic never calls providers directly — always goes through AIService.

export async function getAIProvider(): Promise<AIProviderInterface | null> {
  if (!env.ai.isConfigured) {
    return null
  }

  // Default provider: OpenAI
  // Future: support multiple providers based on job type, cost, or availability
  const { openAIProvider } = await import('./openai')
  return openAIProvider
}

// ─── AI availability check ────────────────────────────────────────────────────

export function isAIAvailable(): boolean {
  return env.ai.isConfigured
}

export function getAIStatus(): {
  available: boolean
  provider: string | null
  models: typeof env.ai.models | null
} {
  if (!env.ai.isConfigured) {
    return { available: false, provider: null, models: null }
  }
  return {
    available: true,
    provider: 'openai',
    models: env.ai.models,
  }
}
