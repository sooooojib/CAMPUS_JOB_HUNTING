import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { adminModerateOpportunity } from "@/lib/services/admin";
import { adminOpportunityReviewSchema } from "@/lib/validations/admin";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const body = await request.json();
    const validated = adminOpportunityReviewSchema.parse(body);

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await adminModerateOpportunity(
      admin!.id,
      id,
      validated,
      clientIp
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error moderating opportunity:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to moderate opportunity." } },
      { status: 400 }
    );
  }
}

