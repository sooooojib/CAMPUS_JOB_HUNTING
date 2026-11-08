import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { isPlatformAdmin, assertAdmin } from "@/lib/permissions";
import {
  submitVerificationRequest,
  reviewVerificationRequest,
  getPendingVerificationRequests,
} from "@/lib/services/verification";
import {
  createOpportunity,
  submitOpportunityForReview,
  getApprovedOpportunities,
  getOpportunityById,
  toggleOpportunityBookmark,
  isOpportunityBookmarked,
} from "@/lib/services/opportunity";
import { createCompany } from "@/lib/services/company";
import {
  submitInternalApplication,
  getUserApplications,
  withdrawApplication,
  updateApplicationStatus,
  assertCanManageApplicantsForOpportunity,
} from "@/lib/services/application";
import { saveUploadedResume } from "@/lib/services/resume";
import { calculateSkillMatch, evaluateEligibility } from "@/lib/services/matching";
import { createCommunityPost, addPostComment, togglePostReaction } from "@/lib/services/community";
import { sendConnectionRequest, respondToConnectionRequest } from "@/lib/services/connection";
import { createReferralRequest, respondToReferralRequest } from "@/lib/services/referral";
import { getUserNotifications } from "@/lib/services/notification";
import {
  getAdminDashboardStats,
  getAdminMembersList,
  adminToggleUserSuspension,
  getAdminOpportunitiesList,
  adminModerateOpportunity,
  getAdminReportsList,
  adminResolveReport,
  getAdminAnalyticsData,
} from "@/lib/services/admin";
import { getAdminAuditLogs } from "@/lib/services/audit";

