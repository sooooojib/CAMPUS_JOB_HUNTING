import { prisma } from "@/lib/prisma";
import { assertAdmin, assertCanPostOpportunity, isPlatformAdmin } from "@/lib/permissions";
import { assertCanPostForCompany } from "@/lib/services/company";
import {
  AdminReviewOpportunityInput,
  createOpportunitySchema,
  CreateOpportunityInput,
  OpportunityFilterInput,
  UpdateOpportunityInput,
} from "@/lib/validations/opportunity";

/**
 * Validates whether a user is authorized to edit or modify an opportunity.
 * Authorized if:
 * 1. Platform ADMIN
 * 2. Original Opportunity Poster (`posterId === userId`)
 * 3. Company Member with canManageCompany or role OWNER/ADMIN for the associated company
 */
export async function assertCanModifyOpportunity(userId: string, opportunityId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (isPlatformAdmin(user)) return true;

  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp) throw new Error("OPPORTUNITY_NOT_FOUND");

  if (opp.posterId === userId) return true;

  if (opp.companyId) {
    const membership = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId: opp.companyId,
          userId,
        },
      },
    });

    if (membership && (membership.role === "OWNER" || membership.role === "ADMIN" || membership.canManageCompany)) {
      return true;
    }
  }

  throw new Error("FORBIDDEN_OPPORTUNITY_MODIFICATION: You do not have permission to modify this opportunity.");
}

/**
 * Creates a new career opportunity (Job or Internship).
 * Enforces posting clearance and source-type boundaries.
 */
export async function createOpportunity(userId: string, input: CreateOpportunityInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");

  // Server-side posting clearance check (Stage 5 non-negotiable rule)
  assertCanPostOpportunity(user);

  const validated = createOpportunitySchema.parse(input);

  let companyName = validated.companyName.trim();
  let companyLogo = validated.companyLogo || null;

  // Source Type Integrity (TASK 3)
  if (validated.sourceType === "OFFICIAL_EMPLOYER") {
    if (!validated.companyId) {
      throw new Error("MISSING_COMPANY_ID: An official employer opportunity must be associated with an institutional company profile.");
    }
    // Verify poster is authorized to represent this company
    await assertCanPostForCompany(userId, validated.companyId);

    const comp = await prisma.company.findUnique({ where: { id: validated.companyId } });
    if (!comp) throw new Error("COMPANY_NOT_FOUND");
    companyName = comp.name;
    companyLogo = comp.logo || companyLogo;
  }

  // Initial status: DRAFT or PENDING review
  const status = validated.submitForReview ? "PENDING" : "DRAFT";

  const opportunity = await prisma.opportunity.create({
    data: {
      title: validated.title.trim(),
      description: validated.description.trim(),
      companyId: validated.companyId || null,
      companyName,
      companyLogo,
      type: validated.type,
      posterId: userId,
      sourceType: validated.sourceType,
      status,
      minCgpa: validated.minCgpa ?? null,
      minAcademicYear: validated.minAcademicYear?.trim() || null,
      requiredSkills: validated.requiredSkills || [],
      targetDepartments: validated.targetDepartments || [],
      openToAllDepartments: validated.openToAllDepartments,
      salaryOrStipend: validated.salaryOrStipend?.trim() || null,
      location: validated.location.trim(),
      workplaceType: validated.workplaceType,
      applicationMethod: validated.applicationMethod,
      externalUrl: validated.externalUrl?.trim() || null,
      contactEmail: validated.contactEmail?.trim() || null,
      deadline: new Date(validated.deadline),
    },
    include: {
      company: true,
      poster: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
        },
      },
    },
  });

  return opportunity;
}

/**
 * Updates an opportunity with authorization check.
 */
export async function updateOpportunity(
  userId: string,
  opportunityId: string,
  input: UpdateOpportunityInput
) {
  await assertCanModifyOpportunity(userId, opportunityId);

  const existing = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!existing) throw new Error("OPPORTUNITY_NOT_FOUND");

  // If user changed companyId and it's official employer
  if (input.companyId && existing.sourceType === "OFFICIAL_EMPLOYER") {
    await assertCanPostForCompany(userId, input.companyId);
  }

  const updated = await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      ...(input.title ? { title: input.title.trim() } : {}),
      ...(input.description ? { description: input.description.trim() } : {}),
      ...(input.companyId !== undefined ? { companyId: input.companyId || null } : {}),
      ...(input.companyName ? { companyName: input.companyName.trim() } : {}),
      ...(input.companyLogo !== undefined ? { companyLogo: input.companyLogo || null } : {}),
      ...(input.type ? { type: input.type } : {}),
      ...(input.minCgpa !== undefined ? { minCgpa: input.minCgpa } : {}),
      ...(input.minAcademicYear !== undefined ? { minAcademicYear: input.minAcademicYear } : {}),
      ...(input.requiredSkills !== undefined ? { requiredSkills: input.requiredSkills } : {}),
      ...(input.targetDepartments !== undefined ? { targetDepartments: input.targetDepartments } : {}),
      ...(input.openToAllDepartments !== undefined ? { openToAllDepartments: input.openToAllDepartments } : {}),
      ...(input.salaryOrStipend !== undefined ? { salaryOrStipend: input.salaryOrStipend } : {}),
      ...(input.location ? { location: input.location.trim() } : {}),
      ...(input.workplaceType ? { workplaceType: input.workplaceType } : {}),
      ...(input.applicationMethod ? { applicationMethod: input.applicationMethod } : {}),
      ...(input.externalUrl !== undefined ? { externalUrl: input.externalUrl || null } : {}),
      ...(input.contactEmail !== undefined ? { contactEmail: input.contactEmail || null } : {}),
      ...(input.deadline ? { deadline: new Date(input.deadline) } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
  });

  return updated;
}

