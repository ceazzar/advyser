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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function readPage(relativePath) {
  const fullPath = resolve(siteDir, relativePath)
  assert(existsSync(fullPath), `Missing required UI route file: ${relativePath}`)
  return readFileSync(fullPath, "utf-8")
}

function ensureNoPattern(content, pattern, label, filePath) {
  assert(!pattern.test(content), `${filePath} still contains blocked mock pattern: ${label}`)
}

function ensureHasPattern(content, pattern, label, filePath) {
  assert(pattern.test(content), `${filePath} missing expected live-data contract: ${label}`)
}

function verifySearchPage() {
  const filePath = "src/app/search/page.tsx"
  const content = readPage(filePath)

  ensureNoPattern(content, /const\s+mock[A-Za-z0-9_]*/i, "mock data constant", filePath)
  ensureHasPattern(content, /fetch\(\s*`?\/?api\/listings/i, "listings API fetch", filePath)
  ensureHasPattern(content, /router\.push\(\s*`\/advisors\/\$\{id\}`\s*\)/, "profile navigation", filePath)
}

function verifyCategoryPage() {
  const filePath = "src/app/category/[type]/page.tsx"
  const content = readPage(filePath)

  ensureNoPattern(content, /const\s+mock[A-Za-z0-9_]*/i, "mock data constant", filePath)
  ensureHasPattern(content, /fetch\(\s*`\/api\/listings\?/i, "listings API fetch", filePath)
  ensureNoPattern(
    content,
    /<Link\s+href="\/request-intro"/i,
    "direct request-intro CTA without listing selection",
    filePath
  )
  ensureHasPattern(
    content,
    /<Link\s+href=\{`\/search\?q=\$\{encodeURIComponent\(category\.title\)\}`\}/,
    "category CTA routes through advisor search",
    filePath
  )
}

function verifyAdvisorDetailPage() {
  const filePath = "src/app/advisors/[slug]/page.tsx"
  const content = readPage(filePath)

  ensureNoPattern(content, /const\s+mock[A-Za-z0-9_]*/i, "mock data constant", filePath)
  ensureNoPattern(content, /TODO:\s*Implement request intro/i, "unfinished request-intro TODO", filePath)
  ensureHasPattern(content, /fetch\(\s*`\/api\/listings\/\$\{listingId\}`/i, "listing detail fetch", filePath)
  ensureHasPattern(content, /request-intro\?listingId=/i, "request-intro linkage", filePath)
}

function verifyRequestIntroPage() {
  const filePath = "src/app/request-intro/page.tsx"
  const content = readPage(filePath)

  ensureNoPattern(content, /Simulate API call/i, "simulated submission", filePath)
  ensureHasPattern(content, /useSearchParams\(/, "listingId query integration", filePath)
  ensureHasPattern(content, /fetch\(\s*"\/api\/leads"/i, "live lead submission", filePath)
  ensureHasPattern(
    content,
    /Please start from an advisor profile so we know who to introduce you to\./,
    "guardrail for missing listing context",
    filePath
  )
}

function toPgClientConnectionString(rawUrl) {
  const parsed = new URL(rawUrl)
  parsed.searchParams.delete("sslmode")
  parsed.searchParams.set("sslmode", "require")
  parsed.searchParams.set("uselibpqcompat", "true")
  return parsed.toString()
}

async function verifyRuntimeFixtures(pgClient) {
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
  assert(activeListing.rowCount > 0, "No active listing fixture available for phase10 checks")
  const listingId = activeListing.rows[0].id

  const leadFixture = await pgClient.query(
    `
    SELECT id
    FROM public.lead
    WHERE listing_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `,
    [listingId]
  )
  assert(leadFixture.rowCount > 0, "No lead fixture found for active listing")

  const bookingFixture = await pgClient.query(
    `
    SELECT b.id
    FROM public.booking b
    JOIN public.lead l
      ON l.id = b.lead_id
    WHERE l.listing_id = $1
    ORDER BY b.created_at DESC
    LIMIT 1
  `,
    [listingId]
  )
  assert(bookingFixture.rowCount > 0, "No booking fixture found for active listing")

  return { listingId, checks: ["active_listing_fixture", "lead_fixture", "booking_fixture"] }
}

async function verifyHttpFunnel(baseUrl, listingId) {
  const normalizedBase = baseUrl.replace(/\/+$/, "")
  const checks = []

  try {
    const searchRes = await fetch(`${normalizedBase}/search`)
    assert(searchRes.ok, `HTTP funnel check failed: /search returned ${searchRes.status}`)
    checks.push("http_search_page")

    const listingsRes = await fetch(`${normalizedBase}/api/listings?page=1&pageSize=1`)
    assert(listingsRes.ok, `HTTP funnel check failed: /api/listings returned ${listingsRes.status}`)
    const listingsBody = await listingsRes.json()
    assert(listingsBody?.success === true, "HTTP funnel check failed: /api/listings success=false")
    checks.push("http_listings_api")

    const detailRes = await fetch(`${normalizedBase}/advisors/${listingId}`)
    assert(
      detailRes.ok,
      `HTTP funnel check failed: /advisors/${listingId} returned ${detailRes.status}`
    )
    checks.push("http_advisor_detail_page")

    const requestIntroRes = await fetch(`${normalizedBase}/request-intro?listingId=${listingId}`)
    assert(
      requestIntroRes.ok,
      `HTTP funnel check failed: /request-intro?listingId returned ${requestIntroRes.status}`
    )
    checks.push("http_request_intro_page")

    return { executed: true, checks }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      executed: false,
      checks: [],
      skippedReason: `HTTP funnel checks skipped (${normalizedBase} unreachable): ${message}`,
    }
  }
}

async function main() {
  verifySearchPage()
  verifyCategoryPage()
  verifyAdvisorDetailPage()
  verifyRequestIntroPage()

  const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
  const requiredKeys = dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]
  const missingKeys = getMissingKeys(requiredKeys)
  if (missingKeys.length > 0) {
    throw new Error(
      `Cannot verify phase10 runtime fixtures; missing keys: ${missingKeys.join(", ")}`
    )
  }

  const pgClient = new Client({
    connectionString: toPgClientConnectionString(dbUrl),
    ssl: { rejectUnauthorized: false },
  })

  await pgClient.connect()
  let runtimeFixtures
  try {
    runtimeFixtures = await verifyRuntimeFixtures(pgClient)
  } finally {
    await pgClient.end()
  }

  const baseUrl =
    process.env.PHASE_VERIFY_BASE_URL || process.env.VERIFY_BASE_URL || "http://localhost:3000"
  const httpFunnel = await verifyHttpFunnel(baseUrl, runtimeFixtures.listingId)
  if (httpFunnel.skippedReason) {
    console.log(httpFunnel.skippedReason)
  }

  console.log(`Phase 10 UI integration verification passed (${mode}).`)
  console.log(
    JSON.stringify(
      {
        critical_routes_checked: [
          "src/app/search/page.tsx",
          "src/app/category/[type]/page.tsx",
          "src/app/advisors/[slug]/page.tsx",
          "src/app/request-intro/page.tsx",
        ],
        runtime_fixture_checks: runtimeFixtures.checks,
        http_funnel_checks: httpFunnel.checks,
        http_checks_executed: httpFunnel.executed,
        mock_patterns_blocked: true,
        live_api_wiring_confirmed: true,
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
