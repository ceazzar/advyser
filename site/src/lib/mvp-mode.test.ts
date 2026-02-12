import { describe, expect, it } from "vitest"

import { pathHasPrefix } from "./mvp-mode"

describe("pathHasPrefix", () => {
  it("matches exact and nested routes only", () => {
    expect(pathHasPrefix("/advisor", "/advisor")).toBe(true)
    expect(pathHasPrefix("/advisor/clients", "/advisor")).toBe(true)
    expect(pathHasPrefix("/advisor-resources", "/advisor")).toBe(false)
  })
  it("matches root path exactly", () => {
    expect(pathHasPrefix("/", "/")).toBe(true)
    expect(pathHasPrefix("/search", "/")).toBe(false)
  })
})
