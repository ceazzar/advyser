"use client"

import * as React from "react"
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react"

import { LeadCard, type LeadStatus } from "@/components/composite/lead-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LeadSummary } from "@/app/api/leads/route"

interface LeadsApiResponse {
  success: boolean
  data?: {
    items: LeadSummary[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
  error?: {
    code: string
    message: string
  }
}

// Map API status to LeadCard status (booked maps to contacted for display)
function mapLeadStatus(status: string): LeadStatus {
  if (status === "booked") return "contacted"
  if (["new", "contacted", "converted", "declined"].includes(status)) {
    return status as LeadStatus
  }
  return "new"
}

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<LeadSummary[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<LeadStatus | "all">("all")
  const [sortBy, setSortBy] = React.useState("newest")

  // Fetch leads from API
  React.useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/leads")
        const data: LeadsApiResponse = await response.json()

        if (data.success && data.data) {
          setLeads(data.data.items)
        } else {
          setError(data.error?.message || "Failed to fetch leads")
        }
      } catch (err) {
        setError("Failed to connect to server")
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeads()
  }, [])

  // Calculate status counts
  const statusCounts = React.useMemo(() => {
    return {
      all: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted" || l.status === "booked").length,
      converted: leads.filter((l) => l.status === "converted").length,
      declined: leads.filter((l) => l.status === "declined").length,
    }
  }, [leads])

  const statusTabs: { value: LeadStatus | "all"; label: string; count: number }[] = [
    { value: "all", label: "All Leads", count: statusCounts.all },
    { value: "new", label: "New", count: statusCounts.new },
    { value: "contacted", label: "Contacted", count: statusCounts.contacted },
    { value: "converted", label: "Converted", count: statusCounts.converted },
    { value: "declined", label: "Declined", count: statusCounts.declined },
  ]

  const filteredLeads = React.useMemo(() => {
    let filtered = [...leads]

    // Filter by status
    if (activeTab !== "all") {
      if (activeTab === "contacted") {
        // Include booked in contacted tab
        filtered = filtered.filter((lead) => lead.status === "contacted" || lead.status === "booked")
      } else {
        filtered = filtered.filter((lead) => lead.status === activeTab)
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.consumer.displayName?.toLowerCase().includes(query) ||
          lead.goalTags.some(tag => tag.toLowerCase().includes(query)) ||
          lead.problemSummary?.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    return filtered
  }, [leads, activeTab, searchQuery, sortBy])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={<Filter />}
        title="Failed to load leads"
        description={error}
        action={{
          label: "Try again",
          onClick: () => window.location.reload(),
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Manage and respond to incoming lead requests.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="size-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SlidersHorizontal className="size-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LeadStatus | "all")}>
        <TabsList variant="line" className="w-full justify-start border-b">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              {tab.label}
              <Badge
                className="ml-1 size-5 items-center justify-center rounded-full p-0 text-xs"
                leadStatus={tab.value === "all" ? undefined : tab.value}
              >
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredLeads.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  id={lead.id}
                  consumerName={lead.consumer.displayName}
                  category={lead.goalTags[0] || "General Inquiry"}
                  message={lead.problemSummary || "No details provided"}
                  status={mapLeadStatus(lead.status)}
                  createdAt={new Date(lead.createdAt)}
                  onView={() => {
                    window.location.href = `/advisor/leads/${lead.id}`
                  }}
                  onRespond={() => {
                    window.location.href = `/advisor/leads/${lead.id}`
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Filter />}
              title="No leads found"
              description={
                searchQuery
                  ? "Try adjusting your search or filters"
                  : "New leads will appear here when consumers reach out"
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
