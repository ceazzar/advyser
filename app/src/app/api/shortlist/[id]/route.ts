import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Response type for shortlist removal
 */
interface ShortlistRemoveResponse {
  removed: boolean;
}

/**
 * DELETE /api/shortlist/[id]
 *
 * Remove a listing from the current user's shortlist.
 * The [id] parameter is the listing_id.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
            statusCode: 401,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Delete from user_shortlist where user_id = current user AND listing_id = id
    const { error: deleteError } = await supabase
      .from("user_shortlist")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);

    if (deleteError) {
      console.error("Shortlist delete error:", deleteError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DELETE_FAILED",
            message: deleteError.message,
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<ShortlistRemoveResponse>>({
      success: true,
      data: {
        removed: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Shortlist remove API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          statusCode: 500,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
