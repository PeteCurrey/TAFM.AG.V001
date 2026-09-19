'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// ─── Mobile menu ──────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: ReadonlyArray<{ label: string; href: string }>
  currentPath: string
}

export function MobileMenu({ isOpen, onClose, navItems, currentPath }: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[calc(var(--z-nav)-1)] bg-black/60 backdrop-blur-sm',
          'transition-opacity duration-[var(--duration-normal)] lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <nav
        id="mobile-menu"
        className={cn(
          'fixed top-16 right-0 bottom-0 z-[var(--z-nav)]',
          'w-full max-w-sm bg-brand-black-2 border-l border-[var(--color-border-dark)]',
          'flex flex-col overflow-y-auto lg:hidden',
          'transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col p-8 gap-1 flex-1">
          {navItems.map((item, index) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== '/' && currentPath.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                style={{ transitionDelay: isOpen ? `${index * 40}ms` : '0ms' }}
                className={cn(
                  'block py-4 text-heading-md font-light tracking-tight border-b border-[var(--color-border-dark)]',
                  'transition-all duration-[var(--duration-normal)]',
                  'focus-visible:outline-none focus-visible:text-orange-400',
                  isActive ? 'text-orange-400' : 'text-[var(--color-text-on-dark-2)] hover:text-white',
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="p-8 border-t border-[var(--color-border-dark)]">
          <Button
            as="a"
            href="/apply"
            variant="primary"
            fullWidth
            size="lg"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
          >
            Start an Application
          </Button>
        </div>
      </nav>
    </>
  )
}
