"use client"

import * as React from "react"
import { X, Plus, Star, MapPin, Clock, DollarSign, ShieldCheck, Calendar, MessageSquare, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * V.2.2.1: Advisor Comparison Tool
 * Side-by-side comparison component for up to 3 advisors
 *
 * Icon Optical Sizing:
 * - Filled icons (Star filled): size-4 (16px)
 * - Stroke icons inline with text: size-[18px] for optical parity
 * - Button icons: size-4 (16px) standard
 */

export interface AdvisorForComparison {
  id: string
  name: string
  avatar?: string
  credentials?: string
  rating: number
  reviewCount: number
  location: string
  specialties: string[]
  verified: boolean
  licenseNumber?: string
  responseRate?: number
  avgResponseTime?: string
  feeDisplay?: string
  freeConsult?: boolean
  yearsExperience?: number
}

export interface AdvisorComparisonProps {
  advisors: AdvisorForComparison[]
  onRemove: (id: string) => void
  onClose: () => void
  onAddAdvisor?: () => void
  onViewProfile?: (id: string) => void
  onContact?: (id: string) => void
  /** User's specialties for match highlighting */
  userSpecialties?: string[]
  className?: string
}

/** V.2.2.1: Compact star rating for comparison */
function CompactStarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount})</span>
    </div>
  )
}

/** V.2.2.1: Row wrapper for comparison table */
function ComparisonRow({
  label,
  className,
  children,
  isEven = false,
}: {
  label: string
  className?: string
  children: React.ReactNode
  isEven?: boolean
}) {
  return (
    <div
      className={cn(
        "grid gap-4 py-3 px-4",
        isEven ? "bg-muted/30" : "bg-transparent",
        className
      )}
      style={{
        gridTemplateColumns: `140px repeat(${React.Children.count(children)}, 1fr)`,
      }}
    >
      <div className="text-sm font-medium text-muted-foreground flex items-center">
        {label}
      </div>
      {children}
    </div>
  )
}

/** V.2.2.1: Cell wrapper with optional highlight */
function ComparisonCell({
  isHighlighted = false,
  className,
  children,
}: {
  isHighlighted?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "text-sm flex items-center",
        isHighlighted && "font-medium text-green-600",
        className
      )}
    >
      {children}
    </div>
  )
}

/** V.2.2.1: Specialty match indicator */
function SpecialtyMatch({
  specialty,
  isMatch,
}: {
  specialty: string
  isMatch: boolean
}) {
  return (
    <Badge
      size="sm"
      className={cn(
        isMatch
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-muted text-muted-foreground"
      )}
    >
      {specialty}
    </Badge>
  )
}

