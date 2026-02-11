import { existsSync, readFileSync } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const siteDir = resolve(scriptDir, "..")

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
}

function main() {
  verifySearchPage()
  verifyCategoryPage()
  verifyAdvisorDetailPage()
  verifyRequestIntroPage()

  console.log("Phase 10 UI integration verification passed (local/static).")
  console.log(
    JSON.stringify(
      {
        critical_routes_checked: [
          "src/app/search/page.tsx",
          "src/app/category/[type]/page.tsx",
          "src/app/advisors/[slug]/page.tsx",
          "src/app/request-intro/page.tsx",
        ],
        mock_patterns_blocked: true,
        live_api_wiring_confirmed: true,
      },
      null,
      2
    )
  )
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
