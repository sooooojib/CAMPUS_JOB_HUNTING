import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCommunityPostById,
  updateCommunityPost,
  deleteCommunityPost,
} from "@/lib/services/community";
import { updatePostSchema } from "@/lib/validations/community";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const post = await getCommunityPostById(id, session.user.id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "POST_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching community post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch post." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const body = await request.json();
    const validation = updatePostSchema.safeParse(body);

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

    const updated = await updateCommunityPost(session.user.id, id, validation.data);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error updating community post:", error);
    const status = error.code === "FORBIDDEN" ? 403 : error.code === "POST_NOT_FOUND" ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update post." },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    await deleteCommunityPost(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: "Post successfully deleted.",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error deleting community post:", error);
    const status = error.code === "FORBIDDEN" ? 403 : error.code === "POST_NOT_FOUND" ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete post." },
      { status }
    );
  }
}
