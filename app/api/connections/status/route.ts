import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getConnectionState } from "@/lib/services/connection";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_USER_ID", message: "Target userId is required." } },
        { status: 400 }
      );
    }

    const result = await getConnectionState(session.user.id, userId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error checking connection state:", error);
    return NextResponse.json(
      { success: false, error: { code: "QUERY_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}
