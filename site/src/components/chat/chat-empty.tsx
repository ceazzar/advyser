"use client"

import * as React from "react"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChatEmptyProps {
  title?: string
  description?: string
  className?: string
}

export function ChatEmpty({
  title = "No messages yet",
  description = "Start the conversation by sending a message below.",
  className,
}: ChatEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        className
      )}
    >
      <div className="size-16 rounded-full bg-muted flex items-center justify-center">
        <MessageSquare className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
    </div>
  )
}