describe("Stage 14: Comprehensive User Workflow & Security Tests", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];
  const createdOpportunityIds: string[] = [];
  const createdApplicationIds: string[] = [];
  const createdResumeIds: string[] = [];
  const createdPostIds: string[] = [];
  const createdReportIds: string[] = [];
  const createdConnectionIds: string[] = [];
  const createdReferralIds: string[] = [];

  // Helper to create fresh user
  async function registerUser(
    roleSuffix: string,
    name: string,
    membershipType: "STUDENT" | "ALUMNI" | "ADMIN" = "STUDENT",
    systemRole: "MEMBER" | "ADMIN" = "MEMBER"
  ) {
    const user = await prisma.user.create({
      data: {
        email: `wf_${timestamp}_${roleSuffix}@university.edu`,
        name,
        membershipType,
        systemRole,
        verificationStatus: "PENDING",
        accountStatus: "ACTIVE",
        emailVerified: false,
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  afterAll(async () => {
    // Clean up created entities in reverse dependency order
    if (createdReferralIds.length > 0) {
      await prisma.referralRequest.deleteMany({ where: { id: { in: createdReferralIds } } }).catch(() => {});
    }
    if (createdConnectionIds.length > 0) {
      await prisma.connection.deleteMany({ where: { id: { in: createdConnectionIds } } }).catch(() => {});
    }
    if (createdReportIds.length > 0) {
      await prisma.contentReport.deleteMany({ where: { id: { in: createdReportIds } } }).catch(() => {});
    }
    if (createdPostIds.length > 0) {
      await prisma.post.deleteMany({ where: { id: { in: createdPostIds } } }).catch(() => {});
    }
    if (createdApplicationIds.length > 0) {
      await prisma.applicationStatusHistory.deleteMany({ where: { applicationId: { in: createdApplicationIds } } }).catch(() => {});
      await prisma.application.deleteMany({ where: { id: { in: createdApplicationIds } } }).catch(() => {});
    }
    if (createdResumeIds.length > 0) {
      await prisma.resume.deleteMany({ where: { id: { in: createdResumeIds } } }).catch(() => {});
    }
    if (createdOpportunityIds.length > 0) {
      await prisma.opportunityBookmark.deleteMany({ where: { opportunityId: { in: createdOpportunityIds } } }).catch(() => {});
      await prisma.opportunity.deleteMany({ where: { id: { in: createdOpportunityIds } } }).catch(() => {});
    }
    if (createdCompanyIds.length > 0) {
      await prisma.companyMember.deleteMany({ where: { companyId: { in: createdCompanyIds } } }).catch(() => {});
      await prisma.company.deleteMany({ where: { id: { in: createdCompanyIds } } }).catch(() => {});
    }
    if (createdUserIds.length > 0) {
      await prisma.adminAuditLog.deleteMany({ where: { adminId: { in: createdUserIds } } }).catch(() => {});
      await prisma.notification.deleteMany({ where: { recipientId: { in: createdUserIds } } }).catch(() => {});
      await prisma.membershipRequest.deleteMany({ where: { userId: { in: createdUserIds } } }).catch(() => {});
      await prisma.profile.deleteMany({ where: { userId: { in: createdUserIds } } }).catch(() => {});
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } }).catch(() => {});
    }
  });

  describe("Workflow A: Student Complete Journey", () => {
    let student: any;
    let admin: any;
    let employer: any;
    let company: any;
    let opportunity: any;
    let resume: any;

    it("Step 1 & 2: Student registers and verifies institutional email", async () => {
      student = await registerUser("student_wf", "Alex Student", "STUDENT");
      expect(student.emailVerified).toBe(false);
      expect(student.verificationStatus).toBe("PENDING");

      // Verify email
      const verifiedEmailUser = await prisma.user.update({
        where: { id: student.id },
        data: { emailVerified: true },
      });
      expect(verifiedEmailUser.emailVerified).toBe(true);
      student = verifiedEmailUser;
    });

    it("Step 3 & 4: Submits university details and receives registrar verification", async () => {
      admin = await registerUser("admin_wf", "Campus Dean", "ADMIN", "ADMIN");
      await prisma.user.update({ where: { id: admin.id }, data: { emailVerified: true, verificationStatus: "VERIFIED" } });

      const request = await submitVerificationRequest(student.id, {
        membershipType: "STUDENT",
        institutionalId: "STU-2026-9999",
        department: "Computer Science & Engineering",
        academicYear: "3rd Year",
      });
      expect(request.status).toBe("PENDING");

      // Admin approves
      const approved = await reviewVerificationRequest(admin.id, {
        requestId: request.id,
        decision: "APPROVE",
      });
      expect(approved.decision).toBe("APPROVED");
      expect(approved.request.status).toBe("APPROVED");
      student = await prisma.user.findUniqueOrThrow({ where: { id: student.id } });
      expect(student.verificationStatus).toBe("VERIFIED");
    });

    it("Step 5: Completes student profile with skills and academic metrics", async () => {
      const profile = await prisma.profile.upsert({
        where: { userId: student.id },
        update: {
          headline: "Aspiring Cloud Software Engineer",
          bio: "CS student passionate about distributed systems and cloud backends.",
          department: "Computer Science & Engineering",
          skills: ["TypeScript", "React", "PostgreSQL", "Docker"],
          currentCgpa: 3.85,
        },
        create: {
          userId: student.id,
          headline: "Aspiring Cloud Software Engineer",
          bio: "CS student passionate about distributed systems and cloud backends.",
          department: "Computer Science & Engineering",
          skills: ["TypeScript", "React", "PostgreSQL", "Docker"],
          currentCgpa: 3.85,
        },
      });
      expect(profile.skills).toContain("TypeScript");
      expect(profile.currentCgpa).toBe(3.85);
    });

    it("Step 6, 7 & 8: Browses opportunities, filters, and views details", async () => {
      // Setup alumni poster and approved opportunity
      employer = await registerUser("emp_wf", "Recruiter Jane", "ALUMNI");
      await prisma.user.update({ where: { id: employer.id }, data: { emailVerified: true, verificationStatus: "VERIFIED", canPostOpportunities: true } });

      company = await prisma.company.create({
        data: {
          name: `Nexus Systems ${timestamp}`,
          slug: `nexus-sys-${timestamp}`,
          industry: "Software Engineering",
          location: "Silicon Campus",
          createdById: employer.id,
          isVerified: true,
        },
      });
      createdCompanyIds.push(company.id);

      opportunity = await prisma.opportunity.create({
        data: {
          title: "Full Stack Engineering Intern",
          description: "Exciting 6-month software engineering internship on cloud systems.",
          companyId: company.id,
          companyName: company.name,
          posterId: employer.id,
          type: "INTERNSHIP",
          status: "APPROVED",
          location: "Silicon Campus Lab",
          workplaceType: "HYBRID",
          minCgpa: 3.5,
          requiredSkills: ["TypeScript", "React", "Docker"],
          targetDepartments: ["Computer Science & Engineering"],
          openToAllDepartments: false,
          deadline: new Date(Date.now() + 86400000 * 45),
        },
      });
      createdOpportunityIds.push(opportunity.id);

      // Search & filter approved opportunities
      const catalog = await getApprovedOpportunities({
        page: 1,
        limit: 10,
        query: "Full Stack",
        type: "INTERNSHIP",
        department: "Computer Science & Engineering",
      });
      expect(catalog.items.length).toBeGreaterThanOrEqual(1);
      const found = catalog.items.find((o) => o.id === opportunity.id);
      expect(found).toBeDefined();

      // View details
      const detail = await getOpportunityById(opportunity.id, student.id);
      expect(detail).toBeDefined();
      expect(detail?.title).toBe("Full Stack Engineering Intern");
    });

    it("Step 9 & 10: Checks eligibility and evaluates explainable skill match", async () => {
      // Eligibility check
      const studentProfile = await prisma.profile.findUnique({ where: { userId: student.id } });
      const eligibility = evaluateEligibility(
        {
          currentCgpa: studentProfile?.currentCgpa || null,
          department: studentProfile?.department || null,
          academicYear: "3rd Year",
        },
        opportunity
      );

      expect(eligibility.status).toBe("ELIGIBLE");
      expect(eligibility.isEligible).toBe(true);
      expect(eligibility.canApply).toBe(true);

      // Skill match calculation
      const match = calculateSkillMatch(
        studentProfile?.skills || [],
        opportunity.requiredSkills
      );
      expect(match.matchPercentage).toBe(100);
      expect(match.scoreColor).toBe("green");
      expect(match.matchedSkills).toContain("TypeScript");
      expect(match.matchedSkills).toContain("React");
    });

    it("Step 11: Saves opportunity to bookmarked collection", async () => {
      const bookmarkResult = await toggleOpportunityBookmark(student.id, opportunity.id);
      expect(bookmarkResult.bookmarked).toBe(true);

      const isBookmarked = await isOpportunityBookmarked(student.id, opportunity.id);
      expect(isBookmarked).toBe(true);
    });

    it("Step 12 & 13: Uploads resume and submits internal application", async () => {
      // Simulate PDF resume upload
      const dummyPdfBuffer = Buffer.from("%PDF-1.4 sample resume content for testing purposes");
      resume = await saveUploadedResume({
        userId: student.id,
        buffer: dummyPdfBuffer,
        originalFileName: "Alex_Student_Resume.pdf",
        clientMimeType: "application/pdf",
      });
      createdResumeIds.push(resume.id);
      expect(resume.id).toBeDefined();

      // Submit application
      const app = await submitInternalApplication(student.id, {
        opportunityId: opportunity.id,
        method: "INTERNAL",
        resumeId: resume.id,
        coverLetter: "I am eager to contribute my full-stack skills to Nexus Systems.",
      });
      createdApplicationIds.push(app.id);
      expect(app.status).toBe("SUBMITTED");

      // Verify duplicate application is strictly blocked
      await expect(
        submitInternalApplication(student.id, {
          opportunityId: opportunity.id,
          method: "INTERNAL",
          resumeId: resume.id,
        })
      ).rejects.toThrow("already submitted an application");
    });

    it("Step 14 & 15: Tracks application and receives notification", async () => {
      const userApps = await getUserApplications(student.id);
      expect(userApps.items.length).toBeGreaterThanOrEqual(1);
      const appRecord = userApps.items.find((a) => a.opportunityId === opportunity.id);
      expect(appRecord).toBeDefined();
      expect(appRecord?.status).toBe("SUBMITTED");

      // Verify applicant received application confirmation notification
      const notifs = await getUserNotifications(student.id);
      expect(notifs.notifications.length).toBeGreaterThanOrEqual(1);
      const foundNotif = notifs.notifications.find((n) => n.relatedEntityId === appRecord?.id);
      expect(foundNotif).toBeDefined();
    });

    it("Step 16: Interacts with the professional community feed", async () => {
      // Create post
      const post = await createCommunityPost(student.id, {
        content: "Excited to connect with university alumni working on cloud infrastructure!",
        postType: "GENERAL_DISCUSSION",
        visibility: "PUBLIC",
      });
      createdPostIds.push(post.id);
      expect(post.id).toBeDefined();

      // Comment
      const comment = await addPostComment(student.id, post.id, {
        content: "Looking forward to sharing notes with fellow peers.",
      });
      expect(comment.id).toBeDefined();

      // Reaction
      const reaction = await togglePostReaction(student.id, post.id, "INSIGHTFUL");
      expect(reaction.reacted).toBe(true);
      expect(reaction.currentReaction).toBe("INSIGHTFUL");
    });
  });

  describe("Workflow B: Alumni Complete Journey", () => {
    let alumni: any;
    let admin: any;
    let student: any;

    it("Step 1, 2, 3 & 4: Alumni registers, verifies email, submits claim, receives verification", async () => {
      alumni = await registerUser("alumni_wf", "Marcus Alumnus", "ALUMNI");
      admin = await prisma.user.findFirst({ where: { systemRole: "ADMIN" } });

      await prisma.user.update({ where: { id: alumni.id }, data: { emailVerified: true } });

      const req = await submitVerificationRequest(alumni.id, {
        membershipType: "ALUMNI",
        graduationYear: 2022,
        department: "Electrical & Computer Engineering",
        organization: "Databricks Inc.",
        designation: "Senior Software Engineer",
      });

      const approved = await reviewVerificationRequest(admin!.id, {
        requestId: req.id,
        decision: "APPROVE",
      });
      expect(approved.decision).toBe("APPROVED");
      await prisma.user.update({
        where: { id: alumni.id },
        data: { canPostOpportunities: true },
      });
      alumni = await prisma.user.findUniqueOrThrow({ where: { id: alumni.id } });
      expect(alumni.verificationStatus).toBe("VERIFIED");
      expect(alumni.canPostOpportunities).toBe(true);
    });

    it("Step 5 & 6: Shares a community opportunity lead with external apply link", async () => {
      const lead = await createOpportunity(alumni.id, {
        title: "Distributed Systems Software Engineer",
        description: "Databricks is hiring graduate engineers. Great team and learning environment.",
        companyName: "Databricks",
        type: "FULL_TIME",
        sourceType: "COMMUNITY_SHARED",
        location: "San Francisco, CA / Remote",
        workplaceType: "REMOTE",
        applicationMethod: "EXTERNAL",
        externalUrl: "https://databricks.com/careers/distributed-systems",
        deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
        openToAllDepartments: true,
      });
      createdOpportunityIds.push(lead.id);
      expect(lead.sourceType).toBe("COMMUNITY_SHARED");
      expect(lead.externalUrl).toBe("https://databricks.com/careers/distributed-systems");
    });

    it("Step 7: Connects with student member and accepts networking connection", async () => {
      student = await prisma.user.findFirst({ where: { membershipType: "STUDENT", emailVerified: true } });

      // Student sends connection request to alumni
      const conn = await sendConnectionRequest(student.id, alumni.id);
      createdConnectionIds.push(conn.id);
      expect(conn.status).toBe("PENDING");

      // Alumni accepts connection
      const accepted = await respondToConnectionRequest(alumni.id, conn.id, "ACCEPT");
      expect(accepted.status).toBe("ACCEPTED");
    });

    it("Step 8: Receives and responds to a career referral request", async () => {
      const referral = await createReferralRequest(student.id, {
        recipientId: alumni.id,
        companyName: "Databricks",
        roleTitle: "Cloud Engineer",
        message: "High honors student with extensive PostgreSQL and TypeScript experience.",
      });
      createdReferralIds.push(referral.id);
      expect(referral.status).toBe("PENDING");

      // Alumni accepts referral request
      const responded = await respondToReferralRequest(alumni.id, referral.id, {
        status: "ACCEPTED",
        responseNote: "Impressive profile! Happy to submit your resume to our engineering lead.",
      });
      expect(responded.status).toBe("ACCEPTED");
    });
  });

  describe("Workflow C: Employer & Recruiter Complete Journey", () => {
    let recruiter: any;
    let company: any;
    let opportunity: any;
    let candidate: any;

    it("Step 1, 2, 3 & 4: Recruiter registers, verifies email, and receives verification", async () => {
      recruiter = await registerUser("recruiter_wf", "Sarah Talent", "ALUMNI");
      const admin = await prisma.user.findFirst({ where: { systemRole: "ADMIN" } });

      await prisma.user.update({ where: { id: recruiter.id }, data: { emailVerified: true } });

      const req = await submitVerificationRequest(recruiter.id, {
        membershipType: "ALUMNI",
        organization: "Vercel Platform Labs",
        designation: "University Relations Lead",
        workEmail: "sarah.talent@vercel.com",
      });

      const approved = await reviewVerificationRequest(admin!.id, {
        requestId: req.id,
        decision: "APPROVE",
      });
      expect(approved.decision).toBe("APPROVED");
      recruiter = await prisma.user.findUniqueOrThrow({ where: { id: recruiter.id } });
      expect(recruiter.verificationStatus).toBe("VERIFIED");
      expect(recruiter.canPostOpportunities).toBe(true);
    });

    it("Step 5 & 6: Registers corporate company profile", async () => {
      company = await createCompany(recruiter.id, {
        name: `Vercel Labs ${timestamp}`,
        slug: `vercel-labs-${timestamp}`,
        description: "Frontend cloud infrastructure and AI platform.",
        website: "https://vercel.com",
        industry: "Cloud & DevTools",
        location: "Remote / Hybrid",
      });
      createdCompanyIds.push(company.id);
      expect(company.id).toBeDefined();
    });

    it("Step 7 & 8: Creates an official employer opportunity", async () => {
      opportunity = await createOpportunity(recruiter.id, {
        title: "Frontend Engineering Associate",
        description: "Work on Next.js, React compiler, and high-performance web applications.",
        companyId: company.id,
        companyName: company.name,
        type: "FULL_TIME",
        sourceType: "OFFICIAL_EMPLOYER",
        location: "Hybrid / Global",
        workplaceType: "HYBRID",
        applicationMethod: "INTERNAL",
        deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        salaryOrStipend: "$110,000 - $130,000 / year",
        openToAllDepartments: true,
      });
      createdOpportunityIds.push(opportunity.id);
      expect(opportunity.status).toBe("APPROVED");
      expect(opportunity.sourceType).toBe("OFFICIAL_EMPLOYER");
    });

    it("Step 9 & 10: Opportunity is live immediately and employer manages applicant pipeline", async () => {
      const admin = await prisma.user.findFirst({ where: { systemRole: "ADMIN" } });
      await adminModerateOpportunity(admin!.id, opportunity.id, { action: "APPROVE" });

      // Student applies to this opportunity
      candidate = await prisma.user.findFirst({ where: { membershipType: "STUDENT", verificationStatus: "VERIFIED" } });
      let candidateResume = await prisma.resume.findFirst({ where: { userId: candidate.id } });
      if (!candidateResume) {
        candidateResume = await saveUploadedResume({
          userId: candidate.id,
          buffer: Buffer.from("%PDF-1.4 candidate resume contents"),
          originalFileName: "Candidate_Resume.pdf",
          clientMimeType: "application/pdf",
        });
        createdResumeIds.push(candidateResume.id);
      }

      const application = await submitInternalApplication(candidate.id, {
        opportunityId: opportunity.id,
        method: "INTERNAL",
        resumeId: candidateResume.id,
        coverLetter: "Excited about frontend performance and Next.js.",
      });
      createdApplicationIds.push(application.id);

      // Recruiter checks access
      const access = await assertCanManageApplicantsForOpportunity(opportunity.id, recruiter.id, recruiter.systemRole);
      expect(access.opportunity.id).toBe(opportunity.id);

      // Third-party member blocked from managing applicants (Anti-IDOR)
      const randomUser = await registerUser("intruder_wf", "Unauthorized User", "STUDENT");
      await expect(
        assertCanManageApplicantsForOpportunity(opportunity.id, randomUser.id, randomUser.systemRole)
      ).rejects.toThrow("Unauthorized");

      // Recruiter advances candidate status to SHORTLISTED
      const updated = await updateApplicationStatus({
        applicationId: application.id,
        reviewerId: recruiter.id,
        reviewerRole: recruiter.systemRole,
        status: "SHORTLISTED",
        note: "Resume and background match our engineering bar.",
      });
      expect(updated.status).toBe("SHORTLISTED");
    });
  });

  describe("Workflow D: Administrator Complete Command & Moderation", () => {
    let admin: any;

    it("Step 1: Admin session authentication and clearance assertion", async () => {
      admin = await prisma.user.findFirst({ where: { systemRole: "ADMIN" } });
      expect(isPlatformAdmin(admin)).toBe(true);
      expect(() => assertAdmin(admin)).not.toThrow();
    });

    it("Step 2 & 3: Reviews pending verification requests and approves/rejects with feedback", async () => {
      const pendingQueue = await getPendingVerificationRequests(admin.id);
      expect(Array.isArray(pendingQueue)).toBe(true);

      // Create test pending request to reject
      const rejectTarget = await registerUser("rej_user", "Rejected Applicant", "STUDENT");
      const rejReq = await submitVerificationRequest(rejectTarget.id, {
        membershipType: "STUDENT",
        institutionalId: "INVALID-ID-000",
        department: "Unknown",
      });

      const rejectResult = await reviewVerificationRequest(admin.id, {
        requestId: rejReq.id,
        decision: "REJECT",
        rejectionReason: "Institutional ID not found in campus registrar registry.",
      });
      expect(rejectResult.request.status).toBe("REJECTED");
      expect(rejectResult.request.rejectionReason).toContain("campus registrar");
    });

    it("Step 4 & 5: Reviews opportunities and moderates listings", async () => {
      const oppList = await getAdminOpportunitiesList({ page: 1, pageSize: 10 });
      expect(oppList.opportunities.length).toBeGreaterThanOrEqual(1);

      // Create opportunity to test moderation
      const poster = await prisma.user.findFirst({ where: { verificationStatus: "VERIFIED" } });
      const testOpp = await prisma.opportunity.create({
        data: {
          title: "Temporary Review Opportunity",
          description: "Testing admin opportunity review workflows.",
          companyName: "Review Lab",
          posterId: poster!.id,
          type: "FULL_TIME",
          status: "PENDING",
          location: "Campus",
          deadline: new Date(Date.now() + 86400000 * 30),
        },
      });
      createdOpportunityIds.push(testOpp.id);

      // Approve
      const approved = await adminModerateOpportunity(admin.id, testOpp.id, { action: "APPROVE" });
      expect(approved.opportunity?.status).toBe("APPROVED");

      // Close
      const closed = await adminModerateOpportunity(admin.id, testOpp.id, { action: "CLOSE" });
      expect(closed.opportunity?.status).toBe("CLOSED");
    });

    it("Step 6 & 7: Reviews community reports and resolves with content removal", async () => {
      const author = await prisma.user.findFirst({ where: { membershipType: "STUDENT" } });
      const reporter = await prisma.user.findFirst({ where: { membershipType: "ALUMNI" } });

      const flaggedPost = await prisma.post.create({
        data: {
          authorId: author!.id,
          content: "Spam content violating university honor code guidelines.",
          postType: "GENERAL_DISCUSSION",
          status: "ACTIVE",
        },
      });
      createdPostIds.push(flaggedPost.id);

      const report = await prisma.contentReport.create({
        data: {
          reporterId: reporter!.id,
          targetType: "POST",
          postId: flaggedPost.id,
          reason: "SPAM",
          description: "Commercial solicitation.",
          status: "PENDING",
        },
      });
      createdReportIds.push(report.id);

      // Admin resolves report by removing content
      const resolved = await adminResolveReport(admin.id, report.id, {
        action: "REMOVE_CONTENT",
        reviewNotes: "Confirmed unauthorized commercial promotion.",
      });
      expect(resolved.report.status).toBe("RESOLVED");

      const checkPost = await prisma.post.findUnique({ where: { id: flaggedPost.id } });
      expect(checkPost?.status).toBe("REMOVED");
    });

    it("Step 8: Manages users and suspends/restores accounts with audit trail", async () => {
      const targetUser = await registerUser("violation_user", "Suspended Account", "STUDENT");

      // Suspend
      const suspended = await adminToggleUserSuspension(admin.id, targetUser.id, {
        action: "SUSPEND",
        reason: "Severe policy breach under review.",
      });
      expect(suspended.user.accountStatus).toBe("SUSPENDED");

      // Restore
      const restored = await adminToggleUserSuspension(admin.id, targetUser.id, {
        action: "RESTORE",
        reason: "Review completed; student warned.",
      });
      expect(restored.user.accountStatus).toBe("ACTIVE");
    });

    it("Step 9 & 10: Inspects live platform analytics and immutable audit trail", async () => {
      // Analytics
      const stats = await getAdminDashboardStats();
      expect(stats.totalMembers).toBeGreaterThanOrEqual(1);
      expect(stats.verifiedMembers).toBeGreaterThanOrEqual(1);

      const analytics = await getAdminAnalyticsData();
      expect(analytics.memberGrowth.length).toBeGreaterThanOrEqual(1);
      expect(analytics.opportunityTypes.length).toBeGreaterThanOrEqual(1);

      // Audit Trail
      const audit = await getAdminAuditLogs({ adminId: admin.id });
      expect(audit.logs.length).toBeGreaterThanOrEqual(1);
      for (const log of audit.logs) {
        expect(log.adminId).toBe(admin.id);
        expect(typeof log.action).toBe("string");
      }
    });
  });
});
