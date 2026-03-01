"use client"

import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
  loadingComponent?: React.ReactNode
  className?: string
}

export function InfiniteScroll({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 200,
  loadingComponent,
  className,
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const isLoadingRef = React.useRef(isLoading)
  const hasMoreRef = React.useRef(hasMore)

  // Keep refs in sync with props to avoid stale closures in observer callback
  React.useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  React.useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          onLoadMore()
        }
      },
      {
        root: null, // viewport
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, threshold])

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-4">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )

  return (
    <div className={cn("relative", className)}>
      {children}

      {/* Sentinel element for intersection detection */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Loading indicator */}
      {isLoading && (loadingComponent ?? defaultLoadingComponent)}
    </div>
  )
}
