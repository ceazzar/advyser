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
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"

// Mock data for dashboard
const dashboardStats = {
  newLeads: 12,
  newLeadsChange: { value: 15, type: "increase" as const },
  activeClients: 48,
  activeClientsChange: { value: 5, type: "increase" as const },
  pendingBookings: 8,
  responseRate: "94%",
  responseRateChange: { value: 3, type: "increase" as const },
}

const recentLeads = [
  {
    id: "1",
    name: "Sarah Mitchell",
    category: "Retirement Planning",
    status: "new" as const,
    createdAt: "2 hours ago",
    avatar: undefined,
  },
  {
    id: "2",
    name: "James Chen",
    category: "Investment Strategy",
    status: "new" as const,
    createdAt: "5 hours ago",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Emma Thompson",
    category: "Superannuation",
    status: "contacted" as const,
    createdAt: "1 day ago",
    avatar: undefined,
  },
]

const upcomingBookings = [
  {
    id: "1",
    clientName: "David Wilson",
    dateTime: "Today, 2:00 PM",
    type: "video" as const,
    avatar: undefined,
  },
  {
    id: "2",
    clientName: "Lisa Anderson",
    dateTime: "Tomorrow, 10:00 AM",
    type: "phone" as const,
    avatar: undefined,
  },
  {
    id: "3",
    clientName: "Michael Brown",
    dateTime: "Thu, 3:30 PM",
    type: "in-person" as const,
    avatar: undefined,
  },
]

const recentActivity = [
  {
    id: "1",
    type: "lead_accepted",
    description: "You accepted a lead from Sarah Mitchell",
    time: "30 min ago",
  },
  {
    id: "2",
    type: "message_sent",
    description: "Message sent to David Wilson",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "booking_completed",
    description: "Consultation completed with Lisa Anderson",
    time: "3 hours ago",
  },
  {
    id: "4",
    type: "document_uploaded",
    description: "SOA uploaded for Michael Brown",
    time: "5 hours ago",
  },
]

const activityIcons: Record<string, React.ReactNode> = {
  lead_accepted: <CheckCircle2 className="size-4 text-green-600" />,
  message_sent: <MessageSquare className="size-4 text-blue-600" />,
  booking_completed: <Calendar className="size-4 text-purple-600" />,
  document_uploaded: <AlertCircle className="size-4 text-orange-600" />,
}

export default function AdvisorDashboardPage() {
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
          value={dashboardStats.newLeads}
          change={dashboardStats.newLeadsChange}
          icon={<Users className="size-5" />}
        />
        <StatCard
          label="Active Clients"
          value={dashboardStats.activeClients}
          change={dashboardStats.activeClientsChange}
          icon={<TrendingUp className="size-5" />}
        />
        <StatCard
          label="Pending Bookings"
          value={dashboardStats.pendingBookings}
          icon={<Calendar className="size-5" />}
        />
        <StatCard
          label="Response Rate"
          value={dashboardStats.responseRate}
          change={dashboardStats.responseRateChange}
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
            <div className="space-y-4">
              {recentLeads.map((lead) => (
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
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
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
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {activityIcons[activity.type]}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
