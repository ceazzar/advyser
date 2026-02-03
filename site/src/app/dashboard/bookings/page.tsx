"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, Clock, Video, Phone, MapPin, Plus, Loader2, AlertCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingCard } from "@/components/composite/booking-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

// API types
interface BookingSummary {
  id: string
  otherParty: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
  startsAt: string
  endsAt: string
  mode: string
  status: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Map API mode to booking type
 */
function mapModeToType(mode: string): BookingType {
  switch (mode) {
    case "video":
      return "video"
    case "phone":
      return "phone"
    case "in_person":
    case "in-person":
      return "in-person"
    default:
      return "video"
  }
}

/**
 * Map API status to UI status
 */
function mapApiStatusToUiStatus(apiStatus: string): BookingStatus {
  switch (apiStatus) {
    case "proposed":
    case "confirmed":
      return "upcoming"
    case "completed":
      return "completed"
    case "cancelled":
    case "no_show":
      return "cancelled"
    default:
      return "upcoming"
  }
}

/**
 * Calculate duration in minutes from start and end times
 */
function calculateDuration(startsAt: string, endsAt: string): number {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const diffMs = end.getTime() - start.getTime()
  return Math.round(diffMs / (1000 * 60))
}

/**
 * Map API booking to UI booking
 */
function mapApiBookingToBooking(apiBooking: BookingSummary): Booking {
  return {
    id: apiBooking.id,
    advisorName: apiBooking.otherParty.displayName,
    advisorAvatar: apiBooking.otherParty.avatarUrl || undefined,
    dateTime: new Date(apiBooking.startsAt),
    duration: calculateDuration(apiBooking.startsAt, apiBooking.endsAt),
    type: mapModeToType(apiBooking.mode),
    status: mapApiStatusToUiStatus(apiBooking.status),
  }
}

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
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  // Fetch bookings on mount
  React.useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bookings")
      const result: ApiResponse<PaginatedResponse<BookingSummary>> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || "Failed to fetch bookings")
      }

      const mappedBookings = result.data.items.map(mapApiBookingToBooking)
      setBookings(mappedBookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming")
  const completedBookings = bookings.filter((b) => b.status === "completed")
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled")

  const filteredBookings = React.useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return upcomingBookings
      case "completed":
        return completedBookings
      case "cancelled":
        return cancelledBookings
      default:
        return bookings
    }
  }, [activeTab, bookings, upcomingBookings, completedBookings, cancelledBookings])

  const nextBooking = getNextBooking(bookings)

  const handleJoin = (id: string) => {
    // In a real app, this would open the video call
  }

  const handleConfirm = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      })

      const result: ApiResponse<{ id: string; status: string }> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to confirm booking")
      }

      // Refresh bookings list
      await fetchBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm booking")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      const result: ApiResponse<{ id: string; status: string }> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to cancel booking")
      }

      // Refresh bookings list
      await fetchBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReschedule = (id: string) => {
    // In a real app, this would open a reschedule modal
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
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

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null)
                fetchBookings()
              }}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
