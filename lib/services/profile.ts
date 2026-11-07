import { prisma } from "@/lib/prisma";
import { isPlatformAdmin } from "@/lib/permissions";
import {
  MemberDirectoryQueryInput,
  OnboardingPayload,
  UpdateProfileInput,
} from "@/lib/validations/profile";
import { submitVerificationRequest } from "@/lib/services/verification";

export interface PublicProfileResult {
  id: string;
  userId: string;
  name: string;
  email?: string;
  image?: string | null;
  membershipType: string;
  verificationStatus: string;
  headline?: string | null;
  bio?: string | null;
  department?: string | null;
  academicYear?: string | null;
  graduationYear?: number | null;
  degree?: string | null;
  company?: string | null;
  designation?: string | null;
  skills: string[];
  interests: string[];
  projects: any[];
  experience: any[];
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
  showEmail: boolean;
  isOnboarded: boolean;
  createdAt: Date;
  // Private fields (only present if owner or admin)
  studentId?: string | null;
  phone?: string | null;
  isOwnerOrAdmin?: boolean;
}

/**
 * Retrieves the full profile for the authenticated member themselves.
 * Initializes an empty profile record if one does not already exist.
 */
export async function getMemberProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      membershipRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND: User does not exist.");
  }

  if (!user.profile) {
    const newProfile = await prisma.profile.create({
      data: {
        userId,
        skills: [],
        interests: [],
      },
    });
    return {
      ...user,
      profile: newProfile,
    };
  }

  return user;
}

/**
 * Retrieves a privacy-sanitized profile for public member browsing.
 *
 * PRIVACY GUARANTEES (TASK 5):
 * 1. studentId is NEVER exposed to general members.
 * 2. phone is NEVER exposed to general members.
 * 3. email is masked unless user explicitly enabled showEmail: true.
 * 4. Internal verification proof notes/documents are omitted.
 * 5. Full access is granted ONLY to the profile owner or platform ADMIN.
 */
export async function getPublicProfile(
  targetUserId: string,
  viewerUserId?: string | null
): Promise<PublicProfileResult> {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { profile: true },
  });

  if (!targetUser) {
    throw new Error("PROFILE_NOT_FOUND: Member profile not found.");
  }

  let isOwner = false;
  let isAdmin = false;

  if (viewerUserId) {
    isOwner = viewerUserId === targetUserId;
    if (!isOwner) {
      const viewer = await prisma.user.findUnique({
        where: { id: viewerUserId },
        select: { systemRole: true },
      });
      isAdmin = isPlatformAdmin(viewer);
    }
  }

  const isOwnerOrAdmin = isOwner || isAdmin;
  const profile = targetUser.profile;

  const result: PublicProfileResult = {
    id: profile?.id || targetUser.id,
    userId: targetUser.id,
    name: targetUser.name,
    image: targetUser.image,
    membershipType: targetUser.membershipType,
    verificationStatus: targetUser.verificationStatus,
    headline: profile?.headline ?? null,
    bio: profile?.bio ?? null,
    department: profile?.department ?? null,
    academicYear: profile?.academicYear ?? null,
    graduationYear: profile?.graduationYear ?? null,
    degree: profile?.degree ?? null,
    company: profile?.company ?? null,
    designation: profile?.designation ?? null,
    skills: profile?.skills ?? [],
    interests: profile?.interests ?? [],
    projects: (profile?.projects as any[]) ?? [],
    experience: (profile?.experience as any[]) ?? [],
    linkedinUrl: profile?.linkedinUrl ?? null,
    githubUrl: profile?.githubUrl ?? null,
    websiteUrl: profile?.websiteUrl ?? null,
    showEmail: profile?.showEmail ?? false,
    isOnboarded: profile?.isOnboarded ?? false,
    createdAt: targetUser.createdAt,
    isOwnerOrAdmin,
  };

  // Visibility Controls
  if (isOwnerOrAdmin) {
    result.email = targetUser.email;
    result.studentId = profile?.studentId ?? null;
    result.phone = profile?.phone ?? null;
  } else {
    // Redact private identifiers
    if (profile?.showEmail) {
      result.email = targetUser.email;
    }
    // studentId and phone are intentionally omitted (undefined)
  }

  return result;
}

/**
 * Updates an existing member profile.
 */
