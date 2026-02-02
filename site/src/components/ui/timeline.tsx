"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type TimelineItemStatus = "completed" | "current" | "upcoming"

export interface TimelineItem {
  id: string | number
  icon?: React.ReactNode
  title: string
  description?: string
  timestamp?: string | Date
  status?: TimelineItemStatus
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

function formatTimestamp(timestamp: string | Date | undefined): string {
  if (!timestamp) return ""
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp

  // Australian format: DD/MM/YYYY HH:MM
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const statusStyles: Record<TimelineItemStatus, { dot: string; line: string; content: string }> = {
  completed: {
    dot: "bg-primary border-primary",
    line: "bg-primary",
    content: "text-foreground",
  },
  current: {
    dot: "bg-primary border-primary ring-4 ring-primary/20",
    line: "bg-border",
    content: "text-foreground font-medium",
  },
  upcoming: {
    dot: "bg-muted border-muted-foreground/30",
    line: "bg-border",
    content: "text-muted-foreground",
  },
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, className }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {items.map((item, index) => {
          const status = item.status || "upcoming"
          const styles = statusStyles[status]
          const isLast = index === items.length - 1

          return (
            <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Vertical line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[11px] top-6 w-0.5 h-[calc(100%-12px)]",
                    styles.line
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Dot/Icon */}
              <div className="relative flex-shrink-0">
                {item.icon ? (
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2",
                      styles.dot,
                      "[&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-primary-foreground"
                    )}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2",
                      styles.dot
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className={cn("text-sm", styles.content)}>
                    {item.title}
                  </h4>
                  {item.timestamp && (
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </time>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
Timeline.displayName = "Timeline"

export { Timeline }
