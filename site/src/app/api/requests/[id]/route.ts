import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Full request detail (consumer's view of a single lead)
 */
export interface RequestDetail {
  id: string;
  // Advisor info
  advisor: {
    id: string;
    name: string;
    headline: string | null;
    bio: string | null;
    avatar: string | null;
    businessName: string | null;
    email: string | null;
    phone: string | null;
    // Only shown after advisor accepts
  };
  // Listing details
  listing: {
    id: string;
    headline: string | null;
    advisorType: string;
    serviceMode: string;
    verified: boolean;
  } | null;
  // Request details (what consumer submitted)
  problemSummary: string | null;
  goalTags: string[];
  timeline: string | null;
  budgetRange: string | null;
  preferredMeetingMode: string | null;
  preferredTimes: string | null;
  // Status
  status: string;
  statusChangedAt: string | null;
  declineReason: string | null;
  // Timestamps
  createdAt: string;
  firstResponseAt: string | null;
  responseTimeMinutes: number | null;
  // Related conversation (if accepted)
  conversation: {
    id: string;
    lastMessageAt: string | null;
    messageCount: number;
  } | null;
}

/**
 * GET /api/requests/[id]
 *
 * Get full details for a single request (consumer's view).
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

    // Fetch the lead - consumer must own it
    const { data: lead, error } = await supabase
      .from("lead")
      .select(
        `
        id,
        problem_summary,
        goal_tags,
        timeline,
        budget_range,
        preferred_meeting_mode,
        preferred_times,
        status,
        status_changed_at,
        decline_reason,
        created_at,
        first_response_at,
        response_time_minutes,
        listing:listing_id (
          id,
          headline,
          bio,
          advisor_type,
          service_mode,
          verification_level,
          advisor_profile (
            id,
            display_name,
            avatar_url
          ),
          business (
            trading_name,
            email,
            phone
          )
        )
      `
      )
      .eq("id", id)
      .eq("consumer_user_id", user.id)
      .single();

    if (error || !lead) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Request not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Check if there's a conversation for this lead
    const { data: conversation } = await supabase
      .from("conversation")
      .select("id, last_message_at")
      .eq("lead_id", id)
      .maybeSingle();

    // If there's a conversation, count messages
    let messageCount = 0;
    if (conversation) {
      const { count } = await supabase
        .from("message")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", conversation.id);
      messageCount = count || 0;
    }

    // Type assertions for nested data
    const listing = lead.listing as unknown as {
      id: string;
      headline?: string;
      bio?: string;
      advisor_type?: string;
      service_mode?: string;
      verification_level?: string;
      advisor_profile?: {
        id: string;
        display_name?: string;
        avatar_url?: string;
      } | null;
      business?: {
        trading_name?: string;
        email?: string;
        phone?: string;
      } | null;
    } | null;

    // Only show contact info if advisor has accepted (not declined or still pending)
    const showContactInfo = ["contacted", "booked", "converted"].includes(lead.status);

    const detail: RequestDetail = {
      id: lead.id,
      advisor: {
        id: listing?.advisor_profile?.id || "",
        name: listing?.advisor_profile?.display_name || "Unknown Advisor",
        headline: listing?.headline || null,
        bio: listing?.bio || null,
        avatar: listing?.advisor_profile?.avatar_url || null,
        businessName: listing?.business?.trading_name || null,
        // Only reveal contact info after advisor responds
        email: showContactInfo ? listing?.business?.email || null : null,
        phone: showContactInfo ? listing?.business?.phone || null : null,
      },
      listing: listing
        ? {
            id: listing.id,
            headline: listing.headline || null,
            advisorType: listing.advisor_type || "unknown",
            serviceMode: listing.service_mode || "unknown",
            verified: ["licence_verified", "identity_verified"].includes(
              listing.verification_level || ""
            ),
          }
        : null,
      problemSummary: lead.problem_summary,
      goalTags: lead.goal_tags || [],
      timeline: lead.timeline,
      budgetRange: lead.budget_range,
      preferredMeetingMode: lead.preferred_meeting_mode,
      preferredTimes: lead.preferred_times,
      status: lead.status,
      statusChangedAt: lead.status_changed_at,
      declineReason: lead.decline_reason,
      createdAt: lead.created_at,
      firstResponseAt: lead.first_response_at,
      responseTimeMinutes: lead.response_time_minutes,
      conversation: conversation
        ? {
            id: conversation.id,
            lastMessageAt: conversation.last_message_at,
            messageCount,
          }
        : null,
    };

    return NextResponse.json<ApiResponse<RequestDetail>>({
      success: true,
      data: detail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Request detail API error:", error);
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
 * DELETE /api/requests/[id]
 *
 * Cancel/withdraw a request (only if status is 'new')
 */
export async function DELETE(
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

    // Fetch the lead to verify ownership and status
    const { data: lead, error: fetchError } = await supabase
      .from("lead")
      .select("id, status")
      .eq("id", id)
      .eq("consumer_user_id", user.id)
      .single();

    if (fetchError || !lead) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Request not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Can only cancel if status is 'new' (not yet responded to)
    if (lead.status !== "new") {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_STATE",
            message: "Cannot cancel a request that has already been responded to",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Soft delete by setting status to 'cancelled' (or hard delete)
    // For now, we'll hard delete since the consumer owns the data
    const { error: deleteError } = await supabase
      .from("lead")
      .delete()
      .eq("id", id)
      .eq("consumer_user_id", user.id)
      .eq("status", "new"); // Extra safety check

    if (deleteError) {
      console.error("Delete request error:", deleteError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DELETE_FAILED",
            message: "Failed to cancel request",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ cancelled: true }>>({
      success: true,
      data: { cancelled: true },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cancel request API error:", error);
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
