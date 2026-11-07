import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateManualApplicationSchema } from "@/lib/validations/application";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.manualApplication.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const body = await request.json();
    const validated = updateManualApplicationSchema.parse(body);

    const updated = await prisma.manualApplication.update({
      where: { id },
      data: {
        ...(validated.companyName && { companyName: validated.companyName }),
        ...(validated.roleTitle && { roleTitle: validated.roleTitle }),
        ...(validated.location !== undefined && { location: validated.location }),
        ...(validated.jobUrl !== undefined && { jobUrl: validated.jobUrl }),
        ...(validated.notes !== undefined && { notes: validated.notes }),
        ...(validated.status && { status: validated.status }),
        ...(validated.appliedDate && { appliedDate: new Date(validated.appliedDate) }),
      },
    });

    return NextResponse.json({ manualApplication: updated });
  } catch (err: any) {
    console.error("Error updating manual application:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update manual application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.manualApplication.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.manualApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting manual application:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete manual application" },
      { status: 500 }
    );
  }
}
