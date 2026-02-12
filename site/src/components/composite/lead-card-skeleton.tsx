import * as React from "react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LeadCardSkeletonProps {
  className?: string
}

/**
 * Skeleton loading state for LeadCard component.
 * Matches the exact structure and dimensions of the LeadCard
 * to prevent layout shifts during data loading.
 */
function LeadCardSkeleton({ className }: LeadCardSkeletonProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Consumer Name */}
            <Skeleton className="h-5 w-32" />
            {/* Category */}
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          {/* Status Badge */}
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {/* Message Preview */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-2">
        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  )
}

export { LeadCardSkeleton }
