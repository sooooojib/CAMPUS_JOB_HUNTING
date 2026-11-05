import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPostComments, addPostComment } from "@/lib/services/community";
import { createCommentSchema } from "@/lib/validations/community";

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
    const comments = await getPostComments(id, session.user.id);

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch comments." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const validation = createCommentSchema.safeParse(body);

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

    const comment = await addPostComment(session.user.id, id, validation.data);

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error creating comment:", error);
    const status =
      error.code === "POST_NOT_FOUND" || error.code === "PARENT_COMMENT_NOT_FOUND"
        ? 404
        : error.code === "FORBIDDEN_ACCOUNT_SUSPENDED"
        ? 403
        : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add comment." },
      { status }
    );
  }
}
