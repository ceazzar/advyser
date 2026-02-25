export function pathHasPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function hostHeaderToHostname(hostHeader?: string | null): string {
  if (!hostHeader) return ""
  return hostHeader.split(":")[0]?.trim().toLowerCase() || ""
}

export function isLocalHostname(hostname?: string | null): boolean {
  if (!hostname) return false
  return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
    hostname.toLowerCase()
  )
}

export function shouldBypassDisabledAdminRoute(input: {
  pathname: string
  hostHeader?: string | null
  nodeEnv?: string
  enableLocalAdmin?: string
}): boolean {
  if (!pathHasPrefix(input.pathname, "/admin")) return false

  const hostname = hostHeaderToHostname(input.hostHeader)
  return (
    input.nodeEnv === "development" &&
    input.enableLocalAdmin === "true" &&
    isLocalHostname(hostname)
  )
}
