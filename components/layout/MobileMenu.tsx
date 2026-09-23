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
  exploreItems?: ReadonlyArray<{ title: string; href: string; desc: string; tag: string }>
  currentPath: string
}

export function MobileMenu({ isOpen, onClose, navItems, exploreItems = [], currentPath }: MobileMenuProps) {
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
          'fixed inset-0 z-[calc(var(--z-nav)-1)] bg-black/70 backdrop-blur-md',
          'transition-opacity duration-[var(--duration-normal)] xl:hidden',
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
          'w-full max-w-sm bg-[#0a0a0a] border-l border-[var(--color-border-dark)]',
          'flex flex-col overflow-y-auto xl:hidden',
          'transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col p-6 gap-1 flex-1">
          <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2 font-mono">
            Navigation
          </p>
          {navItems.map((item, index) => {
            const isActive =
              currentPath === item.href || currentPath.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                style={{ transitionDelay: isOpen ? `${index * 30}ms` : '0ms' }}
                className={cn(
                  'block py-3 text-heading-md font-light tracking-tight border-b border-white/5',
                  'transition-all duration-[var(--duration-normal)]',
                  'focus-visible:outline-none focus-visible:text-orange-400',
                  isActive ? 'text-orange-400' : 'text-neutral-300 hover:text-white',
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}

          {exploreItems.length > 0 && (
            <div className="mt-8 pt-4 border-t border-white/10">
              <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-4 font-mono">
                Explore The Marketplace
              </p>
              <div className="space-y-3">
                {exploreItems.map((exp) => (
                  <Link
                    key={exp.href}
                    href={exp.href}
                    onClick={onClose}
                    className="block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                        {exp.title}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {exp.tag}
                      </span>
                    </div>
                    <p className="text-caption text-neutral-400 line-clamp-1 mt-0.5">
                      {exp.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="p-6 border-t border-[var(--color-border-dark)] bg-black/40">
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
