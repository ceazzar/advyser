"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface AdvisorMiniCardProps {
  id: string
  slug: string
  name: string
  avatar?: string
  rating: number
  reviewCount: number
  location: string
  primarySpecialty: string
  /** Brief explanation for why this advisor is recommended */
  matchReason?: string
  className?: string
}

function StarRatingCompact({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
    >
      <Star className="size-3.5 fill-amber-500/90 text-amber-500/90" />
      <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

function AdvisorMiniCard({
  id,
  slug,
  name,
  avatar,
  rating,
  reviewCount,
  location,
  primarySpecialty,
  matchReason,
  className,
}: AdvisorMiniCardProps) {
  return (
    <Link href={`/advisors/${slug}`} className="block">
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar - 40px */}
            <Avatar size="default" className="shrink-0">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback size="default">{getInitials(name)}</AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              {/* Name */}
              <h4 className="font-semibold text-foreground truncate text-sm">
                {name}
              </h4>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <StarRatingCompact rating={rating} />
                <span className="text-xs text-muted-foreground">
                  ({reviewCount})
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{location}</span>
              </div>

              {/* Primary Specialty Badge */}
              <Badge
                size="sm"
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                {primarySpecialty}
              </Badge>

              {/* Match Reason */}
              {matchReason && (
                <p className="text-xs text-muted-foreground italic pt-1">
                  {matchReason}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export { AdvisorMiniCard }
