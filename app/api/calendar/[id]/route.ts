import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/services/calendar";
import { updateCalendarEventSchema } from "@/lib/validations/calendar";

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
    const body = await request.json();
    const input = updateCalendarEventSchema.parse(body);

    const updated = await updateCalendarEvent(session.user.id, id, input);

    return NextResponse.json({
      success: true,
      message: "Calendar event updated.",
      data: updated,
    });
  } catch (error: any) {
    const status = error.message.includes("FORBIDDEN") ? 403 : error.message.includes("not found") ? 404 : 400;
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
    await deleteCalendarEvent(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: "Calendar event deleted.",
    });
  } catch (error: any) {
    const status = error.message.includes("FORBIDDEN") ? 403 : error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status }
    );
  }
}

