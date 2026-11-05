import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  markNotificationAsRead,
  deleteNotification,
} from "@/lib/services/notification";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const updated = await markNotificationAsRead(session.user.id, id);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    const status = error.message.includes("FORBIDDEN") ? 403 : error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await deleteNotification(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: "Notification dismissed.",
    });
  } catch (error: any) {
    const status = error.message.includes("FORBIDDEN") ? 403 : error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status }
    );
  }
}

