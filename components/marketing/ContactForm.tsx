'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitContact, type ContactFormState } from '@/app/actions/contact'
import { cn } from '@/lib/utils'

// ─── Contact form ─────────────────────────────────────────────────────────────
//
// Wired to the submitContact server action.
// Uses useActionState (React 19) — no manual fetch.

const inputClass =
  'w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light bg-white transition-colors'

const labelClass = 'block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2'

const errorClass = 'mt-1.5 text-caption text-red-600'

const initial: ContactFormState = { status: 'idle' }

export function ContactForm() {
  const [state, action, isPending] = useActionState(submitContact, initial)

  if (state.status === 'success') {
    return (
      <div className="py-16 text-center">
        <div
          className="w-12 h-12 rounded-[var(--radius-md)] bg-green-100 flex items-center justify-center mx-auto mb-6"
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-3">
          Message received
        </h2>
        <p className="text-body font-light text-[var(--color-text-on-light-3)]">
          {state.message}
        </p>
      </div>
    )
  }

  if (state.status === 'rate_limited') {
    return (
      <div className="py-12 text-center">
        <p className="text-body font-light text-[var(--color-text-on-light-3)]">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            aria-describedby={state.errors?.firstName ? 'firstName-error' : undefined}
            className={cn(inputClass, state.errors?.firstName && 'border-red-400 focus:ring-red-500')}
          />
          {state.errors?.firstName && (
            <p id="firstName-error" className={errorClass} role="alert">{state.errors.firstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            aria-describedby={state.errors?.lastName ? 'lastName-error' : undefined}
            className={cn(inputClass, state.errors?.lastName && 'border-red-400 focus:ring-red-500')}
          />
          {state.errors?.lastName && (
            <p id="lastName-error" className={errorClass} role="alert">{state.errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email address <span className="text-orange-500" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-describedby={state.errors?.email ? 'email-error' : undefined}
          className={cn(inputClass, state.errors?.email && 'border-red-400 focus:ring-red-500')}
        />
        {state.errors?.email && (
          <p id="email-error" className={errorClass} role="alert">{state.errors.email}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className={labelClass}>
          Company name
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className={inputClass}
        />
      </div>

      {/* Reason */}
      <div>
        <label htmlFor="reason" className={labelClass}>
          Reason for contact
        </label>
        <select
          id="reason"
          name="reason"
          className={inputClass}
          defaultValue=""
        >
          <option value="" disabled>Select an option</option>
          <option value="business">I am a business seeking asset finance</option>
          <option value="supplier">I am an asset supplier or dealer</option>
          <option value="lender">I am a finance provider</option>
          <option value="general">General enquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-orange-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className={cn(inputClass, 'resize-y', state.errors?.message && 'border-red-400 focus:ring-red-500')}
        />
        {state.errors?.message && (
          <p id="message-error" className={errorClass} role="alert">{state.errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isPending}>
        Send message
      </Button>

      <p className="text-caption text-[var(--color-text-on-light-muted)] text-center">
        TAFM does not provide financial advice. For finance enquiries, please{' '}
        <a href="/apply" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
          start an application
        </a>.
      </p>
    </form>
  )
}
