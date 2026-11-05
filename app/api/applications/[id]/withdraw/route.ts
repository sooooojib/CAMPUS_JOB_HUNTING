import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { withdrawApplication } from "@/lib/services/application";
import { withdrawApplicationSchema } from "@/lib/validations/application";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id } = await context.params;
    let reason: string | undefined;

    try {
      const body = await request.json();
      const parsed = withdrawApplicationSchema.safeParse(body);
      if (parsed.success) {
        reason = parsed.data.reason || undefined;
      }
    } catch {
      // Body is optional
    }

    const updated = await withdrawApplication(session.user.id, id, reason);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error withdrawing application:", error);
    const status = error.message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to withdraw application." },
      { status }
    );
  }
}
