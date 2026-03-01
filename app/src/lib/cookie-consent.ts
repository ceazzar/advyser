export const COOKIE_CONSENT_KEY = "advyser-cookie-consent"

export type CookieConsentChoice = "accepted" | "essential"

export interface CookieConsentRecord {
  choice: CookieConsentChoice
  updatedAt: string
}

function parseCookieConsent(rawValue: string | null): CookieConsentRecord | null {
  if (!rawValue) return null

  // Backward compatibility with the previous single-value model.
  if (rawValue === "accepted") {
    return {
      choice: "accepted",
      updatedAt: new Date().toISOString(),
    }
  }

  if (rawValue === "essential") {
    return {
      choice: "essential",
      updatedAt: new Date().toISOString(),
    }
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CookieConsentRecord>
    if (parsed.choice !== "accepted" && parsed.choice !== "essential") {
      return null
    }

    return {
      choice: parsed.choice,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function readCookieConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null
  return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY))
}

export function writeCookieConsent(choice: CookieConsentChoice): CookieConsentRecord | null {
  if (typeof window === "undefined") return null

  const value: CookieConsentRecord = {
    choice,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value))
  return value
}

export function clearCookieConsent() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(COOKIE_CONSENT_KEY)
}
