import { NextRequest, NextResponse } from "next/server"

import { fetchAllBusinesses, getDuplicateCandidates } from "@/lib/admin-intake/data"
import { adminApiError, withAdminGuard } from "@/lib/admin-intake/guard"
import { uuidParamSchema } from "@/lib/schemas"
import type { AdminDuplicateCandidatesResponse } from "@/types/admin-intake"
import type { ApiResponse } from "@/types/api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const parsedId = uuidParamSchema.safeParse({ id })

  if (!parsedId.success) {
    return adminApiError(400, "INVALID_REQUEST", "Business ID must be a valid UUID.")
  }

  return withAdminGuard<AdminDuplicateCandidatesResponse>(request, async ({ adminClient }) => {
    try {
      const rows = await fetchAllBusinesses(adminClient)
      const result = getDuplicateCandidates(id, rows)

      return NextResponse.json<ApiResponse<AdminDuplicateCandidatesResponse>>({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      if (error instanceof Error && error.message === "Business not found") {
        return adminApiError(404, "NOT_FOUND", "Business not found.")
      }
      return adminApiError(500, "DATABASE_ERROR", "Failed to compute duplicate candidates.")
    }
  })
}
