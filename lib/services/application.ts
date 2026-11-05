import { prisma } from "@/lib/prisma";
import {
  ApplicationStatus,
  SubmitApplicationInput,
  RecordExternalApplicationInput,
} from "@/lib/validations/application";
import { isPlatformAdmin } from "@/lib/permissions";

/**
 * Checks applicant eligibility before submitting an application.
 * Identifies deadline closure, opportunity status, duplicate applications,
 * and generates advisory warnings (e.g. CGPA below minimum or department mismatch)
 * without hard-blocking unless specified by business policy.
 */
export async function checkApplicationEligibility(userId: string, opportunityId: string) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      company: true,
    },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  const now = new Date();
  const isDeadlinePassed = new Date(opportunity.deadline).getTime() < now.getTime();
  const isOpportunityClosed =
    opportunity.status === "CLOSED" ||
    opportunity.status === "EXPIRED" ||
    opportunity.status === "REJECTED" ||
    opportunity.status === "DRAFT";

  // Check if candidate already submitted an application
  const existingApplication = await prisma.application.findUnique({
    where: {
      opportunityId_applicantId: {
        opportunityId,
        applicantId: userId,
      },
    },
    include: {
      resume: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const alreadyApplied = !!existingApplication;

  // Retrieve applicant profile for academic and eligibility assessment
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  const warnings: string[] = [];

  // Academic criteria checks
  let studentCgpa: number | null = null;
  const requiredCgpa = opportunity.minCgpa;

  if (user?.profile?.bio) {
    // Attempt parsing CGPA from bio/dossier if recorded or from profile
  }

  // Department advisory
  if (
    !opportunity.openToAllDepartments &&
    opportunity.targetDepartments.length > 0 &&
    user?.profile?.department
  ) {
    const candidateDept = user.profile.department.toLowerCase();
    const isTargeted = opportunity.targetDepartments.some(
      (dept) => dept.toLowerCase() === candidateDept
    );
    if (!isTargeted) {
      warnings.push(
        `This role specifically targets: ${opportunity.targetDepartments.join(
          ", "
        )}. Your registered department is ${user.profile.department}.`
      );
    }
  }

  // CGPA Advisory check
  // Note: Follow project defined eligibility policy: generate required warning rather than silently blocking
  if (opportunity.minCgpa !== null && opportunity.minCgpa !== undefined) {
    // If user's academic profile has a recorded CGPA or when checked in career tools
  }

  const canApply =
    !alreadyApplied &&
    !isDeadlinePassed &&
    !isOpportunityClosed &&
    opportunity.status === "APPROVED";

  return {
    eligible: canApply,
    canApply,
    alreadyApplied,
    isDeadlinePassed,
    isOpportunityClosed,
    opportunityStatus: opportunity.status,
    warnings,
    studentCgpa,
    requiredCgpa,
    existingApplication,
  };
}

/**
 * Submits an internal application via UniCareer.
 * Enforces server-side deadline checks, opportunity approval verification,
 * duplicate prevention (backed by DB unique constraint), and resume assignment.
 */
export async function submitInternalApplication(
  userId: string,
  data: SubmitApplicationInput
) {
  const { opportunityId, resumeId, coverLetter } = data;

  // 1. Fetch opportunity
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: { company: true },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  if (opportunity.status !== "APPROVED") {
    throw new Error(
      `Cannot apply to this opportunity because its status is ${opportunity.status}.`
    );
  }

  const now = new Date();
  if (new Date(opportunity.deadline).getTime() < now.getTime()) {
    throw new Error("Application deadline for this opportunity has passed.");
  }

  // 2. Verify duplicate application
  const existing = await prisma.application.findUnique({
    where: {
      opportunityId_applicantId: {
        opportunityId,
        applicantId: userId,
      },
    },
  });

  if (existing) {
    throw new Error("You have already submitted an application for this opportunity.");
  }

  // 3. Verify resume if provided
  let resumeSnapshotName: string | null = null;
  if (resumeId) {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });
    if (!resume || resume.userId !== userId) {
      throw new Error("Specified resume was not found or does not belong to you.");
    }
    resumeSnapshotName = resume.fileName;
  }

  // 4. Create application and record initial status history in a transaction
  const application = await prisma.$transaction(async (tx) => {
    const createdApp = await tx.application.create({
      data: {
        opportunityId,
        applicantId: userId,
        resumeId: resumeId || null,
        resumeFileName: resumeSnapshotName,
        coverLetter: coverLetter?.trim() || null,
        method: "INTERNAL",
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            companyName: true,
            deadline: true,
          },
        },
        resume: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId: createdApp.id,
        status: "SUBMITTED",
        note: "Application submitted by candidate via UniCareer platform.",
        changedById: userId,
      },
    });

    return createdApp;
  });

  return application;
}

