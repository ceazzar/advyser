"use client"

import {
  AlertTriangle,
  Copy,
  Eye,
  ListFilter,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ACCEPTING_STATUS_OPTIONS,
  BUSINESS_SOURCE_OPTIONS,
  CLAIM_STATUS_OPTIONS,
  FEE_MODEL_OPTIONS,
  VERIFICATION_LEVEL_OPTIONS,
} from "@/lib/admin-intake/constants"
import { ADVISOR_TYPE_OPTIONS, AU_STATES } from "@/lib/constants/marketplace-taxonomy"
import { cn } from "@/lib/utils"
import type {
  AdminBusinessesResponse,
  AdminBusinessRow,
  AdminDuplicateCandidatesResponse,
  AdminListingRow,
  AdminListingsResponse,
  DuplicateCandidate,
} from "@/types/admin-intake"

const DEFAULT_PAGE_SIZE = 25

type IntakeView = "businesses" | "listings"

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: {
    message?: string
  }
}

interface BusinessFormState {
  legalName: string
  tradingName: string
  website: string
  phone: string
  email: string
  state: string
  suburb: string
  postcode: string
  claimedStatus: string
  createdSource: string
}

interface ListingFormState {
  businessId: string
  advisorType: string
  serviceMode: string
  feeModel: string
  acceptingStatus: string
  verificationLevel: string
  isActive: boolean
  headline: string
  bio: string
}

const EMPTY_BUSINESS_FORM: BusinessFormState = {
  legalName: "",
  tradingName: "",
  website: "",
  phone: "",
  email: "",
  state: "",
  suburb: "",
  postcode: "",
  claimedStatus: "unclaimed",
  createdSource: "manual",
}

const EMPTY_LISTING_FORM: ListingFormState = {
  businessId: "",
  advisorType: "mortgage_broker",
  serviceMode: "both",
  feeModel: "unknown",
  acceptingStatus: "taking_clients",
  verificationLevel: "none",
  isActive: true,
  headline: "",
  bio: "",
}

function formatLabel(value: string | null | undefined): string {
  if (!value) return "Unknown"
  return value
    .split("_")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ")
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatLocation(location: {
  suburb: string | null
  state: string | null
  postcode: string | null
} | null): string {
  if (!location) return "-"

  return [location.suburb, location.state, location.postcode].filter(Boolean).join(", ") || "-"
}

function isTruthyParam(value: string | null): boolean {
  return value === "true"
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  const payload = (await response.json()) as ApiResponse<T>
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message || "Request failed")
  }

  return payload.data
}

function getBusinessFormFromRow(row: AdminBusinessRow): BusinessFormState {
  return {
    legalName: row.legalName || "",
    tradingName: row.tradingName || "",
    website: row.website || "",
    phone: row.phone || "",
    email: row.email || "",
    state: row.location?.state || "",
    suburb: row.location?.suburb || "",
    postcode: row.location?.postcode || "",
    claimedStatus: row.claimedStatus,
    createdSource: row.createdSource || "manual",
  }
}

function getListingFormFromRow(row: AdminListingRow): ListingFormState {
  return {
    businessId: row.businessId,
    advisorType: row.advisorType,
    serviceMode: row.serviceMode,
    feeModel: row.feeModel || "unknown",
    acceptingStatus: row.acceptingStatus,
    verificationLevel: row.verificationLevel,
    isActive: row.isActive,
    headline: row.headline || "",
    bio: row.bio || "",
  }
}

