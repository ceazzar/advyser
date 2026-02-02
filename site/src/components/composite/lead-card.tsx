"use client"

import * as React from "react"
import { Calendar, Eye, MessageSquare } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Icon Optical Sizing:
 * - Calendar inline with date text: size-3.5 (14px) - smaller context
 * - Eye, MessageSquare in buttons: size-4 (16px) standard button icons
 */
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type LeadStatus = "new" | "contacted" | "converted" | "declined"

export interface LeadCardProps {
  id: string
  consumerName?: string
  category: string
  message: string
  status: LeadStatus
  createdAt: Date
  onView?: () => void
  onRespond?: () => void
  className?: string
}

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  declined: "Declined",
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function truncateMessage(message: string, maxLength: number = 120): string {
  if (message.length <= maxLength) return message
  return message.slice(0, maxLength).trim() + "..."
}

function LeadCard({
  id,
  consumerName,
  category,
  message,
  status,
  createdAt,
  onView,
  onRespond,
  className,
}: LeadCardProps) {
  const displayName = consumerName || "Anonymous"

  return (
    <Card className={cn("relative transition-all duration-200 hover:shadow-md hover:border-primary/30", className)} data-lead-id={id}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{displayName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{category}</p>
          </div>
          <Badge leadStatus={status} size="sm">
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {truncateMessage(message)}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>{formatDate(createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              aria-label={`View lead from ${displayName}`}
            >
              <Eye className="size-4" />
              View
            </Button>
          )}
          {onRespond && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRespond}
              aria-label={`Respond to lead from ${displayName}`}
            >
              <MessageSquare className="size-4" />
              Respond
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export { LeadCard }
