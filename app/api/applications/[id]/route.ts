import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApplicationById } from "@/lib/services/application";

export async function GET(
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
    const result = await getApplicationById(
      id,
      session.user.id,
      (session.user as any).systemRole
    );

    return NextResponse.json({ success: true, data: result.application, viewerRole: result.viewerRole });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching application details:", error);
    const status = error.message.includes("Unauthorized") ? 403 : 404;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch application." },
      { status }
    );
  }
}
