import { z } from "zod"

import { AU_STATES } from "@/lib/constants/marketplace-taxonomy"

const auStateSchema = z.enum(AU_STATES)

const advisorTypeSchema = z.enum([
  "financial_adviser",
  "mortgage_broker",
  "buyers_agent",
  "property_adviser",
])

const claimStatusSchema = z.enum(["unclaimed", "pending", "claimed"])
const createdSourceSchema = z.enum(["manual", "import", "scraped"])
const acceptingStatusSchema = z.enum(["taking_clients", "waitlist", "not_accepting"])
const verificationLevelSchema = z.enum(["none", "basic", "licence_verified", "enhanced"])
const meetingModeSchema = z.enum(["online", "in_person", "both"])
const feeModelSchema = z.enum(["hourly", "fixed", "ongoing", "percentage", "unknown"])

const queryBooleanSchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true")

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
})

export const adminBusinessQuerySchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    state: auStateSchema.optional(),
    suburb: z
      .string()
      .trim()
      .max(80)
      .regex(/^[\p{L}\p{N}\s'-]+$/u, "Suburb contains invalid characters")
      .optional(),
    postcode: z.string().regex(/^[0-9]{4}$/).optional(),
    advisor_type: advisorTypeSchema.optional(),
    claimed_status: claimStatusSchema.optional(),
    created_source: createdSourceSchema.optional(),
    has_website: queryBooleanSchema.optional(),
    missing_required: queryBooleanSchema.optional(),
    duplicates_only: queryBooleanSchema.optional(),
    include_deleted: queryBooleanSchema.optional(),
    sort: z
      .enum(["recently_updated", "newest", "name_asc", "highest_duplicate_score"])
      .default("recently_updated"),
  })
  .merge(paginationSchema)

export const adminListingQuerySchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    state: auStateSchema.optional(),
    suburb: z
      .string()
      .trim()
      .max(80)
      .regex(/^[\p{L}\p{N}\s'-]+$/u, "Suburb contains invalid characters")
      .optional(),
    postcode: z.string().regex(/^[0-9]{4}$/).optional(),
    advisor_type: advisorTypeSchema.optional(),
    is_active: queryBooleanSchema.optional(),
    accepting_status: acceptingStatusSchema.optional(),
    verification_level: verificationLevelSchema.optional(),
    service_mode: meetingModeSchema.optional(),
    fee_model: feeModelSchema.optional(),
    include_deleted: queryBooleanSchema.optional(),
    sort: z.enum(["recently_updated", "newest", "name_asc"]).default("recently_updated"),
  })
  .merge(paginationSchema)

const locationInputSchema = z
  .object({
    state: auStateSchema.optional(),
    suburb: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[\p{L}\p{N}\s'-]+$/u, "Suburb contains invalid characters")
      .optional(),
    postcode: z.string().regex(/^[0-9]{4}$/).optional(),
  })
  .refine(
    (value) => {
      const provided = [value.state, value.suburb, value.postcode].filter(Boolean).length
      return provided === 0 || provided === 3
    },
    {
      message: "state, suburb, and postcode must be provided together",
      path: ["state"],
    }
  )

export const adminBusinessCreateSchema = z.object({
  legal_name: z.string().trim().min(2).max(255),
  trading_name: z.string().trim().min(2).max(255).optional(),
  website: z.string().trim().max(255).optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().max(255).optional(),
  location: locationInputSchema.optional(),
  created_source: createdSourceSchema.default("manual").optional(),
  claimed_status: claimStatusSchema.default("unclaimed").optional(),
})

export const adminBusinessPatchSchema = z
  .object({
    legal_name: z.string().trim().min(2).max(255).optional(),
    trading_name: z.string().trim().min(2).max(255).nullable().optional(),
    website: z.string().trim().max(255).nullable().optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    email: z.string().trim().email().max(255).nullable().optional(),
    location: locationInputSchema.nullable().optional(),
    created_source: createdSourceSchema.optional(),
    claimed_status: claimStatusSchema.optional(),
    restore: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  })

export const adminListingCreateSchema = z.object({
  business_id: z.string().uuid(),
  advisor_type: advisorTypeSchema,
  service_mode: meetingModeSchema.default("both").optional(),
  fee_model: feeModelSchema.default("unknown").optional(),
  accepting_status: acceptingStatusSchema.default("taking_clients").optional(),
  is_active: z.boolean().default(true).optional(),
  headline: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(4000).optional(),
})

export const adminListingPatchSchema = z
  .object({
    business_id: z.string().uuid().optional(),
    advisor_type: advisorTypeSchema.optional(),
    service_mode: meetingModeSchema.optional(),
    fee_model: feeModelSchema.nullable().optional(),
    accepting_status: acceptingStatusSchema.optional(),
    verification_level: verificationLevelSchema.optional(),
    is_active: z.boolean().optional(),
    headline: z.string().trim().max(200).nullable().optional(),
    bio: z.string().trim().max(4000).nullable().optional(),
    restore: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  })

export type AdminBusinessQuery = z.infer<typeof adminBusinessQuerySchema>
export type AdminListingQuery = z.infer<typeof adminListingQuerySchema>
export type AdminBusinessCreateInput = z.infer<typeof adminBusinessCreateSchema>
export type AdminBusinessPatchInput = z.infer<typeof adminBusinessPatchSchema>
export type AdminListingCreateInput = z.infer<typeof adminListingCreateSchema>
export type AdminListingPatchInput = z.infer<typeof adminListingPatchSchema>
