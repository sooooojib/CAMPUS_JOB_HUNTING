import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteResume } from "@/lib/services/resume";

export async function DELETE(
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
    const result = await deleteResume(id, session.user.id);

    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete resume." },
      { status: 400 }
    );
  }
}
