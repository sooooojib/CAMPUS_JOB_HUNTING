import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeStudentSkillGaps } from "@/lib/services/matching";
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
            message: "Skill gap analysis is restricted to verified student accounts.",
          },
        },
        { status: 403 }
      );
    }

    const result = await analyzeStudentSkillGaps(session.user.id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error analyzing skill gaps:", error);
    return NextResponse.json(
      { success: false, error: { code: "SKILL_GAP_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

