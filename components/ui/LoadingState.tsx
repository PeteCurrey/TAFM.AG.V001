import { cn } from '@/lib/utils'

// ─── Loading state ────────────────────────────────────────────────────────────

interface LoadingStateProps {
  message?: string
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes = {
  sm: 'w-4 h-4 border-[1.5px]',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-2',
}

export function LoadingState({
  message = 'Loading…',
  variant = 'light',
  size = 'md',
  className,
}: LoadingStateProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Spinner */}
      <div
        className={cn(
          'rounded-full border-transparent animate-spin',
          spinnerSizes[size],
          isDark
            ? 'border-t-white/40 border-r-white/20'
            : 'border-t-orange-500 border-r-orange-200',
        )}
        style={{ borderStyle: 'solid' }}
        aria-hidden="true"
      />
      <p
        className={cn(
          'text-body-sm font-light',
          isDark ? 'text-[var(--color-text-on-dark-3)]' : 'text-[var(--color-text-on-light-3)]',
        )}
      >
        {message}
      </p>
    </div>
  )
}

// ─── Skeleton block ───────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  variant?: 'dark' | 'light'
}

export function Skeleton({ className, variant = 'light' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-sm)]',
        variant === 'dark' ? 'bg-white/8' : 'bg-black/6',
        className,
      )}
      aria-hidden="true"
    />
  )
}
