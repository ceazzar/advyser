"use client"

import {
  BadgeCheck,
  Calendar,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { use } from "react"

import { AdvisorMiniCard,StickyMobileCTA } from "@/components/composite"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type ListingDetail = {
  id: string
  name: string
  headline: string | null
  bio: string | null
  avatar: string | null
  yearsExperience: number | null
  businessName: string | null
  website: string | null
  email: string | null
  phone: string | null
  address: {
    suburb: string | null
    state: string | null
  } | null
  advisorType: string
  feeModel: string | null
  freeConsultation: boolean
  responseTimeHours: number | null
  verified: boolean
  verificationLevel: string
  rating: number | null
  reviewCount: number
  credentials: Array<{
    afslNumber: string | null
    asicRepNumber: string | null
    verificationStatus: string
    asicRegisterUrl: string | null
  }>
  qualifications: Array<{
    name: string
    abbreviation: string
    issuingBody: string | null
  }>
  specialties: Array<{
    name: string
    slug: string
  }>
  services: Array<{
    name: string
    description: string | null
    priceText: string | null
    durationMinutes: number | null
  }>
  recentReviews: Array<{
    id: string
    rating: number
    title: string | null
    body: string | null
    createdAt: string
    consumerDisplayName: string | null
  }>
}

type ListingDetailResponse = {
  success: boolean
  data?: ListingDetail
  error?: {
    message?: string
  }
}

type ListingsSearchResponse = {
  success: boolean
  data?: {
    items: Array<{
      id: string
      name: string
      avatar: string | null
      rating: number | null
      reviewCount: number
      location: {
        suburb: string | null
        state: string | null
      } | null
      specialties: string[]
    }>
  }
}

function formatLocation(address: { suburb: string | null; state: string | null } | null): string {
  if (!address) return "Australia"
  if (address.suburb && address.state) return `${address.suburb}, ${address.state}`
  if (address.state) return address.state
  if (address.suburb) return address.suburb
  return "Australia"
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatAdvisorType(advisorType: string): string {
  return advisorType.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatFeeModel(feeModel: string | null): string {
  if (!feeModel) return "Fee model not disclosed"
  return feeModel.replaceAll("_", " ")
}

export default function AdvisorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const listingId = resolvedParams.slug
  const mainCtaRef = React.useRef<HTMLButtonElement>(null)

  const [listing, setListing] = React.useState<ListingDetail | null>(null)
  const [similar, setSimilar] = React.useState<
    Array<{
      id: string
      slug: string
      name: string
      avatar?: string
      rating: number
      reviewCount: number
      location: string
      primarySpecialty: string
      matchReason: string
    }>
  >([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadListing() {
      try {
        setIsLoading(true)
        setLoadError(null)

        const detailResponse = await fetch(`/api/listings/${listingId}`, {
          signal: controller.signal,
          cache: "no-store",
        })
        const detailPayload = (await detailResponse.json()) as ListingDetailResponse

        if (!detailResponse.ok || !detailPayload.success || !detailPayload.data) {
          throw new Error(detailPayload.error?.message || "Advisor listing not found")
        }

        const detail = detailPayload.data
        setListing(detail)

        const searchParams = new URLSearchParams({
          page: "1",
          pageSize: "8",
          sort: "rating_desc",
        })
        if (detail.advisorType) {
          searchParams.set("advisor_type", detail.advisorType)
        }

        const similarResponse = await fetch(`/api/listings?${searchParams.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!similarResponse.ok) {
          setSimilar([])
          return
        }

        const similarPayload = (await similarResponse.json()) as ListingsSearchResponse
        const mapped = (similarPayload.data?.items || [])
          .filter((candidate) => candidate.id !== detail.id)
          .slice(0, 4)
          .map((candidate) => ({
            id: candidate.id,
            slug: candidate.id,
            name: candidate.name,
            avatar: candidate.avatar || undefined,
            rating: candidate.rating ?? 0,
            reviewCount: candidate.reviewCount,
            location: formatLocation(candidate.location),
            primarySpecialty: candidate.specialties[0] || "General Advice",
            matchReason: "Similar profile and service coverage",
          }))

        setSimilar(mapped)
      } catch (error) {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : "Unable to load advisor profile"
        setLoadError(message)
        setListing(null)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadListing()

    return () => controller.abort()
  }, [listingId])

  const handleRequestIntro = React.useCallback(() => {
    if (!listing) return
    router.push(`/request-intro?listingId=${listing.id}`)
  }, [listing, router])

  if (isLoading) {
    return (
      <PublicLayout>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            Loading advisor profile...
          </div>
        </section>
      </PublicLayout>
    )
  }

  if (loadError || !listing) {
    return (
      <PublicLayout>
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Advisor Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {loadError || "We couldn't load this advisor profile."}
            </p>
            <Button onClick={() => router.push("/search")}>Back to Search</Button>
          </div>
        </section>
      </PublicLayout>
    )
  }

  const location = formatLocation(listing.address)
  const topCredentials = listing.credentials
    .map((credential) => credential.asicRepNumber || credential.afslNumber)
    .filter(Boolean)
    .slice(0, 2)

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative shrink-0 self-center sm:self-start">
                  <Avatar className="size-32 md:size-40">
                    {listing.avatar && <AvatarImage src={listing.avatar} alt={listing.name} />}
                    <AvatarFallback className="text-4xl">{getInitials(listing.name)}</AvatarFallback>
                  </Avatar>
                  {listing.verified && (
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1 shadow-md">
                      <BadgeCheck className="size-8 fill-primary text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">{listing.name}</h1>
                    {listing.verified && <Badge status="verified">Verified</Badge>}
                  </div>

                  <p className="mt-1 text-lg text-muted-foreground">
                    {formatAdvisorType(listing.advisorType)}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-medium">
                      {(listing.rating ?? 0).toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-muted-foreground">
                    <MapPin className="size-5" />
                    <span>{location}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {topCredentials.map((credential) => (
                      <Badge key={credential} className="text-xs border border-border bg-background text-foreground">
                        {credential}
                      </Badge>
                    ))}
                    <Badge className="text-xs border border-border bg-background text-foreground">
                      {formatFeeModel(listing.feeModel)}
                    </Badge>
                    {listing.freeConsultation && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                        Free consultation
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-80 xl:w-96">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Connect with {listing.name.split(" ")[0]}
                  </h3>
                  <Button ref={mainCtaRef} className="w-full" size="lg" onClick={handleRequestIntro}>
                    <Calendar className="size-5 mr-2" />
                    Request Introduction
                  </Button>
                  <p className="mt-3 text-sm text-muted-foreground text-center">
                    {listing.responseTimeHours
                      ? `Usually responds within ${listing.responseTimeHours} hours`
                      : "Response times vary by advisor"}
                  </p>

                  <Separator className="my-6" />

                  <div className="space-y-3 text-sm">
                    {listing.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="size-4 text-primary shrink-0" />
                        <a href={`mailto:${listing.email}`} className="hover:text-primary">
                          {listing.email}
                        </a>
                      </div>
                    )}
                    {listing.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="size-4 text-primary shrink-0" />
                        <a href={`tel:${listing.phone}`} className="hover:text-primary">
                          {listing.phone}
                        </a>
                      </div>
                    )}
                    {listing.website && (
                      <div className="flex items-center gap-3">
                        <ExternalLink className="size-4 text-primary shrink-0" />
                        <a href={listing.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate">
                          {listing.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 grid gap-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.bio || "This advisor has not added a public bio yet."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {listing.specialties.map((specialty) => (
                <Badge key={specialty.slug} className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                  {specialty.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Services</h2>
            <div className="grid gap-4">
              {listing.services.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-muted-foreground">
                    Service details will be published soon.
                  </CardContent>
                </Card>
              ) : (
                listing.services.map((service) => (
                  <Card key={service.name}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{service.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {service.description || "No additional description available."}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {service.priceText || "Contact for pricing"}
                          {service.durationMinutes ? ` • ${service.durationMinutes} min` : ""}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Reviews</h2>
            <div className="grid gap-4">
              {listing.recentReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-muted-foreground">
                    No published reviews yet.
                  </CardContent>
                </Card>
              ) : (
                listing.recentReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="font-medium text-foreground">
                          {review.consumerDisplayName || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span>{review.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                      {review.title && <p className="font-medium text-foreground mb-1">{review.title}</p>}
                      <p className="text-muted-foreground">
                        {review.body || "Review details are not available."}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {similar.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">More Like This</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {similar.map((advisor) => (
                  <AdvisorMiniCard
                    key={advisor.id}
                    id={advisor.id}
                    slug={advisor.slug}
                    name={advisor.name}
                    avatar={advisor.avatar}
                    rating={advisor.rating}
                    reviewCount={advisor.reviewCount}
                    location={advisor.location}
                    primarySpecialty={advisor.primarySpecialty}
                    matchReason={advisor.matchReason}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <StickyMobileCTA
        advisorName={listing.name}
        advisorImage={listing.avatar || undefined}
        onRequestIntro={handleRequestIntro}
        ctaText="Request Intro"
        targetRef={mainCtaRef}
      />
    </PublicLayout>
  )
}
