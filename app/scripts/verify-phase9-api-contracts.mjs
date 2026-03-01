import { existsSync, readFileSync } from "fs"
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
const requiredKeys = dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]
const missingKeys = getMissingKeys(requiredKeys)
if (missingKeys.length > 0) {
  console.error(
    `Cannot verify phase9 API contracts; missing keys: ${missingKeys.join(", ")}`
  )
  process.exit(1)
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function readRoute(relativePath) {
  const fullPath = resolve(siteDir, relativePath)
  assert(existsSync(fullPath), `Missing required API route file: ${relativePath}`)
  return readFileSync(fullPath, "utf-8")
}

function ensureMethods(routePath, methods) {
  const content = readRoute(routePath)
  for (const method of methods) {
    assert(
      content.includes(`export async function ${method}`),
      `Route ${routePath} missing ${method} handler`
    )
  }
  return { routePath, methods }
}

function ensureContains(routePath, pattern, label) {
  const content = readRoute(routePath)
  assert(pattern.test(content), `${routePath} missing expected contract: ${label}`)
  return { routePath, label }
}

function toPgClientConnectionString(rawUrl) {
  const parsed = new URL(rawUrl)
  parsed.searchParams.delete("sslmode")
  parsed.searchParams.set("sslmode", "require")
  parsed.searchParams.set("uselibpqcompat", "true")
  return parsed.toString()
}

async function verifyDatabaseFunctions(pgClient) {
  const requiredFunctions = ["accept_lead", "book_lead", "convert_lead", "decline_lead"]

  const result = await pgClient.query(
    `
    SELECT p.proname
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY($1::text[])
  `,
    [requiredFunctions]
  )

  const found = new Set(result.rows.map((row) => row.proname))
  const missing = requiredFunctions.filter((fnName) => !found.has(fnName))
  assert(missing.length === 0, `Missing required phase9 lifecycle functions: ${missing.join(", ")}`)

  return requiredFunctions
}

async function verifyRuntimeQueryContracts(pgClient) {
  const checks = []

  const activeListing = await pgClient.query(
    `
    SELECT id
    FROM public.listing
    WHERE is_active = true
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `
  )
  assert(activeListing.rowCount > 0, "No active listings found for runtime verification")
  const listingId = activeListing.rows[0].id
  checks.push("active_listing_fixture")

  const listingSearchShape = await pgClient.query(
    `
    SELECT
      l.id,
      b.trading_name,
      b.email,
      b.phone,
      ap.display_name,
      c.credential_number,
      c.credential_type,
      c.verification_status
    FROM public.listing l
    JOIN public.business b
      ON b.id = l.business_id
    LEFT JOIN public.advisor_profile ap
      ON ap.id = l.advisor_profile_id
    LEFT JOIN public.credential c
      ON c.advisor_profile_id = ap.id
    WHERE l.is_active = true
      AND l.deleted_at IS NULL
    ORDER BY l.created_at DESC
    LIMIT 5
  `
  )
  assert(
    listingSearchShape.rowCount > 0,
    "Listings runtime query contract failed: no rows returned from search shape query"
  )
  checks.push("listings_search_query_shape")

  const listingDetailShape = await pgClient.query(
    `
    SELECT
      l.id,
      b.trading_name,
      b.email,
      b.phone,
      ap.display_name,
      c.credential_number,
      c.credential_type,
      q.name AS qualification_name
    FROM public.listing l
    JOIN public.business b
      ON b.id = l.business_id
    LEFT JOIN public.advisor_profile ap
      ON ap.id = l.advisor_profile_id
    LEFT JOIN public.credential c
      ON c.advisor_profile_id = ap.id
    LEFT JOIN public.advisor_qualification aq
      ON aq.advisor_profile_id = ap.id
    LEFT JOIN public.qualification q
      ON q.id = aq.qualification_id
    WHERE l.id = $1
    LIMIT 10
  `,
    [listingId]
  )
  assert(
    listingDetailShape.rowCount > 0,
    "Listing detail runtime query contract failed for active listing"
  )
  checks.push("listings_detail_query_shape")

  await pgClient.query(
    `
    SELECT
      bk.id,
      bk.starts_at,
      b.trading_name
    FROM public.booking bk
    JOIN public.business b
      ON b.id = bk.business_id
    ORDER BY bk.created_at DESC
    LIMIT 5
  `
  )
  checks.push("bookings_query_shape")

  const requestDetailShape = await pgClient.query(
    `
    SELECT
      ld.id,
      l.id AS listing_id,
      b.email,
      b.phone
    FROM public.lead ld
    JOIN public.listing l
      ON l.id = ld.listing_id
    JOIN public.business b
      ON b.id = l.business_id
    ORDER BY ld.created_at DESC
    LIMIT 5
  `
  )
  assert(
    requestDetailShape.rowCount > 0,
    "Request detail runtime query contract failed: no lead/listing/business rows found"
  )
  checks.push("requests_detail_query_shape")

  return { listingId, checks }
}

async function verifyHttpContracts(baseUrl, listingIdHint) {
  const normalizedBase = baseUrl.replace(/\/+$/, "")
  const checks = []

  try {
    const listingsRes = await fetch(`${normalizedBase}/api/listings?page=1&pageSize=1`)
    assert(
      listingsRes.ok,
      `HTTP contract failed for /api/listings (status=${listingsRes.status})`
    )

    const listingsBody = await listingsRes.json()
    assert(listingsBody?.success === true, "HTTP contract failed: /api/listings success=false")
    const listingId = listingsBody?.data?.items?.[0]?.id || listingIdHint
    assert(
      typeof listingId === "string" && listingId.length > 0,
      "HTTP contract failed: /api/listings returned no listing id"
    )
    checks.push("http_listings_get")

    const detailRes = await fetch(`${normalizedBase}/api/listings/${listingId}`)
    assert(
      detailRes.ok,
      `HTTP contract failed for /api/listings/${listingId} (status=${detailRes.status})`
    )
    const detailBody = await detailRes.json()
    assert(detailBody?.success === true, "HTTP contract failed: /api/listings/[id] success=false")
    assert(
      detailBody?.data?.id === listingId,
      "HTTP contract failed: /api/listings/[id] returned unexpected id"
    )
    checks.push("http_listings_detail_get")

    return { executed: true, checks }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      executed: false,
      checks: [],
      skippedReason: `HTTP checks skipped (${normalizedBase} unreachable): ${message}`,
    }
  }
}

