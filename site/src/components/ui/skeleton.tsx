import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Base Skeleton component with animated shimmer effect
 * Use for custom loading placeholders with any shape/size
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-shimmer rounded-md", className)}
      {...props}
    />
  )
}

/**
 * SkeletonText - Loading placeholder for text lines
 * Defaults to a single line height with customizable width
 */
function SkeletonText({
  className,
  lines = 1,
  ...props
}: React.ComponentProps<"div"> & {
  /** Number of text lines to display */
  lines?: number
}) {
  if (lines === 1) {
    return (
      <div
        data-slot="skeleton-text"
        className={cn("bg-muted animate-shimmer rounded-md h-4 w-full", className)}
        {...props}
      />
    )
  }

  return (
    <div data-slot="skeleton-text" className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-muted animate-shimmer rounded-md h-4",
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

/**
 * SkeletonAvatar - Circular loading placeholder for avatars
 * Supports sm, default, and lg sizes matching Avatar component
 */
function SkeletonAvatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  /** Size variant matching Avatar component */
  size?: "sm" | "default" | "lg"
}) {
  return (
    <div
      data-slot="skeleton-avatar"
      data-size={size}
      className={cn(
        "bg-muted animate-shimmer rounded-full shrink-0",
        "data-[size=sm]:size-6 data-[size=default]:size-8 data-[size=lg]:size-10",
        className
      )}
      {...props}
    />
  )
}

/**
 * SkeletonCard - Card-shaped loading placeholder
 * Includes header, content lines, and optional footer
 */
function SkeletonCard({
  className,
  showAvatar = false,
  showFooter = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Show an avatar in the header */
  showAvatar?: boolean
  /** Show a footer section */
  showFooter?: boolean
}) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn(
        "bg-card flex flex-col gap-6 rounded-xl border border-border py-6 shadow-md",
        className
      )}
      {...props}
    >
      {/* Card Header */}
      <div className="flex items-start gap-4 px-6">
        {showAvatar && <SkeletonAvatar size="default" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Card Footer */}
      {showFooter && (
        <div className="flex items-center gap-2 px-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      )}
    </div>
  )
}

export { Skeleton, SkeletonAvatar, SkeletonCard,SkeletonText }
