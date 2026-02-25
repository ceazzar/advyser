import { describe, expect, it } from "vitest"

import {
  canRoleAccessPath,
  getDefaultRouteForRole,
  getPostLoginRedirect,
  sanitizeRedirectPath,
} from "./auth-routing"

describe("sanitizeRedirectPath", () => {
  it("accepts safe relative paths", () => {
    expect(sanitizeRedirectPath("/dashboard")).toBe("/dashboard")
    expect(sanitizeRedirectPath("/advisor/leads?id=1")).toBe("/advisor/leads?id=1")
  })

  it("rejects unsafe redirect paths", () => {
    expect(sanitizeRedirectPath("https://evil.com")).toBeNull()
    expect(sanitizeRedirectPath("//evil.com")).toBeNull()
    expect(sanitizeRedirectPath("/../admin")).toBeNull()
    expect(sanitizeRedirectPath("/admin\\hack")).toBeNull()
  })
})

describe("role route access matrix", () => {
  it("enforces consumer route prefix", () => {
    expect(canRoleAccessPath("consumer", "/")).toBe(true)
    expect(canRoleAccessPath("consumer", "/advisors/abc")).toBe(true)
    expect(canRoleAccessPath("consumer", "/request-intro")).toBe(true)
    expect(canRoleAccessPath("consumer", "/dashboard")).toBe(false)
    expect(canRoleAccessPath("consumer", "/advisor")).toBe(false)
    expect(canRoleAccessPath("consumer", "/admin")).toBe(false)
  })

  it("enforces advisor route prefix", () => {
    expect(canRoleAccessPath("advisor", "/advisor")).toBe(true)
    expect(canRoleAccessPath("advisor", "/advisor/clients")).toBe(true)
    expect(canRoleAccessPath("advisor", "/advisory")).toBe(false)
    expect(canRoleAccessPath("advisor", "/dashboard")).toBe(false)
  })

  it("allows admin over protected areas", () => {
    expect(canRoleAccessPath("admin", "/admin")).toBe(true)
    expect(canRoleAccessPath("admin", "/advisor")).toBe(true)
    expect(canRoleAccessPath("admin", "/dashboard")).toBe(true)
    expect(canRoleAccessPath("admin", "/admin-tools")).toBe(false)
  })
})

describe("getPostLoginRedirect", () => {
  it("returns safe requested redirect when role is allowed", () => {
    expect(getPostLoginRedirect("advisor", "/advisor/clients")).toBe("/advisor/clients")
  })

  it("falls back to default route when requested redirect is not allowed", () => {
    expect(getPostLoginRedirect("consumer", "/admin")).toBe("/")
  })

  it("falls back to default route when redirect is unsafe", () => {
    expect(getPostLoginRedirect("admin", "//malicious")).toBe("/admin")
  })

  it("returns default route by role when missing redirect", () => {
    expect(getDefaultRouteForRole("consumer")).toBe("/")
    expect(getDefaultRouteForRole("advisor")).toBe("/advisor")
    expect(getDefaultRouteForRole("admin")).toBe("/admin")
  })
})
