import { createClient } from "@supabase/supabase-js"
import { dirname, resolve } from "path"
import pg from "pg"
import { fileURLToPath } from "url"

import {
  getDefaultEnvFiles,
  getMissingKeys,
  loadEnvFiles,
  parseModeArg,
} from "./env-utils.mjs"

const { Client } = pg

const scriptDir = dirname(fileURLToPath(import.meta.url))
const siteDir = resolve(scriptDir, "..")
const mode = parseModeArg(process.argv.slice(2), process.env.APP_ENV || "local")

loadEnvFiles(siteDir, getDefaultEnvFiles(mode))

const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
const requiredKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  ...(dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]),
]
const missingKeys = getMissingKeys(requiredKeys)
if (missingKeys.length > 0) {
  console.error(`Cannot seed demo users; missing keys: ${missingKeys.join(", ")}`)
  process.exit(1)
}

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
)

const DEMO_USERS = [
  {
    email: "consumer@user.com",
    password: "consumer123",
    role: "consumer",
    firstName: "Demo",
    lastName: "Consumer",
    displayName: "Demo Consumer",
  },
  {
    email: "advisor@user.com",
    password: "advisor123",
    role: "advisor",
    firstName: "Sarah",
    lastName: "Mitchell",
    displayName: "Sarah Mitchell",
  },
  {
    email: "advisor2@user.com",
    password: "advisor123",
    role: "advisor",
    firstName: "Liam",
    lastName: "Chen",
    displayName: "Liam Chen",
  },
  {
    email: "advisor3@user.com",
    password: "advisor123",
    role: "advisor",
    firstName: "Priya",
    lastName: "Nair",
    displayName: "Priya Nair",
  },
  {
    email: "admin@user.com",
    password: "admin123",
    role: "admin",
    firstName: "Demo",
    lastName: "Admin",
    displayName: "Demo Admin",
  },
]

const IDS = {
  location: "5ed25f19-cf35-4439-9026-f67e2f4ca5b4",
  business: "8af6e6ad-1f95-4639-93c9-c215d17995df",
  advisorBusinessRole: "4f53f8d8-bd81-4dd7-a29f-95f12304f11a",
  advisorProfile: "d2f415ba-ec87-4ea7-a639-8e1301c9d80d",
  listing: "520e1e3d-e7d6-4224-b9a2-3bc6fc7d92af",
  specialty: "95d5ddf0-bf85-4e8b-bac8-a74f84f16065",
  serviceOffering: "a5ea16dd-bf09-4a89-9015-8dc487c2ca08",
  availabilityWeekday: "e19d88ea-6a1f-47ec-a8d8-c9af3347f3ce",
  availabilitySaturday: "dd23606d-0a2e-4436-a3a6-38f07d830ee7",
  lead: "d8f94de7-0807-4fca-9f89-62772a29d8db",
  leadFinancial: "5e4483f1-feb9-44ea-bff9-6bb8e5e70dfb",
  leadProperty: "ecf39ef8-b8be-4e8f-ab9d-ae8d4474bb04",
  clientRecord: "6d44aa0d-eb22-4f24-baba-034abf940d10",
  conversation: "130205f2-4d50-46e6-9f7b-c7412e13ea37",
  messageConsumer: "9a4f16c8-78f7-4d1a-8c0e-bf4c3f6ef6f4",
  messageAdvisor: "5c71f740-f1fb-45eb-bd8f-a84005b5ec45",
  booking: "2f4efd55-3ab8-40b2-ae1f-c2f6f56fce8f",
  bookingFinancial: "fd988f36-5117-4e2b-a8f7-b6e108f0a5d0",
  bookingProperty: "3197f3d9-6003-481f-ad47-cf4538f4d6d7",
  review: "d8b93130-6d6a-4214-bf06-b2de20215e71",
  trustDisclosurePromotion: "5b2001db-f63e-4efb-b284-04d7655d7ef8",
  trustDisclosureVerification: "f1239ce3-70f0-4c67-a5df-203ce84fe2e7",
  trustDisclosureFinancialVerification: "fc20f571-a3c2-49f7-b798-cf155fb6f842",
  trustDisclosurePropertyVerification: "78453f68-a683-4e36-95be-9cfdbf5268f8",
  trustConsent: "1748f8f1-b5a5-4325-87ec-c66958faf97d",
  reviewReply: "7597cda7-6cd8-4b15-8e10-5bba6fcad0ff",
  locationSydney: "b9af2e7e-76cf-4a1f-aa7c-cc55875567d2",
  locationBrisbane: "5fd5b7d3-6f36-4e87-a6c1-9e9f066f9b50",
  businessFinancial: "d487f5e4-b353-4294-90db-b6827f6d4f3e",
  businessProperty: "52b10e54-359e-46b8-84c1-6eff8bca0bc5",
  advisorBusinessRoleFinancial: "9a46e92e-8b95-4b6b-97f7-f8de5bdb7e0f",
  advisorBusinessRoleProperty: "e31fe45f-9f05-4fa9-9bf2-285c900fed22",
  advisorProfileFinancial: "f65e1a2f-f103-44c8-bd34-d44545d6f95e",
  advisorProfileProperty: "f33ce7c9-1972-4cca-a34f-64fae9d5e8df",
  listingFinancial: "7377f779-1d3f-4da9-9f7f-dca6fb675aba",
  listingProperty: "f17126d0-7d2a-4705-8b5b-e97f5af10156",
  specialtyRetirement: "4cf96fd6-c0ce-42cb-9b87-a52f859f4f4a",
  specialtyProperty: "f55fcd6b-a685-49ce-8a88-38b12c434ea8",
}

function futureIso(daysFromNow, hourUtc) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + daysFromNow)
  date.setUTCHours(hourUtc, 0, 0, 0)
  return date.toISOString()
}

function toPgClientConnectionString(rawUrl) {
  const parsed = new URL(rawUrl)
  parsed.searchParams.delete("sslmode")
  parsed.searchParams.set("sslmode", "require")
  parsed.searchParams.set("uselibpqcompat", "true")
  return parsed.toString()
}

