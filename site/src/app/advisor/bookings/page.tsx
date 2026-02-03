"use client"

import * as React from "react"
import { Plus, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BookingCard } from "@/components/composite/booking-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// API response types
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
  locationText: string | null
  status: string
  createdAt: string
}

interface BookingsApiResponse {
  success: boolean
  data: {
    items: BookingSummary[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// UI booking type (what BookingCard expects)
interface UIBooking {
  id: string
  name: string
  avatar: string | undefined
  dateTime: Date
  duration: number
  type: "video" | "phone" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
}

// Map API mode to UI type
function mapModeToType(mode: string): "video" | "phone" | "in-person" {
  switch (mode) {
    case "online":
      return "video"
    case "in_person":
      return "in-person"
    case "phone":
      return "phone"
    default:
      return "video"
  }
}

// Map API status to UI status
function mapStatus(status: string): "upcoming" | "completed" | "cancelled" {
  switch (status) {
    case "proposed":
    case "confirmed":
      return "upcoming"
    case "completed":
      return "completed"
    case "cancelled":
      return "cancelled"
    default:
      return "upcoming"
  }
}

// Calculate duration in minutes from startsAt and endsAt
function calculateDuration(startsAt: string, endsAt: string): number {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

// Transform API booking to UI booking
function transformBooking(booking: BookingSummary): UIBooking {
  return {
    id: booking.id,
    name: booking.otherParty.displayName,
    avatar: booking.otherParty.avatarUrl ?? undefined,
    dateTime: new Date(booking.startsAt),
    duration: calculateDuration(booking.startsAt, booking.endsAt),
    type: mapModeToType(booking.mode),
    status: mapStatus(booking.status),
  }
}

// Generate calendar days for the current month
function generateCalendarDays(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = firstDay.getDay()
  const days: (Date | null)[] = []

  // Add padding for days before the first of the month
  for (let i = 0; i < startPadding; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  return days
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(date)
}

export default function BookingsPage() {
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("list")
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "past">("upcoming")
  const [isNewBookingOpen, setIsNewBookingOpen] = React.useState(false)

  // API state
  const [bookings, setBookings] = React.useState<UIBooking[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [cancellingId, setCancellingId] = React.useState<string | null>(null)

  // Fetch bookings on mount
  React.useEffect(() => {
    async function fetchBookings() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/bookings")

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`)
        }

        const data: BookingsApiResponse = await response.json()

        if (!data.success) {
          throw new Error("Failed to fetch bookings")
        }

        const transformedBookings = data.data.items.map(transformBooking)
        setBookings(transformedBookings)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Handle cancel booking
  const handleCancel = async (bookingId: string) => {
    try {
      setCancellingId(bookingId)

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (!response.ok) {
        throw new Error(`Failed to cancel booking: ${response.statusText}`)
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" as const }
            : booking
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel booking")
    } finally {
      setCancellingId(null)
    }
  }

  // Handle reschedule (placeholder for now)
  const handleReschedule = (bookingId: string) => {
    alert(`Reschedule functionality coming soon for booking ${bookingId}`)
  }

  const calendarDays = generateCalendarDays(currentMonth)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming")
  const pastBookings = bookings.filter((b) => b.status !== "upcoming")

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = booking.dateTime
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your appointments and schedule meetings.
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your appointments and schedule meetings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="size-4" />
            </Button>
          </div>
          <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Booking</DialogTitle>
                <DialogDescription>
                  Create a new appointment with a client.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                      <SelectItem value="james">James Chen</SelectItem>
                      <SelectItem value="emma">Emma Thompson</SelectItem>
                      <SelectItem value="david">David Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" id="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select defaultValue="video">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsNewBookingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewBookingOpen(false)}>
                  Schedule Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "list" ? (
        /* List View */
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upcoming" | "past")}>
          <TabsList variant="line" className="border-b">
            <TabsTrigger value="upcoming" className="gap-2">
              Upcoming
              <Badge className="size-5 items-center justify-center rounded-full p-0 text-xs">
                {upcomingBookings.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              Past
              <Badge className="size-5 items-center justify-center rounded-full p-0 text-xs bg-muted text-muted-foreground">
                {pastBookings.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    {...booking}
                    onJoin={() => {}}
                    onReschedule={() => handleReschedule(booking.id)}
                    onCancel={() => handleCancel(booking.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarIcon />}
                title="No upcoming bookings"
                description="Schedule a new booking with a client"
                action={{
                  label: "New Booking",
                  onClick: () => setIsNewBookingOpen(true),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastBookings.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    {...booking}
                    onReschedule={() => handleReschedule(booking.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarIcon />}
                title="No past bookings"
                description="Your completed and cancelled bookings will appear here"
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* Calendar View */
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle>{formatMonthYear(currentMonth)}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Week day headers */}
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const isToday =
                  day &&
                  day.toDateString() === new Date().toDateString()
                const bookingsForDay = day ? getBookingsForDate(day) : []

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[100px] border-b border-r p-2",
                      index % 7 === 6 && "border-r-0",
                      !day && "bg-muted/30"
                    )}
                  >
                    {day && (
                      <>
                        <span
                          className={cn(
                            "inline-flex size-7 items-center justify-center rounded-full text-sm",
                            isToday && "bg-primary text-primary-foreground font-medium"
                          )}
                        >
                          {day.getDate()}
                        </span>
                        <div className="mt-1 space-y-1">
                          {bookingsForDay.slice(0, 2).map((booking) => (
                            <div
                              key={booking.id}
                              className={cn(
                                "truncate rounded px-1.5 py-0.5 text-xs",
                                booking.status === "upcoming"
                                  ? "bg-primary/10 text-primary"
                                  : booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {booking.name}
                            </div>
                          ))}
                          {bookingsForDay.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{bookingsForDay.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
