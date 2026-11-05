import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOpportunityApplicants } from "@/lib/services/application";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";

    const result = await getOpportunityApplicants({
      opportunityId: id,
      requestingUserId: session.user.id,
      requestingUserRole: (session.user as any).systemRole,
      statusFilter: status,
    });

    return NextResponse.json({
      success: true,
      data: result.applicants,
      opportunity: result.opportunity,
      counts: result.statusCounts,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching opportunity applicants:", error);
    const status = error.message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applicants." },
      { status }
    );
  }
}

