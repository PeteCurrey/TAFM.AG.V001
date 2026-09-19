'use client'

import { useRef, useEffect, type ReactNode, type ElementType } from 'react'
import type React from 'react'
import { cn } from '@/lib/utils'

// ─── Animation tokens ─────────────────────────────────────────────────────────

export const animationTokens = {
  duration: {
    fast: 120,
    normal: 260,
    slow: 500,
    verySlow: 900,
  },
  easing: {
    outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
    inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
    out: [0, 0, 0.2, 1] as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
  distance: {
    sm: 12,
    md: 24,
    lg: 40,
    xl: 64,
  },
} as const

// ─── Animate on scroll ────────────────────────────────────────────────────────
//
// Reveals children when they enter the viewport.
// Uses Intersection Observer API.
// Respects prefers-reduced-motion.

interface AnimateOnScrollProps extends Omit<React.HTMLAttributes<HTMLElement>, 'ref'> {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  translateY?: number
  translateX?: number
  scale?: number
  threshold?: number
  once?: boolean
  as?: ElementType
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 500,
  translateY = 24,
  translateX = 0,
  scale = 1,
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
  ...rest
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const el = ref.current
    if (!el) return

    if (prefersReduced) {
      // Show immediately without animation
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    // Initial state
    el.style.opacity = '0'
    el.style.transform = `translateY(${translateY}px) translateX(${translateX}px) scale(${scale === 1 ? 1 : 0.96})`
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0) translateX(0) scale(1)'
            if (once) observer.disconnect()
          } else if (!once) {
            el.style.opacity = '0'
            el.style.transform = `translateY(${translateY}px) translateX(${translateX}px) scale(${scale === 1 ? 1 : 0.96})`
          }
        })
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, duration, translateY, translateX, scale, threshold, once])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}

// ─── Stagger container ────────────────────────────────────────────────────────

interface StaggerProps {
  children: ReactNode
  className?: string
  staggerMs?: number
  baseDelay?: number
}

export function Stagger({ children, className, staggerMs = 80, baseDelay = 0 }: StaggerProps) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <div className={cn('contents', className)}>
      {items.map((child, index) =>
        child ? (
          <AnimateOnScroll key={index} delay={baseDelay + index * staggerMs}>
            {child}
          </AnimateOnScroll>
        ) : null,
      )}
    </div>
  )
}
