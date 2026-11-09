import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/permissions";
import { adminVerifyUserCgpa } from "@/lib/services/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign-in required." },
        { status: 401 }
      );
    }

    if (!isPlatformAdmin(session.user)) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "Platform administration privileges required." },
        { status: 403 }
      );
    }

    const { id: targetUserId } = await params;
    const body = await request.json().catch(() => ({}));
    const isVerified = Boolean(body.isVerified);
    const reason = typeof body.reason === "string" ? body.reason.trim() : undefined;

    const forwardedFor = (await reqHeaders).get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;

    const result = await adminVerifyUserCgpa(
      session.user.id,
      targetUserId,
      isVerified,
      reason,
      clientIp
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Admin Member CGPA Verification Error]:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to update member CGPA verification.",
      },
      { status: error.message?.includes("not found") ? 404 : 500 }
    );
  }
}

