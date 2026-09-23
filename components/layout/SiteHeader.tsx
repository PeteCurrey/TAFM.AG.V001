'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { MobileMenu } from './MobileMenu'

// ─── Navigation items ─────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: 'Asset Finance', href: '/asset-finance' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Assets', href: '/assets' },
  { label: 'Finance', href: '/finance' },
  { label: 'Suppliers', href: '/for-suppliers' },
  { label: 'Finance Providers', href: '/for-lenders' },
  { label: 'Trust & Data', href: '/trust' },
  { label: 'Insights', href: '/insights' },
] as const

const EXPLORE_ITEMS = [
  {
    title: 'Asset Taxonomy',
    desc: 'Browse capital equipment categories across UK industry.',
    href: '/assets',
    tag: 'Directory',
  },
  {
    title: 'Verified Manufacturers',
    desc: 'OEM profiles with technical specifications and load data.',
    href: '/manufacturers',
    tag: 'Entities',
  },
  {
    title: 'Finance Structures',
    desc: 'Hire purchase, finance lease, operating lease & refinance.',
    href: '/finance',
    tag: 'Education',
  },
  {
    title: 'Asset Intelligence',
    desc: 'AI-assisted classification & specification analysis.',
    href: '/asset-intelligence',
    tag: 'Tool',
  },
  {
    title: 'Finance Calculator',
    desc: 'Illustrative monthly cost estimation for equipment purchases.',
    href: '/finance-calculator',
    tag: 'Illustrative',
  },
  {
    title: 'Trust & Provenance',
    desc: 'How TAFM verifies data, tracks observations & structures deal flow.',
    href: '/trust',
    tag: 'Governance',
  },
]

// ─── Site header ──────────────────────────────────────────────────────────────

export function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const exploreRef = useRef<HTMLDivElement>(null)

  // Scroll-aware header — becomes more opaque when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false)
    setIsExploreOpen(false)
  }, [pathname])

  // Click outside listener for explore menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[var(--z-nav)]',
          'transition-all duration-[var(--duration-slow)]',
          isScrolled
            ? 'bg-brand-black/95 backdrop-blur-md border-b border-[var(--color-border-dark)]'
            : 'bg-gradient-to-b from-black/80 to-transparent',
        )}
        role="banner"
      >
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-20">
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
                className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-0.5 mb-2 transition-all duration-[var(--duration-normal)] group-hover:scale-125"
                aria-hidden="true"
              />
            </Link>

            {/* Desktop navigation */}
            <nav
              className="hidden xl:flex items-center gap-6"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-caption font-light tracking-[0.05em] uppercase transition-colors duration-[var(--duration-fast)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm',
                      isActive
                        ? 'text-orange-400 font-normal'
                        : 'text-neutral-300 hover:text-white',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {/* Explore Popover Trigger */}
              <div className="relative" ref={exploreRef}>
                <button
                  type="button"
                  onClick={() => setIsExploreOpen(!isExploreOpen)}
                  className={cn(
                    'text-caption font-light tracking-[0.05em] uppercase transition-colors duration-[var(--duration-fast)] flex items-center gap-1.5 py-1 px-2.5 rounded border border-white/10 hover:border-orange-500/50',
                    isExploreOpen ? 'text-orange-400 border-orange-500' : 'text-neutral-300 hover:text-white'
                  )}
                  aria-expanded={isExploreOpen}
                  aria-haspopup="true"
                >
                  <span>Explore</span>
                  <span className={cn('text-[9px] transition-transform duration-200', isExploreOpen && 'rotate-180')}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Panel */}
                {isExploreOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-[#0c0c0c] border border-[var(--color-border-dark)] shadow-2xl rounded-sm p-3 grid gap-2 z-50">
                    <p className="text-[10px] tracking-widest uppercase text-neutral-500 px-3 pt-2 font-mono">
                      Marketplace Architecture
                    </p>
                    <div className="space-y-1">
                      {EXPLORE_ITEMS.map((e) => (
                        <Link
                          key={e.href}
                          href={e.href}
                          onClick={() => setIsExploreOpen(false)}
                          className="group block p-2.5 rounded hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-body-sm font-normal text-white group-hover:text-orange-400 transition-colors">
                              {e.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 font-mono">
                              {e.tag}
                            </span>
                          </div>
                          <p className="text-caption text-neutral-400 mt-1 line-clamp-1">
                            {e.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
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
                className="xl:hidden p-2 text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
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
        exploreItems={EXPLORE_ITEMS}
        currentPath={pathname}
      />
    </>
  )
}
