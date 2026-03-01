"use client"

import { Check, Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"
import { signUp } from "@/lib/auth-actions"
import { normalizeEmail } from "@/lib/email"
import { cn } from "@/lib/utils"

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

type AccountType = "consumer" | "advisor"

interface PasswordStrength {
  score: number
  label: string
  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" }
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" }
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" }
  if (score <= 4) return { score, label: "Strong", color: "bg-primary" }
  return { score, label: "Very Strong", color: "bg-green-500" }
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  const bars = 5

  if (!password) return null

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              i < strength.score ? strength.color : "bg-border"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", strength.score <= 1 ? "text-destructive" : "text-muted-foreground")}>
        Password strength: {strength.label}
      </p>
    </div>
  )
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="size-3.5 text-primary" />
      ) : (
        <X className="size-3.5 text-muted-foreground" />
      )}
      <span className={cn(met ? "text-foreground" : "text-muted-foreground")}>{text}</span>
    </div>
  )
}

export default function SignupPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || ""
  const prefilledEmail = searchParams.get("email") || ""
  const [accountType, setAccountType] = React.useState<AccountType>("consumer")
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState(prefilledEmail)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [signupError, setSignupError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (prefilledEmail) {
      setEmail(normalizeEmail(prefilledEmail))
    }
  }, [prefilledEmail])

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isFormValid =
    fullName.trim().length > 0 &&
    normalizeEmail(email).length > 0 &&
    password.length >= 8 &&
    passwordsMatch &&
    agreedToTerms

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setSignupError(null)
    const normalizedEmail = normalizeEmail(email)

    const formData = new FormData()
    formData.append("email", normalizedEmail)
    formData.append("password", password)
    formData.append("fullName", fullName)
    formData.append("accountType", accountType)
    if (redirect) {
      formData.append("redirect", redirect)
    }

    const result = await signUp(formData)
    setIsLoading(false)

    if (!result.success) {
      setSignupError(result.error || "Signup failed")
      return
    }

    router.push(`/verify?email=${encodeURIComponent(normalizedEmail)}`)
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} signup coming soon`, {
      description: "Social authentication will be available in a future update.",
    })
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Get started with Advyser today"
    >
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

        {/* Signup Error */}
        {signupError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
            {signupError}
          </div>
        )}

        {/* Account Type Selector */}
        <div className="space-y-3">
          <Label>I am...</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType("consumer")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200",
                accountType === "consumer"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition-colors",
                  accountType === "consumer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  accountType === "consumer" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Looking for an advisor
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("advisor")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200",
                accountType === "advisor"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition-colors",
                  accountType === "advisor"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  accountType === "advisor" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                I&apos;m an advisor
              </span>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <PasswordStrengthIndicator password={password} />
          {password.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <PasswordRequirement met={passwordRequirements.minLength} text="At least 8 characters" />
              <PasswordRequirement met={passwordRequirements.hasUppercase} text="One uppercase letter" />
              <PasswordRequirement met={passwordRequirements.hasLowercase} text="One lowercase letter" />
              <PasswordRequirement met={passwordRequirements.hasNumber} text="One number" />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              error={confirmPassword.length > 0 && !passwordsMatch}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-destructive" role="alert">Passwords do not match</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Signup Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isFormValid}
          loading={isLoading}
        >
          Create account
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
