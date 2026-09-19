'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitLead, type LeadFormState } from '@/app/actions/lead'
import { cn } from '@/lib/utils'

// ─── Lead capture form ─────────────────────────────────────────────────────────
//
// Registers interest from suppliers or lenders.
// Wired to submitLead Server Action.

const inputClass =
  'w-full px-4 py-3 text-body border border-[var(--color-border-light)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-orange-500 font-light bg-white transition-colors'

const labelClass = 'block text-body-sm font-light text-[var(--color-text-on-light-2)] mb-2'

const errorClass = 'mt-1.5 text-caption text-red-600'

interface LeadCaptureFormProps {
  type: 'supplier' | 'lender'
  /** Heading shown above the form */
  heading?: string
  /** Body text shown above the form */
  description?: string
}

const initial: LeadFormState = { status: 'idle' }

export function LeadCaptureForm({ type, heading, description }: LeadCaptureFormProps) {
  const [state, action, isPending] = useActionState(submitLead, initial)

  if (state.status === 'success') {
    return (
      <div className="py-12 text-center">
        <div
          className="w-12 h-12 rounded-[var(--radius-md)] bg-green-100 flex items-center justify-center mx-auto mb-6"
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-heading-lg font-light text-[var(--color-text-on-light-primary)] mb-3">
          Registration received
        </h3>
        <p className="text-body font-light text-[var(--color-text-on-light-3)] max-w-md mx-auto">
          {state.message}
        </p>
      </div>
    )
  }

  if (state.status === 'rate_limited') {
    return (
      <div className="py-8 text-center">
        <p className="text-body font-light text-[var(--color-text-on-light-3)]">{state.message}</p>
      </div>
    )
  }

  return (
    <div className="p-8 border border-[var(--color-border-light)] rounded-[var(--radius-md)] bg-[var(--color-surface-off-white)]">
      {heading && (
        <h3 className="text-heading-md font-light text-[var(--color-text-on-light-primary)] mb-3">
          {heading}
        </h3>
      )}
      {description && (
        <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
          {description}
        </p>
      )}

      <form action={action} className="space-y-5" noValidate>
        {/* Hidden type field */}
        <input type="hidden" name="type" value={type} />

        {/* Company name */}
        <div>
          <label htmlFor={`${type}-companyName`} className={labelClass}>
            Company name <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id={`${type}-companyName`}
            name="companyName"
            type="text"
            required
            autoComplete="organization"
            aria-describedby={state.errors?.companyName ? `${type}-companyName-error` : undefined}
            className={cn(inputClass, state.errors?.companyName && 'border-red-400 focus:ring-red-500')}
          />
          {state.errors?.companyName && (
            <p id={`${type}-companyName-error`} className={errorClass} role="alert">{state.errors.companyName}</p>
          )}
        </div>

        {/* Contact name */}
        <div>
          <label htmlFor={`${type}-contactName`} className={labelClass}>
            Your name <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id={`${type}-contactName`}
            name="contactName"
            type="text"
            required
            autoComplete="name"
            aria-describedby={state.errors?.contactName ? `${type}-contactName-error` : undefined}
            className={cn(inputClass, state.errors?.contactName && 'border-red-400 focus:ring-red-500')}
          />
          {state.errors?.contactName && (
            <p id={`${type}-contactName-error`} className={errorClass} role="alert">{state.errors.contactName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`${type}-email`} className={labelClass}>
            Email address <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id={`${type}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-describedby={state.errors?.email ? `${type}-email-error` : undefined}
            className={cn(inputClass, state.errors?.email && 'border-red-400 focus:ring-red-500')}
          />
          {state.errors?.email && (
            <p id={`${type}-email-error`} className={errorClass} role="alert">{state.errors.email}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor={`${type}-role`} className={labelClass}>
            Your role
          </label>
          <input
            id={`${type}-role`}
            name="role"
            type="text"
            autoComplete="organization-title"
            placeholder={type === 'supplier' ? 'e.g. Sales Director, Owner' : 'e.g. Credit Director, BD Manager'}
            className={inputClass}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor={`${type}-message`} className={labelClass}>
            Tell us briefly about your {type === 'supplier' ? 'business and the assets you supply' : 'organisation and lending appetite'}
          </label>
          <textarea
            id={`${type}-message`}
            name="message"
            rows={4}
            className={cn(inputClass, 'resize-y')}
            placeholder={type === 'supplier'
              ? 'Asset categories, typical deal sizes, regions…'
              : 'Asset classes, typical ticket sizes, UK/national coverage…'}
          />
        </div>

        <Button type="submit" variant="primary" size="md" fullWidth isLoading={isPending}>
          Register interest
        </Button>
      </form>
    </div>
  )
}
