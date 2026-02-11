"use client"

import * as React from "react"
import { MapPin, Star, Clock, DollarSign, Users, Activity, Target, UserCheck, Zap, Users2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"

/**
 * Icon Optical Sizing Guide
 * -------------------------
 * Lucide icons have different visual weights. Stroke-only icons appear lighter
 * than filled icons at the same pixel size. To achieve optical balance:
 *
 * Baseline sizes:
 * - Filled icons (Star filled): size-4 (16px)
 * - Stroke icons inline with text: size-[18px] for optical parity with filled size-4
 * - Small badge/pill icons: size-3 (12px) - context makes weight less critical
 * - Button icons: size-4 standard
 *
 * Icon categories used here:
 * - FILLED: Star (when filled with amber)
 * - STROKE: MapPin, Clock, DollarSign, Users, Activity, Target, UserCheck, Zap, Users2
 *
 * The 18px size for inline stroke icons compensates for the ~2px visual weight
 * difference between stroke (1.5-2px stroke width) and filled icons.
 */
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VerificationBadge } from "@/components/composite/verification-badge"
import { FavoriteButton } from "@/components/composite/favorite-button"

/** V.1.1.5: Review snippet for advisor card */
export interface ReviewSnippet {
  text: string
  reviewerName: string
  date: string
}

/** V.2.2.2: Match reason explanation */
export interface MatchReason {
  icon: 'location' | 'specialty' | 'availability' | 'rating' | 'response' | 'price'
  text: string
  strength: 'strong' | 'moderate'
}

/** V.2.2.4: Client demographic matching for social proof */
export type ClientDemographic =
  | "first-home-buyers"
  | "retirees"
  | "business-owners"
  | "young-professionals"
  | "families"
  | "high-net-worth"
  | "pre-retirees"
  | "self-employed"

/** V.2.2.4: Demographic display labels */
export const demographicLabels: Record<ClientDemographic, string> = {
  "first-home-buyers": "Popular with first-home buyers",
  "retirees": "Trusted by retirees",
  "business-owners": "Small business favorite",
  "young-professionals": "Popular with young professionals",
  "families": "Family favorite",
  "high-net-worth": "Trusted by high-net-worth clients",
  "pre-retirees": "Popular with pre-retirees",
  "self-employed": "Self-employed favorite",
}

/** V.1.2.4: Availability status */
export type AvailabilityStatus = "taking-clients" | "waitlist" | "not-accepting"

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
  /** V.1.1.1: Whether advisor was active recently */
  lastActive?: Date | string
  /** V.1.1.5: Featured review snippet */
  featuredReview?: ReviewSnippet
  /** V.1.2.4: Availability status */
  availability?: AvailabilityStatus
  /** V.1.2.5: Fee information */
  feeDisplay?: string
  /** V.1.2.5: Whether initial consultation is free */
  freeConsult?: boolean
  /** Whether this advisor is favorited by the current user */
  isFavorited?: boolean
  /** Callback when favorite state is toggled */
  onFavoriteToggle?: (isFavorited: boolean) => void
  /** V.2.2.2: Match reasons explaining why this advisor was recommended */
  matchReasons?: MatchReason[]
  /** V.2.2.2: Whether to show match reasons section */
  showMatchReasons?: boolean
  /** V.2.2.4: Client demographics this advisor is popular with */
  clientDemographics?: ClientDemographic[]
  /** V.2.2.4: Which demographic badge to display (if matching search context) */
  popularWithDemographic?: ClientDemographic
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
            className="size-4 fill-amber-500/90 text-amber-500/90"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="size-4 text-muted-foreground/30" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="size-4 fill-amber-500/90 text-amber-500/90" />
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

/** V.1.1.1: Check if advisor was active within the last 7 days */
function isRecentlyActive(lastActive: Date | string | undefined): boolean {
  if (!lastActive) return false

  const date = typeof lastActive === "string" ? new Date(lastActive) : lastActive

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return false
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return date >= sevenDaysAgo
}

/** V.1.1.1: Active recently badge */
function ActiveBadge() {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium"
      role="status"
      aria-label="Advisor was active this week"
    >
      <Activity className="size-3" aria-hidden="true" />
      <span>Active this week</span>
    </div>
  )
}

