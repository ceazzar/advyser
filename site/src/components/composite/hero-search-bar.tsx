"use client"

import { Clock, MapPin, Search, TrendingUp } from "lucide-react"
import * as React from "react"

/**
 * Icon Optical Sizing:
 * - Input icons (Search, MapPin): size-5 (20px) for larger input context
 * - Dropdown item icons: size-4 (16px) standard
 * - Dropdown heading icons (TrendingUp, Clock): size-3.5 (14px) for compact headers
 * - Search button icon: size-5 (20px) for emphasis
 */
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ============================================================================
// Mock Data
// ============================================================================

const locationSuggestions = [
  { city: "Sydney", state: "NSW", advisorCount: 428 },
  { city: "Melbourne", state: "VIC", advisorCount: 392 },
  { city: "Brisbane", state: "QLD", advisorCount: 234 },
  { city: "Perth", state: "WA", advisorCount: 187 },
  { city: "Adelaide", state: "SA", advisorCount: 156 },
  { city: "Gold Coast", state: "QLD", advisorCount: 98 },
  { city: "Canberra", state: "ACT", advisorCount: 87 },
  { city: "Hobart", state: "TAS", advisorCount: 45 },
  { city: "Darwin", state: "NT", advisorCount: 32 },
  { city: "Newcastle", state: "NSW", advisorCount: 78 },
]

const trendingSearches = [
  "Retirement planning",
  "First home buyer",
  "SMSF advice",
  "Tax minimisation",
  "Wealth management",
]

const defaultCategories = [
  { value: "financial", label: "Financial Planning" },
  { value: "property", label: "Property" },
  { value: "tax", label: "Tax" },
  { value: "mortgage", label: "Mortgage" },
]

// ============================================================================
// Local Storage Helpers
// ============================================================================

