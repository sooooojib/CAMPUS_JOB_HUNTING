import { prisma } from "@/lib/prisma";
import { assertAdmin, isPlatformAdmin } from "@/lib/permissions";
import {
  AdminReviewVerificationInput,
  SubmitVerificationRequestInput,
} from "@/lib/validations/verification";
import { createNotification } from "./notification";
import { sendMembershipApprovedEmail, sendMembershipRejectedEmail } from "@/lib/email";

/**
 * Submits an institutional verification request for an authenticated member.
 * Supports initial onboarding submission and resubmission following rejection.
 */
export async function submitVerificationRequest(
  userId: string,
  data: SubmitVerificationRequestInput
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("USER_NOT_FOUND: User does not exist.");
  }

  // Update user verification status to PENDING
  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipType: data.membershipType as any,
      verificationStatus: "PENDING",
    },
  });

  // Create formal membership request audit record
  const request = await prisma.membershipRequest.create({
    data: {
      userId,
      membershipType: data.membershipType as any,
      status: "PENDING",
      institutionalId: data.institutionalId || null,
      department: data.department || null,
      academicYear: data.academicYear || null,
      graduationYear: data.graduationYear || null,
      organization: data.organization || null,
      designation: data.designation || null,
      workEmail: data.workEmail || null,
      connectionNote: data.connectionNote || null,
      proofDetails: data.proofDetails || null,
      proofDocumentUrl: data.proofDocumentUrl || null,
    },
  });

  return request;
}

/**
 * Fetches all pending verification requests for platform governance.
 * Gated strictly to Platform Administrators on the server.
 */
