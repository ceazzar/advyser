/**
 * Advisor Types
 * Australian financial advisor types with AFSL/ASIC compliance fields
 */

import type { User, Profile } from './user'

/**
 * Verification status for credentials
 */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

/**
 * Verification level for advisors
 */
export type VerificationLevel = 'basic' | 'verified' | 'premium'

/**
 * Credential types for Australian financial services
 */
export type CredentialType =
  | 'afsl'           // Australian Financial Services Licence
  | 'authorised_rep' // Authorised Representative
  | 'credit_licence' // Credit Licence
  | 'real_estate'    // Real Estate Licence
  | 'tax_agent'      // Registered Tax Agent
  | 'cpa'            // CPA Australia
  | 'ca'             // Chartered Accountant
  | 'cfp'            // Certified Financial Planner

/**
 * Credential - professional licence or certification
 */
export interface Credential {
  id: string
  advisorProfileId: string
  credentialType: CredentialType
  credentialNumber: string
  issuingBody: string
  /** Australian state if applicable */
  state?: string
  expiresAt?: Date
  verificationStatus: VerificationStatus
  verifiedAt?: Date
  verifiedByAdminId?: string
  /** URL to evidence document */
  evidenceFileUrl?: string
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
  status: 'pending' | 'approved' | 'denied'
  submittedAt: Date
  reviewedAt?: Date
  reviewedByAdminId?: string
  notesInternal?: string
}
