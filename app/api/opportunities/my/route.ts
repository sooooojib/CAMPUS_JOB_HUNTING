import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserAuthoredOpportunities } from "@/lib/services/opportunity";

export async function GET(request: NextRequest) {
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { systemRole: true, membershipType: true },
    });

    const isAdmin = user?.systemRole === "ADMIN" || user?.membershipType === "ADMIN";

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";
    const roleType = searchParams.get("roleType") || undefined;
    const workplaceType = searchParams.get("workplaceType") || undefined;
    const sourceType = searchParams.get("sourceType") || undefined;
    const department = searchParams.get("department") || undefined;
    const maxMinCgpa = searchParams.get("maxMinCgpa")
      ? parseFloat(searchParams.get("maxMinCgpa")!)
      : undefined;

    const result = await getUserAuthoredOpportunities(session.user.id, status, {
      isAdminView: isAdmin,
      roleType,
      workplaceType,
      sourceType,
      department,
      maxMinCgpa,
    });

    return NextResponse.json({
      success: true,
      isAdmin,
      data: result.items,
      counts: result.statusCounts,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching my opportunities:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}
