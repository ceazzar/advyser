import type { UserRole } from "@/types/user"

const ROLE_DEFAULT_ROUTE: Record<UserRole, string> = {
  consumer: "/dashboard",
  advisor: "/advisor",
  admin: "/admin",
}

const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  consumer: ["/dashboard"],
  advisor: ["/advisor"],
  admin: ["/admin", "/advisor", "/dashboard"],
}

export function sanitizeRedirectPath(rawPath?: string | null): string | null {
  if (!rawPath) return null

  try {
    const decoded = decodeURIComponent(rawPath)
    const isSafeRelativePath =
      decoded.startsWith("/") &&
      !decoded.startsWith("//") &&
      !decoded.includes("..") &&
      !decoded.includes("\\") &&
      !decoded.includes("\n") &&
      !decoded.includes("\r")

    if (!isSafeRelativePath) return null
    return decoded
  } catch {
    return null
  }
}

export function getDefaultRouteForRole(role: UserRole): string {
  return ROLE_DEFAULT_ROUTE[role]
}

export function canRoleAccessPath(role: UserRole, pathname: string): boolean {
  return ROLE_ALLOWED_PREFIXES[role].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function getPostLoginRedirect(
  role: UserRole,
  requestedRedirect?: string
): string {
  const safePath = sanitizeRedirectPath(requestedRedirect)
  if (safePath && canRoleAccessPath(role, safePath)) {
    return safePath
  }
  return getDefaultRouteForRole(role)
}
