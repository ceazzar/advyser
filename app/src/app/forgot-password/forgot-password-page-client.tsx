"use client"

import { ArrowLeft, CheckCircle2,KeyRound, Mail } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/auth-actions"
import { normalizeEmail } from "@/lib/email"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    const normalizedEmail = normalizeEmail(email)

    const formData = new FormData()
    formData.append("email", normalizedEmail)

    const result = await resetPassword(formData)

    setIsSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error || "Failed to send reset email")
      return
    }

    setEmail(normalizedEmail)
    setIsSubmitted(true)
  }

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 size-4" />
              Back to login
            </Link>
          </Button>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <KeyRound className="size-7" />
              </div>
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>
                {isSubmitted
                  ? "Check your email for a reset link"
                  : "Enter your email and we'll send you a reset link"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {isSubmitted ? (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center size-16 rounded-full bg-green-100 text-green-600 mx-auto">
                    <CheckCircle2 className="size-8" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      We&apos;ve sent a password reset link to:
                    </p>
                    <p className="font-medium text-foreground">{email}</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    <p className="mb-2">
                      <strong>Didn&apos;t receive the email?</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>Check your spam or junk folder</li>
                      <li>Make sure you entered the correct email</li>
                      <li>Wait a few minutes and try again</li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail("")
                      }}
                    >
                      <Mail className="mr-2 size-4" />
                      Try a different email
                    </Button>
                    <Button asChild>
                      <Link href="/login">Return to login</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send reset link"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Log in
                    </Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Having trouble?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
