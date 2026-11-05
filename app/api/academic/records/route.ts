import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserAcademicProfile,
  createAcademicRecord,
} from "@/lib/services/academic";
import { canAccessStudentTools } from "@/lib/permissions";
import { createAcademicRecordSchema } from "@/lib/validations/academic";

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

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId") || session.user.id;

    const academicProfile = await getUserAcademicProfile(session.user.id, targetUserId);

    return NextResponse.json({
      success: true,
      data: academicProfile,
    });
  } catch (error: any) {
    console.error("Error retrieving academic profile:", error);
    const isForbidden = error.message?.includes("ACCESS_DENIED") || error.message?.includes("private");
    return NextResponse.json(
      { success: false, error: { code: isForbidden ? "FORBIDDEN" : "QUERY_FAILED", message: error.message } },
      { status: isForbidden ? 403 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
            message: "Academic performance and CGPA tools are restricted to verified student accounts.",
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createAcademicRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid academic record fields.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const record = await createAcademicRecord(session.user.id, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: record,
        message: "Semester academic record saved and cumulative CGPA recalculated.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating academic record:", error);
    return NextResponse.json(
      { success: false, error: { code: "RECORD_CREATION_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}

