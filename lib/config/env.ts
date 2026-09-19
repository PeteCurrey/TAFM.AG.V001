import { z } from 'zod'

// ─── Environment configuration ─────────────────────────────────────────────────
//
// This module validates and exposes typed environment configuration.
// Application startup fails loudly on missing required variables.
// Optional variables have safe defaults so the app boots without them.
//
// SECURITY: Never expose server-only variables as NEXT_PUBLIC_.

// ─── Schema ────────────────────────────────────────────────────────────────────

const envSchema = z.object({
  // ── Node environment
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),

  // ── Database (required for data persistence; app can serve static content without)
  DATABASE_URL: z.string().url().optional(),

  // ── Site (public — used in SEO/metadata)
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('TAFM'),

  // ── OpenAI (server-side only — NEVER prefix with NEXT_PUBLIC_)
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  OPENAI_MODEL_PRIMARY: z.string().default('gpt-4o'),
  OPENAI_MODEL_FAST: z.string().default('gpt-4o-mini'),
  OPENAI_MODEL_REASONING: z.string().default('o1-preview'),
  OPENAI_PROJECT_ID: z.string().optional(),

  // ── Analytics (optional — uses no-op provider when absent)
  ANALYTICS_PROVIDER: z.string().optional(),
  ANALYTICS_ID: z.string().optional(),

  // ── Future: Auth (optional)
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // ── Future: Stripe (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // ── Future: Email (optional)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
})

// ─── Validation ────────────────────────────────────────────────────────────────

function validateEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const formatted = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n')

    // Fail loudly — a misconfigured app should not silently proceed
    throw new Error(
      `\n\n[TAFM] Environment configuration is invalid:\n${formatted}\n\nCheck your .env.local file against .env.example\n`,
    )
  }

  return result.data
}

// Validate once at module load time
const _env = validateEnv()

// ─── Typed configuration exports ───────────────────────────────────────────────

export const env = {
  nodeEnv: _env.NODE_ENV,
  isProduction: _env.NODE_ENV === 'production',
  isDevelopment: _env.NODE_ENV === 'development',
  isTest: _env.NODE_ENV === 'test',

  database: {
    url: _env.DATABASE_URL,
    isConnected: !!_env.DATABASE_URL,
  },

  site: {
    url: _env.NEXT_PUBLIC_SITE_URL,
    name: _env.NEXT_PUBLIC_SITE_NAME,
  },

  ai: {
    openaiApiKey: _env.OPENAI_API_KEY,
    isConfigured: !!_env.OPENAI_API_KEY,
    models: {
      primary: _env.OPENAI_MODEL_PRIMARY,
      fast: _env.OPENAI_MODEL_FAST,
      reasoning: _env.OPENAI_MODEL_REASONING,
    },
    projectId: _env.OPENAI_PROJECT_ID,
  },

  analytics: {
    provider: _env.ANALYTICS_PROVIDER,
    id: _env.ANALYTICS_ID,
    isConfigured: !!(_env.ANALYTICS_PROVIDER && _env.ANALYTICS_ID),
  },

  auth: {
    secret: _env.NEXTAUTH_SECRET,
    url: _env.NEXTAUTH_URL,
    isConfigured: !!_env.NEXTAUTH_SECRET,
  },

  stripe: {
    secretKey: _env.STRIPE_SECRET_KEY,
    webhookSecret: _env.STRIPE_WEBHOOK_SECRET,
    isConfigured: !!_env.STRIPE_SECRET_KEY,
  },

  email: {
    apiKey: _env.RESEND_API_KEY,
    fromEmail: _env.RESEND_FROM_EMAIL,
    isConfigured: !!_env.RESEND_API_KEY,
  },
} as const

export type Env = typeof env
