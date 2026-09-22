'use client'

import React, { useActionState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signInAction, type AuthActionResult } from '@/app/actions/auth'

function SignInForm() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') ?? ''
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signInAction,
    null,
  )

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] tracking-widest text-[#FF6A1A] uppercase font-mono mb-1">
          SECURE ACCESS
        </p>
        <h1 className="text-2xl font-light text-white tracking-tight">Sign in to TAFM</h1>
        <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
          Access your business portal, provider opportunities, or management workspace.
        </p>
      </div>

      {state?.error && (
        <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs rounded-none">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="returnUrl" value={returnUrl} />

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)] mb-1">
            Email address
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6A1A] transition-colors"
            placeholder="name@business.co.uk"
          />
          {state?.fieldErrors?.email && (
            <p className="text-red-400 text-[11px] mt-1">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)]">
              Password
            </label>
          </div>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6A1A] transition-colors"
            placeholder="••••••••••••"
          />
          {state?.fieldErrors?.password && (
            <p className="text-red-400 text-[11px] mt-1">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white font-medium text-xs tracking-wider uppercase py-3 transition-colors disabled:opacity-50 mt-2"
        >
          {isPending ? 'Verifying...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--color-border-dark)] flex items-center justify-between text-xs text-[var(--color-text-on-dark-muted)]">
        <span>Need an account?</span>
        <Link href="/sign-up" className="text-[#FF6A1A] hover:underline">
          Create business account &rarr;
        </Link>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading authentication...</div>}>
      <SignInForm />
    </Suspense>
  )
}
