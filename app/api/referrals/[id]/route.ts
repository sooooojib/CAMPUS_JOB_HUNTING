import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  assertCanAccessReferral,
  respondToReferralRequest,
  cancelReferralRequest,
} from "@/lib/services/referral";
import { respondReferralSchema } from "@/lib/validations/referral";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const referral = await assertCanAccessReferral(session.user.id, id);

    return NextResponse.json({
      success: true,
      data: referral,
    });
  } catch (error: any) {
    console.error("Error accessing referral request:", error);
    const isForbidden =
      error.message?.includes("Access denied") || error.message?.includes("permission");
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isForbidden ? "FORBIDDEN" : "NOT_FOUND",
          message: error.message || "Failed to access referral request.",
        },
      },
      { status: isForbidden ? 403 : 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "cancel") {
      const cancelled = await cancelReferralRequest(session.user.id, id);
      return NextResponse.json({
        success: true,
        data: cancelled,
        message: "Referral request cancelled successfully.",
      });
    }

    const body = await request.json();
    const parsed = respondReferralSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid referral response payload.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const updated = await respondToReferralRequest(
      session.user.id,
      id,
      parsed.data
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Referral request marked as ${parsed.data.status.toLowerCase()}.`,
    });
  } catch (error: any) {
    console.error("Error updating referral request:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message: error.message || "Failed to update referral request.",
        },
      },
      { status: 400 }
    );
  }
}

