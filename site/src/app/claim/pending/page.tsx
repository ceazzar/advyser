"use client"

import * as React from "react"
import Link from "next/link"
import { Clock, Mail, CheckCircle, AlertCircle, HelpCircle, FileText, ArrowRight } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock claim data (would come from API based on user session)
const mockClaimData = {
  id: "CLM-2024-001234",
  advisorName: "Sarah Mitchell",
  companyName: "Mitchell Financial Services",
  submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  estimatedReviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  status: "pending" as const,
  email: "sarah@mitchell-financial.com.au",
}

const statusSteps = [
  {
    id: 1,
    title: "Claim Submitted",
    description: "Your claim has been received",
    status: "complete" as const,
    icon: CheckCircle,
  },
  {
    id: 2,
    title: "Document Verification",
    description: "Our team is reviewing your documents",
    status: "current" as const,
    icon: FileText,
  },
  {
    id: 3,
    title: "Identity Confirmation",
    description: "Confirming your advisor credentials",
    status: "upcoming" as const,
    icon: CheckCircle,
  },
  {
    id: 4,
    title: "Profile Activated",
    description: "Your profile is ready to manage",
    status: "upcoming" as const,
    icon: CheckCircle,
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function StatusTimeline() {
  return (
    <div className="relative">
      {statusSteps.map((step, index) => (
        <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Vertical line */}
          {index < statusSteps.length - 1 && (
            <div
              className={cn(
                "absolute left-[15px] top-8 h-[calc(100%-32px)] w-0.5",
                step.status === "complete" ? "bg-primary" : "bg-border"
              )}
            />
          )}

          {/* Icon */}
          <div
            className={cn(
              "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
              step.status === "complete"
                ? "bg-primary text-primary-foreground"
                : step.status === "current"
                  ? "bg-primary/20 text-primary ring-4 ring-primary/10"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {step.status === "complete" ? (
              <CheckCircle className="size-4" />
            ) : step.status === "current" ? (
              <div className="size-2 rounded-full bg-primary animate-pulse" />
            ) : (
              <div className="size-2 rounded-full bg-muted-foreground/50" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <h4
              className={cn(
                "font-medium",
                step.status === "complete" || step.status === "current"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.title}
            </h4>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>

          {/* Status badge for current step */}
          {step.status === "current" && (
            <Badge status="pending" className="shrink-0">
              In Progress
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ClaimPendingPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex size-20 items-center justify-center rounded-full bg-primary/10">
            <Clock className="size-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Claim is Being Reviewed
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;ve received your claim for {mockClaimData.advisorName}&apos;s profile.
            Our team will review your submission and get back to you soon.
          </p>
        </div>

        {/* Claim Details Card */}
        <div className="mx-auto mt-10 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Claim Details</CardTitle>
                  <CardDescription>Reference: {mockClaimData.id}</CardDescription>
                </div>
                <Badge status="pending">Pending Review</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Being Claimed */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">
                      {mockClaimData.advisorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{mockClaimData.advisorName}</h3>
                    <p className="text-sm text-muted-foreground">{mockClaimData.companyName}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Verification Progress</h3>
                <StatusTimeline />
              </div>

              {/* Key Dates */}
              <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium text-foreground">
                    {formatDate(mockClaimData.submittedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    at {formatTime(mockClaimData.submittedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Review By</p>
                  <p className="font-medium text-foreground">
                    {formatDate(mockClaimData.estimatedReviewDate)}
                  </p>
                  <p className="text-sm text-primary">2-3 business days</p>
                </div>
              </div>

              {/* Email Notification */}
              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <Mail className="mt-0.5 size-5 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">We&apos;ll keep you updated</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You&apos;ll receive email updates at{" "}
                    <span className="font-medium text-foreground">{mockClaimData.email}</span>{" "}
                    when your claim status changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Next Section */}
        <div className="mx-auto mt-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5 text-primary" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Document Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Our verification team will review the documents you submitted to confirm your identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">AFSL Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll verify your AFSL license details against ASIC&apos;s public register.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Profile Activation</h4>
                    <p className="text-sm text-muted-foreground">
                      Once verified, you&apos;ll receive an email with instructions to access your profile dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Actions */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <HelpCircle className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Need Help?</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Visit our help center or contact support if you have questions.
                  </p>
                  <Link
                    href="/help"
                    className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Get Help
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Mail className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Update Your Email</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Need to change where we send updates? Update your contact details.
                  </p>
                  <Link
                    href="/settings/notifications"
                    className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Update Email
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Return Home */}
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <Button variant="outline" asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  )
}
