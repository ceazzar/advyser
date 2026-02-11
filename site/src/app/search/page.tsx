"use client"

import * as React from "react"
import { Filter, X, Star, ShieldCheck, Search, LayoutList, Map as MapIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { PublicLayout } from "@/components/layouts/public-layout"
import { HeroSearchBar } from "@/components/composite/hero-search-bar"
import { AdvisorCard, AdvisorCardProps, ClientDemographic } from "@/components/composite/advisor-card"
import { ShortlistBar, AdvisorInfo } from "@/components/composite/shortlist-bar"
import { useShortlist } from "@/lib/shortlist-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

// View mode type
type ViewMode = "list" | "map"

// Local storage key for view mode preference
const VIEW_MODE_STORAGE_KEY = "advyser-search-view-mode"

// Categories for the search bar and filters
const categories = [
  { value: "retirement", label: "Retirement Planning" },
  { value: "investment", label: "Investment Management" },
  { value: "tax", label: "Tax Planning" },
  { value: "estate", label: "Estate Planning" },
  { value: "insurance", label: "Insurance" },
  { value: "debt", label: "Debt Management" },
  { value: "wealth", label: "Wealth Management" },
  { value: "business", label: "Business Planning" },
]

// Locations for filters (Australian cities)
const locations = [
  { value: "sydney", label: "Sydney, NSW" },
  { value: "melbourne", label: "Melbourne, VIC" },
  { value: "brisbane", label: "Brisbane, QLD" },
  { value: "perth", label: "Perth, WA" },
  { value: "adelaide", label: "Adelaide, SA" },
  { value: "gold-coast", label: "Gold Coast, QLD" },
  { value: "canberra", label: "Canberra, ACT" },
  { value: "newcastle", label: "Newcastle, NSW" },
  { value: "hobart", label: "Hobart, TAS" },
  { value: "darwin", label: "Darwin, NT" },
  { value: "remote", label: "Remote / Virtual" },
]

// V.2.2.4: Category to demographic mapping for contextual social proof
const categoryToDemographics: Record<string, ClientDemographic[]> = {
  retirement: ["retirees", "pre-retirees"],
  investment: ["young-professionals", "first-home-buyers", "high-net-worth"],
  tax: ["business-owners", "self-employed", "high-net-worth"],
  estate: ["retirees", "high-net-worth", "families"],
  insurance: ["families", "business-owners"],
  debt: ["first-home-buyers", "young-professionals"],
  wealth: ["high-net-worth", "pre-retirees"],
  business: ["business-owners", "self-employed"],
}

type SearchAdvisor = Omit<AdvisorCardProps, "onViewProfile"> & {
  clientDemographics: ClientDemographic[]
}

type ListingsResponse = {
  success: boolean
  data?: {
    items: Array<{
      id: string
      name: string
      credentials: string[]
      avatar: string | null
      specialties: string[]
      rating: number | null
      reviewCount: number
      location: {
        suburb: string | null
        state: string | null
        postcode: string | null
      } | null
      bio: string | null
      verified: boolean
      acceptingStatus: string
      freeConsultation: boolean
      responseTimeHours: number | null
      feeModel: string | null
    }>
  }
  error?: {
    message?: string
  }
}

function formatListingLocation(
  location: { suburb: string | null; state: string | null } | null
): string {
  if (!location) return "Australia"
  if (location.suburb && location.state) return `${location.suburb}, ${location.state}`
  if (location.state) return location.state
  if (location.suburb) return location.suburb
  return "Australia"
}

function mapListingToSearchAdvisor(
  listing: NonNullable<NonNullable<ListingsResponse["data"]>["items"]>[number]
): SearchAdvisor {
  const responseTime =
    listing.responseTimeHours && listing.responseTimeHours > 0
      ? `${listing.responseTimeHours}h`
      : undefined

  const availability: SearchAdvisor["availability"] =
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
    location: formatListingLocation(listing.location),
    bio: listing.bio || "No profile bio available yet.",
    verified: listing.verified,
    freeConsult: listing.freeConsultation,
    availability,
    avgResponseTime: responseTime,
    feeDisplay: listing.feeModel ? `Fee model: ${listing.feeModel.replace("_", " ")}` : undefined,
    clientDemographics: [],
  }
}

