import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { adminModerateCompany } from "@/lib/services/admin";
import { adminCompanyActionSchema } from "@/lib/validations/admin";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const body = await request.json();
    const validated = adminCompanyActionSchema.parse(body);

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const result = await adminModerateCompany(
      admin!.id,
      id,
      validated,
      clientIp
    );

    return NextResponse.json({
      success: true,
      data: result.company,
    });
  } catch (error: any) {
    console.error("Error moderating company:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to moderate company." } },
      { status: 400 }
    );
  }
}

