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
  console.error(
    `Cannot verify phase5 seed; missing keys: ${missingKeys.join(", ")}`
  )
  process.exit(1)
}

const DEMO_EMAILS = ["consumer@user.com", "advisor@user.com", "admin@user.com"]
const IDS = {
  business: "8af6e6ad-1f95-4639-93c9-c215d17995df",
  listing: "520e1e3d-e7d6-4224-b9a2-3bc6fc7d92af",
  lead: "d8f94de7-0807-4fca-9f89-62772a29d8db",
  conversation: "130205f2-4d50-46e6-9f7b-c7412e13ea37",
  booking: "2f4efd55-3ab8-40b2-ae1f-c2f6f56fce8f",
  review: "d8b93130-6d6a-4214-bf06-b2de20215e71",
}

function toPgClientConnectionString(rawUrl) {
  const parsed = new URL(rawUrl)
  parsed.searchParams.delete("sslmode")
  parsed.searchParams.set("sslmode", "require")
  parsed.searchParams.set("uselibpqcompat", "true")
  return parsed.toString()
}

async function listAuthUsersByEmail(admin, email) {
  for (let page = 1; page <= 20; page += 1) {
    const listResult = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    })
    if (listResult.error) {
      throw new Error(`Unable to list auth users: ${listResult.error.message}`)
    }

    const users = listResult.data?.users || []
    const match = users.find((candidate) => candidate.email === email)
    if (match) return match
    if (users.length < 200) break
  }

  return null
}

async function expectCount(client, name, query, params, expected) {
  const result = await client.query(query, params)
  const value = Number(result.rows[0]?.count || 0)
  if (value !== expected) {
    throw new Error(`${name} expected ${expected} but found ${value}`)
  }
  return value
}

async function main() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )

  const authUsers = []
  for (const email of DEMO_EMAILS) {
    const authUser = await listAuthUsersByEmail(admin, email)
    if (!authUser) {
      throw new Error(`Auth user not found for ${email}`)
    }
    authUsers.push(authUser)
  }

  const client = new Client({
    connectionString: toPgClientConnectionString(dbUrl),
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()

  try {
    const usersResult = await client.query(
      `
      SELECT id, email
      FROM public.users
      WHERE email = ANY($1::text[])
    `,
      [DEMO_EMAILS]
    )
    if (usersResult.rows.length !== DEMO_EMAILS.length) {
      throw new Error(
        `public.users demo rows expected ${DEMO_EMAILS.length} but found ${usersResult.rows.length}`
      )
    }

    const userIdByEmail = new Map(
      usersResult.rows.map((row) => [row.email, row.id])
    )

    const businessCount = await expectCount(
      client,
      "business row",
      "SELECT COUNT(*)::int AS count FROM public.business WHERE id = $1",
      [IDS.business],
      1
    )
    const listingCount = await expectCount(
      client,
      "listing row",
      "SELECT COUNT(*)::int AS count FROM public.listing WHERE id = $1 AND business_id = $2",
      [IDS.listing, IDS.business],
      1
    )
    const leadCount = await expectCount(
      client,
      "lead row",
      "SELECT COUNT(*)::int AS count FROM public.lead WHERE id = $1 AND listing_id = $2",
      [IDS.lead, IDS.listing],
      1
    )
    const conversationCount = await expectCount(
      client,
      "conversation row",
      "SELECT COUNT(*)::int AS count FROM public.conversation WHERE id = $1 AND lead_id = $2",
      [IDS.conversation, IDS.lead],
      1
    )
    const messageCount = await expectCount(
      client,
      "message rows",
      "SELECT COUNT(*)::int AS count FROM public.message WHERE conversation_id = $1",
      [IDS.conversation],
      2
    )
    const bookingCount = await expectCount(
      client,
      "booking row",
      "SELECT COUNT(*)::int AS count FROM public.booking WHERE id = $1 AND lead_id = $2",
      [IDS.booking, IDS.lead],
      1
    )
    const reviewCount = await expectCount(
      client,
      "review row",
      "SELECT COUNT(*)::int AS count FROM public.review WHERE id = $1 AND lead_id = $2",
      [IDS.review, IDS.lead],
      1
    )
    const shortlistCount = await expectCount(
      client,
      "user_shortlist row",
      "SELECT COUNT(*)::int AS count FROM public.user_shortlist WHERE user_id = $1 AND listing_id = $2",
      [userIdByEmail.get("consumer@user.com"), IDS.listing],
      1
    )

    const summary = {
      demo_auth_users: authUsers.length,
      demo_public_users: usersResult.rows.length,
      business: businessCount,
      listing: listingCount,
      lead: leadCount,
      conversation: conversationCount,
      messages: messageCount,
      booking: bookingCount,
      review: reviewCount,
      user_shortlist: shortlistCount,
    }

    console.log(`Phase 5 seed verification passed (${mode}).`)
    console.log(JSON.stringify(summary))
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
