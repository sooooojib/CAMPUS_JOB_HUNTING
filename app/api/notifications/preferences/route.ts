import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
} from "@/lib/services/notification";
import { updateNotificationPreferencesSchema } from "@/lib/validations/notification";

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

    const preferences = await getUserNotificationPreferences(session.user.id);

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve preferences." } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const input = updateNotificationPreferencesSchema.parse(body);

    const updated = await updateUserNotificationPreferences(session.user.id, input);

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to update preferences." } },
      { status: 400 }
    );
  }
}

