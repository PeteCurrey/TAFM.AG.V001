// tests/unit/data/normalise.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toSlug } from '@/lib/data/normalise'

// Note: resolveManufacturer and findDuplicate* require a DB connection
// and are tested at integration level. Only the pure functions are unit tested here.

describe('toSlug', () => {
  it('lowercases and hyphenates words', () => {
    expect(toSlug('JCB 3CX Backhoe Loader')).toBe('jcb-3cx-backhoe-loader')
  })

  it('removes special characters', () => {
    expect(toSlug('Caterpillar (CAT) 320D')).toBe('caterpillar-cat-320d')
  })

  it('collapses multiple spaces', () => {
    expect(toSlug('Komatsu  PC200')).toBe('komatsu-pc200')
  })

  it('trims leading and trailing hyphens', () => {
    expect(toSlug('  Liebherr R 926  ')).toBe('liebherr-r-926')
  })

  it('handles single word', () => {
    expect(toSlug('Volvo')).toBe('volvo')
  })

  it('handles already-slugged input', () => {
    expect(toSlug('jcb-3cx')).toBe('jcb-3cx')
  })

  it('collapses consecutive hyphens', () => {
    expect(toSlug('A--B')).toBe('a-b')
  })

  it('handles ampersand', () => {
    expect(toSlug('Plant & Machinery')).toBe('plant-machinery')
  })
})
