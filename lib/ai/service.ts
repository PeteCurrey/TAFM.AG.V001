import type {
  AICompletionRequest,
  AIStructuredRequest,
  AIStructuredResponse,
  AICompletionResponse,
} from '@/types/ai'
import { getAIProvider } from './provider'
import { logger } from '@/lib/logging'

// ─── AI Service ───────────────────────────────────────────────────────────────
//
// Central service layer for all AI operations.
// Handles:
//   - Provider selection
//   - Error handling and retry logic
//   - Usage logging
//   - Graceful degradation when AI is unavailable
//
// IMPORTANT: AI is an assistant, never a source of truth for:
//   - Finance rates or approvals
//   - Legal conclusions
//   - Customer identity
//   - Application status

const MAX_RETRIES = 2

async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000 // Exponential backoff
        logger.warn(`AI operation failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          error: lastError.message,
        }, 'ai')
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError ?? new Error('AI operation failed after retries')
}

export const aiService = {
  /**
   * Generate a text completion.
   * Returns null if AI is not configured — callers must handle this gracefully.
   */
  async complete(
    request: AICompletionRequest,
  ): Promise<AICompletionResponse | null> {
    const provider = await getAIProvider()

    if (!provider) {
      logger.info('AI completion skipped — provider not configured', {}, 'ai')
      return null
    }

    return withRetry(() => provider.complete(request))
  },

  /**
   * Generate structured output validated against a Zod schema.
   * Returns null if AI is not configured — callers must handle this gracefully.
   */
  async structured<T>(
    request: AIStructuredRequest<T>,
  ): Promise<AIStructuredResponse<T> | null> {
    const provider = await getAIProvider()

    if (!provider) {
      logger.info('AI structured request skipped — provider not configured', {}, 'ai')
      return null
    }

    return withRetry(() => provider.structured(request))
  },

  /**
   * Check whether AI features are available.
   */
  async isAvailable(): Promise<boolean> {
    const provider = await getAIProvider()
    return provider !== null
  },
}
