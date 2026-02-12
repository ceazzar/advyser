"use client"

import { usePathname,useRouter } from "next/navigation"
import * as React from "react"

import { signIn as signInAction, signOut as signOutAction } from "@/lib/auth-actions"
import { logger } from "@/lib/logger"
import { createClient } from "@/lib/supabase/client"
import type { UserRole } from "@/types/user"
export { getPostLoginRedirect } from "@/lib/auth-routing"

interface User {
  id: string
  email: string
  role: UserRole
  displayName: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

function mapDbUserToAppUser(dbUser: Record<string, unknown>): User {
  return {
    id: dbUser.id as string,
    email: dbUser.email as string,
    role: dbUser.role as UserRole,
    displayName:
      (dbUser.display_name as string) ||
      `${(dbUser.first_name as string) || ""} ${(dbUser.last_name as string) || ""}`.trim() ||
      (dbUser.email as string),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const supabase = createClient()

    // Check initial session
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single()
        if (error) logger.error("Failed to fetch user profile", { error: error.message })
        if (data) setUser(mapDbUserToAppUser(data))
      }
      setIsLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()
          if (error) logger.error("Failed to fetch user profile", { error: error.message })
          if (data) setUser(mapDbUserToAppUser(data))
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await signInAction(formData)

    if (!result.success) {
      return { success: false, error: result.error || "Login failed" }
    }

    // Server action set auth cookies — browser client reads them automatically
    const supabase = createClient()

    // Validate session with Supabase server (reads token from cookies)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return { success: false, error: "Session could not be established. Please try again." }
    }

    // Fetch user profile from public.users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single()

    if (profileError || !profile) {
      console.error("Profile fetch failed:", profileError?.message)
      return { success: false, error: "Failed to load user profile. Please try again." }
    }

    setUser(mapDbUserToAppUser(profile))
    return { success: true }
  }

  const logout = async () => {
    await signOutAction()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
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
