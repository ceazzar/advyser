"use client"

import { formatDistanceToNow } from "date-fns"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface MessageCardProps {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unread?: boolean
  onClick?: () => void
}

function MessageCard({
  id,
  name,
  avatar,
  lastMessage,
  timestamp,
  unread = false,
  onClick,
}: MessageCardProps) {
  return (
    <button
      data-slot="message-card"
      data-message-id={id}
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all duration-200",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        unread && "bg-accent/50"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar size="default">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : null}
          <AvatarFallback size="default">{getInitials(name)}</AvatarFallback>
        </Avatar>
        {/* Unread indicator dot */}
        {unread && (
          <span
            data-slot="unread-indicator"
            className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-background bg-primary"
            aria-label="Unread message"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Header row: Name and timestamp */}
        <div className="flex items-center justify-between gap-2">
          <span
            data-slot="message-card-name"
            className={cn(
              "truncate text-sm font-medium",
              unread && "font-semibold"
            )}
          >
            {name}
          </span>
          <span
            data-slot="message-card-timestamp"
            className="shrink-0 text-xs text-muted-foreground"
          >
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>

        {/* Message preview */}
        <p
          data-slot="message-card-preview"
          className={cn(
            "line-clamp-2 text-sm text-muted-foreground",
            unread && "text-foreground"
          )}
        >
          {lastMessage}
        </p>
      </div>
    </button>
  )
}

export { MessageCard }
