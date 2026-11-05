import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getPendingOpportunities,
  reviewOpportunity,
} from "@/lib/services/opportunity";
import { adminReviewOpportunitySchema } from "@/lib/validations/opportunity";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required." },
        { status: 401 }
      );
    }

    const pending = await getPendingOpportunities(session.user.id);
    return NextResponse.json({ success: true, data: pending });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json(
      { error: "ADMIN_ERROR", message: error.message || "Failed to fetch pending opportunities." },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = adminReviewOpportunitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid review decision payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const result = await reviewOpportunity(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 400;
    return NextResponse.json(
      { error: "DECISION_FAILED", message: error.message || "Failed to process opportunity review." },
      { status }
    );
  }
}
