"use client"

import { Eye, EyeOff, Lock,Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"
import { getPostLoginRedirect,useAuth } from "@/lib/auth-context"
import { isLikelyEmail, normalizeEmail } from "@/lib/email"

// Google "G" logo SVG
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

// Apple logo SVG
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

interface FormErrors {
  email?: string
  password?: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user } = useAuth()

  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState({
    email: false,
    password: false,
  })

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const redirect = searchParams.get("redirect")
      router.push(getPostLoginRedirect(user.role, redirect || undefined))
    }
  }, [user, router, searchParams])

  const validateEmail = (email: string): string | undefined => {
    const normalized = normalizeEmail(email)
    if (!normalized) {
      return "Email is required"
    }
    if (!isLikelyEmail(normalized)) {
      return "Please enter a valid email address"
    }
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters"
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    }
    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }))
    } else if (field === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(formData.password) }))
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (touched[field]) {
      if (field === "email") {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }))
      } else if (field === "password") {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setLoginError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    const result = await login(normalizeEmail(formData.email), formData.password)
    setIsLoading(false)

    if (!result.success) {
      setLoginError(result.error || "Login failed")
      return
    }

    // Redirect will happen via the useEffect when user state updates
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon`, {
      description: "Social authentication will be available in a future update.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
          onClick={() => handleSocialLogin("Google")}
        >
          <GoogleIcon className="size-5 mr-2" />
          Continue with Google
        </Button>
        <Button
          type="button"
          size="lg"
          className="w-full bg-black hover:bg-gray-900 text-white"
          disabled={isLoading}
          onClick={() => handleSocialLogin("Apple")}
        >
          <AppleIcon className="size-5 mr-2" />
          Continue with Apple
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      {/* Login Error */}
      {loginError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
          {loginError}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={touched.email && !!errors.email}
          leftIcon={<Mail className="size-4" />}
          disabled={isLoading}
          autoComplete="email"
        />
        {touched.email && errors.email && (
          <p className="text-sm text-destructive" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            error={touched.password && !!errors.password}
            leftIcon={<Lock className="size-4" />}
            disabled={isLoading}
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="text-sm text-destructive" role="alert">{errors.password}</p>
        )}
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <React.Suspense
        fallback={
          <div className="flex justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </AuthLayout>
  )
}
