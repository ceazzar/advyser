import type {
  AcceptingStatus,
  BusinessSource,
  ClaimStatus,
  FeeModel,
  VerificationLevel,
} from "@/types/admin-intake"

export const CLAIM_STATUS_OPTIONS: Array<{ value: ClaimStatus; label: string }> = [
  { value: "unclaimed", label: "Unclaimed" },
  { value: "pending", label: "Pending" },
  { value: "claimed", label: "Claimed" },
]

export const BUSINESS_SOURCE_OPTIONS: Array<{ value: BusinessSource; label: string }> = [
  { value: "manual", label: "Manual" },
  { value: "import", label: "Import" },
  { value: "scraped", label: "Scraped" },
]

export const ACCEPTING_STATUS_OPTIONS: Array<{ value: AcceptingStatus; label: string }> = [
  { value: "taking_clients", label: "Taking Clients" },
  { value: "waitlist", label: "Waitlist" },
  { value: "not_accepting", label: "Not Accepting" },
]

export const VERIFICATION_LEVEL_OPTIONS: Array<{ value: VerificationLevel; label: string }> = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic" },
  { value: "licence_verified", label: "Licence Verified" },
  { value: "enhanced", label: "Enhanced" },
]

export const FEE_MODEL_OPTIONS: Array<{ value: FeeModel; label: string }> = [
  { value: "hourly", label: "Hourly" },
  { value: "fixed", label: "Fixed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "percentage", label: "Percentage" },
  { value: "unknown", label: "Unknown" },
]
