import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface AdvisorCardSkeletonProps {
  className?: string
}

/**
 * Skeleton loading state for AdvisorCard component.
 * Matches the exact structure and dimensions of the AdvisorCard
 * to prevent layout shifts during data loading.
 */
function AdvisorCardSkeleton({ className }: AdvisorCardSkeletonProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        {/* Responsive layout - stack on mobile, side-by-side on larger screens */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar Section - 80px, centered on mobile */}
          <div className="relative shrink-0 self-center sm:self-start">
            <div className="size-20 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Content Section - Consistent spacing with space-y-2.5 */}
          <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
            {/* Name, Credentials, and Activity Badge */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="size-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="h-4 w-14 bg-muted rounded animate-pulse" />
            </div>

            {/* Availability + Fees row */}
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <div className="h-5 w-28 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              <div className="size-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            </div>

            {/* Response Rate */}
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              <div className="size-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            </div>

            {/* Verification Badge */}
            <div className="flex justify-center sm:justify-start">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            </div>

            {/* Specialties / Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
            </div>

            {/* Bio - 2 lines */}
            <div className="space-y-1.5">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse mx-auto sm:mx-0" />
            </div>

            {/* View Profile Button */}
            <div className="pt-1 flex justify-center sm:justify-start">
              <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { AdvisorCardSkeleton }
