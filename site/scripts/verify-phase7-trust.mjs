import { createClient } from "@supabase/supabase-js"
import pg from "pg"
import { dirname, resolve } from "path"
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
  console.error(`Cannot verify phase7 trust; missing keys: ${missingKeys.join(", ")}`)
  process.exit(1)
}

const IDS = {
  business: "8af6e6ad-1f95-4639-93c9-c215d17995df",
  listing: "520e1e3d-e7d6-4224-b9a2-3bc6fc7d92af",
  review: "d8b93130-6d6a-4214-bf06-b2de20215e71",
  advisorBusinessRole: "4f53f8d8-bd81-4dd7-a29f-95f12304f11a",
  trustDisclosurePromotion: "5b2001db-f63e-4efb-b284-04d7655d7ef8",
  trustDisclosureVerification: "f1239ce3-70f0-4c67-a5df-203ce84fe2e7",
  trustConsent: "f120ddfd-f4e4-49d8-bdf3-d5b8cf2f0a9c",
  reviewDispute: "f75ca411-ce6b-41a2-a9a1-80854d5978a6",
  reviewReply: "b174e644-8dd1-4acb-9070-6f88f5f66332",
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

    const trustTables = [
      "trust_disclosure",
      "trust_consent",
      "review_dispute",
      "review_reply",
    ]

    const tableState = await pgClient.query(
      `
      SELECT
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled,
        COALESCE(p.policy_count, 0) AS policy_count
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
      ORDER BY c.relname
    `,
      [trustTables]
    )

    assert(
      tableState.rows.length === trustTables.length,
      "Phase7 trust tables are missing"
    )
    for (const row of tableState.rows) {
      assert(row.rls_enabled === true, `RLS disabled on ${row.table_name}`)
      assert(Number(row.policy_count) > 0, `No RLS policy on ${row.table_name}`)
    }

    await pgClient.query("COMMIT")
  } catch (error) {
    await pgClient.query("ROLLBACK")
    throw error
  } finally {
    await pgClient.end()
  }

  const consumer = await signInAs("consumer@user.com", "consumer123")
  const advisor = await signInAs("advisor@user.com", "advisor123")
  const outsider = await signInAs("outsider@user.com", "outsider123")
  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const consumerUserId = authUsers["consumer@user.com"].id
  const advisorUserId = authUsers["advisor@user.com"].id
  const adminUserId = authUsers["admin@user.com"].id

  // Ensure deterministic trust disclosures.
  await service
    .from("trust_disclosure")
    .update({ is_active: false })
    .eq("listing_id", IDS.listing)
    .eq("disclosure_kind", "promotion")
    .neq("id", IDS.trustDisclosurePromotion)

  await service
    .from("trust_disclosure")
    .update({ is_active: false })
    .eq("listing_id", IDS.listing)
    .eq("disclosure_kind", "verification")
    .neq("id", IDS.trustDisclosureVerification)

  const promotionUpsert = await service.from("trust_disclosure").upsert(
    {
      id: IDS.trustDisclosurePromotion,
      listing_id: IDS.listing,
      disclosure_kind: "promotion",
      headline: "Promoted placement disclosure",
      disclosure_text:
        "Promoted placement is commercial and separate from verification.",
      display_order: 1,
      is_active: true,
      created_by_user_id: advisorUserId,
      updated_by_user_id: advisorUserId,
      approved_by_admin_id: adminUserId,
      approved_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )
  assert(!promotionUpsert.error, `Promotion disclosure upsert failed: ${promotionUpsert.error?.message || "unknown"}`)

  const verificationUpsert = await service.from("trust_disclosure").upsert(
    {
      id: IDS.trustDisclosureVerification,
      listing_id: IDS.listing,
      disclosure_kind: "verification",
      headline: "Verification disclosure",
      disclosure_text:
        "Verification reflects credential checks and is not tied to promoted placement.",
      display_order: 2,
      is_active: true,
      created_by_user_id: advisorUserId,
      updated_by_user_id: advisorUserId,
      approved_by_admin_id: adminUserId,
      approved_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )
  assert(!verificationUpsert.error, `Verification disclosure upsert failed: ${verificationUpsert.error?.message || "unknown"}`)

  // Badge policy enforcement checks.
  const resetListing = await service
    .from("listing")
    .update({ is_featured: false, verification_level: "none" })
    .eq("id", IDS.listing)
  assert(!resetListing.error, `Listing reset failed: ${resetListing.error?.message || "unknown"}`)

  const deactivatePromotion = await service
    .from("trust_disclosure")
    .update({ is_active: false, updated_by_user_id: adminUserId })
    .eq("id", IDS.trustDisclosurePromotion)
  assert(!deactivatePromotion.error, `Deactivate promotion disclosure failed: ${deactivatePromotion.error?.message || "unknown"}`)

  const featuredWithoutPromotion = await advisor
    .from("listing")
    .update({ is_featured: true })
    .eq("id", IDS.listing)
  assert(
    !!featuredWithoutPromotion.error,
    "Badge policy failed: featured listing allowed without active promotion disclosure"
  )

  const reactivatePromotion = await service
    .from("trust_disclosure")
    .update({ is_active: true, updated_by_user_id: adminUserId })
    .eq("id", IDS.trustDisclosurePromotion)
  assert(!reactivatePromotion.error, `Reactivate promotion disclosure failed: ${reactivatePromotion.error?.message || "unknown"}`)

  const featuredWithPromotion = await advisor
    .from("listing")
    .update({ is_featured: true })
    .eq("id", IDS.listing)
  assert(
    !featuredWithPromotion.error,
    `Featured update with promotion disclosure failed: ${featuredWithPromotion.error?.message || "unknown"}`
  )

  const deactivateVerification = await service
    .from("trust_disclosure")
    .update({ is_active: false, updated_by_user_id: adminUserId })
    .eq("id", IDS.trustDisclosureVerification)
  assert(!deactivateVerification.error, `Deactivate verification disclosure failed: ${deactivateVerification.error?.message || "unknown"}`)

  const verificationWithoutDisclosure = await advisor
    .from("listing")
    .update({ verification_level: "basic" })
    .eq("id", IDS.listing)
  assert(
    !!verificationWithoutDisclosure.error,
    "Badge policy failed: verification level update allowed without active verification disclosure"
  )

  const reactivateVerification = await service
    .from("trust_disclosure")
    .update({ is_active: true, updated_by_user_id: adminUserId })
    .eq("id", IDS.trustDisclosureVerification)
  assert(!reactivateVerification.error, `Reactivate verification disclosure failed: ${reactivateVerification.error?.message || "unknown"}`)

  // Separation check: promoted can exist while verification is none.
  const promotedUnverified = await advisor
    .from("listing")
    .update({ is_featured: true, verification_level: "none" })
    .eq("id", IDS.listing)
  assert(
    !promotedUnverified.error,
    `Promoted-unverified separation check failed: ${promotedUnverified.error?.message || "unknown"}`
  )

  const restoreVerified = await advisor
    .from("listing")
    .update({
      verification_level: "licence_verified",
      is_featured: true,
      featured_review_id: IDS.review,
      rating_avg: 5,
      review_count: 1,
    })
    .eq("id", IDS.listing)
  assert(!restoreVerified.error, `Restore verified listing failed: ${restoreVerified.error?.message || "unknown"}`)

  // Consent write and audit trace.
  await service.from("trust_consent").delete().eq("id", IDS.trustConsent)

  const consentInsert = await consumer.from("trust_consent").insert({
    id: IDS.trustConsent,
    user_id: consumerUserId,
    listing_id: IDS.listing,
    disclosure_id: IDS.trustDisclosurePromotion,
    consent_type: "disclosure_acknowledged",
    granted: true,
    consent_data: { source: "verify-phase7", gate: "phase7" },
  })
  assert(!consentInsert.error, `Trust consent insert failed: ${consentInsert.error?.message || "unknown"}`)

  const consentAudit = await service
    .from("audit_event")
    .select("id, action, entity_id")
    .eq("action", "trust.consent_recorded")
    .eq("entity_id", IDS.trustConsent)
    .limit(1)
  assert(!consentAudit.error, `Consent audit lookup failed: ${consentAudit.error?.message || "unknown"}`)
  assert((consentAudit.data || []).length > 0, "Missing consent audit event")

  const listingAudit = await service
    .from("audit_event")
    .select("action")
    .eq("entity_type", "listing")
    .eq("entity_id", IDS.listing)
    .in("action", [
      "trust.listing_promotion_state_changed",
      "trust.listing_verification_level_changed",
    ])
    .limit(10)
  assert(!listingAudit.error, `Listing trust audit lookup failed: ${listingAudit.error?.message || "unknown"}`)
  const actions = new Set((listingAudit.data || []).map((row) => row.action))
  assert(actions.has("trust.listing_promotion_state_changed"), "Missing listing promotion audit event")
  assert(actions.has("trust.listing_verification_level_changed"), "Missing listing verification audit event")

  // Review integrity: dispute + right of reply.
  const disputeUpsert = await consumer.from("review_dispute").upsert(
    {
      id: IDS.reviewDispute,
      review_id: IDS.review,
      requester_user_id: consumerUserId,
      business_id: IDS.business,
      reason_text: "Requesting correction of factual detail in published review.",
      status: "open",
    },
    { onConflict: "id" }
  )
  assert(!disputeUpsert.error, `Review dispute upsert failed: ${disputeUpsert.error?.message || "unknown"}`)

  const outsiderDisputeProbe = await outsider
    .from("review_dispute")
    .select("id")
    .eq("id", IDS.reviewDispute)
    .maybeSingle()
  assert(
    !outsiderDisputeProbe.error,
    `Outsider dispute probe errored: ${outsiderDisputeProbe.error?.message || "unknown"}`
  )
  assert(!outsiderDisputeProbe.data, "Outsider could read review dispute data")

  // Soft-delete any legacy reply for deterministic upsert under unique active key.
  await service
    .from("review_reply")
    .update({ deleted_at: new Date().toISOString(), status: "removed" })
    .eq("review_id", IDS.review)
    .eq("business_id", IDS.business)
    .neq("id", IDS.reviewReply)
    .is("deleted_at", null)

  const replyUpsert = await advisor.from("review_reply").upsert(
    {
      id: IDS.reviewReply,
      review_id: IDS.review,
      business_id: IDS.business,
      responder_user_id: advisorUserId,
      reply_text: "Thanks for the feedback. We appreciate the detailed review.",
      status: "published",
      deleted_at: null,
      published_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )
  assert(!replyUpsert.error, `Review reply upsert failed: ${replyUpsert.error?.message || "unknown"}`)

  const anonReplyRead = await anon
    .from("review_reply")
    .select("id, status")
    .eq("id", IDS.reviewReply)
    .eq("status", "published")
    .maybeSingle()
  assert(!anonReplyRead.error, `Anon review reply read failed: ${anonReplyRead.error?.message || "unknown"}`)
  assert(anonReplyRead.data?.id === IDS.reviewReply, "Public right-of-reply surface missing")

  const disputeAudit = await service
    .from("audit_event")
    .select("id")
    .eq("action", "trust.review_dispute_created")
    .eq("entity_id", IDS.reviewDispute)
    .limit(1)
  assert(!disputeAudit.error, `Dispute audit lookup failed: ${disputeAudit.error?.message || "unknown"}`)
  assert((disputeAudit.data || []).length > 0, "Missing review dispute audit event")

  const replyAudit = await service
    .from("audit_event")
    .select("id")
    .eq("action", "trust.review_reply_created")
    .eq("entity_id", IDS.reviewReply)
    .limit(1)
  assert(!replyAudit.error, `Reply audit lookup failed: ${replyAudit.error?.message || "unknown"}`)
  assert((replyAudit.data || []).length > 0, "Missing review reply audit event")

  console.log(`Phase 7 trust verification passed (${mode}).`)
  console.log(
    JSON.stringify({
      trust_tables_present: true,
      trust_tables_rls_enabled: true,
      trust_tables_policy_covered: true,
      badge_policy_enforced: true,
      badge_separation_verified_not_equal_promoted: true,
      consent_audit_written: true,
      review_dispute_scaffold_verified: true,
      review_reply_scaffold_verified: true,
      cross_tenant_dispute_read_blocked: true,
    })
  )

  await Promise.allSettled([
    consumer.auth.signOut(),
    advisor.auth.signOut(),
    outsider.auth.signOut(),
  ])
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