async function getOrCreateAuthUser(user) {
  const listExistingUsers = async () => {
    // Existing projects may have >50 users; scan pages to reliably resolve ID.
    for (let page = 1; page <= 20; page += 1) {
      const listResult = await admin.auth.admin.listUsers({
        page,
        perPage: 200,
      })
      const users = listResult.data?.users || []
      const existing = users.find((candidate) => candidate.email === user.email)
      if (existing) {
        return existing.id
      }
      if (users.length < 200) break
    }
    return null
  }

  const lookupPublicUserId = async () => {
    const { data } = await admin
      .from("users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle()
    return data?.id || null
  }

  const existingAuthUserId = await listExistingUsers()
  if (existingAuthUserId) {
    return existingAuthUserId
  }

  const baseCreatePayload = {
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
      display_name: user.displayName,
    },
  }

  const publicUserId = await lookupPublicUserId()
  const createResult = await admin.auth.admin.createUser(
    publicUserId
      ? {
          ...baseCreatePayload,
          id: publicUserId,
        }
      : baseCreatePayload
  )

  if (!createResult.error && createResult.data.user) {
    return createResult.data.user.id
  }

  // If the first create failed and we discovered a conflicting public.users row
  // after the attempt, retry creation with that exact UUID.
  if (!publicUserId) {
    const retryPublicUserId = await lookupPublicUserId()
    if (retryPublicUserId) {
      const retryResult = await admin.auth.admin.createUser({
        ...baseCreatePayload,
        id: retryPublicUserId,
      })
      if (!retryResult.error && retryResult.data.user) {
        return retryResult.data.user.id
      }
    }
  }

  const resolvedAuthUserId = await listExistingUsers()
  if (resolvedAuthUserId) {
    return resolvedAuthUserId
  }

  throw new Error(
    `Failed to create or find auth user for ${user.email}: ${createResult.error?.message || "unknown error"}`
  )
}

