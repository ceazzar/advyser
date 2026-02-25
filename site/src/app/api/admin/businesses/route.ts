import { NextRequest, NextResponse } from "next/server"

import { fetchAllBusinesses, queryBusinesses } from "@/lib/admin-intake/data"
import { adminApiError, withAdminGuard } from "@/lib/admin-intake/guard"
import { upsertLocationId } from "@/lib/admin-intake/location"
import {
  adminBusinessCreateSchema,
  adminBusinessQuerySchema,
} from "@/lib/admin-intake/schemas"
import type { AdminBusinessesResponse } from "@/types/admin-intake"
import type { ApiResponse } from "@/types/api"

export async function GET(request: NextRequest) {
  const parsedQuery = adminBusinessQuerySchema.safeParse(
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

  return withAdminGuard<AdminBusinessesResponse>(request, async ({ adminClient }) => {
    try {
      const rows = await fetchAllBusinesses(adminClient)
      const result = queryBusinesses(rows, parsedQuery.data)

      return NextResponse.json<ApiResponse<AdminBusinessesResponse>>({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      })
    } catch {
      return adminApiError(500, "DATABASE_ERROR", "Failed to fetch businesses.")
    }
  })
}

export async function POST(request: NextRequest) {
  return withAdminGuard<{ id: string }>(request, async ({ adminClient }) => {
    try {
      const payload = adminBusinessCreateSchema.safeParse(await request.json())

      if (!payload.success) {
        return adminApiError(
          400,
          "INVALID_REQUEST",
          "Business payload is invalid.",
          payload.error.flatten().fieldErrors
        )
      }

      const locationId = await upsertLocationId(
        adminClient,
        payload.data.location
          ? {
              state: payload.data.location.state!,
              suburb: payload.data.location.suburb!,
              postcode: payload.data.location.postcode!,
            }
          : null
      )

      const { data, error } = await adminClient
        .from("business")
        .insert({
          legal_name: payload.data.legal_name,
          trading_name: payload.data.trading_name || null,
          website: payload.data.website || null,
          phone: payload.data.phone || null,
          email: payload.data.email || null,
          primary_location_id: locationId,
          created_source: payload.data.created_source || "manual",
          claimed_status: payload.data.claimed_status || "unclaimed",
        })
        .select("id")
        .single()

      if (error || !data?.id) {
        return adminApiError(500, "DATABASE_ERROR", "Failed to create business.")
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
