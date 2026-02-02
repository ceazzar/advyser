"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

// Demo users for testing the end-to-end workflow
// In production, this would be replaced with real authentication
const DEMO_USERS = {
  "consumer@user.com": {
    id: "demo-consumer-001",
    email: "consumer@user.com",
    password: "consumer123",
    role: "consumer" as const,
    displayName: "Demo Consumer",
  },
  "advisor@user.com": {
    id: "demo-advisor-001",
    email: "advisor@user.com",
    password: "advisor123",
    role: "advisor" as const,
    displayName: "Sarah Mitchell, CFP",
    advisorProfile: {
      firm: "Mitchell Financial Planning",
      yearsExperience: 12,
      specializations: ["Retirement Planning", "Wealth Management"],
    },
  },
  "admin@user.com": {
    id: "demo-admin-001",
    email: "admin@user.com",
    password: "admin123",
    role: "admin" as const,
    displayName: "Admin User",
  },
} as const

type UserRole = "consumer" | "advisor" | "admin"

interface User {
  id: string
  email: string
  role: UserRole
  displayName: string
  advisorProfile?: {
    firm: string
    yearsExperience: number
    specializations: readonly string[] | string[]
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isDemoMode: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "advyser_demo_auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  // Restore session from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const normalizedEmail = email.toLowerCase().trim()
    const demoUser = DEMO_USERS[normalizedEmail as keyof typeof DEMO_USERS]

    if (!demoUser) {
      return { success: false, error: "Invalid email or password" }
    }

    if (demoUser.password !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create user object without password
    const { password: _, ...userWithoutPassword } = demoUser
    const userToStore: User = {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      displayName: userWithoutPassword.displayName,
      advisorProfile: "advisorProfile" in userWithoutPassword
        ? {
            firm: userWithoutPassword.advisorProfile.firm,
            yearsExperience: userWithoutPassword.advisorProfile.yearsExperience,
            specializations: [...userWithoutPassword.advisorProfile.specializations],
          }
        : undefined,
    }
    setUser(userToStore)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userToStore))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook for protected routes - redirects to login if not authenticated
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = React.useRef(false)

  React.useEffect(() => {
    // Reset redirect flag when pathname changes (user navigated)
    hasRedirected.current = false
  }, [pathname])

  React.useEffect(() => {
    if (isLoading || hasRedirected.current) return

    if (!user) {
      // Redirect to login with return URL
      hasRedirected.current = true
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      hasRedirected.current = true
      const dashboardRoutes: Record<UserRole, string> = {
        consumer: "/dashboard",
        advisor: "/advisor",
        admin: "/admin",
      }
      router.push(dashboardRoutes[user.role])
    }
  }, [user, isLoading, router, pathname, allowedRoles])

  return { user, isLoading, isAuthorized: user && (!allowedRoles || allowedRoles.includes(user.role)) }
}

// Get the appropriate redirect path after login based on user role
export function getPostLoginRedirect(role: UserRole, requestedRedirect?: string): string {
  // Default redirects by role
  const defaultRoutes: Record<UserRole, string> = {
    consumer: "/dashboard",
    advisor: "/advisor",
    admin: "/admin",
  }

  // Validate and use requested redirect if safe
  if (requestedRedirect) {
    try {
      // Decode URL to catch encoded bypasses like %2F%2F
      const decodedRedirect = decodeURIComponent(requestedRedirect)

      // Security: Only allow relative paths starting with single slash
      // Reject absolute URLs, protocol-relative URLs, and path traversal
      const isSafeRelativePath =
        decodedRedirect.startsWith("/") &&
        !decodedRedirect.startsWith("//") &&
        !decodedRedirect.includes("..") &&
        !decodedRedirect.includes("\\") &&
        !decodedRedirect.includes("\n") &&
        !decodedRedirect.includes("\r")

      if (!isSafeRelativePath) {
        return defaultRoutes[role]
      }

      // Check if redirect is valid for this role
      const rolePathPrefixes: Record<UserRole, string[]> = {
        consumer: ["/dashboard"],
        advisor: ["/advisor"],
        admin: ["/admin", "/dashboard", "/advisor"],
      }
      const validPrefixes = rolePathPrefixes[role]
      if (validPrefixes.some((prefix) => decodedRedirect.startsWith(prefix))) {
        return decodedRedirect
      }
    } catch {
      // Invalid URL encoding, use default
      return defaultRoutes[role]
    }
  }

  return defaultRoutes[role]
}
