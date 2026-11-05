import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deleteOpportunity,
  getOpportunityById,
  updateOpportunity,
} from "@/lib/services/opportunity";
import { updateOpportunitySchema } from "@/lib/validations/opportunity";

export async function GET(
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
        { error: "UNAUTHORIZED", message: "Sign in required to view opportunity details." },
        { status: 401 }
      );
    }

    const opportunity = await getOpportunityById(id, session.user.id);
    return NextResponse.json({ success: true, data: opportunity });
  } catch (error: any) {
    const status = error.message?.includes("NOT_FOUND")
      ? 404
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json(
      { error: "GET_OPPORTUNITY_FAILED", message: error.message || "Failed to retrieve opportunity." },
      { status }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const parsed = updateOpportunitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid opportunity update payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const updated = await updateOpportunity(session.user.id, id, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 400;
    return NextResponse.json(
      { error: "UPDATE_OPPORTUNITY_FAILED", message: error.message || "Failed to update opportunity." },
      { status }
    );
  }
}

export async function DELETE(
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

    await deleteOpportunity(session.user.id, id);
    return NextResponse.json({ success: true, message: "Opportunity deleted successfully." });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 500;
    return NextResponse.json(
      { error: "DELETE_OPPORTUNITY_FAILED", message: error.message || "Failed to delete opportunity." },
      { status }
    );
  }
}
