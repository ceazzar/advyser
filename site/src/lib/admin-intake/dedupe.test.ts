import { describe, expect, it } from "vitest"

import {
  buildDuplicateCandidates,
  computeDuplicateScore,
  type DuplicateBusinessContext,
  normalizeBusinessName,
  normalizeWebsiteDomain,
  trigramSimilarity,
} from "./dedupe"

function makeBusiness(overrides: Partial<DuplicateBusinessContext>): DuplicateBusinessContext {
  return {
    id: overrides.id || crypto.randomUUID(),
    legalName: overrides.legalName || null,
    tradingName: overrides.tradingName || null,
    abn: overrides.abn || null,
    website: overrides.website || null,
    location: overrides.location || null,
  }
}

describe("normalizeWebsiteDomain", () => {
  it("normalizes protocol, www, and path segments", () => {
    expect(normalizeWebsiteDomain("https://www.Example.com/path?q=1")).toBe(
      "example.com"
    )
  })
})

describe("normalizeBusinessName", () => {
  it("removes common company stop words", () => {
    expect(normalizeBusinessName("Alpha Finance Pty Ltd")).toBe("alpha finance")
  })
})

describe("trigramSimilarity", () => {
  it("returns higher similarity for close names", () => {
    const similar = trigramSimilarity("alpha finance", "alpha finances")
    const different = trigramSimilarity("alpha finance", "zeta builders")

    expect(similar).toBeGreaterThan(different)
  })
})

describe("computeDuplicateScore", () => {
  it("applies abn and domain signals", () => {
    const source = makeBusiness({
      id: "a",
      legalName: "Alpha Finance",
      abn: "12345678901",
      website: "https://alpha.com.au",
      location: { suburb: "Melbourne", state: "VIC", postcode: "3000" },
    })

    const candidate = makeBusiness({
      id: "b",
      legalName: "Alpha Finance Group",
      abn: "12345678901",
      website: "http://www.alpha.com.au/team",
      location: { suburb: "Southbank", state: "VIC", postcode: "3000" },
    })

    const score = computeDuplicateScore(source, candidate)

    expect(score.abnMatch).toBe(true)
    expect(score.domainMatch).toBe(true)
    expect(score.samePostcode).toBe(true)
    expect(score.score).toBeGreaterThanOrEqual(185)
    expect(score.isFlagged).toBe(true)
  })

  it("does not flag weakly similar records", () => {
    const source = makeBusiness({
      id: "a",
      legalName: "Alpha Finance",
      website: "https://alpha.com.au",
      location: { suburb: "Melbourne", state: "VIC", postcode: "3000" },
    })

    const candidate = makeBusiness({
      id: "b",
      legalName: "Northside Plumbing",
      website: "https://northsideplumbing.com.au",
      location: { suburb: "Geelong", state: "VIC", postcode: "3220" },
    })

    const score = computeDuplicateScore(source, candidate)

    expect(score.isFlagged).toBe(false)
  })
})

describe("buildDuplicateCandidates", () => {
  it("returns only flagged candidates in descending score order", () => {
    const source = makeBusiness({
      id: "source",
      tradingName: "Alpha Finance",
      abn: "12345678901",
      website: "https://alpha.com.au",
      location: { suburb: "Melbourne", state: "VIC", postcode: "3000" },
    })

    const strong = makeBusiness({
      id: "strong",
      legalName: "Alpha Finance Group",
      abn: "12345678901",
      website: "https://www.alpha.com.au",
      location: { suburb: "Melbourne", state: "VIC", postcode: "3000" },
    })

    const weak = makeBusiness({
      id: "weak",
      legalName: "Other Business",
      website: "https://other.com",
      location: { suburb: "Sydney", state: "NSW", postcode: "2000" },
    })

    const result = buildDuplicateCandidates(source, [source, weak, strong])

    expect(result.map((item) => item.businessId)).toEqual(["strong"])
  })
})
