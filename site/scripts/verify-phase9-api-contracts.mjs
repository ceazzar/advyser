import { existsSync, readFileSync } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import pg from "pg"
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
  try {
    requiredFunctions = await verifyDatabaseFunctions(pgClient)
  } finally {
    await pgClient.end()
  }

  console.log(`Phase 9 API contract verification passed (${mode}).`)
  console.log(
    JSON.stringify(
      {
        routes_checked: routeChecks.length,
        contract_checks: contractChecks.length,
        lifecycle_functions_checked: requiredFunctions,
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
