'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { MobileMenu } from './MobileMenu'

// ─── Navigation items ─────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: 'Assets', href: '/assets' },
  { label: 'Finance', href: '/finance' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'For Suppliers', href: '/for-suppliers' },
  { label: 'For Finance Providers', href: '/for-lenders' },
  { label: 'Insights', href: '/insights' },
  { label: 'Trust', href: '/trust' },
]

// ─── Site header ──────────────────────────────────────────────────────────────

export function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Scroll-aware header — becomes more opaque when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[var(--z-nav)]',
          'transition-all duration-[var(--duration-slow)]',
          isScrolled
            ? 'bg-brand-black/95 backdrop-blur-sm border-b border-[var(--color-border-dark)]'
            : 'bg-transparent',
        )}
        role="banner"
      >
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
              aria-label="TAFM — The Asset Finance Marketplace — Homepage"
            >
              <span className="text-white font-light tracking-[0.2em] text-body-lg select-none">
                TAFM
              </span>
              <span
                className="w-1 h-1 rounded-full bg-orange-500 ml-0.5 mb-2 transition-all duration-[var(--duration-normal)] group-hover:scale-150"
                aria-hidden="true"
              />
            </Link>

            {/* Desktop navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-body-sm font-light tracking-[0.03em] transition-colors duration-[var(--duration-fast)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm',
                      isActive
                        ? 'text-orange-400'
                        : 'text-[var(--color-text-on-dark-2)] hover:text-white',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <Button
                  as="a"
                  href="/apply"
                  variant="primary"
                  size="sm"
                >
                  Start an Application
                </Button>
              </div>

              {/* Mobile menu trigger */}
              <button
                className="lg:hidden p-2 text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                <span className="sr-only">{isMobileOpen ? 'Close menu' : 'Open menu'}</span>
                <div className="w-5 h-4 flex flex-col justify-between" aria-hidden="true">
                  <span className={cn('block h-px bg-current transition-all duration-[var(--duration-normal)]', isMobileOpen && 'rotate-45 translate-y-[7.5px]')} />
                  <span className={cn('block h-px bg-current transition-all duration-[var(--duration-normal)]', isMobileOpen && 'opacity-0')} />
                  <span className={cn('block h-px bg-current transition-all duration-[var(--duration-normal)]', isMobileOpen && '-rotate-45 -translate-y-[7.5px]')} />
                </div>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={NAV_ITEMS}
        currentPath={pathname}
      />
    </>
  )
}
