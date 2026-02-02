"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"

// Types
type RequestStatus = "pending" | "accepted" | "declined"

interface RequestDetail {
  id: string
  advisorName: string
  advisorAvatar?: string
  advisorCredentials: string
  advisorBio: string
  specialty: string
  location: string
  rating: number
  reviewCount: number
  status: RequestStatus
  sentAt: Date
  respondedAt?: Date
  message: string
  advisorResponse?: string
}

// Mock data for individual request
const mockRequestsData: Record<string, RequestDetail> = {
  "1": {
    id: "1",
    advisorName: "David Kim",
    advisorAvatar: "/avatars/advisor-4.jpg",
    advisorCredentials: "CPA, CFP",
    advisorBio: "As both a CPA and CFP, I bring a unique perspective to financial planning. Specializing in tax optimization for business owners and professionals.",
    specialty: "Tax Planning",
    location: "Perth, WA",
    rating: 4.9,
    reviewCount: 156,
    status: "pending",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    message: "Hi David, I'm looking for help with tax optimization strategies for my small business. I run a consulting firm and want to ensure I'm taking advantage of all available deductions and planning effectively for quarterly estimated taxes. I'd love to schedule a consultation to discuss my situation.",
  },
  "2": {
    id: "2",
    advisorName: "Jennifer Martinez",
    advisorAvatar: "/avatars/advisor-5.jpg",
    advisorCredentials: "CFP, CDFA",
    advisorBio: "Certified Divorce Financial Analyst helping individuals navigate complex financial transitions. Expert in rebuilding wealth and securing financial independence.",
    specialty: "Estate Planning",
    location: "Adelaide, SA",
    rating: 4.6,
    reviewCount: 52,
    status: "pending",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    message: "Hello Jennifer, I need assistance with setting up a trust for my family. We have two children and want to ensure our assets are protected and distributed according to our wishes. Could we schedule a call to discuss the options?",
  },
  "3": {
    id: "3",
    advisorName: "Sarah Chen",
    advisorAvatar: "/avatars/advisor-1.jpg",
    advisorCredentials: "CFP, CFA",
    advisorBio: "Specializing in comprehensive retirement planning and tax-efficient investment strategies. I help clients build wealth while minimizing tax burdens through strategic portfolio management.",
    specialty: "Retirement Planning",
    location: "Sydney, NSW",
    rating: 4.9,
    reviewCount: 127,
    status: "accepted",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    message: "Hi Sarah, I'm looking to maximize my superannuation contributions and plan for early retirement. I'm currently 35 and would like to retire by 55. Can you help me create a strategy?",
    advisorResponse: "Hello! Thank you for reaching out. I'd be happy to help you with your early retirement goals. With a 20-year timeline, we have excellent opportunities for growth while managing risk appropriately. I've sent you a message with some initial thoughts and a link to schedule our first consultation. Looking forward to working with you!",
  },
  "4": {
    id: "4",
    advisorName: "Michael Rodriguez",
    advisorAvatar: "/avatars/advisor-2.jpg",
    advisorCredentials: "CFP, ChFC",
    advisorBio: "Over 15 years of experience helping high-net-worth families protect and grow their wealth across generations. Expert in comprehensive estate planning strategies.",
    specialty: "Wealth Management",
    location: "Melbourne, VIC",
    rating: 4.8,
    reviewCount: 89,
    status: "accepted",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    message: "Hello Michael, I'm interested in comprehensive wealth management services. I recently received a significant inheritance and want to make sure it's invested wisely for long-term growth.",
    advisorResponse: "Thank you for considering me for your wealth management needs. Managing an inheritance requires careful planning to align with your goals and risk tolerance. I'd love to learn more about your situation and discuss strategies that could work for you. Please check your messages for my detailed response and scheduling link.",
  },
  "5": {
    id: "5",
    advisorName: "Robert Williams",
    advisorAvatar: "/avatars/advisor-6.jpg",
    advisorCredentials: "CFP, AIF",
    advisorBio: "Fiduciary advisor committed to transparency and client-first investing. I help professionals maximize their superannuation and build diversified portfolios.",
    specialty: "Investment Management",
    location: "Gold Coast, QLD",
    rating: 4.8,
    reviewCount: 98,
    status: "declined",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    message: "Looking for help with diversifying my investment portfolio.",
    advisorResponse: "Thank you for your interest. Unfortunately, I'm currently at full capacity with my existing clients and unable to take on new engagements at this time. I recommend reaching out to other qualified advisors on the platform who specialize in investment management. Best of luck with your financial journey!",
  },
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function getStatusConfig(status: RequestStatus) {
  switch (status) {
    case "pending":
      return {
        icon: <Clock className="size-5" />,
        label: "Pending Response",
        description: "Waiting for the advisor to respond to your request",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
      }
    case "accepted":
      return {
        icon: <CheckCircle className="size-5" />,
        label: "Request Accepted",
        description: "The advisor has accepted your introduction request",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        borderColor: "border-green-200",
      }
    case "declined":
      return {
        icon: <XCircle className="size-5" />,
        label: "Request Declined",
        description: "The advisor was unable to accept your request at this time",
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      }
  }
}

export default function RequestDetailPage() {
  const params = useParams()
  const requestId = params.id as string

  // In a real app, this would be fetched from an API
  const request = mockRequestsData[requestId]

  if (!request) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Requests
        </Link>
        <Card className="py-12">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold">Request not found</h2>
            <p className="mt-2 text-muted-foreground">
              The request you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/requests">View All Requests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = getStatusConfig(request.status)

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/requests"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Requests
      </Link>

      {/* Status Banner */}
      <div
        className={`rounded-lg border p-4 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <div className={statusConfig.textColor}>{statusConfig.icon}</div>
          <div>
            <h3 className={`font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </h3>
            <p className={`text-sm ${statusConfig.textColor} opacity-80`}>
              {statusConfig.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Request Details */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Your Message</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-foreground">{request.message}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sent on {formatDate(request.sentAt)} at {formatTime(request.sentAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advisor Response (if any) */}
          {request.advisorResponse && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Advisor Response</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar size="default">
                      {request.advisorAvatar && (
                        <AvatarImage
                          src={request.advisorAvatar}
                          alt={request.advisorName}
                        />
                      )}
                      <AvatarFallback size="default">
                        {getInitials(request.advisorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="rounded-lg bg-primary/5 p-4">
                        <p className="text-foreground">{request.advisorResponse}</p>
                      </div>
                      {request.respondedAt && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Responded on {formatDate(request.respondedAt)} at{" "}
                          {formatTime(request.respondedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions based on status */}
          {request.status === "accepted" && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild className="flex-1">
                    <Link href={`/dashboard/messages/${request.id}`}>
                      <MessageSquare className="size-4" />
                      Send Message
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/dashboard/bookings">
                      <Calendar className="size-4" />
                      Schedule Consultation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {request.status === "declined" && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>What&apos;s Next?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-muted-foreground">
                  Don&apos;t worry! There are many other qualified advisors who can help
                  you with your {request.specialty.toLowerCase()} needs.
                </p>
                <Button asChild>
                  <Link href="/search">Find Similar Advisors</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Advisor Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Advisor Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Avatar size="xl">
                  {request.advisorAvatar && (
                    <AvatarImage
                      src={request.advisorAvatar}
                      alt={request.advisorName}
                    />
                  )}
                  <AvatarFallback size="xl">
                    {getInitials(request.advisorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{request.advisorName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {request.advisorCredentials}
                  </p>
                </div>
                <Badge status="verified">Verified</Badge>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span>
                    {request.rating} ({request.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-muted-foreground">{request.advisorBio}</p>
              </div>

              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href={`/advisors/${request.id}`}>
                  View Full Profile
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative space-y-4">
                {/* Request Sent */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle className="size-4" />
                    </div>
                    {(request.respondedAt || request.status === "pending") && (
                      <div className="h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">Request Sent</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(request.sentAt)}
                    </p>
                  </div>
                </div>

                {/* Response or Pending */}
                {request.respondedAt ? (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${
                          request.status === "accepted"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {request.status === "accepted" ? (
                          <CheckCircle className="size-4" />
                        ) : (
                          <XCircle className="size-4" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        {request.status === "accepted"
                          ? "Request Accepted"
                          : "Request Declined"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(request.respondedAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex size-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                        <Clock className="size-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Awaiting Response</p>
                      <p className="text-sm text-muted-foreground">
                        Usually responds within 24-48 hours
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
