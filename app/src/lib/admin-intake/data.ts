import {
  buildDuplicateCandidates,
  buildDuplicateSummary,
  type DuplicateBusinessContext,
  normalizeWebsiteDomain,
} from "@/lib/admin-intake/dedupe"
import type {
  AdminBusinessQuery,
  AdminListingQuery,
} from "@/lib/admin-intake/schemas"
import { normalize, paginate } from "@/lib/admin-intake/utils"
import { createAdminClient } from "@/lib/supabase/admin"
import type {
  AdminBusinessRow,
  AdminDuplicateCandidatesResponse,
  AdminIntakeKpis,
  AdminListingRow,
  AdminLocation,
  AdvisorType,
  BusinessSource,
} from "@/types/admin-intake"

interface RawLocation {
  suburb?: string | null
  state?: string | null
  postcode?: string | null
}

interface RawBusinessListing {
  id: string
  advisor_type: AdvisorType
  is_active: boolean
  deleted_at: string | null
}

interface RawBusinessRow {
  id: string
  legal_name: string
  trading_name: string | null
  abn: string | null
  website: string | null
  email: string | null
  phone: string | null
  claimed_status: AdminBusinessRow["claimedStatus"]
  created_source: BusinessSource | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  location: RawLocation | null
  listing: RawBusinessListing[] | null
}

interface RawListingBusiness {
  id: string
  trading_name: string | null
  legal_name: string | null
  claimed_status: AdminListingRow["businessClaimedStatus"]
  website: string | null
  location: RawLocation | null
}

interface RawListingRow {
  id: string
  business_id: string
  headline: string | null
  bio: string | null
  advisor_type: AdminListingRow["advisorType"]
  service_mode: AdminListingRow["serviceMode"]
  fee_model: AdminListingRow["feeModel"]
  accepting_status: AdminListingRow["acceptingStatus"]
  verification_level: AdminListingRow["verificationLevel"]
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  business: RawListingBusiness | null
}

function toLocation(input: RawLocation | null): AdminLocation | null {
  if (!input) return null

  return {
    suburb: input.suburb || null,
    state: (input.state as AdminLocation["state"]) || null,
    postcode: input.postcode || null,
  }
}

function businessDisplayName(row: RawBusinessRow): string {
  return row.trading_name || row.legal_name || "Unknown"
}

function listingBusinessDisplayName(row: RawListingRow): string {
  return row.business?.trading_name || row.business?.legal_name || "Unknown"
}

function hasMissingRequiredBusinessFields(row: RawBusinessRow): boolean {
  const hasName = Boolean(row.legal_name?.trim())
  const hasTradingName = Boolean(row.trading_name?.trim())
  const hasWebsite = Boolean(normalizeWebsiteDomain(row.website))
  const hasLocation = Boolean(row.location?.state && row.location?.suburb && row.location?.postcode)
  const hasContact = Boolean(row.email?.trim() || row.phone?.trim())

  return !(hasName && hasTradingName && hasWebsite && hasLocation && hasContact)
}

function locationMatches(
  location: AdminLocation | null,
  filters: Pick<AdminBusinessQuery | AdminListingQuery, "state" | "postcode" | "suburb">
): boolean {
  if (!location) {
    return !filters.state && !filters.postcode && !filters.suburb
  }

  if (filters.state && normalize(location.state) !== normalize(filters.state)) return false
  if (filters.postcode && normalize(location.postcode) !== normalize(filters.postcode)) return false
  if (filters.suburb && !normalize(location.suburb).includes(normalize(filters.suburb))) return false

  return true
}

function businessHasAdvisorType(row: RawBusinessRow, advisorType?: AdvisorType): boolean {
  if (!advisorType) return true
  return (row.listing || []).some((listing) => listing.advisor_type === advisorType)
}

function buildBusinessKpis(rows: RawBusinessRow[]): AdminIntakeKpis {
  const activeRows = rows.filter((row) => !row.deleted_at)
  const duplicateSummary = buildDuplicateSummary(activeRows.map(toDuplicateContext))

  return {
    totalBusinesses: activeRows.length,
    activeListings: activeRows.reduce(
      (sum, row) =>
        sum +
        (row.listing || []).filter((listing) => listing.is_active && !listing.deleted_at).length,
      0
    ),
    unclaimedBusinesses: activeRows.filter((row) => row.claimed_status === "unclaimed").length,
    missingWebsiteBusinesses: activeRows.filter((row) => !normalizeWebsiteDomain(row.website)).length,
    businessesWithDuplicateCandidates: activeRows.filter(
      (row) => (duplicateSummary.get(row.id)?.count || 0) > 0
    ).length,
  }
}

