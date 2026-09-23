'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ─── Transaction flow ──────────────────────────────────────────────────────────
//
// Visualises the TAFM transaction chain:
// Business → Asset → Supplier → TAFM → Lender Network → Finance → Transaction → Asset Lifecycle
//
// Designed for dark backgrounds. Orange connectors and accent nodes.
// Animated on mount / scroll entry using IntersectionObserver.

const FLOW_NODES = [
  {
    id:      'real-asset',
    label:   'Real Asset',
    sub:     'Equipment identified at source',
    accent:  false,
  },
  {
    id:      'asset-data',
    label:   'Asset Data',
    sub:     'Specifications & provenance',
    accent:  false,
  },
  {
    id:      'requirement',
    label:   'Finance Requirement',
    sub:     'Deposit, term & structure',
    accent:  false,
  },
  {
    id:      'tafm',
    label:   'TAFM',
    sub:     'Requirement structured & validated',
    accent:  true,   // orange highlight node
  },
  {
    id:      'eligible-providers',
    label:   'Eligible Providers',
    sub:     'Matched to verified criteria',
    accent:  false,
  },
  {
    id:      'provider-underwriting',
    label:   'Provider Underwriting',
    sub:     'Independent credit assessment',
    accent:  false,
  },
  {
    id:      'finance',
    label:   'Finance',
    sub:     'Terms agreed & documents signed',
    accent:  false,
  },
  {
    id:      'transaction',
    label:   'Transaction',
    sub:     'Funds drawn down, supplier paid',
    accent:  false,
  },
]

interface TransactionFlowProps {
  className?: string
  /** Compact single-row layout for homepage hero area */
  compact?: boolean
}

export function TransactionFlow({ className, compact = false }: TransactionFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.querySelectorAll<HTMLElement>('[data-flow-node]').forEach((node) => {
        node.style.opacity = '1'
        node.style.transform = 'none'
      })
      return
    }

    const nodes = el.querySelectorAll<HTMLElement>('[data-flow-node]')
    nodes.forEach((node) => {
      node.style.opacity = '0'
      node.style.transform = 'translateY(16px)'
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        nodes.forEach((node, i) => {
          const delay = parseInt(node.dataset.delay ?? '0')
          setTimeout(() => {
            node.style.transition = 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)'
            node.style.opacity = '1'
            node.style.transform = 'none'
          }, delay + i * 60)
        })
        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (compact) {
    return (
      <div ref={containerRef} className={cn('flex items-center gap-0 overflow-x-auto', className)} role="list" aria-label="TAFM transaction flow">
        {FLOW_NODES.map((node, i) => (
          <div key={node.id} className="flex items-center flex-shrink-0" role="listitem">
            <div
              data-flow-node
              data-delay="0"
              className={cn(
                'flex flex-col items-center text-center px-3',
                node.accent ? 'text-orange-400' : 'text-white/60',
              )}
            >
              <span className={cn(
                'text-caption tracking-widest uppercase font-light whitespace-nowrap',
                node.accent ? 'text-orange-400' : 'text-white/50',
              )}>
                {node.label}
              </span>
            </div>
            {i < FLOW_NODES.length - 1 && (
              <div className={cn(
                'w-6 h-px flex-shrink-0',
                i === 2 ? 'bg-orange-500' : 'bg-white/20', // highlight TAFM connector
              )} aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('w-full', className)} role="list" aria-label="TAFM transaction flow">
      {/* Desktop: horizontal flow */}
      <div className="hidden lg:flex items-start justify-between gap-2">
        {FLOW_NODES.map((node, i) => (
          <div key={node.id} className="flex items-start flex-1 min-w-0" role="listitem">
            <div
              data-flow-node
              data-delay="0"
              className="flex flex-col items-center text-center flex-1 min-w-0"
            >
              {/* Node indicator */}
              <div className={cn(
                'w-3 h-3 rounded-full border flex-shrink-0 mb-3',
                node.accent
                  ? 'bg-orange-500 border-orange-500 shadow-[0_0_12px_rgba(255,106,26,0.6)]'
                  : 'bg-transparent border-white/30',
              )} aria-hidden="true" />

              <p className={cn(
                'text-label tracking-[0.08em] uppercase font-light mb-1.5 whitespace-nowrap',
                node.accent ? 'text-orange-400' : 'text-white',
              )}>
                {node.label}
              </p>
              <p className="text-caption font-light text-white/40 leading-snug px-1">
                {node.sub}
              </p>
            </div>

            {/* Connector line */}
            {i < FLOW_NODES.length - 1 && (
              <div className="flex items-start pt-[5px] px-1 flex-shrink-0" aria-hidden="true">
                <div className={cn(
                  'h-px w-6',
                  node.accent || FLOW_NODES[i + 1]?.accent
                    ? 'bg-orange-500/60'
                    : 'bg-white/15',
                )} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical flow */}
      <div className="flex lg:hidden flex-col space-y-0">
        {FLOW_NODES.map((node, i) => (
          <div key={node.id} role="listitem">
            <div
              data-flow-node
              data-delay="0"
              className="flex items-start gap-4 py-4"
            >
              {/* Left: step + connector */}
              <div className="flex flex-col items-center flex-shrink-0 w-8">
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full border',
                  node.accent
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-transparent border-white/30',
                )} aria-hidden="true" />
                {i < FLOW_NODES.length - 1 && (
                  <div className={cn(
                    'w-px flex-1 mt-1',
                    node.accent ? 'bg-orange-500/40' : 'bg-white/10',
                  )}
                    style={{ minHeight: '32px' }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Right: content */}
              <div className="pt-0.5 pb-4">
                <p className={cn(
                  'text-label tracking-[0.06em] uppercase font-light mb-1',
                  node.accent ? 'text-orange-400' : 'text-white',
                )}>
                  {node.label}
                </p>
                <p className="text-body-sm font-light text-white/40">{node.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
