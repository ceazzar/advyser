/**
 * Advisor Types
 * Australian financial advisor types with AFSL/ASIC compliance fields
 */

import type { Profile,User } from './user'

/**
 * Verification status for credentials
 * Matches: credential_status ENUM in schema.sql
 */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired'

/**
 * Verification level for advisors
 * Matches: verification_level ENUM in schema.sql
 */
export type VerificationLevel = 'none' | 'basic' | 'licence_verified' | 'enhanced'

/**
 * Credential types for Australian financial services
 * Matches: credential_type ENUM in schema.sql
 */
export type CredentialType =
  | 'afsl'                // Australian Financial Services Licence (business)
  | 'limited_afsl'        // Limited AFSL (business, restricted scope)
  | 'authorised_rep'      // Authorised Representative under AFSL
  | 'relevant_provider'   // Registered on Financial Advisers Register (individual)
  | 'acl'                 // Australian Credit Licence (business)
  | 'credit_rep'          // Credit Representative
  | 'real_estate_licence' // State-based real estate licence
  | 'buyers_agent_licence' // State-based buyer's agent (CPP41419 + state licence)
  | 'qpia'                // Qualified Property Investment Adviser (PIPA accreditation)

/**
 * Credential - professional licence or certification
 */
export interface Credential {
  id: string
  /** Owner: advisor profile or business (at least one set) */
  advisorProfileId?: string
  businessId?: string
  credentialType: CredentialType
  credentialNumber?: string
  nameOnRegister?: string
  issuingBody?: string
  /** Australian state for state-based licences (NULL for federal like AFSL) */
  state?: string
  expiresAt?: Date
  verificationStatus: VerificationStatus
  verificationSource?: 'asic_far' | 'asic_prs' | 'state_register' | 'document_only' | 'manual'
  verifiedAt?: Date
  verifiedByAdminId?: string
  /** File upload ID for evidence */
  evidenceFileId?: string
  /** URL to public register entry */
  registerUrl?: string
}

/**
 * Service offering by an advisor
 */
export interface Service {
  id: string
  name: string
  description?: string
  /** Price text (e.g., "From $220/hr" or "Fee for service") */
  priceText?: string
  /** Duration in minutes */
  durationMinutes?: number
}

/**
 * Availability slots
 */
export interface Availability {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 // Sunday = 0
  startTime: string // HH:MM format
  endTime: string
  isOnline: boolean
  isInPerson: boolean
}

/**
 * Advisor profile - extends user profile with business details
 */
export interface Advisor extends Profile {
  /** Business ID if claimed */
  businessId?: string
  /** Display name for public profile */
  displayName: string
  /** Position/title (e.g., "Senior Financial Planner") */
  positionTitle?: string
  /** Professional bio */
  bio: string
  /** Years of experience */
  yearsExperience?: number
  /** Languages spoken */
  languages: string[]
  /** Service areas (suburbs, postcodes, states) */
  serviceAreas: string[]
  /** Specialties/tags */
  specialties: string[]
  /** AFSL number (if licence holder) */
  afslNumber?: string
  /** Authorised Rep number (if applicable) */
  authorisedRepNumber?: string
  /** ABN */
  abn?: string
  /** Verification level */
  verificationLevel: VerificationLevel
  /** Average rating (1-5) */
  ratingAvg?: number
  /** Total review count */
  reviewCount: number
  /** Services offered */
  services: Service[]
  /** Credentials */
  credentials: Credential[]
  /** Availability */
  availability: Availability[]
  /** Is profile active/visible */
  isActive: boolean
}

/**
 * Claim request for business ownership
 */
export interface ClaimRequest {
  id: string
  userId: string
  businessId: string
  status: 'pending' | 'needs_more_info' | 'approved' | 'denied'
  submittedAt: Date
  reviewedAt?: Date
  reviewedByAdminId?: string
  reviewNotes?: string
  denialReason?: string
}
