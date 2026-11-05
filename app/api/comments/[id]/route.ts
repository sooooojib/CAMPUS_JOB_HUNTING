import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updatePostComment, deletePostComment } from "@/lib/services/community";
import { updateCommentSchema } from "@/lib/validations/community";

interface RouteParams {
  params: Promise<{ id: string }>;
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
    const validation = updateCommentSchema.safeParse(body);

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

    const updated = await updatePostComment(session.user.id, id, validation.data);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error updating comment:", error);
    const status = error.code === "FORBIDDEN" ? 403 : error.code === "COMMENT_NOT_FOUND" ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update comment." },
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
    await deletePostComment(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: "Comment successfully deleted.",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error deleting comment:", error);
    const status = error.code === "FORBIDDEN" ? 403 : error.code === "COMMENT_NOT_FOUND" ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete comment." },
      { status }
    );
  }
}
