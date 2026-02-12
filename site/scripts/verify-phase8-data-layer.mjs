import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
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
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  ...(dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]),
]
const missingKeys = getMissingKeys(requiredKeys)
if (missingKeys.length > 0) {
  console.error(
    `Cannot verify phase8 data layer; missing keys: ${missingKeys.join(", ")}`
  )
  process.exit(1)
}

const IDS = {
  business: "8af6e6ad-1f95-4639-93c9-c215d17995df",
  listing: "520e1e3d-e7d6-4224-b9a2-3bc6fc7d92af",
  lead: "d8f94de7-0807-4fca-9f89-62772a29d8db",
  conversation: "130205f2-4d50-46e6-9f7b-c7412e13ea37",
  booking: "2f4efd55-3ab8-40b2-ae1f-c2f6f56fce8f",
  advisorBusinessRole: "4f53f8d8-bd81-4dd7-a29f-95f12304f11a",
}

const LOGIN_USERS = [
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
    email: "admin@user.com",
    password: "admin123",
    role: "admin",
    firstName: "Demo",
    lastName: "Admin",
    displayName: "Demo Admin",
  },
  {
    email: "outsider@user.com",
    password: "outsider123",
    role: "consumer",
    firstName: "Outside",
    lastName: "User",
    displayName: "Outside User",
  },
]

const WAVE_TABLES = {
  "8.A": [
    "location",
    "business",
    "advisor_profile",
    "advisor_business_role",
    "listing",
    "listing_service_area",
    "listing_specialty",
    "listing_service_offering",
    "specialty",
    "service_offering",
  ],
  "8.B": [
    "lead",
    "client_record",
    "conversation",
    "message",
    "message_read_receipt",
    "message_attachment",
    "booking",
    "advisor_availability",
    "advisor_note",
    "advisor_note_revision",
    "task",
    "copilot_run",
    "copilot_output",
  ],
  "8.C": [
    "review",
    "review_dispute",
    "review_reply",
    "trust_disclosure",
    "trust_consent",
    "audit_event",
  ],
  "8.D": ["subscription_plan", "subscription", "invoice", "payment_method"],
  "8.E": ["users", "user_shortlist"],
}

const REQUIRED_COLUMNS = {
  listing: [
    "business_id",
    "is_active",
    "verification_level",
    "is_featured",
    "fee_model",
  ],
  lead: ["business_id", "consumer_user_id", "listing_id", "status"],
  booking: ["business_id", "lead_id", "advisor_user_id", "starts_at", "ends_at"],
  conversation: ["business_id", "consumer_user_id", "lead_id"],
  review: ["business_id", "consumer_user_id", "lead_id", "listing_id", "status"],
  trust_disclosure: ["listing_id", "disclosure_kind", "is_active"],
  trust_consent: ["user_id", "listing_id", "consent_type", "created_at"],
  review_dispute: ["review_id", "business_id", "status"],
  review_reply: ["review_id", "business_id", "status"],
  audit_event: ["action", "entity_type", "entity_id", "metadata_json"],
  subscription_plan: ["tier", "price_monthly_cents", "max_leads_per_month"],
  subscription: ["business_id", "plan_id", "status"],
  invoice: ["business_id", "status", "subscription_id"],
  payment_method: ["business_id", "method_type"],
}

