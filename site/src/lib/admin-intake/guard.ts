import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { ApiResponse } from "@/types/api"

export interface AdminAccessContext {
  adminClient: ReturnType<typeof createAdminClient>
  actorUserId: string | null
  isBypass: boolean
}

const LOCAL_DEV_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"])

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error: {
        code,
        message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

function resolveHostname(request: NextRequest): string {
  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  return hostHeader.split(":")[0].trim().toLowerCase()
}

function canBypassAdminGuard(request: NextRequest): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.ENABLE_LOCAL_ADMIN === "true" &&
    LOCAL_DEV_HOSTS.has(resolveHostname(request))
  )
}

export async function requireAdminAccess(
  request: NextRequest
): Promise<{ success: true; context: AdminAccessContext } | { success: false; response: NextResponse }> {
  const adminClient = createAdminClient()

  if (canBypassAdminGuard(request)) {
    return {
      success: true,
      context: {
        adminClient,
        actorUserId: null,
        isBypass: true,
      },
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      response: errorResponse(401, "UNAUTHORIZED", "Admin authentication is required."),
    }
  }

  const { data: dbUser, error: roleError } = await adminClient
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (roleError || !dbUser) {
    return {
      success: false,
      response: errorResponse(403, "FORBIDDEN", "Unable to verify admin permissions."),
    }
  }

  if (dbUser.role !== "admin") {
    return {
      success: false,
      response: errorResponse(403, "FORBIDDEN", "Admin access is required."),
    }
  }

  return {
    success: true,
    context: {
      adminClient,
      actorUserId: user.id,
      isBypass: false,
    },
  }
}

export async function withAdminGuard<T>(
  request: NextRequest,
  handler: (context: AdminAccessContext) => Promise<NextResponse<ApiResponse<T | null>>>
): Promise<NextResponse<ApiResponse<T | null>>> {
  const access = await requireAdminAccess(request)

  if (!access.success) {
    return access.response as NextResponse<ApiResponse<T | null>>
  }

  return handler(access.context)
}

export function adminApiError(status: number, code: string, message: string, details?: Record<string, string[]>) {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error: {
        code,
        message,
        details,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}
