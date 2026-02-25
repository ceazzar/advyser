import { describe, expect, it } from "vitest"

import {
  hostHeaderToHostname,
  isLocalHostname,
  pathHasPrefix,
  shouldBypassDisabledAdminRoute,
} from "./mvp-mode"

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

describe("hostHeaderToHostname", () => {
  it("extracts hostname from host header", () => {
    expect(hostHeaderToHostname("localhost:3000")).toBe("localhost")
    expect(hostHeaderToHostname("preview.app.vercel.com")).toBe(
      "preview.app.vercel.com"
    )
  })
})

describe("isLocalHostname", () => {
  it("accepts localhost hosts", () => {
    expect(isLocalHostname("localhost")).toBe(true)
    expect(isLocalHostname("127.0.0.1")).toBe(true)
  })

  it("rejects non-local hosts", () => {
    expect(isLocalHostname("advyser.vercel.app")).toBe(false)
  })
})

describe("shouldBypassDisabledAdminRoute", () => {
  it("allows admin routes for localhost in development when flag enabled", () => {
    expect(
      shouldBypassDisabledAdminRoute({
        pathname: "/admin/intake",
        hostHeader: "localhost:3000",
        nodeEnv: "development",
        enableLocalAdmin: "true",
      })
    ).toBe(true)
  })

  it("does not bypass in production", () => {
    expect(
      shouldBypassDisabledAdminRoute({
        pathname: "/admin/intake",
        hostHeader: "localhost:3000",
        nodeEnv: "production",
        enableLocalAdmin: "true",
      })
    ).toBe(false)
  })

  it("does not bypass non-admin routes", () => {
    expect(
      shouldBypassDisabledAdminRoute({
        pathname: "/search",
        hostHeader: "localhost:3000",
        nodeEnv: "development",
        enableLocalAdmin: "true",
      })
    ).toBe(false)
  })
})
