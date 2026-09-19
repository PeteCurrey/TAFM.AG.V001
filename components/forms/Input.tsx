import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
}

const baseClasses = [
  'w-full text-body font-light',
  'px-4 py-3',
  'border rounded-[var(--radius-md)]',
  'bg-white',
  'text-[var(--color-text-on-light-primary)]',
  'placeholder:text-[var(--color-text-on-light-muted)]',
  'transition-all duration-[var(--duration-fast)]',
  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-light)]',
].join(' ')

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, leftAdornment, rightAdornment, className, ...props }, ref) => {
    if (!leftAdornment && !rightAdornment) {
      return (
        <input
          ref={ref}
          className={cn(
            baseClasses,
            hasError
              ? 'border-red-300 focus:ring-red-400'
              : 'border-[var(--color-border-light)] hover:border-[var(--color-border-light-strong)]',
            className,
          )}
          aria-invalid={hasError ? 'true' : undefined}
          {...props}
        />
      )
    }

    return (
      <div className="relative flex items-center">
        {leftAdornment && (
          <span
            className="absolute left-4 pointer-events-none text-[var(--color-text-on-light-muted)] select-none"
            aria-hidden="true"
          >
            {leftAdornment}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            baseClasses,
            hasError
              ? 'border-red-300 focus:ring-red-400'
              : 'border-[var(--color-border-light)] hover:border-[var(--color-border-light-strong)]',
            leftAdornment && 'pl-8',
            rightAdornment && 'pr-8',
            className,
          )}
          aria-invalid={hasError ? 'true' : undefined}
          {...props}
        />
        {rightAdornment && (
          <span
            className="absolute right-4 pointer-events-none text-[var(--color-text-on-light-muted)] select-none"
            aria-hidden="true"
          >
            {rightAdornment}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
