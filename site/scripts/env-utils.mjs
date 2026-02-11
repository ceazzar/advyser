import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

export function parseModeArg(argv, fallback = "local") {
  const modeArg = argv.find((arg) => arg.startsWith("--mode="))
  if (!modeArg) return fallback

  const value = modeArg.split("=")[1]?.trim()
  if (!value) return fallback
  return value
}

export function getDefaultEnvFiles(mode) {
  if (mode === "production") {
    return [".env.production.local", ".env.production", ".env.local"]
  }

  if (mode === "staging") {
    return [".env.staging.local", ".env.staging", ".env.local"]
  }

  return [".env.development.local", ".env.local"]
}

export function loadEnvFiles(baseDir, files) {
  for (const file of files) {
    const fullPath = resolve(baseDir, file)
    if (!existsSync(fullPath)) continue

    const content = readFileSync(fullPath, "utf-8")
    for (const rawLine of content.split("\n")) {
      const line = rawLine.trim()
      if (!line || line.startsWith("#")) continue

      const separatorIndex = line.indexOf("=")
      if (separatorIndex <= 0) continue

      const key = line.slice(0, separatorIndex).trim()
      const rawValue = line.slice(separatorIndex + 1).trim()
      const value = rawValue.replace(/^["']|["']$/g, "")
      process.env[key] = value
    }
  }
}

export function getMissingKeys(keys) {
  return keys.filter((key) => {
    const value = process.env[key]
    return !value || value.trim().length === 0
  })
}

export function getProjectRefFromSupabaseUrl(rawUrl) {
  if (!rawUrl) return null

  try {
    const hostname = new URL(rawUrl).hostname
    const match = hostname.match(/^([a-z0-9]{20})\.supabase\.co$/)
    return match?.[1] || null
  } catch {
    return null
  }
}
