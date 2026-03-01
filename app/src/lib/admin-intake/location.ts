import { createAdminClient } from "@/lib/supabase/admin"

export interface LocationInput {
  state: string
  suburb: string
  postcode: string
}

export interface LocationRecord {
  id: string
  suburb: string | null
  state: string | null
  postcode: string | null
}

function normalizeSuburb(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ")
}

export async function upsertLocationId(
  adminClient: ReturnType<typeof createAdminClient>,
  location?: LocationInput | null
): Promise<string | null> {
  if (!location) return null

  const suburb = normalizeSuburb(location.suburb)

  const { data, error } = await adminClient
    .from("location")
    .upsert(
      {
        state: location.state,
        suburb,
        postcode: location.postcode,
      },
      {
        onConflict: "state,suburb,postcode",
      }
    )
    .select("id")
    .single()

  if (error || !data?.id) {
    throw new Error("Failed to upsert location")
  }

  return data.id
}