export default function AdminIntakePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const view: IntakeView = searchParams.get("view") === "listings" ? "listings" : "businesses"
  const searchParamsKey = searchParams.toString()

  const [isLoading, setIsLoading] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [actionError, setActionError] = React.useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [businessData, setBusinessData] = React.useState<AdminBusinessesResponse | null>(null)
  const [listingData, setListingData] = React.useState<AdminListingsResponse | null>(null)

  const [businessEditorOpen, setBusinessEditorOpen] = React.useState(false)
  const [listingEditorOpen, setListingEditorOpen] = React.useState(false)
  const [duplicatesDrawerOpen, setDuplicatesDrawerOpen] = React.useState(false)

  const [selectedBusiness, setSelectedBusiness] = React.useState<AdminBusinessRow | null>(null)
  const [selectedListing, setSelectedListing] = React.useState<AdminListingRow | null>(null)

  const [businessForm, setBusinessForm] = React.useState<BusinessFormState>(EMPTY_BUSINESS_FORM)
  const [listingForm, setListingForm] = React.useState<ListingFormState>(EMPTY_LISTING_FORM)

  const [businessOptions, setBusinessOptions] = React.useState<AdminBusinessRow[]>([])
  const [duplicateData, setDuplicateData] = React.useState<AdminDuplicateCandidatesResponse | null>(null)
  const [isLoadingDuplicates, setIsLoadingDuplicates] = React.useState(false)
  const [duplicateError, setDuplicateError] = React.useState<string | null>(null)
  const [duplicateDeleteId, setDuplicateDeleteId] = React.useState<string | null>(null)

  const currentPage = Number(searchParams.get("page") || "1") || 1
  const pageSize = Number(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE

  const rows = view === "businesses" ? businessData?.items || [] : listingData?.items || []
  const pagination = view === "businesses" ? businessData?.pagination : listingData?.pagination
  const kpis = view === "businesses" ? businessData?.kpis : listingData?.kpis

  const updateParams = React.useCallback(
    (
      updates: Record<string, string | null | undefined>,
      options?: {
        resetPage?: boolean
      }
    ) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      if (options?.resetPage !== false) {
        params.set("page", "1")
      }

      if (!params.has("pageSize")) {
        params.set("pageSize", String(DEFAULT_PAGE_SIZE))
      }

      router.replace(`/admin/intake?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const setView = React.useCallback(
    (nextView: IntakeView) => {
      updateParams({ view: nextView, page: "1" })
    },
    [updateParams]
  )

  const loadCurrentData = React.useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      if (view === "businesses") {
        const data = await requestJson<AdminBusinessesResponse>(
          `/api/admin/businesses?${searchParamsKey}`
        )
        setBusinessData(data)
      } else {
        const data = await requestJson<AdminListingsResponse>(
          `/api/admin/listings?${searchParamsKey}`
        )
        setListingData(data)
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load admin data")
    } finally {
      setIsLoading(false)
    }
  }, [searchParamsKey, view])

  const loadBusinessOptions = React.useCallback(async () => {
    try {
      const data = await requestJson<AdminBusinessesResponse>(
        "/api/admin/businesses?page=1&pageSize=100&sort=name_asc"
      )
      setBusinessOptions(data.items)
    } catch {
      // Keep editor usable with manual business UUID entry if this fails.
      setBusinessOptions([])
    }
  }, [])

  React.useEffect(() => {
    void loadCurrentData()
  }, [loadCurrentData])

  React.useEffect(() => {
    if (listingEditorOpen || businessOptions.length === 0) {
      void loadBusinessOptions()
    }
  }, [listingEditorOpen, businessOptions.length, loadBusinessOptions])

  React.useEffect(() => {
    setActionError(null)
    setActionSuccess(null)
  }, [searchParamsKey])

  const applyPreset = React.useCallback(
    (preset: "all" | "melbourne_mortgage" | "sydney_mortgage") => {
      if (preset === "all") {
        updateParams({
          state: null,
          suburb: null,
          postcode: null,
          advisor_type: null,
        })
        return
      }

      if (preset === "melbourne_mortgage") {
        updateParams({
          state: "VIC",
          suburb: "melbourne",
          postcode: null,
          advisor_type: "mortgage_broker",
        })
        return
      }

      updateParams({
        state: "NSW",
        suburb: "sydney",
        postcode: null,
        advisor_type: "mortgage_broker",
      })
    },
    [updateParams]
  )

  const openNewBusiness = React.useCallback(() => {
    setSelectedBusiness(null)
    setBusinessForm(EMPTY_BUSINESS_FORM)
    setBusinessEditorOpen(true)
  }, [])

  const openEditBusiness = React.useCallback((business: AdminBusinessRow) => {
    setSelectedBusiness(business)
    setBusinessForm(getBusinessFormFromRow(business))
    setBusinessEditorOpen(true)
  }, [])

  const openNewListing = React.useCallback(() => {
    setSelectedListing(null)
    setListingForm(EMPTY_LISTING_FORM)
    setListingEditorOpen(true)
  }, [])

  const openEditListing = React.useCallback((listing: AdminListingRow) => {
    setSelectedListing(listing)
    setListingForm(getListingFormFromRow(listing))
    setListingEditorOpen(true)
  }, [])

  const loadDuplicateCandidates = React.useCallback(async (business: AdminBusinessRow) => {
    setSelectedBusiness(business)
    setDuplicatesDrawerOpen(true)
    setIsLoadingDuplicates(true)
    setDuplicateError(null)

    try {
      const response = await requestJson<AdminDuplicateCandidatesResponse>(
        `/api/admin/businesses/${business.id}/duplicates`
      )
      setDuplicateData(response)
    } catch (error) {
      setDuplicateData(null)
      setDuplicateError(
        error instanceof Error ? error.message : "Failed to load duplicate candidates"
      )
    } finally {
      setIsLoadingDuplicates(false)
    }
  }, [])

  const saveBusiness = React.useCallback(async () => {
    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    const hasCompleteLocation =
      Boolean(businessForm.state) && Boolean(businessForm.suburb) && Boolean(businessForm.postcode)

    try {
      if (!businessForm.legalName.trim()) {
        throw new Error("Legal name is required")
      }

      if (selectedBusiness) {
        await requestJson<{ id: string }>(`/api/admin/businesses/${selectedBusiness.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            legal_name: businessForm.legalName.trim(),
            trading_name: businessForm.tradingName.trim() || null,
            website: businessForm.website.trim() || null,
            phone: businessForm.phone.trim() || null,
            email: businessForm.email.trim() || null,
            claimed_status: businessForm.claimedStatus,
            created_source: businessForm.createdSource,
            location: hasCompleteLocation
              ? {
                  state: businessForm.state,
                  suburb: businessForm.suburb,
                  postcode: businessForm.postcode,
                }
              : null,
          }),
        })

        setActionSuccess("Business updated")
      } else {
        await requestJson<{ id: string }>("/api/admin/businesses", {
          method: "POST",
          body: JSON.stringify({
            legal_name: businessForm.legalName.trim(),
            trading_name: businessForm.tradingName.trim() || undefined,
            website: businessForm.website.trim() || undefined,
            phone: businessForm.phone.trim() || undefined,
            email: businessForm.email.trim() || undefined,
            claimed_status: businessForm.claimedStatus,
            created_source: businessForm.createdSource,
            location: hasCompleteLocation
              ? {
                  state: businessForm.state,
                  suburb: businessForm.suburb,
                  postcode: businessForm.postcode,
                }
              : undefined,
          }),
        })

        setActionSuccess("Business created")
      }

      setBusinessEditorOpen(false)
      await loadCurrentData()
      await loadBusinessOptions()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to save business")
    } finally {
      setIsSubmitting(false)
    }
  }, [
    businessForm,
    loadBusinessOptions,
    loadCurrentData,
    selectedBusiness,
  ])

  const softDeleteBusiness = React.useCallback(async (business: AdminBusinessRow) => {
    if (!window.confirm(`Soft delete ${business.displayName}?`)) return

    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    try {
      await requestJson<{ id: string; deletedAt: string }>(`/api/admin/businesses/${business.id}`, {
        method: "DELETE",
      })
      setActionSuccess("Business soft deleted")
      setBusinessEditorOpen(false)
      await loadCurrentData()
      await loadBusinessOptions()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to delete business")
    } finally {
      setIsSubmitting(false)
    }
  }, [loadBusinessOptions, loadCurrentData])

  const restoreBusiness = React.useCallback(async (business: AdminBusinessRow) => {
    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    try {
      await requestJson<{ id: string }>(`/api/admin/businesses/${business.id}`, {
        method: "PATCH",
        body: JSON.stringify({ restore: true }),
      })
      setActionSuccess("Business restored")
      setBusinessEditorOpen(false)
      await loadCurrentData()
      await loadBusinessOptions()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to restore business")
    } finally {
      setIsSubmitting(false)
    }
  }, [loadBusinessOptions, loadCurrentData])

  const saveListing = React.useCallback(async () => {
    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    try {
      if (!listingForm.businessId.trim()) {
        throw new Error("Business is required")
      }

      if (selectedListing) {
        await requestJson<{ id: string }>(`/api/admin/listings/${selectedListing.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            business_id: listingForm.businessId,
            advisor_type: listingForm.advisorType,
            service_mode: listingForm.serviceMode,
            fee_model: listingForm.feeModel,
            accepting_status: listingForm.acceptingStatus,
            verification_level: listingForm.verificationLevel,
            is_active: listingForm.isActive,
            headline: listingForm.headline.trim() || null,
            bio: listingForm.bio.trim() || null,
          }),
        })

        setActionSuccess("Listing updated")
      } else {
        await requestJson<{ id: string }>("/api/admin/listings", {
          method: "POST",
          body: JSON.stringify({
            business_id: listingForm.businessId,
            advisor_type: listingForm.advisorType,
            service_mode: listingForm.serviceMode,
            fee_model: listingForm.feeModel,
            accepting_status: listingForm.acceptingStatus,
            is_active: listingForm.isActive,
            headline: listingForm.headline.trim() || undefined,
            bio: listingForm.bio.trim() || undefined,
          }),
        })

        setActionSuccess("Listing created")
      }

      setListingEditorOpen(false)
      await loadCurrentData()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to save listing")
    } finally {
      setIsSubmitting(false)
    }
  }, [listingForm, loadCurrentData, selectedListing])

  const softDeleteListing = React.useCallback(async (listing: AdminListingRow) => {
    if (!window.confirm(`Soft delete listing ${listing.id}?`)) return

    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    try {
      await requestJson<{ id: string; deletedAt: string }>(`/api/admin/listings/${listing.id}`, {
        method: "DELETE",
      })
      setActionSuccess("Listing soft deleted")
      setListingEditorOpen(false)
      await loadCurrentData()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to delete listing")
    } finally {
      setIsSubmitting(false)
    }
  }, [loadCurrentData])

  const restoreListing = React.useCallback(async (listing: AdminListingRow) => {
    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    try {
      await requestJson<{ id: string }>(`/api/admin/listings/${listing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ restore: true }),
      })
      setActionSuccess("Listing restored")
      setListingEditorOpen(false)
      await loadCurrentData()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to restore listing")
    } finally {
      setIsSubmitting(false)
    }
  }, [loadCurrentData])

  const deactivateListing = React.useCallback(async (listing: AdminListingRow) => {
    setActionError(null)
    setActionSuccess(null)
    setIsSubmitting(true)

    try {
      await requestJson<{ id: string }>(`/api/admin/listings/${listing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: false }),
      })
      setActionSuccess("Listing deactivated")
      setListingEditorOpen(false)
      await loadCurrentData()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to deactivate listing")
    } finally {
      setIsSubmitting(false)
    }
  }, [loadCurrentData])

  const softDeleteDuplicateCandidate = React.useCallback(
    async (candidate: DuplicateCandidate) => {
      if (!window.confirm(`Soft delete duplicate candidate ${candidate.displayName}?`)) return

      setDuplicateDeleteId(candidate.businessId)
      setActionError(null)
      setActionSuccess(null)

      try {
        await requestJson<{ id: string; deletedAt: string }>(
          `/api/admin/businesses/${candidate.businessId}`,
          {
            method: "DELETE",
          }
        )

        setDuplicateData((previous) => {
          if (!previous) return previous
          return {
            ...previous,
            candidates: previous.candidates.filter(
              (item) => item.businessId !== candidate.businessId
            ),
          }
        })
        setActionSuccess("Duplicate candidate soft deleted")
        await loadCurrentData()
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Unable to delete duplicate")
      } finally {
        setDuplicateDeleteId(null)
      }
    },
    [loadCurrentData]
  )

  return (
    <div className="min-h-screen bg-muted/20 pb-8">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 p-4 md:p-6">
        <Card className="sticky top-0 z-20 border shadow-sm backdrop-blur">
          <CardContent className="space-y-4 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Admin Intake</h1>
                <p className="text-sm text-muted-foreground">
                  Lightweight intake and cleanup for businesses and listings.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={openNewBusiness}>
                  <Plus className="size-4" />
                  New Business
                </Button>
                <Button variant="outline" size="sm" onClick={openNewListing}>
                  <Plus className="size-4" />
                  New Listing
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Tabs value={view} onValueChange={(value) => setView(value as IntakeView)}>
                <TabsList>
                  <TabsTrigger value="businesses">Businesses</TabsTrigger>
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={() => applyPreset("all")}>All Australia</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyPreset("melbourne_mortgage")}
                >
                  Melbourne Mortgage
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyPreset("sydney_mortgage")}
                >
                  Sydney Mortgage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {actionError ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        ) : null}
        {actionSuccess ? (
          <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {actionSuccess}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="gap-2 py-4">
            <CardHeader className="px-4 pb-0">
              <CardDescription>Total Businesses</CardDescription>
              <CardTitle className="text-2xl">{kpis?.totalBusinesses ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="gap-2 py-4">
            <CardHeader className="px-4 pb-0">
              <CardDescription>Active Listings</CardDescription>
              <CardTitle className="text-2xl">{kpis?.activeListings ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="gap-2 py-4">
            <CardHeader className="px-4 pb-0">
              <CardDescription>Unclaimed Businesses</CardDescription>
              <CardTitle className="text-2xl">{kpis?.unclaimedBusinesses ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="gap-2 py-4">
            <CardHeader className="px-4 pb-0">
              <CardDescription>Missing Websites</CardDescription>
              <CardTitle className="text-2xl">{kpis?.missingWebsiteBusinesses ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="gap-2 py-4">
            <CardHeader className="px-4 pb-0">
              <CardDescription>Duplicate Candidates</CardDescription>
              <CardTitle className="text-2xl">
                {kpis?.businessesWithDuplicateCandidates ?? 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListFilter className="size-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-4 md:px-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <Label>Global Search</Label>
                <Input
                  value={searchParams.get("q") || ""}
                  onChange={(event) => updateParams({ q: event.target.value })}
                  placeholder="Name, ABN, website, suburb..."
                  leftIcon={<Search className="size-4" />}
                />
              </div>

              <div className="space-y-1">
                <Label>State</Label>
                <Select
                  value={searchParams.get("state") || "all"}
                  onValueChange={(value) =>
                    updateParams({ state: value === "all" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All states</SelectItem>
                    {AU_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Suburb</Label>
                <Input
                  value={searchParams.get("suburb") || ""}
                  onChange={(event) => updateParams({ suburb: event.target.value })}
                  placeholder="e.g. Melbourne"
                />
              </div>

              <div className="space-y-1">
                <Label>Postcode</Label>
                <Input
                  value={searchParams.get("postcode") || ""}
                  onChange={(event) => updateParams({ postcode: event.target.value })}
                  placeholder="3000"
                  maxLength={4}
                />
              </div>

              <div className="space-y-1">
                <Label>Advisor Type</Label>
                <Select
                  value={searchParams.get("advisor_type") || "all"}
                  onValueChange={(value) =>
                    updateParams({ advisor_type: value === "all" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All advisor types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All advisor types</SelectItem>
                    {ADVISOR_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {view === "businesses" ? (
                <>
                  <div className="space-y-1">
                    <Label>Claim Status</Label>
                    <Select
                      value={searchParams.get("claimed_status") || "all"}
                      onValueChange={(value) =>
                        updateParams({ claimed_status: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All claim states" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All claim states</SelectItem>
                        {CLAIM_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Created Source</Label>
                    <Select
                      value={searchParams.get("created_source") || "all"}
                      onValueChange={(value) =>
                        updateParams({ created_source: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sources</SelectItem>
                        {BUSINESS_SOURCE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Has Website</Label>
                    <Select
                      value={searchParams.get("has_website") || "all"}
                      onValueChange={(value) =>
                        updateParams({ has_website: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Sort</Label>
                    <Select
                      value={searchParams.get("sort") || "recently_updated"}
                      onValueChange={(value) => updateParams({ sort: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recently_updated">Recently Updated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="name_asc">Name A-Z</SelectItem>
                        <SelectItem value="highest_duplicate_score">
                          Highest Duplicate Score
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label>Active Status</Label>
                    <Select
                      value={searchParams.get("is_active") || "all"}
                      onValueChange={(value) =>
                        updateParams({ is_active: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All listings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Accepting Status</Label>
                    <Select
                      value={searchParams.get("accepting_status") || "all"}
                      onValueChange={(value) =>
                        updateParams({ accepting_status: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {ACCEPTING_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Verification</Label>
                    <Select
                      value={searchParams.get("verification_level") || "all"}
                      onValueChange={(value) =>
                        updateParams({ verification_level: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {VERIFICATION_LEVEL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Service Mode</Label>
                    <Select
                      value={searchParams.get("service_mode") || "all"}
                      onValueChange={(value) =>
                        updateParams({ service_mode: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in_person">In Person</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Fee Model</Label>
                    <Select
                      value={searchParams.get("fee_model") || "all"}
                      onValueChange={(value) =>
                        updateParams({ fee_model: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {FEE_MODEL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Sort</Label>
                    <Select
                      value={searchParams.get("sort") || "recently_updated"}
                      onValueChange={(value) => updateParams({ sort: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recently_updated">Recently Updated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="name_asc">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-4">
              {view === "businesses" ? (
                <>
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={isTruthyParam(searchParams.get("missing_required"))}
                      onCheckedChange={(checked) =>
                        updateParams({ missing_required: checked ? "true" : null })
                      }
                    />
                    Missing required fields
                  </Label>

                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={isTruthyParam(searchParams.get("duplicates_only"))}
                      onCheckedChange={(checked) =>
                        updateParams({ duplicates_only: checked ? "true" : null })
                      }
                    />
                    Duplicate candidates only
                  </Label>
                </>
              ) : null}

              <Label className="flex items-center gap-2">
                <Switch
                  checked={isTruthyParam(searchParams.get("include_deleted"))}
                  onCheckedChange={(checked) =>
                    updateParams({ include_deleted: checked ? "true" : null })
                  }
                />
                Include soft-deleted records
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle>
              {view === "businesses" ? "Businesses" : "Listings"} ({pagination?.totalItems || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-4 md:px-6">
            {loadError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {loadError}
              </div>
            ) : null}

            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
            ) : null}

            {!isLoading && !loadError && rows.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No records match your current filters.
              </div>
            ) : null}

            {!isLoading && !loadError && rows.length > 0 ? (
              <>
                {view === "businesses" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Advisor Types</TableHead>
                        <TableHead>Claim</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Completeness</TableHead>
                        <TableHead>Duplicates</TableHead>
                        <TableHead>Listings</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(rows as AdminBusinessRow[]).map((business) => (
                        <TableRow key={business.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-foreground">{business.displayName}</span>
                              <span className="text-xs text-muted-foreground">{business.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatLocation(business.location)}</TableCell>
                          <TableCell>
                            <div className="flex max-w-[220px] flex-wrap gap-1">
                              {business.advisorTypes.length ? (
                                business.advisorTypes.map((advisorType) => (
                                  <Badge key={advisorType} size="sm" status="inactive">
                                    {formatLabel(advisorType)}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              size="sm"
                              status={
                                business.claimedStatus === "claimed"
                                  ? "active"
                                  : business.claimedStatus === "pending"
                                    ? "pending"
                                    : "inactive"
                              }
                            >
                              {formatLabel(business.claimedStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {business.websiteDomain ? (
                              <span className="text-xs text-foreground">{business.websiteDomain}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Missing</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {business.hasMissingRequiredFields ? (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                                <AlertTriangle className="size-3.5" />
                                Missing
                              </span>
                            ) : (
                              <span className="text-xs text-green-700">Complete</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "text-xs",
                                business.duplicateCandidateCount > 0
                                  ? "font-medium text-amber-700"
                                  : "text-muted-foreground"
                              )}
                            >
                              {business.duplicateCandidateCount}
                              {business.highestDuplicateScore
                                ? ` (max ${business.highestDuplicateScore})`
                                : ""}
                            </span>
                          </TableCell>
                          <TableCell>
                            {business.activeListingCount}/{business.listingCount}
                          </TableCell>
                          <TableCell>{formatDateTime(business.updatedAt)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => openEditBusiness(business)}
                              >
                                <Eye className="size-3.5" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => loadDuplicateCandidates(business)}
                              >
                                <Copy className="size-3.5" />
                                Duplicates
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Advisor Type</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Accepting</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(rows as AdminListingRow[]).map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-foreground">{listing.businessName}</span>
                              <span className="text-xs text-muted-foreground">{listing.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatLabel(listing.advisorType)}</TableCell>
                          <TableCell>{formatLabel(listing.serviceMode)}</TableCell>
                          <TableCell>{formatLabel(listing.feeModel)}</TableCell>
                          <TableCell>{formatLabel(listing.acceptingStatus)}</TableCell>
                          <TableCell>{formatLabel(listing.verificationLevel)}</TableCell>
                          <TableCell>
                            <Badge size="sm" status={listing.isActive ? "active" : "inactive"}>
                              {listing.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatLocation(listing.location)}</TableCell>
                          <TableCell>{formatDateTime(listing.updatedAt)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => openEditListing(listing)}
                              >
                                <Eye className="size-3.5" />
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <div className="flex flex-col items-center justify-between gap-3 border-t pt-3 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination?.page || currentPage} of {pagination?.totalPages || 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!pagination?.hasPreviousPage}
                      onClick={() => updateParams({ page: String(Math.max(1, currentPage - 1)) }, { resetPage: false })}
                    >
                      Previous
                    </Button>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => updateParams({ pageSize: value, page: "1" }, { resetPage: false })}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Rows" />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 25, 50, 100].map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size} / page
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!pagination?.hasNextPage}
                      onClick={() =>
                        updateParams(
                          {
                            page: String(
                              Math.min(
                                pagination?.totalPages || currentPage,
                                currentPage + 1
                              )
                            ),
                          },
                          { resetPage: false }
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Sheet open={businessEditorOpen} onOpenChange={setBusinessEditorOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{selectedBusiness ? "Edit Business" : "Create Business"}</SheetTitle>
            <SheetDescription>
              Manage individual business intake records and lifecycle state.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-24">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Legal Name</Label>
                <Input
                  value={businessForm.legalName}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      legalName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Trading Name</Label>
                <Input
                  value={businessForm.tradingName}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      tradingName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Website</Label>
                <Input
                  value={businessForm.website}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      website: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={businessForm.phone}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  value={businessForm.email}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Claim Status</Label>
                <Select
                  value={businessForm.claimedStatus}
                  onValueChange={(value) =>
                    setBusinessForm((previous) => ({ ...previous, claimedStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLAIM_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Created Source</Label>
                <Select
                  value={businessForm.createdSource}
                  onValueChange={(value) =>
                    setBusinessForm((previous) => ({ ...previous, createdSource: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_SOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label>State</Label>
                <Select
                  value={businessForm.state || "all"}
                  onValueChange={(value) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      state: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Unset</SelectItem>
                    {AU_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Suburb</Label>
                <Input
                  value={businessForm.suburb}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      suburb: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Postcode</Label>
                <Input
                  maxLength={4}
                  value={businessForm.postcode}
                  onChange={(event) =>
                    setBusinessForm((previous) => ({
                      ...previous,
                      postcode: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {selectedBusiness?.deletedAt ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                This business is soft-deleted and currently hidden from default listings.
              </div>
            ) : null}
          </div>

          <SheetFooter className="border-t bg-background">
            {selectedBusiness ? (
              selectedBusiness.deletedAt ? (
                <Button
                  variant="secondary"
                  onClick={() => void restoreBusiness(selectedBusiness)}
                  loading={isSubmitting}
                >
                  <RotateCcw className="size-4" />
                  Restore
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => void softDeleteBusiness(selectedBusiness)}
                  loading={isSubmitting}
                >
                  <Trash2 className="size-4" />
                  Soft Delete
                </Button>
              )
            ) : null}
            <Button variant="outline" onClick={() => setBusinessEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveBusiness()} loading={isSubmitting}>
              <Save className="size-4" />
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={listingEditorOpen} onOpenChange={setListingEditorOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{selectedListing ? "Edit Listing" : "Create Listing"}</SheetTitle>
            <SheetDescription>
              Manage listing metadata, activation state, and intake quality.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-24">
            <div className="space-y-1">
              <Label>Business</Label>
              <Select
                value={listingForm.businessId || "manual"}
                onValueChange={(value) =>
                  setListingForm((previous) => ({
                    ...previous,
                    businessId: value === "manual" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Enter manually</SelectItem>
                  {businessOptions.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Business UUID</Label>
              <Input
                value={listingForm.businessId}
                onChange={(event) =>
                  setListingForm((previous) => ({
                    ...previous,
                    businessId: event.target.value,
                  }))
                }
                placeholder="Business ID"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Advisor Type</Label>
                <Select
                  value={listingForm.advisorType}
                  onValueChange={(value) =>
                    setListingForm((previous) => ({
                      ...previous,
                      advisorType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADVISOR_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Service Mode</Label>
                <Select
                  value={listingForm.serviceMode}
                  onValueChange={(value) =>
                    setListingForm((previous) => ({
                      ...previous,
                      serviceMode: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Fee Model</Label>
                <Select
                  value={listingForm.feeModel}
                  onValueChange={(value) =>
                    setListingForm((previous) => ({
                      ...previous,
                      feeModel: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_MODEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Accepting Status</Label>
                <Select
                  value={listingForm.acceptingStatus}
                  onValueChange={(value) =>
                    setListingForm((previous) => ({
                      ...previous,
                      acceptingStatus: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCEPTING_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Verification Level</Label>
                <Select
                  value={listingForm.verificationLevel}
                  onValueChange={(value) =>
                    setListingForm((previous) => ({
                      ...previous,
                      verificationLevel: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-2 pt-7">
                  <Switch
                    checked={listingForm.isActive}
                    onCheckedChange={(checked) =>
                      setListingForm((previous) => ({
                        ...previous,
                        isActive: checked,
                      }))
                    }
                  />
                  Active listing
                </Label>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Headline</Label>
              <Input
                value={listingForm.headline}
                onChange={(event) =>
                  setListingForm((previous) => ({
                    ...previous,
                    headline: event.target.value,
                  }))
                }
                placeholder="Optional headline"
              />
            </div>

            <div className="space-y-1">
              <Label>Bio</Label>
              <Textarea
                value={listingForm.bio}
                onChange={(event) =>
                  setListingForm((previous) => ({
                    ...previous,
                    bio: event.target.value,
                  }))
                }
                placeholder="Short intake bio"
                maxLength={4000}
                showCount
              />
            </div>

            {selectedListing?.deletedAt ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                This listing is soft-deleted and currently hidden from default results.
              </div>
            ) : null}
          </div>

          <SheetFooter className="border-t bg-background">
            {selectedListing ? (
              selectedListing.deletedAt ? (
                <Button
                  variant="secondary"
                  onClick={() => void restoreListing(selectedListing)}
                  loading={isSubmitting}
                >
                  <RotateCcw className="size-4" />
                  Restore
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => void deactivateListing(selectedListing)}
                    loading={isSubmitting}
                  >
                    Deactivate
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => void softDeleteListing(selectedListing)}
                    loading={isSubmitting}
                  >
                    <Trash2 className="size-4" />
                    Soft Delete
                  </Button>
                </>
              )
            ) : null}
            <Button variant="outline" onClick={() => setListingEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveListing()} loading={isSubmitting}>
              <Save className="size-4" />
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={duplicatesDrawerOpen} onOpenChange={setDuplicatesDrawerOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Duplicate Review</SheetTitle>
            <SheetDescription>
              Review and resolve duplicate candidates for
              {" "}
              <span className="font-medium text-foreground">
                {selectedBusiness?.displayName || "selected business"}
              </span>
              .
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-24">
            {isLoadingDuplicates ? (
              <p className="text-sm text-muted-foreground">Loading duplicate candidates…</p>
            ) : null}

            {duplicateError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {duplicateError}
              </div>
            ) : null}

            {!isLoadingDuplicates && !duplicateError && !duplicateData?.candidates.length ? (
              <p className="text-sm text-muted-foreground">
                No duplicate candidates found for this business.
              </p>
            ) : null}

            {duplicateData?.candidates.map((candidate) => (
              <Card key={candidate.businessId}>
                <CardContent className="space-y-3 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{candidate.displayName}</div>
                      <div className="text-xs text-muted-foreground">{candidate.businessId}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatLocation(candidate.location)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Score</div>
                      <div className="text-xl font-semibold text-amber-700">{candidate.score}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {candidate.matchedSignals.map((signal) => (
                      <Badge key={`${candidate.businessId}-${signal}`} size="sm" status="pending">
                        {formatLabel(signal)}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <div>ABN: {candidate.abn || "-"}</div>
                    <div>Domain: {candidate.websiteDomain || "-"}</div>
                    <div>Name similarity: {(candidate.nameSimilarity * 100).toFixed(1)}%</div>
                    <div>Postcode match: {candidate.samePostcode ? "Yes" : "No"}</div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      loading={duplicateDeleteId === candidate.businessId}
                      onClick={() => void softDeleteDuplicateCandidate(candidate)}
                    >
                      <Trash2 className="size-4" />
                      Soft Delete Candidate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
