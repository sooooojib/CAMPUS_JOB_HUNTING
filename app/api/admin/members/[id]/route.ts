import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { adminDeleteUser } from "@/lib/services/admin";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    let reason: string | undefined = undefined;

    try {
      const body = await request.json();
      if (body?.reason) {
        reason = String(body.reason).trim();
      }
    } catch {
      // Body is optional on DELETE
    }

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await adminDeleteUser(admin!.id, id, reason, clientIp);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error deleting member:", error);
    const status = error.message?.includes("FORBIDDEN") ? 403 : 400;
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to delete user." } },
      { status }
    );
  }
}
