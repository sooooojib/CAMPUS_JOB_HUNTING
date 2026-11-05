import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminCompaniesList } from "@/lib/services/admin";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const isVerified = searchParams.has("isVerified")
      ? searchParams.get("isVerified") === "true"
      : undefined;
    const isSuspended = searchParams.has("isSuspended")
      ? searchParams.get("isSuspended") === "true"
      : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 20;

    const result = await getAdminCompaniesList({
      q,
      isVerified,
      isSuspended,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data: result.companies,
      totalCount: result.totalCount,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error retrieving admin companies list:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve companies." } },
      { status: 500 }
    );
  }
}
