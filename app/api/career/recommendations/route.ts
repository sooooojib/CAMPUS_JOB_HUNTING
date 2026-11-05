import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPersonalizedRecommendations } from "@/lib/services/matching";
import { canAccessStudentTools } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    if (!canAccessStudentTools(session.user)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN_STUDENT_ONLY",
            message: "Personalized opportunity matching and student career tools are restricted to verified student accounts.",
          },
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 10);
    const departmentFilterOnly = searchParams.get("departmentFilterOnly") === "true";

    const result = await getPersonalizedRecommendations(session.user.id, {
      limit,
      departmentFilterOnly,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error retrieving recommendations:", error);
    return NextResponse.json(
      { success: false, error: { code: "RECOMMENDATIONS_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

