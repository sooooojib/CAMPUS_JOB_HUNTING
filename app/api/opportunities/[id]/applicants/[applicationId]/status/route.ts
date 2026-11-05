import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateApplicationStatus } from "@/lib/services/application";
import { updateApplicationStatusSchema } from "@/lib/validations/application";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; applicationId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { applicationId } = await context.params;
    const body = await request.json();
    const parsed = updateApplicationStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const updated = await updateApplicationStatus({
      applicationId,
      reviewerId: session.user.id,
      reviewerRole: (session.user as any).systemRole,
      status: parsed.data.status,
      note: parsed.data.note,
      employerNotes: parsed.data.employerNotes,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error updating application status:", error);
    const status = error.message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status." },
      { status }
    );
  }
}

