import { NextRequest, NextResponse } from "next/server"

import { adminApiError, withAdminGuard } from "@/lib/admin-intake/guard"
import { adminListingPatchSchema } from "@/lib/admin-intake/schemas"
import { uuidParamSchema } from "@/lib/schemas"
import type { ApiResponse } from "@/types/api"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const parsedId = uuidParamSchema.safeParse({ id })

  if (!parsedId.success) {
    return adminApiError(400, "INVALID_REQUEST", "Listing ID must be a valid UUID.")
  }

  return withAdminGuard<{ id: string }>(request, async ({ adminClient }) => {
    try {
      const payload = adminListingPatchSchema.safeParse(await request.json())

      if (!payload.success) {
        return adminApiError(
          400,
          "INVALID_REQUEST",
          "Listing patch payload is invalid.",
          payload.error.flatten().fieldErrors
        )
      }

      if (payload.data.business_id) {
        const { data: business, error: businessError } = await adminClient
          .from("business")
          .select("id")
          .eq("id", payload.data.business_id)
          .is("deleted_at", null)
          .maybeSingle()

        if (businessError || !business?.id) {
          return adminApiError(400, "INVALID_REQUEST", "business_id does not reference an active business.")
        }
      }

      const updatePayload: Record<string, unknown> = {}

      if (payload.data.business_id !== undefined) updatePayload.business_id = payload.data.business_id
      if (payload.data.advisor_type !== undefined) updatePayload.advisor_type = payload.data.advisor_type
      if (payload.data.service_mode !== undefined) updatePayload.service_mode = payload.data.service_mode
      if (payload.data.fee_model !== undefined) updatePayload.fee_model = payload.data.fee_model
      if (payload.data.accepting_status !== undefined) updatePayload.accepting_status = payload.data.accepting_status
      if (payload.data.verification_level !== undefined) {
        updatePayload.verification_level = payload.data.verification_level
      }
      if (payload.data.is_active !== undefined) updatePayload.is_active = payload.data.is_active
      if (payload.data.headline !== undefined) updatePayload.headline = payload.data.headline
      if (payload.data.bio !== undefined) updatePayload.bio = payload.data.bio

      if (payload.data.restore) {
        updatePayload.deleted_at = null
        if (payload.data.is_active === undefined) {
          updatePayload.is_active = true
        }
      }

      if (Object.keys(updatePayload).length === 0) {
        return adminApiError(400, "INVALID_REQUEST", "No valid fields provided for update.")
      }

      const { data, error } = await adminClient
        .from("listing")
        .update(updatePayload)
        .eq("id", id)
        .select("id")
        .maybeSingle()

      if (error) {
        return adminApiError(500, "DATABASE_ERROR", "Failed to update listing.")
      }

      if (!data?.id) {
        return adminApiError(404, "NOT_FOUND", "Listing not found.")
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
    return adminApiError(400, "INVALID_REQUEST", "Listing ID must be a valid UUID.")
  }

  return withAdminGuard<{ id: string; deletedAt: string }>(request, async ({ adminClient }) => {
    try {
      const deletedAt = new Date().toISOString()

      const { data, error } = await adminClient
        .from("listing")
        .update({
          deleted_at: deletedAt,
          is_active: false,
        })
        .eq("id", id)
        .select("id")
        .maybeSingle()

      if (error) {
        return adminApiError(500, "DATABASE_ERROR", "Failed to soft-delete listing.")
      }

      if (!data?.id) {
        return adminApiError(404, "NOT_FOUND", "Listing not found.")
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
