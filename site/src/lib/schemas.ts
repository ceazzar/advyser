/**
 * Zod Validation Schemas
 * Form validation schemas for Advyser platform
 */

import { z } from 'zod'

/**
 * Email validation regex (RFC 5322 compliant)
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Australian phone number validation
 * Accepts: 04xx xxx xxx, +61 4xx xxx xxx, (02) xxxx xxxx
 */
const auPhoneRegex = /^(\+?61|0)[2-478](?:[ -]?\d){8}$/

/**
 * Signup form schema
 */
export const signupSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Search filters schema
 */
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  state: z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']).optional(),
  serviceMode: z.enum(['online', 'in_person', 'both']).optional(),
  verificationLevel: z.enum(['none', 'basic', 'licence_verified', 'enhanced']).optional(),
  minRating: z.number().min(1).max(5).optional(),
  availableThisWeek: z.boolean().optional(),
  priceRange: z.enum(['budget', 'mid', 'premium']).optional(),
  languages: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
})

export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>

/**
 * Advisor profile schema
 */
export const advisorProfileSchema = z.object({
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be less than 100 characters'),
  positionTitle: z.string()
    .max(100, 'Position title must be less than 100 characters')
    .optional(),
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(2000, 'Bio must be less than 2000 characters'),
  phone: z.string()
    .regex(auPhoneRegex, 'Please enter a valid Australian phone number')
    .optional()
    .or(z.literal('')),
  yearsExperience: z.number()
    .min(0, 'Years of experience must be 0 or more')
    .max(60, 'Years of experience must be 60 or less')
    .optional(),
  languages: z.array(z.string()).min(1, 'Please select at least one language'),
  serviceAreas: z.array(z.string()).min(1, 'Please add at least one service area'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
  afslNumber: z.string()
    .regex(/^AFSL\s?\d{6}$/, 'AFSL number must be in format "AFSL 123456"')
    .optional()
    .or(z.literal('')),
  authorisedRepNumber: z.string()
    .regex(/^\d{9}$/, 'Authorised Rep number must be 9 digits')
    .optional()
    .or(z.literal('')),
  abn: z.string()
    .regex(/^\d{2}\s?\d{3}\s?\d{3}\s?\d{3}$/, 'ABN must be in format "XX XXX XXX XXX"')
    .optional()
    .or(z.literal('')),
})

export type AdvisorProfileFormData = z.infer<typeof advisorProfileSchema>

/**
 * Claim form schema
 */
export const claimFormSchema = z.object({
  businessName: z.string()
    .min(2, 'Business name is required'),
  afslNumber: z.string()
    .min(1, 'AFSL number is required')
    .regex(/^AFSL\s?\d{6}$/, 'AFSL number must be in format "AFSL 123456"'),
  authorisedRepNumber: z.string()
    .regex(/^\d{9}$/, 'Authorised Rep number must be 9 digits')
    .optional()
    .or(z.literal('')),
  position: z.string()
    .min(2, 'Position/role is required'),
  verificationMethod: z.enum(['email', 'document', 'phone']),
  workEmail: z.string()
    .regex(emailRegex, 'Please enter a valid work email')
    .optional(),
  documentUrl: z.string().url().optional(),
  agreedToTerms: z.boolean()
    .refine(val => val === true, 'You must agree to the verification terms'),
})

export type ClaimFormData = z.infer<typeof claimFormSchema>

/**
 * Booking form schema
 */
export const bookingSchema = z.object({
  advisorId: z.string().min(1, 'Advisor is required'),
  serviceId: z.string().min(1, 'Service is required'),
  date: z.date({ message: 'Please select a date' })
    .refine(date => date > new Date(), 'Date must be in the future'),
  time: z.string()
    .min(1, 'Please select a time')
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  mode: z.enum(['online', 'in_person']),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  phone: z.string()
    .regex(auPhoneRegex, 'Please enter a valid Australian phone number'),
})

export type BookingFormData = z.infer<typeof bookingSchema>

/**
 * Contact/Lead form schema
 */
export const leadSchema = z.object({
  name: z.string()
    .min(2, 'Name is required'),
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  phone: z.string()
    .regex(auPhoneRegex, 'Please enter a valid Australian phone number')
    .optional()
    .or(z.literal('')),
  goalSummary: z.string()
    .min(20, 'Please describe your goals in at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  budgetRange: z.enum(['under-50k', '50k-250k', '250k-1m', 'over-1m']).optional(),
  timeline: z.enum(['urgent', '1-3-months', '3-6-months', 'flexible']).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'either']),
  preferredTimes: z.string()
    .max(200, 'Preferred times must be less than 200 characters')
    .optional(),
  consentPrivacy: z.boolean()
    .refine(val => val === true, 'You must consent to our privacy policy'),
})

export type LeadFormData = z.infer<typeof leadSchema>

// ============================================================================
// API MUTATION SCHEMAS (Week 0: Backend APIs)
// ============================================================================

/**
 * Create lead schema - API mutation with APPs consent
 */
