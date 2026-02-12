"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

/**
 * Send message input
 */
export interface SendMessageInput {
  conversationId: string;
  body: string;
  idempotencyKey?: string;
}

/**
 * Send message result
 */
export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mark messages as read result
 */
export interface MarkMessagesAsReadResult {
  success: boolean;
  count?: number;
  error?: string;
}

/**
 * Edit message result
 */
export interface EditMessageResult {
  success: boolean;
  error?: string;
}

/**
 * Send a message in a conversation
 * Verifies user is a participant (consumer_user_id or business member)
 */
export async function sendMessage(
  input: SendMessageInput
): Promise<SendMessageResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "You must be logged in to send messages" };
    }

    // Check idempotency
    if (input.idempotencyKey) {
      const { data: existing } = await supabase
        .from("message")
        .select("id")
        .eq("idempotency_key", input.idempotencyKey)
        .maybeSingle();

      if (existing) {
        return { success: true, messageId: existing.id };
      }
    }

    // Get conversation and verify user is a participant
    const { data: conversation, error: conversationError } = await supabase
      .from("conversation")
      .select("id, consumer_user_id, business_id")
      .eq("id", input.conversationId)
      .single();

    if (conversationError || !conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Check if user is the consumer
    const isConsumer = conversation.consumer_user_id === user.id;

    // Check if user is a business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: role } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("user_id", user.id)
        .eq("business_id", conversation.business_id)
        .eq("status", "active")
        .maybeSingle();

      isBusinessMember = !!role;
    }

    if (!isConsumer && !isBusinessMember) {
      return { success: false, error: "You are not a participant in this conversation" };
    }

    // Validate message body
    const trimmedBody = input.body.trim();
    if (!trimmedBody) {
      return { success: false, error: "Message cannot be empty" };
    }

    if (trimmedBody.length > 10000) {
      return { success: false, error: "Message is too long (max 10,000 characters)" };
    }

    // Insert the message
    const { data: message, error: insertError } = await supabase
      .from("message")
      .insert({
        conversation_id: input.conversationId,
        sender_user_id: user.id,
        body: trimmedBody,
        status: "sent",
        idempotency_key: input.idempotencyKey,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Message insert error:", insertError);
      return { success: false, error: "Failed to send message" };
    }

    // Update conversation.last_message_at
    const { error: updateError } = await supabase
      .from("conversation")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", input.conversationId);

    if (updateError) {
      console.error("Conversation update error:", updateError);
      // Don't fail the whole operation, message was sent
    }

    revalidatePath("/dashboard/messages");
    revalidatePath("/advisor/messages");
    revalidatePath(`/messages/${input.conversationId}`);

    return { success: true, messageId: message.id };
  } catch (error) {
    console.error("Send message error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Mark all messages in a conversation as read for the current user
 * Only marks messages sent by other users (not own messages)
 */
export async function markMessagesAsRead(
  conversationId: string
): Promise<MarkMessagesAsReadResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get conversation and verify user is a participant
    const { data: conversation, error: conversationError } = await supabase
      .from("conversation")
      .select("id, consumer_user_id, business_id")
      .eq("id", conversationId)
      .single();

    if (conversationError || !conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Check if user is the consumer
    const isConsumer = conversation.consumer_user_id === user.id;

    // Check if user is a business member
    let isBusinessMember = false;
    if (!isConsumer) {
      const { data: role } = await supabase
        .from("advisor_business_role")
        .select("id")
        .eq("user_id", user.id)
        .eq("business_id", conversation.business_id)
        .eq("status", "active")
        .maybeSingle();

      isBusinessMember = !!role;
    }

    if (!isConsumer && !isBusinessMember) {
      return { success: false, error: "You are not a participant in this conversation" };
    }

    // Get all unread messages where sender is NOT the current user
    // A message is unread if there's no read receipt for it from this user
    const { data: unreadMessages, error: fetchError } = await supabase
      .from("message")
      .select(`
        id,
        message_read_receipt!left(user_id)
      `)
      .eq("conversation_id", conversationId)
      .neq("sender_user_id", user.id);

    if (fetchError) {
      console.error("Fetch unread messages error:", fetchError);
      return { success: false, error: "Failed to fetch messages" };
    }

    // Filter to messages that don't have a read receipt from this user
    const messagesToMark = unreadMessages?.filter((msg) => {
      const receipts = msg.message_read_receipt as { user_id: string }[] | null;
      if (!receipts || receipts.length === 0) return true;
      return !receipts.some((r) => r.user_id === user.id);
    }) || [];

    if (messagesToMark.length === 0) {
      return { success: true, count: 0 };
    }

    // Insert read receipts
    const readReceipts = messagesToMark.map((msg) => ({
      message_id: msg.id,
      user_id: user.id,
      read_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("message_read_receipt")
      .upsert(readReceipts, {
        onConflict: "message_id,user_id",
        ignoreDuplicates: true,
      });

    if (insertError) {
      console.error("Insert read receipts error:", insertError);
      return { success: false, error: "Failed to mark messages as read" };
    }

    revalidatePath("/dashboard/messages");
    revalidatePath("/advisor/messages");
    revalidatePath(`/messages/${conversationId}`);

    return { success: true, count: messagesToMark.length };
  } catch (error) {
    console.error("Mark messages as read error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Edit own message
 * Only the original sender can edit their message
 */
export async function editMessage(
  messageId: string,
  body: string
): Promise<EditMessageResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get the message and verify ownership
    const { data: message, error: fetchError } = await supabase
      .from("message")
      .select("id, sender_user_id, conversation_id")
      .eq("id", messageId)
      .single();

    if (fetchError || !message) {
      return { success: false, error: "Message not found" };
    }

    // Verify the current user is the sender
    if (message.sender_user_id !== user.id) {
      return { success: false, error: "You can only edit your own messages" };
    }

    // Validate message body
    const trimmedBody = body.trim();
    if (!trimmedBody) {
      return { success: false, error: "Message cannot be empty" };
    }

    if (trimmedBody.length > 10000) {
      return { success: false, error: "Message is too long (max 10,000 characters)" };
    }

    // Update the message
    const { error: updateError } = await supabase
      .from("message")
      .update({
        body: trimmedBody,
        edited_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (updateError) {
      console.error("Message update error:", updateError);
      return { success: false, error: "Failed to edit message" };
    }

    revalidatePath("/dashboard/messages");
    revalidatePath("/advisor/messages");
    revalidatePath(`/messages/${message.conversation_id}`);

    return { success: true };
  } catch (error) {
    console.error("Edit message error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
