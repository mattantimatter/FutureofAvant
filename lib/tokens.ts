import { customAlphabet } from 'nanoid'

// URL-safe alphabet for tokens
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Generate a public proposal token (viewer link) — 32 chars
 */
export function generatePublicToken(): string {
  const nanoid = customAlphabet(alphabet, 32)
  return nanoid()
}

/**
 * Generate a signer token (sign link) — 48 chars, higher entropy
 */
export function generateSignToken(): string {
  const nanoid = customAlphabet(alphabet, 48)
  return nanoid()
}
