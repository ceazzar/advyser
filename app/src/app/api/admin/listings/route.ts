import { NextRequest, NextResponse } from "next/server"

import {
  fetchAllBusinesses,
  fetchAllListings,
  queryListings,
} from "@/lib/admin-intake/data"
import { adminApiError, withAdminGuard } from "@/lib/admin-intake/guard"
import {
  adminListingCreateSchema,
  adminListingQuerySchema,
} from "@/lib/admin-intake/schemas"
import type { AdminListingsResponse } from "@/types/admin-intake"
import type { ApiResponse } from "@/types/api"

export async function GET(request: NextRequest) {
  const parsedQuery = adminListingQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  )

  if (!parsedQuery.success) {
    return adminApiError(
      400,
      "INVALID_QUERY",
      "One or more query parameters are invalid.",
      parsedQuery.error.flatten().fieldErrors
    )
  }

  return withAdminGuard<AdminListingsResponse>(request, async ({ adminClient }) => {
    try {
      const [listingRows, businessRows] = await Promise.all([
        fetchAllListings(adminClient),
        fetchAllBusinesses(adminClient),
      ])

      const result = queryListings(listingRows, businessRows, parsedQuery.data)

      return NextResponse.json<ApiResponse<AdminListingsResponse>>({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      })
    } catch {
      return adminApiError(500, "DATABASE_ERROR", "Failed to fetch listings.")
    }
  })
}

export async function POST(request: NextRequest) {
  return withAdminGuard<{ id: string }>(request, async ({ adminClient }) => {
    try {
      const payload = adminListingCreateSchema.safeParse(await request.json())

      if (!payload.success) {
        return adminApiError(
          400,
          "INVALID_REQUEST",
          "Listing payload is invalid.",
          payload.error.flatten().fieldErrors
        )
      }

      const { data: business, error: businessError } = await adminClient
        .from("business")
        .select("id")
        .eq("id", payload.data.business_id)
        .is("deleted_at", null)
        .maybeSingle()

      if (businessError || !business?.id) {
        return adminApiError(400, "INVALID_REQUEST", "business_id does not reference an active business.")
      }

      const { data, error } = await adminClient
        .from("listing")
        .insert({
          business_id: payload.data.business_id,
          advisor_type: payload.data.advisor_type,
          service_mode: payload.data.service_mode || "both",
          fee_model: payload.data.fee_model || "unknown",
          accepting_status: payload.data.accepting_status || "taking_clients",
          is_active: payload.data.is_active ?? true,
          headline: payload.data.headline || null,
          bio: payload.data.bio || null,
          verification_level: "none",
        })
        .select("id")
        .single()

      if (error || !data?.id) {
        return adminApiError(500, "DATABASE_ERROR", "Failed to create listing.")
      }

      return NextResponse.json<ApiResponse<{ id: string }>>(
        {
          success: true,
          data: {
            id: data.id,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 201 }
      )
    } catch {
      return adminApiError(500, "INTERNAL_ERROR", "An unexpected error occurred.")
    }
  })
}
