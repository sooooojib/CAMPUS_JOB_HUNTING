import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found for this email" }, { status: 404 });
    }

    // Verify user account in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationStatus: user.verificationStatus === "REJECTED" ? "REJECTED" : "VERIFIED",
        verifiedAt: new Date(),
      },
    });

    // Clean up verification token record if present
    await prisma.verification.deleteMany({
      where: { id: `verify_${email}` },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Your university account email has been verified successfully.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        verificationStatus: updatedUser.verificationStatus,
      },
    });
  } catch (error: any) {
    console.error("[Instant Verify] Error verifying account:", error);
    return NextResponse.json(
      { error: "Failed to verify account" },
      { status: 500 }
    );
  }
}
