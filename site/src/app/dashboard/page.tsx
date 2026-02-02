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
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"

// Mock data for the dashboard
const mockStats = {
  activeRequests: 3,
  unreadMessages: 2,
  upcomingBookings: 1,
  totalAdvisorsContacted: 8,
}

const mockRecentActivity = [
  {
    id: "1",
    type: "message" as const,
    title: "New message from Sarah Chen",
    description: "Thanks for reaching out! I'd love to discuss your retirement planning goals...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    avatar: "/avatars/advisor-1.jpg",
    name: "Sarah Chen",
    unread: true,
  },
  {
    id: "2",
    type: "booking" as const,
    title: "Upcoming consultation with Michael Rodriguez",
    description: "Video call scheduled for tomorrow at 2:00 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    avatar: "/avatars/advisor-2.jpg",
    name: "Michael Rodriguez",
  },
  {
    id: "3",
    type: "request" as const,
    title: "Request sent to David Kim",
    description: "Your introduction request is pending review",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    avatar: "/avatars/advisor-4.jpg",
    name: "David Kim",
  },
  {
    id: "4",
    type: "message" as const,
    title: "Message from Emily Thompson",
    description: "I've reviewed your financial goals and have some recommendations...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    avatar: "/avatars/advisor-3.jpg",
    name: "Emily Thompson",
    unread: false,
  },
]

const mockPendingRequests = [
  {
    id: "1",
    advisorName: "David Kim",
    avatar: "/avatars/advisor-4.jpg",
    specialty: "Tax Planning",
    status: "pending" as const,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "2",
    advisorName: "Jennifer Martinez",
    avatar: "/avatars/advisor-5.jpg",
    specialty: "Estate Planning",
    status: "pending" as const,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
]

function formatTimeAgo(date: Date): string {
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

function getActivityLink(type: "message" | "booking" | "request", id: string): string {
  switch (type) {
    case "message":
      return `/dashboard/messages/${id}`
    case "booking":
      return `/dashboard/bookings`
    case "request":
      return `/dashboard/requests/${id}`
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, John
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
          value={mockStats.activeRequests}
          icon={<FileText className="size-5" />}
        />
        <StatCard
          label="Unread Messages"
          value={mockStats.unreadMessages}
          icon={<MessageSquare className="size-5" />}
        />
        <StatCard
          label="Upcoming Bookings"
          value={mockStats.upcomingBookings}
          icon={<Calendar className="size-5" />}
        />
        <StatCard
          label="Advisors Contacted"
          value={mockStats.totalAdvisorsContacted}
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
            {mockRecentActivity.length > 0 ? (
              <div className="space-y-1">
                {mockRecentActivity.map((activity) => (
                  <Link
                    key={activity.id}
                    href={getActivityLink(activity.type, activity.id)}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                  >
                    <div className="relative shrink-0">
                      <Avatar size="default">
                        {activity.avatar && (
                          <AvatarImage src={activity.avatar} alt={activity.name} />
                        )}
                        <AvatarFallback size="default">
                          {getInitials(activity.name)}
                        </AvatarFallback>
                      </Avatar>
                      {activity.unread && (
                        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-background bg-primary" />
                      )}
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
                ))}
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
            {mockPendingRequests.length > 0 ? (
              <div className="space-y-3">
                {mockPendingRequests.map((request) => (
                  <Link
                    key={request.id}
                    href={`/dashboard/requests/${request.id}`}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                  >
                    <Avatar size="sm">
                      {request.avatar && (
                        <AvatarImage src={request.avatar} alt={request.advisorName} />
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
