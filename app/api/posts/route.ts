import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createCommunityPost,
  getCommunityFeed,
} from "@/lib/services/community";
import {
  createPostSchema,
  communityFilterSchema,
} from "@/lib/validations/community";

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
      tag: searchParams.get("tag") || undefined,
      authorId: searchParams.get("authorId") || undefined,
      bookmarkedOnly: searchParams.get("bookmarkedOnly") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsedFilters.success) {
      return NextResponse.json(
        { success: false, error: "INVALID_FILTERS", details: parsedFilters.error.format() },
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
    console.error("Error fetching community feed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch feed." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const newPost = await createCommunityPost(session.user.id, validation.data);

    return NextResponse.json(
      {
        success: true,
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error creating community post:", error);
    const statusCode = error.code === "FORBIDDEN_ACCOUNT_SUSPENDED" ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create post." },
      { status: statusCode }
    );
  }
}
