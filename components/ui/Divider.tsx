import { cn } from '@/lib/utils'

// ─── Divider ──────────────────────────────────────────────────────────────────

interface DividerProps {
  className?: string
  variant?: 'dark' | 'light' | 'orange'
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg' | 'none'
}

const variantClass = {
  dark:   'divider-dark',
  light:  'divider-light',
  orange: 'divider-orange',
}

const spacingClass = {
  none: '',
  sm:   'my-6',
  md:   'my-10',
  lg:   'my-16',
}

export function Divider({
  className,
  variant = 'light',
  orientation = 'horizontal',
  spacing = 'md',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        className={cn(
          'inline-block self-stretch w-px',
          variant === 'dark' ? 'bg-[var(--color-border-dark)]' : 'bg-[var(--color-border-light)]',
          className,
        )}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  return (
    <hr
      className={cn(
        variantClass[variant],
        spacingClass[spacing],
        'border-0 border-t w-full',
        className,
      )}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}
