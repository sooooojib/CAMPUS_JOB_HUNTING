import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  sendConnectionRequest,
  respondToConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
  getConnectionState,
  getUserConnections,
} from "@/lib/services/connection";
import {
  createReferralRequest,
  respondToReferralRequest,
  cancelReferralRequest,
  assertCanAccessReferral,
  getUserReferralRequests,
  REFERRAL_DISCLAIMER,
} from "@/lib/services/referral";
import {
  searchMemberDirectory,
  getPublicProfile,
} from "@/lib/services/profile";

describe("Stage 10: Member Directory, Connections, and Referrals", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];

  // Helper to create test user
  async function createTestMember(params: {
    email: string;
    name: string;
    membershipType: any;
    systemRole?: any;
    verificationStatus?: any;
    profile?: {
      headline?: string;
      bio?: string;
      department?: string;
      studentId?: string;
      phone?: string;
      showEmail?: boolean;
      company?: string;
      designation?: string;
      skills?: string[];
      interests?: string[];
      graduationYear?: number;
    };
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
            headline: params.profile?.headline,
            bio: params.profile?.bio,
            department: params.profile?.department,
            studentId: params.profile?.studentId,
            phone: params.profile?.phone,
            showEmail: params.profile?.showEmail || false,
            company: params.profile?.company,
            designation: params.profile?.designation,
            skills: params.profile?.skills || [],
            interests: params.profile?.interests || [],
            graduationYear: params.profile?.graduationYear,
            isOnboarded: true,
          },
        },
      },
      include: { profile: true },
    });
    createdUserIds.push(user.id);
    return user;
  }

  afterAll(async () => {
    // Clean up referrals
    if (createdUserIds.length > 0) {
      await prisma.referralRequest.deleteMany({
        where: {
          OR: [
            { requesterId: { in: createdUserIds } },
            { recipientId: { in: createdUserIds } },
          ],
        },
      });
      // Clean up connections
      await prisma.connection.deleteMany({
        where: {
          OR: [
            { senderId: { in: createdUserIds } },
            { receiverId: { in: createdUserIds } },
          ],
        },
      });
      // Clean up profiles & users
      await prisma.profile.deleteMany({
        where: { userId: { in: createdUserIds } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }

    if (createdCompanyIds.length > 0) {
      await prisma.company.deleteMany({
        where: { id: { in: createdCompanyIds } },
      });
    }
  });

  describe("Task 1: Member Directory & Strict Privacy", () => {
    it("should search member directory and filter by department, membership type, and skill", async () => {
      const student = await createTestMember({
        email: `student_dir_${timestamp}@campus.edu`,
        name: `Tanvir Student ${timestamp}`,
        membershipType: "STUDENT",
        profile: {
          department: "Computer Science",
          skills: ["TypeScript", "Distributed Systems"],
          interests: ["Cloud Infrastructure"],
          studentId: "STU-SECRET-9999",
          phone: "+8801700000000",
          showEmail: false,
        },
      });

      const alumni = await createTestMember({
        email: `alumni_dir_${timestamp}@campus.edu`,
        name: `Sarah Alumni ${timestamp}`,
        membershipType: "ALUMNI",
        profile: {
          department: "Computer Science",
          company: "Stripe",
          designation: "Staff Engineer",
          skills: ["Go", "Distributed Systems"],
          interests: ["Fintech"],
          showEmail: true,
        },
      });

      // Filter by department
      const deptResults = await searchMemberDirectory(student.id, {
        department: "Computer Science",
        page: 1,
        pageSize: 100,
      });
      expect(deptResults.items.some((m) => m.id === student.id)).toBe(true);
      expect(deptResults.items.some((m) => m.id === alumni.id)).toBe(true);

      // Filter by membershipType = ALUMNI
      const alumniResults = await searchMemberDirectory(student.id, {
        membershipType: "ALUMNI",
        page: 1,
        pageSize: 100,
      });
      expect(alumniResults.items.some((m) => m.id === alumni.id)).toBe(true);
      expect(alumniResults.items.some((m) => m.id === student.id)).toBe(false);

      // Filter by company = Stripe
      const companyResults = await searchMemberDirectory(student.id, {
        company: "Stripe",
        page: 1,
        pageSize: 10,
      });
      expect(companyResults.items.some((m) => m.id === alumni.id)).toBe(true);

      // Filter by skill = Go
      const skillResults = await searchMemberDirectory(student.id, {
        skill: "Go",
        page: 1,
        pageSize: 10,
      });
      expect(skillResults.items.some((m) => m.id === alumni.id)).toBe(true);
    });

    it("should enforce strict privacy restrictions in directory output", async () => {
      const student = await createTestMember({
        email: `private_student_${timestamp}@campus.edu`,
        name: `Private Member ${timestamp}`,
        membershipType: "STUDENT",
        profile: {
          studentId: "SECRET-UNIV-ID-1234",
          phone: "+1-555-PRIVATE-PHONE",
          showEmail: false,
        },
      });

      const viewer = await createTestMember({
        email: `viewer_${timestamp}@campus.edu`,
        name: `Viewer User ${timestamp}`,
        membershipType: "STUDENT",
      });

      const dirResult = await searchMemberDirectory(viewer.id, {
        q: `Private Member ${timestamp}`,
      });

      const matchedMember = dirResult.items.find((m) => m.id === student.id);
      expect(matchedMember).toBeDefined();

      // STRICT PRIVACY GUARANTEES:
      // studentId and phone must never be part of directory item
      expect((matchedMember as any).studentId).toBeUndefined();
      expect((matchedMember as any).phone).toBeUndefined();
      // email must be undefined when showEmail: false for non-admin viewers
      expect(matchedMember?.email).toBeUndefined();
    });

    it("should reveal email only if showEmail: true or viewer is platform ADMIN", async () => {
      const memberWithPublicEmail = await createTestMember({
        email: `public_email_${timestamp}@campus.edu`,
        name: `Public Email Member ${timestamp}`,
        membershipType: "ALUMNI",
        profile: {
          showEmail: true,
          department: "Mathematics",
        },
      });

      const studentViewer = await createTestMember({
        email: `student_viewer_${timestamp}@campus.edu`,
        name: `Student Viewer ${timestamp}`,
        membershipType: "STUDENT",
      });

      const adminViewer = await createTestMember({
        email: `admin_viewer_${timestamp}@campus.edu`,
        name: `Admin Viewer ${timestamp}`,
        membershipType: "ADMIN",
        systemRole: "ADMIN",
      });

      // Regular viewer sees email because showEmail is true
      const dirResult = await searchMemberDirectory(studentViewer.id, {
        q: `Public Email Member ${timestamp}`,
      });
      const found = dirResult.items.find((m) => m.id === memberWithPublicEmail.id);
      expect(found?.email).toBe(memberWithPublicEmail.email);

      // Admin viewer sees email regardless of privacy setting
      const privateMember = await createTestMember({
        email: `strictly_private_${timestamp}@campus.edu`,
        name: `Strictly Private ${timestamp}`,
        membershipType: "STUDENT",
        profile: { showEmail: false },
      });

      const adminResult = await searchMemberDirectory(adminViewer.id, {
        q: `Strictly Private ${timestamp}`,
      });
      const foundPrivate = adminResult.items.find((m) => m.id === privateMember.id);
      expect(foundPrivate?.email).toBe(privateMember.email);
    });
  });

  describe("Task 3: Connection System & Prevent Self-Connection", () => {
    it("should prevent a member from connecting with themselves", async () => {
      const user = await createTestMember({
        email: `self_conn_${timestamp}@campus.edu`,
        name: `Self Connector ${timestamp}`,
        membershipType: "STUDENT",
      });

      await expect(sendConnectionRequest(user.id, user.id)).rejects.toThrow(
        "You cannot send a connection request to yourself."
      );
    });

    it("should send a connection request and transition state to PENDING", async () => {
      const sender = await createTestMember({
        email: `sender_${timestamp}@campus.edu`,
        name: `Sender User ${timestamp}`,
        membershipType: "STUDENT",
      });

      const receiver = await createTestMember({
        email: `receiver_${timestamp}@campus.edu`,
        name: `Receiver User ${timestamp}`,
        membershipType: "ALUMNI",
      });

      const connection = await sendConnectionRequest(sender.id, receiver.id);
      expect(connection.senderId).toBe(sender.id);
      expect(connection.receiverId).toBe(receiver.id);
      expect(connection.status).toBe("PENDING");

      // Verify connection states from both perspectives
      const senderState = await getConnectionState(sender.id, receiver.id);
      expect(senderState.state).toBe("PENDING_SENT");
      expect(senderState.connectionId).toBe(connection.id);

      const receiverState = await getConnectionState(receiver.id, sender.id);
      expect(receiverState.state).toBe("PENDING_RECEIVED");
      expect(receiverState.connectionId).toBe(connection.id);
    });

    it("should prevent duplicate pending connection requests", async () => {
      const sender = await createTestMember({
        email: `dup_sender_${timestamp}@campus.edu`,
        name: `Dup Sender ${timestamp}`,
        membershipType: "STUDENT",
      });

      const receiver = await createTestMember({
        email: `dup_receiver_${timestamp}@campus.edu`,
        name: `Dup Receiver ${timestamp}`,
        membershipType: "ALUMNI",
      });

      await sendConnectionRequest(sender.id, receiver.id);

      // Attempting to send again should throw
      await expect(sendConnectionRequest(sender.id, receiver.id)).rejects.toThrow(
        "Connection request is already pending."
      );

      // Receiver attempting to reverse send should be directed to accept
      await expect(sendConnectionRequest(receiver.id, sender.id)).rejects.toThrow(
        "This member has already sent you a connection request"
      );
    });

    it("should allow recipient to accept connection and block unauthorized responders", async () => {
      const sender = await createTestMember({
        email: `acc_sender_${timestamp}@campus.edu`,
        name: `Accept Sender ${timestamp}`,
        membershipType: "STUDENT",
      });

      const receiver = await createTestMember({
        email: `acc_receiver_${timestamp}@campus.edu`,
        name: `Accept Receiver ${timestamp}`,
        membershipType: "ALUMNI",
      });

      const impostor = await createTestMember({
        email: `impostor_${timestamp}@campus.edu`,
        name: `Impostor ${timestamp}`,
        membershipType: "STUDENT",
      });

      const connection = await sendConnectionRequest(sender.id, receiver.id);

      // Impostor tries to accept -> Throws unauthorized
      await expect(
        respondToConnectionRequest(impostor.id, connection.id, "ACCEPT")
      ).rejects.toThrow("You are not authorized to respond to this connection request.");

      // Sender tries to accept their own outgoing request -> Throws unauthorized
      await expect(
        respondToConnectionRequest(sender.id, connection.id, "ACCEPT")
      ).rejects.toThrow("You are not authorized to respond to this connection request.");

      // Legitimate receiver accepts
      const accepted = await respondToConnectionRequest(receiver.id, connection.id, "ACCEPT");
      expect(accepted.status).toBe("ACCEPTED");

      // Connection status should now be CONNECTED
      const state = await getConnectionState(sender.id, receiver.id);
      expect(state.state).toBe("CONNECTED");

      // Attempting to send another request throws already connected
      await expect(sendConnectionRequest(sender.id, receiver.id)).rejects.toThrow(
        "You are already connected with this member."
      );

      // getUserConnections includes the peer
      const userConns = await getUserConnections(sender.id);
      expect(userConns.items.some((c) => c.member.id === receiver.id)).toBe(true);
    });

    it("should allow cancelling outgoing requests and removing existing connections", async () => {
      const sender = await createTestMember({
        email: `can_sender_${timestamp}@campus.edu`,
        name: `Cancel Sender ${timestamp}`,
        membershipType: "STUDENT",
      });

      const receiver = await createTestMember({
        email: `can_receiver_${timestamp}@campus.edu`,
        name: `Cancel Receiver ${timestamp}`,
        membershipType: "ALUMNI",
      });

      // 1. Cancel pending request
      const conn = await sendConnectionRequest(sender.id, receiver.id);
      await cancelConnectionRequest(sender.id, conn.id);

      const stateAfterCancel = await getConnectionState(sender.id, receiver.id);
      expect(stateAfterCancel.state).toBe("NONE");

      // 2. Connect and then Remove
      const newConn = await sendConnectionRequest(sender.id, receiver.id);
      await respondToConnectionRequest(receiver.id, newConn.id, "ACCEPT");

      const stateConnected = await getConnectionState(sender.id, receiver.id);
      expect(stateConnected.state).toBe("CONNECTED");

      // Either party can remove the connection
      await removeConnection(receiver.id, newConn.id);

      const stateAfterRemove = await getConnectionState(sender.id, receiver.id);
      expect(stateAfterRemove.state).toBe("NONE");
    });
  });

  describe("Task 4 & 5: Dedicated Referral System & Strict Privacy", () => {
    it("should prevent requesting a referral from oneself", async () => {
      const user = await createTestMember({
        email: `self_ref_${timestamp}@campus.edu`,
        name: `Self Referral ${timestamp}`,
        membershipType: "STUDENT",
      });

      await expect(
        createReferralRequest(user.id, {
          recipientId: user.id,
          companyName: "Google",
          roleTitle: "Software Engineer",
          message: "Please refer me to this engineering role, I have 3 years of React experience.",
        })
      ).rejects.toThrow("You cannot request a referral from yourself.");
    });

    it("should create referral request and verify non-guarantee disclaimer", async () => {
      const student = await createTestMember({
        email: `ref_student_${timestamp}@campus.edu`,
        name: `Referral Student ${timestamp}`,
        membershipType: "STUDENT",
      });

      const alumni = await createTestMember({
        email: `ref_alumni_${timestamp}@campus.edu`,
        name: `Alumni Sponsor ${timestamp}`,
        membershipType: "ALUMNI",
        profile: {
          company: "Datadog",
          designation: "Principal Engineer",
        },
      });

      const referral = await createReferralRequest(student.id, {
        recipientId: alumni.id,
        companyName: "Datadog",
        roleTitle: "Cloud Infrastructure Engineer",
        message: "Hello Sarah, I enjoyed your alumni panel on distributed systems and would love a referral for the junior cloud role.",
        resumeUrl: "https://example.com/resumes/tanvir-cv.pdf",
      });

      expect(referral.id).toBeDefined();
      expect(referral.requesterId).toBe(student.id);
      expect(referral.recipientId).toBe(alumni.id);
      expect(referral.status).toBe("PENDING");
      expect(referral.companyName).toBe("Datadog");

      // Verify dashboard queries include disclaimer
      const dashboard = await getUserReferralRequests(student.id, { role: "SENT" });
      expect(dashboard.disclaimer).toContain(
        "does not guarantee an interview, employment offer, or institutional endorsement"
      );
      expect(dashboard.items.some((r) => r.id === referral.id)).toBe(true);
    });

    it("should allow recipient to respond (ACCEPTED, COMPLETED, DECLINED) and prevent unauthorized responses", async () => {
      const student = await createTestMember({
        email: `workflow_student_${timestamp}@campus.edu`,
        name: `Workflow Student ${timestamp}`,
        membershipType: "STUDENT",
      });

      const alumni = await createTestMember({
        email: `workflow_alumni_${timestamp}@campus.edu`,
        name: `Workflow Alumni ${timestamp}`,
        membershipType: "ALUMNI",
      });

      const stranger = await createTestMember({
        email: `workflow_stranger_${timestamp}@campus.edu`,
        name: `Workflow Stranger ${timestamp}`,
        membershipType: "STUDENT",
      });

      const referral = await createReferralRequest(student.id, {
        recipientId: alumni.id,
        companyName: "Stripe",
        roleTitle: "Backend Software Engineer",
        message: "Hi, I would be grateful for an internal referral to the Dublin engineering hub.",
      });

      // Stranger tries to respond -> Blocked
      await expect(
        respondToReferralRequest(stranger.id, referral.id, {
          status: "ACCEPTED",
          responseNote: "Hacked response",
        })
      ).rejects.toThrow("You are not authorized to respond to this referral request.");

      // Alumni accepts with instructions note
      const accepted = await respondToReferralRequest(alumni.id, referral.id, {
        status: "ACCEPTED",
        responseNote: "Reviewed your GitHub and will submit internally via our Workday portal.",
      });
      expect(accepted.status).toBe("ACCEPTED");
      expect(accepted.responseNote).toContain("Workday portal");

      // Alumni completes submission
      const completed = await respondToReferralRequest(alumni.id, referral.id, {
        status: "COMPLETED",
        responseNote: "Done! Submitted under candidate ref #90210.",
      });
      expect(completed.status).toBe("COMPLETED");
      expect(completed.respondedAt).toBeInstanceOf(Date);
    });

    it("should enforce strict server-side access control for referral dossier (Task 5)", async () => {
      const requester = await createTestMember({
        email: `privacy_requester_${timestamp}@campus.edu`,
        name: `Privacy Requester ${timestamp}`,
        membershipType: "STUDENT",
      });

      const recipient = await createTestMember({
        email: `privacy_recipient_${timestamp}@campus.edu`,
        name: `Privacy Recipient ${timestamp}`,
        membershipType: "ALUMNI",
      });

      const unauthorizedMember = await createTestMember({
        email: `privacy_outsider_${timestamp}@campus.edu`,
        name: `Privacy Outsider ${timestamp}`,
        membershipType: "STUDENT",
      });

      const admin = await createTestMember({
        email: `privacy_admin_${timestamp}@campus.edu`,
        name: `Privacy Admin ${timestamp}`,
        membershipType: "ADMIN",
        systemRole: "ADMIN",
      });

      const referral = await createReferralRequest(requester.id, {
        recipientId: recipient.id,
        companyName: "Meta",
        roleTitle: "Production Engineer",
        message: "Confidential message with personal contact details and salary history.",
      });

      // 1. Requester CAN access
      const reqAccess = await assertCanAccessReferral(requester.id, referral.id);
      expect(reqAccess.id).toBe(referral.id);

      // 2. Recipient CAN access
      const recAccess = await assertCanAccessReferral(recipient.id, referral.id);
      expect(recAccess.id).toBe(referral.id);

      // 3. Platform Admin CAN access
      const adminAccess = await assertCanAccessReferral(admin.id, referral.id);
      expect(adminAccess.id).toBe(referral.id);

      // 4. Unauthorized third-party CANNOT access (Throws 403 Forbidden)
      await expect(
        assertCanAccessReferral(unauthorizedMember.id, referral.id)
      ).rejects.toThrow("Access denied. You do not have permission to view this referral request.");
    });
  });
});

