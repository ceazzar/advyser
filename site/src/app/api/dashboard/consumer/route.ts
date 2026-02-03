import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Consumer dashboard stats
 */
export interface ConsumerDashboardStats {
  activeRequests: number;
  unreadMessages: number;
  upcomingBookings: number;
  totalAdvisorsContacted: number;
}

/**
 * Recent activity item
 */
export interface RecentActivityItem {
  type: "message_received" | "booking_proposed" | "request_accepted" | "request_declined";
  title: string;
  description: string;
  timestamp: string;
  entityType: string;
  entityId: string;
}

/**
 * Pending request summary
 */
export interface PendingRequestSummary {
  id: string;
  advisorName: string;
  advisorAvatar: string | null;
  specialty: string | null;
  status: string;
  sentAt: string;
}

/**
 * Consumer dashboard response
 */
export interface ConsumerDashboardData {
  stats: ConsumerDashboardStats;
  recentActivity: RecentActivityItem[];
  pendingRequests: PendingRequestSummary[];
}

/**
 * GET /api/dashboard/consumer
 *
 * Get consumer dashboard data including stats, recent activity, and pending requests.
 */
export async function GET() {
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

    // =========================================================================
    // STATS
    // =========================================================================

    // 1. Count active requests (leads with status not in declined, converted)
    const { count: activeRequests } = await supabase
      .from("lead")
      .select("id", { count: "exact", head: true })
      .eq("consumer_user_id", user.id)
      .not("status", "in", '("declined","converted")');

    // 2. Count unread messages
    // Get all conversations for this consumer
    const { data: conversations } = await supabase
      .from("conversation")
      .select("id")
      .eq("consumer_user_id", user.id);

    let unreadMessages = 0;
    if (conversations && conversations.length > 0) {
      const conversationIds = conversations.map((c) => c.id);

      // Get messages in these conversations NOT sent by current user
      const { data: messagesWithReceipts } = await supabase
        .from("message")
        .select(
          `
          id,
          message_read_receipt!left (
            user_id
          )
        `
        )
        .in("conversation_id", conversationIds)
        .neq("sender_user_id", user.id);

      // Count messages without read receipt from current user
      if (messagesWithReceipts) {
        unreadMessages = messagesWithReceipts.filter((msg) => {
          const receipts = msg.message_read_receipt as unknown as
            | { user_id: string }[]
            | null;
          if (!receipts || receipts.length === 0) return true;
          return !receipts.some((r) => r.user_id === user.id);
        }).length;
      }
    }

    // 3. Count upcoming bookings (via leads)
    // First get all leads for this consumer
    const { data: consumerLeads } = await supabase
      .from("lead")
      .select("id")
      .eq("consumer_user_id", user.id);

    let upcomingBookings = 0;
    if (consumerLeads && consumerLeads.length > 0) {
      const leadIds = consumerLeads.map((l) => l.id);

      const { count } = await supabase
        .from("booking")
        .select("id", { count: "exact", head: true })
        .in("lead_id", leadIds)
        .eq("status", "confirmed")
        .gt("starts_at", new Date().toISOString())
        .is("deleted_at", null);

      upcomingBookings = count || 0;
    }

    // 4. Count distinct advisors contacted
    const { data: distinctAdvisors } = await supabase
      .from("lead")
      .select("business_id")
      .eq("consumer_user_id", user.id);

    const uniqueBusinessIds = new Set(distinctAdvisors?.map((l) => l.business_id) || []);
    const totalAdvisorsContacted = uniqueBusinessIds.size;

    const stats: ConsumerDashboardStats = {
      activeRequests: activeRequests || 0,
      unreadMessages,
      upcomingBookings,
      totalAdvisorsContacted,
    };

    // =========================================================================
    // RECENT ACTIVITY (last 10 items)
    // =========================================================================

    const recentActivity: RecentActivityItem[] = [];

    // Get lead IDs for this consumer for filtering bookings
    const leadIdsForActivity = consumerLeads?.map((l) => l.id) || [];

    // Fetch recent messages (received, not sent by user)
    if (conversations && conversations.length > 0) {
      const conversationIds = conversations.map((c) => c.id);

      const { data: recentMessages } = await supabase
        .from("message")
        .select(
          `
          id,
          body,
          created_at,
          conversation_id,
          sender:sender_user_id (
            display_name
          )
        `
        )
        .in("conversation_id", conversationIds)
        .neq("sender_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentMessages) {
        for (const msg of recentMessages) {
          const sender = msg.sender as unknown as { display_name?: string } | null;
          recentActivity.push({
            type: "message_received",
            title: "New message",
            description: `${sender?.display_name || "Advisor"}: ${
              msg.body?.substring(0, 100) || ""
            }${msg.body && msg.body.length > 100 ? "..." : ""}`,
            timestamp: msg.created_at,
            entityType: "conversation",
            entityId: msg.conversation_id,
          });
        }
      }
    }

    // Fetch recent bookings proposed to consumer
    if (leadIdsForActivity.length > 0) {
      const { data: recentBookings } = await supabase
        .from("booking")
        .select(
          `
          id,
          status,
          starts_at,
          created_at,
          lead_id,
          business:business_id (
            trading_name
          )
        `
        )
        .in("lead_id", leadIdsForActivity)
        .eq("status", "proposed")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentBookings) {
        for (const booking of recentBookings) {
          const business = booking.business as unknown as { trading_name?: string } | null;
          const startsAt = new Date(booking.starts_at);
          recentActivity.push({
            type: "booking_proposed",
            title: "Booking proposed",
            description: `${business?.trading_name || "Advisor"} proposed a meeting on ${startsAt.toLocaleDateString()}`,
            timestamp: booking.created_at,
            entityType: "booking",
            entityId: booking.id,
          });
        }
      }
    }

    // Fetch recent lead status changes (accepted/declined)
    const { data: recentLeadChanges } = await supabase
      .from("lead")
      .select(
        `
        id,
        status,
        status_changed_at,
        created_at,
        business:business_id (
          trading_name
        ),
        listing:listing_id (
          headline
        )
      `
      )
      .eq("consumer_user_id", user.id)
      .in("status", ["contacted", "declined"])
      .order("status_changed_at", { ascending: false })
      .limit(10);

    if (recentLeadChanges) {
      for (const lead of recentLeadChanges) {
        const business = lead.business as unknown as { trading_name?: string } | null;
        const listing = lead.listing as unknown as { headline?: string } | null;
        const advisorName = business?.trading_name || listing?.headline || "Advisor";

        if (lead.status === "contacted") {
          recentActivity.push({
            type: "request_accepted",
            title: "Request accepted",
            description: `${advisorName} accepted your request`,
            timestamp: lead.status_changed_at || lead.created_at,
            entityType: "lead",
            entityId: lead.id,
          });
        } else if (lead.status === "declined") {
          recentActivity.push({
            type: "request_declined",
            title: "Request declined",
            description: `${advisorName} declined your request`,
            timestamp: lead.status_changed_at || lead.created_at,
            entityType: "lead",
            entityId: lead.id,
          });
        }
      }
    }

    // Sort all activity by timestamp descending and take top 10
    recentActivity.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const topActivity = recentActivity.slice(0, 10);

    // =========================================================================
    // PENDING REQUESTS (leads with status = 'new', limit 5)
    // =========================================================================

    const { data: pendingLeads } = await supabase
      .from("lead")
      .select(
        `
        id,
        status,
        created_at,
        business:business_id (
          trading_name
        ),
        listing:listing_id (
          headline,
          advisor_profile:advisor_profile_id (
            display_name,
            avatar_url
          ),
          listing_specialty (
            specialty:specialty_id (
              name
            )
          )
        )
      `
      )
      .eq("consumer_user_id", user.id)
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5);

    const pendingRequests: PendingRequestSummary[] = (pendingLeads || []).map((lead) => {
      const business = lead.business as unknown as { trading_name?: string } | null;
      const listing = lead.listing as unknown as {
        headline?: string;
        advisor_profile?: {
          display_name?: string;
          avatar_url?: string;
        } | null;
        listing_specialty?: Array<{
          specialty?: { name?: string } | null;
        }>;
      } | null;

      // Get advisor name: prefer profile display_name, then business trading_name, then listing headline
      const advisorName =
        listing?.advisor_profile?.display_name ||
        business?.trading_name ||
        listing?.headline ||
        "Advisor";

      // Get advisor avatar from profile
      const advisorAvatar = listing?.advisor_profile?.avatar_url || null;

      // Get first specialty
      const specialty =
        listing?.listing_specialty?.[0]?.specialty?.name || null;

      return {
        id: lead.id,
        advisorName,
        advisorAvatar,
        specialty,
        status: lead.status,
        sentAt: lead.created_at,
      };
    });

    const dashboardData: ConsumerDashboardData = {
      stats,
      recentActivity: topActivity,
      pendingRequests,
    };

    return NextResponse.json<ApiResponse<ConsumerDashboardData>>({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Consumer dashboard API error:", error);
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
