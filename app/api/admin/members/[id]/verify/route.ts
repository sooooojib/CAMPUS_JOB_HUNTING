import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { adminUpdateUserVerification } from "@/lib/services/admin";
import { adminVerifyUserSchema } from "@/lib/validations/admin";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const body = await request.json();
    const validated = adminVerifyUserSchema.parse(body);

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await adminUpdateUserVerification(
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
    console.error("Error updating member verification:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to update verification status." } },
      { status: 400 }
    );
  }
}
