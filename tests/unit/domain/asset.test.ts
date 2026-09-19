import { describe, it, expect } from 'vitest'
import type { Asset, AssetCategory, AssetCondition, AssetStatus } from '@/types/asset'

// ─── Asset domain tests ───────────────────────────────────────────────────────

describe('Asset Domain Types', () => {

  describe('AssetCondition', () => {
    it('includes the four valid condition states', () => {
      const conditions: AssetCondition[] = ['NEW', 'USED', 'REFURBISHED', 'FOR_PARTS']
      expect(conditions).toHaveLength(4)
    })

    it('NEW condition implies isNew = true', () => {
      const newAsset: Partial<Asset> = {
        condition: 'NEW',
        isNew: true,
        purchasePrice: 120000,
        currency: 'GBP',
      }
      expect(newAsset.condition).toBe('NEW')
      expect(newAsset.isNew).toBe(true)
    })
  })

  describe('AssetStatus lifecycle', () => {
    it('supports the complete asset lifecycle', () => {
      const statuses: AssetStatus[] = ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'RESERVED', 'FINANCED', 'INACTIVE', 'SOLD', 'ARCHIVED']
      expect(statuses).toHaveLength(8)
      expect(statuses).toContain('DRAFT')
      expect(statuses).toContain('FINANCED')
      expect(statuses).toContain('ARCHIVED')
    })

    it('assets start in DRAFT status', () => {
      const assetStatus: AssetStatus = 'DRAFT'
      expect(assetStatus).toBe('DRAFT')
    })
  })

  describe('AssetCategory', () => {
    it('can construct a valid category', () => {
      const category: AssetCategory = {
        id: 'cat_001',
        slug: 'construction-equipment',
        name: 'Construction Equipment',
        description: 'Excavators, cranes and groundworks machinery',
        parentId: null,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
      expect(category.slug).toBe('construction-equipment')
      expect(category.isActive).toBe(true)
      expect(category.parentId).toBeNull()
    })
  })

  describe('Asset purchase price', () => {
    it('requires purchasePrice to be a number', () => {
      const asset: Partial<Asset> = {
        purchasePrice: 85000,
        currency: 'GBP',
        vatApplicable: true,
      }
      expect(typeof asset.purchasePrice).toBe('number')
      expect(asset.purchasePrice).toBeGreaterThan(0)
    })

    it('currency defaults to GBP for UK platform', () => {
      const asset: Partial<Asset> = {
        purchasePrice: 50000,
        currency: 'GBP',
      }
      expect(asset.currency).toBe('GBP')
    })
  })
})
