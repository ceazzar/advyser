"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Check, X } from "lucide-react"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

type ResetStep = "request" | "sent" | "reset" | "success"

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

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  // Determine initial step based on token presence
  const [step, setStep] = React.useState<ResetStep>(token ? "reset" : "request")

  // Request step state
  const [email, setEmail] = React.useState("")
  const [emailError, setEmailError] = React.useState("")
  const [isRequestLoading, setIsRequestLoading] = React.useState(false)

  // Reset step state
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState("")
  const [isResetLoading, setIsResetLoading] = React.useState(false)

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isPasswordValid =
    passwordRequirements.minLength &&
    passwordRequirements.hasUppercase &&
    passwordRequirements.hasLowercase &&
    passwordRequirements.hasNumber &&
    passwordsMatch

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return undefined
  }

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    setIsRequestLoading(true)
    setEmailError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsRequestLoading(false)
    setStep("sent")
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setPasswordError("Please ensure your password meets all requirements")
      return
    }

    setIsResetLoading(true)
    setPasswordError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsResetLoading(false)
    setStep("success")

    // Redirect to login after success
    setTimeout(() => {
      router.push("/login?reset=true")
    }, 3000)
  }

  const getLayoutProps = () => {
    switch (step) {
      case "request":
        return {
          title: "Reset Your Password",
          description: "Enter your email and we'll send you a reset link",
        }
      case "sent":
        return {
          title: "Check Your Email",
          description: "We've sent a password reset link to your email",
        }
      case "reset":
        return {
          title: "Create New Password",
          description: "Enter a new password for your account",
        }
      case "success":
        return {
          title: "Password Reset Successfully",
          description: "Your password has been updated",
        }
    }
  }

  return (
    <AuthLayout {...getLayoutProps()}>
      <div className="space-y-6">
        {/* Step: Request Reset */}
        {step === "request" && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="size-8 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError("")
                }}
                leftIcon={<Mail className="size-4" />}
                error={!!emailError}
                disabled={isRequestLoading}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-sm text-destructive" role="alert">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isRequestLoading}
            >
              {isRequestLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* Step: Email Sent */}
        {step === "sent" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                <Mail className="size-8 text-green-600" />
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="size-4 text-green-600" />
              <AlertTitle className="text-green-800">Email Sent</AlertTitle>
              <AlertDescription className="text-green-700">
                If an account exists for <span className="font-medium">{email}</span>, you will receive a password reset link shortly.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="font-medium text-foreground text-sm mb-2">What&apos;s next?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>1. Check your email inbox (and spam folder)</li>
                <li>2. Click the reset link in the email</li>
                <li>3. Create your new password</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep("request")}
              >
                Try Different Email
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Step: Reset Password */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="size-8 text-primary" />
              </div>
            </div>

            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="size-4" />}
                  disabled={isResetLoading}
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="size-4" />}
                  disabled={isResetLoading}
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isPasswordValid}
              loading={isResetLoading}
            >
              {isResetLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="size-10 text-green-600" />
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="size-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your password has been reset successfully. You can now log in with your new password.
              </AlertDescription>
            </Alert>

            <p className="text-center text-sm text-muted-foreground">
              Redirecting to login...
            </p>

            <Button asChild className="w-full" size="lg">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <AuthLayout title="Reset Your Password" description="Loading...">
          <div className="flex justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  )
}
