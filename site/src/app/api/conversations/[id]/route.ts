import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Conversation detail response type
 */
export interface ConversationDetail {
  id: string;
  subject: string | null;
  otherParty: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    businessName: string | null; // only if other party is advisor
  };
  lead: {
    id: string;
    problemSummary: string | null;
    goalTags: string[];
    status: string;
  } | null;
  messageCount: number;
  unreadCount: number;
  lastMessageAt: string | null;
  isArchived: boolean;
  createdAt: string;
}

/**
 * GET /api/conversations/[id]
 *
 * Get details for a single conversation.
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

    // Fetch conversation with related data
    const { data: conversation, error } = await supabase
      .from("conversation")
      .select(
        `
        id,
        subject,
        consumer_user_id,
        business_id,
        lead_id,
        is_archived,
        last_message_at,
        created_at,
        business:business_id (
          id,
          trading_name
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !conversation) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Conversation not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Determine user's role in conversation
    const isConsumer = conversation.consumer_user_id === user.id;

    // If not consumer, check if user is an active business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: membership } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("business_id", conversation.business_id)
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
            message: "Access denied to this conversation",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Type assertion for business
    const business = conversation.business as unknown as {
      id: string;
      trading_name?: string;
    } | null;

    // Fetch other party info based on role
    let otherParty: ConversationDetail["otherParty"];

    if (isConsumer) {
      // Consumer viewing: fetch advisor/business info
      // Try to get the advisor profile for this business
      const { data: advisorProfile } = await supabase
        .from("advisor_profile")
        .select("id, user_id, display_name, avatar_url")
        .eq("business_id", conversation.business_id)
        .maybeSingle();

      if (advisorProfile) {
        otherParty = {
          id: advisorProfile.user_id,
          displayName: advisorProfile.display_name || "Advisor",
          avatarUrl: advisorProfile.avatar_url,
          businessName: business?.trading_name || null,
        };
      } else {
        // Fallback to business info only
        otherParty = {
          id: conversation.business_id,
          displayName: business?.trading_name || "Business",
          avatarUrl: null,
          businessName: business?.trading_name || null,
        };
      }
    } else {
      // Business/advisor viewing: fetch consumer info
      const { data: consumerProfile } = await supabase
        .from("users")
        .select("id, display_name, avatar_url")
        .eq("id", conversation.consumer_user_id)
        .single();

      otherParty = {
        id: conversation.consumer_user_id,
        displayName: consumerProfile?.display_name || "Consumer",
        avatarUrl: consumerProfile?.avatar_url || null,
        businessName: null, // Consumer doesn't have a business name
      };
    }

    // Fetch lead details if lead_id exists
    let lead: ConversationDetail["lead"] = null;
    if (conversation.lead_id) {
      const { data: leadData } = await supabase
        .from("lead")
        .select("id, problem_summary, goal_tags, status")
        .eq("id", conversation.lead_id)
        .single();

      if (leadData) {
        lead = {
          id: leadData.id,
          problemSummary: leadData.problem_summary,
          goalTags: leadData.goal_tags || [],
          status: leadData.status,
        };
      }
    }

    // Count total messages
    const { count: messageCount } = await supabase
      .from("message")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", id);

    // Count unread messages (messages not sent by current user without read receipt)
    const { data: unreadMessages } = await supabase
      .from("message")
      .select(
        `
        id,
        message_read_receipt!left (
          user_id
        )
      `
      )
      .eq("conversation_id", id)
      .neq("sender_user_id", user.id);

    // Filter to messages without a read receipt for current user
    const unreadCount =
      unreadMessages?.filter((msg) => {
        const receipts = msg.message_read_receipt as unknown as
          | { user_id: string }[]
          | null;
        if (!receipts || receipts.length === 0) return true;
        return !receipts.some((r) => r.user_id === user.id);
      }).length || 0;

    const detail: ConversationDetail = {
      id: conversation.id,
      subject: conversation.subject,
      otherParty,
      lead,
      messageCount: messageCount || 0,
      unreadCount,
      lastMessageAt: conversation.last_message_at,
      isArchived: conversation.is_archived || false,
      createdAt: conversation.created_at,
    };

    return NextResponse.json<ApiResponse<ConversationDetail>>({
      success: true,
      data: detail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Conversation detail API error:", error);
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
 * PATCH /api/conversations/[id]
 *
 * Archive or unarchive a conversation.
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

    // Parse request body
    const body = await request.json();
    const { isArchived } = body;

    if (typeof isArchived !== "boolean") {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "isArchived must be a boolean",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Fetch conversation to verify access
    const { data: conversation, error: fetchError } = await supabase
      .from("conversation")
      .select("id, consumer_user_id, business_id")
      .eq("id", id)
      .single();

    if (fetchError || !conversation) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Conversation not found",
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Determine user's role in conversation
    const isConsumer = conversation.consumer_user_id === user.id;

    // If not consumer, check if user is an active business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: membership } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("business_id", conversation.business_id)
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
            message: "Access denied to this conversation",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Update conversation
    const { error: updateError } = await supabase
      .from("conversation")
      .update({ is_archived: isArchived })
      .eq("id", id);

    if (updateError) {
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

    return NextResponse.json<ApiResponse<{ isArchived: boolean }>>({
      success: true,
      data: { isArchived },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Update conversation API error:", error);
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
