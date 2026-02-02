"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"

export interface StickyMobileCTAProps {
  /** Advisor's display name */
  advisorName: string
  /** URL for advisor's profile image */
  advisorImage?: string
  /** Callback when CTA is clicked */
  onRequestIntro: () => void
  /** Custom CTA button text (default: "Request Intro") */
  ctaText?: string
  /**
   * Control visibility manually. If not provided, component will use
   * IntersectionObserver to auto-show when targetRef scrolls out of view.
   */
  show?: boolean
  /**
   * Ref to the element that triggers visibility (e.g., main CTA button).
   * When this element scrolls out of view, the sticky CTA appears.
   */
  targetRef?: React.RefObject<HTMLElement | null>
  /** Additional CSS classes */
  className?: string
}

function StickyMobileCTA({
  advisorName,
  advisorImage,
  onRequestIntro,
  ctaText = "Request Intro",
  show: controlledShow,
  targetRef,
  className,
}: StickyMobileCTAProps) {
  const [isTargetOutOfView, setIsTargetOutOfView] = React.useState(false)

  // Set up IntersectionObserver to track when target scrolls out of view
  React.useEffect(() => {
    // Skip if controlled mode or no target ref
    if (controlledShow !== undefined || !targetRef?.current) {
      return
    }

    const target = targetRef.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when target is NOT intersecting (out of view)
        setIsTargetOutOfView(!entry.isIntersecting)
      },
      {
        // Consider element out of view when it's completely scrolled past
        threshold: 0,
        rootMargin: "0px",
      }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [controlledShow])  // Don't add targetRef.current - capture it instead

  // Determine visibility: use controlled value if provided, otherwise use observer state
  const isVisible = controlledShow !== undefined ? controlledShow : isTargetOutOfView

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        // Positioning - fixed to bottom, full width
        "fixed bottom-0 left-0 right-0 z-50",
        // Only visible on mobile, hidden on large screens
        "lg:hidden",
        // Background with backdrop blur and border
        "bg-background/95 backdrop-blur-sm border-t border-border",
        "shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]",
        // Padding with safe area for home indicator on notched phones
        "px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        // Slide-up animation
        "animate-in slide-in-from-bottom-full duration-300 ease-out",
        className
      )}
      role="region"
      aria-label={`Contact ${advisorName}`}
    >
      <div className="flex items-center gap-3">
        {/* Advisor thumbnail */}
        <Avatar size="sm" className="shrink-0">
          {advisorImage && (
            <AvatarImage src={advisorImage} alt={advisorName} />
          )}
          <AvatarFallback size="sm">{getInitials(advisorName)}</AvatarFallback>
        </Avatar>

        {/* Advisor name - truncate if too long */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {advisorName}
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onRequestIntro}
          size="default"
          className="shrink-0"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  )
}

export { StickyMobileCTA }
