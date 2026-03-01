import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit, messageRatelimit, rateLimitHeaders } from "@/lib/ratelimit";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Message item for conversation view
 */
export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  isFromMe: boolean;
  body: string;
  status: string; // sent, delivered, failed
  editedAt: string | null;
  createdAt: string;
  readBy: { userId: string; readAt: string }[];
}

/**
 * GET /api/conversations/[id]/messages
 *
 * Get paginated messages for a conversation.
 * Also marks unread messages as read for the current user.
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 50, max: 100)
 * - before: Timestamp for cursor-based pagination of older messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
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

    // Verify user has access to conversation (is participant)
    const { data: conversation, error: convError } = await supabase
      .from("conversation")
      .select("id, consumer_user_id, business_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
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

    // Check if user is the consumer
    const isConsumer = conversation.consumer_user_id === user.id;

    // Check if user is part of the business (advisor)
    let isAdvisor = false;
    if (!isConsumer) {
      const { data: role } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("user_id", user.id)
        .eq("business_id", conversation.business_id)
        .eq("status", "active")
        .maybeSingle();

      isAdvisor = !!role;
    }

    if (!isConsumer && !isAdvisor) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have access to this conversation",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "50", 10)));
    const before = searchParams.get("before");

    // Build query for messages
    let query = supabase
      .from("message")
      .select(
        `
        id,
        sender_user_id,
        body,
        status,
        edited_at,
        created_at,
        sender:sender_user_id (
          id,
          display_name,
          avatar_url
        )
      `,
        { count: "exact" }
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });

    // Cursor-based pagination for older messages
    if (before) {
      query = query.lt("created_at", before);
    }

    // Offset pagination
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data: messages, error: messagesError, count } = await query;

    if (messagesError) {
      console.error("Messages query error:", messagesError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch messages",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Get message IDs for fetching read receipts
    const messageIds = (messages || []).map((m) => m.id);

    // Fetch read receipts for all messages in batch
    let readReceiptsMap: Record<string, { userId: string; readAt: string }[]> = {};
    if (messageIds.length > 0) {
      const { data: receipts } = await supabase
        .from("message_read_receipt")
        .select("message_id, user_id, read_at")
        .in("message_id", messageIds);

      if (receipts) {
        readReceiptsMap = receipts.reduce(
          (acc, receipt) => {
            if (!acc[receipt.message_id]) {
              acc[receipt.message_id] = [];
            }
            acc[receipt.message_id].push({
              userId: receipt.user_id,
              readAt: receipt.read_at,
            });
            return acc;
          },
          {} as Record<string, { userId: string; readAt: string }[]>
        );
      }
    }

    // Mark unread messages as read for current user
    // Find messages not sent by current user and not already read
    const unreadMessageIds = (messages || [])
      .filter((m) => {
        const isFromMe = m.sender_user_id === user.id;
        const alreadyRead = readReceiptsMap[m.id]?.some((r) => r.userId === user.id);
        return !isFromMe && !alreadyRead;
      })
      .map((m) => m.id);

    if (unreadMessageIds.length > 0) {
      // Insert read receipts for unread messages
      const receiptsToInsert = unreadMessageIds.map((messageId) => ({
        message_id: messageId,
        user_id: user.id,
        read_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("message_read_receipt")
        .upsert(receiptsToInsert, { onConflict: "message_id,user_id" });

      if (insertError) {
        console.error("Failed to mark messages as read:", insertError);
        // Continue anyway - this is not a critical error
      }

      // Update the readReceiptsMap with newly inserted receipts
      const now = new Date().toISOString();
      unreadMessageIds.forEach((messageId) => {
        if (!readReceiptsMap[messageId]) {
          readReceiptsMap[messageId] = [];
        }
        readReceiptsMap[messageId].push({
          userId: user.id,
          readAt: now,
        });
      });
    }

    // Transform to API response
    const items: MessageItem[] = (messages || []).map((message) => {
      const sender = message.sender as unknown as {
        id: string;
        display_name?: string;
        avatar_url?: string;
      } | null;

      return {
        id: message.id,
        senderId: message.sender_user_id,
        senderName: sender?.display_name || "Unknown",
        senderAvatar: sender?.avatar_url || null,
        isFromMe: message.sender_user_id === user.id,
        body: message.body,
        status: message.status,
        editedAt: message.edited_at,
        createdAt: message.created_at,
        readBy: readReceiptsMap[message.id] || [],
      };
    });

    // Reverse to show oldest first in the response (client can reverse if needed)
    items.reverse();

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<MessageItem>>>({
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
    console.error("Messages API error:", error);
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
 * POST /api/conversations/[id]/messages
 *
 * Send a new message to a conversation.
 *
 * Request Body:
 * - body: string (required) - The message content
 * - idempotencyKey: string (optional) - Key to prevent duplicate messages
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
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

    // Rate limit by user ID
    const rateLimitResult = await checkRateLimit(messageRatelimit, user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "You are sending messages too quickly. Please slow down.",
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

    // Verify user has access to conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversation")
      .select("id, consumer_user_id, business_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
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

    // Check if user is the consumer
    const isConsumer = conversation.consumer_user_id === user.id;

    // Check if user is part of the business (advisor)
    let isAdvisor = false;
    if (!isConsumer) {
      const { data: role } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("user_id", user.id)
        .eq("business_id", conversation.business_id)
        .eq("status", "active")
        .maybeSingle();

      isAdvisor = !!role;
    }

    if (!isConsumer && !isAdvisor) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have access to this conversation",
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { body: messageBody, idempotencyKey } = body;

    // Validate message body
    if (!messageBody || typeof messageBody !== "string" || messageBody.trim().length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Message body is required",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check for message length limits
    const trimmedBody = messageBody.trim();
    if (trimmedBody.length > 10000) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Message is too long (max 10,000 characters)",
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check idempotency key for duplicate message
    if (idempotencyKey) {
      const { data: existing } = await supabase
        .from("message")
        .select("id, body, status, created_at")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (existing) {
        // Return the existing message
        const { data: sender } = await supabase
          .from("users")
          .select("id, display_name, avatar_url")
          .eq("id", user.id)
          .single();

        const existingMessage: MessageItem = {
          id: existing.id,
          senderId: user.id,
          senderName: sender?.display_name || "Unknown",
          senderAvatar: sender?.avatar_url || null,
          isFromMe: true,
          body: existing.body,
          status: existing.status,
          editedAt: null,
          createdAt: existing.created_at,
          readBy: [],
        };

        return NextResponse.json<ApiResponse<MessageItem>>({
          success: true,
          data: existingMessage,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Insert the new message
    const insertData: {
      conversation_id: string;
      sender_user_id: string;
      body: string;
      status: string;
      idempotency_key?: string;
    } = {
      conversation_id: conversationId,
      sender_user_id: user.id,
      body: trimmedBody,
      status: "sent",
    };

    if (idempotencyKey) {
      insertData.idempotency_key = idempotencyKey;
    }

    const { data: message, error: insertError } = await supabase
      .from("message")
      .insert(insertData)
      .select("id, body, status, created_at")
      .single();

    if (insertError) {
      console.error("Message insert error:", insertError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to send message",
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Update conversation.last_message_at
    const { error: updateError } = await supabase
      .from("conversation")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateError) {
      console.error("Failed to update conversation last_message_at:", updateError);
      // Continue anyway - message was sent
    }

    // Get sender info for response
    const { data: sender } = await supabase
      .from("users")
      .select("id, display_name, avatar_url")
      .eq("id", user.id)
      .single();

    const newMessage: MessageItem = {
      id: message.id,
      senderId: user.id,
      senderName: sender?.display_name || "Unknown",
      senderAvatar: sender?.avatar_url || null,
      isFromMe: true,
      body: message.body,
      status: message.status,
      editedAt: null,
      createdAt: message.created_at,
      readBy: [],
    };

    return NextResponse.json<ApiResponse<MessageItem>>(
      {
        success: true,
        data: newMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send message API error:", error);
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
