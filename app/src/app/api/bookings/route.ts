import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Booking summary for list view
 */
export interface BookingSummary {
  id: string;
  otherParty: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  startsAt: string;
  endsAt: string;
  timezone: string;
  mode: string;
  locationText: string | null;
  meetingLink: string | null;
  status: string;
  createdAt: string;
}

/**
 * GET /api/bookings
 *
 * List bookings for the authenticated user.
 * - Consumer: bookings via lead.consumer_user_id
 * - Business member: bookings via business_id
 *
 * Query Parameters:
 * - status: upcoming|completed|cancelled (filter)
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

    // Check if user is a business member
    const { data: role } = await supabase
      .from("advisor_business_role")
      .select("business_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const isBusinessMember = !!role;

    let items: BookingSummary[] = [];
    let totalItems = 0;

    if (isBusinessMember) {
      // Business member: get bookings via business_id, other party = consumer
      const result = await getBusinessBookings(
        supabase,
        role.business_id,
        status,
        page,
        pageSize
      );
      items = result.items;
      totalItems = result.totalItems;
    } else {
      // Consumer: get bookings via lead.consumer_user_id, other party = advisor
      const result = await getConsumerBookings(
        supabase,
        user.id,
        status,
        page,
        pageSize
      );
      items = result.items;
      totalItems = result.totalItems;
    }

    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<BookingSummary>>>({
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
    console.error("Bookings API error:", error);
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
 * Get bookings for a business member (advisor view)
 * Other party = consumer from lead
 */
async function getBusinessBookings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  businessId: string,
  status: string | null,
  page: number,
  pageSize: number
): Promise<{ items: BookingSummary[]; totalItems: number }> {
  let query = supabase
    .from("booking")
    .select(
      `
      id,
      starts_at,
      ends_at,
      timezone,
      mode,
      location_text,
      meeting_link,
      status,
      created_at,
      lead:lead_id (
        consumer:consumer_user_id (
          id,
          display_name,
          avatar_url
        )
      )
    `,
      { count: "exact" }
    )
    .eq("business_id", businessId)
    .order("starts_at", { ascending: false });

  // Apply status filter
  query = applyStatusFilter(query, status);

  // Pagination
  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);

  const { data: bookings, error, count } = await query;

  if (error) {
    console.error("Business bookings query error:", error);
    throw new Error(`Failed to fetch business bookings: ${error.message}`);
  }

  const items: BookingSummary[] = (bookings || []).map((booking) => {
    const lead = booking.lead as unknown as {
      consumer: {
        id: string;
        display_name?: string;
        avatar_url?: string;
      } | null;
    } | null;

    const consumer = lead?.consumer;

    return {
      id: booking.id,
      otherParty: {
        id: consumer?.id || "",
        displayName: consumer?.display_name || "Anonymous",
        avatarUrl: consumer?.avatar_url || null,
      },
      startsAt: booking.starts_at,
      endsAt: booking.ends_at,
      timezone: booking.timezone,
      mode: booking.mode,
      locationText: booking.location_text,
      meetingLink: booking.meeting_link,
      status: booking.status,
      createdAt: booking.created_at,
    };
  });

  return { items, totalItems: count || 0 };
}

/**
 * Get bookings for a consumer
 * Other party = advisor from booking.advisor_user_id or business
 */