export async function upsertProfile(userId: string, data: UpdateProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (data.name || data.image !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.image !== undefined ? { image: data.image || null } : {}),
      },
    });
  }

  const profileData: any = {
    ...(data.headline !== undefined ? { headline: data.headline } : {}),
    ...(data.bio !== undefined ? { bio: data.bio } : {}),
    ...(data.department !== undefined ? { department: data.department } : {}),
    ...(data.studentId !== undefined ? { studentId: data.studentId } : {}),
    ...(data.academicYear !== undefined ? { academicYear: data.academicYear } : {}),
    ...(data.graduationYear !== undefined ? { graduationYear: data.graduationYear } : {}),
    ...(data.degree !== undefined ? { degree: data.degree } : {}),
    ...(data.company !== undefined ? { company: data.company } : {}),
    ...(data.designation !== undefined ? { designation: data.designation } : {}),
    ...(data.skills !== undefined ? { skills: data.skills } : {}),
    ...(data.interests !== undefined ? { interests: data.interests } : {}),
    ...(data.projects !== undefined ? { projects: data.projects as any } : {}),
    ...(data.experience !== undefined ? { experience: data.experience as any } : {}),
    ...(data.linkedinUrl !== undefined ? { linkedinUrl: data.linkedinUrl || null } : {}),
    ...(data.githubUrl !== undefined ? { githubUrl: data.githubUrl || null } : {}),
    ...(data.websiteUrl !== undefined ? { websiteUrl: data.websiteUrl || null } : {}),
    ...(data.phone !== undefined ? { phone: data.phone } : {}),
    ...(data.showEmail !== undefined ? { showEmail: data.showEmail } : {}),
    isOnboarded: true,
  };

  const updatedProfile = await prisma.profile.upsert({
    where: { userId },
    update: profileData,
    create: {
      userId,
      ...profileData,
    },
  });

  return updatedProfile;
}

/**
 * Completes the dynamic onboarding flow tailored by role.
 * Automatically provisions the profile and submits a formal verification request.
 */
export async function completeOnboarding(userId: string, payload: OnboardingPayload) {
  const { membershipType, studentData, alumniData, facultyData, employerData } = payload;

  // Update User membership type
  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipType,
      verificationStatus: "PENDING",
    },
  });

  let profileUpdates: UpdateProfileInput = {
    skills: [],
    interests: [],
    showEmail: false,
  };

  let verificationPayload: any = {
    membershipType,
  };

  switch (membershipType) {
    case "STUDENT":
      if (!studentData) throw new Error("MISSING_STUDENT_DATA: Student onboarding fields required.");
      profileUpdates = {
        studentId: studentData.studentId,
        department: studentData.department,
        academicYear: studentData.academicYear,
        degree: studentData.degree,
        graduationYear: studentData.graduationYear,
        headline: studentData.headline || `${studentData.degree} Student at Jagannath University`,
        bio: studentData.bio,
        skills: studentData.skills,
        interests: [],
        showEmail: false,
      };
      verificationPayload = {
        membershipType: "STUDENT",
        institutionalId: studentData.studentId,
        department: studentData.department,
        academicYear: studentData.academicYear,
        graduationYear: studentData.graduationYear,
        workEmail: studentData.workEmail || undefined,
        proofDetails: studentData.proofDetails || "Onboarding student credential submitted",
      };
      break;

    case "ALUMNI":
      if (!alumniData) throw new Error("MISSING_ALUMNI_DATA: Alumni onboarding fields required.");
      profileUpdates = {
        studentId: alumniData.studentId,
        department: alumniData.department,
        graduationYear: alumniData.graduationYear,
        degree: alumniData.degree,
        company: alumniData.company,
        designation: alumniData.designation,
        headline: alumniData.headline || (alumniData.designation && alumniData.company ? `${alumniData.designation} at ${alumniData.company}` : `Jagannath University Alumnus ('${alumniData.graduationYear.toString().slice(-2)})`),
        bio: alumniData.bio,
        skills: alumniData.skills,
        interests: [],
        showEmail: false,
      };
      verificationPayload = {
        membershipType: "ALUMNI",
        institutionalId: alumniData.studentId || undefined,
        department: alumniData.department,
        graduationYear: alumniData.graduationYear,
        organization: alumniData.company || undefined,
        designation: alumniData.designation || undefined,
        proofDetails: alumniData.proofDetails,
      };
      break;

    case "ADMIN":
    default:
      profileUpdates = {
        headline: "Campus Administrator",
        bio: "University platform administration and community governance.",
        skills: [],
        interests: [],
        showEmail: true,
      };
      verificationPayload = {
        membershipType: "ADMIN",
        proofDetails: "Administrative staff account",
      };
      break;
  }

  // Upsert profile
  const savedProfile = await upsertProfile(userId, profileUpdates);

  // Submit initial verification request
  const request = await submitVerificationRequest(userId, verificationPayload);

  return {
    profile: savedProfile,
    verificationRequest: request,
  };
}

