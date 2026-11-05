import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminAuditLogs } from "@/lib/services/audit";
import { adminAuditQuerySchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const query = adminAuditQuerySchema.parse({
      action: searchParams.get("action") || undefined,
      targetType: searchParams.get("targetType") || undefined,
      adminId: searchParams.get("adminId") || undefined,
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
    });

    const result = await getAdminAuditLogs(query);

    return NextResponse.json({
      success: true,
      data: result.logs,
      totalCount: result.totalCount,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error retrieving audit logs:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve audit trail." } },
      { status: 500 }
    );
  }
}

