"use client"

import * as React from "react"
import Link from "next/link"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Icon Optical Sizing:
 * - X icon in Clear button: size-4 (16px) standard button icon
 */
import { useShortlist } from "@/lib/shortlist-context"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, getInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export interface AdvisorInfo {
  id: string
  name: string
  avatar?: string
}

export interface ShortlistBarProps {
  /** Map of advisor ID to advisor info for displaying avatars */
  advisorData?: Map<string, AdvisorInfo>
  /** Custom compare page URL */
  compareUrl?: string
  className?: string
}

function ShortlistBar({
  advisorData = new Map(),
  compareUrl = "/compare",
  className,
}: ShortlistBarProps) {
  const { shortlist, clearShortlist } = useShortlist()
  const [isVisible, setIsVisible] = React.useState(false)

  // Animate in/out based on shortlist contents
  React.useEffect(() => {
    if (shortlist.length > 0) {
      // Small delay to trigger animation
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [shortlist.length])

  // Don't render if no items
  if (shortlist.length === 0) return null

  const count = shortlist.length

  // Get advisor info for avatars
  const shortlistedAdvisors = shortlist.map(id => {
    const info = advisorData.get(id)
    return info || { id, name: `Advisor ${id}`, avatar: undefined }
  })

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        className
      )}
    >
      {/* Shadow gradient above bar */}
      <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

      <div className="bg-white border-t border-border shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Avatars and count */}
            <div className="flex items-center gap-3">
              <AvatarGroup max={5} size="sm">
                {shortlistedAdvisors.map((advisor) => (
                  <Avatar key={advisor.id} size="sm">
                    {advisor.avatar && <AvatarImage src={advisor.avatar} alt={advisor.name} />}
                    <AvatarFallback size="sm">{getInitials(advisor.name)}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span className="text-sm font-medium text-foreground">
                {count} advisor{count !== 1 ? "s" : ""} saved
              </span>
              {count >= 5 && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  (max 5)
                </span>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearShortlist}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              <Button asChild size="sm">
                <Link href={`${compareUrl}?ids=${shortlist.join(",")}`}>
                  Compare ({count})
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ShortlistBar }
