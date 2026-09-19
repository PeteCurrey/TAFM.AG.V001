import { forwardRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

// ─── Currency input ───────────────────────────────────────────────────────────
//
// Formats user input as GBP with £ prefix.
// Stores the raw numeric value (not formatted string).

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: string | number | undefined
  onValueChange: (value: string) => void
  currency?: string
  hasError?: boolean
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, currency = '£', hasError, className, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strip everything except digits and decimal point
        const raw = e.target.value.replace(/[^0-9.]/g, '')
        // Prevent multiple decimal points
        const parts = raw.split('.')
        const cleaned = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw
        onValueChange(cleaned)
      },
      [onValueChange],
    )

    return (
      <div className="relative flex items-center">
        <span
          className="absolute left-4 pointer-events-none text-[var(--color-text-on-light-muted)] select-none text-body"
          aria-hidden="true"
        >
          {currency}
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={value ?? ''}
          onChange={handleChange}
          className={cn(
            'w-full pl-8 pr-4 py-3 text-body font-light',
            'border rounded-[var(--radius-md)] bg-white',
            'text-[var(--color-text-on-light-primary)]',
            'placeholder:text-[var(--color-text-on-light-muted)]',
            'transition-all duration-[var(--duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            hasError
              ? 'border-red-300 focus:ring-red-400'
              : 'border-[var(--color-border-light)] hover:border-[var(--color-border-light-strong)]',
            className,
          )}
          aria-invalid={hasError ? 'true' : undefined}
          {...props}
        />
      </div>
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'
