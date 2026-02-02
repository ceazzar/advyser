"use client"

import * as React from "react"
import { MapPin, Star, BadgeCheck, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface AdvisorCardProps {
  id: string
  name: string
  avatar?: string
  credentials?: string
  specialties: string[]
  rating: number
  reviewCount: number
  location: string
  bio: string
  verified?: boolean
  licenseNumber?: string
  responseRate?: number
  avgResponseTime?: string
  className?: string
  onViewProfile?: (id: string) => void
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars with ${reviewCount} reviews`}
    >
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="size-4 fill-amber-400 text-amber-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="size-4 text-muted-foreground/30" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="size-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="size-4 text-muted-foreground/30"
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  )
}

function AdvisorCard({
  id,
  name,
  avatar,
  credentials,
  specialties,
  rating,
  reviewCount,
  location,
  bio,
  verified = false,
  licenseNumber,
  responseRate,
  avgResponseTime,
  className,
  onViewProfile,
}: AdvisorCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5", className)}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar Section - 80px */}
          <div className="relative shrink-0">
            <Avatar className="size-20">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback className="size-20 text-xl">{getInitials(name)}</AvatarFallback>
            </Avatar>
            {verified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                <BadgeCheck className="size-5 fill-teal-500 text-white" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Name and Credentials */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {credentials && (
                <span className="text-sm text-muted-foreground">{credentials}</span>
              )}
            </div>

            {/* Rating */}
            <div className="mt-1">
              <StarRating rating={rating} reviewCount={reviewCount} />
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            {/* Response Rate */}
            {(avgResponseTime || responseRate) && (
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0" />
                <span>
                  {avgResponseTime && `Responds within ${avgResponseTime}`}
                  {avgResponseTime && responseRate && " • "}
                  {responseRate && `${responseRate}% response rate`}
                </span>
              </div>
            )}

            {/* ASIC Verification */}
            {verified && (
              <div className="flex items-center gap-1.5 mt-2">
                <BadgeCheck className="size-4 fill-teal-500 text-white shrink-0" />
                <span className="text-sm font-medium text-teal-600">
                  ASIC Verified{licenseNumber && ` • License #${licenseNumber}`}
                </span>
              </div>
            )}

            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {specialties.slice(0, 4).map((specialty) => (
                <Badge
                  key={specialty}
                  size="sm"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {specialty}
                </Badge>
              ))}
              {specialties.length > 4 && (
                <Badge
                  size="sm"
                  className="bg-muted text-muted-foreground"
                >
                  +{specialties.length - 4}
                </Badge>
              )}
            </div>

            {/* Bio - 2 lines max */}
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {bio}
            </p>

            {/* View Profile Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile?.(id)}
                className="transition-all duration-200"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { AdvisorCard }
