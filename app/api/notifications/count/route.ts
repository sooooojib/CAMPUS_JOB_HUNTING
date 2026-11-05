import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/services/notification";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, unreadCount: 0 },
        { status: 401 }
      );
    }

    const unreadCount = await getUnreadNotificationCount(session.user.id);

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, unreadCount: 0, error: error.message },
      { status: 500 }
    );
  }
}
