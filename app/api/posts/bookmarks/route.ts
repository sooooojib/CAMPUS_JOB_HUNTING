import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCommunityFeed } from "@/lib/services/community";
import { communityFilterSchema } from "@/lib/validations/community";

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
    const parsedFilters = communityFilterSchema.safeParse({
      postType: searchParams.get("postType") || undefined,
      search: searchParams.get("search") || undefined,
      bookmarkedOnly: "true",
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsedFilters.success) {
      return NextResponse.json(
        { success: false, error: "INVALID_FILTERS" },
        { status: 400 }
      );
    }

    const feed = await getCommunityFeed(session.user.id, parsedFilters.data);

    return NextResponse.json({
      success: true,
      data: feed.items,
      pagination: feed.pagination,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching bookmarked posts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch saved posts." },
      { status: 500 }
    );
  }
}
