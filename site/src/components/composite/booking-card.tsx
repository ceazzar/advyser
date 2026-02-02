"use client"

import * as React from "react"
import { format } from "date-fns"
import { Video, Phone, MapPin, Clock, Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface BookingCardProps {
  id: string
  name: string
  avatar?: string
  dateTime: Date
  duration: number // minutes
  type: "video" | "phone" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
  onJoin?: () => void
  onCancel?: () => void
  onReschedule?: () => void
  className?: string
}

const meetingTypeConfig = {
  video: {
    icon: Video,
    label: "Video Call",
  },
  phone: {
    icon: Phone,
    label: "Phone Call",
  },
  "in-person": {
    icon: MapPin,
    label: "In-Person",
  },
} as const

const statusConfig = {
  upcoming: {
    className: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Upcoming",
  },
  completed: {
    className: "bg-green-100 text-green-800 border-green-200",
    label: "Completed",
  },
  cancelled: {
    className: "bg-gray-100 text-gray-600 border-gray-200",
    label: "Cancelled",
  },
} as const

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hr`
  }
  return `${hours} hr ${remainingMinutes} min`
}

function BookingCard({
  id,
  name,
  avatar,
  dateTime,
  duration,
  type,
  status,
  onJoin,
  onCancel,
  onReschedule,
  className,
}: BookingCardProps) {
  const MeetingIcon = meetingTypeConfig[type].icon
  const meetingLabel = meetingTypeConfig[type].label
  const statusStyle = statusConfig[status]

  return (
    <Card
      data-slot="booking-card"
      data-booking-id={id}
      data-status={status}
      className={cn("py-4 transition-all duration-200 hover:shadow-md", className)}
    >
      <CardContent className="flex flex-col gap-4">
        {/* Header: Avatar, Name, Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="default">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback size="default">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{name}</span>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MeetingIcon className="size-3.5" />
                <span>{meetingLabel}</span>
              </div>
            </div>
          </div>
          <Badge className={cn("border", statusStyle.className)}>
            {statusStyle.label}
          </Badge>
        </div>

        {/* Date, Time, Duration */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>{format(dateTime, "EEEE, MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{format(dateTime, "h:mm a")}</span>
          </div>
          <div className="text-muted-foreground/70">
            {formatDuration(duration)}
          </div>
        </div>

        {/* Action Buttons */}
        {status === "upcoming" && (onJoin || onCancel || onReschedule) && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {onJoin && (
              <Button size="sm" onClick={onJoin}>
                {type === "video" ? "Join Call" : type === "phone" ? "Start Call" : "Get Directions"}
              </Button>
            )}
            {onReschedule && (
              <Button size="sm" variant="outline" onClick={onReschedule}>
                Reschedule
              </Button>
            )}
            {onCancel && (
              <Button size="sm" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        )}

        {/* Completed status - no actions, or could show "Book Again" */}
        {status === "completed" && onReschedule && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button size="sm" variant="outline" onClick={onReschedule}>
              Book Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { BookingCard }
