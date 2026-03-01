export interface PolicyMeta {
  lastUpdated: string
  version: string
  owner: string
}

export const policyMeta = {
  privacy: {
    lastUpdated: "2026-02-25",
    version: "1.1",
    owner: "Advyser Legal & Compliance",
  },
  terms: {
    lastUpdated: "2026-02-25",
    version: "1.1",
    owner: "Advyser Legal & Compliance",
  },
  cookies: {
    lastUpdated: "2026-02-25",
    version: "1.1",
    owner: "Advyser Product & Compliance",
  },
  disclaimer: {
    lastUpdated: "2026-02-25",
    version: "1.1",
    owner: "Advyser Legal & Compliance",
  },
} as const satisfies Record<string, PolicyMeta>

export const aboutSnapshotDate = "2026-02-25"

export function formatPolicyDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
