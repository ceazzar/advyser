import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Conversation summary for list view
 */
export interface ConversationSummary {
  id: string;
  subject: string | null;
  otherParty: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    body: string;
    createdAt: string;
    isFromMe: boolean;
  } | null;
  unreadCount: number;
  lastMessageAt: string | null;
  isArchived: boolean;
  createdAt: string;
}

/**
 * GET /api/conversations
 *
 * List conversations for the authenticated user.
 * Works for both consumers and advisors.
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 20, max: 50)
 * - archived: Filter by archived status (boolean)
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
    const archivedParam = searchParams.get("archived");

    // Check if user is an advisor (has active business role)
    const { data: businessRole } = await supabase
      .from("advisor_business_role")
      .select("business_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const isAdvisor = !!businessRole;
    const businessId = businessRole?.business_id;

    // Build base query for conversations
    // User can see conversations where they are the consumer OR where they belong to the business
    let query = supabase
      .from("conversation")
      .select(
        `
        id,
        subject,
        consumer_user_id,
        business_id,
        is_archived,
        last_message_at,
        created_at
      `,
        { count: "exact" }
      );

    // Filter: user is consumer OR user is member of the business
    if (isAdvisor && businessId) {
      // Advisor can see conversations for their business OR their own consumer conversations
      query = query.or(`consumer_user_id.eq.${user.id},business_id.eq.${businessId}`);
    } else {
      // Consumer can only see their own conversations
      query = query.eq("consumer_user_id", user.id);
    }

    // Filter by archived status if specified
    if (archivedParam !== null) {
      const isArchived = archivedParam === "true";
      query = query.eq("is_archived", isArchived);
    }

    // Order by most recent activity
    query = query.order("last_message_at", { ascending: false, nullsFirst: false });

    // Pagination
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data: conversations, error: convError, count } = await query;

    if (convError) {
      console.error("Conversations query error:", convError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch conversations",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    if (!conversations || conversations.length === 0) {
      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / pageSize);

      return NextResponse.json<ApiResponse<PaginatedResponse<ConversationSummary>>>({
        success: true,
        data: {
          items: [],
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
    }

    // Collect IDs for batch queries
    const conversationIds = conversations.map((c) => c.id);
    const consumerUserIds = [...new Set(conversations.map((c) => c.consumer_user_id))];
    const businessIds = [...new Set(conversations.map((c) => c.business_id))];

    // Batch fetch: consumer user profiles (for when user is advisor)
    const { data: consumerProfiles } = await supabase
      .from("users")
      .select("id, display_name, avatar_url")
      .in("id", consumerUserIds);

    // Batch fetch: business advisor profiles (for when user is consumer)
    // Get the primary advisor profile for each business
    const { data: advisorProfiles } = await supabase
      .from("advisor_profile")
      .select("business_id, display_name, avatar_url")
      .in("business_id", businessIds)
      .is("deleted_at", null);

    // Batch fetch: last message for each conversation
    // Using a subquery approach - get the most recent message per conversation
    const { data: lastMessages } = await supabase
      .from("message")
      .select("id, conversation_id, sender_user_id, body, created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false });

    // Group messages by conversation to find the last one
    const lastMessageByConversation = new Map<string, {
      id: string;
      conversation_id: string;
      sender_user_id: string;
      body: string;
      created_at: string;
    }>();

    if (lastMessages) {
      for (const msg of lastMessages) {
        if (!lastMessageByConversation.has(msg.conversation_id)) {
          lastMessageByConversation.set(msg.conversation_id, msg);
        }
      }
    }

    // Get all message IDs for unread count calculation
    const allMessageIds = lastMessages?.map((m) => m.id) || [];

    // Batch fetch: read receipts for current user
    const { data: readReceipts } = allMessageIds.length > 0
      ? await supabase
          .from("message_read_receipt")
          .select("message_id")
          .eq("user_id", user.id)
          .in("message_id", allMessageIds)
      : { data: [] };

    const readMessageIds = new Set(readReceipts?.map((r) => r.message_id) || []);

    // Calculate unread counts per conversation
    // Unread = messages where sender != current user AND no read receipt exists
    const unreadCountByConversation = new Map<string, number>();

    if (lastMessages) {
      for (const msg of lastMessages) {
        if (msg.sender_user_id !== user.id && !readMessageIds.has(msg.id)) {
          const current = unreadCountByConversation.get(msg.conversation_id) || 0;
          unreadCountByConversation.set(msg.conversation_id, current + 1);
        }
      }
    }

    // Create lookup maps
    const consumerProfileMap = new Map(
      consumerProfiles?.map((p) => [p.id, p]) || []
    );

    const advisorProfileMap = new Map(
      advisorProfiles?.map((p) => [p.business_id, p]) || []
    );

    // Transform to API response
    const items: ConversationSummary[] = conversations.map((conv) => {
      // Determine if user is the consumer in this conversation
      const isUserConsumer = conv.consumer_user_id === user.id;

      // Get other party info
      let otherParty: ConversationSummary["otherParty"];

      if (isUserConsumer) {
        // User is consumer, other party is the business/advisor
        const advisorProfile = advisorProfileMap.get(conv.business_id);
        otherParty = {
          id: conv.business_id,
          displayName: advisorProfile?.display_name || "Advisor",
          avatarUrl: advisorProfile?.avatar_url || null,
        };
      } else {
        // User is advisor, other party is the consumer
        const consumerProfile = consumerProfileMap.get(conv.consumer_user_id);
        otherParty = {
          id: conv.consumer_user_id,
          displayName: consumerProfile?.display_name || "Consumer",
          avatarUrl: consumerProfile?.avatar_url || null,
        };
      }

      // Get last message
      const lastMsg = lastMessageByConversation.get(conv.id);
      const lastMessage = lastMsg
        ? {
            body: lastMsg.body,
            createdAt: lastMsg.created_at,
            isFromMe: lastMsg.sender_user_id === user.id,
          }
        : null;

      // Get unread count
      const unreadCount = unreadCountByConversation.get(conv.id) || 0;

      return {
        id: conv.id,
        subject: conv.subject,
        otherParty,
        lastMessage,
        unreadCount,
        lastMessageAt: conv.last_message_at,
        isArchived: conv.is_archived,
        createdAt: conv.created_at,
      };
    });

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<ConversationSummary>>>({
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
    console.error("Conversations API error:", error);
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