const REQUIRED_ENUMS = [
  "verification_level",
  "fee_model",
  "booking_status",
  "lead_status",
  "review_status",
  "review_dispute_status",
  "review_reply_status",
  "trust_disclosure_kind",
  "trust_consent_type",
  "subscription_status",
  "subscription_tier",
  "invoice_status",
  "payment_method_type",
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function toPgClientConnectionString(rawUrl) {
  const parsed = new URL(rawUrl)
  parsed.searchParams.delete("sslmode")
  parsed.searchParams.set("sslmode", "require")
  parsed.searchParams.set("uselibpqcompat", "true")
  return parsed.toString()
}

async function listAuthUserByEmail(admin, email) {
  for (let page = 1; page <= 20; page += 1) {
    const listResult = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (listResult.error) {
      throw new Error(`Unable to list auth users: ${listResult.error.message}`)
    }

    const users = listResult.data?.users || []
    const user = users.find((candidate) => candidate.email === email)
    if (user) return user
    if (users.length < 200) break
  }
  return null
}

async function getOrCreateAuthUser(admin, user) {
  const existing = await listAuthUserByEmail(admin, user.email)
  if (existing) return existing

  const createResult = await admin.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
      display_name: user.displayName,
    },
  })

  if (createResult.error || !createResult.data.user) {
    throw new Error(
      `Failed to create auth user ${user.email}: ${createResult.error?.message || "unknown"}`
    )
  }

  return createResult.data.user
}

async function signInAs(email, password) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )

  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error(`Login failed for ${email}: ${error.message}`)
  }
  return client
}

function flattenUniqueWaveTables() {
  const seen = new Set()
  for (const waveTables of Object.values(WAVE_TABLES)) {
    for (const tableName of waveTables) {
      seen.add(tableName)
    }
  }
  return [...seen]
}

