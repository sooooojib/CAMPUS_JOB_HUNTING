import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleOpportunityBookmark } from "@/lib/services/opportunity";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const result = await toggleOpportunityBookmark(session.user.id, id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