const RECENT_SEARCHES_KEY = "advyser-recent-searches"
const MAX_RECENT_SEARCHES = 3

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addRecentSearch(search: string): void {
  if (typeof window === "undefined" || !search.trim()) return
  try {
    const existing = getRecentSearches()
    const filtered = existing.filter((s) => s.toLowerCase() !== search.toLowerCase())
    const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

function clearRecentSearches(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Ignore localStorage errors
  }
}

// ============================================================================
// Custom Hooks
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// ============================================================================
// Component Props
// ============================================================================

export interface HeroSearchBarProps {
  onSearch?: (query: { category?: string; location?: string; keyword?: string }) => void
  categories?: { value: string; label: string }[]
  className?: string
}

// ============================================================================
// Main Component
// ============================================================================

function HeroSearchBar({ onSearch, categories = defaultCategories, className }: HeroSearchBarProps) {
  const [category, setCategory] = React.useState<string>("")
  const [location, setLocation] = React.useState<string>("")
  const [keyword, setKeyword] = React.useState<string>("")

  // Autocomplete state
  const [locationOpen, setLocationOpen] = React.useState(false)
  const [keywordOpen, setKeywordOpen] = React.useState(false)
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [locationHighlightIndex, setLocationHighlightIndex] = React.useState(-1)
  const [keywordHighlightIndex, setKeywordHighlightIndex] = React.useState(-1)

  // Refs for keyboard navigation
  const locationInputRef = React.useRef<HTMLInputElement>(null)
  const keywordInputRef = React.useRef<HTMLInputElement>(null)

  // Debounced values for filtering
  const debouncedLocation = useDebounce(location, 200)

  // Load recent searches on mount
  React.useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Filter location suggestions based on input
  const filteredLocations = React.useMemo(() => {
    if (!debouncedLocation.trim()) return locationSuggestions
    const search = debouncedLocation.toLowerCase()
    return locationSuggestions.filter(
      (loc) =>
        loc.city.toLowerCase().includes(search) ||
        loc.state.toLowerCase().includes(search)
    )
  }, [debouncedLocation])

  // Reset highlight index when suggestions change
  React.useEffect(() => {
    setLocationHighlightIndex(-1)
  }, [filteredLocations])

  React.useEffect(() => {
    setKeywordHighlightIndex(-1)
  }, [keywordOpen])

  const handleSearch = () => {
    // Save keyword to recent searches
    if (keyword.trim()) {
      addRecentSearch(keyword.trim())
      setRecentSearches(getRecentSearches())
    }

    onSearch?.({
      category: category || undefined,
      location: location || undefined,
      keyword: keyword || undefined,
    })

    // Close dropdowns
    setLocationOpen(false)
    setKeywordOpen(false)
  }

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
    setLocationOpen(false)
    // Focus keyword input after selection
    setTimeout(() => keywordInputRef.current?.focus(), 0)
  }

  const handleKeywordSelect = (selectedKeyword: string) => {
    // Capture current state values before async operation
    const currentCategory = category
    const currentLocation = location

    setKeyword(selectedKeyword)
    setKeywordOpen(false)
    // Trigger search after selection
    setTimeout(() => {
      addRecentSearch(selectedKeyword)
      setRecentSearches(getRecentSearches())
      onSearch?.({
        category: currentCategory || undefined,
        location: currentLocation || undefined,
        keyword: selectedKeyword,
      })
    }, 0)
  }

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearRecentSearches()
    setRecentSearches([])
  }

  // Keyboard navigation for location dropdown
  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (!locationOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setLocationOpen(true)
        e.preventDefault()
        return
      }
    }

    if (locationOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setLocationHighlightIndex((prev) =>
          prev < filteredLocations.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setLocationHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filteredLocations.length - 1
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (locationHighlightIndex >= 0 && filteredLocations[locationHighlightIndex]) {
          const loc = filteredLocations[locationHighlightIndex]
          handleLocationSelect(`${loc.city}, ${loc.state}`)
        } else if (location.trim()) {
          setLocationOpen(false)
          keywordInputRef.current?.focus()
        }
      } else if (e.key === "Escape") {
        setLocationOpen(false)
      } else if (e.key === "Tab") {
        setLocationOpen(false)
      }
    } else if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Keyboard navigation for keyword dropdown
  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = [...(recentSearches.length > 0 ? recentSearches : []), ...trendingSearches]

    if (!keywordOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setKeywordOpen(true)
        e.preventDefault()
        return
      }
    }

    if (keywordOpen && !keyword.trim()) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setKeywordHighlightIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setKeywordHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (keywordHighlightIndex >= 0 && allSuggestions[keywordHighlightIndex]) {
          handleKeywordSelect(allSuggestions[keywordHighlightIndex])
        } else {
          handleSearch()
        }
      } else if (e.key === "Escape") {
        setKeywordOpen(false)
      } else if (e.key === "Tab") {
        setKeywordOpen(false)
      }
    } else if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setKeywordOpen(false)
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col md:flex-row",
          "bg-card rounded-xl md:rounded-full",
          "shadow-lg border border-border",
          "p-2 md:p-2",
          "gap-2 md:gap-0"
        )}
      >
        {/* Category Select */}
        <div className="flex-shrink-0 md:min-w-[180px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              aria-label="Advice category"
              className={cn(
                "h-12 md:h-14 px-4 md:px-6",
                "border-0 bg-transparent",
                "text-base font-medium",
                "rounded-lg md:rounded-l-full md:rounded-r-none",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "hover:bg-muted/50 transition-colors"
              )}
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden md:flex items-center">
          <div className="h-8 w-px bg-border" />
        </div>

        {/* Location Input with Autocomplete */}
        <div className="flex-shrink-0 md:min-w-[180px]">
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverAnchor asChild>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none z-10" />
                <input
                  ref={locationInputRef}
                  type="text"
                  aria-label="Location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    if (!locationOpen) setLocationOpen(true)
                  }}
                  onFocus={() => setLocationOpen(true)}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="Location"
                  className={cn(
                    "w-full h-12 md:h-14 pl-12 pr-4",
                    "bg-transparent border-0",
                    "text-base placeholder:text-muted-foreground",
                    "rounded-lg md:rounded-none",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "hover:bg-muted/50 transition-colors"
                  )}
                  autoComplete="off"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              className="w-[min(90vw,320px)] p-0"
              align="start"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  {filteredLocations.length === 0 ? (
                    <CommandEmpty>No locations found.</CommandEmpty>
                  ) : (
                    <CommandGroup heading="Locations">
                      {filteredLocations.map((loc, index) => (
                        <CommandItem
                          key={`${loc.city}-${loc.state}`}
                          value={`${loc.city}, ${loc.state}`}
                          onSelect={() => handleLocationSelect(`${loc.city}, ${loc.state}`)}
                          className={cn(
                            "flex items-center justify-between cursor-pointer",
                            index === locationHighlightIndex && "bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-muted-foreground" />
                            <span>{loc.city}, {loc.state}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {loc.advisorCount} advisors
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden md:flex items-center">
          <div className="h-8 w-px bg-border" />
        </div>

        {/* Keyword Search Input with Trending/Recent */}
        <div className="flex-1">
          <Popover open={keywordOpen && !keyword.trim()} onOpenChange={setKeywordOpen}>
            <PopoverAnchor asChild>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none z-10" />
                <input
                  ref={keywordInputRef}
                  type="text"
                  aria-label="Search keywords"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value)
                    if (e.target.value.trim()) {
                      setKeywordOpen(false)
                    }
                  }}
                  onFocus={() => {
                    if (!keyword.trim()) setKeywordOpen(true)
                  }}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="Find a financial advisor..."
                  className={cn(
                    "w-full h-12 md:h-14 pl-12 pr-4",
                    "bg-transparent border-0",
                    "text-base placeholder:text-muted-foreground",
                    "rounded-lg md:rounded-none",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "hover:bg-muted/50 transition-colors"
                  )}
                  autoComplete="off"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              className="w-[min(90vw,360px)] p-0"
              align="start"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <CommandGroup heading={
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-2">
                          <Clock className="size-3.5" />
                          <span>Recent searches</span>
                        </div>
                        <button
                          onClick={handleClearRecent}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    }>
                      {recentSearches.map((search, index) => (
                        <CommandItem
                          key={`recent-${search}`}
                          value={search}
                          onSelect={() => handleKeywordSelect(search)}
                          className={cn(
                            "cursor-pointer",
                            index === keywordHighlightIndex && "bg-accent"
                          )}
                        >
                          <Clock className="size-4 text-muted-foreground mr-2" />
                          {search}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Trending Searches */}
                  <CommandGroup heading={
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-3.5" />
                      <span>Trending searches</span>
                    </div>
                  }>
                    {trendingSearches.map((search, index) => {
                      const adjustedIndex = recentSearches.length + index
                      return (
                        <CommandItem
                          key={`trending-${search}`}
                          value={search}
                          onSelect={() => handleKeywordSelect(search)}
                          className={cn(
                            "cursor-pointer",
                            adjustedIndex === keywordHighlightIndex && "bg-accent"
                          )}
                        >
                          <TrendingUp className="size-4 text-muted-foreground mr-2" />
                          {search}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleSearch}
            size="lg"
            className={cn(
              "w-full md:w-auto",
              "h-12 md:h-14 px-8",
              "rounded-lg md:rounded-full",
              "text-base font-semibold",
              "shadow-md hover:shadow-lg transition-all duration-200"
            )}
          >
            <Search className="size-5 md:mr-2" />
            <span className="md:inline">Search</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export { HeroSearchBar }
