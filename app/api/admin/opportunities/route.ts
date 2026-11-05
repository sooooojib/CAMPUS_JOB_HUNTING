import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminOpportunitiesList } from "@/lib/services/admin";
import { reviewOpportunity } from "@/lib/services/opportunity";
import { adminOpportunityQuerySchema } from "@/lib/validations/admin";
import { adminReviewOpportunitySchema } from "@/lib/validations/opportunity";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const query = adminOpportunityQuerySchema.parse({
      status: searchParams.get("status") || undefined,
      type: searchParams.get("type") || undefined,
      q: searchParams.get("q") || undefined,
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
    });

    const result = await getAdminOpportunitiesList(query);

    return NextResponse.json({
      success: true,
      data: result.opportunities,
      totalCount: result.totalCount,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error retrieving admin opportunities list:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve opportunities." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const parsed = adminReviewOpportunitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid review decision payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const result = await reviewOpportunity(admin!.id, parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 400;
    return NextResponse.json(
      { error: "DECISION_FAILED", message: error.message || "Failed to process opportunity review." },
      { status }
    );
  }
}

