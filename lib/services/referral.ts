import { prisma } from "@/lib/prisma";
import { CreateReferralInput, RespondReferralInput } from "@/lib/validations/referral";
import { ReferralStatus } from "@/types";
import { isPlatformAdmin } from "@/lib/permissions";
import { createNotification } from "./notification";

export const REFERRAL_DISCLAIMER =
  "UniCareer Community referral requests facilitate trusted professional recommendations between university-connected members. Submitting or receiving a referral does not guarantee an interview, employment offer, or institutional endorsement.";

/**
 * Creates a formal referral request directed to a fellow member.
 */
export async function createReferralRequest(requesterId: string, input: CreateReferralInput) {
  if (requesterId === input.recipientId) {
    throw new Error("You cannot request a referral from yourself.");
  }

  const recipient = await prisma.user.findUnique({
    where: { id: input.recipientId },
    select: { id: true, accountStatus: true, name: true },
  });

  if (!recipient) {
    throw new Error("Recipient member not found.");
  }

  if (recipient.accountStatus === "SUSPENDED" || recipient.accountStatus === "DEACTIVATED") {
    throw new Error("Cannot request a referral from an inactive or suspended member.");
  }

  // Validate company if companyId is provided
  let companyId: string | null = null;
  let companyName = input.companyName.trim();

  if (input.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });
    if (company) {
      companyId = company.id;
      companyName = company.name;
    }
  }

  // Validate opportunity if opportunityId is provided
  let opportunityId: string | null = null;
  if (input.opportunityId) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: input.opportunityId },
    });
    if (opp) {
      opportunityId = opp.id;
      if (!companyId && opp.companyId) {
        companyId = opp.companyId;
      }
    }
  }

  const referral = await prisma.referralRequest.create({
    data: {
      requesterId,
      recipientId: input.recipientId,
      companyId,
      companyName,
      roleTitle: input.roleTitle.trim(),
      opportunityId,
      message: input.message.trim(),
      resumeUrl: input.resumeUrl || null,
      status: "PENDING",
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
        },
      },
      opportunity: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
    },
  });

  createNotification({
    recipientId: input.recipientId,
    type: "REFERRAL_REQUEST",
    title: "New Referral Request",
    message: `${referral.requester.name} requested an institutional referral for ${input.roleTitle} at ${companyName}.`,
    relatedEntityType: "REFERRAL",
    relatedEntityId: referral.id,
    actionUrl: `/referrals`,
  }).catch(() => {});

  return referral;
}

/**
 * Enforces server-side privacy: only the requester, recipient, or platform admin
 * may access private referral dossier details.
 */
export async function assertCanAccessReferral(viewerUserId: string, referralId: string) {
  const referral = await prisma.referralRequest.findUnique({
    where: { id: referralId },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              headline: true,
              department: true,
              graduationYear: true,
              skills: true,
            },
          },
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: {
            select: {
              headline: true,
              company: true,
              designation: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          website: true,
        },
      },
      opportunity: {
        select: {
          id: true,
          title: true,
          type: true,
          location: true,
          workplaceType: true,
        },
      },
    },
  });

  if (!referral) {
    throw new Error("Referral request not found.");
  }

  const viewer = await prisma.user.findUnique({
    where: { id: viewerUserId },
    select: { id: true, systemRole: true },
  });

  const isAdmin = viewer && isPlatformAdmin(viewer);
  const isParty = referral.requesterId === viewerUserId || referral.recipientId === viewerUserId;

  if (!isAdmin && !isParty) {
    throw new Error("Access denied. You do not have permission to view this referral request.");
  }

  return referral;
}

/**
 * Responds to a referral request (ACCEPTED, DECLINED, COMPLETED).
 * Enforces that only the designated recipient can respond.
 */
export async function respondToReferralRequest(
  recipientUserId: string,
  referralId: string,
  input: RespondReferralInput
) {
  const referral = await prisma.referralRequest.findUnique({
    where: { id: referralId },
  });

  if (!referral) {
    throw new Error("Referral request not found.");
  }

  if (referral.recipientId !== recipientUserId) {
    throw new Error("You are not authorized to respond to this referral request.");
  }

  if (referral.status === "CANCELLED") {
    throw new Error("This referral request was cancelled by the requester.");
  }

  const updated = await prisma.referralRequest.update({
    where: { id: referralId },
    data: {
      status: input.status as ReferralStatus,
      responseNote: input.responseNote?.trim() || null,
      respondedAt: new Date(),
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
        },
      },
      opportunity: true,
    },
  });

  const statusLabel =
    input.status === "ACCEPTED"
      ? "Accepted"
      : input.status === "COMPLETED"
      ? "Completed"
      : "Declined";

  createNotification({
    recipientId: referral.requesterId,
    type: "REFERRAL_RESPONSE",
    title: `Referral Request ${statusLabel}`,
    message: `${updated.recipient.name} ${statusLabel.toLowerCase()} your referral request for ${referral.roleTitle} at ${referral.companyName}.`,
    relatedEntityType: "REFERRAL",
    relatedEntityId: referral.id,
    actionUrl: `/referrals`,
  }).catch(() => {});

  return updated;
}

/**
 * Cancels an outgoing referral request.
 * Enforces that only the original requester can cancel.
 */
export async function cancelReferralRequest(requesterUserId: string, referralId: string) {
  const referral = await prisma.referralRequest.findUnique({
    where: { id: referralId },
  });

  if (!referral) {
    throw new Error("Referral request not found.");
  }

  if (referral.requesterId !== requesterUserId) {
    throw new Error("You are not authorized to cancel this referral request.");
  }

  if (referral.status !== "PENDING") {
    throw new Error(`Cannot cancel a referral request that is already ${referral.status.toLowerCase()}.`);
  }

  const updated = await prisma.referralRequest.update({
    where: { id: referralId },
    data: {
      status: "CANCELLED",
    },
  });

  return updated;
}

/**
 * Queries referral requests for a member dashboard (Sent, Received, or All).
 */
export async function getUserReferralRequests(
  userId: string,
  options: {
    role?: "SENT" | "RECEIVED" | "ALL";
    status?: ReferralStatus;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { role = "ALL", status, page = 1, pageSize = 20 } = options;
  const skip = (page - 1) * pageSize;

  let whereClause: any = {};

  if (role === "SENT") {
    whereClause.requesterId = userId;
  } else if (role === "RECEIVED") {
    whereClause.recipientId = userId;
  } else {
    whereClause.OR = [{ requesterId: userId }, { recipientId: userId }];
  }

  if (status) {
    whereClause.status = status;
  }

  const [totalCount, items] = await Promise.all([
    prisma.referralRequest.count({ where: whereClause }),
    prisma.referralRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
            profile: {
              select: {
                headline: true,
                department: true,
                graduationYear: true,
              },
            },
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            membershipType: true,
            verificationStatus: true,
            profile: {
              select: {
                headline: true,
                company: true,
                designation: true,
              },
            },
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  return {
    items,
    disclaimer: REFERRAL_DISCLAIMER,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNextPage: skip + pageSize < totalCount,
      hasPreviousPage: page > 1,
    },
  };
}
