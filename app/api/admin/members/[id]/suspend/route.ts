import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { adminToggleUserSuspension } from "@/lib/services/admin";
import { adminSuspendUserSchema } from "@/lib/validations/admin";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const body = await request.json();
    const validated = adminSuspendUserSchema.parse(body);

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await adminToggleUserSuspension(
      admin!.id,
      id,
      validated,
      clientIp
    );

    return NextResponse.json({
      success: true,
      data: result.user,
    });
  } catch (error: any) {
    console.error("Error toggling user suspension:", error);
    const status = error.message?.includes("Forbidden") ? 403 : 400;
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to update account status." } },
      { status }
    );
  }
}
