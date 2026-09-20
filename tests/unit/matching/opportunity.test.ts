import { describe, it, expect } from 'vitest'
import {
  validateTransition,
  availableTransitions,
  isTerminalStatus,
  buildStatusHistoryEntry,
  type OpportunityStatus,
} from '@/lib/matching/opportunity'

describe('validateTransition', () => {
  it('allows valid forward transitions', () => {
    expect(validateTransition('DRAFT',        'QUALIFYING'  ).success).toBe(true)
    expect(validateTransition('QUALIFYING',   'MATCHED'     ).success).toBe(true)
    expect(validateTransition('MATCHED',      'SUBMITTED'   ).success).toBe(true)
    expect(validateTransition('SUBMITTED',    'UNDER_REVIEW').success).toBe(true)
    expect(validateTransition('UNDER_REVIEW', 'OFFERED'     ).success).toBe(true)
    expect(validateTransition('OFFERED',      'COMPLETED'   ).success).toBe(true)
  })

  it('allows withdrawal from active statuses', () => {
    expect(validateTransition('DRAFT',      'WITHDRAWN').success).toBe(true)
    expect(validateTransition('QUALIFYING', 'WITHDRAWN').success).toBe(true)
    expect(validateTransition('MATCHED',    'WITHDRAWN').success).toBe(true)
    expect(validateTransition('OFFERED',    'WITHDRAWN').success).toBe(true)
  })

  it('rejects transitions from terminal statuses', () => {
    expect(validateTransition('COMPLETED', 'QUALIFYING').success).toBe(false)
    expect(validateTransition('DECLINED',  'QUALIFYING').success).toBe(false)
    expect(validateTransition('WITHDRAWN', 'QUALIFYING').success).toBe(false)
  })

  it('rejects invalid skips', () => {
    expect(validateTransition('DRAFT',    'COMPLETED'   ).success).toBe(false)
    expect(validateTransition('DRAFT',    'OFFERED'     ).success).toBe(false)
    expect(validateTransition('MATCHING', 'SUBMITTED'   ).success).toBe(false)
  })

  it('returns an error message on invalid transition', () => {
    const result = validateTransition('COMPLETED', 'DRAFT')
    expect(result.success).toBe(false)
    expect(result.error).toContain('COMPLETED')
    expect(result.error).toContain('terminal')
  })
})

describe('isTerminalStatus', () => {
  it('identifies terminal statuses', () => {
    expect(isTerminalStatus('COMPLETED')).toBe(true)
    expect(isTerminalStatus('DECLINED' )).toBe(true)
    expect(isTerminalStatus('WITHDRAWN')).toBe(true)
  })

  it('identifies non-terminal statuses', () => {
    expect(isTerminalStatus('DRAFT'       )).toBe(false)
    expect(isTerminalStatus('QUALIFYING'  )).toBe(false)
    expect(isTerminalStatus('UNDER_REVIEW')).toBe(false)
  })
})

describe('availableTransitions', () => {
  it('returns valid next statuses for DRAFT', () => {
    const next = availableTransitions('DRAFT')
    expect(next).toContain('QUALIFYING')
    expect(next).toContain('WITHDRAWN')
  })

  it('returns empty array for terminal statuses', () => {
    expect(availableTransitions('COMPLETED')).toHaveLength(0)
    expect(availableTransitions('DECLINED' )).toHaveLength(0)
  })
})

describe('buildStatusHistoryEntry', () => {
  it('produces a valid history entry', () => {
    const entry = buildStatusHistoryEntry('DRAFT', 'QUALIFYING', {
      actorId:  'user-123',
      actorType: 'USER',
      reason:   'Initial qualification',
    })
    expect(entry.from    ).toBe('DRAFT')
    expect(entry.to      ).toBe('QUALIFYING')
    expect(entry.actorId ).toBe('user-123')
    expect(entry.reason  ).toBe('Initial qualification')
    expect(new Date(entry.at).getTime()).toBeLessThanOrEqual(Date.now())
  })

  it('defaults actorType to USER', () => {
    const entry = buildStatusHistoryEntry('QUALIFYING', 'MATCHED')
    expect(entry.actorType).toBe('USER')
  })
})
