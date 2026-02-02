"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

import { LeadCard, type LeadStatus } from "@/components/composite/lead-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

// Mock leads data
const mockLeads = [
  {
    id: "1",
    consumerName: "Sarah Mitchell",
    category: "Retirement Planning",
    message:
      "I'm looking for advice on transitioning to retirement. I'm 58 years old and want to understand my options for accessing my super and planning for the next 10 years.",
    status: "new" as LeadStatus,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    consumerName: "James Chen",
    category: "Investment Strategy",
    message:
      "Looking to diversify my investment portfolio. Currently have most assets in property and want to explore other options with a long-term growth focus.",
    status: "new" as LeadStatus,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    consumerName: "Emma Thompson",
    category: "Superannuation",
    message:
      "I want to consolidate multiple super accounts and understand which fund would be best for my situation. I'm 45 and have about $400k across three funds.",
    status: "contacted" as LeadStatus,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    consumerName: "David Wilson",
    category: "Estate Planning",
    message:
      "Need help with estate planning and setting up appropriate structures for wealth transfer to my children. Want to minimize tax implications.",
    status: "contacted" as LeadStatus,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    consumerName: "Lisa Anderson",
    category: "Insurance Review",
    message:
      "Want to review my current insurance coverage. Have life insurance through super but not sure if it's adequate for my family's needs.",
    status: "converted" as LeadStatus,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    consumerName: "Michael Brown",
    category: "Retirement Planning",
    message:
      "Planning to retire in 2 years and need comprehensive advice on pension strategies and investment allocation for retirement income.",
    status: "declined" as LeadStatus,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    consumerName: undefined,
    category: "Debt Management",
    message:
      "Looking for help managing debt and creating a savings plan. Have mortgage and personal loans, want to optimize repayments.",
    status: "new" as LeadStatus,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
]

const statusTabs: { value: LeadStatus | "all"; label: string; count: number }[] = [
  { value: "all", label: "All Leads", count: mockLeads.length },
  { value: "new", label: "New", count: mockLeads.filter((l) => l.status === "new").length },
  {
    value: "contacted",
    label: "Contacted",
    count: mockLeads.filter((l) => l.status === "contacted").length,
  },
  {
    value: "converted",
    label: "Converted",
    count: mockLeads.filter((l) => l.status === "converted").length,
  },
  {
    value: "declined",
    label: "Declined",
    count: mockLeads.filter((l) => l.status === "declined").length,
  },
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<LeadStatus | "all">("all")
  const [sortBy, setSortBy] = React.useState("newest")

  const filteredLeads = React.useMemo(() => {
    let leads = [...mockLeads]

    // Filter by status
    if (activeTab !== "all") {
      leads = leads.filter((lead) => lead.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      leads = leads.filter(
        (lead) =>
          lead.consumerName?.toLowerCase().includes(query) ||
          lead.category.toLowerCase().includes(query) ||
          lead.message.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortBy === "newest") {
      leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortBy === "oldest") {
      leads.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    }

    return leads
  }, [activeTab, searchQuery, sortBy])

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
                  {...lead}
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
