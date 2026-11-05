import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createCompany,
  updateCompany,
  getCompany,
  addCompanyMember,
  assertCanManageCompany,
} from "@/lib/services/company";
import {
  createOpportunity,
  updateOpportunity,
  submitOpportunityForReview,
  closeOpportunity,
  deleteOpportunity,
  getOpportunityById,
  getApprovedOpportunities,
  expireOverdueOpportunities,
  getPendingOpportunities,
  reviewOpportunity,
} from "@/lib/services/opportunity";
import {
  createOpportunitySchema,
  adminReviewOpportunitySchema,
} from "@/lib/validations/opportunity";

describe("Stage 6: Companies, Opportunities & Moderation Engine", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];
  const createdOpportunityIds: string[] = [];

  // Helper to create test user
  async function createTestUser(params: {
    email: string;
    name: string;
    membershipType: any;
    systemRole?: any;
    verificationStatus?: any;
    canPostOpportunities?: boolean;
  }) {
    const user = await prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        membershipType: params.membershipType,
        systemRole: params.systemRole || "MEMBER",
        verificationStatus: params.verificationStatus || "VERIFIED",
        accountStatus: "ACTIVE",
        canPostOpportunities: params.canPostOpportunities ?? false,
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  afterAll(async () => {
    // Clean up created entities
    for (const oppId of createdOpportunityIds) {
      await prisma.opportunity.deleteMany({ where: { id: oppId } });
    }
    for (const compId of createdCompanyIds) {
      await prisma.company.deleteMany({ where: { id: compId } });
    }
    for (const userId of createdUserIds) {
      await prisma.user.deleteMany({ where: { id: userId } });
    }
  });

  describe("Task 1: Company Management & Membership Governance", () => {
    let companyOwner: any;
    let strangerUser: any;
    let testCompanyId: string;

    it("creates a company and assigns creator as OWNER with management rights", async () => {
      companyOwner = await createTestUser({
        email: `comp_owner_${timestamp}@partner.com`,
        name: "Enterprise Talent Partner",
        membershipType: "EMPLOYER",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
      });

      const company = await createCompany(companyOwner.id, {
        name: `Optimizely Global ${timestamp}`,
        description: "Experimentation and digital experience platform.",
        website: "https://optimizely.com",
        industry: "Enterprise Software",
        location: "Dhaka, Bangladesh & Austin, TX",
      });

      testCompanyId = company.id;
      createdCompanyIds.push(company.id);

      expect(company).toBeDefined();
      expect(company.createdById).toBe(companyOwner.id);
      expect(company.members).toHaveLength(1);
      expect(company.members[0].role).toBe("OWNER");
      expect(company.members[0].canManageCompany).toBe(true);
      expect(company.members[0].canPostOpportunities).toBe(true);
    });

    it("allows authorized company owner/admin to update company details", async () => {
      const updated = await updateCompany(companyOwner.id, testCompanyId, {
        description: "Updated global digital experience leader.",
        location: "Gulshan-2, Dhaka",
      });

      expect(updated.description).toBe("Updated global digital experience leader.");
      expect(updated.location).toBe("Gulshan-2, Dhaka");
    });

    it("blocks ordinary unauthorized users from editing companies they do not manage", async () => {
      strangerUser = await createTestUser({
        email: `stranger_${timestamp}@university.edu`,
        name: "Random Student",
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
      });

      await expect(
        updateCompany(strangerUser.id, testCompanyId, {
          name: "Malicious Tampering Name",
        })
      ).rejects.toThrow("FORBIDDEN_COMPANY_MANAGEMENT");
    });

    it("allows company owner to add additional authorized recruiters/members", async () => {
      const recruiterUser = await createTestUser({
        email: `recruiter_${timestamp}@partner.com`,
        name: "Associate Recruiter",
        membershipType: "EMPLOYER",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
      });

      const membership = await addCompanyMember(companyOwner.id, testCompanyId, {
        userId: recruiterUser.id,
        role: "MEMBER",
        title: "Campus Recruiting Coordinator",
        canPostOpportunities: true,
        canManageCompany: false,
      });

      expect(membership.userId).toBe(recruiterUser.id);
      expect(membership.canPostOpportunities).toBe(true);
      expect(membership.canManageCompany).toBe(false);

      // Verify company profile lists new member
      const comp = await getCompany(testCompanyId);
      expect(comp.members).toHaveLength(2);
    });
  });

  describe("Task 2, 3 & 4: Opportunity Creation, Permissions & Admin Approval", () => {
    let adminUser: any;
    let verifiedEmployer: any;
    let verifiedStudent: any;
    let unverifiedUser: any;
    let company: any;
    let officialOppId: string;
    let communityOppId: string;

    it("sets up test actors and institutional company", async () => {
      adminUser = await createTestUser({
        email: `admin_opp_${timestamp}@university.edu`,
        name: "Career Services Dean",
        membershipType: "STAFF",
        systemRole: "ADMIN",
        canPostOpportunities: true,
      });

      verifiedEmployer = await createTestUser({
        email: `verified_emp_${timestamp}@company.com`,
        name: "Tech Recruiter",
        membershipType: "EMPLOYER",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
      });

      verifiedStudent = await createTestUser({
        email: `verified_stu_${timestamp}@university.edu`,
        name: "Student Lead Poster",
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true, // E.g., community ambassador
      });

      unverifiedUser = await createTestUser({
        email: `unverified_${timestamp}@university.edu`,
        name: "Unverified Person",
        membershipType: "STUDENT",
        verificationStatus: "PENDING",
        canPostOpportunities: false,
      });

      company = await createCompany(verifiedEmployer.id, {
        name: `Brain Station 23 ${timestamp}`,
        industry: "Information Technology",
        location: "Mohakhali DOHS, Dhaka",
      });
      createdCompanyIds.push(company.id);
    });

    it("strictly prohibits unverified members from posting opportunities", async () => {
      const futureDeadline = new Date(Date.now() + 86400000 * 14).toISOString();

      await expect(
        createOpportunity(unverifiedUser.id, {
          title: "Malicious Job Posting",
          description: "This should never be accepted by the backend permission engine.",
          companyName: "Fake Corp",
          type: "FULL_TIME",
          location: "Remote",
          deadline: futureDeadline,
          applicationMethod: "INTERNAL",
        })
      ).rejects.toThrow("FORBIDDEN_POSTING_PERMISSION");
    });

    it("prevents posting as OFFICIAL_EMPLOYER without company affiliation authorization", async () => {
      const futureDeadline = new Date(Date.now() + 86400000 * 14).toISOString();

      // verifiedStudent is not a member of company
      await expect(
        createOpportunity(verifiedStudent.id, {
          title: "Unauthorized Official Role",
          description: "Trying to claim official representation of a company I do not belong to.",
          companyId: company.id,
          companyName: company.name,
          sourceType: "OFFICIAL_EMPLOYER",
          type: "FULL_TIME",
          location: "Dhaka",
          deadline: futureDeadline,
          applicationMethod: "INTERNAL",
        })
      ).rejects.toThrow("FORBIDDEN_COMPANY_POSTING");
    });

    it("successfully creates an OFFICIAL_EMPLOYER opportunity with PENDING status", async () => {
      const futureDeadline = new Date(Date.now() + 86400000 * 30).toISOString();

      const opp = await createOpportunity(verifiedEmployer.id, {
        title: "Associate Software Engineer (Campus 2027)",
        description: "Join our cloud core engineering team working on microservices in Go and TypeScript.",
        companyId: company.id,
        companyName: company.name,
        type: "FULL_TIME",
        sourceType: "OFFICIAL_EMPLOYER",
        minCgpa: 3.25,
        minAcademicYear: "Senior",
        requiredSkills: ["Go", "TypeScript", "PostgreSQL", "Docker"],
        targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
        openToAllDepartments: false,
        salaryOrStipend: "BDT 55,000 / month",
        location: "Mohakhali, Dhaka",
        workplaceType: "HYBRID",
        applicationMethod: "INTERNAL",
        deadline: futureDeadline,
        submitForReview: true,
      });

      officialOppId = opp.id;
      createdOpportunityIds.push(opp.id);

      expect(opp.id).toBeDefined();
      expect(opp.status).toBe("PENDING");
      expect(opp.sourceType).toBe("OFFICIAL_EMPLOYER");
      expect(opp.minCgpa).toBe(3.25);
      expect(opp.openToAllDepartments).toBe(false);
      expect(opp.targetDepartments).toEqual(["Computer Science & Engineering", "Software Engineering"]);
    });

    it("successfully creates a COMMUNITY_SHARED opportunity with PENDING status", async () => {
      const futureDeadline = new Date(Date.now() + 86400000 * 20).toISOString();

      const opp = await createOpportunity(verifiedStudent.id, {
        title: "Summer 2027 Global Systems Internship",
        description: "Sharing an open internship lead from alumni network. Great for 3rd and 4th year CSE students.",
        companyName: "Databricks Inc.",
        type: "INTERNSHIP",
        sourceType: "COMMUNITY_SHARED",
        location: "San Francisco, CA (Remote Friendly)",
        workplaceType: "REMOTE",
        applicationMethod: "EXTERNAL",
        externalUrl: "https://databricks.com/company/careers/internships",
        deadline: futureDeadline,
        submitForReview: true,
      });

      communityOppId = opp.id;
      createdOpportunityIds.push(opp.id);

      expect(opp.status).toBe("PENDING");
      expect(opp.sourceType).toBe("COMMUNITY_SHARED");
      expect(opp.companyName).toBe("Databricks Inc.");
      expect(opp.externalUrl).toBe("https://databricks.com/company/careers/internships");
    });

    it("prevents general members from viewing PENDING opportunities", async () => {
      // General student trying to view pending official opp
      await expect(
        getOpportunityById(officialOppId, unverifiedUser.id)
      ).rejects.toThrow("FORBIDDEN_OPPORTUNITY_ACCESS");

      // Anonymous / null user trying to view pending opp
      await expect(
        getOpportunityById(officialOppId, null)
      ).rejects.toThrow("FORBIDDEN_OPPORTUNITY_ACCESS");

      // But the poster themselves CAN view their own pending submission
      const posterView = await getOpportunityById(officialOppId, verifiedEmployer.id);
      expect(posterView.id).toBe(officialOppId);

      // And an administrator CAN view pending opportunities
      const adminView = await getOpportunityById(officialOppId, adminUser.id);
      expect(adminView.id).toBe(officialOppId);
    });

    it("allows admin to inspect pending opportunities queue", async () => {
      const queue = await getPendingOpportunities(adminUser.id);
      expect(queue.length).toBeGreaterThanOrEqual(2);
      const found = queue.find((o) => o.id === officialOppId);
      expect(found).toBeDefined();
      expect(found?.title).toContain("Associate Software Engineer");
    });

    it("approves opportunity, records reviewer attribution, and makes it available to members", async () => {
      const approved = await reviewOpportunity(adminUser.id, {
        opportunityId: officialOppId,
        decision: "APPROVE",
      });

      expect(approved.status).toBe("APPROVED");
      expect(approved.reviewerId).toBe(adminUser.id);
      expect(approved.reviewedAt).toBeDefined();

      // Now general members CAN view the approved opportunity
      const memberView = await getOpportunityById(officialOppId, unverifiedUser.id);
      expect(memberView.id).toBe(officialOppId);
      expect(memberView.status).toBe("APPROVED");
    });

    it("requires a specific reason when admin rejects an opportunity", async () => {
      await expect(
        reviewOpportunity(adminUser.id, {
          opportunityId: communityOppId,
          decision: "REJECT",
          rejectionReason: "   ",
        })
      ).rejects.toThrow();

      const rejected = await reviewOpportunity(adminUser.id, {
        opportunityId: communityOppId,
        decision: "REJECT",
        rejectionReason: "Application link is broken or external requisition has closed.",
      });

      expect(rejected.status).toBe("REJECTED");
      expect(rejected.rejectionReason).toContain("external requisition has closed");
    });
  });

  describe("Task 5: Department Targeting & Query Filtering", () => {
    let deptPoster: any;
    let cseOppId: string;
    let allDeptOppId: string;

    it("creates department-targeted and open-to-all opportunities", async () => {
      deptPoster = await createTestUser({
        email: `dept_poster_${timestamp}@university.edu`,
        name: "Dept Chair",
        membershipType: "FACULTY",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
      });

      const futureDeadline = new Date(Date.now() + 86400000 * 30).toISOString();

      // Opportunity 1: Targeted specifically to CSE
      const opp1 = await createOpportunity(deptPoster.id, {
        title: "Undergraduate Systems Research Fellowship",
        description: "Academic lab fellowship specifically for Computer Science & Engineering students.",
        companyName: "JnU Systems Laboratory",
        type: "INTERNSHIP",
        location: "JnU Campus",
        openToAllDepartments: false,
        targetDepartments: ["Computer Science & Engineering"],
        deadline: futureDeadline,
        submitForReview: false, // DRAFT first
      });

      // Directly approve for query testing
      const approved1 = await prisma.opportunity.update({
        where: { id: opp1.id },
        data: { status: "APPROVED" },
      });
      cseOppId = approved1.id;
      createdOpportunityIds.push(cseOppId);

      // Opportunity 2: Open to all departments
      const opp2 = await createOpportunity(deptPoster.id, {
        title: "University Innovation & Leadership Fellow",
        description: "Open to passionate undergraduates across all university faculties and academic standing.",
        companyName: "Campus Career Hub",
        type: "PART_TIME",
        location: "Campus",
        openToAllDepartments: true,
        targetDepartments: [],
        deadline: futureDeadline,
        submitForReview: false,
      });

      const approved2 = await prisma.opportunity.update({
        where: { id: opp2.id },
        data: { status: "APPROVED" },
      });
      allDeptOppId = approved2.id;
      createdOpportunityIds.push(allDeptOppId);
    });

    it("correctly filters opportunities by department targeting", async () => {
      // Query 1: Filter for "Computer Science & Engineering" -> should return both (CSE-specific + Open to All)
      const cseResults = await getApprovedOpportunities({
        department: "Computer Science & Engineering",
        page: 1,
        limit: 50,
      });

      const cseItemIds = cseResults.items.map((i) => i.id);
      expect(cseItemIds).toContain(cseOppId);
      expect(cseItemIds).toContain(allDeptOppId);

      // Query 2: Filter for "Law & Justice" -> should return Open to All, but NOT the CSE-only opportunity
      const lawResults = await getApprovedOpportunities({
        department: "Law & Justice",
        page: 1,
        limit: 50,
      });

      const lawItemIds = lawResults.items.map((i) => i.id);
      expect(lawItemIds).toContain(allDeptOppId);
      expect(lawItemIds).not.toContain(cseOppId);
    });
  });

  describe("Task 7 & 8: Data Validation, Expiration & Lifecycle Integrity", () => {
    it("validates that external applications require a valid external URL", () => {
      const futureDeadline = new Date(Date.now() + 86400000 * 10).toISOString();

      const invalidPayload = {
        title: "Software Engineer",
        description: "Valid description over 20 characters long for testing purposes.",
        companyName: "Acme Corp",
        location: "Dhaka",
        applicationMethod: "EXTERNAL" as const,
        externalUrl: "", // Missing URL
        deadline: futureDeadline,
      };

      const result = createOpportunitySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("external application URL is required");
      }
    });

    it("validates that application deadlines must be strictly in the future", () => {
      const pastDeadline = new Date(Date.now() - 86400000).toISOString(); // 1 day ago

      const invalidPayload = {
        title: "Software Engineer",
        description: "Valid description over 20 characters long for testing purposes.",
        companyName: "Acme Corp",
        location: "Dhaka",
        deadline: pastDeadline,
      };

      const result = createOpportunitySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid future date");
      }
    });

    it("automatically expires overdue approved opportunities", async () => {
      const poster = await createTestUser({
        email: `expire_poster_${timestamp}@university.edu`,
        name: "Test Poster",
        membershipType: "EMPLOYER",
        canPostOpportunities: true,
      });

      // Create opportunity whose deadline has passed (set directly in database)
      const overdueOpp = await prisma.opportunity.create({
        data: {
          title: "Expired Yesterday Role",
          description: "This role deadline has passed and should be marked EXPIRED.",
          companyName: "Past Deadline Inc.",
          location: "Dhaka",
          status: "APPROVED",
          posterId: poster.id,
          deadline: new Date(Date.now() - 86400000), // 1 day ago
        },
      });
      createdOpportunityIds.push(overdueOpp.id);

      // Run automatic expiration service
      const expiredCount = await expireOverdueOpportunities();
      expect(expiredCount).toBeGreaterThanOrEqual(1);

      // Verify status in database
      const checkInDb = await prisma.opportunity.findUnique({ where: { id: overdueOpp.id } });
      expect(checkInDb?.status).toBe("EXPIRED");
    });
  });
});
