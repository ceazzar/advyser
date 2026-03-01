import type { AdminLocation, DuplicateCandidate } from "@/types/admin-intake"

export interface DuplicateBusinessContext {
  id: string
  legalName: string | null
  tradingName: string | null
  abn: string | null
  website: string | null
  location: AdminLocation | null
}

export interface DuplicateScoreBreakdown {
  score: number
  nameSimilarity: number
  isFlagged: boolean
  matchedSignals: string[]
  samePostcode: boolean
  domainMatch: boolean
  abnMatch: boolean
}

const NAME_STOP_WORDS = [
  "pty",
  "ltd",
  "limited",
  "the",
  "and",
  "co",
  "company",
  "group",
]

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

export function normalizeBusinessName(value: string | null | undefined): string {
  if (!value) return ""

  const normalized = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")

  const withoutStopWords = collapseWhitespace(normalized)
    .split(" ")
    .filter((part) => part && !NAME_STOP_WORDS.includes(part))
    .join(" ")

  return collapseWhitespace(withoutStopWords)
}

export function normalizeWebsiteDomain(value: string | null | undefined): string | null {
  if (!value) return null
  const raw = value.trim().toLowerCase()
  if (!raw) return null

  const withProtocol = raw.includes("://") ? raw : `https://${raw}`

  try {
    const url = new URL(withProtocol)
    const hostname = url.hostname.replace(/^www\./, "")
    return hostname || null
  } catch {
    // Last-resort fallback for malformed URLs.
    const candidate = raw
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#]/)[0]
      .trim()

    return candidate || null
  }
}

function buildTrigramCounts(value: string): Map<string, number> {
  const counts = new Map<string, number>()
  if (!value) return counts

  const padded = `  ${value} `
  for (let index = 0; index <= padded.length - 3; index += 1) {
    const trigram = padded.slice(index, index + 3)
    counts.set(trigram, (counts.get(trigram) || 0) + 1)
  }

  return counts
}

// Mirrors pg_trgm similarity: (2 * intersection) / (size_a + size_b) for trigram multisets.
export function trigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0

  const aCounts = buildTrigramCounts(a)
  const bCounts = buildTrigramCounts(b)

  let intersection = 0
  let aTotal = 0
  let bTotal = 0

  for (const count of aCounts.values()) aTotal += count
  for (const count of bCounts.values()) bTotal += count

  for (const [key, aCount] of aCounts.entries()) {
    const bCount = bCounts.get(key)
    if (!bCount) continue
    intersection += Math.min(aCount, bCount)
  }

  if (aTotal + bTotal === 0) return 0

  return (2 * intersection) / (aTotal + bTotal)
}

function getDisplayName(input: DuplicateBusinessContext): string {
  return input.tradingName || input.legalName || "Unknown"
}

function normalizeAbn(value: string | null | undefined): string | null {
  const normalized = (value || "").replace(/\D/g, "")
  return normalized.length === 11 ? normalized : null
}

function normalizedPostcode(location: AdminLocation | null): string | null {
  const postcode = location?.postcode?.trim()
  return postcode && /^\d{4}$/.test(postcode) ? postcode : null
}

export function computeDuplicateScore(
  source: DuplicateBusinessContext,
  candidate: DuplicateBusinessContext
): DuplicateScoreBreakdown {
  const sourceAbn = normalizeAbn(source.abn)
  const candidateAbn = normalizeAbn(candidate.abn)
  const sourceDomain = normalizeWebsiteDomain(source.website)
  const candidateDomain = normalizeWebsiteDomain(candidate.website)

  const sourceName = normalizeBusinessName(getDisplayName(source))
  const candidateName = normalizeBusinessName(getDisplayName(candidate))

  const sourcePostcode = normalizedPostcode(source.location)
  const candidatePostcode = normalizedPostcode(candidate.location)

  const abnMatch = !!sourceAbn && sourceAbn === candidateAbn
  const domainMatch = !!sourceDomain && sourceDomain === candidateDomain
  const nameSimilarity = trigramSimilarity(sourceName, candidateName)
  const samePostcode = !!sourcePostcode && sourcePostcode === candidatePostcode

  const score =
    (abnMatch ? 100 : 0) +
    (domainMatch ? 70 : 0) +
    Math.round(nameSimilarity * 40) +
    (samePostcode ? 15 : 0)

  const matchedSignals = [
    abnMatch ? "abn" : null,
    domainMatch ? "domain" : null,
    nameSimilarity > 0 ? "name_similarity" : null,
    samePostcode ? "postcode" : null,
  ].filter((value): value is string => Boolean(value))

  return {
    score,
    nameSimilarity,
    isFlagged: abnMatch || score >= 70,
    matchedSignals,
    samePostcode,
    domainMatch,
    abnMatch,
  }
}

export function buildDuplicateCandidates(
  targetBusiness: DuplicateBusinessContext,
  pool: DuplicateBusinessContext[]
): DuplicateCandidate[] {
  return pool
    .filter((candidate) => candidate.id !== targetBusiness.id)
    .map((candidate) => {
      const score = computeDuplicateScore(targetBusiness, candidate)
      return {
        businessId: candidate.id,
        legalName: candidate.legalName,
        tradingName: candidate.tradingName,
        displayName: candidate.tradingName || candidate.legalName || "Unknown",
        abn: normalizeAbn(candidate.abn),
        website: candidate.website,
        websiteDomain: normalizeWebsiteDomain(candidate.website),
        location: candidate.location,
        score: score.score,
        nameSimilarity: score.nameSimilarity,
        matchedSignals: score.matchedSignals,
        isFlagged: score.isFlagged,
        samePostcode: score.samePostcode,
        domainMatch: score.domainMatch,
        abnMatch: score.abnMatch,
      }
    })
    .filter((candidate) => candidate.isFlagged)
    .sort((a, b) => b.score - a.score)
}

export function buildDuplicateSummary(
  businesses: DuplicateBusinessContext[]
): Map<string, { count: number; highestScore: number | null }> {
  const summary = new Map<string, { count: number; highestScore: number | null }>()

  for (const business of businesses) {
    const candidates = buildDuplicateCandidates(business, businesses)
    summary.set(business.id, {
      count: candidates.length,
      highestScore: candidates[0]?.score ?? null,
    })
  }

  return summary
}
