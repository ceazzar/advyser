import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Booking detail response type
 */
export interface BookingDetail {
  id: string;
  otherParty: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    businessName?: string;
  };
  lead: {
    id: string;
    problemSummary: string | null;
    status: string;
  } | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  mode: string;
  locationText: string | null;
  meetingLink: string | null;
  status: string;
  advisorNotes: string | null;
  createdAt: string;
}

/**
 * Valid booking status transitions
 */
const VALID_TRANSITIONS: Record<string, string[]> = {
  proposed: ["confirmed", "cancelled"],
  confirmed: ["cancelled", "completed"],
  cancelled: [], // Terminal state
  completed: [], // Terminal state
};

/**
 * GET /api/bookings/[id]
 *
 * Get details for a single booking.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Fetch booking with related data
    const { data: booking, error } = await supabase
      .from("booking")
      .select(
        `
        id,
        business_id,
        advisor_user_id,
        lead_id,
        starts_at,
        ends_at,
        timezone,
        mode,
        location_text,
        meeting_link,
        status,
        advisor_notes,
        created_at,
        business:business_id (
          id,
          trading_name
        ),
        lead:lead_id (
          id,
          problem_summary,
          status,
          consumer_user_id
        )
      `
      )
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !booking) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Booking not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Type assertions
    const business = booking.business as unknown as {
      id: string;
      trading_name?: string;
    } | null;

    const lead = booking.lead as unknown as {
      id: string;
      problem_summary?: string;
      status: string;
      consumer_user_id: string;
    } | null;

    // Determine user's role: consumer (via lead) or business member
    const isConsumer = lead?.consumer_user_id === user.id;

    // If not consumer, check if user is an active business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: membership } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("business_id", booking.business_id)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      isBusinessMember = !!membership;
    }

    // Verify access
    if (!isConsumer && !isBusinessMember) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied to this booking",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Fetch other party info based on role
    let otherParty: BookingDetail["otherParty"];

    if (isConsumer) {
      // Consumer viewing: fetch advisor/business info
      // Try to get the advisor profile for this business
      const { data: advisorProfile } = await supabase
        .from("advisor_profile")
        .select("id, user_id, display_name, avatar_url")
        .eq("business_id", booking.business_id)
        .maybeSingle();

      if (advisorProfile) {
        otherParty = {
          id: advisorProfile.user_id,
          displayName: advisorProfile.display_name || "Advisor",
          avatarUrl: advisorProfile.avatar_url,
          businessName: business?.trading_name || undefined,
        };
      } else {
        // Fallback to business info only
        otherParty = {
          id: booking.business_id,
          displayName: business?.trading_name || "Business",
          avatarUrl: null,
          businessName: business?.trading_name || undefined,
        };
      }
    } else {
      // Business/advisor viewing: fetch consumer info via lead
      if (lead) {
        const { data: consumerProfile } = await supabase
          .from("users")
          .select("id, display_name, avatar_url")
          .eq("id", lead.consumer_user_id)
          .single();

        otherParty = {
          id: lead.consumer_user_id,
          displayName: consumerProfile?.display_name || "Consumer",
          avatarUrl: consumerProfile?.avatar_url || null,
        };
      } else {
        // Booking without lead - could be from client_record
        otherParty = {
          id: "",
          displayName: "Client",
          avatarUrl: null,
        };
      }
    }

    const detail: BookingDetail = {
      id: booking.id,
      otherParty,
      lead: lead
        ? {
            id: lead.id,
            problemSummary: lead.problem_summary || null,
            status: lead.status,
          }
        : null,
      startsAt: booking.starts_at,
      endsAt: booking.ends_at,
      timezone: booking.timezone || "Australia/Sydney",
      mode: booking.mode,
      locationText: booking.location_text,
      meetingLink: booking.meeting_link,
      status: booking.status,
      advisorNotes: isBusinessMember ? booking.advisor_notes : null, // Only show notes to business
      createdAt: booking.created_at,
    };

    return NextResponse.json<ApiResponse<BookingDetail>>({
      success: true,
      data: detail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Booking detail API error:", error);
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
 * PATCH /api/bookings/[id]
 *
 * Update booking status or reschedule.
 * Request body options:
 * - { status: "confirmed" | "cancelled" | "completed" }
 * - { startsAt: string, endsAt: string } for reschedule
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const body = await request.json();
    const { status, startsAt, endsAt, version } = body;

    // Validate request - must have either status OR (startsAt AND endsAt)
    const isStatusUpdate = status !== undefined;
    const isReschedule = startsAt !== undefined && endsAt !== undefined;

    if (!isStatusUpdate && !isReschedule) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message:
              "Request must include either status or startsAt/endsAt for reschedule",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Fetch current booking to verify access and current state
    const { data: booking, error: fetchError } = await supabase
      .from("booking")
      .select(
        `
        id,
        business_id,
        lead_id,
        status,
        version,
        lead:lead_id (
          consumer_user_id
        )
      `
      )
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Booking not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Type assertion for lead
    const lead = booking.lead as unknown as {
      consumer_user_id: string;
    } | null;

    // Determine user's role
    const isConsumer = lead?.consumer_user_id === user.id;

    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: membership } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("business_id", booking.business_id)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      isBusinessMember = !!membership;
    }

    // Verify access
    if (!isConsumer && !isBusinessMember) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied to this booking",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Handle status update
    if (isStatusUpdate) {
      // Validate status value
      const validStatuses = ["confirmed", "cancelled", "completed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "INVALID_REQUEST",
              message: `Status must be one of: ${validStatuses.join(", ")}`,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Validate transition
      const allowedTransitions = VALID_TRANSITIONS[booking.status] || [];
      if (!allowedTransitions.includes(status)) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "INVALID_TRANSITION",
              message: `Cannot transition from '${booking.status}' to '${status}'`,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Only business members can mark as completed
      if (status === "completed" && !isBusinessMember) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "Only business members can mark bookings as completed",
              statusCode: 403,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }

      // Update with optimistic locking if version provided
      let updateQuery = supabase
        .from("booking")
        .update({
          status,
          version: (booking.version || 1) + 1,
        })
        .eq("id", id)
        .is("deleted_at", null);

      if (version !== undefined) {
        updateQuery = updateQuery.eq("version", version);
      }

      const { data: updatedBooking, error: updateError } = await updateQuery
        .select("id, status, version")
        .single();

      if (updateError) {
        // Check if it's a conflict (no rows updated due to version mismatch)
        if (updateError.code === "PGRST116") {
          return NextResponse.json<ApiResponse<null>>(
            {
              success: false,
              error: {
                code: "CONFLICT",
                message:
                  "Booking was modified by another user. Please refresh and try again.",
                statusCode: 409,
              },
              timestamp: new Date().toISOString(),
            },
            { status: 409 }
          );
        }

        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "UPDATE_FAILED",
              message: updateError.message,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      if (!updatedBooking) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "CONFLICT",
              message:
                "Booking was modified by another user. Please refresh and try again.",
              statusCode: 409,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }

      return NextResponse.json<
        ApiResponse<{ id: string; status: string; version: number }>
      >({
        success: true,
        data: {
          id: updatedBooking.id,
          status: updatedBooking.status,
          version: updatedBooking.version,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Handle reschedule
    if (isReschedule) {
      // Validate dates
      const newStartsAt = new Date(startsAt);
      const newEndsAt = new Date(endsAt);

      if (isNaN(newStartsAt.getTime()) || isNaN(newEndsAt.getTime())) {
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

      if (newEndsAt <= newStartsAt) {
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

      // Can only reschedule proposed or confirmed bookings
      if (!["proposed", "confirmed"].includes(booking.status)) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "INVALID_REQUEST",
              message: `Cannot reschedule a booking with status '${booking.status}'`,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Update booking times and set status back to proposed
      let updateQuery = supabase
        .from("booking")
        .update({
          starts_at: newStartsAt.toISOString(),
          ends_at: newEndsAt.toISOString(),
          status: "proposed",
          version: (booking.version || 1) + 1,
        })
        .eq("id", id)
        .is("deleted_at", null);

      if (version !== undefined) {
        updateQuery = updateQuery.eq("version", version);
      }

      const { data: updatedBooking, error: updateError } = await updateQuery
        .select("id, starts_at, ends_at, status, version")
        .single();

      if (updateError) {
        if (updateError.code === "PGRST116") {
          return NextResponse.json<ApiResponse<null>>(
            {
              success: false,
              error: {
                code: "CONFLICT",
                message:
                  "Booking was modified by another user. Please refresh and try again.",
                statusCode: 409,
              },
              timestamp: new Date().toISOString(),
            },
            { status: 409 }
          );
        }

        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "UPDATE_FAILED",
              message: updateError.message,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      if (!updatedBooking) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "CONFLICT",
              message:
                "Booking was modified by another user. Please refresh and try again.",
              statusCode: 409,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }

      return NextResponse.json<
        ApiResponse<{
          id: string;
          startsAt: string;
          endsAt: string;
          status: string;
          version: number;
        }>
      >({
        success: true,
        data: {
          id: updatedBooking.id,
          startsAt: updatedBooking.starts_at,
          endsAt: updatedBooking.ends_at,
          status: updatedBooking.status,
          version: updatedBooking.version,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Should never reach here
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected error processing request",
          statusCode: 500,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Update booking API error:", error);
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
