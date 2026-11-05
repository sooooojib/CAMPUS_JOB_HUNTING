import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createContentReport } from "@/lib/services/community";
import { createReportSchema } from "@/lib/validations/community";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const body = await request.json();
    const validation = createReportSchema.safeParse({
      ...body,
      targetType: "COMMENT",
      commentId: id,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const report = await createContentReport(session.user.id, validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for helping keep our university community safe. The report has been queued for moderation.",
        data: { id: report.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error creating comment report:", error);
    const status =
      error.code === "DUPLICATE_REPORT"
        ? 409
        : error.code === "COMMENT_NOT_FOUND"
        ? 404
        : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit report." },
      { status }
    );
  }
}