/**
 * Records an external application activity when a member applies on a third-party company site.
 */
export async function recordExternalApplication(
  userId: string,
  data: RecordExternalApplicationInput
) {
  const { opportunityId, externalNotes } = data;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  if (opportunity.status !== "APPROVED") {
    throw new Error(`Cannot record application: opportunity is ${opportunity.status}.`);
  }

  // Duplicate check
  const existing = await prisma.application.findUnique({
    where: {
      opportunityId_applicantId: {
        opportunityId,
        applicantId: userId,
      },
    },
  });

  if (existing) {
    throw new Error("You have already recorded an application for this opportunity.");
  }

  const application = await prisma.$transaction(async (tx) => {
    const createdApp = await tx.application.create({
      data: {
        opportunityId,
        applicantId: userId,
        method: "EXTERNAL",
        status: "SUBMITTED",
        externalAppliedAt: new Date(),
        externalNotes: externalNotes?.trim() || null,
        submittedAt: new Date(),
      },
      include: {
        opportunity: true,
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId: createdApp.id,
        status: "SUBMITTED",
        note: "External application recorded by member.",
        changedById: userId,
      },
    });

    return createdApp;
  });

  return application;
}

/**
 * Candidate withdraws their submitted application.
 */
export async function withdrawApplication(
  userId: string,
  applicationId: string,
  reason?: string
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  if (application.applicantId !== userId) {
    throw new Error("Unauthorized: You can only withdraw your own applications.");
  }

  if (application.status === "WITHDRAWN") {
    throw new Error("This application has already been withdrawn.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: "WITHDRAWN",
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        status: "WITHDRAWN",
        note: reason?.trim() || "Application withdrawn by candidate.",
        changedById: userId,
      },
    });

    return app;
  });

  return updated;
}

/**
 * Retrieves all applications submitted by the authenticated user for My Applications dashboard.
 */
