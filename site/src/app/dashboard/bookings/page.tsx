"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, Clock, Video, Phone, MapPin, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingCard } from "@/components/composite/booking-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Types
type BookingType = "video" | "phone" | "in-person"
type BookingStatus = "upcoming" | "completed" | "cancelled"

interface Booking {
  id: string
  advisorName: string
  advisorAvatar?: string
  dateTime: Date
  duration: number
  type: BookingType
  status: BookingStatus
  notes?: string
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: "1",
    advisorName: "Sarah Chen",
    advisorAvatar: "/avatars/advisor-1.jpg",
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    duration: 60,
    type: "video",
    status: "upcoming",
    notes: "Discuss retirement planning strategy and superannuation optimization",
  },
  {
    id: "2",
    advisorName: "Michael Rodriguez",
    advisorAvatar: "/avatars/advisor-2.jpg",
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    duration: 30,
    type: "phone",
    status: "upcoming",
    notes: "Follow-up on inheritance investment plan",
  },
  {
    id: "3",
    advisorName: "David Kim",
    advisorAvatar: "/avatars/advisor-4.jpg",
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
    duration: 45,
    type: "in-person",
    status: "upcoming",
    notes: "Tax planning review for Q1",
  },
  {
    id: "4",
    advisorName: "Emily Thompson",
    advisorAvatar: "/avatars/advisor-3.jpg",
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    duration: 60,
    type: "video",
    status: "completed",
    notes: "Initial consultation - investment portfolio review",
  },
  {
    id: "5",
    advisorName: "Jennifer Martinez",
    advisorAvatar: "/avatars/advisor-5.jpg",
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    duration: 45,
    type: "video",
    status: "completed",
    notes: "Estate planning discussion",
  },
  {
    id: "6",
    advisorName: "Robert Williams",
    advisorAvatar: "/avatars/advisor-6.jpg",
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    duration: 30,
    type: "phone",
    status: "cancelled",
    notes: "Portfolio rebalancing consultation",
  },
]

function getNextBooking(bookings: Booking[]): Booking | undefined {
  const upcoming = bookings.filter((b) => b.status === "upcoming")
  if (upcoming.length === 0) return undefined
  return upcoming.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())[0]
}

function formatCountdown(dateTime: Date): string {
  const now = new Date()
  const diff = dateTime.getTime() - now.getTime()

  if (diff < 0) return "Started"

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `in ${days} day${days > 1 ? "s" : ""}`
  }

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`
  }

  return `in ${minutes} minutes`
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = React.useState("upcoming")

  const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming")
  const completedBookings = mockBookings.filter((b) => b.status === "completed")
  const cancelledBookings = mockBookings.filter((b) => b.status === "cancelled")

  const filteredBookings = React.useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return upcomingBookings
      case "completed":
        return completedBookings
      case "cancelled":
        return cancelledBookings
      default:
        return mockBookings
    }
  }, [activeTab])

  const nextBooking = getNextBooking(mockBookings)

  const handleJoin = (id: string) => {
    // In a real app, this would open the video call
  }

  const handleCancel = (id: string) => {
    // In a real app, this would show a confirmation modal
  }

  const handleReschedule = (id: string) => {
    // In a real app, this would open a reschedule modal
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bookings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your consultations with financial advisors
          </p>
        </div>
        <Button asChild>
          <Link href="/search">
            <Plus className="size-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Next Booking Highlight */}
      {nextBooking && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {nextBooking.type === "video" ? (
                    <Video className="size-6" />
                  ) : nextBooking.type === "phone" ? (
                    <Phone className="size-6" />
                  ) : (
                    <MapPin className="size-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-foreground">
                      Next: {nextBooking.advisorName}
                    </h2>
                    <Badge status="active" size="sm">
                      {formatCountdown(nextBooking.dateTime)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {nextBooking.dateTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {nextBooking.dateTime.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  {nextBooking.notes && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {nextBooking.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleJoin(nextBooking.id)}>
                  {nextBooking.type === "video"
                    ? "Join Call"
                    : nextBooking.type === "phone"
                    ? "Start Call"
                    : "Get Directions"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReschedule(nextBooking.id)}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingBookings.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
              <Clock className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedBookings.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="size-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cancelledBookings.length}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Bookings List */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings
                .sort((a, b) => {
                  // Upcoming: earliest first, others: most recent first
                  if (activeTab === "upcoming") {
                    return a.dateTime.getTime() - b.dateTime.getTime()
                  }
                  return b.dateTime.getTime() - a.dateTime.getTime()
                })
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    id={booking.id}
                    name={booking.advisorName}
                    avatar={booking.advisorAvatar}
                    dateTime={booking.dateTime}
                    duration={booking.duration}
                    type={booking.type}
                    status={booking.status}
                    onJoin={
                      booking.status === "upcoming"
                        ? () => handleJoin(booking.id)
                        : undefined
                    }
                    onCancel={
                      booking.status === "upcoming"
                        ? () => handleCancel(booking.id)
                        : undefined
                    }
                    onReschedule={
                      booking.status !== "cancelled"
                        ? () => handleReschedule(booking.id)
                        : undefined
                    }
                  />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar />}
              title={
                activeTab === "upcoming"
                  ? "No upcoming bookings"
                  : activeTab === "completed"
                  ? "No completed bookings"
                  : "No cancelled bookings"
              }
              description={
                activeTab === "upcoming"
                  ? "Schedule a consultation with an advisor to get personalized financial guidance"
                  : activeTab === "completed"
                  ? "Your completed consultations will appear here"
                  : "Cancelled bookings will appear here"
              }
              action={
                activeTab === "upcoming"
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

      {/* Booking Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground">Consultation Tips</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Prepare your questions</p>
                <p className="text-sm text-muted-foreground">
                  Write down your financial goals and questions beforehand
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Gather documents</p>
                <p className="text-sm text-muted-foreground">
                  Have relevant financial documents ready to share
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Test your setup</p>
                <p className="text-sm text-muted-foreground">
                  For video calls, check your camera and microphone
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
