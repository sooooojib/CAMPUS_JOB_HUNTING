import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  getApprovedOpportunities,
  toggleOpportunityBookmark,
  isOpportunityBookmarked,
  getUserBookmarkedOpportunities,
  getUserAuthoredOpportunities,
  getRelatedOpportunities,
  createOpportunity,
  getOpportunityById,
} from "@/lib/services/opportunity";
import { opportunityFilterSchema } from "@/lib/validations/opportunity";

describe("Stage 7: Job Browsing, Searching, and Posting Interfaces", () => {
  let studentUser: any;
  let employerUser: any;
  let testCompany: any;
  let testOpp1: any;
  let testOpp2: any;

  beforeAll(async () => {
    const timestamp = Date.now();

    // 1. Create a verified student user
    studentUser = await prisma.user.create({
      data: {
        name: `Stage 7 Student ${timestamp}`,
        email: `student_stg7_${timestamp}@university.edu`,
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        emailVerified: true,
      },
    });

    // 2. Create a verified alumni/poster user with posting clearance
    employerUser = await prisma.user.create({
      data: {
        name: `Stage 7 Recruiter ${timestamp}`,
        email: `recruiter_stg7_${timestamp}@company.com`,
        membershipType: "ALUMNI",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
        emailVerified: true,
      },
    });

    // 3. Create a test company
    testCompany = await prisma.company.create({
      data: {
        name: `TechCorp Solutions ${timestamp}`,
        slug: `techcorp-${timestamp}`,
        industry: "Information Technology",
        location: "Dhaka",
        createdById: employerUser.id,
      },
    });

    await prisma.companyMember.create({
      data: {
        companyId: testCompany.id,
        userId: employerUser.id,
        role: "OWNER",
        canPostOpportunities: true,
        canManageCompany: true,
      },
    });

    const futureDeadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // 4. Create Approved Test Opportunity 1 (Official Employer)
    testOpp1 = await prisma.opportunity.create({
      data: {
        title: `Cloud Infrastructure Systems Intern ${timestamp}`,
        description: "Develop cloud monitoring microservices and automated deployment scripts.",
        companyId: testCompany.id,
        companyName: testCompany.name,
        type: "INTERNSHIP",
        sourceType: "OFFICIAL_EMPLOYER",
        status: "APPROVED",
        posterId: employerUser.id,
        location: "Dhaka",
        workplaceType: "HYBRID",
        minCgpa: 3.2,
        requiredSkills: ["Terraform", "Go", "Docker", "AWS"],
        targetDepartments: ["Computer Science & Engineering", "Software Engineering"],
        openToAllDepartments: false,
        salaryOrStipend: "BDT 30,000 / month",
        applicationMethod: "INTERNAL",
        deadline: futureDeadline,
      },
    });

    // 5. Create Approved Test Opportunity 2 (Community Shared)
    testOpp2 = await prisma.opportunity.create({
      data: {
        title: `Junior Product Design Associate ${timestamp}`,
        description: "Work on design systems, user journeys, wireframes, and customer interviews.",
        companyName: "Global FinTech Hub",
        type: "FULL_TIME",
        sourceType: "COMMUNITY_SHARED",
        status: "APPROVED",
        posterId: employerUser.id,
        location: "Remote",
        workplaceType: "REMOTE",
        openToAllDepartments: true,
        requiredSkills: ["Figma", "Design Systems", "Prototyping"],
        salaryOrStipend: "BDT 45,000 / month",
        applicationMethod: "EXTERNAL",
        externalUrl: "https://fintechhub.com/apply",
        deadline: futureDeadline,
      },
    });
  });

  describe("1. Search and Filtering Engine", () => {
    it("filters opportunities by role type", async () => {
      const res = await getApprovedOpportunities({
        type: "INTERNSHIP",
        limit: 10,
        page: 1,
      });

      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.every((o) => o.type === "INTERNSHIP")).toBe(true);
      expect(res.items.some((o) => o.id === testOpp1.id)).toBe(true);
    });

    it("filters opportunities by workplace mode", async () => {
      const res = await getApprovedOpportunities({
        workplaceType: "REMOTE",
        limit: 10,
        page: 1,
      });

      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.every((o) => o.workplaceType === "REMOTE")).toBe(true);
      expect(res.items.some((o) => o.id === testOpp2.id)).toBe(true);
    });

    it("searches opportunities by keyword query matching title or skills", async () => {
      const res = await getApprovedOpportunities({
        query: "Terraform",
        limit: 10,
        page: 1,
      });

      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.some((o) => o.id === testOpp1.id)).toBe(true);
    });

    it("filters opportunities by department including openToAllDepartments", async () => {
      const res = await getApprovedOpportunities({
        department: "Computer Science & Engineering",
        limit: 20,
        page: 1,
      });

      // Both testOpp1 (targeted CSE) and testOpp2 (openToAllDepartments) must match
      expect(res.items.some((o) => o.id === testOpp1.id)).toBe(true);
      expect(res.items.some((o) => o.id === testOpp2.id)).toBe(true);
    });

    it("filters opportunities by maximum acceptable minimum CGPA", async () => {
      // If a student has CGPA 3.3, opportunities requiring minCgpa <= 3.3 or null should match
      const res = await getApprovedOpportunities({
        maxMinCgpa: 3.3,
        limit: 20,
        page: 1,
      });

      expect(res.items.some((o) => o.id === testOpp1.id)).toBe(true);
      expect(res.items.some((o) => o.id === testOpp2.id)).toBe(true);
    });

    it("validates and parses query parameters through opportunityFilterSchema", () => {
      const valid = opportunityFilterSchema.safeParse({
        type: "FULL_TIME",
        workplaceType: "HYBRID",
        page: "2",
        limit: "15",
      });

      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.page).toBe(2);
        expect(valid.data.limit).toBe(15);
        expect(valid.data.type).toBe("FULL_TIME");
      }
    });
  });

  describe("2. Opportunity Bookmarking System", () => {
    it("bookmarks an opportunity for an authenticated member", async () => {
      const isInitiallyBookmarked = await isOpportunityBookmarked(
        studentUser.id,
        testOpp1.id
      );
      expect(isInitiallyBookmarked).toBe(false);

      const res = await toggleOpportunityBookmark(studentUser.id, testOpp1.id);
      expect(res.bookmarked).toBe(true);

      const isNowBookmarked = await isOpportunityBookmarked(
        studentUser.id,
        testOpp1.id
      );
      expect(isNowBookmarked).toBe(true);
    });

    it("removes a bookmark when toggled again", async () => {
      const res = await toggleOpportunityBookmark(studentUser.id, testOpp1.id);
      expect(res.bookmarked).toBe(false);

      const isNowBookmarked = await isOpportunityBookmarked(
        studentUser.id,
        testOpp1.id
      );
      expect(isNowBookmarked).toBe(false);
    });

    it("decorates query results with isBookmarked = true for active user", async () => {
      // Bookmark testOpp2
      await toggleOpportunityBookmark(studentUser.id, testOpp2.id);

      const res = await getApprovedOpportunities(
        { limit: 20, page: 1 },
        studentUser.id
      );

      const target = res.items.find((o) => o.id === testOpp2.id);
      expect(target).toBeDefined();
      expect(target?.isBookmarked).toBe(true);
    });

    it("retrieves user bookmarked opportunities with pagination", async () => {
      const bookmarks = await getUserBookmarkedOpportunities(studentUser.id, 1, 10);
      expect(bookmarks.items.length).toBeGreaterThan(0);
      expect(bookmarks.items.some((o) => o.id === testOpp2.id)).toBe(true);
      expect(bookmarks.pagination.total).toBeGreaterThan(0);
    });
  });

  describe("3. Author Opportunity Management (My Postings)", () => {
    it("retrieves opportunities authored by user with status counts", async () => {
      const result = await getUserAuthoredOpportunities(employerUser.id, "ALL");
      expect(result.items.length).toBeGreaterThanOrEqual(2);
      expect(result.statusCounts.APPROVED).toBeGreaterThanOrEqual(2);
      expect(result.statusCounts.ALL).toBeGreaterThanOrEqual(2);
    });

    it("filters authored opportunities by status", async () => {
      const result = await getUserAuthoredOpportunities(employerUser.id, "APPROVED");
      expect(result.items.every((o) => o.status === "APPROVED")).toBe(true);
    });
  });

  describe("4. Opportunity Details & Related Openings", () => {
    it("retrieves full opportunity specifications with poster and company details", async () => {
      const opp = await getOpportunityById(testOpp1.id, studentUser.id);
      expect(opp.id).toBe(testOpp1.id);
      expect(opp.companyName).toBe(testCompany.name);
      expect(opp.company?.id).toBe(testCompany.id);
      expect(opp.poster?.name).toBe(employerUser.name);
      expect(opp.requiredSkills).toContain("Go");
    });

    it("retrieves related opportunities by target department or role type", async () => {
      const related = await getRelatedOpportunities(testOpp1.id, 3);
      expect(Array.isArray(related)).toBe(true);
      // Related opportunities must NOT contain the target opportunity itself
      expect(related.some((o) => o.id === testOpp1.id)).toBe(false);
    });
  });
});

