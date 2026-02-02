import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton"

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
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar Section with verification badge placeholder */}
          <div className="relative shrink-0">
            <SkeletonAvatar size="lg" className="size-10" />
            {/* Verification badge skeleton */}
            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
              <Skeleton className="size-5 rounded-full" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Name and Credentials */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Rating */}
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="size-4 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Specialties / Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>

            {/* Bio */}
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* View Profile Button */}
            <div className="mt-4">
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { AdvisorCardSkeleton }
