import { cn } from '@/lib/utils'

// ─── Error state ──────────────────────────────────────────────────────────────
//
// Never leak internal error details to the UI.
// Show a clear, honest message. Log the real error server-side.

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  variant?: 'dark' | 'light'
  className?: string
  /** Safe public-facing error code (e.g. "ERR_INTEGRATION_UNAVAILABLE") */
  errorCode?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again, or contact support if the problem persists.',
  onRetry,
  variant = 'light',
  className,
  errorCode,
}: ErrorStateProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'px-8 py-16 rounded-[var(--radius-md)]',
        isDark
          ? 'border border-red-900/30 bg-red-950/20'
          : 'border border-red-200 bg-red-50/50',
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Error icon */}
      <div
        className={cn(
          'w-12 h-12 mb-6 rounded-[var(--radius-md)] flex items-center justify-center',
          isDark ? 'bg-red-900/30' : 'bg-red-100',
        )}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={isDark ? 'text-red-400' : 'text-red-500'}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h3
        className={cn(
          'text-heading-md font-light mb-2',
          isDark ? 'text-red-300' : 'text-red-700',
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          'text-body-sm max-w-sm',
          isDark ? 'text-red-400/70' : 'text-red-600/80',
        )}
      >
        {description}
      </p>

      {errorCode && (
        <p
          className={cn(
            'text-caption mt-3 font-mono',
            isDark ? 'text-red-500/50' : 'text-red-400/70',
          )}
          aria-label={`Error code: ${errorCode}`}
        >
          {errorCode}
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'mt-6 text-body-sm transition-colors',
            isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500',
          )}
        >
          Try again
        </button>
      )}
    </div>
  )
}
