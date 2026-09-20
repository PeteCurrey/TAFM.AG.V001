// tests/unit/matching/criteria-version.test.ts

import { describe, it, expect } from 'vitest'
import { validateTransition } from '@/lib/matching/opportunity'

// Criteria versioning: the key invariant is that ProviderCriteriaVersion records
// are immutable once created. This test suite validates the opportunity state machine
// that governs the pipeline in which criteria versions are used.

describe('Opportunity state machine — Phase 4 statuses', () => {
  it('allows QUALIFYING → AWAITING_INFORMATION', () => {
    const result = validateTransition('QUALIFYING', 'AWAITING_INFORMATION')
    expect(result.success).toBe(true)
  })

  it('allows AWAITING_INFORMATION → QUALIFYING', () => {
    const result = validateTransition('AWAITING_INFORMATION', 'QUALIFYING')
    expect(result.success).toBe(true)
  })

  it('allows AWAITING_INFORMATION → MATCHED', () => {
    const result = validateTransition('AWAITING_INFORMATION', 'MATCHED')
    expect(result.success).toBe(true)
  })

  it('allows AWAITING_INFORMATION → WITHDRAWN', () => {
    const result = validateTransition('AWAITING_INFORMATION', 'WITHDRAWN')
    expect(result.success).toBe(true)
  })

  it('allows MATCHED → READY_TO_SUBMIT', () => {
    const result = validateTransition('MATCHED', 'READY_TO_SUBMIT')
    expect(result.success).toBe(true)
  })

  it('allows READY_TO_SUBMIT → SUBMITTED', () => {
    const result = validateTransition('READY_TO_SUBMIT', 'SUBMITTED')
    expect(result.success).toBe(true)
  })

  it('allows READY_TO_SUBMIT → MATCHED (go back)', () => {
    const result = validateTransition('READY_TO_SUBMIT', 'MATCHED')
    expect(result.success).toBe(true)
  })

  it('disallows DRAFT → AWAITING_INFORMATION (must qualify first)', () => {
    const result = validateTransition('DRAFT', 'AWAITING_INFORMATION')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('disallows COMPLETED → any forward transition (terminal)', () => {
    const terminals = ['QUALIFYING', 'MATCHED', 'SUBMITTED', 'OFFERED'] as const
    for (const to of terminals) {
      const result = validateTransition('COMPLETED', to)
      expect(result.success).toBe(false)
    }
  })

  it('disallows DECLINED → any transition (terminal)', () => {
    const result = validateTransition('DECLINED', 'QUALIFYING')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/terminal/)
  })

  it('disallows WITHDRAWN → any transition (terminal)', () => {
    const result = validateTransition('WITHDRAWN', 'DRAFT')
    expect(result.success).toBe(false)
  })

  it('error message includes the from and to status', () => {
    const result = validateTransition('COMPLETED', 'QUALIFYING')
    expect(result.error).toContain('COMPLETED')
    expect(result.error).toContain('QUALIFYING')
  })
})
