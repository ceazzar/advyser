"use client"

import * as React from "react"
import { Filter, X, Star } from "lucide-react"

import { PublicLayout } from "@/components/layouts/public-layout"
import { HeroSearchBar } from "@/components/composite/hero-search-bar"
import { AdvisorCard, AdvisorCardProps } from "@/components/composite/advisor-card"
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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

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

// Australian states/territories for filtering
const states = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia" },
  { value: "sa", label: "South Australia" },
  { value: "tas", label: "Tasmania" },
  { value: "act", label: "Australian Capital Territory" },
  { value: "nt", label: "Northern Territory" },
]

// Mock advisors data - 9 advisors with varied specialties
const mockAdvisors: Omit<AdvisorCardProps, "onViewProfile">[] = [
  {
    id: "1",
    name: "Sarah Chen",
    credentials: "CFP, CFA",
    avatar: "/avatars/advisor-1.jpg",
    specialties: ["Retirement Planning", "Investment Management", "Tax Planning"],
    rating: 4.9,
    reviewCount: 127,
    location: "Sydney, NSW",
    bio: "Specializing in comprehensive retirement planning and tax-efficient investment strategies. I help clients build wealth while minimizing tax burdens through strategic portfolio management.",
    verified: true,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    credentials: "CFP, ChFC",
    avatar: "/avatars/advisor-2.jpg",
    specialties: ["Wealth Management", "Estate Planning", "Insurance"],
    rating: 4.8,
    reviewCount: 89,
    location: "Melbourne, VIC",
    bio: "Over 15 years of experience helping high-net-worth families protect and grow their wealth across generations. Expert in comprehensive estate planning strategies.",
    verified: true,
  },
  {
    id: "3",
    name: "Emily Thompson",
    credentials: "CFP",
    avatar: "/avatars/advisor-3.jpg",
    specialties: ["Investment Management", "Debt Management", "Retirement Planning"],
    rating: 4.7,
    reviewCount: 64,
    location: "Brisbane, QLD",
    bio: "I believe in making financial planning accessible to everyone. My approach focuses on debt elimination, smart investing, and building a secure retirement foundation.",
    verified: false,
  },
  {
    id: "4",
    name: "David Kim",
    credentials: "CPA, CFP",
    avatar: "/avatars/advisor-4.jpg",
    specialties: ["Tax Planning", "Business Planning", "Retirement Planning"],
    rating: 4.9,
    reviewCount: 156,
    location: "Perth, WA",
    bio: "As both a CPA and CFP, I bring a unique perspective to financial planning. Specializing in tax optimization for business owners and professionals.",
    verified: true,
  },
  {
    id: "5",
    name: "Jennifer Martinez",
    credentials: "CFP, CDFA",
    avatar: "/avatars/advisor-5.jpg",
    specialties: ["Estate Planning", "Wealth Management", "Insurance"],
    rating: 4.6,
    reviewCount: 52,
    location: "Adelaide, SA",
    bio: "Certified Divorce Financial Analyst helping individuals navigate complex financial transitions. Expert in rebuilding wealth and securing financial independence.",
    verified: false,
  },
  {
    id: "6",
    name: "Robert Williams",
    credentials: "CFP, AIF",
    avatar: "/avatars/advisor-6.jpg",
    specialties: ["Investment Management", "Retirement Planning", "Wealth Management"],
    rating: 4.8,
    reviewCount: 98,
    location: "Gold Coast, QLD",
    bio: "Fiduciary advisor committed to transparency and client-first investing. I help professionals maximize their superannuation and build diversified portfolios.",
    verified: true,
  },
  {
    id: "7",
    name: "Amanda Foster",
    credentials: "CFP, CLU",
    avatar: "/avatars/advisor-7.jpg",
    specialties: ["Insurance", "Estate Planning", "Business Planning"],
    rating: 4.5,
    reviewCount: 41,
    location: "Canberra, ACT",
    bio: "Specializing in risk management and insurance solutions for families and businesses. I help clients protect what matters most while planning for the future.",
    verified: false,
  },
  {
    id: "8",
    name: "James Anderson",
    credentials: "CFP, CFA, MBA",
    avatar: "/avatars/advisor-8.jpg",
    specialties: ["Wealth Management", "Investment Management", "Tax Planning", "Estate Planning"],
    rating: 5.0,
    reviewCount: 73,
    location: "Sydney, NSW",
    bio: "Former investment banker turned fee-only advisor. I bring institutional-level expertise to help clients achieve their most ambitious financial goals.",
    verified: true,
  },
  {
    id: "9",
    name: "Lisa Patel",
    credentials: "CFP",
    avatar: "/avatars/advisor-9.jpg",
    specialties: ["Retirement Planning", "Debt Management", "Investment Management"],
    rating: 4.7,
    reviewCount: 86,
    location: "Remote / Virtual",
    bio: "Virtual-first financial planner helping clients nationwide. Specialized in helping millennials and Gen X professionals build wealth and plan for early retirement.",
    verified: true,
  },
]

interface Filters {
  categories: string[]
  location: string
  minRating: number
}

// Filter Sidebar Component
function FiltersSidebar({
  filters,
  onFiltersChange,
  className,
}: {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
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
          {categories.map((category) => (
            <div key={category.value} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.categories.includes(category.value)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.value, checked === true)
                }
              />
              <Label
                htmlFor={`category-${category.value}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
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
            {locations.map((loc) => (
              <SelectItem key={loc.value} value={loc.value}>
                {loc.label}
              </SelectItem>
            ))}
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
      </div>
    </div>
  )
}

// Mobile Filters Sheet
function MobileFiltersSheet({
  filters,
  onFiltersChange,
}: {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}) {
  const [open, setOpen] = React.useState(false)
  const activeFilterCount =
    filters.categories.length +
    (filters.location ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0)

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
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Filter Advisors</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FiltersSidebar filters={filters} onFiltersChange={onFiltersChange} />
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Show Results
          </Button>
        </div>
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
  const [filters, setFilters] = React.useState<Filters>({
    categories: [],
    location: "",
    minRating: 0,
  })
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortBy, setSortBy] = React.useState("relevance")

  // Filter advisors based on current filters
  const filteredAdvisors = React.useMemo(() => {
    return mockAdvisors.filter((advisor) => {
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
  }, [filters])

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

  const handleSearch = (query: { category?: string; location?: string; keyword?: string }) => {
    // Update filters based on search
    const newFilters = { ...filters }
    if (query.category && query.category !== "all") {
      newFilters.categories = [query.category]
    }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleViewProfile = (id: string) => {
    // In a real app, this would navigate to the advisor's profile
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
                />
              </div>
            </aside>

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden">
                      <MobileFiltersSheet
                        filters={filters}
                        onFiltersChange={setFilters}
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {sortedAdvisors.length} advisor{sortedAdvisors.length !== 1 ? "s" : ""} found
                    </h2>
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

              {/* Advisor Grid */}
              {paginatedAdvisors.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                  {paginatedAdvisors.map((advisor) => (
                    <AdvisorCard
                      key={advisor.id}
                      {...advisor}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-medium">No advisors found</p>
                    <p className="mt-1">Try adjusting your filters or search criteria</p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilters({ categories: [], location: "", minRating: 0 })}
                  >
                    Clear all filters
                  </Button>
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
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
