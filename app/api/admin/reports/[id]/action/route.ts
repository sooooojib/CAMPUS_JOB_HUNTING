import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { adminResolveReport } from "@/lib/services/admin";
import { adminReportActionSchema } from "@/lib/validations/admin";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const body = await request.json();
    const validated = adminReportActionSchema.parse(body);

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await adminResolveReport(
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
    console.error("Error processing moderation report action:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to process report action." } },
      { status: 400 }
    );
  }
}
