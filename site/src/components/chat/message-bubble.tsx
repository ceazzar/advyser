"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { format } from "date-fns"

export interface MessageBubbleProps {
  message: {
    id: string
    body: string
    createdAt: Date
    senderName?: string
    senderAvatar?: string
  }
  isSender: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  className?: string
}

export function MessageBubble({
  message,
  isSender,
  showAvatar = true,
  showTimestamp = true,
  className,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        isSender ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {showAvatar && !isSender && (
        <Avatar className="size-8 shrink-0">
          {message.senderAvatar && (
            <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          )}
          <AvatarFallback className="text-xs">
            {getInitials(message.senderName || "User")}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[70%]",
          isSender ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isSender
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          )}
        >
          {message.body}
        </div>

        {showTimestamp && (
          <span className="text-xs text-muted-foreground px-1">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
        )}
      </div>
    </div>
  )
}
