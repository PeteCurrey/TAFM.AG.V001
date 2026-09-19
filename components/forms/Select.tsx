import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Select ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  hasError?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, hasError, className, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none text-body font-light',
            'px-4 py-3 pr-10',
            'border rounded-[var(--radius-md)]',
            'bg-white',
            'text-[var(--color-text-on-light-primary)]',
            'transition-all duration-[var(--duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'cursor-pointer',
            hasError
              ? 'border-red-300 focus:ring-red-400'
              : 'border-[var(--color-border-light)] hover:border-[var(--color-border-light-strong)]',
            className,
          )}
          aria-invalid={hasError ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown chevron */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-on-light-muted)]"
          aria-hidden="true"
        >
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    )
  },
)

Select.displayName = 'Select'
