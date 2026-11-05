import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { togglePostReaction } from "@/lib/services/community";
import { toggleReactionSchema } from "@/lib/validations/community";

interface RouteParams {
  params: Promise<{ id: string }>;
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
    const validation = toggleReactionSchema.safeParse(body);

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

    const result = await togglePostReaction(session.user.id, id, validation.data.type);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error toggling post reaction:", error);
    const status = error.code === "POST_NOT_FOUND" ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle reaction." },
      { status }
    );
  }
}
