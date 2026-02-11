import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import {
  getDefaultEnvFiles,
  getMissingKeys,
  loadEnvFiles,
  parseModeArg,
} from "./env-utils.mjs"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const siteDir = resolve(scriptDir, "..")
const mode = parseModeArg(process.argv.slice(2), process.env.APP_ENV || "local")

loadEnvFiles(siteDir, getDefaultEnvFiles(mode))

const requiredKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "POSTGRES_URL",
  "NEXT_PUBLIC_SITE_URL",
]

const missingKeys = getMissingKeys(requiredKeys)

if (missingKeys.length > 0) {
  console.error(`Environment validation failed for mode "${mode}".`)
  console.error(`Missing keys: ${missingKeys.join(", ")}`)
  process.exit(1)
}

console.log(`Environment validation passed for mode "${mode}".`)
