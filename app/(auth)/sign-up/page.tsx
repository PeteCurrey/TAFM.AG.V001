'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import { signUpAction, type AuthActionResult } from '@/app/actions/auth'

export default function SignUpPage() {
  const [accountType, setAccountType] = useState<'BUSINESS' | 'PROVIDER'>('BUSINESS')
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signUpAction,
    null,
  )

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] tracking-widest text-[#FF6A1A] uppercase font-mono mb-1">
          REGISTRATION
        </p>
        <h1 className="text-2xl font-light text-white tracking-tight">Create your account</h1>
        <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-light">
          Join the UK asset finance commercial marketplace.
        </p>
      </div>

      {/* Account type toggle */}
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#121212] border border-[var(--color-border-dark)]">
        <button
          type="button"
          onClick={() => setAccountType('BUSINESS')}
          className={`py-2 text-xs uppercase tracking-wider transition-colors ${
            accountType === 'BUSINESS'
              ? 'bg-[#1e1e1e] text-white font-medium border border-[#333]'
              : 'text-[var(--color-text-on-dark-muted)] hover:text-white'
          }`}
        >
          Business borrower
        </button>
        <button
          type="button"
          onClick={() => setAccountType('PROVIDER')}
          className={`py-2 text-xs uppercase tracking-wider transition-colors ${
            accountType === 'PROVIDER'
              ? 'bg-[#1e1e1e] text-white font-medium border border-[#333]'
              : 'text-[var(--color-text-on-dark-muted)] hover:text-white'
          }`}
        >
          Finance provider
        </button>
      </div>

      {state?.error && (
        <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="accountType" value={accountType} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)] mb-1">
              First name
            </label>
            <input
              name="firstName"
              type="text"
              required
              className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6A1A] transition-colors"
              placeholder="Alex"
            />
            {state?.fieldErrors?.firstName && (
              <p className="text-red-400 text-[11px] mt-1">{state.fieldErrors.firstName[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)] mb-1">
              Last name
            </label>
            <input
              name="lastName"
              type="text"
              required
              className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6A1A] transition-colors"
              placeholder="Smith"
            />
            {state?.fieldErrors?.lastName && (
              <p className="text-red-400 text-[11px] mt-1">{state.fieldErrors.lastName[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)] mb-1">
            {accountType === 'BUSINESS' ? 'Company / Business name' : 'Provider organisation'}
          </label>
          <input
            name="businessName"
            type="text"
            required
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6A1A] transition-colors"
            placeholder={accountType === 'BUSINESS' ? 'Smith Engineering Ltd' : 'Atlas Commercial Finance'}
          />
          {state?.fieldErrors?.businessName && (
            <p className="text-red-400 text-[11px] mt-1">{state.fieldErrors.businessName[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)] mb-1">
            Work email
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6A1A] transition-colors"
            placeholder="name@company.co.uk"
          />
          {state?.fieldErrors?.email && (
            <p className="text-red-400 text-[11px] mt-1">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--color-text-on-dark-2)] mb-1">
            Password (min. 8 characters)
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
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
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--color-border-dark)] flex items-center justify-between text-xs text-[var(--color-text-on-dark-muted)]">
        <span>Already have an account?</span>
        <Link href="/sign-in" className="text-[#FF6A1A] hover:underline">
          Sign in &rarr;
        </Link>
      </div>
    </div>
  )
}