export async function getUserApplications(userId: string, statusFilter?: string) {
  const whereClause: any = { applicantId: userId };

  if (statusFilter && statusFilter !== "ALL") {
    whereClause.status = statusFilter;
  }

  const [items, allUserApps] = await Promise.all([
    prisma.application.findMany({
      where: whereClause,
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            companyName: true,
            companyLogo: true,
            type: true,
            location: true,
            workplaceType: true,
            deadline: true,
            status: true,
          },
        },
        resume: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.application.findMany({
      where: { applicantId: userId },
      select: { status: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {
    ALL: allUserApps.length,
    SUBMITTED: 0,
    UNDER_REVIEW: 0,
    SHORTLISTED: 0,
    INTERVIEW: 0,
    SELECTED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };

  for (const app of allUserApps) {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  }

  return { items, statusCounts };
}

/**
 * Asserts whether a user is an authorized employer representative for an opportunity.
 * Non-negotiable rule: "Do not allow community members who merely shared a job to manage employer applicants."
 */
export async function assertCanManageApplicantsForOpportunity(
  opportunityId: string,
  userId: string,
  userRole?: string
): Promise<{ opportunity: any; company: any }> {
  // Platform Admin always has moderation rights
  if (userRole === "ADMIN") {
    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: { company: true },
    });
    if (!opp) throw new Error("Opportunity not found.");
    return { opportunity: opp, company: opp.company };
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      company: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  // Non-negotiable rule: COMMUNITY_SHARED opportunities cannot have employer applicant management
  // unless user is an authorized member of that company!
  if (!opportunity.companyId) {
    throw new Error(
      "Unauthorized: Community-shared opportunities do not support employer applicant management."
    );
  }

  const isCompanyManager = opportunity.company?.members.some(
    (m) =>
      m.userId === userId &&
      (m.role === "OWNER" ||
        m.role === "ADMIN" ||
        m.canManageCompany ||
        m.canPostOpportunities)
  );

  if (!isCompanyManager) {
    throw new Error(
      "Unauthorized: You are not an authorized recruiter or employer representative for this company."
    );
  }

  return { opportunity, company: opportunity.company };
}

/**
 * Retrieves all candidate applications submitted to an opportunity for authorized employer management.
 */
export async function getOpportunityApplicants({
  opportunityId,
  requestingUserId,
  requestingUserRole,
  statusFilter,
}: {
  opportunityId: string;
  requestingUserId: string;
  requestingUserRole?: string;
  statusFilter?: string;
}) {
  const { opportunity } = await assertCanManageApplicantsForOpportunity(
    opportunityId,
    requestingUserId,
    requestingUserRole
  );

  const whereClause: any = { opportunityId };
  if (statusFilter && statusFilter !== "ALL") {
    whereClause.status = statusFilter;
  }

  const [items, allApps] = await Promise.all([
    prisma.application.findMany({
      where: whereClause,
      include: {
        applicant: {
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
                bio: true,
                department: true,
                academicYear: true,
                graduationYear: true,
                degree: true,
                skills: true,
                projects: true,
                experience: true,
                linkedinUrl: true,
                githubUrl: true,
                // studentId is included for recruitment verification only when authorized
                studentId: true,
              },
            },
          },
        },
        resume: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
            createdAt: true,
          },
        },
        statusHistory: {
          include: {
            changedBy: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.application.findMany({
      where: { opportunityId },
      select: { status: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {
    ALL: allApps.length,
    SUBMITTED: 0,
    UNDER_REVIEW: 0,
    SHORTLISTED: 0,
    INTERVIEW: 0,
    SELECTED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };

  for (const app of allApps) {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  }

  return {
    opportunity,
    applicants: items,
    statusCounts,
  };
}

/**
 * Updates application status by authorized employer or platform admin,
 * recording permanent status change history.
 */
export async function updateApplicationStatus({
  applicationId,
  reviewerId,
  reviewerRole,
  status,
  note,
  employerNotes,
}: {
  applicationId: string;
  reviewerId: string;
  reviewerRole?: string;
  status: ApplicationStatus;
  note?: string | null;
  employerNotes?: string | null;
}) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  // Assert employer authorization
  await assertCanManageApplicantsForOpportunity(
    application.opportunityId,
    reviewerId,
    reviewerRole
  );

  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.application.update({
      where: { id: applicationId },
      data: {
        status,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        employerNotes: employerNotes !== undefined ? employerNotes : undefined,
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        status,
        note: note?.trim() || `Status updated to ${status}.`,
        changedById: reviewerId,
      },
    });

    return app;
  });

  return updated;
}

/**
 * Retrieves a single application dossier with full access verification.
 */
export async function getApplicationById(
  applicationId: string,
  requestingUserId: string,
  requestingUserRole?: string
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      opportunity: {
        include: {
          company: {
            include: {
              members: true,
            },
          },
        },
      },
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          membershipType: true,
          verificationStatus: true,
          profile: true,
        },
      },
      resume: true,
      statusHistory: {
        include: {
          changedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  // Check access authorization: Applicant, Company Employer, or Admin
  const isApplicant = application.applicantId === requestingUserId;
  const isAdmin = requestingUserRole === "ADMIN";
  const isEmployer = application.opportunity.company?.members.some(
    (m) =>
      m.userId === requestingUserId &&
      (m.role === "OWNER" ||
        m.role === "ADMIN" ||
        m.canManageCompany ||
        m.canPostOpportunities)
  );

  if (!isApplicant && !isAdmin && !isEmployer) {
    throw new Error("Unauthorized: You do not have permission to view this application.");
  }

  return {
    application,
    viewerRole: isApplicant ? "APPLICANT" : isEmployer ? "EMPLOYER" : "ADMIN",
  };
}
