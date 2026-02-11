import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "fs"
import { basename, dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { spawnSync } from "child_process"
import {
  getDefaultEnvFiles,
  getMissingKeys,
  loadEnvFiles,
  parseModeArg,
} from "./env-utils.mjs"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const siteDir = resolve(scriptDir, "..")
const repoDir = resolve(siteDir, "..")
const mode = parseModeArg(process.argv.slice(2), process.env.APP_ENV || "local")

loadEnvFiles(siteDir, getDefaultEnvFiles(mode))

const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
const requiredKeys = dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]
const missingKeys = getMissingKeys(requiredKeys)
if (missingKeys.length > 0) {
  console.error(`Cannot run migrations; missing keys: ${missingKeys.join(", ")}`)
  process.exit(1)
}

const commandCheck = spawnSync("supabase", ["--version"], { stdio: "ignore" })
if (commandCheck.status !== 0) {
  console.error("Supabase CLI is required but not available in PATH.")
  process.exit(1)
}

const migrationsDir = resolve(siteDir, "supabase/migrations")
mkdirSync(migrationsDir, { recursive: true })

const bootstrapMigrationMap = [
  {
    id: "20260210000000",
    source: resolve(repoDir, "database/schema.sql"),
    target: resolve(migrationsDir, "20260210000000_baseline_schema.sql"),
  },
  {
    id: "20260210000100",
    source: resolve(repoDir, "database/migrations/001_auth_trigger_and_rls.sql"),
    target: resolve(migrationsDir, "20260210000100_auth_trigger_and_rls.sql"),
  },
]

function parseMigrationRows(output) {
  const rows = []
  const rowPattern = /^\s*([0-9]{14})?\s*\|\s*([0-9]{14})?\s*\|/
  for (const line of output.split("\n")) {
    const match = line.match(rowPattern)
    if (!match) continue
    rows.push({
      localId: match[1]?.trim() || null,
      remoteId: match[2]?.trim() || null,
    })
  }
  return rows
}

function writeRemotePlaceholderMigration(migrationId) {
  const placeholderFile = resolve(migrationsDir, `${migrationId}_remote_legacy.sql`)
  if (existsSync(placeholderFile)) return
  writeFileSync(
    placeholderFile,
    [
      "-- Synced from remote migration history.",
      `-- Migration ID: ${migrationId}`,
      "-- Intentionally empty to align local and remote history.",
      "",
    ].join("\n")
  )
}

function getTopLevelMigrationFiles() {
  return readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
}

function hasConcreteLocalMigrationFile(migrationId) {
  const files = getTopLevelMigrationFiles()
  return files.some((file) => {
    if (!file.startsWith(`${migrationId}`)) return false
    if (!file.endsWith(".sql")) return false
    return !file.includes("_remote_legacy")
  })
}

function removeStalePlaceholderIfNeeded(migrationId) {
  const placeholderFile = resolve(migrationsDir, `${migrationId}_remote_legacy.sql`)
  if (!existsSync(placeholderFile)) return
  if (!hasConcreteLocalMigrationFile(migrationId)) return
  unlinkSync(placeholderFile)
}

const migrationListResult = spawnSync(
  "supabase",
  ["migration", "list", "--db-url", dbUrl],
  {
    cwd: siteDir,
    encoding: "utf-8",
  }
)

if (migrationListResult.status !== 0) {
  process.stderr.write(migrationListResult.stderr || "Failed to read remote migration history.\n")
  process.exit(migrationListResult.status ?? 1)
}

const rows = parseMigrationRows(migrationListResult.stdout || "")
const remoteIds = new Set(rows.map((row) => row.remoteId).filter(Boolean))
const localIds = new Set(rows.map((row) => row.localId).filter(Boolean))

if (remoteIds.size > 0) {
  // Existing remote project: sync local files to remote history IDs.
  for (const migrationId of remoteIds) {
    removeStalePlaceholderIfNeeded(migrationId)
    if (hasConcreteLocalMigrationFile(migrationId)) continue
    writeRemotePlaceholderMigration(migrationId)
  }

  const localOnlyIds = [...localIds].filter((id) => !remoteIds.has(id))
  const deferredDir = resolve(migrationsDir, "_deferred")
  for (const migrationId of localOnlyIds) {
    const bootstrapMigration = bootstrapMigrationMap.find((entry) => entry.id === migrationId)
    if (!bootstrapMigration) continue
    if (!existsSync(bootstrapMigration.target)) continue
    mkdirSync(deferredDir, { recursive: true })
    const deferredTarget = resolve(deferredDir, basename(bootstrapMigration.target))
    if (existsSync(deferredTarget)) continue
    renameSync(bootstrapMigration.target, deferredTarget)
  }
} else {
  // Fresh project: apply local bootstrap migrations.
  for (const { source, target } of bootstrapMigrationMap) {
    if (!existsSync(source)) {
      console.error(`Migration source file not found: ${source}`)
      process.exit(1)
    }

    const sourceContents = readFileSync(source, "utf-8")
    const existingContents = existsSync(target) ? readFileSync(target, "utf-8") : null

    if (existingContents !== sourceContents) {
      writeFileSync(target, sourceContents)
    }
  }
}

const pushResult = spawnSync(
  "supabase",
  [
    "db",
    "push",
    "--yes",
    "--include-all",
    "--db-url",
    dbUrl,
  ],
  {
    cwd: siteDir,
    stdio: "inherit",
  }
)

if (pushResult.status !== 0) {
  process.exit(pushResult.status ?? 1)
}

console.log("Database migrations applied successfully.")