function toDuplicateContext(row: RawBusinessRow): DuplicateBusinessContext {
  return {
    id: row.id,
    legalName: row.legal_name,
    tradingName: row.trading_name,
    abn: row.abn,
    website: row.website,
    location: toLocation(row.location),
  }
}

export async function fetchAllBusinesses(
  adminClient: ReturnType<typeof createAdminClient>
): Promise<RawBusinessRow[]> {
  const { data, error } = await adminClient
    .from("business")
    .select(
      `
      id,
      legal_name,
      trading_name,
      abn,
      website,
      email,
      phone,
      claimed_status,
      created_source,
      created_at,
      updated_at,
      deleted_at,
      location:primary_location_id (
        suburb,
        state,
        postcode
      ),
      listing (
        id,
        advisor_type,
        is_active,
        deleted_at
      )
    `
    )

  if (error) {
    throw new Error(`Failed to fetch businesses: ${error.message}`)
  }

  return (data || []) as unknown as RawBusinessRow[]
}

export async function fetchAllListings(
  adminClient: ReturnType<typeof createAdminClient>
): Promise<RawListingRow[]> {
  const { data, error } = await adminClient
    .from("listing")
    .select(
      `
      id,
      business_id,
      headline,
      bio,
      advisor_type,
      service_mode,
      fee_model,
      accepting_status,
      verification_level,
      is_active,
      created_at,
      updated_at,
      deleted_at,
      business!inner (
        id,
        trading_name,
        legal_name,
        claimed_status,
        website,
        location:primary_location_id (
          suburb,
          state,
          postcode
        )
      )
    `
    )

  if (error) {
    throw new Error(`Failed to fetch listings: ${error.message}`)
  }

  return (data || []) as unknown as RawListingRow[]
}

export function queryBusinesses(
  rows: RawBusinessRow[],
  filters: AdminBusinessQuery
): { items: AdminBusinessRow[]; pagination: ReturnType<typeof paginate<AdminBusinessRow>>["pagination"]; kpis: AdminIntakeKpis } {
  const page = filters.page || 1
  const pageSize = filters.pageSize || 25
  const activeRows = rows.filter((row) => !row.deleted_at)
  const duplicateSummary = buildDuplicateSummary(activeRows.map(toDuplicateContext))

  const filteredRows = rows.filter((row) => {
    if (!filters.include_deleted && row.deleted_at) return false

    if (filters.claimed_status && row.claimed_status !== filters.claimed_status) return false
    if (filters.created_source && row.created_source !== filters.created_source) return false
    if (!businessHasAdvisorType(row, filters.advisor_type)) return false

    const rowLocation = toLocation(row.location)
    if (!locationMatches(rowLocation, filters)) return false

    const websiteDomain = normalizeWebsiteDomain(row.website)
    if (filters.has_website !== undefined) {
      const hasWebsite = Boolean(websiteDomain)
      if (filters.has_website !== hasWebsite) return false
    }

    const missingRequired = hasMissingRequiredBusinessFields(row)
    if (filters.missing_required !== undefined && filters.missing_required !== missingRequired) return false

    const duplicateCount = duplicateSummary.get(row.id)?.count || 0
    if (filters.duplicates_only && duplicateCount === 0) return false

    if (filters.q) {
      const q = normalize(filters.q)
      const advisorTypes = (row.listing || []).map((listing) => listing.advisor_type).join(" ")
      const haystack = [
        businessDisplayName(row),
        row.legal_name,
        row.trading_name,
        row.abn,
        row.website,
        websiteDomain,
        row.email,
        row.phone,
        rowLocation?.suburb,
        rowLocation?.state,
        rowLocation?.postcode,
        advisorTypes,
      ]
        .map((part) => normalize(part))
        .join(" ")

      if (!haystack.includes(q)) return false
    }

    return true
  })

  const mappedRows: AdminBusinessRow[] = filteredRows.map((row) => {
    const location = toLocation(row.location)
    const activeListingCount = (row.listing || []).filter(
      (listing) => listing.is_active && !listing.deleted_at
    ).length
    const advisorTypes = [...new Set((row.listing || []).map((listing) => listing.advisor_type))]
    const websiteDomain = normalizeWebsiteDomain(row.website)
    const duplicateInfo = duplicateSummary.get(row.id)

    return {
      id: row.id,
      legalName: row.legal_name,
      tradingName: row.trading_name,
      displayName: businessDisplayName(row),
      abn: row.abn,
      website: row.website,
      websiteDomain,
      email: row.email,
      phone: row.phone,
      location,
      claimedStatus: row.claimed_status,
      createdSource: row.created_source,
      listingCount: (row.listing || []).filter((listing) => !listing.deleted_at).length,
      activeListingCount,
      advisorTypes,
      hasWebsite: Boolean(websiteDomain),
      hasMissingRequiredFields: hasMissingRequiredBusinessFields(row),
      duplicateCandidateCount: duplicateInfo?.count || 0,
      highestDuplicateScore: duplicateInfo?.highestScore ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    }
  })

  mappedRows.sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return +new Date(b.createdAt) - +new Date(a.createdAt)
      case "name_asc":
        return a.displayName.localeCompare(b.displayName)
      case "highest_duplicate_score":
        return (b.highestDuplicateScore || 0) - (a.highestDuplicateScore || 0)
      case "recently_updated":
      default:
        return +new Date(b.updatedAt) - +new Date(a.updatedAt)
    }
  })

  const paged = paginate(mappedRows, page, pageSize)

  return {
    items: paged.items,
    pagination: paged.pagination,
    kpis: buildBusinessKpis(rows),
  }
}

