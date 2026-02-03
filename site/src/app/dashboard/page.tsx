"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Bell,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"

// Types for API response
interface DashboardStats {
  activeRequests: number
  unreadMessages: number
  upcomingBookings: number
  totalAdvisorsContacted: number
}

interface ActivityItem {
  type: "message" | "booking" | "request"
  title: string
  description: string
  timestamp: string
  entityType?: string
  entityId?: string
}

interface PendingRequest {
  id: string
  advisorName: string
  advisorAvatar?: string
  specialty: string
  status: "pending" | "accepted" | "declined"
  sentAt: string
}

interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
  pendingRequests: PendingRequest[]
}

interface ApiResponse {
  success: boolean
  data: DashboardData
  error?: string
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function getActivityIcon(type: "message" | "booking" | "request") {
  switch (type) {
    case "message":
      return <MessageSquare className="size-4" />
    case "booking":
      return <Calendar className="size-4" />
    case "request":
      return <FileText className="size-4" />
  }
}

function getActivityLink(activity: ActivityItem): string {
  const { type, entityId } = activity
  switch (type) {
    case "message":
      return entityId ? `/dashboard/messages/${entityId}` : "/dashboard/messages"
    case "booking":
      return entityId ? `/dashboard/bookings/${entityId}` : "/dashboard/bookings"
    case "request":
      return entityId ? `/dashboard/requests/${entityId}` : "/dashboard/requests"
    default:
      return "/dashboard"
  }
}

// Extract name from activity title for avatar
function extractNameFromTitle(title: string): string {
  // Try to extract name from patterns like "New message from Sarah Chen" or "Upcoming consultation with Michael Rodriguez"
  const fromMatch = title.match(/from\s+(.+)$/i)
  if (fromMatch) return fromMatch[1]

  const withMatch = title.match(/with\s+(.+)$/i)
  if (withMatch) return withMatch[1]

  const toMatch = title.match(/to\s+(.+)$/i)
  if (toMatch) return toMatch[1]

  return title
}

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null)

  const fetchDashboardData = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard/consumer")

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
      }

      const result: ApiResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to load dashboard data")
      }

      setDashboardData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="size-6 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Failed to load dashboard</h3>
              <p className="text-sm text-muted-foreground">
                {error || "Unable to load your dashboard data. Please try again."}
              </p>
            </div>
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { stats, recentActivity, pendingRequests } = dashboardData

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with your advisor search
          </p>
        </div>
        <Button asChild>
          <Link href="/search">
            <Search className="size-4" />
            Find Advisors
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Requests"
          value={stats.activeRequests}
          icon={<FileText className="size-5" />}
        />
        <StatCard
          label="Unread Messages"
          value={stats.unreadMessages}
          icon={<MessageSquare className="size-5" />}
        />
        <StatCard
          label="Upcoming Bookings"
          value={stats.upcomingBookings}
          icon={<Calendar className="size-5" />}
        />
        <StatCard
          label="Advisors Contacted"
          value={stats.totalAdvisorsContacted}
          icon={<Bell className="size-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Recent Activity</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/messages">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-1">
                {recentActivity.map((activity, index) => {
                  const name = extractNameFromTitle(activity.title)
                  return (
                    <Link
                      key={`${activity.entityId || index}-${activity.timestamp}`}
                      href={getActivityLink(activity)}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                    >
                      <div className="relative shrink-0">
                        <Avatar size="default">
                          <AvatarFallback size="default">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-foreground">
                            {activity.title}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Clock />}
                title="No recent activity"
                description="Start by searching for advisors to get personalized financial guidance"
                action={{
                  label: "Find Advisors",
                  onClick: () => window.location.href = "/search",
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Pending Requests</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/requests">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="p-6">
            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <Link
                    key={request.id}
                    href={`/dashboard/requests/${request.id}`}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                  >
                    <Avatar size="sm">
                      {request.advisorAvatar && (
                        <AvatarImage src={request.advisorAvatar} alt={request.advisorName} />
                      )}
                      <AvatarFallback size="sm">
                        {getInitials(request.advisorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium">
                        {request.advisorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {request.specialty}
                      </span>
                    </div>
                    <Badge status="pending" size="sm">
                      Pending
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileText />}
                title="No pending requests"
                description="Send introduction requests to connect with advisors"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/search">
                <Search className="size-5" />
                <span className="font-medium">Search Advisors</span>
                <span className="text-xs text-muted-foreground">
                  Find the right financial expert
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/dashboard/requests">
                <FileText className="size-5" />
                <span className="font-medium">View Requests</span>
                <span className="text-xs text-muted-foreground">
                  Manage your intro requests
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="size-5" />
                <span className="font-medium">Messages</span>
                <span className="text-xs text-muted-foreground">
                  Read and reply to advisors
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/dashboard/bookings">
                <Calendar className="size-5" />
                <span className="font-medium">Bookings</span>
                <span className="text-xs text-muted-foreground">
                  View your scheduled meetings
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
