import type { Database } from "@/types/database.generated"

export type AuState = Database["public"]["Enums"]["au_state"]
export type AdvisorType = Database["public"]["Enums"]["advisor_type"]
export type BusinessSource = Database["public"]["Enums"]["business_source"]
export type ClaimStatus = Database["public"]["Enums"]["claim_status"]
export type FeeModel = Database["public"]["Enums"]["fee_model"]
export type MeetingMode = Database["public"]["Enums"]["meeting_mode"]
export type AcceptingStatus = Database["public"]["Enums"]["accepting_status"]
export type VerificationLevel = Database["public"]["Enums"]["verification_level"]

export interface AdminLocation {
  suburb: string | null
  state: AuState | null
  postcode: string | null
}

export interface DuplicateCandidate {
  businessId: string
  legalName: string | null
  tradingName: string | null
  displayName: string
  abn: string | null
  website: string | null
  websiteDomain: string | null
  location: AdminLocation | null
  score: number
  nameSimilarity: number
  matchedSignals: string[]
  isFlagged: boolean
  samePostcode: boolean
  domainMatch: boolean
  abnMatch: boolean
}

export interface AdminBusinessRow {
  id: string
  legalName: string | null
  tradingName: string | null
  displayName: string
  abn: string | null
  website: string | null
  websiteDomain: string | null
  email: string | null
  phone: string | null
  location: AdminLocation | null
  claimedStatus: ClaimStatus
  createdSource: BusinessSource | null
  listingCount: number
  activeListingCount: number
  advisorTypes: AdvisorType[]
  hasWebsite: boolean
  hasMissingRequiredFields: boolean
  duplicateCandidateCount: number
  highestDuplicateScore: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface AdminListingRow {
  id: string
  businessId: string
  businessName: string
  businessClaimedStatus: ClaimStatus
  advisorType: AdvisorType
  serviceMode: MeetingMode
  feeModel: FeeModel | null
  acceptingStatus: AcceptingStatus
  verificationLevel: VerificationLevel
  isActive: boolean
  headline: string | null
  bio: string | null
  location: AdminLocation | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface AdminIntakeKpis {
  totalBusinesses: number
  activeListings: number
  unclaimedBusinesses: number
  missingWebsiteBusinesses: number
  businessesWithDuplicateCandidates: number
}

export interface AdminBusinessFilters {
  q?: string
  state?: AuState
  suburb?: string
  postcode?: string
  advisorType?: AdvisorType
  claimedStatus?: ClaimStatus
  createdSource?: BusinessSource
  hasWebsite?: boolean
  missingRequired?: boolean
  duplicatesOnly?: boolean
  includeDeleted?: boolean
  sort?: "recently_updated" | "newest" | "name_asc" | "highest_duplicate_score"
  page?: number
  pageSize?: number
}

export interface AdminListingFilters {
  q?: string
  state?: AuState
  suburb?: string
  postcode?: string
  advisorType?: AdvisorType
  isActive?: boolean
  acceptingStatus?: AcceptingStatus
  verificationLevel?: VerificationLevel
  serviceMode?: MeetingMode
  feeModel?: FeeModel
  includeDeleted?: boolean
  sort?: "recently_updated" | "newest" | "name_asc"
  page?: number
  pageSize?: number
}

export interface AdminBusinessesResponse {
  items: AdminBusinessRow[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  kpis: AdminIntakeKpis
}

export interface AdminListingsResponse {
  items: AdminListingRow[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  kpis: AdminIntakeKpis
}

export interface AdminDuplicateCandidatesResponse {
  targetBusinessId: string
  candidates: DuplicateCandidate[]
}
