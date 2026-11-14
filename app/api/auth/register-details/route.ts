import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerDetailsSchema = z.object({
  email: z.string().email(),
  studentId: z.string().min(2, "University ID must be at least 2 characters").max(50),
  department: z.string().min(2, "Department is required").max(100),
  membershipType: z.enum(["STUDENT", "ALUMNI"]).default("STUDENT"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerDetailsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid registration details.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, studentId, department, membershipType } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND", message: "User account not found." },
        { status: 404 }
      );
    }

    // 1. Upsert Profile with locked studentId and department
    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        studentId: studentId.trim(),
        department: department.trim(),
        degree: `Degree in ${department.trim()}`,
      },
      update: {
        studentId: studentId.trim(),
        department: department.trim(),
      },
    });

    // 2. Only queue into the Admin Approval Panel if the user's email has already been verified.
    // Unverified accounts MUST complete Step 2 (Mandatory Email Verification) before being enrolled in the admin queue.
    // When they verify their email, Better Auth's afterEmailVerification hook will automatically enroll them.
    if (user.emailVerified) {
      const existingReq = await prisma.membershipRequest.findFirst({
        where: { userId: user.id },
      });

      if (!existingReq) {
        await prisma.membershipRequest.create({
          data: {
            userId: user.id,
            membershipType: (membershipType as any) || "STUDENT",
            status: "PENDING",
            institutionalId: studentId.trim(),
            department: department.trim(),
            connectionNote: `Self-registered as ${membershipType} from Department of ${department.trim()} (ID: ${studentId.trim()}). Awaiting verification approval.`,
          },
        });
      } else {
        await prisma.membershipRequest.update({
          where: { id: existingReq.id },
          data: {
            institutionalId: studentId.trim(),
            department: department.trim(),
            membershipType: (membershipType as any) || "STUDENT",
            status: "PENDING",
          },
        });
      }
    }

    // 3. Ensure User verificationStatus remains PENDING
    await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipType: (membershipType as any) || "STUDENT",
        verificationStatus: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "University ID and department saved successfully.",
    });
  } catch (error: any) {
    console.error("[Register Details Endpoint Error]:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to record university credentials." },
      { status: 500 }
    );
  }
}

