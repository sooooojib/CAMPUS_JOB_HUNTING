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
      company: {
        include: {
          members: true,
        },
      },
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
      company: {
        include: {
          members: true,
        },
      },
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
export async function getApprovedOpportunities(
  filters: OpportunityFilterInput,
  viewerUserId?: string
) {
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

  if (filters.companyId) {
    where.companyId = filters.companyId;
  }

  if (filters.companyName) {
    where.companyName = { contains: filters.companyName.trim(), mode: "insensitive" };
  }

  if (filters.location) {
    where.location = { contains: filters.location.trim(), mode: "insensitive" };
  }

  if (filters.skill) {
    where.requiredSkills = { has: filters.skill.trim() };
  }

  if (filters.maxMinCgpa !== undefined && filters.maxMinCgpa !== null) {
    where.OR = [
      { minCgpa: null },
      { minCgpa: { lte: filters.maxMinCgpa } },
    ];
  }

  if (filters.openToAllDepartments === true) {
    where.openToAllDepartments = true;
  } else if (filters.department) {
    // If a specific department is filtered
    where.OR = [
      { openToAllDepartments: true },
      { targetDepartments: { has: filters.department } },
    ];
  }

  if (filters.bookmarkedOnly && viewerUserId) {
    where.bookmarks = {
      some: {
        userId: viewerUserId,
      },
    };
  }

  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.trim();
    const queryFilter = {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { companyName: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { requiredSkills: { has: q } },
      ],
    };

    if (where.AND) {
      where.AND.push(queryFilter);
    } else {
      where.AND = [queryFilter];
    }
  }

  const page = filters.page || 1;
  const limit = filters.limit || 12;
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
            website: true,
          },
        },
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
    }),
    prisma.opportunity.count({ where }),
  ]);

  // Check bookmarks if viewer is logged in
  let bookmarkedSet = new Set<string>();
  if (viewerUserId && items.length > 0) {
    const bookmarks = await prisma.opportunityBookmark.findMany({
      where: {
        userId: viewerUserId,
        opportunityId: { in: items.map((i) => i.id) },
      },
      select: { opportunityId: true },
    });
    bookmarkedSet = new Set(bookmarks.map((b) => b.opportunityId));
  }

  const decoratedItems = items.map((opp) => ({
    ...opp,
    isBookmarked: bookmarkedSet.has(opp.id),
  }));

  return {
    items: decoratedItems,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
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
      company: {
        include: {
          members: true,
        },
      },
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

/**
 * Toggles an opportunity bookmark for an authenticated user.
 * Returns { bookmarked: boolean }.
 */
export async function toggleOpportunityBookmark(userId: string, opportunityId: string) {
  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, status: true },
  });
  if (!opp) throw new Error("OPPORTUNITY_NOT_FOUND");

  const existing = await prisma.opportunityBookmark.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  });

  if (existing) {
    await prisma.opportunityBookmark.delete({
      where: { id: existing.id },
    });
    return { bookmarked: false };
  } else {
    await prisma.opportunityBookmark.create({
      data: {
        userId,
        opportunityId,
      },
    });
    return { bookmarked: true };
  }
}

/**
 * Checks whether an opportunity is bookmarked by a specific user.
 */
export async function isOpportunityBookmarked(userId: string, opportunityId: string) {
  const bookmark = await prisma.opportunityBookmark.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  });
  return !!bookmark;
}

/**
 * Retrieves opportunities bookmarked by a user.
 */
export async function getUserBookmarkedOpportunities(
  userId: string,
  page = 1,
  limit = 12
) {
  const skip = (page - 1) * limit;

  const [bookmarks, total] = await Promise.all([
    prisma.opportunityBookmark.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        opportunity: {
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
        },
      },
    }),
    prisma.opportunityBookmark.count({ where: { userId } }),
  ]);

  const items = bookmarks.map((b) => ({
    ...b.opportunity,
    isBookmarked: true,
    savedAt: b.createdAt,
  }));

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Retrieves all opportunities authored by a member with status breakdown.
 */
export async function getUserAuthoredOpportunities(
  userId: string,
  statusFilter?: string
) {
  const where: any = { posterId: userId };
  if (statusFilter && statusFilter !== "ALL") {
    where.status = statusFilter;
  }

  const [items, counts] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        company: true,
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    }),
    prisma.opportunity.groupBy({
      by: ["status"],
      where: { posterId: userId },
      _count: {
        id: true,
      },
    }),
  ]);

  const statusCounts: Record<string, number> = {
    ALL: 0,
    DRAFT: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    CLOSED: 0,
    EXPIRED: 0,
  };

  let allTotal = 0;
  for (const c of counts) {
    statusCounts[c.status] = c._count.id;
    allTotal += c._count.id;
  }
  statusCounts.ALL = allTotal;

  return {
    items,
    statusCounts,
  };
}

/**
 * Retrieves related active opportunities (sharing similar department or opportunity type).
 */
export async function getRelatedOpportunities(opportunityId: string, limit = 3) {
  const target = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: {
      id: true,
      type: true,
      targetDepartments: true,
      openToAllDepartments: true,
    },
  });

  if (!target) return [];

  const now = new Date();
  const related = await prisma.opportunity.findMany({
    where: {
      id: { not: opportunityId },
      status: "APPROVED",
      deadline: { gt: now },
      OR: [
        { type: target.type },
        { openToAllDepartments: true },
        ...(target.targetDepartments.length > 0
          ? [{ targetDepartments: { hasSome: target.targetDepartments } }]
          : []),
      ],
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          location: true,
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
  });

  return related;
}
