import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Dashboard stats for advisor view
 */
interface AdvisorDashboardStats {
  newLeads: number;
  activeClients: number;
  pendingBookings: number;
  responseRate: number;
  avgResponseTimeHours: number;
}

/**
 * Recent lead summary for dashboard
 */
interface RecentLead {
  id: string;
  consumerName: string;
  consumerAvatar: string | null;
  category: string | null;
  status: string;
  createdAt: string;
}

/**
 * Upcoming booking summary for dashboard
 */
interface UpcomingBooking {
  id: string;
  clientName: string;
  clientAvatar: string | null;
  startsAt: string;
  mode: string;
}

/**
 * Activity item for dashboard feed
 */
interface ActivityItem {
  type: string;
  description: string;
  timestamp: string;
}

/**
 * Full advisor dashboard response
 */
export interface AdvisorDashboardData {
  stats: AdvisorDashboardStats;
  recentLeads: RecentLead[];
  upcomingBookings: UpcomingBooking[];
  recentActivity: ActivityItem[];
}

/**
 * GET /api/dashboard/advisor
 *
 * Returns dashboard data for the authenticated advisor's business.
 *
 * Includes:
 * - Key stats (new leads, active clients, pending bookings, response metrics)
 * - Recent leads (top 5)
 * - Upcoming bookings (next 5)
 * - Recent activity feed
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

    // Get user's business ID (must be active member)
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

    const businessId = role.business_id;

    // Execute all queries in parallel for performance
    const [
      newLeadsResult,
      activeClientsResult,
      pendingBookingsResult,
      responseMetricsResult,
      recentLeadsResult,
      upcomingBookingsResult,
      recentMessagesResult,
    ] = await Promise.all([
      // Count new leads
      supabase
        .from("lead")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("status", "new")
        .is("deleted_at", null),

      // Count active clients (distinct consumers with contacted/booked status)
      supabase
        .from("lead")
        .select("consumer_user_id")
        .eq("business_id", businessId)
        .in("status", ["contacted", "booked"])
        .is("deleted_at", null),

      // Count pending bookings (proposed or confirmed, future)
      supabase
        .from("booking")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .in("status", ["proposed", "confirmed"])
        .gt("starts_at", new Date().toISOString())
        .is("deleted_at", null),

      // Get response metrics (leads older than 24 hours)
      supabase
        .from("lead")
        .select("first_response_at, response_time_minutes")
        .eq("business_id", businessId)
        .is("deleted_at", null)
        .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),

      // Get recent leads (top 5)
      supabase
        .from("lead")
        .select(
          `
          id,
          status,
          created_at,
          consumer:consumer_user_id (
            display_name,
            avatar_url
          ),
          listing:listing_id (
            advisor_type
          )
        `
        )
        .eq("business_id", businessId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),

      // Get upcoming bookings (next 5)
      supabase
        .from("booking")
        .select(
          `
          id,
          starts_at,
          mode,
          lead:lead_id (
            consumer:consumer_user_id (
              display_name,
              avatar_url
            )
          ),
          client:client_record_id (
            display_name
          )
        `
        )
        .eq("business_id", businessId)
        .in("status", ["proposed", "confirmed"])
        .gt("starts_at", new Date().toISOString())
        .is("deleted_at", null)
        .order("starts_at", { ascending: true })
        .limit(5),

      // Get recent messages for activity feed (filter by business via conversation)
      supabase
        .from("message")
        .select(
          `
          id,
          created_at,
          conversation:conversation_id!inner (
            business_id,
            consumer:consumer_user_id (
              display_name
            )
          )
        `
        )
        .eq("conversation.business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Calculate stats
    const newLeads = newLeadsResult.count || 0;

    // Count distinct consumers for active clients
    const activeClientsSet = new Set(
      (activeClientsResult.data || []).map((l) => l.consumer_user_id)
    );
    const activeClients = activeClientsSet.size;

    const pendingBookings = pendingBookingsResult.count || 0;

    // Calculate response rate and average response time
    const responseData = responseMetricsResult.data || [];
    const totalLeadsOlderThan24h = responseData.length;
    const leadsWithResponse = responseData.filter((l) => l.first_response_at !== null).length;
    const responseRate =
      totalLeadsOlderThan24h > 0
        ? Math.round((leadsWithResponse / totalLeadsOlderThan24h) * 100)
        : 0;

    const responseTimes = responseData
      .filter((l) => l.response_time_minutes !== null)
      .map((l) => l.response_time_minutes as number);
    const avgResponseTimeHours =
      responseTimes.length > 0
        ? Math.round(
            (responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length / 60) * 10
          ) / 10
        : 0;

    // Transform recent leads
    const recentLeads: RecentLead[] = (recentLeadsResult.data || []).map((lead) => {
      const consumer = lead.consumer as unknown as {
        display_name?: string;
        avatar_url?: string;
      } | null;
      const listing = lead.listing as unknown as { advisor_type?: string } | null;

      return {
        id: lead.id,
        consumerName: consumer?.display_name || "Anonymous",
        consumerAvatar: consumer?.avatar_url || null,
        category: listing?.advisor_type || null,
        status: lead.status,
        createdAt: lead.created_at,
      };
    });

    // Transform upcoming bookings
    const upcomingBookings: UpcomingBooking[] = (upcomingBookingsResult.data || []).map(
      (booking) => {
        const leadData = booking.lead as unknown as {
          consumer?: { display_name?: string; avatar_url?: string };
        } | null;
        const clientData = booking.client as unknown as { display_name?: string } | null;

        // Prefer client record name, fall back to lead consumer
        const clientName =
          clientData?.display_name || leadData?.consumer?.display_name || "Unknown";
        const clientAvatar = leadData?.consumer?.avatar_url || null;

        return {
          id: booking.id,
          clientName,
          clientAvatar,
          startsAt: booking.starts_at,
          mode: booking.mode,
        };
      }
    );

    // Build activity feed from various sources
    const recentActivity: ActivityItem[] = [];

    // Add new lead activities
    for (const lead of recentLeads.slice(0, 3)) {
      recentActivity.push({
        type: "lead_new",
        description: `New lead from ${lead.consumerName}`,
        timestamp: lead.createdAt,
      });
    }

    // Add message activities (already filtered by business_id in query)
    const businessMessages = recentMessagesResult.data || [];

    for (const msg of businessMessages.slice(0, 3)) {
      const conv = msg.conversation as unknown as {
        consumer?: { display_name?: string };
      } | null;
      recentActivity.push({
        type: "message_received",
        description: `New message from ${conv?.consumer?.display_name || "a client"}`,
        timestamp: msg.created_at,
      });
    }

    // Add upcoming booking activities
    for (const booking of upcomingBookings.slice(0, 2)) {
      recentActivity.push({
        type: "booking_upcoming",
        description: `Upcoming meeting with ${booking.clientName}`,
        timestamp: booking.startsAt,
      });
    }

    // Sort activity by timestamp (most recent first)
    recentActivity.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limit to 10 most recent activities
    const limitedActivity = recentActivity.slice(0, 10);

    const dashboardData: AdvisorDashboardData = {
      stats: {
        newLeads,
        activeClients,
        pendingBookings,
        responseRate,
        avgResponseTimeHours,
      },
      recentLeads,
      upcomingBookings,
      recentActivity: limitedActivity,
    };

    return NextResponse.json<ApiResponse<AdvisorDashboardData>>({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Advisor dashboard API error:", error);
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
