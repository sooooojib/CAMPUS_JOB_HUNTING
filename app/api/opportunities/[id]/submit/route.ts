import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { submitOpportunityForReview } from "@/lib/services/opportunity";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required." },
        { status: 401 }
      );
    }

    const updated = await submitOpportunityForReview(session.user.id, id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 400;
    return NextResponse.json(
      { error: "SUBMISSION_FAILED", message: error.message || "Failed to submit for review." },
      { status }
    );
  }
}