/** V.2.2.1: ASIC verification cell */
function VerificationCell({
  verified,
  licenseNumber,
}: {
  verified: boolean
  licenseNumber?: string
}) {
  if (!verified) {
    return <span className="text-muted-foreground">Not verified</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1.5 text-green-600 cursor-help">
          <ShieldCheck className="size-4 fill-green-600/20" />
          <span className="font-medium">Verified</span>
          {licenseNumber && (
            <span className="text-green-600/70">#{licenseNumber}</span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">
          This advisor&apos;s license has been verified on the ASIC Financial Advisers Register.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

/** V.2.2.1: Empty slot for adding advisor */
function EmptySlot({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="flex-1 min-w-[200px] max-w-[280px]">
      <Card className="h-full border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={onAdd}
            className="flex flex-col h-auto gap-2 py-8"
          >
            <Plus className="size-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Add advisor
            </span>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Compare up to 3 advisors side by side
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/** V.2.2.1: Empty state when no advisors selected */
function EmptyState({ onAddAdvisor }: { onAddAdvisor?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Plus className="size-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Compare Advisors</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Add 2 or more advisors to compare them side by side. View their qualifications,
        ratings, specialties, and more at a glance.
      </p>
      <Button onClick={onAddAdvisor}>
        <Plus className="size-4 mr-2" />
        Add First Advisor
      </Button>
    </div>
  )
}

/** V.2.2.1: Need more advisors prompt */
function NeedMoreAdvisors({
  advisorCount,
  onAddAdvisor,
}: {
  advisorCount: number
  onAddAdvisor?: () => void
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Plus className="size-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {advisorCount === 0
              ? "Add advisors to compare"
              : "Add at least one more advisor to compare"}
          </p>
          <p className="text-xs text-muted-foreground">
            Compare up to 3 advisors side by side
          </p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onAddAdvisor}>
        <Plus className="size-4 mr-1" />
        Add Advisor
      </Button>
    </div>
  )
}

/** V.2.2.1: Find the best value for highlighting */
function getBestRating(advisors: AdvisorForComparison[]): string | null {
  if (advisors.length < 2) return null
  const maxRating = Math.max(...advisors.map((a) => a.rating))
  const best = advisors.find((a) => a.rating === maxRating)
  return best?.id || null
}

function getBestResponseRate(advisors: AdvisorForComparison[]): string | null {
  if (advisors.length < 2) return null
  const rates = advisors.filter((a) => a.responseRate !== undefined)
  if (rates.length < 2) return null
  const maxRate = Math.max(...rates.map((a) => a.responseRate!))
  const best = rates.find((a) => a.responseRate === maxRate)
  return best?.id || null
}

function getBestExperience(advisors: AdvisorForComparison[]): string | null {
  if (advisors.length < 2) return null
  const exp = advisors.filter((a) => a.yearsExperience !== undefined)
  if (exp.length < 2) return null
  const maxExp = Math.max(...exp.map((a) => a.yearsExperience!))
  const best = exp.find((a) => a.yearsExperience === maxExp)
  return best?.id || null
}

function AdvisorComparison({
  advisors,
  onRemove,
  onClose,
  onAddAdvisor,
  onViewProfile,
  onContact,
  userSpecialties = [],
  className,
}: AdvisorComparisonProps) {
  const bestRatingId = getBestRating(advisors)
  const bestResponseRateId = getBestResponseRate(advisors)
  const bestExperienceId = getBestExperience(advisors)

  // Calculate column count including empty slots
  const displayCount = Math.max(advisors.length, 2)
  const emptySlots = Math.max(0, 3 - advisors.length)

  // If no advisors, show empty state
  if (advisors.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex-row items-center justify-between border-b pb-4">
          <h2 className="text-lg font-semibold">Compare Advisors</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-5" />
            <span className="sr-only">Close comparison</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <EmptyState onAddAdvisor={onAddAdvisor} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold">Compare Advisors</h2>
          <p className="text-sm text-muted-foreground">
            {advisors.length} of 3 advisors selected
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-5" />
          <span className="sr-only">Close comparison</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {/* Show prompt if only 1 advisor */}
        {advisors.length === 1 && (
          <div className="p-4 border-b">
            <NeedMoreAdvisors
              advisorCount={advisors.length}
              onAddAdvisor={onAddAdvisor}
            />
          </div>
        )}

        {/* Scrollable comparison area */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Sticky header row with avatar + name */}
            <div className="sticky top-0 z-10 bg-background border-b">
              <div
                className="grid gap-4 py-4 px-4"
                style={{
                  gridTemplateColumns: `140px repeat(${displayCount}, 1fr)`,
                }}
              >
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  Advisor
                </div>
                {advisors.map((advisor) => (
                  <div key={advisor.id} className="relative">
                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemove(advisor.id)}
                      className="absolute -top-1 -right-1 size-6 rounded-full bg-muted hover:bg-destructive hover:text-white"
                    >
                      <X className="size-3" />
                      <span className="sr-only">Remove {advisor.name}</span>
                    </Button>

                    {/* Avatar + Name */}
                    <div className="flex flex-col items-center text-center gap-2">
                      <Avatar className="size-16">
                        {advisor.avatar && (
                          <AvatarImage src={advisor.avatar} alt={advisor.name} />
                        )}
                        <AvatarFallback className="size-16 text-lg">
                          {getInitials(advisor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">{advisor.name}</h3>
                        {advisor.credentials && (
                          <span className="text-xs text-muted-foreground">
                            {advisor.credentials}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center justify-center"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddAdvisor}
                      className="border-dashed"
                    >
                      <Plus className="size-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison rows */}
            <div>
              {/* Rating & Reviews */}
              <ComparisonRow label="Rating" isEven={false}>
                {advisors.map((advisor) => (
                  <ComparisonCell
                    key={advisor.id}
                    isHighlighted={advisor.id === bestRatingId}
                  >
                    <CompactStarRating
                      rating={advisor.rating}
                      reviewCount={advisor.reviewCount}
                    />
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* Location - stroke icon uses 18px for optical parity */}
              <ComparisonRow label="Location" isEven={true}>
                {advisors.map((advisor) => (
                  <ComparisonCell key={advisor.id}>
                    <MapPin className="size-[18px] mr-1.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{advisor.location}</span>
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* Response Time & Rate - stroke icon uses 18px for optical parity */}
              <ComparisonRow label="Response Time" isEven={false}>
                {advisors.map((advisor) => (
                  <ComparisonCell
                    key={advisor.id}
                    isHighlighted={advisor.id === bestResponseRateId}
                  >
                    {advisor.avgResponseTime || advisor.responseRate ? (
                      <div className="flex items-center gap-1">
                        <Clock className="size-[18px] mr-1 text-muted-foreground shrink-0" />
                        <span>
                          {advisor.avgResponseTime && advisor.avgResponseTime}
                          {advisor.avgResponseTime && advisor.responseRate && " • "}
                          {advisor.responseRate && `${advisor.responseRate}%`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* Fee / Free Consult - stroke icon uses 18px for optical parity */}
              <ComparisonRow label="Fees" isEven={true}>
                {advisors.map((advisor) => (
                  <ComparisonCell key={advisor.id}>
                    {advisor.feeDisplay || advisor.freeConsult ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="size-[18px] mr-1 text-muted-foreground shrink-0" />
                        <span>
                          {advisor.freeConsult && (
                            <span className="text-green-600 font-medium">
                              Free consult
                            </span>
                          )}
                          {advisor.freeConsult && advisor.feeDisplay && " • "}
                          {advisor.feeDisplay && `From ${advisor.feeDisplay}`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* Years Experience - stroke icon uses 18px for optical parity */}
              <ComparisonRow label="Experience" isEven={false}>
                {advisors.map((advisor) => (
                  <ComparisonCell
                    key={advisor.id}
                    isHighlighted={advisor.id === bestExperienceId}
                  >
                    {advisor.yearsExperience ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-[18px] mr-1 text-muted-foreground shrink-0" />
                        <span>{advisor.yearsExperience} years</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* ASIC Verification */}
              <ComparisonRow label="ASIC Verified" isEven={true}>
                {advisors.map((advisor) => (
                  <ComparisonCell key={advisor.id}>
                    <VerificationCell
                      verified={advisor.verified}
                      licenseNumber={advisor.licenseNumber}
                    />
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* Specialties */}
              <ComparisonRow label="Specialties" isEven={false} className="py-4">
                {advisors.map((advisor) => (
                  <ComparisonCell key={advisor.id} className="items-start">
                    <div className="flex flex-wrap gap-1">
                      {advisor.specialties.slice(0, 5).map((specialty) => (
                        <SpecialtyMatch
                          key={specialty}
                          specialty={specialty}
                          isMatch={userSpecialties.includes(specialty)}
                        />
                      ))}
                      {advisor.specialties.length > 5 && (
                        <Badge size="sm" className="bg-muted text-muted-foreground">
                          +{advisor.specialties.length - 5}
                        </Badge>
                      )}
                    </div>
                  </ComparisonCell>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <ComparisonCell key={`empty-${i}`}>
                    <span className="text-muted-foreground">—</span>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              {/* CTA Buttons */}
              <div
                className="grid gap-4 py-4 px-4 border-t bg-muted/20"
                style={{
                  gridTemplateColumns: `140px repeat(${displayCount}, 1fr)`,
                }}
              >
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  Actions
                </div>
                {advisors.map((advisor) => (
                  <div key={advisor.id} className="flex flex-col gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onContact?.(advisor.id)}
                      className="w-full"
                    >
                      <MessageSquare className="size-4 mr-1.5" />
                      Contact
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile?.(advisor.id)}
                      className="w-full"
                    >
                      <ExternalLink className="size-4 mr-1.5" />
                      View Profile
                    </Button>
                  </div>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">—</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { AdvisorComparison }
