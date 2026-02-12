"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Heart } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Icon Optical Sizing:
 * - Heart icon: size-4/5/6 based on button size variant
 * - Heart when filled appears slightly larger, but this is intentional for visual feedback
 */

const favoriteButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const heartIconVariants = cva("transition-all duration-200", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface FavoriteButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "onToggle">,
    VariantProps<typeof favoriteButtonVariants> {
  /** Whether the item is currently favorited */
  isFavorited?: boolean
  /** Callback when favorite state is toggled */
  onToggle?: (isFavorited: boolean) => void | Promise<void>
}

function FavoriteButton({
  isFavorited = false,
  onToggle,
  size = "md",
  className,
  disabled,
  ...props
}: FavoriteButtonProps) {
  // Local state for optimistic UI
  const [optimisticFavorited, setOptimisticFavorited] = React.useState(isFavorited)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  // Sync with prop changes (e.g., from server response)
  React.useEffect(() => {
    setOptimisticFavorited(isFavorited)
  }, [isFavorited])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled || isPending) return

    setIsPending(true)  // Set FIRST to prevent rapid clicks
    const newValue = !optimisticFavorited
    setOptimisticFavorited(newValue)
    setIsAnimating(true)

    try {
      await onToggle?.(newValue)
    } catch {
      // Revert on error
      setOptimisticFavorited(!newValue)
    } finally {
      setIsPending(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const ariaLabel = optimisticFavorited
    ? "Remove from favorites"
    : "Add to favorites"

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      aria-label={ariaLabel}
      aria-pressed={optimisticFavorited}
      className={cn(
        favoriteButtonVariants({ size }),
        // Background states
        optimisticFavorited
          ? "bg-red-50 hover:bg-red-100"
          : "bg-background hover:bg-muted",
        // Disabled state
        (disabled || isPending) && "opacity-50 cursor-not-allowed",
        // Animation on click
        isAnimating && "scale-110",
        className
      )}
      {...props}
    >
      <Heart
        className={cn(
          heartIconVariants({ size }),
          // Color and fill states
          optimisticFavorited
            ? "fill-red-500 text-red-500"
            : "fill-transparent text-muted-foreground hover:text-red-400",
          // Scale animation when favoriting
          isAnimating && optimisticFavorited && "scale-125"
        )}
      />
      {/* Ripple effect on click */}
      {isAnimating && optimisticFavorited && (
        <span
          className="absolute inset-0 rounded-full animate-ping bg-red-400/30"
          style={{ animationDuration: "300ms", animationIterationCount: 1 }}
        />
      )}
    </button>
  )
}

export { FavoriteButton, favoriteButtonVariants }
