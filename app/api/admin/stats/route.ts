import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminDashboardStats } from "@/lib/services/admin";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const stats = await getAdminDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Error retrieving admin stats:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve statistics." } },
      { status: 500 }
    );
  }
}
