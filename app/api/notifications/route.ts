import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from "@/lib/services/notification";
import { notificationQuerySchema } from "@/lib/validations/notification";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Please sign in." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = notificationQuerySchema.parse({
      unreadOnly: searchParams.get("unreadOnly") || undefined,
      type: searchParams.get("type") || undefined,
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
    });

    const data = await getUserNotifications(session.user.id, query);

    return NextResponse.json({
      success: true,
      data: data.items,
      unreadCount: data.unreadCount,
      pagination: data.pagination,
    });
  } catch (error: any) {
    console.error("Error retrieving notifications:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve notifications." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Please sign in." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "markAllRead") {
      const result = await markAllNotificationsAsRead(session.user.id);
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read.",
        count: result.count,
      });
    }

    return NextResponse.json(
      { success: false, error: { message: "Unknown action parameter." } },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to update notifications." } },
      { status: 500 }
    );
  }
}
