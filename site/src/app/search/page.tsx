"use client"

import { Filter, Search, ShieldCheck } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import {
  AdvisorCard,
  type AdvisorCardProps,
  type AdvisorInfo,
  HeroSearchBar,
  ShortlistBar,
} from "@/components/composite"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ADVISOR_TYPE_OPTIONS } from "@/lib/constants/marketplace-taxonomy"
import { useShortlist } from "@/lib/shortlist-context"

type ListingsResponse = {
  success: boolean
  data?: {
    items: Array<{
      id: string
      name: string
      credentials: string[]
      avatar: string | null
      specialties: string[]
      specialtySlugs: string[]
      rating: number | null
      reviewCount: number
      location: {
        suburb: string | null
        state: string | null
        postcode: string | null
      } | null
      bio: string | null
      verified: boolean
      verificationLevel: string
      acceptingStatus: string
      freeConsultation: boolean
      responseTimeHours: number | null
      responseRate: number | null
      feeModel: string | null
      serviceMode: string
      advisorType: string
    }>
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
  error?: { message?: string }
}

type FacetsResponse = {
  success: boolean
  data?: {
    advisorType: Array<{ value: string; count: number }>
    specialty: Array<{ slug: string; name: string; count: number }>
    state: Array<{ value: string; count: number }>
    acceptingStatus: Array<{ value: string; count: number }>
  }
}

type Filters = {
  advisorType: string
  specialty: string
  state: string
  minRating: number
  keyword: string
  sort: "rating_desc" | "reviews_desc" | "newest"
  page: number
}

const PAGE_SIZE = 12

function formatLocation(
  location: { suburb: string | null; state: string | null } | null
): string {
  if (!location) return "Australia"
  if (location.suburb && location.state) return `${location.suburb}, ${location.state}`
  if (location.state) return location.state
  if (location.suburb) return location.suburb
  return "Australia"
}

function mapListingToCard(
  listing: NonNullable<NonNullable<ListingsResponse["data"]>["items"]>[number]
): Omit<AdvisorCardProps, "onViewProfile"> {
  const availability: AdvisorCardProps["availability"] =
    listing.acceptingStatus === "taking_clients"
      ? "taking-clients"
      : listing.acceptingStatus === "waitlist"
        ? "waitlist"
        : "not-accepting"

  return {
    id: listing.id,
    name: listing.name,
    avatar: listing.avatar || undefined,
    credentials: listing.credentials.join(", "),
    specialties: listing.specialties,
    rating: listing.rating ?? 0,
    reviewCount: listing.reviewCount,
    location: formatLocation(listing.location),
    bio: listing.bio || "No profile bio available yet.",
    verified: listing.verified,
    freeConsult: listing.freeConsultation,
    availability,
    responseRate: listing.responseRate ?? undefined,
    avgResponseTime:
      listing.responseTimeHours && listing.responseTimeHours > 0
        ? `${listing.responseTimeHours}h`
        : undefined,
    feeDisplay: listing.feeModel
      ? listing.feeModel.replaceAll("_", " ")
      : undefined,
  }
}

function formatAdvisorTypeLabel(value: string): string {
  const option = ADVISOR_TYPE_OPTIONS.find((item) => item.value === value)
  return option?.label || value.replaceAll("_", " ")
}

function parseInitialFilters(searchParams: URLSearchParams): Filters {
  const advisorType =
    searchParams.get("advisor_type") ||
    searchParams.get("category") ||
    "all"
  const state =
    searchParams.get("state") ||
    extractStateFromLocation(searchParams.get("location") || undefined) ||
    "all"

  return {
    advisorType,
    specialty: searchParams.get("specialty") || "all",
    state,
    minRating: Number(searchParams.get("min_rating") || "0") || 0,
    keyword: searchParams.get("q") || "",
    sort: (searchParams.get("sort") as Filters["sort"]) || "rating_desc",
    page: Number(searchParams.get("page") || "1") || 1,
  }
}

function buildQuery(filters: Filters): string {
  const params = new URLSearchParams()
  params.set("page", String(filters.page))
  params.set("pageSize", String(PAGE_SIZE))
  params.set("sort", filters.sort)
  if (filters.advisorType !== "all") params.set("advisor_type", filters.advisorType)
  if (filters.specialty !== "all") params.set("specialty", filters.specialty)
  if (filters.state !== "all") params.set("state", filters.state)
  if (filters.minRating > 0) params.set("min_rating", String(filters.minRating))
  if (filters.keyword.trim()) params.set("q", filters.keyword.trim())
  return params.toString()
}

function extractStateFromLocation(locationInput?: string): string | null {
  if (!locationInput) return null
  const match = locationInput.toUpperCase().match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/)
  return match?.[1] || null
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = React.useState<Filters>(() =>
    parseInitialFilters(new URLSearchParams(searchParams.toString()))
  )
  const [advisors, setAdvisors] = React.useState<Omit<AdvisorCardProps, "onViewProfile">[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [facets, setFacets] = React.useState<NonNullable<FacetsResponse["data"]>>({
    advisorType: [],
    specialty: [],
    state: [],
    acceptingStatus: [],
  })
  const [pagination, setPagination] = React.useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  })

  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist()

  React.useEffect(() => {
    setFilters(parseInitialFilters(new URLSearchParams(searchParams.toString())))
  }, [searchParams])

  React.useEffect(() => {
    const params = new URLSearchParams()
    params.set("page", String(filters.page))
    if (filters.sort !== "rating_desc") params.set("sort", filters.sort)
    if (filters.advisorType !== "all") params.set("advisor_type", filters.advisorType)
    if (filters.specialty !== "all") params.set("specialty", filters.specialty)
    if (filters.state !== "all") params.set("state", filters.state)
    if (filters.minRating > 0) params.set("min_rating", String(filters.minRating))
    if (filters.keyword.trim()) params.set("q", filters.keyword.trim())
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [filters, router])

  React.useEffect(() => {
    const controller = new AbortController()
    const query = buildQuery(filters)

    async function load() {
      try {
        setIsLoading(true)
        setLoadError(null)

        const [listingsRes, facetsRes] = await Promise.all([
          fetch(`/api/listings?${query}`, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch(`/api/listings/facets?${query}`, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ])

        const listingsPayload = (await listingsRes.json()) as ListingsResponse
        if (!listingsRes.ok || !listingsPayload.success || !listingsPayload.data) {
          throw new Error(listingsPayload.error?.message || "Failed to load advisors")
        }

        const facetsPayload = (await facetsRes.json()) as FacetsResponse
        setFacets(
          facetsPayload.success && facetsPayload.data
            ? facetsPayload.data
            : { advisorType: [], specialty: [], state: [], acceptingStatus: [] }
        )

        setAdvisors(listingsPayload.data.items.map(mapListingToCard))
        setPagination({
          page: listingsPayload.data.pagination.page,
          totalPages: listingsPayload.data.pagination.totalPages,
          totalItems: listingsPayload.data.pagination.totalItems,
        })
      } catch (error) {
        if (controller.signal.aborted) return
        setAdvisors([])
        setLoadError(
          error instanceof Error ? error.message : "Unable to load advisor listings."
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [filters])

  const advisorDataMap = React.useMemo(() => {
    const map = new Map<string, AdvisorInfo>()
    advisors.forEach((advisor) => {
      map.set(advisor.id, {
        id: advisor.id,
        name: advisor.name,
        avatar: advisor.avatar,
      })
    })
    return map
  }, [advisors])

  const handleSearch = (query: {
    category?: string
    location?: string
    keyword?: string
  }) => {
    setFilters((prev) => ({
      ...prev,
      advisorType:
        query.category && query.category !== "all" ? query.category : prev.advisorType,
      state: extractStateFromLocation(query.location) || prev.state,
      keyword: query.keyword ?? prev.keyword,
      page: 1,
    }))
  }

  return (
    <PublicLayout>
      <ShortlistBar advisorData={advisorDataMap} />

      <section className="border-b bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <HeroSearchBar
            categories={ADVISOR_TYPE_OPTIONS.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            onSearch={handleSearch}
            className="max-w-3xl"
          />
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="size-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Profession</p>
                  <Select
                    value={filters.advisorType}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, advisorType: value, page: 1 }))
                    }
                  >
                    <SelectTrigger aria-label="Filter by advisor profession">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All professions</SelectItem>
                      {facets.advisorType.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {formatAdvisorTypeLabel(item.value)} ({item.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Specialty</p>
                  <Select
                    value={filters.specialty}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, specialty: value, page: 1 }))
                    }
                  >
                    <SelectTrigger aria-label="Filter by specialty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All specialties</SelectItem>
                      {facets.specialty.map((item) => (
                        <SelectItem key={item.slug} value={item.slug}>
                          {item.name} ({item.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">State</p>
                  <Select
                    value={filters.state}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, state: value, page: 1 }))
                    }
                  >
                    <SelectTrigger aria-label="Filter by state">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All states</SelectItem>
                      {facets.state.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.value} ({item.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Minimum rating</span>
                    <span>{filters.minRating > 0 ? `${filters.minRating}+` : "Any"}</span>
                  </div>
                  <Slider
                    value={[filters.minRating]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, minRating: value[0], page: 1 }))
                    }
                    aria-label="Minimum rating"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      advisorType: "all",
                      specialty: "all",
                      state: "all",
                      minRating: 0,
                      page: 1,
                    }))
                  }
                >
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
                <span className="font-medium text-foreground">{pagination.totalItems}</span> advisors found
              </p>
              <Select
                value={filters.sort}
                onValueChange={(value: Filters["sort"]) =>
                  setFilters((prev) => ({ ...prev, sort: value, page: 1 }))
                }
              >
                <SelectTrigger className="w-[180px]" aria-label="Sort search results">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating_desc">Highest rated</SelectItem>
                  <SelectItem value="reviews_desc">Most reviews</SelectItem>
                  <SelectItem value="newest">Newest profiles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0" />
              Credentials can be checked on the ASIC Financial Advisers Register.
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  Loading advisor listings...
                </CardContent>
              </Card>
            ) : loadError ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <p className="text-foreground font-medium mb-2">Could not load advisors</p>
                  <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
                  <Button onClick={() => setFilters((prev) => ({ ...prev }))}>Try again</Button>
                </CardContent>
              </Card>
            ) : advisors.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <Search className="size-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-2">No advisors found</p>
                  <p className="text-sm text-muted-foreground">
                    Adjust your filters and try again.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {advisors.map((advisor) => (
                  <AdvisorCard
                    key={advisor.id}
                    {...advisor}
                    isFavorited={isInShortlist(advisor.id)}
                    onFavoriteToggle={(isFavorited) => {
                      if (isFavorited) addToShortlist(advisor.id)
                      else removeFromShortlist(advisor.id)
                    }}
                    onViewProfile={(id) => router.push(`/advisors/${id}`)}
                  />
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${Math.max(1, pagination.page - 1)}`}
                      onClick={(event) => {
                        event.preventDefault()
                        if (pagination.page > 1) {
                          setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                        }
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={`?page=${page}`}
                          isActive={page === pagination.page}
                          onClick={(event) => {
                            event.preventDefault()
                            setFilters((prev) => ({ ...prev, page }))
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${Math.min(pagination.totalPages, pagination.page + 1)}`}
                      onClick={(event) => {
                        event.preventDefault()
                        if (pagination.page < pagination.totalPages) {
                          setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