export async function getPendingVerificationRequests(adminUserId: string) {
  const adminUser = await prisma.user.findUnique({ where: { id: adminUserId } });
  assertAdmin(adminUser);

  // Auto-sync any email-verified pending users who do not yet have a membership request
  const unlinkedPendingUsers = await prisma.user.findMany({
    where: {
      emailVerified: true,
      verificationStatus: "PENDING",
      membershipRequests: { none: {} },
    },
    take: 20,
  });

  for (const pendingUser of unlinkedPendingUsers) {
    const profile = await prisma.profile.findUnique({
      where: { userId: pendingUser.id },
    });

    await prisma.membershipRequest.create({
      data: {
        userId: pendingUser.id,
        membershipType: pendingUser.membershipType || "STUDENT",
        status: "PENDING",
        institutionalId: profile?.studentId || null,
        department: profile?.department || null,
        connectionNote: "Account email verified. Auto-enrolled into Admin Approval Queue.",
      },
    }).catch(() => {});
  }

  const pendingRequests = await prisma.membershipRequest.findMany({
    where: {
      status: "PENDING",
      user: {
        emailVerified: true,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return pendingRequests;
}

/**
 * Retrieves the verification request history for a specific user.
 * Restricted to the user themselves or platform administrators.
 */
export async function getUserVerificationHistory(
  targetUserId: string,
  viewerUserId: string
) {
  let isAuthorized = viewerUserId === targetUserId;

  if (!isAuthorized) {
    const viewer = await prisma.user.findUnique({ where: { id: viewerUserId } });
    isAuthorized = isPlatformAdmin(viewer);
  }

  if (!isAuthorized) {
    throw new Error("UNAUTHORIZED_ACCESS: You may only view your own verification history.");
  }

  return prisma.membershipRequest.findMany({
    where: { userId: targetUserId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Processes an administrative decision (APPROVE or REJECT) for a verification request.
 * Updates both the audit record and the associated user account permissions.
 */
export async function reviewVerificationRequest(
  adminUserId: string,
  input: AdminReviewVerificationInput
) {
  const adminUser = await prisma.user.findUnique({ where: { id: adminUserId } });
  assertAdmin(adminUser);

  const request = await prisma.membershipRequest.findUnique({
    where: { id: input.requestId },
    include: { user: true },
  });

  if (!request) {
    throw new Error("REQUEST_NOT_FOUND: Verification request not found.");
  }

  if (request.status !== "PENDING") {
    throw new Error("REQUEST_ALREADY_REVIEWED: This verification request has already been processed.");
  }

  const now = new Date();

  if (input.decision === "APPROVE") {
    // Security gate: Ensure applicant has verified their institutional email address before admin approval
    if (!request.user.emailVerified) {
      throw new Error("EMAIL_NOT_VERIFIED: Cannot approve membership for an account whose email has not been verified.");
    }

    // 1. Mark request as APPROVED
    const updatedRequest = await prisma.membershipRequest.update({
      where: { id: input.requestId },
      data: {
        status: "APPROVED",
        reviewerId: adminUserId,
        reviewedAt: now,
      },
    });

    // 2. Grant permissions based on verified membership type
    const canPost =
      request.membershipType === "ADMIN" ||
      request.membershipType === "ALUMNI" ||
      request.membershipType === "STUDENT";
    const canReview = request.membershipType === "ADMIN";

    const updatedUser = await prisma.user.update({
      where: { id: request.userId },
      data: {
        membershipType: request.membershipType,
        verificationStatus: "VERIFIED",
        verifiedAt: now,
        verifiedBy: adminUserId,
        canPostOpportunities: canPost,
        canReviewApplicants: canReview,
      },
    });

    // Ensure profile reflects onboarded status
    await prisma.profile.upsert({
      where: { userId: request.userId },
      create: {
        userId: request.userId,
        isOnboarded: true,
      },
      update: {
        isOnboarded: true,
      },
    });

    createNotification({
      recipientId: request.userId,
      type: "MEMBERSHIP_APPROVED",
      title: "University Membership Verified",
      message: `Your ${request.membershipType} membership verification has been approved. You now have full access to university platform tools.`,
      relatedEntityType: "MEMBERSHIP",
      relatedEntityId: request.id,
      actionUrl: "/profile/me",
    }).catch(() => {});

    // Dispatch official email notification to user's university inbox
    sendMembershipApprovedEmail({
      to: request.user.email,
      name: request.user.name,
      membershipType: request.membershipType,
    }).catch((emailErr) => {
      console.error("[Email Error] Failed delivering membership approval email:", emailErr);
    });

    return {
      request: updatedRequest,
      user: updatedUser,
      decision: "APPROVED" as const,
    };
  } else {
    // REJECT branch
    if (!input.rejectionReason || input.rejectionReason.trim().length === 0) {
      throw new Error("REJECTION_REASON_REQUIRED: A specific reason must be provided to the member.");
    }

    const updatedRequest = await prisma.membershipRequest.update({
      where: { id: input.requestId },
      data: {
        status: "REJECTED",
        rejectionReason: input.rejectionReason.trim(),
        reviewerId: adminUserId,
        reviewedAt: now,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: request.userId },
      data: {
        verificationStatus: "REJECTED",
        canPostOpportunities: false,
        canReviewApplicants: false,
      },
    });

    createNotification({
      recipientId: request.userId,
      type: "MEMBERSHIP_REJECTED",
      title: "Verification Update Required",
      message: `Your membership verification request was rejected: ${input.rejectionReason.trim()}. Please review and submit updated details.`,
      relatedEntityType: "MEMBERSHIP",
      relatedEntityId: request.id,
      actionUrl: "/onboarding",
    }).catch(() => {});

    // Dispatch rejection update email to user with administrator feedback
    sendMembershipRejectedEmail({
      to: request.user.email,
      name: request.user.name,
      reason: input.rejectionReason.trim(),
    }).catch((emailErr) => {
      console.error("[Email Error] Failed delivering membership rejection email:", emailErr);
    });

    return {
      request: updatedRequest,
      user: updatedUser,
      decision: "REJECTED" as const,
    };
  }
}
