import { Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Icon Optical Sizing:
 * - Category icons (passed as children): size-6 (24px) or size-5 (20px) when image present
 * - Users count icon: size-[18px] for optical parity with text
 */

interface CategoryTileProps {
  icon: React.ReactNode
  name: string
  description: string
  advisorCount: number
  href: string
  className?: string
  /** Optional hero image URL displayed at the top of the card */
  image?: string
  /** Alt text for the hero image (required for accessibility when image is provided) */
  imageAlt?: string
}

function CategoryTile({
  icon,
  name,
  description,
  advisorCount,
  href,
  className,
  image,
  imageAlt,
}: CategoryTileProps) {
  const hasImage = Boolean(image)

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-card shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1 overflow-hidden",
        !hasImage && "gap-4 p-6",
        className
      )}
    >
      {/* Hero Image */}
      {hasImage && image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={imageAlt || name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Subtle gradient overlay for better visual depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content wrapper with padding when image is present */}
      <div className={cn("flex flex-col flex-1", hasImage ? "gap-3 p-5" : "gap-4")}>
        {/* Icon - smaller when image is present */}
        <div
          className={cn(
            "flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-gray-200 group-hover:text-gray-700",
            hasImage ? "size-10" : "size-12"
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <h3
            className={cn(
              "font-semibold text-card-foreground group-hover:text-gray-900 transition-colors",
              hasImage ? "text-base" : "text-lg"
            )}
          >
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* Advisor Count - Users stroke icon uses 18px for optical parity */}
        <div className="mt-auto flex items-center gap-1.5 text-sm text-muted-foreground pt-2">
          <Users className="size-[18px]" />
          <span>
            {advisorCount.toLocaleString()} {advisorCount === 1 ? "advisor" : "advisors"}
          </span>
        </div>
      </div>
    </Link>
  )
}

export { CategoryTile }
export type { CategoryTileProps }
