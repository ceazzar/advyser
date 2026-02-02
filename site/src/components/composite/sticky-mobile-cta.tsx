"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface StickyMobileCTAProps {
  advisorName: string
  onRequestIntro: () => void
  show?: boolean
  className?: string
}

function StickyMobileCTA({
  advisorName,
  onRequestIntro,
  show = true,
  className,
}: StickyMobileCTAProps) {
  if (!show) {
    return null
  }

  return (
    <div
      className={cn(
        // Positioning - fixed to bottom, full width
        "fixed bottom-0 left-0 right-0 z-50",
        // Only visible on mobile, hidden on large screens
        "lg:hidden",
        // Background and border
        "bg-background border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]",
        // Padding with safe area for home indicator
        "p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        // Slide-up animation
        "animate-in slide-in-from-bottom duration-300 ease-out",
        className
      )}
      role="region"
      aria-label="Contact advisor"
    >
      <Button
        onClick={onRequestIntro}
        size="lg"
        className="w-full"
      >
        Contact {advisorName}
      </Button>
    </div>
  )
}

export { StickyMobileCTA }
