"use client"

import * as React from "react"
import { Search, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const defaultCategories = [
  { value: "financial", label: "Financial Planning" },
  { value: "property", label: "Property" },
  { value: "tax", label: "Tax" },
  { value: "mortgage", label: "Mortgage" },
]

export interface HeroSearchBarProps {
  onSearch?: (query: { category?: string; location?: string; keyword?: string }) => void
  categories?: { value: string; label: string }[]
  className?: string
}

function HeroSearchBar({ onSearch, categories = defaultCategories, className }: HeroSearchBarProps) {
  const [category, setCategory] = React.useState<string>("")
  const [location, setLocation] = React.useState<string>("")
  const [keyword, setKeyword] = React.useState<string>("")

  const handleSearch = () => {
    onSearch?.({
      category: category || undefined,
      location: location || undefined,
      keyword: keyword || undefined,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
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

        {/* Location Input */}
        <div className="flex-shrink-0 md:min-w-[180px]">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Location"
              className={cn(
                "w-full h-12 md:h-14 pl-12 pr-4",
                "bg-transparent border-0",
                "text-base placeholder:text-muted-foreground",
                "rounded-lg md:rounded-none",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "hover:bg-muted/50 transition-colors"
              )}
            />
          </div>
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden md:flex items-center">
          <div className="h-8 w-px bg-border" />
        </div>

        {/* Keyword Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Find a financial advisor..."
              className={cn(
                "w-full h-12 md:h-14 pl-12 pr-4",
                "bg-transparent border-0",
                "text-base placeholder:text-muted-foreground",
                "rounded-lg md:rounded-none",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "hover:bg-muted/50 transition-colors"
              )}
            />
          </div>
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
