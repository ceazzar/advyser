"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TypingIndicatorProps {
  userName?: string
  className?: string
}

export function TypingIndicator({ userName, className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      {userName && <span>{userName} is typing</span>}
      <div className="flex gap-1">
        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" />
      </div>
    </div>
  )
}
