import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserCareerCalendar,
  createCalendarEvent,
} from "@/lib/services/calendar";
import {
  calendarQuerySchema,
  createCalendarEventSchema,
} from "@/lib/validations/calendar";

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
    const query = calendarQuerySchema.parse({
      year: searchParams.get("year") || undefined,
      month: searchParams.get("month") || undefined,
    });

    const data = await getUserCareerCalendar(session.user.id, query.year, query.month);

    return NextResponse.json({
      success: true,
      data: data.events,
      year: data.year,
      month: data.month,
    });
  } catch (error: any) {
    console.error("Error retrieving calendar events:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve calendar events." } },
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

    const body = await request.json();
    const input = createCalendarEventSchema.parse(body);

    const created = await createCalendarEvent(session.user.id, input);

    return NextResponse.json({
      success: true,
      message: "Calendar event created.",
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to create calendar event." } },
      { status: 400 }
    );
  }
}
