import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Shortlist item with listing details
 */
export interface ShortlistItem {
  id: string; // listing_id as id for frontend
  listingId: string;
  addedAt: string;
  listing: {
    id: string;
    headline: string | null;
    advisorName: string;
    advisorAvatar: string | null;
    businessName: string | null;
    advisorType: string;
    rating: number | null;
    reviewCount: number;
    verified: boolean;
  };
}

/**
 * GET /api/shortlist
 *
 * Get the authenticated user's shortlisted listings.
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 20, max: 50)
 */
export async function GET(request: NextRequest) {
  try {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    // Query user_shortlist with listing details
    const offset = (page - 1) * pageSize;

    const { data: shortlistItems, error: queryError, count } = await supabase
      .from("user_shortlist")
      .select(
        `
        user_id,
        listing_id,
        created_at,
        listing:listing_id (
          id,
          headline,
          advisor_type,
          verification_level,
          rating_avg,
          review_count,
          advisor_profile:advisor_profile_id (
            display_name,
            avatar_url
          ),
          business:business_id (
            trading_name
          )
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (queryError) {
      console.error("Shortlist query error:", queryError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch shortlist",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Transform to API response shape
    const items: ShortlistItem[] = (shortlistItems || []).map((item) => {
      const listing = item.listing as unknown as {
        id: string;
        headline: string | null;
        advisor_type: string;
        verification_level: string;
        rating_avg: number | null;
        review_count: number;
        advisor_profile: {
          display_name: string;
          avatar_url: string | null;
        } | null;
        business: {
          trading_name: string | null;
        } | null;
      } | null;

      return {
        id: item.listing_id,
        listingId: item.listing_id,
        addedAt: item.created_at,
        listing: {
          id: listing?.id || item.listing_id,
          headline: listing?.headline || null,
          advisorName: listing?.advisor_profile?.display_name || listing?.business?.trading_name || "Unknown",
          advisorAvatar: listing?.advisor_profile?.avatar_url || null,
          businessName: listing?.business?.trading_name || null,
          advisorType: listing?.advisor_type || "financial_adviser",
          rating: listing?.rating_avg || null,
          reviewCount: listing?.review_count || 0,
          verified: ["licence_verified", "identity_verified"].includes(
            listing?.verification_level || ""
          ),
        },
      };
    });

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<ShortlistItem>>>({
      success: true,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Shortlist API error:", error);
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

/**
 * POST /api/shortlist
 *
 * Add a listing to the user's shortlist.
 *
 * Request body:
 * - listingId: UUID of the listing to add
 */
export async function POST(request: NextRequest) {
  try {
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

    // Parse request body
    const body = await request.json();
    const { listingId } = body;

    // Validate required fields
    if (!listingId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "listingId is required",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Verify listing exists and is active
    const { data: listing, error: listingError } = await supabase
      .from("listing")
      .select("id, is_active")
      .eq("id", listingId)
      .is("deleted_at", null)
      .single();

    if (listingError || !listing) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Listing not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    if (!listing.is_active) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "LISTING_INACTIVE",
            message: "Cannot shortlist an inactive listing",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Insert into user_shortlist (upsert - ignore if exists)
    const { error: insertError } = await supabase
      .from("user_shortlist")
      .upsert(
        {
          user_id: user.id,
          listing_id: listingId,
        },
        {
          onConflict: "user_id,listing_id",
          ignoreDuplicates: true,
        }
      );

    if (insertError) {
      console.error("Shortlist insert error:", insertError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to add to shortlist",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ success: boolean; added: boolean }>>(
      {
        success: true,
        data: {
          success: true,
          added: true,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to shortlist API error:", error);
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
