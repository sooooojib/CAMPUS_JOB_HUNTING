import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  updateAcademicRecord,
  deleteAcademicRecord,
} from "@/lib/services/academic";
import { updateAcademicRecordSchema } from "@/lib/validations/academic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const parsed = updateAcademicRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid update fields.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const updated = await updateAcademicRecord(session.user.id, id, parsed.data);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Academic record updated and cumulative CGPA synced.",
    });
  } catch (error: any) {
    console.error("Error updating academic record:", error);
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await deleteAcademicRecord(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: "Academic record deleted and cumulative CGPA recalculated.",
    });
  } catch (error: any) {
    console.error("Error deleting academic record:", error);
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}

