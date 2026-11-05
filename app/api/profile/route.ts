import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMemberProfile, upsertProfile } from "@/lib/services/profile";
import { updateProfileSchema } from "@/lib/validations/profile";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required." },
        { status: 401 }
      );
    }

    const memberData = await getMemberProfile(session.user.id);
    return NextResponse.json({ success: true, data: memberData });
  } catch (error: any) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to retrieve profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid profile data.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const updatedProfile = await upsertProfile(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error: any) {
    return NextResponse.json(
      { error: "UPDATE_FAILED", message: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