async function verifySchemaWithPg(pgClient) {
  const allTables = flattenUniqueWaveTables()

  const tablesResult = await pgClient.query(
    `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name = ANY($1::text[])
  `,
    [allTables]
  )
  const foundTables = new Set(tablesResult.rows.map((row) => row.table_name))
  const missingTables = allTables.filter((tableName) => !foundTables.has(tableName))
  assert(
    missingTables.length === 0,
    `Missing phase8 required tables: ${missingTables.join(", ")}`
  )

  for (const [tableName, expectedColumns] of Object.entries(REQUIRED_COLUMNS)) {
    const columnsResult = await pgClient.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = ANY($2::text[])
    `,
      [tableName, expectedColumns]
    )

    const foundColumns = new Set(columnsResult.rows.map((row) => row.column_name))
    const missingColumns = expectedColumns.filter(
      (columnName) => !foundColumns.has(columnName)
    )
    assert(
      missingColumns.length === 0,
      `Missing required columns on ${tableName}: ${missingColumns.join(", ")}`
    )
  }

  const rlsPoliciesResult = await pgClient.query(
    `
    SELECT
      c.relname AS table_name,
      c.relrowsecurity AS rls_enabled,
      COALESCE(p.policy_count, 0)::int AS policy_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN (
      SELECT tablename, COUNT(*)::int AS policy_count
      FROM pg_policies
      WHERE schemaname = 'public'
      GROUP BY tablename
    ) p ON p.tablename = c.relname
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname = ANY($1::text[])
  `,
    [allTables]
  )

  const rlsMap = new Map(
    rlsPoliciesResult.rows.map((row) => [
      row.table_name,
      {
        rlsEnabled: row.rls_enabled === true,
        policyCount: Number(row.policy_count),
      },
    ])
  )

  for (const tableName of allTables) {
    const tableState = rlsMap.get(tableName)
    assert(tableState, `RLS metadata missing for table ${tableName}`)
    assert(tableState.rlsEnabled, `RLS disabled on ${tableName}`)
    assert(tableState.policyCount > 0, `No RLS policies on ${tableName}`)
  }

  const waveCoverage = {}
  for (const [wave, tableNames] of Object.entries(WAVE_TABLES)) {
    waveCoverage[wave] = tableNames.length
  }

  return {
    required_table_count: allTables.length,
    required_column_sets: Object.keys(REQUIRED_COLUMNS).length,
    wave_table_coverage: waveCoverage,
    rls_policy_checked_tables: allTables.length,
  }
}

function verifyGeneratedTypes() {
  const typesFile = resolve(siteDir, "src/types/database.generated.ts")
  const source = readFileSync(typesFile, "utf8")

  const allTables = flattenUniqueWaveTables()
  const missingTableTypes = allTables.filter(
    (tableName) => !source.includes(`      ${tableName}: {`)
  )
  assert(
    missingTableTypes.length === 0,
    `Generated types missing required tables: ${missingTableTypes.join(", ")}`
  )

  const missingEnums = REQUIRED_ENUMS.filter(
    (enumName) => !source.includes(`      ${enumName}:`)
  )
  assert(
    missingEnums.length === 0,
    `Generated types missing required enums: ${missingEnums.join(", ")}`
  )

  return {
    table_types_checked: allTables.length,
    enums_checked: REQUIRED_ENUMS.length,
    generated_types_path: typesFile,
  }
}

async function verifySeededFlow(authUsers) {
  const consumer = await signInAs("consumer@user.com", "consumer123")
  const advisor = await signInAs("advisor@user.com", "advisor123")
  const outsider = await signInAs("outsider@user.com", "outsider123")
  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const searchListing = await anon
    .from("listing")
    .select("id, business_id, is_active, verification_level, is_featured")
    .eq("id", IDS.listing)
    .eq("is_active", true)
    .maybeSingle()
  assert(!searchListing.error, `Anon listing search failed: ${searchListing.error?.message || "unknown"}`)
  assert(searchListing.data?.id === IDS.listing, "Seed listing not returned in anon search path")

  const listingSpecialties = await anon
    .from("listing_specialty")
    .select("listing_id, specialty_id")
    .eq("listing_id", IDS.listing)
    .limit(1)
  assert(!listingSpecialties.error, `Listing specialties query failed: ${listingSpecialties.error?.message || "unknown"}`)
  assert(
    (listingSpecialties.data || []).length >= 1,
    "Seed listing is missing listing_specialty linkage"
  )

  const listingServices = await anon
    .from("listing_service_offering")
    .select("listing_id, service_offering_id")
    .eq("listing_id", IDS.listing)
    .limit(1)
  assert(!listingServices.error, `Listing services query failed: ${listingServices.error?.message || "unknown"}`)
  assert(
    (listingServices.data || []).length >= 1,
    "Seed listing is missing listing_service_offering linkage"
  )

  const listingDisclosures = await anon
    .from("trust_disclosure")
    .select("id, listing_id, disclosure_kind, is_active")
    .eq("listing_id", IDS.listing)
    .eq("is_active", true)
  assert(!listingDisclosures.error, `Trust disclosures query failed: ${listingDisclosures.error?.message || "unknown"}`)
  const activeKinds = new Set((listingDisclosures.data || []).map((row) => row.disclosure_kind))
  assert(
    activeKinds.has("promotion") && activeKinds.has("verification"),
    "Seed listing is missing active promotion/verification disclosures"
  )

  const consumerLead = await consumer
    .from("lead")
    .select("id, business_id, listing_id, consumer_user_id")
    .eq("id", IDS.lead)
    .maybeSingle()
  assert(!consumerLead.error, `Consumer lead query failed: ${consumerLead.error?.message || "unknown"}`)
  assert(consumerLead.data?.id === IDS.lead, "Consumer cannot read own seeded lead")
  assert(
    consumerLead.data?.consumer_user_id === authUsers["consumer@user.com"].id,
    "Seed lead is not linked to consumer"
  )

  const consumerConversation = await consumer
    .from("conversation")
    .select("id, lead_id, business_id")
    .eq("id", IDS.conversation)
    .maybeSingle()
  assert(!consumerConversation.error, `Consumer conversation query failed: ${consumerConversation.error?.message || "unknown"}`)
  assert(
    consumerConversation.data?.lead_id === IDS.lead,
    "Conversation is not linked to seeded lead"
  )

  const consumerBooking = await consumer
    .from("booking")
    .select("id, lead_id, business_id")
    .eq("id", IDS.booking)
    .maybeSingle()
  assert(!consumerBooking.error, `Consumer booking query failed: ${consumerBooking.error?.message || "unknown"}`)
  assert(
    consumerBooking.data?.lead_id === IDS.lead,
    "Booking is not linked to seeded lead"
  )

  const advisorLeadView = await advisor
    .from("lead")
    .select("id, business_id")
    .eq("id", IDS.lead)
    .maybeSingle()
  assert(!advisorLeadView.error, `Advisor lead visibility failed: ${advisorLeadView.error?.message || "unknown"}`)
  assert(
    advisorLeadView.data?.business_id === IDS.business,
    "Advisor cannot read seeded business lead"
  )

  const advisorBookingView = await advisor
    .from("booking")
    .select("id, business_id")
    .eq("id", IDS.booking)
    .maybeSingle()
  assert(!advisorBookingView.error, `Advisor booking visibility failed: ${advisorBookingView.error?.message || "unknown"}`)
  assert(
    advisorBookingView.data?.business_id === IDS.business,
    "Advisor cannot read seeded business booking"
  )

  const outsiderLeadView = await outsider
    .from("lead")
    .select("id, business_id")
    .eq("id", IDS.lead)
    .maybeSingle()
  assert(!outsiderLeadView.error, `Outsider lead read produced client error: ${outsiderLeadView.error?.message || "unknown"}`)
  assert(!outsiderLeadView.data, "Outsider can read tenant-scoped lead")

  const subscriptionPlanCount = await service
    .from("subscription_plan")
    .select("id", { count: "exact", head: true })
  assert(!subscriptionPlanCount.error, `Subscription plan count failed: ${subscriptionPlanCount.error?.message || "unknown"}`)
  assert(
    Number(subscriptionPlanCount.count || 0) >= 1,
    "Subscription plan primitives are missing"
  )

  const listingMonetization = await service
    .from("listing")
    .select("id, fee_model, verification_level, is_featured")
    .eq("id", IDS.listing)
    .maybeSingle()
  assert(!listingMonetization.error, `Listing monetization read failed: ${listingMonetization.error?.message || "unknown"}`)
  assert(
    Boolean(listingMonetization.data?.fee_model),
    "Seed listing missing fee_model for monetization primitive"
  )

  return {
    anon_search_profile_ok: true,
    consumer_flow_ok: true,
    advisor_visibility_ok: true,
    outsider_tenant_block_ok: true,
    monetization_primitives_ok: true,
    active_disclosures: [...activeKinds],
    subscription_plans_count: Number(subscriptionPlanCount.count || 0),
  }
}

async function main() {
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )

  const authUsers = {}
  for (const user of LOGIN_USERS) {
    const authUser = await getOrCreateAuthUser(service, user)
    authUsers[user.email] = authUser
  }

  const pgClient = new Client({
    connectionString: toPgClientConnectionString(dbUrl),
    ssl: { rejectUnauthorized: false },
  })

  let schemaSummary = {}
  await pgClient.connect()
  try {
    await pgClient.query("BEGIN")

    for (const user of LOGIN_USERS) {
      await pgClient.query(
        `
        INSERT INTO public.users (
          id, email, role, first_name, last_name, display_name, email_verified_at
        )
        VALUES ($1, $2, $3::user_role, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          display_name = EXCLUDED.display_name,
          email_verified_at = EXCLUDED.email_verified_at
      `,
        [
          authUsers[user.email].id,
          user.email,
          user.role,
          user.firstName,
          user.lastName,
          user.displayName,
        ]
      )
    }

    await pgClient.query(
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
      [
        IDS.advisorBusinessRole,
        authUsers["advisor@user.com"].id,
        IDS.business,
      ]
    )

    schemaSummary = await verifySchemaWithPg(pgClient)
    await pgClient.query("COMMIT")
  } catch (error) {
    await pgClient.query("ROLLBACK")
    throw error
  } finally {
    await pgClient.end()
  }

  const typeSummary = verifyGeneratedTypes()
  const flowSummary = await verifySeededFlow(authUsers)

  const summary = {
    ...schemaSummary,
    ...typeSummary,
    ...flowSummary,
  }

  console.log(`Phase 8 data-layer verification passed (${mode}).`)
  console.log(JSON.stringify(summary))
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
