const EDGE_QUOTES_PATTERN = /^[\s"'`\u2018\u2019\u201c\u201d]+|[\s"'`\u2018\u2019\u201c\u201d]+$/g

/**
 * Normalizes user-entered emails before auth requests.
 * Trims whitespace, strips accidental wrapping quotes, and lowercases.
 */
export function normalizeEmail(value: string): string {
  return value.trim().replace(EDGE_QUOTES_PATTERN, "").trim().toLowerCase()
}

export function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
