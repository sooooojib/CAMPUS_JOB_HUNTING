import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getMemberSkills,
  addSkillToProfile,
  removeSkillFromProfile,
} from "@/lib/services/skill";
import { addMemberSkillSchema } from "@/lib/validations/skill";

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

    const skills = await getMemberSkills(session.user.id);

    return NextResponse.json({
      success: true,
      items: skills,
    });
  } catch (error: any) {
    console.error("Error retrieving member skills:", error);
    return NextResponse.json(
      { success: false, error: { code: "QUERY_FAILED", message: error.message } },
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
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = addMemberSkillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid member skill input.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const memberSkill = await addSkillToProfile(session.user.id, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: memberSkill,
        message: "Skill added to your verified profile.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding skill to profile:", error);
    return NextResponse.json(
      { success: false, error: { code: "ADD_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const skillId = searchParams.get("skillId");

    if (!skillId) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_SKILL_ID", message: "skillId is required." } },
        { status: 400 }
      );
    }

    await removeSkillFromProfile(session.user.id, skillId);

    return NextResponse.json({
      success: true,
      message: "Skill removed from profile.",
    });
  } catch (error: any) {
    console.error("Error removing skill from profile:", error);
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}

