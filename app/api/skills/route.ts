import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getControlledSkills,
  getOrCreateSkill,
  seedInitialSkills,
} from "@/lib/services/skill";
import { createSkillSchema } from "@/lib/validations/skill";
import { SkillCategory } from "@/types";

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

    // Auto-seed initial dictionary if needed
    await seedInitialSkills();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as SkillCategory | null;

    const skills = await getControlledSkills(category || undefined);

    return NextResponse.json({
      success: true,
      items: skills,
    });
  } catch (error: any) {
    console.error("Error retrieving skills:", error);
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
    const parsed = createSkillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid skill parameters.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const skill = await getOrCreateSkill(
      parsed.data.name,
      parsed.data.category,
      parsed.data.description
    );

    return NextResponse.json(
      {
        success: true,
        data: skill,
        message: "Skill registered in dictionary.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { success: false, error: { code: "CREATION_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}