export const createLeadApiSchema = z.object({
  listing_id: z.string().uuid('Invalid listing ID'),
  problem_summary: z.string()
    .min(20, 'Please describe your situation in at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  goal_tags: z.array(z.string().max(50)).max(5).optional(),
  timeline: z.enum(['asap', 'next_month', 'next_3_months', 'exploring']).optional(),
  budget_range: z.string().max(50).optional(),
  preferred_meeting_mode: z.enum(['online', 'in_person', 'both']).optional(),
  preferred_times: z.string().max(500).optional(),
  idempotency_key: z.string().uuid().optional(),
  // APPs compliance - consent fields
  consent: z.object({
    shareContactInfo: z.boolean().refine(val => val === true, 'You must consent to share your contact information'),
    shareToOtherAdvisors: z.boolean().default(false),
    retentionAcknowledged: z.boolean().refine(val => val === true, 'You must acknowledge the data retention policy'),
    marketingOptIn: z.boolean().default(false),
    consentVersion: z.string().default('1.0'),
  }),
})

export type CreateLeadApiData = z.infer<typeof createLeadApiSchema>

/**
 * Update lead status schema
 */
export const updateLeadStatusSchema = z.object({
  status: z.enum(['contacted', 'booked', 'converted', 'declined']),
  version: z.number().int().positive().optional(), // For optimistic locking
  decline_reason: z.string().max(500).optional(),
})

export type UpdateLeadStatusData = z.infer<typeof updateLeadStatusSchema>

/**
 * Create message schema
 */
export const createMessageSchema = z.object({
  conversation_id: z.string().uuid('Invalid conversation ID'),
  body: z.string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message must be less than 5000 characters'),
  idempotency_key: z.string().uuid().optional(),
})

export type CreateMessageData = z.infer<typeof createMessageSchema>

/**
 * Create booking schema - API mutation
 */
export const createBookingApiSchema = z.object({
  lead_id: z.string().uuid().optional(),
  client_record_id: z.string().uuid().optional(),
  starts_at: z.string().datetime('Invalid start time'),
  ends_at: z.string().datetime('Invalid end time'),
  timezone: z.string().default('Australia/Sydney'),
  mode: z.enum(['online', 'in_person']),
  location_text: z.string().max(200).optional(),
  meeting_link: z.string().url().optional(),
  advisor_notes: z.string().max(1000).optional(),
}).refine(
  data => data.lead_id || data.client_record_id,
  'Either lead_id or client_record_id is required'
).refine(
  data => new Date(data.ends_at) > new Date(data.starts_at),
  'End time must be after start time'
)

export type CreateBookingApiData = z.infer<typeof createBookingApiSchema>

/**
 * Update booking schema
 */
export const updateBookingSchema = z.object({
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
  mode: z.enum(['online', 'in_person']).optional(),
  location_text: z.string().max(200).optional(),
  meeting_link: z.string().url().optional(),
  status: z.enum(['proposed', 'confirmed', 'cancelled', 'completed']).optional(),
  advisor_notes: z.string().max(1000).optional(),
})

export type UpdateBookingData = z.infer<typeof updateBookingSchema>

/**
 * Pagination params schema (reusable)
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
})

export type PaginationParams = z.infer<typeof paginationSchema>

/**
 * UUID param schema (reusable)
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export type UuidParam = z.infer<typeof uuidParamSchema>

/**
 * Public listings query schema
 */
export const listingsQuerySchema = z.object({
  advisor_type: z.string().optional(),
  specialty: z.string().optional(),
  state: z.string().regex(/^[A-Z]{2,3}$/).optional(),
  postcode: z.string().regex(/^[0-9]{4}$/).optional(),
  verified: z.enum(["true", "false"]).optional(),
  accepting: z.enum(["taking_clients", "waitlist", "not_taking"]).optional(),
  service_mode: z.enum(["online", "in_person", "both"]).optional(),
  min_rating: z.coerce.number().min(1).max(5).optional(),
  fee_model: z.string().optional(),
  q: z
    .string()
    .trim()
    .max(120)
    .transform((value) => value.replace(/[,.()]/g, " ").replace(/\s+/g, " ").trim())
    .optional(),
  sort: z.enum(["rating_desc", "reviews_desc", "newest"]).default("rating_desc"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
})

export type ListingsQuery = z.infer<typeof listingsQuerySchema>

/**
 * Public lead request payload schema
 */
export const publicLeadRequestSchema = z.object({
  listingId: z.string().uuid("Listing ID must be a valid UUID"),
  problemSummary: z
    .string()
    .trim()
    .min(20, "Please describe your request in at least 20 characters")
    .max(2000, "Problem summary is too long"),
  goalTags: z.array(z.string().trim().min(1).max(50)).max(8).optional(),
  timeline: z.enum(["asap", "next_month", "next_3_months", "exploring"]).optional(),
  budgetRange: z.string().trim().max(50).optional(),
  preferredMeetingMode: z.enum(["online", "in_person", "both"]).optional(),
  preferredTimes: z.string().trim().max(500).optional(),
  idempotencyKey: z.string().uuid().optional(),
  firstName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().max(100).optional(),
  email: z.string().trim().regex(emailRegex, "A valid email is required"),
  phone: z
    .string()
    .trim()
    .regex(auPhoneRegex, "Please enter a valid Australian phone number")
    .optional()
    .or(z.literal("")),
  privacyConsent: z.boolean().refine((value) => value, "Privacy consent is required"),
  captchaToken: z.string().trim().min(20).optional(),
})

export type PublicLeadRequestData = z.infer<typeof publicLeadRequestSchema>