interface Filters {
  categories: string[]
  location: string
  minRating: number
}

// Filter count types
interface FilterCounts {
  categories: Record<string, number>
  locations: Record<string, number>
  ratings: Record<number, number>
}

// V.2.2.4: Helper function to get matching demographic based on search filters
function getMatchingDemographic(
  advisorDemographics: ClientDemographic[],
  selectedCategories: string[]
): ClientDemographic | undefined {
  if (selectedCategories.length === 0) return undefined

  // Get all demographics relevant to the selected categories
  const relevantDemographics = new Set<ClientDemographic>()
  selectedCategories.forEach(cat => {
    const demos = categoryToDemographics[cat]
    if (demos) {
      demos.forEach(d => relevantDemographics.add(d))
    }
  })

  // Find the first advisor demographic that matches a relevant demographic
  return advisorDemographics.find(d => relevantDemographics.has(d))
}

// Helper function to match advisor specialty to category value
function matchCategoryToSpecialty(categoryValue: string, specialty: string): boolean {
  const categoryLabel = categories.find(c => c.value === categoryValue)?.label.toLowerCase() || ""
  const specialtyLower = specialty.toLowerCase()
  return (
    categoryLabel === specialtyLower ||
    specialtyLower.includes(categoryValue.toLowerCase()) ||
    categoryValue.toLowerCase().includes(specialtyLower.split(" ")[0])
  )
}

// Helper function to match advisor location to location value
function matchLocationToAdvisor(locationValue: string, advisorLocation: string): boolean {
  if (locationValue === "all" || !locationValue) return true
  const locationLabel = locations.find(l => l.value === locationValue)?.label
  if (locationValue === "remote") {
    return advisorLocation.toLowerCase().includes("remote")
  }
  if (locationLabel) {
    return advisorLocation.includes(locationLabel.split(",")[0])
  }
  return false
}

// Calculate filter counts based on current data and other active filters
function calculateFilterCounts(
  advisors: Omit<AdvisorCardProps, "onViewProfile">[],
  currentFilters: Filters
): FilterCounts {
  const categoryCounts: Record<string, number> = {}
  const locationCounts: Record<string, number> = {}
  const ratingCounts: Record<number, number> = { 3: 0, 3.5: 0, 4: 0, 4.5: 0 }

  // Calculate category counts (apply location and rating filters only)
  categories.forEach(category => {
    categoryCounts[category.value] = advisors.filter(advisor => {
      // Apply location filter
      if (currentFilters.location && currentFilters.location !== "all") {
        if (!matchLocationToAdvisor(currentFilters.location, advisor.location)) {
          return false
        }
      }
      // Apply rating filter
      if (currentFilters.minRating > 0 && advisor.rating < currentFilters.minRating) {
        return false
      }
      // Check if advisor has this category
      return advisor.specialties.some(s => matchCategoryToSpecialty(category.value, s))
    }).length
  })

  // Calculate location counts (apply category and rating filters only)
  locations.forEach(loc => {
    locationCounts[loc.value] = advisors.filter(advisor => {
      // Apply category filter
      if (currentFilters.categories.length > 0) {
        const hasMatchingCategory = currentFilters.categories.some(cat =>
          advisor.specialties.some(s => matchCategoryToSpecialty(cat, s))
        )
        if (!hasMatchingCategory) return false
      }
      // Apply rating filter
      if (currentFilters.minRating > 0 && advisor.rating < currentFilters.minRating) {
        return false
      }
      // Check if advisor matches this location
      return matchLocationToAdvisor(loc.value, advisor.location)
    }).length
  })

  // Calculate rating counts (apply category and location filters only)
  const ratingThresholds = [3, 3.5, 4, 4.5]
  ratingThresholds.forEach(threshold => {
    ratingCounts[threshold] = advisors.filter(advisor => {
      // Apply category filter
      if (currentFilters.categories.length > 0) {
        const hasMatchingCategory = currentFilters.categories.some(cat =>
          advisor.specialties.some(s => matchCategoryToSpecialty(cat, s))
        )
        if (!hasMatchingCategory) return false
      }
      // Apply location filter
      if (currentFilters.location && currentFilters.location !== "all") {
        if (!matchLocationToAdvisor(currentFilters.location, advisor.location)) {
          return false
        }
      }
      // Check if advisor meets this rating threshold
      return advisor.rating >= threshold
    }).length
  })

  return { categories: categoryCounts, locations: locationCounts, ratings: ratingCounts }
}

