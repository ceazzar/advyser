import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Full lead detail
 */
export interface LeadDetail {
  id: string;
  consumer: {
    id: string;
    displayName: string;
    email?: string;
    phone?: string;
  };
  // Intake data
  problemSummary: string | null;
  goalTags: string[];
  timeline: string | null;
  budgetRange: string | null;
  preferredMeetingMode: string | null;
  preferredTimes: string | null;
  // Pipeline
  status: string;
  statusChangedAt: string | null;
  declineReason: string | null;
  // Timestamps
  createdAt: string;
  firstResponseAt: string | null;
  responseTimeMinutes: number | null;
  // Attribution
  listing: {
    id: string;
    headline: string | null;
    advisorName: string | null;
  } | null;
  // Related conversation (if exists)
  conversationId: string | null;
}

/**
 * GET /api/leads/[id]
 *
 * Get full details for a single lead.
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

    // Fetch lead (RLS will enforce access)
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
        business_id,
        consumer:consumer_user_id (
          id,
          display_name,
          email,
          phone
        ),
        listing:listing_id (
          id,
          headline,
          advisor_profile (
            display_name
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Lead not found or access denied",
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
      .select("id")
      .eq("lead_id", id)
      .maybeSingle();

    // Type assertions
    const consumer = lead.consumer as unknown as {
      id: string;
      display_name?: string;
      email?: string;
      phone?: string;
    } | null;

    const listing = lead.listing as unknown as {
      id: string;
      headline?: string;
      advisor_profile?: { display_name?: string } | null;
    } | null;

    // Only show contact info if lead is past "new" status
    const showContactInfo = lead.status !== "new";

    const detail: LeadDetail = {
      id: lead.id,
      consumer: {
        id: consumer?.id || "",
        displayName: consumer?.display_name || "Anonymous",
        ...(showContactInfo && consumer?.email ? { email: consumer.email } : {}),
        ...(showContactInfo && consumer?.phone ? { phone: consumer.phone } : {}),
      },
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
      listing: listing
        ? {
            id: listing.id,
            headline: listing.headline || null,
            advisorName: listing.advisor_profile?.display_name || null,
          }
        : null,
      conversationId: conversation?.id || null,
    };

    return NextResponse.json<ApiResponse<LeadDetail>>({
      success: true,
      data: detail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lead detail API error:", error);
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
 * PATCH /api/leads/[id]
 *
 * Update lead status (accept/decline).
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
    const { action, reason } = body;

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Action must be 'accept' or 'decline'",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (action === "accept") {
      // Use the database function for accept
      const { data: conversationId, error } = await supabase.rpc("accept_lead", {
        p_lead_id: id,
        p_user_id: user.id,
      });

      if (error) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "UPDATE_FAILED",
              message: error.message,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      return NextResponse.json<ApiResponse<{ conversationId: string }>>({
        success: true,
        data: { conversationId },
        timestamp: new Date().toISOString(),
      });
    } else {
      // Use the database function for decline
      const { error } = await supabase.rpc("decline_lead", {
        p_lead_id: id,
        p_user_id: user.id,
        p_reason: reason || null,
      });

      if (error) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "UPDATE_FAILED",
              message: error.message,
              statusCode: 400,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      return NextResponse.json<ApiResponse<{ declined: true }>>({
        success: true,
        data: { declined: true },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Update lead API error:", error);
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
