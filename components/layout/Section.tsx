import type { ElementType, ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

// ─── Section ──────────────────────────────────────────────────────────────────

type SectionVariant = 'dark' | 'dark-2' | 'dark-3' | 'light' | 'off-white' | 'light-warm'
type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'

interface SectionProps {
  children: ReactNode
  className?: string
  variant?: SectionVariant
  spacing?: SectionSpacing
  id?: string
  as?: ElementType
  'aria-label'?: string
  /** Apply content-visibility: auto for performance on long pages */
  deferred?: boolean
}

const variantClasses: Record<SectionVariant, string> = {
  'dark':       'surface-dark',
  'dark-2':     'surface-dark-2',
  'dark-3':     'surface-dark-3',
  'light':      'surface-light',
  'off-white':  'surface-off-white',
  'light-warm': 'surface-light-warm',
}

const spacingClasses: Record<SectionSpacing, string> = {
  'none': '',
  'sm':   'py-[var(--spacing-section-sm)]',
  'md':   'py-[var(--spacing-section-md)]',
  'lg':   'py-[var(--spacing-section-lg)]',
  'xl':   'py-[var(--spacing-section-xl)]',
  '2xl':  'py-[var(--spacing-section-2xl)]',
}

export function Section({
  children,
  className,
  variant = 'dark',
  spacing = 'xl',
  id,
  as: Tag = 'section',
  'aria-label': ariaLabel,
  deferred = false,
}: SectionProps) {
  const deferredStyle: CSSProperties | undefined = deferred
    ? { contentVisibility: 'auto', containIntrinsicBlockSize: '800px' }
    : undefined

  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      style={deferredStyle}
      className={cn(
        variantClasses[variant],
        spacingClasses[spacing],
        'relative overflow-hidden',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
