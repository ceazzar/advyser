import * as React from "react"
import Link from "next/link"
import { Users } from "lucide-react"

import { cn } from "@/lib/utils"

interface CategoryTileProps {
  icon: React.ReactNode
  name: string
  description: string
  advisorCount: number
  href: string
  className?: string
}

function CategoryTile({
  icon,
  name,
  description,
  advisorCount,
  href,
  className,
}: CategoryTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      {/* Icon */}
      <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-gray-200 group-hover:text-gray-700">
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-gray-900 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Advisor Count */}
      <div className="mt-auto flex items-center gap-1.5 text-sm text-muted-foreground">
        <Users className="size-4" />
        <span>
          {advisorCount.toLocaleString()} {advisorCount === 1 ? "advisor" : "advisors"}
        </span>
      </div>
    </Link>
  )
}

export { CategoryTile }
export type { CategoryTileProps }
