import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getApplicationById } from "@/lib/services/application";

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
    const result = await getApplicationById(
      id,
      session.user.id,
      (session.user as any).systemRole
    );

    return NextResponse.json({ success: true, data: result.application, viewerRole: result.viewerRole });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching application details:", error);
    const status = error.message.includes("Unauthorized") ? 403 : 404;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch application." },
      { status }
    );
  }
}

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
    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Application record not found." },
        { status: 404 }
      );
    }

    if (existing.applicantId !== session.user.id && (session.user as any).systemRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot remove another user's application." },
        { status: 403 }
      );
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Application removed successfully." });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove application." },
      { status: 500 }
    );
  }
}


