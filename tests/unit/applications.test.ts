import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  saveUploadedResume,
  getUserResumes,
  getResumeFileBuffer,
  assertCanAccessResume,
  deleteResume,
} from "@/lib/services/resume";
import {
  checkApplicationEligibility,
  submitInternalApplication,
  recordExternalApplication,
  withdrawApplication,
  getUserApplications,
  getOpportunityApplicants,
  updateApplicationStatus,
  getApplicationById,
} from "@/lib/services/application";
import { inspectFileMagicBytes } from "@/lib/validations/application";

describe("Stage 8: Applications & Applicant Management Test Suite", () => {
  let applicantStudent: any;
  let unauthorizedStudent: any;
  let employerRecruiter: any;
  let communitySharer: any;
  let testCompany: any;
  let officialOpportunity: any;
  let expiredOpportunity: any;
  let closedOpportunity: any;
  let externalOpportunity: any;
  let communityOpportunity: any;
  let studentResume: any;

  beforeAll(async () => {
    const ts = Date.now();

    // 1. Create candidate student user
    applicantStudent = await prisma.user.create({
      data: {
        name: `Candidate Student ${ts}`,
        email: `candidate_${ts}@university.edu`,
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        emailVerified: true,
        profile: {
          create: {
            headline: "Software Engineering Undergraduate",
            department: "Computer Science & Engineering",
            academicYear: "4th Year",
            graduationYear: 2026,
            skills: ["TypeScript", "Next.js", "PostgreSQL", "Algorithms"],
            studentId: "STU-2026-9081",
          },
        },
      },
    });

    // 2. Create another student user for unauthorized checks
    unauthorizedStudent = await prisma.user.create({
      data: {
        name: `Other Student ${ts}`,
        email: `other_student_${ts}@university.edu`,
        membershipType: "STUDENT",
        verificationStatus: "VERIFIED",
        emailVerified: true,
      },
    });

    // 3. Create employer recruiter user
    employerRecruiter = await prisma.user.create({
      data: {
        name: `Talent Lead ${ts}`,
        email: `talent_${ts}@techpartner.com`,
        membershipType: "ADMIN",
        systemRole: "ADMIN",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
        canReviewApplicants: true,
        emailVerified: true,
      },
    });

    // 4. Create community member who shares an opportunity
    communitySharer = await prisma.user.create({
      data: {
        name: `Alumni Lead ${ts}`,
        email: `alumni_sharer_${ts}@university.edu`,
        membershipType: "ALUMNI",
        verificationStatus: "VERIFIED",
        canPostOpportunities: true,
        emailVerified: true,
      },
    });

    // 5. Create corporate partner company and add recruiter as OWNER
    testCompany = await prisma.company.create({
      data: {
        name: `Tech Innovators Ltd ${ts}`,
        slug: `tech-innovators-${ts}`,
        industry: "Enterprise Software",
        location: "Dhaka, Bangladesh",
        createdById: employerRecruiter.id,
        members: {
          create: {
            userId: employerRecruiter.id,
            role: "OWNER",
            canManageCompany: true,
            canPostOpportunities: true,
          },
        },
      },
    });

    // 6. Create official active opportunity (future deadline, approved)
    const futureDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    officialOpportunity = await prisma.opportunity.create({
      data: {
        title: `Full Stack Engineer ${ts}`,
        description: "Building scalable distributed web applications with Next.js and Prisma.",
        companyId: testCompany.id,
        companyName: testCompany.name,
        type: "FULL_TIME",
        posterId: employerRecruiter.id,
        sourceType: "OFFICIAL_EMPLOYER",
        status: "APPROVED",
        workplaceType: "HYBRID",
        location: "Dhaka",
        minCgpa: 3.5,
        targetDepartments: ["Computer Science & Engineering"],
        openToAllDepartments: false,
        deadline: futureDate,
        applicationMethod: "INTERNAL",
      },
    });

    // 7. Create past-deadline opportunity
    const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expiredOpportunity = await prisma.opportunity.create({
      data: {
        title: `Expired Systems Role ${ts}`,
        description: "Past deadline opportunity for testing deadline enforcement.",
        companyId: testCompany.id,
        companyName: testCompany.name,
        type: "INTERNSHIP",
        posterId: employerRecruiter.id,
        sourceType: "OFFICIAL_EMPLOYER",
        status: "APPROVED",
        location: "Dhaka",
        deadline: pastDate,
        applicationMethod: "INTERNAL",
      },
    });

    // 8. Create closed opportunity
    closedOpportunity = await prisma.opportunity.create({
      data: {
        title: `Closed Backend Role ${ts}`,
        description: "Closed opportunity for testing status enforcement.",
        companyId: testCompany.id,
        companyName: testCompany.name,
        type: "FULL_TIME",
        posterId: employerRecruiter.id,
        sourceType: "OFFICIAL_EMPLOYER",
        status: "CLOSED",
        location: "Dhaka",
        deadline: futureDate,
        applicationMethod: "INTERNAL",
      },
    });

    // 9. Create external portal opportunity
    externalOpportunity = await prisma.opportunity.create({
      data: {
        title: `External Research Fellow ${ts}`,
        description: "Apply on corporate site for external fellowship.",
        companyId: testCompany.id,
        companyName: testCompany.name,
        type: "CONTRACT",
        posterId: employerRecruiter.id,
        sourceType: "OFFICIAL_EMPLOYER",
        status: "APPROVED",
        location: "Remote",
        deadline: futureDate,
        applicationMethod: "EXTERNAL",
        externalUrl: "https://careers.google.com/jobs/results/123",
      },
    });

    // 10. Create community-shared opportunity (no companyId)
    communityOpportunity = await prisma.opportunity.create({
      data: {
        title: `Community Shared Lead ${ts}`,
        description: "Shared by alumni peer for general community referral.",
        companyName: "Third Party Labs",
        type: "FULL_TIME",
        posterId: communitySharer.id,
        sourceType: "COMMUNITY_SHARED",
        status: "APPROVED",
        location: "Dhaka",
        deadline: futureDate,
        applicationMethod: "INTERNAL",
      },
    });
  });

  describe("Task 3: Secure Resume Vault Management", () => {
    it("validates PDF magic bytes inspection and rejects spoofed files", () => {
      // Valid PDF buffer (%PDF-1.5)
      const validPdfBuffer = Buffer.from("%PDF-1.5 test document stream content");
      const validInspection = inspectFileMagicBytes(validPdfBuffer);
      expect(validInspection.isValid).toBe(true);
      expect(validInspection.detectedMime).toBe("application/pdf");
      expect(validInspection.detectedExt).toBe(".pdf");

      // Spoofed text file named .pdf
      const fakePdfBuffer = Buffer.from("<html><script>alert(1)</script></html>");
      const fakeInspection = inspectFileMagicBytes(fakePdfBuffer);
      expect(fakeInspection.isValid).toBe(false);
      expect(fakeInspection.error).toContain("Security validation failed");
    });

    it("rejects files exceeding the maximum permitted size limit of 5 MB", async () => {
      // 5MB + 1KB buffer
      const oversizedBuffer = Buffer.alloc(5 * 1024 * 1024 + 1024, "%PDF");
      await expect(
        saveUploadedResume({
          userId: applicantStudent.id,
          buffer: oversizedBuffer,
          originalFileName: "huge_cv.pdf",
        })
      ).rejects.toThrow("File exceeds the maximum permitted size");
    });

    it("securely uploads valid PDF resume and stores in private vault", async () => {
      const validPdfBuffer = Buffer.from("%PDF-1.7 Authentic Candidate Resume Data");
      studentResume = await saveUploadedResume({
        userId: applicantStudent.id,
        buffer: validPdfBuffer,
        originalFileName: "Candidate_CV_2026.pdf",
        clientMimeType: "application/pdf",
      });

      expect(studentResume.id).toBeDefined();
      expect(studentResume.userId).toBe(applicantStudent.id);
      expect(studentResume.fileName).toBe("Candidate_CV_2026.pdf");
      expect(studentResume.mimeType).toBe("application/pdf");
      expect(studentResume.isDefault).toBe(true);

      const userResumes = await getUserResumes(applicantStudent.id);
      expect(userResumes.length).toBeGreaterThanOrEqual(1);
      expect(userResumes[0].id).toBe(studentResume.id);
    });

    it("allows resume owner to retrieve raw file buffer from disk", async () => {
      const fileData = await getResumeFileBuffer(studentResume.id, applicantStudent.id);
      expect(fileData.fileName).toBe("Candidate_CV_2026.pdf");
      expect(fileData.mimeType).toBe("application/pdf");
      expect(fileData.buffer.toString()).toContain("%PDF-1.7");
    });

    it("blocks unauthorized members from accessing candidate's private resume (IDOR safeguard)", async () => {
      await expect(
        getResumeFileBuffer(studentResume.id, unauthorizedStudent.id)
      ).rejects.toThrow("Unauthorized: You do not have permission");
    });
  });

  describe("Task 4 & 1: Application Submission, Eligibility & Database Integrity", () => {
    it("evaluates applicant eligibility and checks advisory warnings", async () => {
      const eligibility = await checkApplicationEligibility(
        applicantStudent.id,
        officialOpportunity.id
      );

      expect(eligibility.canApply).toBe(true);
      expect(eligibility.alreadyApplied).toBe(false);
      expect(eligibility.isDeadlinePassed).toBe(false);
      expect(eligibility.isOpportunityClosed).toBe(false);
    });

    it("submits internal application with resume and cover letter", async () => {
      const app = await submitInternalApplication(applicantStudent.id, {
        opportunityId: officialOpportunity.id,
        resumeId: studentResume.id,
        coverLetter: "Excited to apply for this backend role with deep Next.js and Prisma experience.",
        method: "INTERNAL",
      });

      expect(app.id).toBeDefined();
      expect(app.applicantId).toBe(applicantStudent.id);
      expect(app.opportunityId).toBe(officialOpportunity.id);
      expect(app.status).toBe("SUBMITTED");
      expect(app.resumeFileName).toBe("Candidate_CV_2026.pdf");

      // Verify status history audit entry was created
      const history = await prisma.applicationStatusHistory.findMany({
        where: { applicationId: app.id },
      });
      expect(history.length).toBe(1);
      expect(history[0].status).toBe("SUBMITTED");
      expect(history[0].changedById).toBe(applicantStudent.id);
    });

    it("enforces database-level unique constraint to block duplicate applications", async () => {
      // Second application attempt must fail
      await expect(
        submitInternalApplication(applicantStudent.id, {
          opportunityId: officialOpportunity.id,
          resumeId: studentResume.id,
          method: "INTERNAL",
        })
      ).rejects.toThrow("You have already submitted an application");

      // Verify direct database insert violation
      await expect(
        prisma.application.create({
          data: {
            opportunityId: officialOpportunity.id,
            applicantId: applicantStudent.id,
            status: "SUBMITTED",
          },
        })
      ).rejects.toThrow();
    });

    it("blocks application submission after deadline has passed", async () => {
      await expect(
        submitInternalApplication(applicantStudent.id, {
          opportunityId: expiredOpportunity.id,
          method: "INTERNAL",
        })
      ).rejects.toThrow("Application deadline for this opportunity has passed.");
    });

    it("blocks application submission to non-approved or closed opportunities", async () => {
      await expect(
        submitInternalApplication(applicantStudent.id, {
          opportunityId: closedOpportunity.id,
          method: "INTERNAL",
        })
      ).rejects.toThrow("Cannot apply to this opportunity because its status is CLOSED.");
    });
  });

  describe("Task 2: Application Methods & External Application Activity", () => {
    it("records external application tracking activity for company portal opportunities", async () => {
      const extApp = await recordExternalApplication(applicantStudent.id, {
        opportunityId: externalOpportunity.id,
        externalNotes: "Submitted requisition on company Workday portal.",
      });

      expect(extApp.id).toBeDefined();
      expect(extApp.method).toBe("EXTERNAL");
      expect(extApp.status).toBe("SUBMITTED");
      expect(extApp.externalNotes).toContain("Workday portal");

      // Duplicate check for external application
      await expect(
        recordExternalApplication(applicantStudent.id, {
          opportunityId: externalOpportunity.id,
        })
      ).rejects.toThrow("You have already recorded an application");
    });
  });

  describe("Task 5: Applicant Dashboard & Application Lifecycle", () => {
    it("retrieves candidate applications with live status breakdown", async () => {
      const userApps = await getUserApplications(applicantStudent.id);
      expect(userApps.items.length).toBe(2); // officialOpportunity + externalOpportunity
      expect(userApps.statusCounts.ALL).toBe(2);
      expect(userApps.statusCounts.SUBMITTED).toBe(2);
    });

    it("allows candidate to withdraw application with confirmation audit entry", async () => {
      // Find the official internal application
      const app = await prisma.application.findUnique({
        where: {
          opportunityId_applicantId: {
            opportunityId: officialOpportunity.id,
            applicantId: applicantStudent.id,
          },
        },
      });

      expect(app).toBeDefined();
      const withdrawn = await withdrawApplication(
        applicantStudent.id,
        app!.id,
        "Accepted alternative fellowship."
      );

      expect(withdrawn.status).toBe("WITHDRAWN");

      // Verify audit history
      const history = await prisma.applicationStatusHistory.findMany({
        where: { applicationId: app!.id },
        orderBy: { createdAt: "desc" },
      });
      expect(history[0].status).toBe("WITHDRAWN");
      expect(history[0].note).toBe("Accepted alternative fellowship.");

      // Attempting to withdraw again throws error
      await expect(
        withdrawApplication(applicantStudent.id, app!.id)
      ).rejects.toThrow("This application has already been withdrawn.");
    });
  });

  describe("Task 6 & 7: Employer Applicant Management & Strict Authorization", () => {
    let internalAppId: string;

    beforeAll(async () => {
      // Reset status from WITHDRAWN to SUBMITTED for employer workflow testing
      const app = await prisma.application.findUnique({
        where: {
          opportunityId_applicantId: {
            opportunityId: officialOpportunity.id,
            applicantId: applicantStudent.id,
          },
        },
      });
      await prisma.application.update({
        where: { id: app!.id },
        data: { status: "SUBMITTED" },
      });
      internalAppId = app!.id;
    });

    it("grants authorized employer representative access to candidate applications", async () => {
      const result = await getOpportunityApplicants({
        opportunityId: officialOpportunity.id,
        requestingUserId: employerRecruiter.id,
      });

      expect(result.applicants.length).toBe(1);
      const candidate = result.applicants[0];
      expect(candidate.applicant.name).toBe(applicantStudent.name);
      expect(candidate.applicant.profile?.department).toBe("Computer Science & Engineering");
      expect(candidate.resume?.fileName).toBe("Candidate_CV_2026.pdf");
      expect(result.statusCounts.SUBMITTED).toBe(1);
    });

    it("grants authorized employer permission to access candidate's uploaded resume", async () => {
      const file = await getResumeFileBuffer(studentResume.id, employerRecruiter.id);
      expect(file.buffer).toBeDefined();
      expect(file.fileName).toBe("Candidate_CV_2026.pdf");
    });

    it("strictly blocks community sharers from accessing employer applicant management", async () => {
      // Non-negotiable rule: "Do not allow community members who merely shared a job to manage employer applicants."
      await expect(
        getOpportunityApplicants({
          opportunityId: communityOpportunity.id,
          requestingUserId: communitySharer.id,
        })
      ).rejects.toThrow("Community-shared opportunities do not support employer applicant management.");
    });

    it("allows authorized employer to transition candidate status through recruitment pipeline", async () => {
      // 1. Advance to UNDER_REVIEW
      const reviewApp = await updateApplicationStatus({
        applicationId: internalAppId,
        reviewerId: employerRecruiter.id,
        status: "UNDER_REVIEW",
        note: "Resume screening passed. Dossier under departmental review.",
        employerNotes: "Strong background in Next.js App Router.",
      });

      expect(reviewApp.status).toBe("UNDER_REVIEW");

      // 2. Shortlist candidate
      const shortlistApp = await updateApplicationStatus({
        applicationId: internalAppId,
        reviewerId: employerRecruiter.id,
        status: "SHORTLISTED",
        note: "Candidate shortlisted for technical interview round.",
      });

      expect(shortlistApp.status).toBe("SHORTLISTED");

      // Verify chronological audit history
      const dossier = await getApplicationById(
        internalAppId,
        employerRecruiter.id
      );
      expect(dossier.application.statusHistory.length).toBeGreaterThanOrEqual(3);
      expect(dossier.viewerRole).toBe("EMPLOYER");
      expect(dossier.application.status).toBe("SHORTLISTED");
    });
  });
});

