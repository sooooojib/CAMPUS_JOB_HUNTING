import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { completeOnboarding } from "@/lib/services/profile";
import { onboardingPayloadSchema } from "@/lib/validations/profile";

export async function POST(request: NextRequest) {
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
    const parsed = onboardingPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid onboarding payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const result = await completeOnboarding(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: "ONBOARDING_FAILED", message: error.message || "Failed to complete onboarding." },
      { status: 500 }
    );
  }
}
