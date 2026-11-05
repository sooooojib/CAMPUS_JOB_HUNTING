import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminAnalyticsData } from "@/lib/services/admin";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const data = await getAdminAnalyticsData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error retrieving admin analytics:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to compile platform analytics." } },
      { status: 500 }
    );
  }
}
