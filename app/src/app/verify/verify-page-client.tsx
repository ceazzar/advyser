"use client"

import { ArrowLeft,CheckCircle, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { Suspense } from "react"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [isResending, setIsResending] = React.useState(false)
  const [resendCooldown, setResendCooldown] = React.useState(0)
  const [resendSuccess, setResendSuccess] = React.useState(false)
  const [resendError, setResendError] = React.useState<string | null>(null)

  // Cooldown timer for resend
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    setResendError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })

    setIsResending(false)

    if (error) {
      setResendError(error.message)
      return
    }

    setResendSuccess(true)
    setResendCooldown(60)

    setTimeout(() => {
      setResendSuccess(false)
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
      title="Check Your Email"
      description={`We sent a verification link to ${email ? maskEmail(email) : "your email"}`}
    >
      <div className="space-y-6">
        {/* Email Icon */}
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-8 text-primary" />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account. Once verified, you&apos;ll be redirected to your account destination.
          </p>
        </div>

        {/* Resend Success Message */}
        {resendSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="size-4 text-green-600" />
            <AlertTitle className="text-green-800">Email Resent</AlertTitle>
            <AlertDescription className="text-green-700">
              A new verification link has been sent to your email.
            </AlertDescription>
          </Alert>
        )}

        {/* Resend Error */}
        {resendError && (
          <Alert variant="destructive">
            <AlertTitle>Resend Failed</AlertTitle>
            <AlertDescription>{resendError}</AlertDescription>
          </Alert>
        )}

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Didn&apos;t receive the email?
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0 || !email}
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
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h4 className="font-medium text-foreground text-sm mb-2">Can&apos;t find the email?</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>- Check your spam or junk folder</li>
            <li>- Make sure {email ? maskEmail(email) : "your email"} is correct</li>
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
      </div>
    </AuthLayout>
  )
}

function VerifyEmailLoading() {
  return (
    <AuthLayout
      title="Check Your Email"
      description="Loading..."
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="size-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
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
