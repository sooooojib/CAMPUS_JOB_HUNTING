import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  calculateSkillMatch,
  evaluateEligibility,
  getPersonalizedRecommendations,
  analyzeStudentSkillGaps,
  parseAcademicYearLevel,
} from "@/lib/services/matching";
import {
  calculateCumulativeCgpa,
  createAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
  getUserAcademicProfile,
} from "@/lib/services/academic";
import {
  getOrCreateSkill,
  addSkillToProfile,
  removeSkillFromProfile,
  getMemberSkills,
} from "@/lib/services/skill";
import { canAccessStudentTools } from "@/lib/permissions";

describe("Stage 11: Smart Matching and Student Career Tools", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];
  const createdOpportunityIds: string[] = [];
  const createdSkillIds: string[] = [];

  // Helper to create test user
  async function createTestUser(params: {
    email: string;
    name: string;
    membershipType: any;
    systemRole?: any;
    verificationStatus?: any;
    department?: string;
    academicYear?: string;
    studentId?: string;
    skills?: string[];
  }) {
    const user = await prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        membershipType: params.membershipType,
        systemRole: params.systemRole || "MEMBER",
        verificationStatus: params.verificationStatus || "VERIFIED",
        accountStatus: "ACTIVE",
        profile: {
          create: {
            headline: `${params.membershipType} Test Profile`,
            department: params.department,
            academicYear: params.academicYear,
            studentId: params.studentId,
            skills: params.skills || [],
          },
        },
      },
      include: {
        profile: true,
      },
    });

    createdUserIds.push(user.id);
    return user;
  }

  // Helper to create test company
  async function createTestCompany(name: string, createdById: string) {
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${timestamp}-${Math.random().toString(36).substring(2, 6)}`;
    const company = await prisma.company.create({
      data: {
        name,
        slug,
        createdById,
        industry: "Technology",
        location: "Campus Science Park",
      },
    });
    createdCompanyIds.push(company.id);
    return company;
  }

  // Helper to create test opportunity
  async function createTestOpportunity(params: {
    title: string;
    companyId: string;
    companyName: string;
    posterId: string;
    type?: any;
    status?: any;
    deadline?: Date;
    minCgpa?: number;
    minAcademicYear?: string;
    targetDepartments?: string[];
    openToAllDepartments?: boolean;
    requiredSkills?: string[];
  }) {
    const opp = await prisma.opportunity.create({
      data: {
        title: params.title,
        description: `Description for ${params.title}`,
        companyId: params.companyId,
        companyName: params.companyName,
        posterId: params.posterId,
        type: params.type || "INTERNSHIP",
        sourceType: "OFFICIAL_EMPLOYER",
        status: params.status || "APPROVED",
        deadline: params.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
        location: "Campus Science Park",
        minCgpa: params.minCgpa,
        minAcademicYear: params.minAcademicYear,
        targetDepartments: params.targetDepartments || [],
        openToAllDepartments: params.openToAllDepartments ?? (params.targetDepartments ? params.targetDepartments.length === 0 : true),
        requiredSkills: params.requiredSkills || [],
      },
    });
    createdOpportunityIds.push(opp.id);
    return opp;
  }

  afterAll(async () => {
    // Cleanup created test records
    try {
      if (createdOpportunityIds.length > 0) {
        await prisma.opportunity.deleteMany({
          where: { id: { in: createdOpportunityIds } },
        });
      }

      if (createdUserIds.length > 0) {
        await prisma.academicRecord.deleteMany({
          where: { userId: { in: createdUserIds } },
        });
        await prisma.profile.deleteMany({
          where: { userId: { in: createdUserIds } },
        });
        await prisma.company.deleteMany({
          where: { id: { in: createdCompanyIds } },
        });
        await prisma.user.deleteMany({
          where: { id: { in: createdUserIds } },
        });
      }

      if (createdSkillIds.length > 0) {
        await prisma.skill.deleteMany({
          where: { id: { in: createdSkillIds } },
        });
      }
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  });

  // =========================================================================
  // TASK 1: Shared Skill System
  // =========================================================================
  describe("Task 1: Shared Skill System", () => {
    it("should create skills with categories and retrieve them without duplicates", async () => {
      const skillName = `TypeScript_${timestamp}`;
      const skill1 = await getOrCreateSkill(skillName, "PROGRAMMING_LANGUAGE");
      createdSkillIds.push(skill1.id);

      expect(skill1).toBeDefined();
      expect(skill1.name).toBe(skillName);
      expect(skill1.category).toBe("PROGRAMMING_LANGUAGE");

      // Idempotent retrieval of existing skill
      const skill2 = await getOrCreateSkill(skillName.toLowerCase());
      expect(skill2.id).toBe(skill1.id);
    });

    it("should associate skills with a member profile with proficiency level", async () => {
      const student = await createTestUser({
        email: `student_skills_${timestamp}@univ.edu`,
        name: "Skills Test Student",
        membershipType: "STUDENT",
      });

      const skillName = `React_${timestamp}`;
      const memberSkill = await addSkillToProfile(student.id, {
        skillName,
        category: "FRAMEWORK",
        level: "ADVANCED",
      });

      expect(memberSkill.skill.name).toBe(skillName);
      expect(memberSkill.level).toBe("ADVANCED");

      // Verify sync with Profile.skills string array
      const updatedProfile = await prisma.profile.findUnique({
        where: { id: student.profile!.id },
      });
      expect(updatedProfile?.skills).toContain(skillName);

      // Updating level updates existing record
      const updatedMemberSkill = await addSkillToProfile(student.id, {
        skillName,
        level: "EXPERT",
      });
      expect(updatedMemberSkill.level).toBe("EXPERT");
    });

    it("should remove skills from a member profile and update Profile.skills", async () => {
      const student = await createTestUser({
        email: `student_rem_skills_${timestamp}@univ.edu`,
        name: "Skill Removal Student",
        membershipType: "STUDENT",
      });

      const skillName = `PostgreSQL_${timestamp}`;
      const memberSkill = await addSkillToProfile(student.id, {
        skillName,
        category: "DATABASE",
        level: "INTERMEDIATE",
      });

      await removeSkillFromProfile(student.id, memberSkill.skillId);

      const remaining = await getMemberSkills(student.id);
      expect(remaining.some((s) => s.skillId === memberSkill.skillId)).toBe(false);

      const updatedProfile = await prisma.profile.findUnique({
        where: { id: student.profile!.id },
      });
      expect(updatedProfile?.skills).not.toContain(skillName);
    });
  });

  // =========================================================================
  // TASK 2 & 3: Opportunity Matching & Explainability
  // =========================================================================
  describe("Task 2 & 3: Explainable Opportunity Matching", () => {
    it("should accurately calculate skill match percentage: (Matched / Total) * 100", () => {
      const studentSkills = ["TypeScript", "Next.js", "Docker", "PostgreSQL"];

      // 4 out of 4 -> 100%
      const match100 = calculateSkillMatch(studentSkills, ["TypeScript", "Next.js", "Docker", "PostgreSQL"]);
      expect(match100.matchPercentage).toBe(100);
      expect(match100.scoreColor).toBe("green");
      expect(match100.missingSkills).toHaveLength(0);

      // 3 out of 4 -> 75%
      const match75 = calculateSkillMatch(studentSkills, ["TypeScript", "Next.js", "Docker", "Kubernetes"]);
      expect(match75.matchPercentage).toBe(75);
      expect(match75.scoreColor).toBe("yellow");
      expect(match75.missingSkills).toContain("Kubernetes");
      expect(match75.matchedSkills).toContain("TypeScript");

      // 1 out of 4 -> 25%
      const match25 = calculateSkillMatch(studentSkills, ["TypeScript", "Rust", "Go", "C++"]);
      expect(match25.matchPercentage).toBe(25);
      expect(match25.scoreColor).toBe("red");
      expect(match25.matchedSkills).toEqual(["TypeScript"]);

      // 0 out of 4 -> 0%
      const match0 = calculateSkillMatch(studentSkills, ["Rust", "Solidity", "Swift"]);
      expect(match0.matchPercentage).toBe(0);
      expect(match0.scoreColor).toBe("red");
    });

    it("should handle 0 required skills by returning 100% score with empty lists", () => {
      const studentSkills = ["Python"];
      const matchEmpty = calculateSkillMatch(studentSkills, []);
      expect(matchEmpty.matchPercentage).toBe(100);
      expect(matchEmpty.scoreColor).toBe("green");
      expect(matchEmpty.matchedSkills).toHaveLength(0);
      expect(matchEmpty.missingSkills).toHaveLength(0);
    });

    it("should apply exact color-coding thresholds (>= 80% green, 50-79% yellow, < 50% red)", () => {
      // 80% (4 / 5) -> green
      const match80 = calculateSkillMatch(["A", "B", "C", "D"], ["A", "B", "C", "D", "E"]);
      expect(match80.matchPercentage).toBe(80);
      expect(match80.scoreColor).toBe("green");

      // 50% -> yellow
      const match50 = calculateSkillMatch(["A"], ["A", "B"]);
      expect(match50.matchPercentage).toBe(50);
      expect(match50.scoreColor).toBe("yellow");

      // 33% -> red
      const match33 = calculateSkillMatch(["A"], ["A", "B", "C"]);
      expect(match33.matchPercentage).toBe(33);
      expect(match33.scoreColor).toBe("red");
    });
  });

  // =========================================================================
  // TASK 4: Eligibility Checker
  // =========================================================================
  describe("Task 4: Eligibility Checker", () => {
    it("should parse academic year standing correctly", () => {
      expect(parseAcademicYearLevel("Freshman")).toBe(1);
      expect(parseAcademicYearLevel("Sophomore")).toBe(2);
      expect(parseAcademicYearLevel("Junior")).toBe(3);
      expect(parseAcademicYearLevel("Senior")).toBe(4);
      expect(parseAcademicYearLevel("Master's Year 1")).toBe(5);
      expect(parseAcademicYearLevel("Year 3")).toBe(3);
      expect(parseAcademicYearLevel("4th Year")).toBe(4);
      expect(parseAcademicYearLevel(3)).toBe(3);
      expect(parseAcademicYearLevel(null)).toBe(0);
    });

    it("should evaluate ELIGIBLE when student meets all criteria", () => {
      const student = {
        department: "Computer Science",
        academicYear: "Senior",
        currentCgpa: 3.75,
      };

      const opportunity = {
        status: "APPROVED",
        deadline: new Date(Date.now() + 10000000),
        minCgpa: 3.5,
        minAcademicYear: "Junior",
        targetDepartments: ["Computer Science", "Software Engineering"],
        openToAllDepartments: false,
      };

      const result = evaluateEligibility(student, opportunity);
      expect(result.status).toBe("ELIGIBLE");
      expect(result.isEligible).toBe(true);
      expect(result.cgpaEligible).toBe(true);
      expect(result.departmentEligible).toBe(true);
      expect(result.academicYearEligible).toBe(true);
      expect(result.deadlineValid).toBe(true);
    });

    it("should evaluate NOT_ELIGIBLE when student falls below minimum CGPA", () => {
      const student = {
        department: "Computer Science",
        academicYear: "Senior",
        currentCgpa: 3.2,
      };

      const opportunity = {
        status: "APPROVED",
        deadline: new Date(Date.now() + 10000000),
        minCgpa: 3.5,
        targetDepartments: ["Computer Science"],
        openToAllDepartments: false,
      };

      const result = evaluateEligibility(student, opportunity);
      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.isEligible).toBe(false);
      expect(result.cgpaEligible).toBe(false);
      expect(result.warnings.some((w) => w.includes("below the required minimum"))).toBe(true);
    });

    it("should evaluate NOT_ELIGIBLE when student department is not in target departments", () => {
      const student = {
        department: "Mechanical Engineering",
        academicYear: "Senior",
        currentCgpa: 3.8,
      };

      const opportunity = {
        status: "APPROVED",
        deadline: new Date(Date.now() + 10000000),
        minCgpa: 3.5,
        targetDepartments: ["Computer Science", "Electrical Engineering"],
        openToAllDepartments: false,
      };

      const result = evaluateEligibility(student, opportunity);
      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.departmentEligible).toBe(false);
      expect(result.warnings.some((w) => w.includes("Mechanical Engineering"))).toBe(true);
    });

    it("should evaluate NOT_ELIGIBLE when deadline has passed", () => {
      const student = {
        department: "Computer Science",
        currentCgpa: 3.9,
      };

      const opportunity = {
        status: "APPROVED",
        deadline: new Date(Date.now() - 10000000), // in the past
        targetDepartments: [],
        openToAllDepartments: true,
      };

      const result = evaluateEligibility(student, opportunity);
      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.deadlineValid).toBe(false);
      expect(result.warnings.some((w) => w.includes("deadline has passed"))).toBe(true);
    });

    it("should evaluate NEEDS_REVIEW when student profile data is missing", () => {
      const student = {
        department: null,
        currentCgpa: null,
      };

      const opportunity = {
        status: "APPROVED",
        deadline: new Date(Date.now() + 10000000),
        minCgpa: 3.5,
        targetDepartments: ["Computer Science"],
        openToAllDepartments: false,
      };

      const result = evaluateEligibility(student, opportunity);
      expect(result.status).toBe("NEEDS_REVIEW");
      expect(result.isEligible).toBe(false);
      expect(result.warnings.some((w) => w.includes("cumulative CGPA has not been recorded"))).toBe(true);
    });
  });

  // =========================================================================
  // TASK 5: Skill Gap Analyzer
  // =========================================================================
  describe("Task 5: Skill Gap Analyzer", () => {
    it("should identify missing skills, rank them by market demand, and provide learning tracks", async () => {
      const employer = await createTestUser({
        email: `employer_gap_${timestamp}@univ.edu`,
        name: "Gap Employer",
        membershipType: "ALUMNI",
      });
      const company = await createTestCompany(`Gap Labs ${timestamp}`, employer.id);

      // Create 2 opportunities requiring Docker, Kubernetes, AWS, TypeScript
      await createTestOpportunity({
        title: "Cloud Infrastructure Intern",
        companyId: company.id,
        companyName: company.name,
        posterId: employer.id,
        requiredSkills: ["Docker", "Kubernetes", "AWS"],
      });

      await createTestOpportunity({
        title: "DevOps Engineer",
        companyId: company.id,
        companyName: company.name,
        posterId: employer.id,
        requiredSkills: ["Docker", "Kubernetes", "TypeScript"],
      });

      // Student has Docker and TypeScript, but lacks Kubernetes and AWS
      const student = await createTestUser({
        email: `student_gap_${timestamp}@univ.edu`,
        name: "Gap Student",
        membershipType: "STUDENT",
        skills: ["Docker", "TypeScript"],
      });

      const analysis = await analyzeStudentSkillGaps(student.id);

      expect(analysis.studentSkills).toContain("Docker");
      expect(analysis.studentSkills).toContain("TypeScript");

      // Missing skills check
      const k8sMissing = analysis.missingSkills.find((s) => s.name.toLowerCase() === "kubernetes");
      expect(k8sMissing).toBeDefined();
      expect(k8sMissing?.demandCount).toBeGreaterThanOrEqual(2);

      const awsMissing = analysis.missingSkills.find((s) => s.name.toLowerCase() === "aws");
      expect(awsMissing).toBeDefined();

      // Verify prioritized recommendations
      expect(analysis.recommendedPriorities.length).toBeGreaterThan(0);
      expect(analysis.curatedResources.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // TASK 7 & 8: Academic Records, Exact CGPA, and Privacy
  // =========================================================================
  describe("Task 7 & 8: Academic Records, Exact CGPA, and Privacy", () => {
    it("should calculate cumulative CGPA with exact credit weighting: Sum(GPA * Credits) / Sum(Credits)", () => {
      const records = [
        { gpa: 4.0, credits: 15 }, // 60.0
        { gpa: 3.5, credits: 15 }, // 52.5
        { gpa: 3.0, credits: 10 }, // 30.0
      ];
      // Total credits = 40. Total weighted = 142.5. 142.5 / 40 = 3.5625 -> 3.56
      const cgpa = calculateCumulativeCgpa(records);
      expect(cgpa).toBe(3.56);
    });

    it("should return null CGPA when records array is empty or total credits is 0", () => {
      expect(calculateCumulativeCgpa([])).toBeNull();
      expect(calculateCumulativeCgpa([{ gpa: 3.5, credits: 0 }])).toBeNull();
    });

    it("should prevent duplicate semesters for the same student (@@unique constraint)", async () => {
      const student = await createTestUser({
        email: `student_dup_${timestamp}@univ.edu`,
        name: "Dup Semester Student",
        membershipType: "STUDENT",
      });

      await createAcademicRecord(student.id, {
        semester: "Fall 2025",
        gpa: 3.8,
        credits: 15,
        academicYear: "Senior",
      });

      // Attempting to record same semester must throw error
      await expect(
        createAcademicRecord(student.id, {
          semester: "Fall 2025",
          gpa: 3.9,
          credits: 16,
        })
      ).rejects.toThrow(/already exists/);
    });

    it("should automatically sync Profile.currentCgpa on record creation, update, and deletion", async () => {
      const student = await createTestUser({
        email: `student_cgpa_sync_${timestamp}@univ.edu`,
        name: "CGPA Sync Student",
        membershipType: "STUDENT",
      });

      // Add Term 1: 4.0 GPA with 15 credits
      const rec1 = await createAcademicRecord(student.id, {
        semester: "Fall 2025",
        gpa: 4.0,
        credits: 15,
      });

      let profile = await prisma.profile.findUnique({ where: { userId: student.id } });
      expect(profile?.currentCgpa).toBe(4.0);

      // Add Term 2: 3.0 GPA with 15 credits -> CGPA should become 3.50
      const rec2 = await createAcademicRecord(student.id, {
        semester: "Spring 2026",
        gpa: 3.0,
        credits: 15,
      });

      profile = await prisma.profile.findUnique({ where: { userId: student.id } });
      expect(profile?.currentCgpa).toBe(3.5);

      // Update Term 2: change GPA to 3.5 -> CGPA = (4*15 + 3.5*15)/30 = 112.5/30 = 3.75
      await updateAcademicRecord(student.id, rec2.id, {
        gpa: 3.5,
      });

      profile = await prisma.profile.findUnique({ where: { userId: student.id } });
      expect(profile?.currentCgpa).toBe(3.75);

      // Delete Term 2 -> CGPA returns to 4.00
      await deleteAcademicRecord(student.id, rec2.id);

      profile = await prisma.profile.findUnique({ where: { userId: student.id } });
      expect(profile?.currentCgpa).toBe(4.0);
    });

    it("should enforce strict academic record privacy (students access own records, admins access, others blocked)", async () => {
      const student1 = await createTestUser({
        email: `student_priv1_${timestamp}@univ.edu`,
        name: "Private Student One",
        membershipType: "STUDENT",
      });

      const student2 = await createTestUser({
        email: `student_priv2_${timestamp}@univ.edu`,
        name: "Private Student Two",
        membershipType: "STUDENT",
      });

      const admin = await createTestUser({
        email: `admin_priv_${timestamp}@univ.edu`,
        name: "Platform Admin",
        membershipType: "ADMIN",
        systemRole: "ADMIN",
      });

      await createAcademicRecord(student1.id, {
        semester: "Fall 2025",
        gpa: 3.9,
        credits: 15,
      });

      // 1. Student1 accessing own records -> allowed
      const ownProfile = await getUserAcademicProfile(student1.id, student1.id);
      expect(ownProfile.records.length).toBe(1);
      expect(ownProfile.cumulativeCgpa).toBe(3.9);

      // 2. Admin accessing student1's records -> allowed
      const adminAccess = await getUserAcademicProfile(admin.id, student1.id);
      expect(adminAccess.records.length).toBe(1);
      expect(adminAccess.cumulativeCgpa).toBe(3.9);

      // 3. Student2 attempting to inspect Student1's records -> blocked with 403
      await expect(
        getUserAcademicProfile(student2.id, student1.id)
      ).rejects.toThrow("ACCESS_DENIED");
    });

    it("should block non-student accounts from career tools via canAccessStudentTools", async () => {
      expect(canAccessStudentTools({ membershipType: "STUDENT", accountStatus: "ACTIVE" })).toBe(true);
      expect(canAccessStudentTools({ membershipType: "ALUMNI", accountStatus: "ACTIVE" })).toBe(false);
      expect(canAccessStudentTools({ membershipType: "ADMIN", accountStatus: "ACTIVE" })).toBe(false);
      expect(canAccessStudentTools({ membershipType: "STUDENT", accountStatus: "SUSPENDED" })).toBe(false);
    });
  });

  // =========================================================================
  // TASK 6: Personalized Recommendations Integration
  // =========================================================================
  describe("Task 6: Personalized Career Recommendations", () => {
    it("should return sorted recommendations with explainable match scores and disclaimers", async () => {
      const employer = await createTestUser({
        email: `rec_employer_${timestamp}@univ.edu`,
        name: "Rec Employer",
        membershipType: "ALUMNI",
      });
      const company = await createTestCompany(`Rec Company ${timestamp}`, employer.id);

      // Opp 1: 3 skills (Python, PyTorch, Docker)
      const opp1 = await createTestOpportunity({
        title: "AI Research Assistant",
        companyId: company.id,
        companyName: company.name,
        posterId: employer.id,
        minCgpa: 3.5,
        targetDepartments: ["Computer Science"],
        requiredSkills: ["Python", "PyTorch", "Docker"],
      });

      // Opp 2: 2 skills (Java, Spring Boot)
      const opp2 = await createTestOpportunity({
        title: "Java Backend Developer",
        companyId: company.id,
        companyName: company.name,
        posterId: employer.id,
        minCgpa: 3.0,
        targetDepartments: ["Computer Science"],
        requiredSkills: ["Java", "Spring Boot"],
      });

      // Student has Python, PyTorch, and Docker (100% on Opp1, 0% on Opp2)
      const student = await createTestUser({
        email: `rec_student_${timestamp}@univ.edu`,
        name: "Rec Student",
        membershipType: "STUDENT",
        department: "Computer Science",
        academicYear: "Junior",
        skills: ["Python", "PyTorch", "Docker"],
      });

      await createAcademicRecord(student.id, {
        semester: "Fall 2025",
        gpa: 3.8,
        credits: 15,
      });

      const { recommendations, disclaimer } = await getPersonalizedRecommendations(student.id, {
        limit: 100,
      });

      expect(recommendations.length).toBeGreaterThanOrEqual(2);

      // Verify opp1 (100% skill match) vs opp2 (0% skill match)
      const rec1 = recommendations.find((r) => r.opportunity.id === opp1.id);
      const rec2 = recommendations.find((r) => r.opportunity.id === opp2.id);

      expect(rec1).toBeDefined();
      expect(rec1?.match.matchPercentage).toBe(100);
      expect(rec1?.match.scoreColor).toBe("green");
      expect(rec1?.match.eligibility.status).toBe("ELIGIBLE");
      expect(rec1?.match.recommendationReasons.length).toBeGreaterThan(0);

      expect(rec2).toBeDefined();
      expect(rec2?.match.matchPercentage).toBe(0);
      expect(rec2?.match.scoreColor).toBe("red");

      // Verify opp1 is ranked higher than opp2
      const index1 = recommendations.findIndex((r) => r.opportunity.id === opp1.id);
      const index2 = recommendations.findIndex((r) => r.opportunity.id === opp2.id);
      expect(index1).toBeLessThan(index2);

      // Verify required disclaimer is attached
      expect(disclaimer).toContain("does not guarantee academic eligibility");
    });
  });
});
