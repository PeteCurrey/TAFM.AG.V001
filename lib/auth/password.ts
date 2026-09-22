// ─── Password hashing & verification ──────────────────────────────────────────
//
// Cryptographically secure password hashing using Node.js native scrypt.
// Zero external binary dependencies. Constant-time comparison prevents timing attacks.

import crypto from 'node:crypto'

const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024,
  keyLen: 64,
}

/**
 * Hash a plain text password with a randomly generated 16-byte salt.
 * Returns formatted string: `scrypt$N=16384,r=8,p=1$<hex-salt>$<hex-hash>`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_PARAMS.keyLen, SCRYPT_PARAMS, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(`scrypt$N=${SCRYPT_PARAMS.N},r=${SCRYPT_PARAMS.r},p=${SCRYPT_PARAMS.p}$${salt}$${derivedKey.toString('hex')}`)
    })
  })
}

/**
 * Verify a plain text password against a stored scrypt hash string.
 * Uses timingSafeEqual to avoid timing side-channels.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split('$')
    if (parts.length !== 4 || parts[0] !== 'scrypt') {
      return false
    }

    const salt = parts[2]
    const originalHash = Buffer.from(parts[3], 'hex')

    return new Promise((resolve) => {
      crypto.scrypt(password, salt, originalHash.length, SCRYPT_PARAMS, (err, derivedKey) => {
        if (err) return resolve(false)
        if (derivedKey.length !== originalHash.length) return resolve(false)
        resolve(crypto.timingSafeEqual(derivedKey, originalHash))
      })
    })
  } catch {
    return false
  }
}
