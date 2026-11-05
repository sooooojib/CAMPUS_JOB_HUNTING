import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { togglePostBookmark } from "@/lib/services/community";

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
    const result = await togglePostBookmark(session.user.id, id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error toggling post bookmark:", error);
    const status = error.code === "POST_NOT_FOUND" ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle bookmark." },
      { status }
    );
  }
}
