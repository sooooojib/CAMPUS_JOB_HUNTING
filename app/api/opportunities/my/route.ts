import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserAuthoredOpportunities } from "@/lib/services/opportunity";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";

    const result = await getUserAuthoredOpportunities(session.user.id, status);

    return NextResponse.json({
      success: true,
      data: result.items,
      counts: result.statusCounts,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching my opportunities:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}
