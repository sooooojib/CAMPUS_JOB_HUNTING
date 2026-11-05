import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminReportsList } from "@/lib/services/admin";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const targetType = searchParams.get("targetType") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 20;

    const result = await getAdminReportsList({
      status,
      targetType,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data: result.reports,
      totalCount: result.totalCount,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error retrieving admin reports list:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve reports." } },
      { status: 500 }
    );
  }
}

