"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, Check, X } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { updatePassword } from "@/lib/auth-actions"
import { cn } from "@/lib/utils"

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

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [hasValidSession, setHasValidSession] = React.useState<boolean | null>(null)

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }
  const isFormValid = password.length >= 8 && passwordsMatch

  // Check for valid recovery session on mount
  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setHasValidSession(true)
      } else {
        setHasValidSession(false)
        router.push("/forgot-password")
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    setSubmitError(null)

    const formData = new FormData()
    formData.append("password", password)

    try {
      await updatePassword(formData)
      // updatePassword redirects on success, so this line only runs on error
    } catch {
      setIsSubmitting(false)
      setSubmitError("Failed to update password. Please try again.")
    }
  }

  if (hasValidSession === null) {
    return (
      <PublicLayout>
        <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-6">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </section>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <KeyRound className="size-7" />
              </div>
              <CardTitle className="text-2xl">Set New Password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
                    {submitError}
                  </div>
                )}

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">
                    Back to login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  )
}
