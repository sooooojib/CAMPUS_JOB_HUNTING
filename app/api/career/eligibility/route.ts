import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateEligibility, calculateSkillMatch } from "@/lib/services/matching";

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
    const opportunityId = searchParams.get("opportunityId");

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_OPPORTUNITY_ID", message: "opportunityId is required." } },
        { status: 400 }
      );
    }

    const [user, opportunity] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: { profile: true },
      }),
      prisma.opportunity.findUnique({
        where: { id: opportunityId },
      }),
    ]);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found." } },
        { status: 404 }
      );
    }

    const studentProfile = {
      currentCgpa: user?.profile?.currentCgpa,
      department: user?.profile?.department,
      academicYear: user?.profile?.academicYear,
    };

    const eligibility = evaluateEligibility(studentProfile, opportunity);
    const match = calculateSkillMatch(user?.profile?.skills || [], opportunity.requiredSkills);

    return NextResponse.json({
      success: true,
      data: {
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        eligibility,
        match,
      },
    });
  } catch (error: any) {
    console.error("Error evaluating eligibility:", error);
    return NextResponse.json(
      { success: false, error: { code: "ELIGIBILITY_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

