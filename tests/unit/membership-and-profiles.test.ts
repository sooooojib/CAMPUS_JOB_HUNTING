import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  canPostOpportunity,
  canReviewApplicants,
  canAccessStudentTools,
  assertCanPostOpportunity,
  assertAdmin,
} from "@/lib/permissions";
import {
  getMemberProfile,
  getPublicProfile,
  upsertProfile,
  completeOnboarding,
} from "@/lib/services/profile";
import {
  submitVerificationRequest,
  getPendingVerificationRequests,
  getUserVerificationHistory,
  reviewVerificationRequest,
} from "@/lib/services/verification";

describe("Stage 5: Membership Verification & User Profiles Engine", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];

  // Helper to create test user
  async function createTestUser(params: {
    email: string;
    name: string;
    membershipType: any;
    systemRole?: any;
    verificationStatus?: any;
  }) {
    const user = await prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        membershipType: params.membershipType,
        systemRole: params.systemRole || "MEMBER",
        verificationStatus: params.verificationStatus || "PENDING",
        accountStatus: "ACTIVE",
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  afterAll(async () => {
    // Cascade deletes profiles & membershipRequests automatically
    for (const id of createdUserIds) {
      await prisma.user.deleteMany({ where: { id } });
    }
  });

  describe("Task 1: Membership Types & Verification Statuses Decoupling", () => {
    it("supports all required institutional membership types", async () => {
      const types = [
        "STUDENT",
        "ALUMNI",
        "ADMIN",
      ] as const;

      for (const mType of types) {
        const user = await createTestUser({
          email: `type_${mType.toLowerCase()}_${timestamp}@university.edu`,
          name: `User ${mType}`,
          membershipType: mType,
        });

        expect(user.membershipType).toBe(mType);
        expect(user.systemRole).toBe("MEMBER"); // Decoupled from ADMIN role
      }
    });

    it("supports all verification statuses and keeps systemRole separate", async () => {
      const statuses = ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"] as const;

      for (const vStatus of statuses) {
        const user = await createTestUser({
          email: `status_${vStatus.toLowerCase()}_${timestamp}@university.edu`,
          name: `User Status ${vStatus}`,
          membershipType: "STUDENT",
          verificationStatus: vStatus,
        });

        expect(user.verificationStatus).toBe(vStatus);
        expect(user.systemRole).toBe("MEMBER"); // Not admin
      }
    });
  });

  describe("Task 2 & 4: Registration Onboarding & Profile System", () => {
    it("completes student onboarding and provisions profile + verification request", async () => {
      const student = await createTestUser({
        email: `student_onboarding_${timestamp}@university.edu`,
        name: "Tanvir Ahmed",
        membershipType: "STUDENT",
      });

      const result = await completeOnboarding(student.id, {
        membershipType: "STUDENT",
        studentData: {
          studentId: "STU-2023-4412",
          department: "Computer Science & Engineering",
          academicYear: "3rd Year",
          degree: "B.Sc. in Software Engineering",
          graduationYear: 2026,
          headline: "Software Engineering Undergrad | JnU",
          bio: "Passionate about cloud architecture and distributed systems.",
          skills: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
          proofDetails: "Verified under Jagannath University Dept. of CSE Fall 2023 enrollment.",
        },
      });

      expect(result.profile).toBeDefined();
      expect(result.profile.studentId).toBe("STU-2023-4412");
      expect(result.profile.department).toBe("Computer Science & Engineering");
      expect(result.profile.isOnboarded).toBe(true);
      expect(result.profile.skills).toEqual(["TypeScript", "Next.js", "PostgreSQL", "Docker"]);

      expect(result.verificationRequest).toBeDefined();
      expect(result.verificationRequest.status).toBe("PENDING");
      expect(result.verificationRequest.institutionalId).toBe("STU-2023-4412");
    });

    it("allows updating profile details (bio, skills, links)", async () => {
      const user = await createTestUser({
        email: `profile_edit_${timestamp}@university.edu`,
        name: "Sadia Rahman",
        membershipType: "ALUMNI",
      });

      const updated = await upsertProfile(user.id, {
        headline: "Lead Software Architect at TechCorp",
        bio: "JnU CSE '19 graduate with 6 years experience in distributed backends.",
        company: "TechCorp",
        designation: "Lead Software Architect",
        skills: ["Go", "Distributed Systems", "Kubernetes", "PostgreSQL"],
        linkedinUrl: "https://linkedin.com/in/sadia-rahman-test",
        githubUrl: "https://github.com/sadia-rahman-test",
        showEmail: true,
      });

      expect(updated.headline).toBe("Lead Software Architect at TechCorp");
      expect(updated.company).toBe("TechCorp");
      expect(updated.skills).toHaveLength(4);
      expect(updated.showEmail).toBe(true);
      expect(updated.isOnboarded).toBe(true);
    });
  });

  describe("Task 3: Verification Workflow & Admin Review", () => {
    let adminUser: any;
    let applicantUser: any;
    let requestId: string;

    it("creates an administrator and a pending applicant request", async () => {
      adminUser = await createTestUser({
        email: `admin_${timestamp}@university.edu`,
        name: "Campus Career Admin",
        membershipType: "ADMIN",
        systemRole: "ADMIN",
        verificationStatus: "VERIFIED",
      });

      applicantUser = await createTestUser({
        email: `applicant_${timestamp}@partner.com`,
        name: "Alumni Talent Lead",
        membershipType: "ALUMNI",
        verificationStatus: "PENDING",
      });

      const req = await submitVerificationRequest(applicantUser.id, {
        membershipType: "ALUMNI",
        organization: "Google Bangladesh Partner",
        designation: "University Recruiter",
        workEmail: "recruiter@partner.com",
        proofDetails: "Graduation diploma submitted October 2026.",
      });

      requestId = req.id;
      expect(req.status).toBe("PENDING");

      // Verify user's verificationStatus is PENDING
      const userAfter = await prisma.user.findUnique({ where: { id: applicantUser.id } });
      expect(userAfter?.verificationStatus).toBe("PENDING");
    });

    it("allows admin to inspect pending requests queue", async () => {
      const queue = await getPendingVerificationRequests(adminUser.id);
      expect(queue.length).toBeGreaterThan(0);
      const target = queue.find((r) => r.id === requestId);
      expect(target).toBeDefined();
      expect(target?.user.email).toBe(applicantUser.email);
    });

    it("prevents non-admins from reviewing or fetching verification queue", async () => {
      await expect(getPendingVerificationRequests(applicantUser.id)).rejects.toThrow(
        "FORBIDDEN_ADMIN_ACCESS"
      );
    });

    it("requires a specific reason when admin rejects a request", async () => {
      await expect(
        reviewVerificationRequest(adminUser.id, {
          requestId,
          decision: "REJECT",
          rejectionReason: "   ",
        })
      ).rejects.toThrow();
    });

    it("approves request, verifies user, and grants posting permissions to employer", async () => {
      const decision = await reviewVerificationRequest(adminUser.id, {
        requestId,
        decision: "APPROVE",
      });

      expect(decision.request.status).toBe("APPROVED");
      expect(decision.request.reviewerId).toBe(adminUser.id);
      expect(decision.user.verificationStatus).toBe("VERIFIED");
      expect(decision.user.verifiedBy).toBe(adminUser.id);
      expect(decision.user.canPostOpportunities).toBe(true);
    });

    it("supports resubmission when a request is rejected", async () => {
      // Create student who gets rejected
      const student = await createTestUser({
        email: `rejected_student_${timestamp}@university.edu`,
        name: "Rejected Student",
        membershipType: "STUDENT",
      });

      const req1 = await submitVerificationRequest(student.id, {
        membershipType: "STUDENT",
        institutionalId: "INVALID-999",
        proofDetails: "Unmatched student ID",
      });

      // Admin rejects with reason
      await reviewVerificationRequest(adminUser.id, {
        requestId: req1.id,
        decision: "REJECT",
        rejectionReason: "Student ID could not be located in university registrar database.",
      });

      const studentAfterReject = await prisma.user.findUnique({ where: { id: student.id } });
      expect(studentAfterReject?.verificationStatus).toBe("REJECTED");
      expect(studentAfterReject?.canPostOpportunities).toBe(false);

      // Student resubmits corrected ID
      const req2 = await submitVerificationRequest(student.id, {
        membershipType: "STUDENT",
        institutionalId: "CORRECTED-STU-2023-8819",
        proofDetails: "Attached updated enrollment certificate issued by CSE department.",
      });

      expect(req2.status).toBe("PENDING");
      expect(req2.institutionalId).toBe("CORRECTED-STU-2023-8819");

      // Verify audit history retains both requests
      const history = await getUserVerificationHistory(student.id, student.id);
      expect(history.length).toBe(2);
      expect(history[0].id).toBe(req2.id);
      expect(history[0].status).toBe("PENDING");
      expect(history[1].id).toBe(req1.id);
      expect(history[1].status).toBe("REJECTED");
      expect(history[1].rejectionReason).toContain("registrar database");
    });
  });

  describe("Task 5: Profile Privacy & Data Redaction Rules", () => {
    it("redacts studentId, phone, and private email for general community members", async () => {
      // Target member with private information
      const targetUser = await createTestUser({
        email: `private_target_${timestamp}@university.edu`,
        name: "Private Member",
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
      });

      await upsertProfile(targetUser.id, {
        studentId: "STU-PRIVATE-999",
        phone: "+880 1711 000000",
        department: "Computer Science",
        showEmail: false, // Default private email
        bio: "Public bio text",
      });

      // Other regular viewer
      const viewerUser = await createTestUser({
        email: `viewer_${timestamp}@university.edu`,
        name: "Viewer Member",
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
      });

      const publicView = await getPublicProfile(targetUser.id, viewerUser.id);

      // Sensitive fields MUST NOT be revealed to viewer
      expect(publicView.studentId).toBeUndefined();
      expect(publicView.phone).toBeUndefined();
      expect(publicView.email).toBeUndefined(); // showEmail is false

      // Public info IS visible
      expect(publicView.name).toBe("Private Member");
      expect(publicView.bio).toBe("Public bio text");
      expect(publicView.department).toBe("Computer Science");
      expect(publicView.isOwnerOrAdmin).toBe(false);
    });

    it("reveals full fields when the viewer is the profile owner or platform admin", async () => {
      const owner = await createTestUser({
        email: `owner_${timestamp}@university.edu`,
        name: "Owner Member",
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
      });

      await upsertProfile(owner.id, {
        studentId: "STU-OWNER-1234",
        phone: "+880 1811 123456",
        showEmail: false,
      });

      // 1. Viewed by owner themselves
      const selfView = await getPublicProfile(owner.id, owner.id);
      expect(selfView.studentId).toBe("STU-OWNER-1234");
      expect(selfView.phone).toBe("+880 1811 123456");
      expect(selfView.email).toBe(owner.email);
      expect(selfView.isOwnerOrAdmin).toBe(true);

      // 2. Viewed by platform admin
      const admin = await createTestUser({
        email: `audit_admin_${timestamp}@university.edu`,
        name: "Admin Auditor",
        membershipType: "ADMIN",
        systemRole: "ADMIN",
      });

      const adminView = await getPublicProfile(owner.id, admin.id);
      expect(adminView.studentId).toBe("STU-OWNER-1234");
      expect(adminView.phone).toBe("+880 1811 123456");
      expect(adminView.email).toBe(owner.email);
      expect(adminView.isOwnerOrAdmin).toBe(true);
    });
  });

  describe("Task 6: Server-Side Opportunity Posting Permissions", () => {
    it("strictly blocks unverified accounts from posting opportunities", () => {
      const pendingStudent = {
        systemRole: "MEMBER",
        membershipType: "STUDENT",
        verificationStatus: "PENDING",
      };
      const rejectedEmployer = {
        systemRole: "MEMBER",
        membershipType: "EMPLOYER",
        verificationStatus: "REJECTED",
      };
      const suspendedUser = {
        systemRole: "MEMBER",
        membershipType: "EMPLOYER",
        verificationStatus: "SUSPENDED",
      };

      expect(canPostOpportunity(pendingStudent)).toBe(false);
      expect(canPostOpportunity(rejectedEmployer)).toBe(false);
      expect(canPostOpportunity(suspendedUser)).toBe(false);

      expect(() => assertCanPostOpportunity(pendingStudent)).toThrow("FORBIDDEN_POSTING_PERMISSION");
      expect(() => assertCanPostOpportunity(rejectedEmployer)).toThrow("FORBIDDEN_POSTING_PERMISSION");
    });

    it("authorizes platform ADMINs, verified EMPLOYERs, FACULTY, and STAFF", () => {
      const adminUser = {
        systemRole: "ADMIN",
        membershipType: "STAFF",
        verificationStatus: "VERIFIED",
      };
      const verifiedEmployer = {
        systemRole: "MEMBER",
        membershipType: "EMPLOYER",
        verificationStatus: "VERIFIED",
      };
      const verifiedAlumni = {
        systemRole: "MEMBER",
        membershipType: "ALUMNI",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
      };
      const verifiedStudent = {
        systemRole: "MEMBER",
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        canPostOpportunities: false,
      };

      expect(canPostOpportunity(adminUser)).toBe(true);
      expect(canPostOpportunity(verifiedAlumni)).toBe(true);
      expect(canPostOpportunity(verifiedStudent)).toBe(false); // Students cannot post opportunities by default
    });

    it("verifies applicant review and student career tools permissions", () => {
      const admin = { systemRole: "ADMIN", membershipType: "ADMIN", verificationStatus: "VERIFIED" };
      const student = { membershipType: "STUDENT", verificationStatus: "VERIFIED" };
      const alumni = { membershipType: "ALUMNI", verificationStatus: "VERIFIED" };

      expect(canAccessStudentTools(student)).toBe(true);
      expect(canAccessStudentTools(alumni)).toBe(false);

      expect(canReviewApplicants(admin)).toBe(true);
      expect(canReviewApplicants(student)).toBe(false);
    });
  });
});
