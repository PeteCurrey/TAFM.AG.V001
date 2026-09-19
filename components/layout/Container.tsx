import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ─── Container ────────────────────────────────────────────────────────────────

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
  size?: 'narrow' | 'default' | 'wide'
}

export function Container({
  children,
  className,
  as: Tag = 'div',
  size = 'default',
}: ContainerProps) {
  const sizeClass =
    size === 'narrow'
      ? 'container-narrow'
      : size === 'wide'
        ? 'container-wide'
        : 'container-tafm'

  return (
    <Tag className={cn(sizeClass, className)}>
      {children}
    </Tag>
  )
}
