import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Consumer request summary (consumer's view of a lead they sent)
 */
export interface RequestSummary {
  id: string;
  // Advisor info
  advisor: {
    id: string;
    name: string;
    headline: string | null;
    avatar: string | null;
    businessName: string | null;
  };
  // Request details
  problemSummary: string | null;
  goalTags: string[];
  timeline: string | null;
  // Status
  status: string;
  statusChangedAt: string | null;
  // Timestamps
  createdAt: string;
  firstResponseAt: string | null;
  // Related conversation (if accepted)
  conversationId: string | null;
  hasUnreadMessages: boolean;
}

/**
 * GET /api/requests
 *
 * List the authenticated consumer's sent requests.
 *
 * Query Parameters:
 * - status: Filter by status (new, contacted, booked, converted, declined)
 * - page: Page number
 * - pageSize: Items per page
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
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    // Build query for consumer's leads
    let query = supabase
      .from("lead")
      .select(
        `
        id,
        problem_summary,
        goal_tags,
        timeline,
        status,
        status_changed_at,
        created_at,
        first_response_at,
        listing:listing_id (
          id,
          headline,
          advisor_profile (
            id,
            display_name,
            avatar_url
          ),
          business (
            trading_name
          )
        )
      `,
        { count: "exact" }
      )
      .eq("consumer_user_id", user.id)
      .order("created_at", { ascending: false });

    // Filter by status
    if (status) {
      query = query.eq("status", status);
    }

    // Pagination
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      console.error("Requests query error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch requests",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Fetch conversations for these leads (to get conversation IDs and unread status)
    const leadIds = (leads || []).map((l) => l.id);
    const { data: conversations } = await supabase
      .from("conversation")
      .select("id, lead_id, last_message_at")
      .in("lead_id", leadIds);

    // Build a map of lead_id -> conversation
    const conversationMap = new Map(
      (conversations || []).map((c) => [c.lead_id, c])
    );

    // Transform to API response
    const items: RequestSummary[] = (leads || []).map((lead) => {
      const listing = lead.listing as unknown as {
        id: string;
        headline?: string;
        advisor_profile?: {
          id: string;
          display_name?: string;
          avatar_url?: string;
        } | null;
        business?: {
          trading_name?: string;
        } | null;
      } | null;

      const conversation = conversationMap.get(lead.id);

      return {
        id: lead.id,
        advisor: {
          id: listing?.advisor_profile?.id || "",
          name: listing?.advisor_profile?.display_name || "Unknown Advisor",
          headline: listing?.headline || null,
          avatar: listing?.advisor_profile?.avatar_url || null,
          businessName: listing?.business?.trading_name || null,
        },
        problemSummary: lead.problem_summary,
        goalTags: lead.goal_tags || [],
        timeline: lead.timeline,
        status: lead.status,
        statusChangedAt: lead.status_changed_at,
        createdAt: lead.created_at,
        firstResponseAt: lead.first_response_at,
        conversationId: conversation?.id || null,
        // TODO: Calculate actual unread status when message_read_receipt is implemented
        hasUnreadMessages: false,
      };
    });

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<RequestSummary>>>({
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
    console.error("Requests API error:", error);
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