async function getConsumerBookings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  status: string | null,
  page: number,
  pageSize: number
): Promise<{ items: BookingSummary[]; totalItems: number }> {
  // First get all leads for this consumer
  const { data: leads } = await supabase
    .from("lead")
    .select("id")
    .eq("consumer_user_id", userId);

  if (!leads || leads.length === 0) {
    return { items: [], totalItems: 0 };
  }

  const leadIds = leads.map((l) => l.id);

  let query = supabase
    .from("booking")
    .select(
      `
      id,
      starts_at,
      ends_at,
      timezone,
      mode,
      location_text,
      meeting_link,
      status,
      created_at,
      advisor:advisor_user_id (
        id,
        display_name,
        avatar_url
      ),
      business:business_id (
        trading_name
      )
    `,
      { count: "exact" }
    )
    .in("lead_id", leadIds)
    .order("starts_at", { ascending: false });

  // Apply status filter
  query = applyStatusFilter(query, status);

  // Pagination
  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);

  const { data: bookings, error, count } = await query;

  if (error) {
    console.error("Consumer bookings query error:", error);
    throw new Error(`Failed to fetch consumer bookings: ${error.message}`);
  }

  const items: BookingSummary[] = (bookings || []).map((booking) => {
    const advisor = booking.advisor as unknown as {
      id: string;
      display_name?: string;
      avatar_url?: string;
    } | null;

    const business = booking.business as unknown as {
      trading_name?: string;
    } | null;

    // Use advisor info if available, otherwise fall back to business name
    const displayName = advisor?.display_name || business?.trading_name || "Advisor";

    return {
      id: booking.id,
      otherParty: {
        id: advisor?.id || "",
        displayName,
        avatarUrl: advisor?.avatar_url || null,
      },
      startsAt: booking.starts_at,
      endsAt: booking.ends_at,
      timezone: booking.timezone,
      mode: booking.mode,
      locationText: booking.location_text,
      meetingLink: booking.meeting_link,
      status: booking.status,
      createdAt: booking.created_at,
    };
  });

  return { items, totalItems: count || 0 };
}

/**
 * Apply status filter to booking query
 * Maps friendly status names to booking_status enum values
 */
function applyStatusFilter<T extends { eq: (col: string, val: string) => T; in: (col: string, vals: string[]) => T }>(
  query: T,
  status: string | null
): T {
  if (!status) return query;

  switch (status) {
    case "upcoming":
      // Proposed or confirmed bookings
      return query.in("status", ["proposed", "confirmed"]);
    case "completed":
      return query.eq("status", "completed");
    case "cancelled":
      // Cancelled or no-show
      return query.in("status", ["cancelled", "no_show"]);
    default:
      return query;
  }
}

/**
 * POST /api/bookings
 *
 * Create a new booking (business member only).
 *
 * Request body:
 * - leadId: UUID of the lead
 * - startsAt: ISO timestamp
 * - endsAt: ISO timestamp
 * - mode: meeting_mode enum value
 * - locationText?: string
 * - meetingLink?: string
 * - advisorNotes?: string
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

    // Verify user is a business member
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
            message: "Only business members can create bookings",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { leadId, startsAt, endsAt, mode, locationText, meetingLink, advisorNotes } = body;

    // Validate required fields
    if (!leadId || !startsAt || !endsAt || !mode) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "leadId, startsAt, endsAt, and mode are required",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate timestamps
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid date format for startsAt or endsAt",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "endsAt must be after startsAt",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Get lead to verify ownership and get business_id
    const { data: lead, error: leadError } = await supabase
      .from("lead")
      .select("id, business_id")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Lead not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Verify the lead belongs to the user's business
    if (lead.business_id !== role.business_id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have access to this lead",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Create the booking
    const { data: booking, error: createError } = await supabase
      .from("booking")
      .insert({
        business_id: lead.business_id,
        advisor_user_id: user.id,
        lead_id: leadId,
        starts_at: startsAt,
        ends_at: endsAt,
        timezone: "Australia/Sydney", // Default timezone
        mode,
        location_text: locationText || null,
        meeting_link: meetingLink || null,
        advisor_notes: advisorNotes || null,
        status: "proposed",
      })
      .select(
        `
        id,
        starts_at,
        ends_at,
        timezone,
        mode,
        location_text,
        meeting_link,
        status,
        created_at
      `
      )
      .single();

    if (createError) {
      console.error("Booking creation error:", createError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to create booking",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{
      id: string;
      startsAt: string;
      endsAt: string;
      timezone: string;
      mode: string;
      locationText: string | null;
      meetingLink: string | null;
      status: string;
      createdAt: string;
    }>>(
      {
        success: true,
        data: {
          id: booking.id,
          startsAt: booking.starts_at,
          endsAt: booking.ends_at,
          timezone: booking.timezone,
          mode: booking.mode,
          locationText: booking.location_text,
          meetingLink: booking.meeting_link,
          status: booking.status,
          createdAt: booking.created_at,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking API error:", error);
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
