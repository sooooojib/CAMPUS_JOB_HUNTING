import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserVerificationHistory,
  submitVerificationRequest,
} from "@/lib/services/verification";
import { submitVerificationRequestSchema } from "@/lib/validations/verification";

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
    const parsed = submitVerificationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid verification submission.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const newRequest = await submitVerificationRequest(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: newRequest });
  } catch (error: any) {
    return NextResponse.json(
      { error: "SUBMISSION_FAILED", message: error.message || "Failed to submit request." },
      { status: 500 }
    );
  }
}

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

    const history = await getUserVerificationHistory(session.user.id, session.user.id);
    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to fetch history." },
      { status: 500 }
    );
  }
}