export function queryListings(
  listingRows: RawListingRow[],
  businessRows: RawBusinessRow[],
  filters: AdminListingQuery
): { items: AdminListingRow[]; pagination: ReturnType<typeof paginate<AdminListingRow>>["pagination"]; kpis: AdminIntakeKpis } {
  const page = filters.page || 1
  const pageSize = filters.pageSize || 25
  const filtered = listingRows.filter((row) => {
    if (!filters.include_deleted && row.deleted_at) return false
    if (filters.advisor_type && row.advisor_type !== filters.advisor_type) return false
    if (filters.is_active !== undefined && row.is_active !== filters.is_active) return false
    if (filters.accepting_status && row.accepting_status !== filters.accepting_status) return false
    if (filters.verification_level && row.verification_level !== filters.verification_level) return false
    if (filters.service_mode && row.service_mode !== filters.service_mode) return false
    if (filters.fee_model && row.fee_model !== filters.fee_model) return false

    const location = toLocation(row.business?.location || null)
    if (!locationMatches(location, filters)) return false

    if (filters.q) {
      const q = normalize(filters.q)
      const websiteDomain = normalizeWebsiteDomain(row.business?.website || null)
      const haystack = [
        row.headline,
        row.bio,
        row.business?.trading_name,
        row.business?.legal_name,
        row.business?.website,
        websiteDomain,
        location?.suburb,
        location?.state,
        location?.postcode,
      ]
        .map((part) => normalize(part))
        .join(" ")

      if (!haystack.includes(q)) return false
    }

    return true
  })

  const mappedRows: AdminListingRow[] = filtered.map((row) => ({
    id: row.id,
    businessId: row.business_id,
    businessName: listingBusinessDisplayName(row),
    businessClaimedStatus: row.business?.claimed_status || "unclaimed",
    advisorType: row.advisor_type,
    serviceMode: row.service_mode,
    feeModel: row.fee_model,
    acceptingStatus: row.accepting_status,
    verificationLevel: row.verification_level,
    isActive: row.is_active,
    headline: row.headline,
    bio: row.bio,
    location: toLocation(row.business?.location || null),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  }))

  mappedRows.sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return +new Date(b.createdAt) - +new Date(a.createdAt)
      case "name_asc":
        return a.businessName.localeCompare(b.businessName)
      case "recently_updated":
      default:
        return +new Date(b.updatedAt) - +new Date(a.updatedAt)
    }
  })

  const paged = paginate(mappedRows, page, pageSize)

  return {
    items: paged.items,
    pagination: paged.pagination,
    kpis: buildBusinessKpis(businessRows),
  }
}

export function getDuplicateCandidates(
  businessId: string,
  rows: RawBusinessRow[]
): AdminDuplicateCandidatesResponse {
  const target = rows.find((row) => row.id === businessId)

  if (!target) {
    throw new Error("Business not found")
  }

  const activeRows = rows.filter((row) => !row.deleted_at)
  const candidates = buildDuplicateCandidates(
    toDuplicateContext(target),
    activeRows.map(toDuplicateContext)
  )

  return {
    targetBusinessId: businessId,
    candidates,
  }
}

export type { RawBusinessRow, RawListingRow }
