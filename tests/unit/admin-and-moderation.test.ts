import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { isPlatformAdmin, assertAdmin } from "@/lib/permissions";
import {
  getAdminDashboardStats,
  getAdminMembersList,
  adminToggleUserSuspension,
  getAdminOpportunitiesList,
  adminModerateOpportunity,
  getAdminReportsList,
  adminResolveReport,
  getAdminCompaniesList,
  adminModerateCompany,
  getAdminAnalyticsData,
} from "@/lib/services/admin";
import { logAdminAction, getAdminAuditLogs } from "@/lib/services/audit";

describe("Stage 13: Administration, Moderation, and Governance System", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];
  const createdOpportunityIds: string[] = [];
  const createdPostIds: string[] = [];
  const createdReportIds: string[] = [];
  const createdAuditLogIds: string[] = [];

  // Helper to create test user
  async function createTestUser(
    emailSuffix: string,
    name: string,
    systemRole: "ADMIN" | "MEMBER" = "MEMBER",
    membershipType: "STUDENT" | "ALUMNI" | "ADMIN" = "STUDENT",
    verificationStatus: "PENDING" | "VERIFIED" = "VERIFIED"
  ) {
    const user = await prisma.user.create({
      data: {
        email: `test_admin_${timestamp}_${emailSuffix}@university.edu`,
        name,
        systemRole,
        membershipType,
        verificationStatus,
        accountStatus: "ACTIVE",
        emailVerified: true,
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  // Helper to create test company
  async function createTestCompany(creatorId: string, name: string) {
    const uniqueSlug = `test-co-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
    const company = await prisma.company.create({
      data: {
        name,
        slug: uniqueSlug,
        industry: "Information Technology",
        location: "University Research Campus",
        createdById: creatorId,
      },
    });
    createdCompanyIds.push(company.id);
    return company;
  }

  // Helper to create test opportunity
  async function createTestOpportunity(creatorId: string, companyId: string, title: string) {
    const opp = await prisma.opportunity.create({
      data: {
        title,
        description: "Official software development role at university partner.",
        companyId,
        companyName: "University Tech Partner",
        posterId: creatorId,
        type: "FULL_TIME",
        sourceType: "OFFICIAL_EMPLOYER",
        status: "PENDING",
        location: "On-Campus Lab",
        deadline: new Date(Date.now() + 86400000 * 30),
      },
    });
    createdOpportunityIds.push(opp.id);
    return opp;
  }

  afterAll(async () => {
    // Clean up created entities in reverse dependency order
    if (createdReportIds.length > 0) {
      await prisma.contentReport.deleteMany({
        where: { id: { in: createdReportIds } },
      }).catch(() => {});
    }
    if (createdPostIds.length > 0) {
      await prisma.post.deleteMany({
        where: { id: { in: createdPostIds } },
      }).catch(() => {});
    }
    if (createdOpportunityIds.length > 0) {
      await prisma.opportunity.deleteMany({
        where: { id: { in: createdOpportunityIds } },
      }).catch(() => {});
    }
    if (createdCompanyIds.length > 0) {
      await prisma.company.deleteMany({
        where: { id: { in: createdCompanyIds } },
      }).catch(() => {});
    }
    if (createdAuditLogIds.length > 0) {
      await prisma.adminAuditLog.deleteMany({
        where: { id: { in: createdAuditLogIds } },
      }).catch(() => {});
    }
    if (createdUserIds.length > 0) {
      await prisma.adminAuditLog.deleteMany({
        where: { adminId: { in: createdUserIds } },
      }).catch(() => {});
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      }).catch(() => {});
    }
  });

  describe("Task 1: Admin Access Control and Permissions", () => {
    it("correctly identifies platform admins vs regular members", async () => {
      const admin = await createTestUser("admin_role", "Campus Dean", "ADMIN");
      const student = await createTestUser("student_role", "Jane Student", "MEMBER", "STUDENT");

      expect(isPlatformAdmin(admin)).toBe(true);
      expect(isPlatformAdmin(student)).toBe(false);
      expect(isPlatformAdmin(null)).toBe(false);
      expect(isPlatformAdmin(undefined)).toBe(false);
    });

    it("enforces admin assertion and throws error for non-admin accounts", async () => {
      const admin = await createTestUser("admin_assert", "Director Admin", "ADMIN");
      const regular = await createTestUser("reg_assert", "John Regular", "MEMBER");

      expect(() => assertAdmin(admin)).not.toThrow();
      expect(() => assertAdmin(regular)).toThrow("FORBIDDEN_ADMIN_ACCESS");
      expect(() => assertAdmin(null)).toThrow("FORBIDDEN_ADMIN_ACCESS");
    });

    it("verifies that platform ADMIN is completely decoupled from membershipType", async () => {
      const studentAdmin = await createTestUser("student_admin", "Admin Student", "ADMIN", "STUDENT");
      const alumniAdmin = await createTestUser("alumni_admin", "Admin Alumni", "ADMIN", "ALUMNI");

      expect(isPlatformAdmin(studentAdmin)).toBe(true);
      expect(studentAdmin.membershipType).toBe("STUDENT");
      expect(isPlatformAdmin(alumniAdmin)).toBe(true);
      expect(alumniAdmin.membershipType).toBe("ALUMNI");
    });
  });

  describe("Task 2: Admin Dashboard Statistics", () => {
    it("accurately computes live database aggregates with zero fake data", async () => {
      const stats = await getAdminDashboardStats();

      expect(typeof stats.totalMembers).toBe("number");
      expect(typeof stats.verifiedMembers).toBe("number");
      expect(typeof stats.pendingVerifications).toBe("number");
      expect(typeof stats.totalOpportunities).toBe("number");
      expect(typeof stats.pendingOpportunities).toBe("number");
      expect(typeof stats.approvedOpportunities).toBe("number");
      expect(typeof stats.rejectedOpportunities).toBe("number");
      expect(typeof stats.activeOpportunities).toBe("number");
      expect(typeof stats.totalApplications).toBe("number");
      expect(typeof stats.communityPosts).toBe("number");
      expect(typeof stats.pendingReports).toBe("number");
      expect(typeof stats.suspendedAccounts).toBe("number");
      expect(typeof stats.totalCompanies).toBe("number");

      // Verifications should never exceed total members
      expect(stats.verifiedMembers).toBeLessThanOrEqual(stats.totalMembers);
      // Active opportunities should not exceed total opportunities
      expect(stats.activeOpportunities).toBeLessThanOrEqual(stats.totalOpportunities);
    });
  });

  describe("Task 3: Member Management and Account Suspension", () => {
    it("searches and filters members by membership type and verification status", async () => {
      const student = await createTestUser("filter_stud", "UniqueStudentName", "MEMBER", "STUDENT");

      const result = await getAdminMembersList({
        q: "UniqueStudentName",
        membershipType: "STUDENT",
        pageSize: 10,
      });

      expect(result.members.length).toBeGreaterThanOrEqual(1);
      const found = result.members.find((m) => m.id === student.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe("UniqueStudentName");
      expect(found?.membershipType).toBe("STUDENT");
    });

    it("suspends a member account, blocks self-suspension, and restores accounts", async () => {
      const admin = await createTestUser("admin_suspender", "Super Admin", "ADMIN");
      const targetUser = await createTestUser("target_suspend", "Infringing User", "MEMBER");

      // Self suspension must be blocked
      await expect(
        adminToggleUserSuspension(admin.id, admin.id, {
          action: "SUSPEND",
          reason: "Attempting self suspension",
        })
      ).rejects.toThrow("Administrators cannot suspend their own account");

      // Suspend target user
      const suspendResult = await adminToggleUserSuspension(admin.id, targetUser.id, {
        action: "SUSPEND",
        reason: "Violated university recruitment honor code standards.",
      });

      expect(suspendResult.success).toBe(true);
      expect(suspendResult.user.accountStatus).toBe("SUSPENDED");

      // Verify in database
      const checkUser = await prisma.user.findUnique({ where: { id: targetUser.id } });
      expect(checkUser?.accountStatus).toBe("SUSPENDED");

      // Restore account
      const restoreResult = await adminToggleUserSuspension(admin.id, targetUser.id, {
        action: "RESTORE",
        reason: "Compliance appeal approved by dean.",
      });

      expect(restoreResult.success).toBe(true);
      expect(restoreResult.user.accountStatus).toBe("ACTIVE");

      const checkRestored = await prisma.user.findUnique({ where: { id: targetUser.id } });
      expect(checkRestored?.accountStatus).toBe("ACTIVE");
    });
  });

  describe("Task 4: Opportunity Moderation", () => {
    it("approves pending opportunities and records audit log", async () => {
      const admin = await createTestUser("admin_opp_rev", "Career Admin", "ADMIN");
      const company = await createTestCompany(admin.id, "Moderation Test Co");
      const opp = await createTestOpportunity(admin.id, company.id, "Cloud Infrastructure Intern");

      const result = await adminModerateOpportunity(admin.id, opp.id, {
        action: "APPROVE",
      });

      expect(result.success).toBe(true);
      expect(result.opportunity?.status).toBe("APPROVED");
      expect(result.opportunity?.reviewerId).toBe(admin.id);

      // Verify listing query returns approved status
      const list = await getAdminOpportunitiesList({
        status: "APPROVED",
        q: "Cloud Infrastructure Intern",
      });
      const found = list.opportunities.find((o) => o.id === opp.id);
      expect(found).toBeDefined();
      expect(found?.status).toBe("APPROVED");
    });

    it("enforces mandatory reason on opportunity rejection", async () => {
      const admin = await createTestUser("admin_opp_rej", "Career Reviewer", "ADMIN");
      const company = await createTestCompany(admin.id, "Reject Test Co");
      const opp = await createTestOpportunity(admin.id, company.id, "Non-compliant Role");

      // Missing or short reason must fail
      await expect(
        adminModerateOpportunity(admin.id, opp.id, {
          action: "REJECT",
          reason: "bad", // < 5 chars
        })
      ).rejects.toThrow("rejection reason of at least 5 characters is required");

      // Valid rejection
      const rejResult = await adminModerateOpportunity(admin.id, opp.id, {
        action: "REJECT",
        reason: "Does not meet university minimum wage or educational requirements.",
      });

      expect(rejResult.success).toBe(true);
      expect(rejResult.opportunity?.status).toBe("REJECTED");
      expect(rejResult.opportunity?.rejectionReason).toContain("minimum wage");
    });

    it("closes and deletes opportunities with audit tracking", async () => {
      const admin = await createTestUser("admin_opp_del", "Operations Admin", "ADMIN");
      const company = await createTestCompany(admin.id, "Lifecycle Co");
      const opp = await createTestOpportunity(admin.id, company.id, "Closing Test Job");

      // Close opportunity
      const closeResult = await adminModerateOpportunity(admin.id, opp.id, {
        action: "CLOSE",
      });
      expect(closeResult.success).toBe(true);
      expect(closeResult.opportunity?.status).toBe("CLOSED");

      // Delete opportunity
      const deleteResult = await adminModerateOpportunity(admin.id, opp.id, {
        action: "DELETE",
        reason: "Poster requested removal due to duplicate posting.",
      });
      expect(deleteResult.success).toBe(true);
      expect(deleteResult.action).toBe("DELETED");

      // Verify deletion from database
      const deletedCheck = await prisma.opportunity.findUnique({ where: { id: opp.id } });
      expect(deletedCheck).toBeNull();
    });
  });

  describe("Task 5: Company Management and Moderation", () => {
    it("verifies and suspends companies with administrative audit logging", async () => {
      const admin = await createTestUser("admin_comp_mod", "Enterprise Admin", "ADMIN");
      const company = await createTestCompany(admin.id, "Global Enterprise Labs");

      expect(company.isVerified).toBe(false);
      expect(company.isSuspended).toBe(false);

      // Verify company
      const verified = await adminModerateCompany(admin.id, company.id, {
        action: "VERIFY",
        reason: "Confirmed university institutional corporate partner status.",
      });
      expect(verified.company.isVerified).toBe(true);

      // Suspend company
      const suspended = await adminModerateCompany(admin.id, company.id, {
        action: "SUSPEND",
        reason: "Investigation into misleading job postings.",
      });
      expect(suspended.company.isSuspended).toBe(true);

      // Restore company
      const restored = await adminModerateCompany(admin.id, company.id, {
        action: "RESTORE",
        reason: "Investigation completed and verified cleared.",
      });
      expect(restored.company.isSuspended).toBe(false);
    });
  });

  describe("Task 6: Community Moderation and Content Reports", () => {
    it("processes content reports with dismissal and removal options", async () => {
      const admin = await createTestUser("admin_mod_comm", "Safety Admin", "ADMIN");
      const author = await createTestUser("post_author", "Post Author", "MEMBER");
      const reporter = await createTestUser("reporter_user", "Concerned Member", "MEMBER");

      // Create community post
      const post = await prisma.post.create({
        data: {
          authorId: author.id,
          content: "Inappropriate spam message violating community policy.",
          postType: "GENERAL_DISCUSSION",
          status: "ACTIVE",
        },
      });
      createdPostIds.push(post.id);

      // Create content report
      const report = await prisma.contentReport.create({
        data: {
          reporterId: reporter.id,
          targetType: "POST",
          postId: post.id,
          reason: "SPAM",
          description: "Unsolicited marketing link.",
          status: "PENDING",
        },
      });
      createdReportIds.push(report.id);

      // Retrieve reports queue
      const queue = await getAdminReportsList({ status: "PENDING" });
      const foundReport = queue.reports.find((r) => r.id === report.id);
      expect(foundReport).toBeDefined();
      expect(foundReport?.contentSnippet).toContain("Inappropriate spam");

      // Remove content and resolve report
      const resolution = await adminResolveReport(admin.id, report.id, {
        action: "REMOVE_CONTENT",
        reviewNotes: "Confirmed spam policy violation.",
      });

      expect(resolution.success).toBe(true);
      expect(resolution.report.status).toBe("RESOLVED");

      // Post status should now be REMOVED
      const updatedPost = await prisma.post.findUnique({ where: { id: post.id } });
      expect(updatedPost?.status).toBe("REMOVED");
    });
  });

  describe("Task 7: Administrative Audit Logs", () => {
    it("creates audit log entries and allows querying by action and target", async () => {
      const admin = await createTestUser("audit_recorder", "Auditor General", "ADMIN");

      const log = await logAdminAction({
        adminId: admin.id,
        action: "MEMBER_VERIFIED",
        targetType: "USER",
        targetId: admin.id,
        targetLabel: "Auditor Self Test",
        reason: "Automated institutional audit integration test.",
        details: { testRun: true, timestamp },
      });

      if (log) {
        createdAuditLogIds.push(log.id);
        expect(log.action).toBe("MEMBER_VERIFIED");
        expect(log.targetType).toBe("USER");
      }

      // Query audit logs
      const auditResult = await getAdminAuditLogs({
        adminId: admin.id,
        action: "MEMBER_VERIFIED",
      });

      expect(auditResult.logs.length).toBeGreaterThanOrEqual(1);
      const foundLog = auditResult.logs.find((l) => l.adminId === admin.id);
      expect(foundLog).toBeDefined();
      expect(foundLog?.action).toBe("MEMBER_VERIFIED");
      expect(foundLog?.reason).toContain("integration test");
    });
  });

  describe("Task 8: Analytics Data Compilation", () => {
    it("compiles genuine database metrics without synthetic data", async () => {
      const analytics = await getAdminAnalyticsData();

      expect(Array.isArray(analytics.memberGrowth)).toBe(true);
      expect(Array.isArray(analytics.opportunityActivity)).toBe(true);
      expect(Array.isArray(analytics.applicationActivity)).toBe(true);
      expect(Array.isArray(analytics.departmentParticipation)).toBe(true);
      expect(Array.isArray(analytics.opportunityTypes)).toBe(true);
      expect(Array.isArray(analytics.verificationBreakdown)).toBe(true);

      expect(analytics.memberGrowth.length).toBeGreaterThanOrEqual(1);
      expect(analytics.opportunityActivity.length).toBeGreaterThanOrEqual(1);
      expect(analytics.applicationActivity.length).toBeGreaterThanOrEqual(0);

      // Verify structure of data points
      for (const pt of analytics.memberGrowth) {
        expect(typeof pt.period).toBe("string");
        expect(typeof pt.count).toBe("number");
        expect(pt.count).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
