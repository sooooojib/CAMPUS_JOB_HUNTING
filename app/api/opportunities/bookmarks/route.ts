import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserBookmarkedOpportunities } from "@/lib/services/opportunity";

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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const result = await getUserBookmarkedOpportunities(session.user.id, page, limit);

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