/** V.1.2.4: Availability indicator */
function AvailabilityIndicator({ status }: { status: AvailabilityStatus }) {
  const config = {
    "taking-clients": {
      label: "Taking new clients",
      className: "bg-green-50 text-green-700",
      icon: Users,
    },
    "waitlist": {
      label: "Waitlist only",
      className: "bg-yellow-50 text-yellow-800",
      icon: Users,
    },
    "not-accepting": {
      label: "Not accepting clients",
      className: "bg-gray-100 text-gray-600",
      icon: Users,
    },
  }

  const { label, className, icon: Icon } = config[status]

  return (
    <div
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", className)}
      role="status"
      aria-label={`Advisor status: ${label}`}
    >
      <Icon className="size-3" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

/** V.1.2.5: Fee display */
function FeeDisplay({ feeDisplay, freeConsult }: { feeDisplay?: string; freeConsult?: boolean }) {
  if (!feeDisplay && !freeConsult) return null

  // Strip "From" if already included to prevent duplication
  const cleanFee = feeDisplay?.replace(/^From\s+/i, '').trim()

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {/* Optical sizing: stroke icon at 18px matches filled icon visual weight at 16px */}
      <DollarSign className="size-[18px] shrink-0" />
      <span>
        {freeConsult && "Free initial consult"}
        {freeConsult && cleanFee && " • "}
        {cleanFee && `From ${cleanFee}`}
      </span>
    </div>
  )
}

/** V.2.2.2: Icon mapping for match reasons */
const reasonIcons = {
  location: MapPin,
  specialty: Target,
  availability: UserCheck,
  rating: Star,
  response: Zap,
  price: DollarSign,
}

/** V.2.2.2: Match reasons display */
function MatchReasonsDisplay({ reasons }: { reasons: MatchReason[] }) {
  // Only show up to 3 reasons
  const displayReasons = reasons.slice(0, 3)

  return (
    <div className="mt-2.5">
      <p className="text-xs font-medium text-muted-foreground mb-1.5">Why this match</p>
      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
        {displayReasons.map((reason, index) => {
          const Icon = reasonIcons[reason.icon]
          return (
            <div
              key={index}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                reason.strength === 'strong'
                  ? "bg-primary/10 text-primary font-medium"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="size-3" aria-hidden="true" />
              <span>{reason.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** V.2.2.4: Demographic badge for social proof */
function DemographicBadge({ demographic }: { demographic: ClientDemographic }) {
  const label = demographicLabels[demographic]

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs"
      role="status"
      aria-label={label}
    >
      <Users2 className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

/** V.1.1.5: Review snippet display */
function ReviewSnippetDisplay({ review }: { review: ReviewSnippet }) {
  // Truncate to ~80 chars at word boundary
  let truncatedText = review.text
  if (review.text.length > 80) {
    // Truncate at last space before 77 chars to avoid cutting words
    const cutoff = review.text.slice(0, 77).lastIndexOf(' ')
    truncatedText = review.text.slice(0, cutoff > 0 ? cutoff : 77) + "..."
  }

  return (
    <div className="mt-2.5 p-2.5 rounded-lg bg-muted/50 border border-border/50">
      <p className="text-sm text-muted-foreground italic line-clamp-2">
        &ldquo;{truncatedText}&rdquo;
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        — {review.reviewerName}, {review.date}
      </p>
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
  lastActive,
  featuredReview,
  availability,
  feeDisplay,
  freeConsult,
  isFavorited = false,
  onFavoriteToggle,
  matchReasons,
  showMatchReasons = true,
  clientDemographics,
  popularWithDemographic,
  className,
  onViewProfile,
}: AdvisorCardProps) {
  const recentlyActive = isRecentlyActive(lastActive)

  return (
    <Card className={cn("relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5", className)}>
      {/* Favorite Button - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          size="sm"
          isFavorited={isFavorited}
          onToggle={onFavoriteToggle}
        />
      </div>

      <CardContent className="p-6">
        {/* V.1.6.2: Responsive layout - stack on mobile, side-by-side on larger screens */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar Section - 80px, centered on mobile */}
          <div className="relative shrink-0 self-center sm:self-start">
            <Avatar className="size-20">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback className="size-20 text-xl">{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Content Section - V.1.4.6: Consistent spacing with space-y-2.5 */}
          <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
            {/* Name, Credentials, and Activity Badge */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {credentials && (
                <span className="text-sm text-muted-foreground">{credentials}</span>
              )}
              {/* V.1.1.1: Active recently badge */}
              {recentlyActive && <ActiveBadge />}
            </div>

            {/* Rating */}
            <div className="flex justify-center sm:justify-start">
              <StarRating rating={rating} reviewCount={reviewCount} />
            </div>

            {/* V.1.2.4: Availability + V.1.2.5: Fees row */}
            {(availability || feeDisplay || freeConsult) && (
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                {availability && <AvailabilityIndicator status={availability} />}
                {(feeDisplay || freeConsult) && (
                  <FeeDisplay feeDisplay={feeDisplay} freeConsult={freeConsult} />
                )}
              </div>
            )}

            {/* Location - stroke icon uses 18px for optical parity with 16px filled icons */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground justify-center sm:justify-start">
              <MapPin className="size-[18px] shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            {/* Response Rate - stroke icon uses 18px for optical parity */}
            {(avgResponseTime || responseRate) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground justify-center sm:justify-start">
                <Clock className="size-[18px] shrink-0" />
                <span>
                  {avgResponseTime && `Responds within ${avgResponseTime}`}
                  {avgResponseTime && responseRate && " • "}
                  {responseRate && `${responseRate}% response rate`}
                </span>
              </div>
            )}

            {/* ASIC Verification Badge */}
            {verified && (
              <div className="flex justify-center sm:justify-start">
                <VerificationBadge
                  licenseNumber={licenseNumber}
                  variant="full"
                />
              </div>
            )}

            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
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

            {/* V.2.2.4: Demographic social proof badge */}
            {popularWithDemographic && (
              <div className="flex justify-center sm:justify-start">
                <DemographicBadge demographic={popularWithDemographic} />
              </div>
            )}

            {/* Bio - 2 lines max */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bio}
            </p>

            {/* V.1.1.5: Featured Review Snippet */}
            {featuredReview && <ReviewSnippetDisplay review={featuredReview} />}

            {/* V.2.2.2: Match Reasons */}
            {showMatchReasons && matchReasons && matchReasons.length > 0 && (
              <MatchReasonsDisplay reasons={matchReasons} />
            )}

            {/* View Profile Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile?.(id)}
                className="transition-all duration-200 w-full sm:w-auto"
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
