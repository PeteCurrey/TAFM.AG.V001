import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth/password'

describe('Password Hashing & Verification (scrypt)', () => {
  it('hashes a password and verifies it successfully', async () => {
    const raw = 'SecureCommercialPass2026!'
    const hash = await hashPassword(raw)

    expect(hash).toContain('scrypt$')
    const isValid = await verifyPassword(raw, hash)
    expect(isValid).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const raw = 'CorrectPassword123'
    const wrong = 'WrongPassword456'
    const hash = await hashPassword(raw)

    const isValid = await verifyPassword(wrong, hash)
    expect(isValid).toBe(false)
  })

  it('generates unique salts and hashes for identical passwords', async () => {
    const raw = 'IdenticalPassword123'
    const hash1 = await hashPassword(raw)
    const hash2 = await hashPassword(raw)

    expect(hash1).not.toBe(hash2)
    expect(await verifyPassword(raw, hash1)).toBe(true)
    expect(await verifyPassword(raw, hash2)).toBe(true)
  })

  it('safely handles corrupted or malformed hash strings without throwing', async () => {
    expect(await verifyPassword('test', 'not-a-valid-hash')).toBe(false)
    expect(await verifyPassword('test', 'scrypt$invalid')).toBe(false)
    expect(await verifyPassword('test', '')).toBe(false)
  })
})