// Map View Placeholder Component
function MapViewPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-20 px-8">
      {/* Map illustration placeholder */}
      <div className="relative mb-6">
        {/* Stylized map icon with markers */}
        <div className="relative flex items-center justify-center size-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
          <MapIcon className="size-12 text-primary/60" />
          {/* Decorative map markers */}
          <div className="absolute -top-1 -right-1 size-4 rounded-full bg-primary/80 border-2 border-white shadow-sm" />
          <div className="absolute top-4 -left-2 size-3 rounded-full bg-primary/60 border-2 border-white shadow-sm" />
          <div className="absolute -bottom-1 right-3 size-3.5 rounded-full bg-primary/70 border-2 border-white shadow-sm" />
        </div>
      </div>

      {/* Text content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Map view coming soon
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        We&apos;re working on interactive maps to help you find local advisors in your area.
      </p>

      {/* Feature preview list */}
      <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <span className="size-1.5 rounded-full bg-primary/60" />
          Location search
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <span className="size-1.5 rounded-full bg-primary/60" />
          Distance filters
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
          <span className="size-1.5 rounded-full bg-primary/60" />
          Nearby advisors
        </span>
      </div>
    </div>
  )
}

// Filter Sidebar Component
function FiltersSidebar({
  filters,
  onFiltersChange,
  filterCounts,
  className,
}: {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  filterCounts: FilterCounts
  className?: string
}) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location })
  }

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, minRating: value[0] })
  }

  const clearFilters = () => {
    onFiltersChange({ categories: [], location: "", minRating: 0 })
  }

  const hasActiveFilters = filters.categories.length > 0 || filters.location || filters.minRating > 0

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => {
            const count = filterCounts.categories[category.value] || 0
            const isZero = count === 0
            return (
              <div key={category.value} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={filters.categories.includes(category.value)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.value, checked === true)
                  }
                  disabled={isZero && !filters.categories.includes(category.value)}
                />
                <Label
                  htmlFor={`category-${category.value}`}
                  className={cn(
                    "text-sm font-normal cursor-pointer flex items-center gap-1.5",
                    isZero && !filters.categories.includes(category.value)
                      ? "text-muted-foreground/50"
                      : "text-muted-foreground"
                  )}
                >
                  {category.label}
                  <span className={cn(
                    "text-xs",
                    isZero ? "text-muted-foreground/40" : "text-muted-foreground"
                  )}>
                    ({count})
                  </span>
                </Label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Location</h4>
        <Select value={filters.location} onValueChange={handleLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => {
              const count = filterCounts.locations[loc.value] || 0
              return (
                <SelectItem key={loc.value} value={loc.value}>
                  <span className="flex items-center gap-2">
                    {loc.label}
                    <span className={cn(
                      "text-xs",
                      count === 0 ? "text-muted-foreground/40" : "text-muted-foreground"
                    )}>
                      ({count})
                    </span>
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Minimum Rating</h4>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
          </span>
        </div>
        <Slider
          value={[filters.minRating]}
          onValueChange={handleRatingChange}
          min={0}
          max={5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Any</span>
          <span>5.0</span>
        </div>
        {/* Rating quick filters with counts */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {[4.5, 4, 3.5, 3].map((rating) => {
            const count = filterCounts.ratings[rating] || 0
            const isActive = filters.minRating === rating
            const isZero = count === 0
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange([isActive ? 0 : rating])}
                disabled={isZero && !isActive}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isZero
                      ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Star className="size-3 fill-current" />
                {rating}+
                <span className={cn(
                  "text-[10px]",
                  isActive ? "text-primary-foreground/80" : isZero ? "text-muted-foreground/40" : "text-muted-foreground/70"
                )}>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Mobile Filters Sheet
function MobileFiltersSheet({
  filters,
  onFiltersChange,
  filterCounts,
  resultCount,
}: {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  filterCounts: FilterCounts
  resultCount: number
}) {
  const [open, setOpen] = React.useState(false)
  // Track pending filters (changes made in sheet but not yet applied)
  const [pendingFilters, setPendingFilters] = React.useState<Filters>(filters)

  const activeFilterCount =
    filters.categories.length +
    (filters.location ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0)

  const pendingFilterCount =
    pendingFilters.categories.length +
    (pendingFilters.location ? 1 : 0) +
    (pendingFilters.minRating > 0 ? 1 : 0)

  // Sync pending filters when sheet opens
  React.useEffect(() => {
    if (open) {
      setPendingFilters(filters)
    }
  }, [open, filters])

  const handleApply = () => {
    onFiltersChange(pendingFilters)
    setOpen(false)
  }

  const handleClear = () => {
    const clearedFilters = { categories: [], location: "", minRating: 0 }
    setPendingFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-xl"
        showCloseButton={false}
      >
        {/* Custom Header with close button */}
        <SheetHeader className="flex-row items-center justify-between border-b pb-4">
          <SheetTitle className="text-lg">Filters</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FiltersSidebar
            filters={pendingFilters}
            onFiltersChange={setPendingFilters}
            filterCounts={filterCounts}
            className="pb-4"
          />
        </div>

        {/* Sticky Footer with Apply and Clear */}
        <SheetFooter className="flex-row gap-3 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClear}
            disabled={pendingFilterCount === 0}
          >
            Clear all
          </Button>
          <Button
            className="flex-1"
            onClick={handleApply}
          >
            Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Active Filter Tags
function ActiveFilterTags({
  filters,
  onFiltersChange,
}: {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}) {
  const removeCategory = (category: string) => {
    onFiltersChange({
      ...filters,
      categories: filters.categories.filter((c) => c !== category),
    })
  }

  const removeLocation = () => {
    onFiltersChange({ ...filters, location: "" })
  }

  const removeRating = () => {
    onFiltersChange({ ...filters, minRating: 0 })
  }

  const hasFilters = filters.categories.length > 0 || filters.location || filters.minRating > 0

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap gap-2">
      {filters.categories.map((cat) => {
        const category = categories.find((c) => c.value === cat)
        return (
          <button
            key={cat}
            onClick={() => removeCategory(cat)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20 transition-colors"
          >
            {category?.label}
            <X className="size-3.5" />
          </button>
        )
      })}
      {filters.location && (
        <button
          onClick={removeLocation}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20 transition-colors"
        >
          {locations.find((l) => l.value === filters.location)?.label}
          <X className="size-3.5" />
        </button>
      )}
      {filters.minRating > 0 && (
        <button
          onClick={removeRating}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20 transition-colors"
        >
          {filters.minRating}+ Stars
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const [filters, setFilters] = React.useState<Filters>({
    categories: [],
    location: "",
    minRating: 0,
  })
  const [searchKeyword, setSearchKeyword] = React.useState("")
  const [advisors, setAdvisors] = React.useState<SearchAdvisor[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [refreshToken, setRefreshToken] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortBy, setSortBy] = React.useState("relevance")
  const [viewMode, setViewMode] = React.useState<ViewMode>("list")

  // Load view mode preference from localStorage on mount
  React.useEffect(() => {
    const savedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode | null
    if (savedViewMode && (savedViewMode === "list" || savedViewMode === "map")) {
      setViewMode(savedViewMode)
    }
  }, [])

  // Save view mode preference to localStorage
  const handleViewModeChange = (value: string) => {
    if (value === "list" || value === "map") {
      setViewMode(value)
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, value)
    }
  }

  // V.2.2.3: Shortlist integration
  const { addToShortlist, removeFromShortlist, isInShortlist } = useShortlist()

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadListings() {
      try {
        setIsLoading(true)
        setLoadError(null)

        const params = new URLSearchParams({
          page: "1",
          pageSize: "100",
          sort: "rating_desc",
        })
        if (searchKeyword.trim()) {
          params.set("q", searchKeyword.trim())
        }

        const response = await fetch(`/api/listings?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        })

        const payload = (await response.json()) as ListingsResponse
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error?.message || "Failed to load advisor listings")
        }

        setAdvisors(payload.data.items.map(mapListingToSearchAdvisor))
      } catch (error) {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : "Unable to load advisor listings right now."
        setLoadError(message)
        setAdvisors([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadListings()

    return () => controller.abort()
  }, [searchKeyword, refreshToken])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy, searchKeyword])

  // Create advisor data map for ShortlistBar avatars
  const advisorDataMap = React.useMemo(() => {
    const map = new Map<string, AdvisorInfo>()
    advisors.forEach(advisor => {
      map.set(advisor.id, {
        id: advisor.id,
        name: advisor.name,
        avatar: advisor.avatar,
      })
    })
    return map
  }, [advisors])

  // Filter advisors based on current filters
  const filteredAdvisors = React.useMemo(() => {
    return advisors.filter((advisor) => {
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.toLowerCase()
        const keywordMatch =
          advisor.name.toLowerCase().includes(keyword) ||
          advisor.bio.toLowerCase().includes(keyword) ||
          advisor.specialties.some((specialty) => specialty.toLowerCase().includes(keyword)) ||
          advisor.location.toLowerCase().includes(keyword)
        if (!keywordMatch) return false
      }

      // Category filter
      if (filters.categories.length > 0) {
        const advisorCategoryValues = advisor.specialties.map((s) => {
          const found = categories.find((c) =>
            c.label.toLowerCase() === s.toLowerCase() ||
            s.toLowerCase().includes(c.value.toLowerCase())
          )
          return found?.value
        }).filter(Boolean)

        const hasMatchingCategory = filters.categories.some((cat) =>
          advisorCategoryValues.includes(cat) ||
          advisor.specialties.some((s) =>
            s.toLowerCase().includes(cat.toLowerCase()) ||
            cat.toLowerCase().includes(s.toLowerCase().split(" ")[0])
          )
        )
        if (!hasMatchingCategory) return false
      }

      // Location filter
      if (filters.location && filters.location !== "all") {
        const locationLabel = locations.find((l) => l.value === filters.location)?.label
        if (locationLabel && !advisor.location.includes(locationLabel.split(",")[0])) {
          // Check for remote
          if (filters.location === "remote" && !advisor.location.toLowerCase().includes("remote")) {
            return false
          } else if (filters.location !== "remote") {
            return false
          }
        }
      }

      // Rating filter
      if (filters.minRating > 0 && advisor.rating < filters.minRating) {
        return false
      }

      return true
    })
  }, [advisors, filters, searchKeyword])

  // Sort advisors
  const sortedAdvisors = React.useMemo(() => {
    const sorted = [...filteredAdvisors]
    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "reviews":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }, [filteredAdvisors, sortBy])

  // Calculate filter counts for real-time display
  const filterCounts = React.useMemo(() => {
    return calculateFilterCounts(advisors, filters)
  }, [advisors, filters])

  const handleSearch = (query: { category?: string; location?: string; keyword?: string }) => {
    // Update filters based on search
    const newFilters = { ...filters }
    if (query.category && query.category !== "all") {
      newFilters.categories = [query.category]
    }
    if (query.location) {
      const normalized = query.location.toLowerCase()
      const match = locations.find(
        (location) =>
          location.label.toLowerCase() === normalized ||
          normalized.includes(location.label.split(",")[0].toLowerCase())
      )
      if (match) {
        newFilters.location = match.value
      }
    }
    if (query.keyword !== undefined) {
      setSearchKeyword(query.keyword)
    }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleViewProfile = (id: string) => {
    router.push(`/advisors/${id}`)
  }

  // Pagination logic (for demo, showing all on page 1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(sortedAdvisors.length / itemsPerPage)
  const paginatedAdvisors = sortedAdvisors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <PublicLayout>
      {/* V.2.2.3: Shortlist Bar */}
      <ShortlistBar advisorData={advisorDataMap} />
      {/* Search Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <HeroSearchBar
            categories={categories}
            onSearch={handleSearch}
            className="max-w-3xl"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <FiltersSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  filterCounts={filterCounts}
                />
              </div>
            </aside>

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden">
                      <MobileFiltersSheet
                        filters={filters}
                        onFiltersChange={setFilters}
                        filterCounts={filterCounts}
                        resultCount={filteredAdvisors.length}
                      />
                    </div>

                    {/* View Mode Toggle */}
                    <ToggleGroup
                      type="single"
                      value={viewMode}
                      onValueChange={handleViewModeChange}
                      variant="outline"
                      className="border rounded-lg"
                    >
                      <ToggleGroupItem
                        value="list"
                        aria-label="List view"
                        className="gap-1.5 px-3"
                      >
                        <LayoutList className="size-4" />
                        <span className="hidden sm:inline text-sm">List</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="map"
                        aria-label="Map view"
                        className="gap-1.5 px-3"
                      >
                        <MapIcon className="size-4" />
                        <span className="hidden sm:inline text-sm">Map</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filter Tags */}
                <ActiveFilterTags filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* V.2.1.5: Search Result Context Header */}
              <div
                className="flex items-center justify-between mb-4"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{filteredAdvisors.length}</span> advisors found
                  {(filters.categories.length > 0 || filters.location || filters.minRating > 0) && " matching your filters"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Sorted by:</span>
                  <span className="font-medium text-foreground">
                    {sortBy === 'rating' ? 'Highest rated' : sortBy === 'reviews' ? 'Most reviews' : sortBy === 'name' ? 'Name (A-Z)' : 'Best match'}
                  </span>
                </div>
              </div>

              {/* ASIC Verification Banner */}
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <ShieldCheck className="size-5 shrink-0" />
                <p>
                  Every advisor on Advyser is verified on the{" "}
                  <a
                    href="https://moneysmart.gov.au/financial-advice/financial-advisers-register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:text-emerald-900"
                  >
                    ASIC Financial Advisers Register
                  </a>
                </p>
              </div>

              {/* View Mode Content */}
              {viewMode === "map" ? (
                /* Map View Placeholder */
                <MapViewPlaceholder />
              ) : (
                /* List View - Advisor Grid */
                <>
                  {isLoading ? (
                    <div className="rounded-xl border border-border bg-muted/20 p-8 text-center">
                      <p className="text-muted-foreground">Loading advisor listings...</p>
                    </div>
                  ) : loadError ? (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Could not load advisors</h3>
                      <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
                      <Button onClick={() => setRefreshToken((current) => current + 1)}>
                        Try Again
                      </Button>
                    </div>
                  ) : paginatedAdvisors.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                      {paginatedAdvisors.map((advisor, index) => (
                        <div
                          key={advisor.id}
                          className="animate-in fade-in slide-in-from-bottom-4"
                          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                        >
                          <AdvisorCard
                            {...advisor}
                            isFavorited={isInShortlist(advisor.id)}
                            onFavoriteToggle={(isFavorited) => {
                              if (isFavorited) {
                                addToShortlist(advisor.id)
                              } else {
                                removeFromShortlist(advisor.id)
                              }
                            }}
                            popularWithDemographic={getMatchingDemographic(
                              advisor.clientDemographics,
                              filters.categories
                            )}
                            onViewProfile={handleViewProfile}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* V.2.4.1: Improved Search Empty State */
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                        <Search className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No advisors found</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Try adjusting your filters or search in a different location.
                      </p>

                      {/* Filter suggestions */}
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Suggestions:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters({ categories: [], location: "", minRating: 0 })}
                          >
                            Clear all filters
                          </Button>
                          {filters.location && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFilters({ ...filters, location: "" })}
                            >
                              Search all locations
                            </Button>
                          )}
                          {filters.categories.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFilters({ ...filters, categories: [] })}
                            >
                              All categories
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            const showPage =
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1

                            if (!showPage) {
                              // Show ellipsis only once between gaps
                              if (page === 2 && currentPage > 3) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )
                              }
                              if (page === totalPages - 1 && currentPage < totalPages - 2) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )
                              }
                              return null
                            }

                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  isActive={page === currentPage}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCurrentPage(page)
                                  }}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
