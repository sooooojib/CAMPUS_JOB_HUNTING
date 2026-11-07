import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createManualApplicationSchema } from "@/lib/validations/application";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const manualApps = await prisma.manualApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { appliedDate: "desc" },
    });

    return NextResponse.json({ manualApplications: manualApps });
  } catch (err: any) {
    console.error("Error fetching manual applications:", err);
    return NextResponse.json(
      { error: "Failed to retrieve manual applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createManualApplicationSchema.parse(body);

    const manualApp = await prisma.manualApplication.create({
      data: {
        userId: session.user.id,
        companyName: validated.companyName,
        roleTitle: validated.roleTitle,
        location: validated.location || null,
        jobUrl: validated.jobUrl || null,
        notes: validated.notes || null,
        status: validated.status || "APPLIED",
        appliedDate: validated.appliedDate ? new Date(validated.appliedDate) : new Date(),
      },
    });

    return NextResponse.json({ manualApplication: manualApp }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating manual application:", err);
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to create manual application" },
      { status: 500 }
    );
  }
}
