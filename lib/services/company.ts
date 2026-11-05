import { prisma } from "@/lib/prisma";
import { isPlatformAdmin, isVerifiedMember } from "@/lib/permissions";
import {
  AddCompanyMemberInput,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/lib/validations/company";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validates whether a user is authorized to manage a company.
 * Authorized if:
 * 1. Platform ADMIN
 * 2. Company Member with role OWNER or ADMIN, or canManageCompany === true
 */
export async function assertCanManageCompany(userId: string, companyId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (isPlatformAdmin(user)) return true;

  const membership = await prisma.companyMember.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId,
      },
    },
  });

  if (
    !membership ||
    (membership.role !== "OWNER" && membership.role !== "ADMIN" && !membership.canManageCompany)
  ) {
    throw new Error("FORBIDDEN_COMPANY_MANAGEMENT: You do not have permission to manage this company.");
  }

  return true;
}

/**
 * Validates whether a user can post official opportunities on behalf of a company.
 */
export async function assertCanPostForCompany(userId: string, companyId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (isPlatformAdmin(user)) return true;

  const membership = await prisma.companyMember.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId,
      },
    },
  });

  if (!membership || !membership.canPostOpportunities) {
    throw new Error("FORBIDDEN_COMPANY_POSTING: You are not authorized to post on behalf of this company.");
  }

  return true;
}

/**
 * Creates a new company and designates the creator as the OWNER.
 * Creator must be an active verified member or platform administrator.
 */
export async function createCompany(userId: string, input: CreateCompanyInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (!isPlatformAdmin(user) && !isVerifiedMember(user)) {
    throw new Error("FORBIDDEN_VERIFICATION_REQUIRED: Institutional verification required to create companies.");
  }

  let baseSlug = input.slug || slugify(input.name);
  if (!baseSlug) baseSlug = "company";

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const company = await prisma.company.create({
    data: {
      name: input.name.trim(),
      slug,
      logo: input.logo || null,
      description: input.description?.trim() || null,
      website: input.website?.trim() || null,
      industry: input.industry?.trim() || null,
      location: input.location?.trim() || null,
      createdById: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
          canManageCompany: true,
          canPostOpportunities: true,
          title: "Founder / Executive Representative",
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              membershipType: true,
            },
          },
        },
      },
    },
  });

  return company;
}

/**
 * Updates company information with authorization check.
 */
export async function updateCompany(
  userId: string,
  companyId: string,
  input: UpdateCompanyInput
) {
  await assertCanManageCompany(userId, companyId);

  const updated = await prisma.company.update({
    where: { id: companyId },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.logo !== undefined ? { logo: input.logo || null } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.website !== undefined ? { website: input.website?.trim() || null } : {}),
      ...(input.industry !== undefined ? { industry: input.industry?.trim() || null } : {}),
      ...(input.location !== undefined ? { location: input.location?.trim() || null } : {}),
    },
  });

  return updated;
}

/**
 * Retrieves public company details and active opportunities count.
 */
export async function getCompany(idOrSlug: string) {
  const company = await prisma.company.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      members: {
        select: {
          id: true,
          role: true,
          title: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              membershipType: true,
              verificationStatus: true,
            },
          },
        },
      },
      _count: {
        select: {
          opportunities: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
  });

  if (!company) {
    throw new Error("COMPANY_NOT_FOUND: Company profile not found.");
  }

  return company;
}

/**
 * Lists companies with pagination.
 */
export async function listCompanies(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.company.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            opportunities: { where: { status: "APPROVED" } },
            members: true,
          },
        },
      },
    }),
    prisma.company.count(),
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
 * Associates a member with a company.
 */
export async function addCompanyMember(
  actorUserId: string,
  companyId: string,
  input: AddCompanyMemberInput
) {
  await assertCanManageCompany(actorUserId, companyId);

  const targetUser = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!targetUser) throw new Error("USER_NOT_FOUND");

  const membership = await prisma.companyMember.upsert({
    where: {
      companyId_userId: {
        companyId,
        userId: input.userId,
      },
    },
    update: {
      role: input.role,
      title: input.title || null,
      canPostOpportunities: input.canPostOpportunities,
      canManageCompany: input.canManageCompany,
    },
    create: {
      companyId,
      userId: input.userId,
      role: input.role,
      title: input.title || null,
      canPostOpportunities: input.canPostOpportunities,
      canManageCompany: input.canManageCompany,
    },
  });

  return membership;
}

/**
 * Retrieves all companies where a user has membership rights.
 */
export async function getUserCompanies(userId: string) {
  return prisma.companyMember.findMany({
    where: { userId },
    include: {
      company: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
