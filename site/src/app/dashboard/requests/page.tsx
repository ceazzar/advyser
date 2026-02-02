"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Types
type RequestStatus = "pending" | "accepted" | "declined"

interface AdvisorRequest {
  id: string
  advisorName: string
  advisorAvatar?: string
  advisorCredentials: string
  specialty: string
  location: string
  status: RequestStatus
  sentAt: Date
  respondedAt?: Date
  message: string
}

// Mock data
const mockRequests: AdvisorRequest[] = [
  {
    id: "1",
    advisorName: "David Kim",
    advisorAvatar: "/avatars/advisor-4.jpg",
    advisorCredentials: "CPA, CFP",
    specialty: "Tax Planning",
    location: "Perth, WA",
    status: "pending",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    message: "I'm looking for help with tax optimization strategies for my small business.",
  },
  {
    id: "2",
    advisorName: "Jennifer Martinez",
    advisorAvatar: "/avatars/advisor-5.jpg",
    advisorCredentials: "CFP, CDFA",
    specialty: "Estate Planning",
    location: "Adelaide, SA",
    status: "pending",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    message: "I need assistance with setting up a trust for my family.",
  },
  {
    id: "3",
    advisorName: "Sarah Chen",
    advisorAvatar: "/avatars/advisor-1.jpg",
    advisorCredentials: "CFP, CFA",
    specialty: "Retirement Planning",
    location: "Sydney, NSW",
    status: "accepted",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    message: "Looking to maximize my superannuation contributions and plan for early retirement.",
  },
  {
    id: "4",
    advisorName: "Michael Rodriguez",
    advisorAvatar: "/avatars/advisor-2.jpg",
    advisorCredentials: "CFP, ChFC",
    specialty: "Wealth Management",
    location: "Melbourne, VIC",
    status: "accepted",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    message: "I'm interested in comprehensive wealth management services.",
  },
  {
    id: "5",
    advisorName: "Robert Williams",
    advisorAvatar: "/avatars/advisor-6.jpg",
    advisorCredentials: "CFP, AIF",
    specialty: "Investment Management",
    location: "Gold Coast, QLD",
    status: "declined",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    message: "Looking for help with diversifying my investment portfolio.",
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getStatusIcon(status: RequestStatus) {
  switch (status) {
    case "pending":
      return <Clock className="size-4 text-yellow-600" />
    case "accepted":
      return <CheckCircle className="size-4 text-green-600" />
    case "declined":
      return <XCircle className="size-4 text-red-600" />
  }
}

function getStatusBadgeProps(status: RequestStatus) {
  switch (status) {
    case "pending":
      return { status: "pending" as const }
    case "accepted":
      return { status: "active" as const }
    case "declined":
      return { status: "inactive" as const }
  }
}

function getStatusLabel(status: RequestStatus): string {
  switch (status) {
    case "pending":
      return "Pending"
    case "accepted":
      return "Accepted"
    case "declined":
      return "Declined"
  }
}

function RequestCard({ request }: { request: AdvisorRequest }) {
  return (
    <Link
      href={`/dashboard/requests/${request.id}`}
      className="block"
    >
      <Card className="transition-shadow hover:shadow-lg">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Advisor Info */}
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {request.advisorAvatar && (
                <AvatarImage src={request.advisorAvatar} alt={request.advisorName} />
              )}
              <AvatarFallback size="lg">
                {getInitials(request.advisorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {request.advisorName}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {request.advisorCredentials}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {request.specialty} - {request.location}
              </p>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                &quot;{request.message}&quot;
              </p>
            </div>
          </div>

          {/* Status & Date */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
            <Badge {...getStatusBadgeProps(request.status)}>
              {getStatusIcon(request.status)}
              <span className="ml-1">{getStatusLabel(request.status)}</span>
            </Badge>
            <p className="text-xs text-muted-foreground">
              Sent {formatDate(request.sentAt)}
            </p>
            <ChevronRight className="hidden size-5 text-muted-foreground sm:block" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = React.useState("all")

  const pendingRequests = mockRequests.filter((r) => r.status === "pending")
  const acceptedRequests = mockRequests.filter((r) => r.status === "accepted")
  const declinedRequests = mockRequests.filter((r) => r.status === "declined")

  const filteredRequests = React.useMemo(() => {
    switch (activeTab) {
      case "pending":
        return pendingRequests
      case "accepted":
        return acceptedRequests
      case "declined":
        return declinedRequests
      default:
        return mockRequests
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Introduction Requests
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage your advisor introduction requests
          </p>
        </div>
        <Button asChild>
          <Link href="/search">Find Advisors</Link>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{acceptedRequests.length}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <XCircle className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{declinedRequests.length}</p>
              <p className="text-sm text-muted-foreground">Declined</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Request List */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line">
              <TabsTrigger value="all">
                All ({mockRequests.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({acceptedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="declined">
                Declined ({declinedRequests.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText />}
              title={
                activeTab === "all"
                  ? "No requests yet"
                  : `No ${activeTab} requests`
              }
              description={
                activeTab === "all"
                  ? "Start by searching for advisors and sending introduction requests"
                  : `You don't have any ${activeTab} requests at the moment`
              }
              action={
                activeTab === "all"
                  ? {
                      label: "Find Advisors",
                      onClick: () => (window.location.href = "/search"),
                    }
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
