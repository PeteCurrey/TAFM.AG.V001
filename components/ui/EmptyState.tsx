import { cn } from '@/lib/utils'

// ─── Empty state ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  variant?: 'dark' | 'light'
  className?: string
  /**
   * Use this on integration boundaries — states where functionality
   * does not yet exist rather than "no data found".
   */
  isIntegrationBoundary?: boolean
}

export function EmptyState({
  title,
  description,
  action,
  variant = 'light',
  className,
  isIntegrationBoundary = false,
}: EmptyStateProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'px-8 py-16 rounded-[var(--radius-md)]',
        isDark
          ? 'border border-[var(--color-border-dark)] bg-white/[0.02]'
          : 'border border-[var(--color-border-light)] bg-black/[0.02]',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon area */}
      <div
        className={cn(
          'w-12 h-12 mb-6 rounded-[var(--radius-md)] flex items-center justify-center',
          isDark ? 'bg-white/5' : 'bg-black/5',
        )}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={isDark ? 'text-white/30' : 'text-black/30'}
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {isIntegrationBoundary && (
        <p
          className={cn(
            'text-label mb-3',
            isDark ? 'text-[var(--color-text-on-dark-muted)]' : 'text-[var(--color-text-on-light-muted)]',
          )}
        >
          Integration not yet available
        </p>
      )}

      <h3
        className={cn(
          'text-heading-md font-light mb-2',
          isDark ? 'text-[var(--color-text-on-dark-2)]' : 'text-[var(--color-text-on-light-2)]',
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          'text-body-sm max-w-sm',
          isDark ? 'text-[var(--color-text-on-dark-3)]' : 'text-[var(--color-text-on-light-3)]',
        )}
      >
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="text-orange-500 text-body-sm hover:text-orange-400 transition-colors"
            >
              {action.label}
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="text-orange-500 text-body-sm hover:text-orange-400 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
