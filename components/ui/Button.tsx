import { cn } from '@/lib/utils'

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  as?: 'button' | 'a'
  href?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-orange-500 text-white',
    'hover:bg-orange-600',
    'active:bg-orange-700',
    'focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black',
    'disabled:bg-orange-900 disabled:text-orange-700 disabled:cursor-not-allowed',
  ].join(' '),

  secondary: [
    'bg-transparent text-white border border-[var(--color-border-dark-strong)]',
    'hover:border-[var(--color-border-dark)] hover:bg-white/5',
    'active:bg-white/10',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  ghost: [
    'bg-transparent text-[var(--color-text-on-light-primary)]',
    'hover:bg-black/5',
    'active:bg-black/10',
    'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  outline: [
    'bg-transparent text-[var(--color-text-on-light-primary)] border border-[var(--color-border-light-strong)]',
    'hover:border-[var(--color-text-on-light-3)]',
    'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-body-sm px-4 py-2 gap-1.5',
  md: 'text-body px-6 py-3 gap-2',
  lg: 'text-body-lg px-8 py-4 gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  as: Tag = 'button',
  href,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  const classes = cn(
    // Base
    'inline-flex items-center justify-center font-sans font-light tracking-[0.03em]',
    'rounded-[var(--radius-md)]',
    'transition-all duration-[var(--duration-normal)]',
    'select-none cursor-pointer whitespace-nowrap',
    // Variant
    variantStyles[variant],
    // Size
    sizeStyles[size],
    // Full width
    fullWidth && 'w-full',
    // Loading state
    isLoading && 'opacity-70 cursor-wait',
    className,
  )

  const content = (
    <>
      {isLoading ? (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </>
  )

  if (Tag === 'a' && href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={isDisabled}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={classes}
    >
      {content}
    </button>
  )
}
