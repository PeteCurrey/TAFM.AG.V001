import { cn } from '@/lib/utils'

// ─── Section heading ──────────────────────────────────────────────────────────

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
type HeadingSize = 'display-xl' | 'display-lg' | 'display-md' | 'heading-xl' | 'heading-lg' | 'heading-md'
type HeadingVariant = 'dark' | 'light'

interface SectionHeadingProps {
  children: React.ReactNode
  as?: HeadingLevel
  size?: HeadingSize
  variant?: HeadingVariant
  eyebrow?: string
  subtitle?: string
  subtitleMaxWidth?: string
  className?: string
  /** Additional class for the text node itself */
  textClassName?: string
  align?: 'left' | 'center' | 'right'
}

const sizeClasses: Record<HeadingSize, string> = {
  'display-xl':  'text-display-xl font-extralight tracking-[0.04em]',
  'display-lg':  'text-display-lg font-extralight tracking-[0.03em]',
  'display-md':  'text-display-md font-light tracking-[0.02em]',
  'heading-xl':  'text-heading-xl font-light tracking-[0.02em]',
  'heading-lg':  'text-heading-lg font-light',
  'heading-md':  'text-heading-md font-light',
}

const variantClasses = {
  dark: {
    eyebrow: 'text-[var(--color-text-on-dark-muted)]',
    heading: 'text-white',
    subtitle: 'text-[var(--color-text-on-dark-3)]',
  },
  light: {
    eyebrow: 'text-[var(--color-text-on-light-muted)]',
    heading: 'text-[var(--color-text-on-light-primary)]',
    subtitle: 'text-[var(--color-text-on-light-3)]',
  },
}

const alignClasses = {
  left:   'text-left items-start',
  center: 'text-center items-center',
  right:  'text-right items-end',
}

export function SectionHeading({
  children,
  as: Tag = 'h2',
  size = 'display-lg',
  variant = 'dark',
  eyebrow,
  subtitle,
  subtitleMaxWidth = '52ch',
  className,
  textClassName,
  align = 'left',
}: SectionHeadingProps) {
  const styles = variantClasses[variant]

  return (
    <div className={cn('flex flex-col gap-4', alignClasses[align], className)}>
      {eyebrow && (
        <p className={cn('text-label', styles.eyebrow)}>
          {eyebrow}
        </p>
      )}

      <Tag
        className={cn(
          sizeClasses[size],
          styles.heading,
          'leading-[1.05]',
          textClassName,
        )}
      >
        {children}
      </Tag>

      {subtitle && (
        <p
          className={cn('text-body-lg font-light leading-relaxed', styles.subtitle)}
          style={{ maxWidth: subtitleMaxWidth }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── Metric / stat display ────────────────────────────────────────────────────

interface MetricProps {
  value: string
  label: string
  variant?: HeadingVariant
  accent?: boolean
  className?: string
}

export function Metric({ value, label, variant = 'dark', accent = false, className }: MetricProps) {
  const styles = variantClasses[variant]

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span
        className={cn(
          'text-display-md font-extralight tracking-tight tabular-nums',
          accent ? 'text-orange-500' : styles.heading,
        )}
      >
        {value}
      </span>
      <span className={cn('text-body-sm font-light', styles.subtitle)}>
        {label}
      </span>
    </div>
  )
}
