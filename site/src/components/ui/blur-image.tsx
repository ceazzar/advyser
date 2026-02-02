"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BlurImageProps
  extends Omit<React.ComponentPropsWithoutRef<"img">, "placeholder"> {
  /** Source URL for the image */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Optional placeholder - can be a data URL, color, or 'empty' */
  placeholder?: string
  /** Optional callback when image fails to load */
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
  /** Optional callback when image finishes loading */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

/**
 * BlurImage - Image component with blur-up loading effect
 *
 * Features:
 * - Blurred placeholder while loading for better perceived performance
 * - Smooth transition from blurred to clear
 * - Skeleton shimmer animation during load
 * - Graceful error state handling
 *
 * @example
 * ```tsx
 * <BlurImage
 *   src="/avatar.jpg"
 *   alt="Advisor"
 *   className="rounded-full"
 *   width={80}
 *   height={80}
 * />
 * ```
 */
function BlurImage({
  src,
  alt,
  className,
  placeholder,
  onError,
  onLoad,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  // Reset states when src changes
  React.useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setIsLoading(false)
      onLoad?.(event)
    },
    [onLoad]
  )

  const handleError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setIsLoading(false)
      setHasError(true)
      onError?.(event)
    },
    [onError]
  )

  // Determine the placeholder background
  const placeholderStyle = React.useMemo(() => {
    if (!placeholder || placeholder === "empty") {
      return {}
    }
    // Check if it's a data URL
    if (placeholder.startsWith("data:")) {
      return { backgroundImage: `url(${placeholder})`, backgroundSize: "cover" }
    }
    // Otherwise treat it as a color
    return { backgroundColor: placeholder }
  }, [placeholder])

  if (hasError) {
    return (
      <div
        data-slot="blur-image-error"
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{
          width: props.width,
          height: props.height,
        }}
        {...(props as React.ComponentPropsWithoutRef<"div">)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6 opacity-50"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    )
  }

  return (
    <div
      data-slot="blur-image-wrapper"
      className={cn("relative overflow-hidden", className)}
      style={{
        width: props.width,
        height: props.height,
        ...placeholderStyle,
      }}
    >
      {/* Skeleton shimmer overlay while loading */}
      {isLoading && (
        <div
          data-slot="blur-image-skeleton"
          className="absolute inset-0 bg-muted animate-shimmer"
          style={placeholderStyle}
        />
      )}

      {/* Main image with blur transition */}
      <img
        data-slot="blur-image"
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "size-full object-cover transition-all duration-500 ease-out",
          isLoading ? "blur-lg scale-105 opacity-0" : "blur-0 scale-100 opacity-100"
        )}
        {...props}
      />
    </div>
  )
}

export { BlurImage }
