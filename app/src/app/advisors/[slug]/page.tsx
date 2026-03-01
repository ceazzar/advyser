"use client"

import {
  Activity,
  BadgeCheck,
  Calendar,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { use } from "react"

import { AdvisorMiniCard,StickyMobileCTA } from "@/components/composite"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Avatar, AvatarFallback, AvatarImage, getInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type ListingDetail = {
  id: string
  name: string
  headline: string | null
  bio: string | null
  whatIHelpWith: string | null
  whoIDontWorkWith: string | null
  approachToAdvice: string | null
  avatar: string | null
  yearsExperience: number | null
  businessName: string | null
  website: string | null
  email: string | null
  phone: string | null
  contactUnlocked: boolean
  address: {
    suburb: string | null
    state: string | null
  } | null
  advisorType: string
  serviceMode: string
  feeModel: string | null
  minimumInvestment: number | null
  freeConsultation: boolean
  responseTimeHours: number | null
  responseRate: number | null
  verified: boolean
  verificationLevel: string
  profileCompletenessScore: number | null
  clientDemographics: string[]
  trustDisclosures: Array<{
    id: string
    disclosureKind: string
    headline: string
    disclosureText: string
  }>
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
    reviewReply: {
      body: string
      publishedAt: string | null
      responderName: string | null
    } | null
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

function formatServiceMode(serviceMode: string): string {
  return serviceMode.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function AdvisorProfileLoadingState() {
  return (
    <PublicLayout>
      <div aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading advisor profile</span>

        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Skeleton className="size-32 md:size-40 rounded-full shrink-0 self-center sm:self-start" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-10 w-64 max-w-full" />
                    <Skeleton className="h-6 w-44 max-w-full" />
                    <Skeleton className="h-5 w-40 max-w-full" />
                    <Skeleton className="h-5 w-52 max-w-full" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-32 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-80 xl:w-96">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-11 w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2 rounded-lg border border-border p-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 grid gap-10">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={`summary-${index}`}>
                  <CardContent className="p-5 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={`fit-${index}`}>
                  <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-36" />
              <div className="grid gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card key={`block-${index}`}>
                    <CardContent className="p-6 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
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
    if (!listing.contactUnlocked) {
      router.push(`/signup?redirect=${encodeURIComponent(`/advisors/${listingId}`)}`)
      return
    }
    router.push(`/request-intro?listingId=${listing.id}`)
  }, [listing, listingId, router])

  if (isLoading) {
    return <AdvisorProfileLoadingState />
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
  const authRedirect = `/advisors/${listingId}`
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
                    {listing.contactUnlocked ? "Request Introduction" : "Create account to contact"}
                  </Button>
                  {listing.contactUnlocked ? (
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                      {listing.responseTimeHours
                        ? `Usually responds within ${listing.responseTimeHours} hours`
                        : "Response times vary by advisor"}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                      Sign up or log in to unlock direct contact details and intro requests.
                    </p>
                  )}

                  <div className="mt-4 rounded-lg border border-border p-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response rate</span>
                      <span className="font-medium">
                        {listing.responseRate !== null ? `${listing.responseRate}%` : "Not disclosed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Service mode</span>
                      <span className="font-medium">{formatServiceMode(listing.serviceMode)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Min investment</span>
                      <span className="font-medium">
                        {listing.minimumInvestment !== null
                          ? `AUD ${listing.minimumInvestment.toLocaleString()}`
                          : "Not disclosed"}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {listing.contactUnlocked ? (
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
                  ) : (
                    <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Contact details are hidden until you create a free account.
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Button asChild size="sm">
                          <Link href={`/signup?redirect=${encodeURIComponent(authRedirect)}`}>
                            Sign up
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/login?redirect=${encodeURIComponent(authRedirect)}`}>
                            Log in
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
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
            {listing.approachToAdvice && (
              <p className="text-muted-foreground leading-relaxed mt-3">
                <span className="font-medium text-foreground">Approach:</span>{" "}
                {listing.approachToAdvice}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                  <Activity className="size-3.5" />
                  Profile completeness
                </p>
                <p className="text-xl font-semibold">
                  {listing.profileCompletenessScore !== null
                    ? `${listing.profileCompletenessScore}%`
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Advisor type
                </p>
                <p className="text-xl font-semibold">{formatAdvisorType(listing.advisorType)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Experience
                </p>
                <p className="text-xl font-semibold">
                  {listing.yearsExperience !== null
                    ? `${listing.yearsExperience} years`
                    : "Not disclosed"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Best fit</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {listing.whatIHelpWith || "No fit details provided yet."}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Not ideal for</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {listing.whoIDontWorkWith || "No exclusions disclosed."}
              </CardContent>
            </Card>
          </div>

          {listing.trustDisclosures.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Trust & Transparency</h2>
              <div className="grid gap-4">
                {listing.trustDisclosures.map((disclosure) => (
                  <Card key={disclosure.id}>
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                        <Shield className="size-3.5" />
                        {disclosure.disclosureKind.replaceAll("_", " ")}
                      </p>
                      <p className="font-semibold text-foreground mb-1">{disclosure.headline}</p>
                      <p className="text-sm text-muted-foreground">{disclosure.disclosureText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {listing.clientDemographics.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Client Types</h2>
              <div className="flex flex-wrap gap-2">
                {listing.clientDemographics.map((demographic) => (
                  <Badge
                    key={demographic}
                    className="border border-border bg-background text-foreground"
                  >
                    {demographic.replaceAll("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
                      {review.reviewReply && (
                        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            Advisor reply
                          </p>
                          <p className="text-sm text-foreground">{review.reviewReply.body}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {review.reviewReply.responderName || "Advisor"}{" "}
                            {review.reviewReply.publishedAt
                              ? `• ${formatDate(review.reviewReply.publishedAt)}`
                              : ""}
                          </p>
                        </div>
                      )}
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
        ctaText={listing.contactUnlocked ? "Request Intro" : "Sign up to contact"}
        targetRef={mainCtaRef}
      />
    </PublicLayout>
  )
}