async function seedSqlData(userIds) {
  const consumerUserId = userIds["consumer@user.com"]
  const advisorUserId = userIds["advisor@user.com"]
  const advisorTwoUserId = userIds["advisor2@user.com"]
  const advisorThreeUserId = userIds["advisor3@user.com"]
  const adminUserId = userIds["admin@user.com"]

  const client = new Client({
    connectionString: toPgClientConnectionString(dbUrl),
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()

  try {
    await client.query("BEGIN")

    for (const user of DEMO_USERS) {
      const userId = userIds[user.email]
      await client.query(
        `
        INSERT INTO public.users (
          id, email, role, first_name, last_name, display_name, email_verified_at
        )
        VALUES ($1, $2, $3::user_role, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          role = EXCLUDED.role,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          display_name = EXCLUDED.display_name,
          email_verified_at = EXCLUDED.email_verified_at
      `,
        [userId, user.email, user.role, user.firstName, user.lastName, user.displayName]
      )
    }

    await client.query(
      `
      INSERT INTO public.location (
        id, country, state, suburb, postcode, lat, lng, sa2_name
      )
      VALUES ($1, 'AU', 'VIC', 'Melbourne', '3000', -37.8136, 144.9631, 'Melbourne')
      ON CONFLICT (state, suburb, postcode) DO UPDATE SET
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng,
        sa2_name = EXCLUDED.sa2_name
    `,
      [IDS.location]
    )

    await client.query(
      `
      INSERT INTO public.location (
        id, country, state, suburb, postcode, lat, lng, sa2_name
      )
      VALUES ($1, 'AU', 'NSW', 'Sydney', '2000', -33.8688, 151.2093, 'Sydney - Haymarket - The Rocks')
      ON CONFLICT (state, suburb, postcode) DO UPDATE SET
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng,
        sa2_name = EXCLUDED.sa2_name
    `,
      [IDS.locationSydney]
    )

    await client.query(
      `
      INSERT INTO public.location (
        id, country, state, suburb, postcode, lat, lng, sa2_name
      )
      VALUES ($1, 'AU', 'QLD', 'Brisbane', '4000', -27.4698, 153.0251, 'Brisbane City')
      ON CONFLICT (state, suburb, postcode) DO UPDATE SET
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng,
        sa2_name = EXCLUDED.sa2_name
    `,
      [IDS.locationBrisbane]
    )

    await client.query(
      `
      INSERT INTO public.business (
        id, legal_name, trading_name, abn, practice_type, website, phone, email,
        primary_location_id, address_line_1, claimed_status, claimed_by_user_id,
        claimed_at, created_source
      )
      VALUES (
        $1, 'Mitchell Advisory Pty Ltd', 'Mitchell Advisory', '67123456789',
        'boutique', 'https://mitchelladvisory.example.com', '+61390000000',
        'hello@mitchelladvisory.example.com', $2, '120 Collins Street',
        'claimed', $3, NOW(), 'manual'
      )
      ON CONFLICT (id) DO UPDATE SET
        trading_name = EXCLUDED.trading_name,
        website = EXCLUDED.website,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        primary_location_id = EXCLUDED.primary_location_id,
        claimed_status = EXCLUDED.claimed_status,
        claimed_by_user_id = EXCLUDED.claimed_by_user_id,
        claimed_at = EXCLUDED.claimed_at
    `,
      [IDS.business, IDS.location, advisorUserId]
    )

    await client.query(
      `
      INSERT INTO public.business (
        id, legal_name, trading_name, abn, practice_type, website, phone, email,
        primary_location_id, address_line_1, claimed_status, claimed_by_user_id,
        claimed_at, created_source
      )
      VALUES (
        $1, 'Harbour Financial Planning Pty Ltd', 'Harbour Financial Planning', '77123456780',
        'independent', 'https://harbourfinancial.example.com', '+61280000010',
        'hello@harbourfinancial.example.com', $2, '80 Pitt Street',
        'claimed', $3, NOW(), 'manual'
      )
      ON CONFLICT (id) DO UPDATE SET
        trading_name = EXCLUDED.trading_name,
        website = EXCLUDED.website,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        primary_location_id = EXCLUDED.primary_location_id,
        claimed_status = EXCLUDED.claimed_status,
        claimed_by_user_id = EXCLUDED.claimed_by_user_id,
        claimed_at = EXCLUDED.claimed_at
    `,
      [IDS.businessFinancial, IDS.locationSydney, advisorTwoUserId]
    )

    await client.query(
      `
      INSERT INTO public.business (
        id, legal_name, trading_name, abn, practice_type, website, phone, email,
        primary_location_id, address_line_1, claimed_status, claimed_by_user_id,
        claimed_at, created_source
      )
      VALUES (
        $1, 'Northstar Buyers Agency Pty Ltd', 'Northstar Buyers Agency', '88123456781',
        'boutique', 'https://northstarbuyers.example.com', '+61731000020',
        'contact@northstarbuyers.example.com', $2, '200 Adelaide Street',
        'claimed', $3, NOW(), 'manual'
      )
      ON CONFLICT (id) DO UPDATE SET
        trading_name = EXCLUDED.trading_name,
        website = EXCLUDED.website,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        primary_location_id = EXCLUDED.primary_location_id,
        claimed_status = EXCLUDED.claimed_status,
        claimed_by_user_id = EXCLUDED.claimed_by_user_id,
        claimed_at = EXCLUDED.claimed_at
    `,
      [IDS.businessProperty, IDS.locationBrisbane, advisorThreeUserId]
    )

    await client.query(
      `
      INSERT INTO public.advisor_profile (
        id, user_id, business_id, display_name, position_title, bio, linkedin_url, years_experience, languages
      )
      VALUES (
        $1, $2, $3, 'Sarah Mitchell', 'Senior Mortgage Broker',
        'Specialises in first-home buyers and refinance strategy for Melbourne families.',
        'https://linkedin.com/in/sarah-mitchell-broker', 11, ARRAY['en']::text[]
      )
      ON CONFLICT (id) DO UPDATE SET
        business_id = EXCLUDED.business_id,
        display_name = EXCLUDED.display_name,
        position_title = EXCLUDED.position_title,
        bio = EXCLUDED.bio,
        linkedin_url = EXCLUDED.linkedin_url,
        years_experience = EXCLUDED.years_experience,
        languages = EXCLUDED.languages
    `,
      [IDS.advisorProfile, advisorUserId, IDS.business]
    )

    await client.query(
      `
      INSERT INTO public.advisor_profile (
        id, user_id, business_id, display_name, position_title, bio, linkedin_url, years_experience, languages
      )
      VALUES (
        $1, $2, $3, 'Liam Chen', 'Financial Adviser',
        'Helps professionals optimize long-term wealth, retirement strategy, and portfolio construction.',
        'https://linkedin.com/in/liam-chen-adviser', 9, ARRAY['en', 'zh']::text[]
      )
      ON CONFLICT (id) DO UPDATE SET
        business_id = EXCLUDED.business_id,
        display_name = EXCLUDED.display_name,
        position_title = EXCLUDED.position_title,
        bio = EXCLUDED.bio,
        linkedin_url = EXCLUDED.linkedin_url,
        years_experience = EXCLUDED.years_experience,
        languages = EXCLUDED.languages
    `,
      [IDS.advisorProfileFinancial, advisorTwoUserId, IDS.businessFinancial]
    )

    await client.query(
      `
      INSERT INTO public.advisor_profile (
        id, user_id, business_id, display_name, position_title, bio, linkedin_url, years_experience, languages
      )
      VALUES (
        $1, $2, $3, 'Priya Nair', 'Buyers Agent',
        'Represents owner-occupiers and investors with suburb selection and negotiation support.',
        'https://linkedin.com/in/priya-nair-buyers-agent', 7, ARRAY['en', 'hi']::text[]
      )
      ON CONFLICT (id) DO UPDATE SET
        business_id = EXCLUDED.business_id,
        display_name = EXCLUDED.display_name,
        position_title = EXCLUDED.position_title,
        bio = EXCLUDED.bio,
        linkedin_url = EXCLUDED.linkedin_url,
        years_experience = EXCLUDED.years_experience,
        languages = EXCLUDED.languages
    `,
      [IDS.advisorProfileProperty, advisorThreeUserId, IDS.businessProperty]
    )

    await client.query(
      `
      INSERT INTO public.advisor_business_role (
        id, user_id, business_id, role, status, invited_at, accepted_at
      )
      VALUES ($1, $2, $3, 'owner', 'active', NOW(), NOW())
      ON CONFLICT (user_id, business_id) DO UPDATE SET
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        invited_at = EXCLUDED.invited_at,
        accepted_at = EXCLUDED.accepted_at
    `,
      [IDS.advisorBusinessRole, advisorUserId, IDS.business]
    )

    await client.query(
      `
      INSERT INTO public.advisor_business_role (
        id, user_id, business_id, role, status, invited_at, accepted_at
      )
      VALUES ($1, $2, $3, 'owner', 'active', NOW(), NOW())
      ON CONFLICT (user_id, business_id) DO UPDATE SET
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        invited_at = EXCLUDED.invited_at,
        accepted_at = EXCLUDED.accepted_at
    `,
      [IDS.advisorBusinessRoleFinancial, advisorTwoUserId, IDS.businessFinancial]
    )

    await client.query(
      `
      INSERT INTO public.advisor_business_role (
        id, user_id, business_id, role, status, invited_at, accepted_at
      )
      VALUES ($1, $2, $3, 'owner', 'active', NOW(), NOW())
      ON CONFLICT (user_id, business_id) DO UPDATE SET
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        invited_at = EXCLUDED.invited_at,
        accepted_at = EXCLUDED.accepted_at
    `,
      [IDS.advisorBusinessRoleProperty, advisorThreeUserId, IDS.businessProperty]
    )

    const specialtyResult = await client.query(
      `
      INSERT INTO public.specialty (
        id, name, slug, advisor_type, description, display_order, is_active
      )
      VALUES (
        $1, 'First Home Buyers', 'first-home-buyers', 'mortgage_broker',
        'Loan structuring support for first-home purchases.', 10, true
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        advisor_type = EXCLUDED.advisor_type,
        is_active = EXCLUDED.is_active
      RETURNING id
    `,
      [IDS.specialty]
    )
    const specialtyId = specialtyResult.rows[0].id

    const retirementSpecialtyResult = await client.query(
      `
      INSERT INTO public.specialty (
        id, name, slug, advisor_type, description, display_order, is_active
      )
      VALUES (
        $1, 'Retirement Planning', 'retirement-planning', 'financial_adviser',
        'Income planning, drawdown sequencing, and retirement readiness.', 20, true
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        advisor_type = EXCLUDED.advisor_type,
        is_active = EXCLUDED.is_active
      RETURNING id
    `,
      [IDS.specialtyRetirement]
    )
    const retirementSpecialtyId = retirementSpecialtyResult.rows[0].id

    const propertySpecialtyResult = await client.query(
      `
      INSERT INTO public.specialty (
        id, name, slug, advisor_type, description, display_order, is_active
      )
      VALUES (
        $1, 'Property Acquisition', 'property-acquisition', 'buyers_agent',
        'End-to-end buyer advocacy, due diligence, and negotiation support.', 30, true
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        advisor_type = EXCLUDED.advisor_type,
        is_active = EXCLUDED.is_active
      RETURNING id
    `,
      [IDS.specialtyProperty]
    )
    const propertySpecialtyId = propertySpecialtyResult.rows[0].id

    const serviceOfferingResult = await client.query(
      `
      INSERT INTO public.service_offering (
        id, name, slug, advisor_type, description, display_order, is_active
      )
      VALUES (
        $1, 'Home Loan Strategy Session', 'home-loan-strategy-session', 'mortgage_broker',
        '60-minute strategy session covering borrowing capacity and lender fit.', 10, true
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        advisor_type = EXCLUDED.advisor_type,
        is_active = EXCLUDED.is_active
      RETURNING id
    `,
      [IDS.serviceOffering]
    )
    const serviceOfferingId = serviceOfferingResult.rows[0].id

    await client.query(
      `
      INSERT INTO public.listing (
        id, business_id, advisor_profile_id, headline, bio, what_i_help_with,
        who_i_dont_work_with, approach_to_advice, advisor_type, service_mode,
        fee_model, price_band, free_consultation, client_demographics, is_active,
        accepting_status, availability_mode, time_to_first_slot_days, verification_level,
        profile_completeness_score, response_time_hours, response_rate, rating_avg, review_count,
        search_boost, is_featured
      )
      VALUES (
        $1, $2, $3, 'Mortgage strategy for first-home buyers and refinancers',
        'Independent mortgage guidance with clear lender comparisons and execution support.',
        'Borrowing strategy, lender selection, and application packaging.',
        'Clients seeking property speculation-only recommendations.',
        'Scenario-based option framing with transparent trade-offs.',
        'mortgage_broker', 'both', 'fixed', '$$', true,
        ARRAY['first-home-buyers', 'refinancers']::text[],
        true, 'taking_clients', 'manual', 2, 'none',
        92, 1.3, 96, 4.8, 1, 1, false
      )
      ON CONFLICT (id) DO UPDATE SET
        business_id = EXCLUDED.business_id,
        advisor_profile_id = EXCLUDED.advisor_profile_id,
        advisor_type = EXCLUDED.advisor_type,
        service_mode = EXCLUDED.service_mode,
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        what_i_help_with = EXCLUDED.what_i_help_with,
        who_i_dont_work_with = EXCLUDED.who_i_dont_work_with,
        approach_to_advice = EXCLUDED.approach_to_advice,
        fee_model = EXCLUDED.fee_model,
        price_band = EXCLUDED.price_band,
        free_consultation = EXCLUDED.free_consultation,
        client_demographics = EXCLUDED.client_demographics,
        is_active = EXCLUDED.is_active,
        accepting_status = EXCLUDED.accepting_status,
        availability_mode = EXCLUDED.availability_mode,
        time_to_first_slot_days = EXCLUDED.time_to_first_slot_days,
        verification_level = EXCLUDED.verification_level,
        profile_completeness_score = EXCLUDED.profile_completeness_score,
        response_time_hours = EXCLUDED.response_time_hours,
        response_rate = EXCLUDED.response_rate,
        rating_avg = EXCLUDED.rating_avg,
        review_count = EXCLUDED.review_count,
        search_boost = EXCLUDED.search_boost,
        is_featured = EXCLUDED.is_featured,
        deleted_at = NULL
    `,
      [IDS.listing, IDS.business, IDS.advisorProfile]
    )

    await client.query(
      `
      INSERT INTO public.listing (
        id, business_id, advisor_profile_id, headline, bio, what_i_help_with,
        who_i_dont_work_with, approach_to_advice, advisor_type, service_mode,
        fee_model, price_band, free_consultation, client_demographics, is_active,
        accepting_status, availability_mode, time_to_first_slot_days, verification_level,
        profile_completeness_score, response_time_hours, response_rate, rating_avg, review_count,
        search_boost, is_featured
      )
      VALUES (
        $1, $2, $3, 'Retirement and long-term wealth strategy for busy professionals',
        'Evidence-led financial planning with implementation support and annual reviews.',
        'Retirement income design, portfolio allocation, and super strategy.',
        'Short-term trading advice or high-frequency portfolio changes.',
        'Goal-based planning with staged implementation milestones.',
        'financial_adviser', 'online', 'ongoing', '$$$', false,
        ARRAY['professionals', 'pre-retirees']::text[],
        true, 'waitlist', 'manual', 10, 'none',
        84, 6.0, 74, 4.6, 8, 1, false
      )
      ON CONFLICT (id) DO UPDATE SET
        business_id = EXCLUDED.business_id,
        advisor_profile_id = EXCLUDED.advisor_profile_id,
        advisor_type = EXCLUDED.advisor_type,
        service_mode = EXCLUDED.service_mode,
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        what_i_help_with = EXCLUDED.what_i_help_with,
        who_i_dont_work_with = EXCLUDED.who_i_dont_work_with,
        approach_to_advice = EXCLUDED.approach_to_advice,
        fee_model = EXCLUDED.fee_model,
        price_band = EXCLUDED.price_band,
        free_consultation = EXCLUDED.free_consultation,
        client_demographics = EXCLUDED.client_demographics,
        is_active = EXCLUDED.is_active,
        accepting_status = EXCLUDED.accepting_status,
        availability_mode = EXCLUDED.availability_mode,
        time_to_first_slot_days = EXCLUDED.time_to_first_slot_days,
        verification_level = EXCLUDED.verification_level,
        profile_completeness_score = EXCLUDED.profile_completeness_score,
        response_time_hours = EXCLUDED.response_time_hours,
        response_rate = EXCLUDED.response_rate,
        rating_avg = EXCLUDED.rating_avg,
        review_count = EXCLUDED.review_count,
        search_boost = EXCLUDED.search_boost,
        is_featured = EXCLUDED.is_featured,
        deleted_at = NULL
    `,
      [IDS.listingFinancial, IDS.businessFinancial, IDS.advisorProfileFinancial]
    )

    await client.query(
      `
      INSERT INTO public.listing (
        id, business_id, advisor_profile_id, headline, bio, what_i_help_with,
        who_i_dont_work_with, approach_to_advice, advisor_type, service_mode,
        fee_model, price_band, free_consultation, client_demographics, is_active,
        accepting_status, availability_mode, time_to_first_slot_days, verification_level,
        profile_completeness_score, response_time_hours, response_rate, rating_avg, review_count,
        search_boost, is_featured
      )
      VALUES (
        $1, $2, $3, 'Buyer advocacy for Brisbane owner-occupiers and investors',
        'Independent buyers agent support from suburb strategy through negotiation and settlement.',
        'Suburb targeting, due diligence, and purchase negotiation support.',
        'Off-the-plan speculation without cashflow analysis.',
        'Data-first suburb shortlisting with clear decision criteria.',
        'buyers_agent', 'both', 'fixed', '$$', true,
        ARRAY['first-home-buyers', 'investors']::text[],
        true, 'not_accepting', 'manual', 21, 'none',
        88, 12.0, 52, 4.5, 5, 1, false
      )
      ON CONFLICT (id) DO UPDATE SET
        business_id = EXCLUDED.business_id,
        advisor_profile_id = EXCLUDED.advisor_profile_id,
        advisor_type = EXCLUDED.advisor_type,
        service_mode = EXCLUDED.service_mode,
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        what_i_help_with = EXCLUDED.what_i_help_with,
        who_i_dont_work_with = EXCLUDED.who_i_dont_work_with,
        approach_to_advice = EXCLUDED.approach_to_advice,
        fee_model = EXCLUDED.fee_model,
        price_band = EXCLUDED.price_band,
        free_consultation = EXCLUDED.free_consultation,
        client_demographics = EXCLUDED.client_demographics,
        is_active = EXCLUDED.is_active,
        accepting_status = EXCLUDED.accepting_status,
        availability_mode = EXCLUDED.availability_mode,
        time_to_first_slot_days = EXCLUDED.time_to_first_slot_days,
        verification_level = EXCLUDED.verification_level,
        profile_completeness_score = EXCLUDED.profile_completeness_score,
        response_time_hours = EXCLUDED.response_time_hours,
        response_rate = EXCLUDED.response_rate,
        rating_avg = EXCLUDED.rating_avg,
        review_count = EXCLUDED.review_count,
        search_boost = EXCLUDED.search_boost,
        is_featured = EXCLUDED.is_featured,
        deleted_at = NULL
    `,
      [IDS.listingProperty, IDS.businessProperty, IDS.advisorProfileProperty]
    )

    await client.query(
      `
      INSERT INTO public.listing_specialty (listing_id, specialty_id)
      VALUES ($1, $2)
      ON CONFLICT (listing_id, specialty_id) DO NOTHING
    `,
      [IDS.listing, specialtyId]
    )

    await client.query(
      `
      INSERT INTO public.listing_specialty (listing_id, specialty_id)
      VALUES ($1, $2)
      ON CONFLICT (listing_id, specialty_id) DO NOTHING
    `,
      [IDS.listingFinancial, retirementSpecialtyId]
    )

    await client.query(
      `
      INSERT INTO public.listing_specialty (listing_id, specialty_id)
      VALUES ($1, $2)
      ON CONFLICT (listing_id, specialty_id) DO NOTHING
    `,
      [IDS.listingProperty, propertySpecialtyId]
    )

    await client.query(
      `
      INSERT INTO public.listing_service_offering (
        listing_id, service_offering_id, price_text, duration_minutes, description
      )
      VALUES ($1, $2, 'From $290', 60, 'Initial strategy and lender options review.')
      ON CONFLICT (listing_id, service_offering_id) DO UPDATE SET
        price_text = EXCLUDED.price_text,
        duration_minutes = EXCLUDED.duration_minutes,
        description = EXCLUDED.description
    `,
      [IDS.listing, serviceOfferingId]
    )

    await client.query(
      `
      INSERT INTO public.advisor_availability (id, listing_id, day_of_week, start_time, end_time, mode, is_active)
      VALUES ($1, $2, 1, '09:00:00', '17:00:00', 'both', true)
      ON CONFLICT (id) DO UPDATE SET
        day_of_week = EXCLUDED.day_of_week,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        mode = EXCLUDED.mode,
        is_active = EXCLUDED.is_active
    `,
      [IDS.availabilityWeekday, IDS.listing]
    )

    await client.query(
      `
      INSERT INTO public.advisor_availability (id, listing_id, day_of_week, start_time, end_time, mode, is_active)
      VALUES ($1, $2, 6, '10:00:00', '13:00:00', 'online', true)
      ON CONFLICT (id) DO UPDATE SET
        day_of_week = EXCLUDED.day_of_week,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        mode = EXCLUDED.mode,
        is_active = EXCLUDED.is_active
    `,
      [IDS.availabilitySaturday, IDS.listing]
    )

    await client.query(
      `
      INSERT INTO public.lead (
        id, consumer_user_id, business_id, listing_id, assigned_to_user_id, assigned_at,
        problem_summary, goal_tags, timeline, budget_range, preferred_meeting_mode,
        preferred_times, status, status_changed_at, first_response_at, response_time_minutes
      )
      VALUES (
        $1, $2, $3, $4, $5, NOW(),
        'Need help buying first home in Melbourne and comparing fixed vs variable rates.',
        ARRAY['first-home-buyer', 'loan-comparison']::text[], 'Within 3 months', '900k-1.1m',
        'online', 'Weeknights after 6pm', 'contacted', NOW(), NOW(), 42
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        assigned_to_user_id = EXCLUDED.assigned_to_user_id,
        assigned_at = EXCLUDED.assigned_at,
        problem_summary = EXCLUDED.problem_summary,
        goal_tags = EXCLUDED.goal_tags,
        timeline = EXCLUDED.timeline,
        budget_range = EXCLUDED.budget_range,
        preferred_meeting_mode = EXCLUDED.preferred_meeting_mode,
        preferred_times = EXCLUDED.preferred_times,
        status_changed_at = EXCLUDED.status_changed_at,
        first_response_at = EXCLUDED.first_response_at,
        response_time_minutes = EXCLUDED.response_time_minutes
    `,
      [IDS.lead, consumerUserId, IDS.business, IDS.listing, advisorUserId]
    )

    await client.query(
      `
      INSERT INTO public.lead (
        id, consumer_user_id, business_id, listing_id, assigned_to_user_id, assigned_at,
        problem_summary, goal_tags, timeline, budget_range, preferred_meeting_mode,
        preferred_times, status, status_changed_at, first_response_at, response_time_minutes
      )
      VALUES (
        $1, $2, $3, $4, $5, NOW(),
        'Need retirement strategy and portfolio review before transitioning roles next year.',
        ARRAY['retirement', 'portfolio']::text[], 'Exploring options', '500k-750k',
        'online', 'Weekday mornings', 'contacted', NOW(), NOW(), 180
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        assigned_to_user_id = EXCLUDED.assigned_to_user_id,
        assigned_at = EXCLUDED.assigned_at,
        problem_summary = EXCLUDED.problem_summary,
        goal_tags = EXCLUDED.goal_tags,
        timeline = EXCLUDED.timeline,
        budget_range = EXCLUDED.budget_range,
        preferred_meeting_mode = EXCLUDED.preferred_meeting_mode,
        preferred_times = EXCLUDED.preferred_times,
        status_changed_at = EXCLUDED.status_changed_at,
        first_response_at = EXCLUDED.first_response_at,
        response_time_minutes = EXCLUDED.response_time_minutes
    `,
      [
        IDS.leadFinancial,
        consumerUserId,
        IDS.businessFinancial,
        IDS.listingFinancial,
        advisorTwoUserId,
      ]
    )

    await client.query(
      `
      INSERT INTO public.lead (
        id, consumer_user_id, business_id, listing_id, assigned_to_user_id, assigned_at,
        problem_summary, goal_tags, timeline, budget_range, preferred_meeting_mode,
        preferred_times, status, status_changed_at, first_response_at, response_time_minutes
      )
      VALUES (
        $1, $2, $3, $4, $5, NOW(),
        'Looking for buyer advocacy support in Brisbane for an investment property.',
        ARRAY['investment-property', 'buyer-advocacy']::text[], 'Within 1 month', '800k-950k',
        'in_person', 'Saturday mornings', 'booked', NOW(), NOW(), 240
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        assigned_to_user_id = EXCLUDED.assigned_to_user_id,
        assigned_at = EXCLUDED.assigned_at,
        problem_summary = EXCLUDED.problem_summary,
        goal_tags = EXCLUDED.goal_tags,
        timeline = EXCLUDED.timeline,
        budget_range = EXCLUDED.budget_range,
        preferred_meeting_mode = EXCLUDED.preferred_meeting_mode,
        preferred_times = EXCLUDED.preferred_times,
        status_changed_at = EXCLUDED.status_changed_at,
        first_response_at = EXCLUDED.first_response_at,
        response_time_minutes = EXCLUDED.response_time_minutes
    `,
      [
        IDS.leadProperty,
        consumerUserId,
        IDS.businessProperty,
        IDS.listingProperty,
        advisorThreeUserId,
      ]
    )

    const clientRecordResult = await client.query(
      `
      INSERT INTO public.client_record (
        id, business_id, consumer_user_id, lead_id, display_name, email, phone,
        goals, situation_summary, outstanding_info, next_appointment_objective
      )
      VALUES (
        $1, $2, $3, $4, 'Demo Consumer', 'consumer@user.com', '+61400000000',
        'Purchase first home with repayment comfort and buffer.',
        'Dual-income household, stable employment, low existing debt.',
        'Need latest payslips and savings statements.',
        'Confirm lender shortlist and application readiness.'
      )
      ON CONFLICT (business_id, consumer_user_id) DO UPDATE SET
        lead_id = EXCLUDED.lead_id,
        goals = EXCLUDED.goals,
        situation_summary = EXCLUDED.situation_summary,
        outstanding_info = EXCLUDED.outstanding_info,
        next_appointment_objective = EXCLUDED.next_appointment_objective
      RETURNING id
    `,
      [IDS.clientRecord, IDS.business, consumerUserId, IDS.lead]
    )
    const clientRecordId = clientRecordResult.rows[0].id

    const conversationResult = await client.query(
      `
      INSERT INTO public.conversation (
        id, lead_id, consumer_user_id, business_id, subject, is_archived, last_message_at
      )
      VALUES ($1, $2, $3, $4, 'First-home loan options', false, NOW())
      ON CONFLICT (consumer_user_id, business_id) DO UPDATE SET
        lead_id = EXCLUDED.lead_id,
        subject = EXCLUDED.subject,
        is_archived = EXCLUDED.is_archived,
        last_message_at = EXCLUDED.last_message_at
      RETURNING id
    `,
      [IDS.conversation, IDS.lead, consumerUserId, IDS.business]
    )
    const conversationId = conversationResult.rows[0].id

    await client.query(
      `
      INSERT INTO public.message (id, conversation_id, sender_user_id, body, status)
      VALUES ($1, $2, $3, $4, 'delivered')
      ON CONFLICT (id) DO UPDATE SET
        body = EXCLUDED.body,
        status = EXCLUDED.status
    `,
      [
        IDS.messageConsumer,
        conversationId,
        consumerUserId,
        "Hi Sarah, I would like help understanding lender options before making an offer.",
      ]
    )

    await client.query(
      `
      INSERT INTO public.message (id, conversation_id, sender_user_id, body, status)
      VALUES ($1, $2, $3, $4, 'delivered')
      ON CONFLICT (id) DO UPDATE SET
        body = EXCLUDED.body,
        status = EXCLUDED.status
    `,
      [
        IDS.messageAdvisor,
        conversationId,
        advisorUserId,
        "Absolutely. I can walk you through borrowing capacity and rate structure on Thursday evening.",
      ]
    )

    await client.query(
      `
      INSERT INTO public.booking (
        id, business_id, advisor_user_id, lead_id, client_record_id,
        starts_at, ends_at, timezone, mode, meeting_link, status, advisor_notes
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, 'Australia/Melbourne', 'online',
        'https://meet.example.com/advyser-demo-call', 'confirmed',
        'Client prioritises repayment certainty over max borrowing.'
      )
      ON CONFLICT (id) DO UPDATE SET
        starts_at = EXCLUDED.starts_at,
        ends_at = EXCLUDED.ends_at,
        status = EXCLUDED.status,
        meeting_link = EXCLUDED.meeting_link,
        advisor_notes = EXCLUDED.advisor_notes
    `,
      [
        IDS.booking,
        IDS.business,
        advisorUserId,
        IDS.lead,
        clientRecordId,
        futureIso(3, 9),
        futureIso(3, 10),
      ]
    )

    await client.query(
      `
      INSERT INTO public.booking (
        id, business_id, advisor_user_id, lead_id, client_record_id,
        starts_at, ends_at, timezone, mode, meeting_link, status, advisor_notes
      )
      VALUES (
        $1, $2, $3, $4, NULL, $5, $6, 'Australia/Sydney', 'online',
        'https://meet.example.com/harbour-financial-intro', 'confirmed',
        'Prepare retirement cashflow assumptions and risk tolerance checkpoint.'
      )
      ON CONFLICT (id) DO UPDATE SET
        starts_at = EXCLUDED.starts_at,
        ends_at = EXCLUDED.ends_at,
        status = EXCLUDED.status,
        meeting_link = EXCLUDED.meeting_link,
        advisor_notes = EXCLUDED.advisor_notes
    `,
      [
        IDS.bookingFinancial,
        IDS.businessFinancial,
        advisorTwoUserId,
        IDS.leadFinancial,
        futureIso(5, 23),
        futureIso(6, 0),
      ]
    )

    await client.query(
      `
      INSERT INTO public.booking (
        id, business_id, advisor_user_id, lead_id, client_record_id,
        starts_at, ends_at, timezone, mode, location_text, status, advisor_notes
      )
      VALUES (
        $1, $2, $3, $4, NULL, $5, $6, 'Australia/Brisbane', 'in_person',
        'Brisbane CBD office', 'confirmed',
        'Property brief review and shortlisting workshop.'
      )
      ON CONFLICT (id) DO UPDATE SET
        starts_at = EXCLUDED.starts_at,
        ends_at = EXCLUDED.ends_at,
        status = EXCLUDED.status,
        location_text = EXCLUDED.location_text,
        advisor_notes = EXCLUDED.advisor_notes
    `,
      [
        IDS.bookingProperty,
        IDS.businessProperty,
        advisorThreeUserId,
        IDS.leadProperty,
        futureIso(7, 0),
        futureIso(7, 1),
      ]
    )

    await client.query(
      `
      INSERT INTO public.review (
        id, lead_id, consumer_user_id, business_id, listing_id, rating, title, body,
        status, flagged, moderated_by_admin_id, moderated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, 5, 'Clear and practical guidance',
        'Great breakdown of lender options and next steps. Very clear communication.',
        'published', false, $6, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        rating = EXCLUDED.rating,
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        status = EXCLUDED.status,
        flagged = EXCLUDED.flagged,
        moderated_by_admin_id = EXCLUDED.moderated_by_admin_id,
        moderated_at = EXCLUDED.moderated_at
    `,
      [IDS.review, IDS.lead, consumerUserId, IDS.business, IDS.listing, adminUserId]
    )

    const trustDisclosureTable = await client.query(
      `SELECT to_regclass('public.trust_disclosure') AS table_name`
    )
    const trustConsentTable = await client.query(
      `SELECT to_regclass('public.trust_consent') AS table_name`
    )
    const reviewReplyTable = await client.query(
      `SELECT to_regclass('public.review_reply') AS table_name`
    )

    const hasTrustDisclosure = !!trustDisclosureTable.rows[0]?.table_name
    const hasTrustConsent = !!trustConsentTable.rows[0]?.table_name
    const hasReviewReply = !!reviewReplyTable.rows[0]?.table_name

    if (hasTrustDisclosure) {
      await client.query(
        `
        UPDATE public.trust_disclosure
        SET is_active = false, updated_at = NOW()
        WHERE listing_id = $1
          AND disclosure_kind = 'promotion'
          AND id <> $2
          AND is_active = true
      `,
        [IDS.listing, IDS.trustDisclosurePromotion]
      )

      await client.query(
        `
        INSERT INTO public.trust_disclosure (
          id, listing_id, disclosure_kind, headline, disclosure_text,
          display_order, is_active, created_by_user_id, updated_by_user_id,
          approved_by_admin_id, approved_at
        )
        VALUES (
          $1, $2, 'promotion', 'Promoted placement disclosure',
          'This advisor may receive promoted placement in certain rankings. Promotion does not imply verification.',
          1, true, $3, $3, $4, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          headline = EXCLUDED.headline,
          disclosure_text = EXCLUDED.disclosure_text,
          display_order = EXCLUDED.display_order,
          is_active = EXCLUDED.is_active,
          updated_by_user_id = EXCLUDED.updated_by_user_id,
          approved_by_admin_id = EXCLUDED.approved_by_admin_id,
          approved_at = EXCLUDED.approved_at,
          updated_at = NOW()
      `,
        [
          IDS.trustDisclosurePromotion,
          IDS.listing,
          advisorUserId,
          adminUserId,
        ]
      )

      await client.query(
        `
        UPDATE public.trust_disclosure
        SET is_active = false, updated_at = NOW()
        WHERE listing_id = $1
          AND disclosure_kind = 'verification'
          AND id <> $2
          AND is_active = true
      `,
        [IDS.listing, IDS.trustDisclosureVerification]
      )

      await client.query(
        `
        INSERT INTO public.trust_disclosure (
          id, listing_id, disclosure_kind, headline, disclosure_text,
          display_order, is_active, created_by_user_id, updated_by_user_id,
          approved_by_admin_id, approved_at
        )
        VALUES (
          $1, $2, 'verification', 'Verification disclosure',
          'Verification badges are granted from credential checks and are separate from promoted placement.',
          2, true, $3, $3, $4, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          headline = EXCLUDED.headline,
          disclosure_text = EXCLUDED.disclosure_text,
          display_order = EXCLUDED.display_order,
          is_active = EXCLUDED.is_active,
          updated_by_user_id = EXCLUDED.updated_by_user_id,
          approved_by_admin_id = EXCLUDED.approved_by_admin_id,
          approved_at = EXCLUDED.approved_at,
          updated_at = NOW()
      `,
        [
          IDS.trustDisclosureVerification,
          IDS.listing,
          advisorUserId,
          adminUserId,
        ]
      )

      await client.query(
        `
        UPDATE public.trust_disclosure
        SET is_active = false, updated_at = NOW()
        WHERE listing_id = $1
          AND disclosure_kind = 'verification'
          AND id <> $2
          AND is_active = true
      `,
        [IDS.listingFinancial, IDS.trustDisclosureFinancialVerification]
      )

      await client.query(
        `
        INSERT INTO public.trust_disclosure (
          id, listing_id, disclosure_kind, headline, disclosure_text,
          display_order, is_active, created_by_user_id, updated_by_user_id,
          approved_by_admin_id, approved_at
        )
        VALUES (
          $1, $2, 'verification', 'Verification disclosure',
          'Verification indicators reflect credential checks and responsiveness monitoring.',
          1, true, $3, $3, $4, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          headline = EXCLUDED.headline,
          disclosure_text = EXCLUDED.disclosure_text,
          display_order = EXCLUDED.display_order,
          is_active = EXCLUDED.is_active,
          updated_by_user_id = EXCLUDED.updated_by_user_id,
          approved_by_admin_id = EXCLUDED.approved_by_admin_id,
          approved_at = EXCLUDED.approved_at,
          updated_at = NOW()
      `,
        [
          IDS.trustDisclosureFinancialVerification,
          IDS.listingFinancial,
          advisorTwoUserId,
          adminUserId,
        ]
      )

      await client.query(
        `
        UPDATE public.trust_disclosure
        SET is_active = false, updated_at = NOW()
        WHERE listing_id = $1
          AND disclosure_kind = 'verification'
          AND id <> $2
          AND is_active = true
      `,
        [IDS.listingProperty, IDS.trustDisclosurePropertyVerification]
      )

      await client.query(
        `
        INSERT INTO public.trust_disclosure (
          id, listing_id, disclosure_kind, headline, disclosure_text,
          display_order, is_active, created_by_user_id, updated_by_user_id,
          approved_by_admin_id, approved_at
        )
        VALUES (
          $1, $2, 'verification', 'Verification disclosure',
          'Verification status is based on active licence checks and marketplace trust controls.',
          1, true, $3, $3, $4, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          headline = EXCLUDED.headline,
          disclosure_text = EXCLUDED.disclosure_text,
          display_order = EXCLUDED.display_order,
          is_active = EXCLUDED.is_active,
          updated_by_user_id = EXCLUDED.updated_by_user_id,
          approved_by_admin_id = EXCLUDED.approved_by_admin_id,
          approved_at = EXCLUDED.approved_at,
          updated_at = NOW()
      `,
        [
          IDS.trustDisclosurePropertyVerification,
          IDS.listingProperty,
          advisorThreeUserId,
          adminUserId,
        ]
      )
    }

    if (hasTrustConsent && hasTrustDisclosure) {
      await client.query(
        `
        INSERT INTO public.trust_consent (
          id, user_id, listing_id, disclosure_id, consent_type, granted, consent_data
        )
        VALUES (
          $1, $2, $3, $4, 'disclosure_acknowledged', true,
          jsonb_build_object('source', 'seed', 'flow', 'marketplace')
        )
        ON CONFLICT (id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          listing_id = EXCLUDED.listing_id,
          disclosure_id = EXCLUDED.disclosure_id,
          consent_type = EXCLUDED.consent_type,
          granted = EXCLUDED.granted,
          consent_data = EXCLUDED.consent_data
      `,
        [
          IDS.trustConsent,
          consumerUserId,
          IDS.listing,
          IDS.trustDisclosurePromotion,
        ]
      )
    }

    if (hasReviewReply) {
      await client.query(
        `
        UPDATE public.review_reply
        SET deleted_at = NOW(), status = 'removed', updated_at = NOW()
        WHERE review_id = $1
          AND business_id = $2
          AND id <> $3
          AND deleted_at IS NULL
      `,
        [IDS.review, IDS.business, IDS.reviewReply]
      )

      await client.query(
        `
        INSERT INTO public.review_reply (
          id, review_id, business_id, responder_user_id, reply_text,
          status, published_at, deleted_at
        )
        VALUES (
          $1, $2, $3, $4,
          'Thank you for the feedback. We are glad the strategy session was clear and practical.',
          'published', NOW(), NULL
        )
        ON CONFLICT (id) DO UPDATE SET
          reply_text = EXCLUDED.reply_text,
          status = EXCLUDED.status,
          published_at = EXCLUDED.published_at,
          deleted_at = EXCLUDED.deleted_at,
          updated_at = NOW()
      `,
        [IDS.reviewReply, IDS.review, IDS.business, advisorUserId]
      )
    }

    await client.query(
      `
      UPDATE public.listing
      SET featured_review_id = $2,
          rating_avg = 5,
          review_count = 1,
          verification_level = 'licence_verified',
          is_featured = true
      WHERE id = $1
    `,
      [IDS.listing, IDS.review]
    )

    if (hasTrustDisclosure) {
      await client.query(
        `
        UPDATE public.listing
        SET verification_level = CASE
          WHEN id = $1 THEN 'basic'::public.verification_level
          WHEN id = $2 THEN 'enhanced'::public.verification_level
          ELSE verification_level
        END
        WHERE id IN ($1, $2)
      `,
        [IDS.listingFinancial, IDS.listingProperty]
      )
    }

    await client.query(
      `
      INSERT INTO public.user_shortlist (user_id, listing_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, listing_id) DO NOTHING
    `,
      [consumerUserId, IDS.listing]
    )

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

async function seed() {
  console.log(`Seeding demo users (mode: ${mode})...`)
  const userIds = {}

  for (const user of DEMO_USERS) {
    const userId = await getOrCreateAuthUser(user)
    userIds[user.email] = userId
    console.log(`- ${user.email}: auth-ready`)
  }

  await seedSqlData(userIds)
  console.log("Marketplace demo records seeded.")
}

seed().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
