import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, leadRatelimit, rateLimitHeaders } from "@/lib/ratelimit";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Lead summary for list view
 */
export interface LeadSummary {
  id: string;
  consumer: {
    id: string;
    displayName: string;
    // Email only shown after acceptance
    email?: string;
  };
  problemSummary: string | null;
  goalTags: string[];
  timeline: string | null;
  budgetRange: string | null;
  preferredMeetingMode: string | null;
  status: string;
  statusChangedAt: string | null;
  createdAt: string;
  firstResponseAt: string | null;
  responseTimeMinutes: number | null;
  // Attribution
  listingId: string | null;
  listingName: string | null;
}

/**
 * GET /api/leads
 *
 * List leads for the authenticated advisor's business.
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

    // Get user's business ID
    const { data: role } = await supabase
      .from("advisor_business_role")
      .select("business_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!role) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You are not a member of any business",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    // Build query
    let query = supabase
      .from("lead")
      .select(
        `
        id,
        problem_summary,
        goal_tags,
        timeline,
        budget_range,
        preferred_meeting_mode,
        status,
        status_changed_at,
        created_at,
        first_response_at,
        response_time_minutes,
        listing_id,
        consumer:consumer_user_id (
          id,
          display_name,
          email
        ),
        listing:listing_id (
          headline
        )
      `,
        { count: "exact" }
      )
      .eq("business_id", role.business_id)
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
      console.error("Leads query error:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch leads",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Transform to API response
    const items: LeadSummary[] = (leads || []).map((lead) => {
      const consumer = lead.consumer as unknown as {
        id: string;
        display_name?: string;
        email?: string;
      } | null;

      const listing = lead.listing as unknown as { headline?: string } | null;

      // Only show email if lead is past "new" status
      const showEmail = lead.status !== "new";

      return {
        id: lead.id,
        consumer: {
          id: consumer?.id || "",
          displayName: consumer?.display_name || "Anonymous",
          ...(showEmail && consumer?.email ? { email: consumer.email } : {}),
        },
        problemSummary: lead.problem_summary,
        goalTags: lead.goal_tags || [],
        timeline: lead.timeline,
        budgetRange: lead.budget_range,
        preferredMeetingMode: lead.preferred_meeting_mode,
        status: lead.status,
        statusChangedAt: lead.status_changed_at,
        createdAt: lead.created_at,
        firstResponseAt: lead.first_response_at,
        responseTimeMinutes: lead.response_time_minutes,
        listingId: lead.listing_id,
        listingName: listing?.headline || null,
      };
    });

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<LeadSummary>>>({
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
    console.error("Leads API error:", error);
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
 * POST /api/leads
 *
 * Create a new lead (consumer requests intro).
 * Uses server action internally for better UX.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "You must be logged in to request an introduction",
            statusCode: 401,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Rate limit by user ID
    const rateLimitResult = await checkRateLimit(leadRatelimit, user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "You have sent too many requests. Please try again later.",
            statusCode: 429,
          },
          timestamp: new Date().toISOString(),
        },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset),
        }
      );
    }

    // Parse body
    const body = await request.json();
    const { listingId, problemSummary, goalTags, timeline, budgetRange, preferredMeetingMode, preferredTimes, idempotencyKey } = body;

    if (!listingId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Listing ID is required",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check idempotency
    if (idempotencyKey) {
      const { data: existing } = await supabase
        .from("lead")
        .select("id")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (existing) {
        return NextResponse.json<ApiResponse<{ leadId: string }>>({
          success: true,
          data: { leadId: existing.id },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Get listing to find business_id
    const { data: listing, error: listingError } = await supabase
      .from("listing")
      .select("id, business_id")
      .eq("id", listingId)
      .eq("is_active", true)
      .single();

    if (listingError || !listing) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Advisor listing not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Check for existing active lead
    const { data: existingLead } = await supabase
      .from("lead")
      .select("id")
      .eq("consumer_user_id", user.id)
      .eq("business_id", listing.business_id)
      .not("status", "eq", "declined")
      .not("status", "eq", "converted")
      .maybeSingle();

    if (existingLead) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DUPLICATE",
            message: "You already have an active request with this advisor",
            statusCode: 409,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Create lead
    const { data: lead, error: createError } = await supabase
      .from("lead")
      .insert({
        consumer_user_id: user.id,
        business_id: listing.business_id,
        listing_id: listingId,
        problem_summary: problemSummary,
        goal_tags: goalTags,
        timeline,
        budget_range: budgetRange,
        preferred_meeting_mode: preferredMeetingMode,
        preferred_times: preferredTimes,
        idempotency_key: idempotencyKey,
        status: "new",
      })
      .select("id")
      .single();

    if (createError) {
      console.error("Lead creation error:", createError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to create request",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ leadId: string }>>(
      {
        success: true,
        data: { leadId: lead.id },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead API error:", error);
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
