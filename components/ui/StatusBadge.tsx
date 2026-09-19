import { cn } from '@/lib/utils'
import type { DataStatus } from '@/types/common'

// ─── Status badge ─────────────────────────────────────────────────────────────

type BadgeVariant =
  | 'verified'
  | 'provisional'
  | 'calculated'
  | 'user-provided'
  | 'unknown'
  | 'dev-data'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'error'

interface StatusBadgeProps {
  variant: BadgeVariant
  label?: string
  className?: string
}

const DATA_STATUS_MAP: Record<DataStatus, BadgeVariant> = {
  VERIFIED:      'verified',
  PROVISIONAL:   'provisional',
  CALCULATED:    'calculated',
  USER_PROVIDED: 'user-provided',
  UNKNOWN:       'unknown',
}

const variantStyles: Record<BadgeVariant, { dot: string; text: string; bg: string }> = {
  verified:       { dot: 'bg-green-500',   text: 'text-green-700',  bg: 'bg-green-50 border-green-200'    },
  provisional:    { dot: 'bg-amber-500',   text: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200'    },
  calculated:     { dot: 'bg-blue-500',    text: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200'      },
  'user-provided':{ dot: 'bg-purple-500',  text: 'text-purple-700', bg: 'bg-purple-50 border-purple-200'  },
  unknown:        { dot: 'bg-gray-400',    text: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200'      },
  'dev-data':     { dot: 'bg-amber-500',   text: 'text-amber-900',  bg: 'bg-amber-100 border-amber-400'   },
  active:         { dot: 'bg-green-500',   text: 'text-green-700',  bg: 'bg-green-50 border-green-200'    },
  inactive:       { dot: 'bg-gray-400',    text: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200'      },
  pending:        { dot: 'bg-amber-500',   text: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200'    },
  error:          { dot: 'bg-red-500',     text: 'text-red-700',    bg: 'bg-red-50 border-red-200'        },
}

const defaultLabels: Record<BadgeVariant, string> = {
  verified:       'Verified',
  provisional:    'Provisional',
  calculated:     'Calculated estimate',
  'user-provided':'User provided',
  unknown:        'Unverified',
  'dev-data':     'DEVELOPMENT DATA',
  active:         'Active',
  inactive:       'Inactive',
  pending:        'Pending',
  error:          'Error',
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const styles = variantStyles[variant]
  const displayLabel = label ?? defaultLabels[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5',
        'text-label border rounded-[var(--radius-sm)]',
        styles.bg,
        styles.text,
        className,
      )}
      role="status"
      aria-label={displayLabel}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', styles.dot)}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  )
}

/**
 * Convenience: render a badge from a DataStatus value.
 */
export function DataStatusBadge({
  status,
  className,
}: {
  status: DataStatus
  className?: string
}) {
  return <StatusBadge variant={DATA_STATUS_MAP[status]} className={className} />
}

/**
 * Development data warning badge.
 * Must be shown on any fixture/mock data visible in the UI.
 */
export function DevDataBadge({ className }: { className?: string }) {
  return (
    <StatusBadge
      variant="dev-data"
      label="DEVELOPMENT DATA — Not real"
      className={className}
    />
  )
}
