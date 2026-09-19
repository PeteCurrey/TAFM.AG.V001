import Link from 'next/link'
import type { BreadcrumbItem } from '@/types/seo'
import { cn } from '@/lib/utils'
import { generateBreadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from './JsonLd'

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  variant?: 'dark' | 'light'
  includeSchema?: boolean
}

export function Breadcrumbs({
  items,
  className,
  variant = 'light',
  includeSchema = true,
}: BreadcrumbsProps) {
  const isDark = variant === 'dark'

  return (
    <>
      {includeSchema && <JsonLd data={generateBreadcrumbSchema(items)} />}

      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center', className)}
      >
        <ol
          className="flex items-center gap-2 flex-wrap"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li
                key={index}
                className="flex items-center gap-2"
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 1)} />

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    itemProp="item"
                    className={cn(
                      'text-caption hover:underline transition-colors duration-[var(--duration-fast)]',
                      isDark
                        ? 'text-[var(--color-text-on-dark-3)] hover:text-white'
                        : 'text-[var(--color-text-on-light-3)] hover:text-[var(--color-text-on-light-primary)]',
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    itemProp="name"
                    className={cn(
                      'text-caption',
                      isLast
                        ? isDark
                          ? 'text-[var(--color-text-on-dark-2)]'
                          : 'text-[var(--color-text-on-light-2)]'
                        : isDark
                          ? 'text-[var(--color-text-on-dark-3)]'
                          : 'text-[var(--color-text-on-light-3)]',
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <span
                    className={cn(
                      'text-caption select-none',
                      isDark
                        ? 'text-[var(--color-text-on-dark-muted)]'
                        : 'text-[var(--color-text-on-light-muted)]',
                    )}
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
