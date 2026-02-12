"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full select-none",
  {
    variants: {
      size: {
        xs: "size-6",      // 24px
        sm: "size-8",      // 32px
        default: "size-10", // 40px
        lg: "size-14",     // 56px
        xl: "size-20",     // 80px
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center rounded-full bg-primary text-primary-foreground font-medium font-['DM_Sans']",
  {
    variants: {
      size: {
        xs: "text-[10px]",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-lg",
        xl: "text-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({ className, size, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

function AvatarFallback({ className, size, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ size, className }))}
      {...props}
    />
  )
}

/**
 * Helper function to generate initials from a name
 * @param name - Full name to extract initials from
 * @returns Up to 2 character initials
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export interface AvatarGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Maximum number of avatars to show before showing count */
  max?: number
  /** Size of avatars in the group */
  size?: VariantProps<typeof avatarVariants>["size"]
}

function AvatarGroup({
  className,
  max,
  size = "default",
  children,
  ...props
}: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const visibleChildren = max ? childArray.slice(0, max) : childArray
  const remainingCount = max ? childArray.length - max : 0

  // Map size to overlap spacing
  const overlapSpacing = {
    xs: "-space-x-1.5",
    sm: "-space-x-2",
    default: "-space-x-2.5",
    lg: "-space-x-3.5",
    xl: "-space-x-5",
  }

  return (
    <div
      data-slot="avatar-group"
      data-size={size}
      className={cn(
        "flex items-center",
        overlapSpacing[size || "default"],
        "[&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-background",
        className
      )}
      {...props}
    >
      {visibleChildren}
      {remainingCount > 0 && (
        <AvatarGroupCount size={size}>+{remainingCount}</AvatarGroupCount>
      )}
    </div>
  )
}

export interface AvatarGroupCountProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof avatarVariants> {}

function AvatarGroupCount({
  className,
  size,
  ...props
}: AvatarGroupCountProps) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        avatarVariants({ size }),
        "items-center justify-center bg-muted text-muted-foreground font-medium font-['DM_Sans'] ring-2 ring-background",
        {
          "text-[10px]": size === "xs",
          "text-xs": size === "sm",
          "text-sm": size === "default" || !size,
          "text-base": size === "lg",
          "text-lg": size === "xl",
        },
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarFallback,
  avatarFallbackVariants,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarVariants,
  getInitials,
}
