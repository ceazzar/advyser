import { NextRequest, NextResponse } from "next/server"

import { adminApiError, withAdminGuard } from "@/lib/admin-intake/guard"
import { upsertLocationId } from "@/lib/admin-intake/location"
import { adminBusinessPatchSchema } from "@/lib/admin-intake/schemas"
import { uuidParamSchema } from "@/lib/schemas"
import type { ApiResponse } from "@/types/api"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const parsedId = uuidParamSchema.safeParse({ id })

  if (!parsedId.success) {
    return adminApiError(400, "INVALID_REQUEST", "Business ID must be a valid UUID.")
  }

  return withAdminGuard<{ id: string }>(request, async ({ adminClient }) => {
    try {
      const payload = adminBusinessPatchSchema.safeParse(await request.json())

      if (!payload.success) {
        return adminApiError(
          400,
          "INVALID_REQUEST",
          "Business patch payload is invalid.",
          payload.error.flatten().fieldErrors
        )
      }

      const updatePayload: Record<string, unknown> = {}

      if (payload.data.legal_name !== undefined) updatePayload.legal_name = payload.data.legal_name
      if (payload.data.trading_name !== undefined) updatePayload.trading_name = payload.data.trading_name
      if (payload.data.website !== undefined) updatePayload.website = payload.data.website
      if (payload.data.phone !== undefined) updatePayload.phone = payload.data.phone
      if (payload.data.email !== undefined) updatePayload.email = payload.data.email
      if (payload.data.created_source !== undefined) updatePayload.created_source = payload.data.created_source
      if (payload.data.claimed_status !== undefined) updatePayload.claimed_status = payload.data.claimed_status

      if (payload.data.location !== undefined) {
        if (payload.data.location === null) {
          updatePayload.primary_location_id = null
        } else {
          const locationId = await upsertLocationId(adminClient, {
            state: payload.data.location.state!,
            suburb: payload.data.location.suburb!,
            postcode: payload.data.location.postcode!,
          })
          updatePayload.primary_location_id = locationId
        }
      }

      if (payload.data.restore) {
        updatePayload.deleted_at = null
      }

      if (Object.keys(updatePayload).length === 0) {
        return adminApiError(400, "INVALID_REQUEST", "No valid fields provided for update.")
      }

      const { data, error } = await adminClient
        .from("business")
        .update(updatePayload)
        .eq("id", id)
        .select("id")
        .maybeSingle()

      if (error) {
        return adminApiError(500, "DATABASE_ERROR", "Failed to update business.")
      }

      if (!data?.id) {
        return adminApiError(404, "NOT_FOUND", "Business not found.")
      }

      return NextResponse.json<ApiResponse<{ id: string }>>({
        success: true,
        data: { id: data.id },
        timestamp: new Date().toISOString(),
      })
    } catch {
      return adminApiError(500, "INTERNAL_ERROR", "An unexpected error occurred.")
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const parsedId = uuidParamSchema.safeParse({ id })

  if (!parsedId.success) {
    return adminApiError(400, "INVALID_REQUEST", "Business ID must be a valid UUID.")
  }

  return withAdminGuard<{ id: string; deletedAt: string }>(request, async ({ adminClient }) => {
    try {
      const deletedAt = new Date().toISOString()
      const { data, error } = await adminClient
        .from("business")
        .update({
          deleted_at: deletedAt,
        })
        .eq("id", id)
        .select("id")
        .maybeSingle()

      if (error) {
        return adminApiError(500, "DATABASE_ERROR", "Failed to soft-delete business.")
      }

      if (!data?.id) {
        return adminApiError(404, "NOT_FOUND", "Business not found.")
      }

      return NextResponse.json<ApiResponse<{ id: string; deletedAt: string }>>({
        success: true,
        data: {
          id: data.id,
          deletedAt,
        },
        timestamp: new Date().toISOString(),
      })
    } catch {
      return adminApiError(500, "INTERNAL_ERROR", "An unexpected error occurred.")
    }
  })
}
