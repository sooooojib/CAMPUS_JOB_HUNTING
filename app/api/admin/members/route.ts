import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-auth";
import { getAdminMembersList } from "@/lib/services/admin";
import { adminMemberQuerySchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  try {
    const { admin, errorResponse } = await requireAdminSession(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const parsed = adminMemberQuerySchema.safeParse({
      q: searchParams.get("q") || undefined,
      membershipType: searchParams.get("membershipType") || undefined,
      verificationStatus: searchParams.get("verificationStatus") || undefined,
      accountStatus: searchParams.get("accountStatus") || undefined,
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
    });

    if (!parsed.success) {
      const issueDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "filter"}: ${issue.message}`)
        .join("; ");
      return NextResponse.json(
        { success: false, error: { message: `Invalid filter parameters (${issueDetails})` } },
        { status: 400 }
      );
    }

    const { membershipType, verificationStatus, accountStatus, ...restQuery } = parsed.data;

    const result = await getAdminMembersList({
      ...restQuery,
      membershipType: membershipType === "ALL" ? undefined : membershipType,
      verificationStatus: verificationStatus === "ALL" ? undefined : verificationStatus,
      accountStatus: accountStatus === "ALL" ? undefined : accountStatus,
    });

    return NextResponse.json({
      success: true,
      data: result.members,
      totalCount: result.totalCount,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error retrieving admin members list:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to retrieve members." } },
      { status: 500 }
    );
  }
}