/**
 * Submits a DRAFT opportunity for administrative review.
 */
export async function submitOpportunityForReview(userId: string, opportunityId: string) {
  await assertCanModifyOpportunity(userId, opportunityId);

  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp) throw new Error("OPPORTUNITY_NOT_FOUND");

  if (opp.status !== "DRAFT" && opp.status !== "REJECTED") {
    throw new Error("INVALID_STATE: Only DRAFT or REJECTED opportunities can be submitted for review.");
  }

  return prisma.opportunity.update({
    where: { id: opportunityId },
    data: { status: "PENDING" },
  });
}

/**
 * Closes an opportunity.
 */
export async function closeOpportunity(userId: string, opportunityId: string) {
  await assertCanModifyOpportunity(userId, opportunityId);

  return prisma.opportunity.update({
    where: { id: opportunityId },
    data: { status: "CLOSED" },
  });
}

/**
 * Deletes an opportunity.
 */
export async function deleteOpportunity(userId: string, opportunityId: string) {
  await assertCanModifyOpportunity(userId, opportunityId);

  return prisma.opportunity.delete({
    where: { id: opportunityId },
  });
}

/**
 * Retrieves a single opportunity by ID with access control.
 * Non-approved opportunities are visible ONLY to the poster, company managers, or administrators.
 */
export async function getOpportunityById(opportunityId: string, viewerUserId?: string | null) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      company: true,
      poster: {
        select: {
          id: true,
          name: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!opportunity) {
    throw new Error("OPPORTUNITY_NOT_FOUND: Opportunity not found.");
  }

  // If approved and not expired, public to all authenticated members
  if (opportunity.status === "APPROVED") {
    return opportunity;
  }

  // If non-approved, verify authorization
  if (!viewerUserId) {
    throw new Error("FORBIDDEN_OPPORTUNITY_ACCESS: This opportunity is pending administrative review.");
  }

  const viewer = await prisma.user.findUnique({ where: { id: viewerUserId } });
  if (isPlatformAdmin(viewer)) return opportunity;
  if (opportunity.posterId === viewerUserId) return opportunity;

  if (opportunity.companyId) {
    const membership = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId: opportunity.companyId,
          userId: viewerUserId,
        },
      },
    });
    if (membership && (membership.role === "OWNER" || membership.role === "ADMIN" || membership.canManageCompany)) {
      return opportunity;
    }
  }

  throw new Error("FORBIDDEN_OPPORTUNITY_ACCESS: This opportunity is pending administrative review.");
}

/**
 * Retrieves approved, active opportunities with filtering and department targeting.
 */
export async function getApprovedOpportunities(filters: OpportunityFilterInput) {
  const now = new Date();
  const where: any = {
    status: "APPROVED",
    deadline: { gt: now },
  };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.sourceType) {
    where.sourceType = filters.sourceType;
  }

  if (filters.workplaceType) {
    where.workplaceType = filters.workplaceType;
  }

  // Department Targeting Filter (TASK 5)
  if (filters.department) {
    where.OR = [
      { openToAllDepartments: true },
      { targetDepartments: { has: filters.department } },
    ];
  }

  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.trim();
    where.AND = [
      {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { companyName: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
          { requiredSkills: { has: q } },
        ],
      },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            location: true,
            industry: true,
          },
        },
        poster: {
          select: {
            id: true,
            name: true,
            image: true,
            membershipType: true,
          },
        },
      },
    }),
    prisma.opportunity.count({ where }),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Automatically marks overdue approved opportunities as EXPIRED.
 */
export async function expireOverdueOpportunities() {
  const now = new Date();
  const result = await prisma.opportunity.updateMany({
    where: {
      status: "APPROVED",
      deadline: { lte: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  return result.count;
}

/**
 * Fetches all PENDING opportunities for the administrative moderation queue.
 */
export async function getPendingOpportunities(adminUserId: string) {
  const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
  assertAdmin(admin);

  return prisma.opportunity.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
      poster: {
        select: {
          id: true,
          name: true,
          email: true,
          membershipType: true,
          verificationStatus: true,
        },
      },
    },
  });
}

/**
 * Administrative Opportunity Review (APPROVE / REJECT with reason).
 */
export async function reviewOpportunity(
  adminUserId: string,
  input: AdminReviewOpportunityInput
) {
  const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
  assertAdmin(admin);

  const opp = await prisma.opportunity.findUnique({ where: { id: input.opportunityId } });
  if (!opp) throw new Error("OPPORTUNITY_NOT_FOUND");

  if (opp.status !== "PENDING") {
    throw new Error("OPPORTUNITY_ALREADY_REVIEWED: Only PENDING opportunities can be reviewed.");
  }

  const now = new Date();

  if (input.decision === "APPROVE") {
    return prisma.opportunity.update({
      where: { id: input.opportunityId },
      data: {
        status: "APPROVED",
        reviewerId: adminUserId,
        reviewedAt: now,
        rejectionReason: null,
      },
      include: { company: true, poster: true },
    });
  } else {
    if (!input.rejectionReason || input.rejectionReason.trim().length === 0) {
      throw new Error("REJECTION_REASON_REQUIRED: A specific reason must be provided for rejection.");
    }

    return prisma.opportunity.update({
      where: { id: input.opportunityId },
      data: {
        status: "REJECTED",
        rejectionReason: input.rejectionReason.trim(),
        reviewerId: adminUserId,
        reviewedAt: now,
      },
      include: { company: true, poster: true },
    });
  }
}