/**
 * Searches and paginates the authenticated member directory.
 *
 * STRICT PRIVACY & PERMISSION ENFORCEMENT:
 * - Excludes suspended or deactivated accounts.
 * - Never returns studentId, phone, or verification proof.
 * - Only reveals email if the member explicitly allowed it (showEmail: true)
 *   or if the viewer is a platform administrator.
 * - Enriches each profile with the active user's connection status.
 */
export async function searchMemberDirectory(
  viewerUserId: string,
  options: Partial<MemberDirectoryQueryInput> = {}
) {
  const {
    q,
    department,
    membershipType,
    company,
    skill,
    interest,
    page = 1,
    pageSize = 12,
  } = options;

  const skip = (page - 1) * pageSize;

  // Determine if viewer is admin
  const viewer = await prisma.user.findUnique({
    where: { id: viewerUserId },
    select: { systemRole: true },
  });
  const isViewerAdmin = isPlatformAdmin(viewer);

  const andFilters: any[] = [{ accountStatus: "ACTIVE" }];

  if (membershipType) {
    andFilters.push({ membershipType });
  }

  if (department) {
    andFilters.push({
      profile: {
        department: { contains: department, mode: "insensitive" },
      },
    });
  }

  if (company) {
    andFilters.push({
      profile: {
        company: { contains: company, mode: "insensitive" },
      },
    });
  }

  if (skill) {
    andFilters.push({
      profile: {
        skills: { has: skill },
      },
    });
  }

  if (interest) {
    andFilters.push({
      profile: {
        interests: { has: interest },
      },
    });
  }

  if (q) {
    andFilters.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { profile: { headline: { contains: q, mode: "insensitive" } } },
        { profile: { bio: { contains: q, mode: "insensitive" } } },
        { profile: { company: { contains: q, mode: "insensitive" } } },
        { profile: { designation: { contains: q, mode: "insensitive" } } },
        { profile: { department: { contains: q, mode: "insensitive" } } },
      ],
    });
  }

  const where = { AND: andFilters };

  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: {
        profile: true,
      },
      orderBy: [
        { verificationStatus: "asc" }, // VERIFIED / PENDING prioritization
        { name: "asc" },
      ],
      skip,
      take: pageSize,
    }),
  ]);

  // Batch query connection status for these users relative to the viewer
  const targetUserIds = users.map((u) => u.id);
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { senderId: viewerUserId, receiverId: { in: targetUserIds } },
        { senderId: { in: targetUserIds }, receiverId: viewerUserId },
      ],
    },
  });

  const connectionMap = new Map<string, { status: string; connectionId: string; isSender: boolean }>();
  connections.forEach((c) => {
    const otherId = c.senderId === viewerUserId ? c.receiverId : c.senderId;
    connectionMap.set(otherId, {
      status: c.status,
      connectionId: c.id,
      isSender: c.senderId === viewerUserId,
    });
  });

  const items = users.map((u) => {
    let connectionStatus: "SELF" | "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "CONNECTED" = "NONE";
    let connectionId: string | undefined = undefined;

    if (u.id === viewerUserId) {
      connectionStatus = "SELF";
    } else {
      const conn = connectionMap.get(u.id);
      if (conn) {
        connectionId = conn.connectionId;
        if (conn.status === "ACCEPTED") {
          connectionStatus = "CONNECTED";
        } else if (conn.status === "PENDING") {
          connectionStatus = conn.isSender ? "PENDING_SENT" : "PENDING_RECEIVED";
        }
      }
    }

    const p = u.profile;
    const canSeeEmail = isViewerAdmin || u.id === viewerUserId || Boolean(p?.showEmail);

    return {
      id: u.id,
      name: u.name,
      email: canSeeEmail ? u.email : undefined,
      image: u.image,
      membershipType: u.membershipType,
      verificationStatus: u.verificationStatus,
      headline: p?.headline || null,
      bio: p?.bio || null,
      department: p?.department || null,
      graduationYear: p?.graduationYear || null,
      company: p?.company || null,
      designation: p?.designation || null,
      skills: p?.skills || [],
      interests: p?.interests || [],
      connectionStatus,
      connectionId,
    };
  });

  return {
    items,
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

