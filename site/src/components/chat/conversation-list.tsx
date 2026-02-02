"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export interface ConversationPreview {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount: number
  isOnline?: boolean
}

export interface ConversationListProps {
  conversations: ConversationPreview[]
  selectedId?: string
  onSelect?: (id: string) => void
  className?: string
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  className,
}: ConversationListProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect?.(conversation.id)}
          className={cn(
            "flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50",
            selectedId === conversation.id && "bg-muted"
          )}
        >
          <div className="relative">
            <Avatar className="size-12">
              {conversation.avatar && (
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
              )}
              <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold truncate">{conversation.name}</span>
              {conversation.lastMessageAt && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: false })}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage || "No messages yet"}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="shrink-0 size-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