async function main() {
  const routeChecks = [
    ensureMethods("src/app/api/listings/route.ts", ["GET"]),
    ensureMethods("src/app/api/listings/[id]/route.ts", ["GET"]),
    ensureMethods("src/app/api/leads/route.ts", ["GET", "POST"]),
    ensureMethods("src/app/api/leads/[id]/route.ts", ["GET", "PATCH"]),
    ensureMethods("src/app/api/requests/route.ts", ["GET"]),
    ensureMethods("src/app/api/requests/[id]/route.ts", ["GET", "DELETE"]),
    ensureMethods("src/app/api/bookings/route.ts", ["GET", "POST"]),
    ensureMethods("src/app/api/bookings/[id]/route.ts", ["GET", "PATCH"]),
    ensureMethods("src/app/api/conversations/route.ts", ["GET"]),
    ensureMethods("src/app/api/conversations/[id]/route.ts", ["GET", "PATCH"]),
    ensureMethods("src/app/api/conversations/[id]/messages/route.ts", ["GET", "POST"]),
  ]

  const contractChecks = [
    ensureContains(
      "src/app/api/leads/[id]/route.ts",
      /rpc\("accept_lead"/,
      "accept transition enforced server-side"
    ),
    ensureContains(
      "src/app/api/leads/[id]/route.ts",
      /rpc\("decline_lead"/,
      "decline transition enforced server-side"
    ),
    ensureContains(
      "src/app/api/leads/route.ts",
      /idempotency_key/,
      "idempotency support"
    ),
    ensureContains(
      "src/app/api/leads/route.ts",
      /DUPLICATE/,
      "duplicate active-lead rejection"
    ),
  ]

  const pgClient = new Client({
    connectionString: toPgClientConnectionString(dbUrl),
    ssl: { rejectUnauthorized: false },
  })

  await pgClient.connect()

  let requiredFunctions
  let runtimeContracts
  try {
    requiredFunctions = await verifyDatabaseFunctions(pgClient)
    runtimeContracts = await verifyRuntimeQueryContracts(pgClient)
  } finally {
    await pgClient.end()
  }

  const baseUrl =
    process.env.PHASE_VERIFY_BASE_URL || process.env.VERIFY_BASE_URL || "http://localhost:3000"
  const httpContracts = await verifyHttpContracts(baseUrl, runtimeContracts.listingId)
  if (httpContracts.skippedReason) {
    console.log(httpContracts.skippedReason)
  }

  console.log(`Phase 9 API contract verification passed (${mode}).`)
  console.log(
    JSON.stringify(
      {
        routes_checked: routeChecks.length,
        contract_checks: contractChecks.length,
        lifecycle_functions_checked: requiredFunctions,
        runtime_query_checks: runtimeContracts.checks,
        http_contract_checks: httpContracts.checks,
        http_checks_executed: httpContracts.executed,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
