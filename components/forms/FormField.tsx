import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

// ─── FormField wrapper ────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-body-sm font-light text-[var(--color-text-on-light-2)]"
      >
        {label}
        {required && (
          <span className="ml-1 text-orange-500" aria-hidden="true">*</span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {/* Clone children with aria-describedby pointing at hint/error */}
      <div
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      >
        {children}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-caption text-[var(--color-text-on-light-muted)]">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-caption text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}
