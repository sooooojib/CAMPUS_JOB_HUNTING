import { NextRequest, NextResponse } from "next/server";
import { processScheduledDeadlineReminders } from "@/lib/services/reminder";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/permissions";

/**
 * Scheduled Cron Endpoint: Deadline & Career Reminders
 * 
 * Invocation:
 * - Vercel Cron / GitHub Actions / Linux Crontab:
 *   GET /api/cron/reminders
 *   Headers: { "Authorization": "Bearer <CRON_SECRET>" }
 * - Platform Admin manual trigger: Authenticated admin session.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isCronAuthorized =
      cronSecret && authHeader === `Bearer ${cronSecret}`;

    // Also allow authenticated platform admin to manually trigger
    let isAdminAuthorized = false;
    if (!isCronAuthorized) {
      const session = await auth.api.getSession({ headers: request.headers });
      isAdminAuthorized = isPlatformAdmin(session?.user);
    }

    // In local dev, allow trigger if no secret configured
    const isDev = process.env.NODE_ENV !== "production";

    if (!isCronAuthorized && !isAdminAuthorized && !isDev) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Valid cron token or admin clearance required." } },
        { status: 401 }
      );
    }

    const summary = await processScheduledDeadlineReminders();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (error: any) {
    console.error("[Cron Reminders Error]:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed processing deadline reminders." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
