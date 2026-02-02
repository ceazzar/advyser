"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

type VerificationState = "pending" | "verifying" | "success" | "error"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "user@example.com"

  const [otpValue, setOtpValue] = React.useState("")
  const [verificationState, setVerificationState] = React.useState<VerificationState>("pending")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isResending, setIsResending] = React.useState(false)
  const [resendCooldown, setResendCooldown] = React.useState(0)
  const [resendSuccess, setResendSuccess] = React.useState(false)

  // Mounted ref to prevent state updates on unmounted component (memory leak fix)
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Handle verify - using useCallback to avoid variable access before declaration
  const handleVerify = React.useCallback(async () => {
    if (!mountedRef.current) return
    setVerificationState("verifying")
    setErrorMessage("")

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!mountedRef.current) return // Guard after async

    // Simulate success/failure (use "123456" as valid code for demo)
    if (otpValue === "123456") {
      setVerificationState("success")
      // Redirect after success
      setTimeout(() => {
        if (mountedRef.current) {
          router.push("/login?verified=true")
        }
      }, 2000)
    } else {
      setVerificationState("error")
      setErrorMessage("Invalid verification code. Please try again.")
      setOtpValue("")
    }
  }, [otpValue, router])

  // Cooldown timer for resend
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setResendCooldown(resendCooldown - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Auto-verify when OTP is complete
  React.useEffect(() => {
    if (otpValue.length === 6 && mountedRef.current) {
      handleVerify()
    }
  }, [otpValue, handleVerify])

  const handleResend = async () => {
    if (!mountedRef.current) return
    setIsResending(true)
    setResendSuccess(false)
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!mountedRef.current) return // Guard after async

    setIsResending(false)
    setResendSuccess(true)
    setResendCooldown(60) // 60 second cooldown

    // Clear success message after 5 seconds
    setTimeout(() => {
      if (mountedRef.current) {
        setResendSuccess(false)
      }
    }, 5000)
  }

  const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split("@")
    if (!localPart || !domain) return email
    const maskedLocal = localPart.slice(0, 2) + "***" + localPart.slice(-1)
    return `${maskedLocal}@${domain}`
  }

  return (
    <AuthLayout
      title={verificationState === "success" ? "Email Verified!" : "Verify Your Email"}
      description={
        verificationState === "success"
          ? "Your email has been successfully verified"
          : `Enter the 6-digit code sent to ${maskEmail(email)}`
      }
    >
      <div className="space-y-6">
        {/* Success State */}
        {verificationState === "success" && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            <p className="text-muted-foreground">
              Redirecting you to login...
            </p>
          </div>
        )}

        {/* Pending/Error States */}
        {verificationState !== "success" && (
          <>
            {/* Email Icon */}
            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-8 text-primary" />
              </div>
            </div>

            {/* Error Message */}
            {verificationState === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Resend Success Message */}
            {resendSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="size-4 text-green-600" />
                <AlertTitle className="text-green-800">Code Resent</AlertTitle>
                <AlertDescription className="text-green-700">
                  A new verification code has been sent to your email.
                </AlertDescription>
              </Alert>
            )}

            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                disabled={verificationState === "verifying"}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={handleVerify}
              disabled={otpValue.length !== 6 || verificationState === "verifying"}
              loading={verificationState === "verifying"}
            >
              {verificationState === "verifying" ? "Verifying..." : "Verify Email"}
            </Button>

            {/* Resend Section */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Didn&apos;t receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="gap-2"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw className="size-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="font-medium text-foreground text-sm mb-2">Can&apos;t find the email?</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>- Check your spam or junk folder</li>
                <li>- Make sure {maskEmail(email)} is correct</li>
                <li>- Wait a few minutes and try resending</li>
              </ul>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

function VerifyEmailLoading() {
  return (
    <AuthLayout
      title="Verify Your Email"
      description="Loading..."
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="size-16 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="size-12 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
