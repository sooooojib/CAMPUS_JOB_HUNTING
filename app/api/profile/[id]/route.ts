import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPublicProfile } from "@/lib/services/profile";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Unauthenticated visitors are rejected per AGENTS.md Task 3
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Community authentication required." },
        { status: 401 }
      );
    }

    const publicProfile = await getPublicProfile(id, session.user.id);
    return NextResponse.json({ success: true, data: publicProfile });
  } catch (error: any) {
    if (error.message?.includes("PROFILE_NOT_FOUND")) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Member profile not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to fetch profile." },
      { status: 500 }
    );
  }
}
