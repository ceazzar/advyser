"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, Clock, CheckCircle, XCircle, ChevronRight, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { RequestSummary } from "@/app/api/requests/route"

// UI status type (maps from API status)
type RequestStatus = "pending" | "accepted" | "declined"

interface RequestsApiResponse {
  success: boolean
  data?: {
    items: RequestSummary[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
  error?: {
    code: string
    message: string
  }
}

// Map API status to UI status
function mapToUiStatus(apiStatus: string): RequestStatus {
  switch (apiStatus) {
    case "new":
      return "pending"
    case "contacted":
    case "booked":
    case "converted":
      return "accepted"
    case "declined":
      return "declined"
    default:
      return "pending"
  }
}

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

// Adapted request interface for the card component
interface AdaptedRequest {
  id: string
  advisorName: string
  advisorAvatar?: string
  headline: string | null
  businessName: string | null
  status: RequestStatus
  sentAt: Date
  message: string
}

function RequestCard({ request }: { request: AdaptedRequest }) {
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
                {request.businessName && (
                  <span className="text-sm text-muted-foreground">
                    {request.businessName}
                  </span>
                )}
              </div>
              {request.headline && (
                <p className="text-sm text-muted-foreground">
                  {request.headline}
                </p>
              )}
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
  const [requests, setRequests] = React.useState<RequestSummary[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("all")

  // Fetch requests from API
  React.useEffect(() => {
    async function fetchRequests() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/requests")
        const data: RequestsApiResponse = await response.json()

        if (data.success && data.data) {
          setRequests(data.data.items)
        } else {
          setError(data.error?.message || "Failed to fetch requests")
        }
      } catch (err) {
        setError("Failed to connect to server")
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  // Adapt API data to card format
  const adaptedRequests: AdaptedRequest[] = React.useMemo(() => {
    return requests.map((r) => ({
      id: r.id,
      advisorName: r.advisor.name,
      advisorAvatar: r.advisor.avatar || undefined,
      headline: r.advisor.headline,
      businessName: r.advisor.businessName,
      status: mapToUiStatus(r.status),
      sentAt: new Date(r.createdAt),
      message: r.problemSummary || "No details provided",
    }))
  }, [requests])

  const pendingRequests = adaptedRequests.filter((r) => r.status === "pending")
  const acceptedRequests = adaptedRequests.filter((r) => r.status === "accepted")
  const declinedRequests = adaptedRequests.filter((r) => r.status === "declined")

  const filteredRequests = React.useMemo(() => {
    switch (activeTab) {
      case "pending":
        return pendingRequests
      case "accepted":
        return acceptedRequests
      case "declined":
        return declinedRequests
      default:
        return adaptedRequests
    }
  }, [activeTab, adaptedRequests, pendingRequests, acceptedRequests, declinedRequests])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={<FileText />}
        title="Failed to load requests"
        description={error}
        action={{
          label: "Try again",
          onClick: () => window.location.reload(),
        }}
      />
    )
  }

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
                All ({adaptedRequests.length})
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
