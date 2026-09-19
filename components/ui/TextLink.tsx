import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── TextLink ─────────────────────────────────────────────────────────────────

type TextLinkVariant = 'orange' | 'muted' | 'inherit'

interface TextLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  variant?: TextLinkVariant
  external?: boolean
  /** Show an inline arrow icon */
  arrow?: boolean
}

const variantClasses: Record<TextLinkVariant, string> = {
  orange:  'text-orange-500 hover:text-orange-600',
  muted:   'text-[var(--color-text-on-light-muted)] hover:text-[var(--color-text-on-light-primary)]',
  inherit: 'text-inherit hover:text-orange-500',
}

export function TextLink({
  href,
  children,
  className,
  variant = 'orange',
  external = false,
  arrow = false,
}: TextLinkProps) {
  const isExternal = external || href.startsWith('http')
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Link
      href={href}
      {...externalProps}
      className={cn(
        'inline-flex items-center gap-1 transition-colors duration-[var(--duration-fast)] font-light underline-offset-2 hover:underline',
        variantClasses[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <span className="inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          {isExternal ? '↗' : '→'}
        </span>
      )}
    </Link>
  )
}
