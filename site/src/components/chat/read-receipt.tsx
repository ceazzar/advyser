"use client"

import { format } from "date-fns"
import { Check, CheckCheck } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export type MessageDeliveryStatus = "sending" | "sent" | "delivered" | "read"

export interface ReadReceiptProps {
  status: MessageDeliveryStatus
  timestamp?: Date
  className?: string
}

export function ReadReceipt({ status, timestamp, className }: ReadReceiptProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case "sending":
        return { icon: null, text: "Sending...", color: "text-muted-foreground" }
      case "sent":
        return { icon: <Check className="size-3.5" />, text: "Sent", color: "text-muted-foreground" }
      case "delivered":
        return { icon: <CheckCheck className="size-3.5" />, text: "Delivered", color: "text-muted-foreground" }
      case "read":
        return { icon: <CheckCheck className="size-3.5" />, text: "Seen", color: "text-primary" }
    }
  }

  const display = getStatusDisplay()

  return (
    <div className={cn("flex items-center gap-1 text-xs", display.color, className)}>
      {display.icon}
      <span>{display.text}</span>
      {timestamp && status === "read" && (
        <span className="text-muted-foreground">
          · {format(timestamp, "h:mm a")}
        </span>
      )}
    </div>
  )
}
