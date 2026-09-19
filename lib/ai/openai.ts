import type { AIProviderInterface, AICompletionRequest, AICompletionResponse, AIStructuredRequest, AIStructuredResponse, AIModel } from '@/types/ai'
import { env } from '@/lib/config/env'
import { logger } from '@/lib/logging'

// ─── OpenAI provider ─────────────────────────────────────────────────────────
//
// Server-side only. Never import this in client components.
// Access the AI key only from env.ai.openaiApiKey — never from process.env directly.

let _openai: import('openai').OpenAI | null = null

async function getOpenAIClient(): Promise<import('openai').OpenAI> {
  if (_openai) return _openai

  if (!env.ai.isConfigured || !env.ai.openaiApiKey) {
    throw new Error(
      'OpenAI is not configured. Set OPENAI_API_KEY in your environment variables.',
    )
  }

  const { default: OpenAI } = await import('openai')
  _openai = new OpenAI({
    apiKey: env.ai.openaiApiKey,
    ...(env.ai.projectId && { project: env.ai.projectId }),
  })

  return _openai
}

// ─── OpenAI provider implementation ──────────────────────────────────────────

export const openAIProvider: AIProviderInterface = {
  name: 'openai',

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const client = await getOpenAIClient()

    const model: AIModel = request.model ?? env.ai.models.primary

    const messages = request.systemPrompt
      ? [{ role: 'system' as const, content: request.systemPrompt }, ...request.messages]
      : request.messages

    logger.ai('OpenAI completion request', {
      model,
      messageCount: messages.length,
      maxTokens: request.maxTokens,
    })

    const response = await client.chat.completions.create({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      ...(request.temperature !== undefined && { temperature: request.temperature }),
      ...(request.maxTokens !== undefined && { max_tokens: request.maxTokens }),
    })

    const choice = response.choices[0]
    const usage = response.usage

    return {
      content: choice.message.content ?? '',
      model: response.model,
      usage: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
      finishReason: choice.finish_reason ?? 'stop',
    }
  },

  async structured<T>(
    request: AIStructuredRequest<T>,
  ): Promise<AIStructuredResponse<T>> {
    const client = await getOpenAIClient()

    const model: AIModel = request.model ?? env.ai.models.primary

    logger.ai('OpenAI structured request', {
      model,
      schemaName: request.schemaName,
    })

    const messages = request.systemPrompt
      ? [{ role: 'system' as const, content: request.systemPrompt }, ...request.messages]
      : request.messages

    const response = await client.chat.completions.create({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      response_format: { type: 'json_object' },
      ...(request.temperature !== undefined && { temperature: request.temperature }),
      ...(request.maxTokens !== undefined && { max_tokens: request.maxTokens }),
    })

    const content = response.choices[0].message.content ?? '{}'
    const parsed = JSON.parse(content)

    // Validate against the Zod schema
    const validated = request.schema.safeParse(parsed)

    if (!validated.success) {
      logger.warn('AI structured output failed schema validation', {
        schemaName: request.schemaName,
        errors: validated.error.flatten(),
      }, 'ai')

      throw new Error(
        `AI output for ${request.schemaName} failed schema validation: ${validated.error.message}`,
      )
    }

    const usage = response.usage

    return {
      result: validated.data,
      requiresReview: true, // All AI outputs require review by default
      source: 'AI',
      model: response.model,
      usage: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
      createdAt: new Date(),
    }
  },
}
