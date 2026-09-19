import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Divider } from '@/components/ui/Divider'

// ─── Footer links ─────────────────────────────────────────────────────────────

const FOOTER_LINKS = {
  platform: [
    { label: 'Asset Finance', href: '/asset-finance' },
    { label: 'Asset Categories', href: '/assets' },
    { label: 'Finance Structures', href: '/finance' },
    { label: 'Finance Calculator', href: '/finance-calculator' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  partners: [
    { label: 'For Suppliers', href: '/for-suppliers' },
    { label: 'For Finance Providers', href: '/for-lenders' },
  ],
  company: [
    { label: 'About TAFM', href: '/about' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'Terms of Use', href: '/legal/terms' },
    { label: 'Financial Disclaimer', href: '/legal/financial-disclaimer' },
  ],
}

// ─── Site footer ──────────────────────────────────────────────────────────────

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="surface-dark-2 border-t border-[var(--color-border-dark)]"
      role="contentinfo"
    >
      <Container>
        {/* Main footer content */}
        <div className="py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
              aria-label="TAFM Homepage"
            >
              <span className="text-white font-light tracking-[0.2em] text-body-lg">TAFM</span>
              <span className="w-1 h-1 rounded-full bg-orange-500 ml-0.5 mb-2" aria-hidden="true" />
            </Link>
            <p className="text-body-sm text-[var(--color-text-on-dark-3)] font-light leading-relaxed max-w-xs">
              The Asset Finance Marketplace. Connecting UK businesses, asset suppliers and finance providers around the acquisition of business equipment.
            </p>
            <div className="mt-8">
              <p className="text-label text-[var(--color-text-on-dark-muted)] mb-2">
                United Kingdom
              </p>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-label text-[var(--color-text-on-dark-muted)] mb-5">Platform</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--color-text-on-dark-3)] hover:text-white transition-colors duration-[var(--duration-fast)] font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners links */}
          <div>
            <h3 className="text-label text-[var(--color-text-on-dark-muted)] mb-5">Partners</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.partners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--color-text-on-dark-3)] hover:text-white transition-colors duration-[var(--duration-fast)] font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-label text-[var(--color-text-on-dark-muted)] mb-5 mt-8">Company</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--color-text-on-dark-3)] hover:text-white transition-colors duration-[var(--duration-fast)] font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-label text-[var(--color-text-on-dark-muted)] mb-5">Legal</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--color-text-on-dark-3)] hover:text-white transition-colors duration-[var(--duration-fast)] font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider variant="dark" spacing="none" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-caption text-[var(--color-text-on-dark-muted)] font-light">
            © {year} TAFM. All rights reserved.
          </p>
          <p className="text-caption text-[var(--color-text-on-dark-muted)] font-light max-w-lg leading-relaxed">
            TAFM is a marketplace platform. We do not provide financial advice or lending services.
            Finance products are provided by regulated third-party finance providers.
            All finance is subject to status and eligibility.
          </p>
        </div>
      </Container>
    </footer>
  )
}
