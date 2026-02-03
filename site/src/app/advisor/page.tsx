"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"

// Types for API response
interface DashboardStats {
  newLeads: number
  activeClients: number
  pendingBookings: number
  responseRate: number
  avgResponseTimeHours: number
}

interface RecentLead {
  id: string
  consumerName: string
  consumerAvatar?: string
  category: string
  status: string
  createdAt: string
}

interface UpcomingBooking {
  id: string
  clientName: string
  clientAvatar?: string
  startsAt: string
  mode: string
}

interface RecentActivity {
  type: string
  description: string
  timestamp: string
}

interface DashboardData {
  stats: DashboardStats
  recentLeads: RecentLead[]
  upcomingBookings: UpcomingBooking[]
  recentActivity: RecentActivity[]
}

interface ApiResponse {
  success: boolean
  data: DashboardData
}

// Mapped types for UI
interface MappedLead {
  id: string
  name: string
  category: string
  status: "new" | "contacted"
  createdAt: string
  avatar?: string
}

interface MappedBooking {
  id: string
  clientName: string
  dateTime: string
  type: "video" | "phone" | "in-person"
  avatar?: string
}

interface MappedActivity {
  id: string
  type: string
  description: string
  time: string
}

const activityIcons: Record<string, React.ReactNode> = {
  lead_accepted: <CheckCircle2 className="size-4 text-green-600" />,
  message_sent: <MessageSquare className="size-4 text-blue-600" />,
  booking_completed: <Calendar className="size-4 text-purple-600" />,
  document_uploaded: <AlertCircle className="size-4 text-orange-600" />,
}

// Helper to format relative time from ISO string
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return diffMins <= 1 ? "1 min ago" : `${diffMins} min ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
  } else {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
  }
}

// Helper to format booking date/time
function formatBookingDateTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const timeStr = date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  if (date.toDateString() === now.toDateString()) {
    return `Today, ${timeStr}`
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${timeStr}`
  } else {
    const dayStr = date.toLocaleDateString("en-AU", { weekday: "short" })
    return `${dayStr}, ${timeStr}`
  }
}

// Helper to map mode to type
function mapModeToType(mode: string): "video" | "phone" | "in-person" {
  const modeMap: Record<string, "video" | "phone" | "in-person"> = {
    video: "video",
    phone: "phone",
    "in-person": "in-person",
    "in_person": "in-person",
  }
  return modeMap[mode.toLowerCase()] || "video"
}

export default function AdvisorDashboardPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null)

  const fetchDashboard = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard/advisor")

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
      }

      const json: ApiResponse = await response.json()

      if (!json.success) {
        throw new Error("Failed to load dashboard data")
      }

      setDashboardData(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // Map API data to UI format
  const mappedLeads: MappedLead[] = React.useMemo(() => {
    if (!dashboardData?.recentLeads) return []
    return dashboardData.recentLeads.map((lead) => ({
      id: lead.id,
      name: lead.consumerName,
      category: lead.category,
      status: (lead.status === "new" ? "new" : "contacted") as "new" | "contacted",
      createdAt: formatRelativeTime(lead.createdAt),
      avatar: lead.consumerAvatar,
    }))
  }, [dashboardData?.recentLeads])

  const mappedBookings: MappedBooking[] = React.useMemo(() => {
    if (!dashboardData?.upcomingBookings) return []
    return dashboardData.upcomingBookings.map((booking) => ({
      id: booking.id,
      clientName: booking.clientName,
      dateTime: formatBookingDateTime(booking.startsAt),
      type: mapModeToType(booking.mode),
      avatar: booking.clientAvatar,
    }))
  }, [dashboardData?.upcomingBookings])

  const mappedActivity: MappedActivity[] = React.useMemo(() => {
    if (!dashboardData?.recentActivity) return []
    return dashboardData.recentActivity.map((activity, index) => ({
      id: `activity-${index}`,
      type: activity.type,
      description: activity.description,
      time: formatRelativeTime(activity.timestamp),
    }))
  }, [dashboardData?.recentActivity])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDashboard}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">No dashboard data available</p>
      </div>
    )
  }

  const { stats } = dashboardData

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your practice.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New Leads"
          value={stats.newLeads}
          icon={<Users className="size-5" />}
        />
        <StatCard
          label="Active Clients"
          value={stats.activeClients}
          icon={<TrendingUp className="size-5" />}
        />
        <StatCard
          label="Pending Bookings"
          value={stats.pendingBookings}
          icon={<Calendar className="size-5" />}
        />
        <StatCard
          label="Response Rate"
          value={`${Math.round(stats.responseRate * 100)}%`}
          icon={<Clock className="size-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent Leads</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/advisor/leads">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-4">
            {mappedLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent leads
              </p>
            ) : (
              <div className="space-y-4">
                {mappedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size="default">
                        {lead.avatar && <AvatarImage src={lead.avatar} />}
                        <AvatarFallback size="default">
                          {getInitials(lead.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{lead.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {lead.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge leadStatus={lead.status} size="sm">
                        {lead.status === "new" ? "New" : "Contacted"}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {lead.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/advisor/bookings">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-4">
            {mappedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming bookings
              </p>
            ) : (
              <div className="space-y-4">
                {mappedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size="default">
                        {booking.avatar && <AvatarImage src={booking.avatar} />}
                        <AvatarFallback size="default">
                          {getInitials(booking.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {booking.clientName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {booking.type === "video"
                            ? "Video Call"
                            : booking.type === "phone"
                            ? "Phone Call"
                            : "In-Person"}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {booking.dateTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {mappedActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {mappedActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      {activityIcons[activity.type] || <AlertCircle className="size-4 text-gray-600" />}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-sm">{activity.description}</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
