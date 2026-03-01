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
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  ...(dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]),
]
const missingKeys = getMissingKeys(requiredKeys)
if (missingKeys.length > 0) {
  console.error(
    `Cannot verify phase6 RLS; missing keys: ${missingKeys.join(", ")}`
  )
  process.exit(1)
}

const IDS = {
  business: "8af6e6ad-1f95-4639-93c9-c215d17995df",
  advisorBusinessRole: "4f53f8d8-bd81-4dd7-a29f-95f12304f11a",
  lead: "d8f94de7-0807-4fca-9f89-62772a29d8db",
  clientRecord: "6d44aa0d-eb22-4f24-baba-034abf940d10",
  conversation: "130205f2-4d50-46e6-9f7b-c7412e13ea37",
  listing: "520e1e3d-e7d6-4224-b9a2-3bc6fc7d92af",
  claimOwnedByConsumer: "8380f80d-6979-4f5d-9c8a-c2cbe4a17c5a",
  claimOwnedByOutsider: "68751e26-8c9f-41f3-93f9-744f2bb2b4d5",
  advisorNote: "a02fc8df-8af4-4abf-a17e-6e65cf0a2dc8",
  advisorNoteRevision: "f557f90f-b4ee-4f05-9494-c2fd37695f8a",
  consumerSpoofNote: "42d681aa-a683-4a37-b763-0f247f9e5911",
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
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
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )

  const authUsers = {}
  for (const user of LOGIN_USERS) {
    const authUser = await getOrCreateAuthUser(admin, user)
    authUsers[user.email] = authUser
  }

  const { tablesChecked, rlsEnabledAllTables, policyPresenceAllTables } = await (async () => {
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

      await pgClient.query(
        `
        INSERT INTO public.claim_request (
          id, business_id, requester_user_id, status, submitted_email, verification_method
        )
        VALUES
          ($1, $2, $3, 'pending', 'consumer@user.com', 'email_domain'),
          ($4, $2, $5, 'pending', 'outsider@user.com', 'email_domain')
        ON CONFLICT (id) DO UPDATE SET
          business_id = EXCLUDED.business_id,
          requester_user_id = EXCLUDED.requester_user_id,
          status = EXCLUDED.status,
          submitted_email = EXCLUDED.submitted_email,
          verification_method = EXCLUDED.verification_method,
          updated_at = NOW()
      `,
        [
          IDS.claimOwnedByConsumer,
          IDS.business,
          authUsers["consumer@user.com"].id,
          IDS.claimOwnedByOutsider,
          authUsers["outsider@user.com"].id,
        ]
      )

      await pgClient.query(
        `
        INSERT INTO public.advisor_note (
          id, client_record_id, author_user_id, note_type, title, source
        )
        VALUES (
          $1, $2, $3, 'general', 'Advisor-only note', 'manual'
        )
        ON CONFLICT (id) DO UPDATE SET
          client_record_id = EXCLUDED.client_record_id,
          author_user_id = EXCLUDED.author_user_id,
          note_type = EXCLUDED.note_type,
          title = EXCLUDED.title,
          source = EXCLUDED.source,
          updated_at = NOW(),
          deleted_at = NULL
      `,
        [IDS.advisorNote, IDS.clientRecord, authUsers["advisor@user.com"].id]
      )

      await pgClient.query(
        `
        INSERT INTO public.advisor_note_revision (
          id, advisor_note_id, revision_number, content, created_by_user_id, source
        )
        VALUES (
          $1, $2, 1, 'Advisor private note for workspace validation.', $3, 'manual'
        )
        ON CONFLICT (id) DO UPDATE SET
          advisor_note_id = EXCLUDED.advisor_note_id,
          revision_number = EXCLUDED.revision_number,
          content = EXCLUDED.content,
          created_by_user_id = EXCLUDED.created_by_user_id,
          source = EXCLUDED.source
      `,
        [
          IDS.advisorNoteRevision,
          IDS.advisorNote,
          authUsers["advisor@user.com"].id,
        ]
      )

      await pgClient.query(
        `
        UPDATE public.advisor_note
        SET current_revision_id = $2, updated_at = NOW()
        WHERE id = $1
      `,
        [IDS.advisorNote, IDS.advisorNoteRevision]
      )

      const rlsSnapshot = await pgClient.query(
        `
        SELECT
          t.tablename,
          c.relrowsecurity AS rls_enabled,
          COALESCE(p.policy_count, 0) AS policy_count
        FROM pg_tables t
        JOIN pg_class c
          ON c.relname = t.tablename
        JOIN pg_namespace n
          ON n.oid = c.relnamespace
         AND n.nspname = t.schemaname
        LEFT JOIN (
          SELECT tablename, COUNT(*)::int AS policy_count
          FROM pg_policies
          WHERE schemaname = 'public'
          GROUP BY tablename
        ) p ON p.tablename = t.tablename
        WHERE t.schemaname = 'public'
        ORDER BY t.tablename
      `
      )

      const rlsDisabled = rlsSnapshot.rows.filter((row) => !row.rls_enabled)
      const noPolicy = rlsSnapshot.rows.filter((row) => Number(row.policy_count) === 0)
      const rlsEnabledAllTables = rlsDisabled.length === 0
      const policyPresenceAllTables = noPolicy.length === 0
      assert(
        rlsEnabledAllTables,
        `RLS disabled tables: ${rlsDisabled.map((r) => r.tablename).join(", ")}`
      )
      assert(
        policyPresenceAllTables,
        `No-policy tables: ${noPolicy.map((r) => r.tablename).join(", ")}`
      )

      const tablesChecked = rlsSnapshot.rows.length
      await pgClient.query("COMMIT")
      return { tablesChecked, rlsEnabledAllTables, policyPresenceAllTables }
    } catch (error) {
      await pgClient.query("ROLLBACK")
      throw error
    } finally {
      await pgClient.end()
    }
  })()

  const consumer = await signInAs("consumer@user.com", "consumer123")
  const advisor = await signInAs("advisor@user.com", "advisor123")
  const adminClient = await signInAs("admin@user.com", "admin123")
  const outsider = await signInAs("outsider@user.com", "outsider123")
  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const consumerUserId = authUsers["consumer@user.com"].id
  const verification = {
    rls_enabled_all_tables: rlsEnabledAllTables,
    policy_presence_all_tables: policyPresenceAllTables,
    cross_tenant_read_blocked: false,
    cross_tenant_write_blocked: false,
    advisor_business_access_ok: false,
    admin_access_ok: false,
    anon_catalog_read_ok: false,
    claim_access_matrix_ok: false,
    self_role_escalation_blocked: false,
    advisor_note_consumer_blocked: false,
  }

  const consumerLead = await consumer
    .from("lead")
    .select("id, consumer_user_id, business_id")
    .eq("id", IDS.lead)
    .maybeSingle()
  assert(!consumerLead.error, `Consumer lead read failed: ${consumerLead.error?.message || "unknown"}`)
  assert(consumerLead.data?.id === IDS.lead, "Consumer cannot read own lead")

  const advisorLead = await advisor
    .from("lead")
    .select("id")
    .eq("id", IDS.lead)
    .maybeSingle()
  assert(!advisorLead.error, `Advisor lead read failed: ${advisorLead.error?.message || "unknown"}`)
  assert(advisorLead.data?.id === IDS.lead, "Advisor cannot read business lead")

  const outsiderLead = await outsider
    .from("lead")
    .select("id")
    .eq("id", IDS.lead)
    .maybeSingle()
  assert(!outsiderLead.error, `Outsider lead probe errored: ${outsiderLead.error?.message || "unknown"}`)
  assert(!outsiderLead.data, "Outsider could read another tenant lead")

  const outsiderConversation = await outsider
    .from("conversation")
    .select("id")
    .eq("id", IDS.conversation)
    .maybeSingle()
  assert(
    !outsiderConversation.error,
    `Outsider conversation probe errored: ${outsiderConversation.error?.message || "unknown"}`
  )
  assert(!outsiderConversation.data, "Outsider could read another tenant conversation")

  const outsiderSpoofInsert = await outsider
    .from("lead")
    .insert({
      consumer_user_id: consumerUserId,
      business_id: IDS.business,
      problem_summary: "RLS spoof attempt",
    })
    .select("id")
  assert(!!outsiderSpoofInsert.error, "Outsider could insert lead for another consumer")

  const consumerForeignClaim = await consumer
    .from("claim_request")
    .select("id")
    .eq("id", IDS.claimOwnedByOutsider)
    .maybeSingle()
  assert(
    !consumerForeignClaim.error,
    `Consumer foreign claim probe errored: ${consumerForeignClaim.error?.message || "unknown"}`
  )
  assert(!consumerForeignClaim.data, "Consumer could read a foreign claim request")

  const outsiderOwnClaim = await outsider
    .from("claim_request")
    .select("id")
    .eq("id", IDS.claimOwnedByOutsider)
    .maybeSingle()
  assert(!outsiderOwnClaim.error, `Requester own-claim read failed: ${outsiderOwnClaim.error?.message || "unknown"}`)
  assert(outsiderOwnClaim.data?.id === IDS.claimOwnedByOutsider, "Requester cannot read own claim request")

  const advisorNoteRead = await advisor
    .from("advisor_note")
    .select("id")
    .eq("id", IDS.advisorNote)
    .maybeSingle()
  assert(!advisorNoteRead.error, `Advisor note read failed: ${advisorNoteRead.error?.message || "unknown"}`)
  assert(advisorNoteRead.data?.id === IDS.advisorNote, "Advisor cannot read advisor note for own business")

  const consumerNoteRead = await consumer
    .from("advisor_note")
    .select("id")
    .eq("id", IDS.advisorNote)
    .maybeSingle()
  assert(!consumerNoteRead.error, `Consumer advisor-note probe errored: ${consumerNoteRead.error?.message || "unknown"}`)
  assert(!consumerNoteRead.data, "Consumer could read advisor internal note")

  const consumerNoteInsert = await consumer
    .from("advisor_note")
    .insert({
      id: IDS.consumerSpoofNote,
      client_record_id: IDS.clientRecord,
      author_user_id: consumerUserId,
      note_type: "general",
      title: "Consumer spoof note",
    })
    .select("id")
  assert(!!consumerNoteInsert.error, "Consumer could insert advisor internal note")

  const roleEscalationAttempt = await consumer
    .from("users")
    .update({ role: "admin" })
    .eq("id", consumerUserId)
    .select("id, role")
    .maybeSingle()
  assert(!!roleEscalationAttempt.error, "Consumer could self-promote to admin")

  const persistedConsumerRole = await admin
    .from("users")
    .select("id, role")
    .eq("id", consumerUserId)
    .maybeSingle()
  assert(
    !persistedConsumerRole.error,
    `Service role verification failed for consumer role: ${persistedConsumerRole.error?.message || "unknown"}`
  )
  assert(
    persistedConsumerRole.data?.role === "consumer",
    `Consumer role mutated unexpectedly: ${persistedConsumerRole.data?.role || "missing"}`
  )

  const adminLead = await adminClient.from("lead").select("id").eq("id", IDS.lead).maybeSingle()
  assert(!adminLead.error, `Admin lead read failed: ${adminLead.error?.message || "unknown"}`)
  assert(adminLead.data?.id === IDS.lead, "Admin cannot read lead")

  const adminClaims = await adminClient
    .from("claim_request")
    .select("id")
    .eq("id", IDS.claimOwnedByOutsider)
    .maybeSingle()
  assert(!adminClaims.error, `Admin claim query failed: ${adminClaims.error?.message || "unknown"}`)
  assert(adminClaims.data?.id === IDS.claimOwnedByOutsider, "Admin cannot read foreign claim request")

  const anonListing = await anon
    .from("listing")
    .select("id, is_active")
    .eq("id", IDS.listing)
    .eq("is_active", true)
    .maybeSingle()
  assert(!anonListing.error, `Anon listing read failed: ${anonListing.error?.message || "unknown"}`)
  assert(anonListing.data?.id === IDS.listing, "Anon cannot read active listing")

  verification.cross_tenant_read_blocked =
    !outsiderLead.data &&
    !outsiderConversation.data &&
    !consumerForeignClaim.data &&
    !consumerNoteRead.data
  verification.cross_tenant_write_blocked =
    !!outsiderSpoofInsert.error &&
    !!consumerNoteInsert.error &&
    !!roleEscalationAttempt.error
  verification.advisor_business_access_ok =
    advisorLead.data?.id === IDS.lead && advisorNoteRead.data?.id === IDS.advisorNote
  verification.admin_access_ok =
    adminLead.data?.id === IDS.lead && adminClaims.data?.id === IDS.claimOwnedByOutsider
  verification.anon_catalog_read_ok = anonListing.data?.id === IDS.listing
  verification.claim_access_matrix_ok =
    !consumerForeignClaim.data &&
    outsiderOwnClaim.data?.id === IDS.claimOwnedByOutsider &&
    adminClaims.data?.id === IDS.claimOwnedByOutsider
  verification.self_role_escalation_blocked =
    !!roleEscalationAttempt.error && persistedConsumerRole.data?.role === "consumer"
  verification.advisor_note_consumer_blocked =
    !consumerNoteRead.data && !!consumerNoteInsert.error

  for (const [check, passed] of Object.entries(verification)) {
    assert(Boolean(passed), `Verification check failed: ${check}`)
  }

  console.log(`Phase 6 RLS verification passed (${mode}).`)
  console.log(
    JSON.stringify({
      tables_checked: tablesChecked,
      ...verification,
    })
  )

  await Promise.allSettled([
    consumer.auth.signOut(),
    advisor.auth.signOut(),
    adminClient.auth.signOut(),
    outsider.auth.signOut(),
  ])
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
