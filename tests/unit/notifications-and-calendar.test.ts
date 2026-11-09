import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
} from "@/lib/services/notification";
import {
  getUserCareerCalendar,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/services/calendar";
import { processScheduledDeadlineReminders } from "@/lib/services/reminder";
import { sendNotificationEmail, devEmailStore } from "@/lib/email";

describe("Stage 12: Notifications and Calendar System", () => {
  const timestamp = Date.now();
  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];
  const createdOpportunityIds: string[] = [];
  const createdEventIds: string[] = [];

  // Helper to create test user
  async function createTestUser(emailSuffix: string, name: string) {
    const user = await prisma.user.create({
      data: {
        email: `test_notif_${timestamp}_${emailSuffix}@university.edu`,
        name,
        membershipType: "STUDENT",
        systemRole: "MEMBER",
        verificationStatus: "VERIFIED",
        accountStatus: "ACTIVE",
        emailVerified: true,
      },
    });
    createdUserIds.push(user.id);
    return user;
  }

  // Helper to create test company and opportunity
  async function createTestOpportunity(creatorId: string, deadline: Date) {
    const uniqueSlug = `test-tech-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
    const company = await prisma.company.create({
      data: {
        name: `Test Tech ${timestamp}`,
        slug: uniqueSlug,
        industry: "Technology",
        location: "Campus Innovation Park",
        createdById: creatorId,
      },
    });
    createdCompanyIds.push(company.id);

    const opportunity = await prisma.opportunity.create({
      data: {
        title: `Software Engineer Intern ${timestamp}`,
        description: "Hands-on distributed systems development opportunity.",
        companyId: company.id,
        companyName: company.name,
        posterId: creatorId,
        type: "INTERNSHIP",
        workplaceType: "HYBRID",
        location: "Campus Innovation Park",
        sourceType: "OFFICIAL_EMPLOYER",
        status: "APPROVED",
        deadline,
        requiredSkills: ["TypeScript", "PostgreSQL"],
      },
    });
    createdOpportunityIds.push(opportunity.id);

    return { company, opportunity };
  }

  afterAll(async () => {
    // Cleanup created test records
    if (createdEventIds.length > 0) {
      await prisma.careerCalendarEvent.deleteMany({
        where: { id: { in: createdEventIds } },
      }).catch(() => {});
    }

    if (createdUserIds.length > 0) {
      await prisma.deadlineReminderLog.deleteMany({
        where: { userId: { in: createdUserIds } },
      }).catch(() => {});

      await prisma.notification.deleteMany({
        where: { recipientId: { in: createdUserIds } },
      }).catch(() => {});

      await prisma.notificationPreference.deleteMany({
        where: { userId: { in: createdUserIds } },
      }).catch(() => {});

      await prisma.application.deleteMany({
        where: { applicantId: { in: createdUserIds } },
      }).catch(() => {});

      await prisma.opportunityBookmark.deleteMany({
        where: { userId: { in: createdUserIds } },
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

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      }).catch(() => {});
    }
  });

  describe("1. Notification Database & Core Operations", () => {
    it("creates a new notification when recipient has in-app notifications enabled", async () => {
      const user = await createTestUser("alice", "Alice Student");

      const notif = await createNotification({
        recipientId: user.id,
        type: "APPLICATION_STATUS_CHANGED",
        title: "Application Under Review",
        message: "Your submission is being reviewed by the engineering committee.",
        relatedEntityType: "APPLICATION",
        relatedEntityId: "app-test-123",
        actionUrl: "/applications",
      });

      expect(notif).toBeDefined();
      expect(notif?.id).toBeDefined();
      expect(notif?.title).toBe("Application Under Review");
      expect(notif?.isRead).toBe(false);
      expect(notif?.recipientId).toBe(user.id);
    });

    it("prevents duplicate unread notifications by updating existing unread record", async () => {
      const user = await createTestUser("bob", "Bob Student");

      const first = await createNotification({
        recipientId: user.id,
        type: "OPPORTUNITY_DEADLINE_APPROACHING",
        title: "Deadline Approaching",
        message: "First reminder message.",
        relatedEntityType: "OPPORTUNITY",
        relatedEntityId: "opp-dedup-456",
        actionUrl: "/opportunities/opp-dedup-456",
      });

      expect(first).toBeDefined();

      const second = await createNotification({
        recipientId: user.id,
        type: "OPPORTUNITY_DEADLINE_APPROACHING",
        title: "Deadline Approaching (Updated)",
        message: "Second updated reminder message.",
        relatedEntityType: "OPPORTUNITY",
        relatedEntityId: "opp-dedup-456",
        actionUrl: "/opportunities/opp-dedup-456",
      });

      expect(second).toBeDefined();
      expect(second?.id).toBe(first?.id); // Deduplication updated the same record
      expect(second?.title).toBe("Deadline Approaching (Updated)");

      // Check count in database
      const count = await prisma.notification.count({
        where: {
          recipientId: user.id,
          relatedEntityId: "opp-dedup-456",
        },
      });
      expect(count).toBe(1);
    });

    it("retrieves paginated notifications and accurate unread count", async () => {
      const user = await createTestUser("carol", "Carol Student");

      await createNotification({
        recipientId: user.id,
        type: "POST_COMMENT",
        title: "New Comment",
        message: "Someone commented on your discussion post.",
        relatedEntityType: "POST",
        relatedEntityId: "post-1",
      });

      await createNotification({
        recipientId: user.id,
        type: "REFERRAL_REQUEST",
        title: "Referral Request Received",
        message: "A peer requested an endorsement.",
        relatedEntityType: "REFERRAL",
        relatedEntityId: "ref-1",
      });

      const { notifications, totalCount, unreadCount } = await getUserNotifications(user.id, {
        page: 1,
        pageSize: 10,
      });

      expect(totalCount).toBe(2);
      expect(unreadCount).toBe(2);
      expect(notifications.length).toBe(2);

      const count = await getUnreadNotificationCount(user.id);
      expect(count).toBe(2);
    });

    it("marks an individual notification as read and records read timestamp", async () => {
      const user = await createTestUser("dave", "Dave Student");

      const notif = await createNotification({
        recipientId: user.id,
        type: "MEMBERSHIP_APPROVED",
        title: "Verification Approved",
        message: "Welcome to verified status.",
        relatedEntityType: "MEMBERSHIP",
        relatedEntityId: "verif-1",
      });

      expect(notif?.isRead).toBe(false);

      const updated = await markNotificationAsRead(user.id, notif!.id);
      expect(updated.isRead).toBe(true);
      expect(updated.readAt).toBeDefined();

      const unread = await getUnreadNotificationCount(user.id);
      expect(unread).toBe(0);
    });

    it("marks all unread notifications as read in a single batch operation", async () => {
      const user = await createTestUser("eve", "Eve Student");

      await createNotification({
        recipientId: user.id,
        type: "APPLICATION_SHORTLISTED",
        title: "You are Shortlisted",
        message: "Shortlisted for next stage.",
      });

      await createNotification({
        recipientId: user.id,
        type: "APPLICATION_INTERVIEW_SCHEDULED",
        title: "Interview Scheduled",
        message: "Interview round scheduled for next week.",
      });

      const countBefore = await getUnreadNotificationCount(user.id);
      expect(countBefore).toBe(2);

      const batchCount = await markAllNotificationsAsRead(user.id);
      expect(batchCount.count).toBe(2);

      const countAfter = await getUnreadNotificationCount(user.id);
      expect(countAfter).toBe(0);
    });

    it("enforces recipient authorization boundaries (cannot mark or delete other member's notifications)", async () => {
      const userA = await createTestUser("user_a", "User A");
      const userB = await createTestUser("user_b", "User B");

      const notifA = await createNotification({
        recipientId: userA.id,
        type: "APPLICATION_SUBMITTED",
        title: "Application Received",
        message: "Your application was registered.",
      });

      // User B attempts to mark User A's notification
      await expect(markNotificationAsRead(userB.id, notifA!.id)).rejects.toThrow(
        /forbidden/i
      );

      // User B attempts to delete User A's notification
      await expect(deleteNotification(userB.id, notifA!.id)).rejects.toThrow(
        /forbidden/i
      );

      // User A can successfully delete it
      const deleted = await deleteNotification(userA.id, notifA!.id);
      expect(deleted.id).toBe(notifA!.id);
    });
  });

  describe("2. Notification Preferences & Suppression", () => {
    it("returns default preferences if not yet configured", async () => {
      const user = await createTestUser("frank", "Frank Student");

      const prefs = await getUserNotificationPreferences(user.id);
      expect(prefs.opportunitiesInApp).toBe(true);
      expect(prefs.applicationsInApp).toBe(true);
      expect(prefs.communityEmail).toBe(false); // default off for high volume
      expect(prefs.remindersInApp).toBe(true);
    });

    it("updates preferences and suppresses in-app notification when toggled off", async () => {
      const user = await createTestUser("grace", "Grace Student");

      // Turn off opportunity in-app notifications
      await updateUserNotificationPreferences(user.id, {
        opportunitiesInApp: false,
      });

      const updatedPrefs = await getUserNotificationPreferences(user.id);
      expect(updatedPrefs.opportunitiesInApp).toBe(false);

      // Try creating opportunity notification
      const result = await createNotification({
        recipientId: user.id,
        type: "OPPORTUNITY_APPROVED",
        title: "Opportunity Approved",
        message: "Your posting has been approved.",
        relatedEntityType: "OPPORTUNITY",
        relatedEntityId: "opp-suppressed",
      });

      // In-app was suppressed due to user preferences
      expect(result).toBeNull();

      const notifs = await getUserNotifications(user.id);
      expect(notifs.totalCount).toBe(0);
    });
  });

  describe("3. Career Calendar Management", () => {
    it("creates, retrieves, and deletes custom career reminders", async () => {
      const user = await createTestUser("heidi", "Heidi Student");

      const now = new Date();
      const eventDate = new Date(now.getFullYear(), now.getMonth(), 15, 14, 0, 0);

      const event = await createCalendarEvent(user.id, {
        title: "Mock Interview with Senior Alumni",
        description: "Preparing behavioral questions and STAR framework stories.",
        eventType: "INTERVIEW",
        startDate: eventDate.toISOString(),
        isAllDay: false,
      });

      createdEventIds.push(event.id);

      expect(event.id).toBeDefined();
      expect(event.title).toBe("Mock Interview with Senior Alumni");
      expect(event.isSystemGenerated).toBe(false);

      // Update the event
      const updated = await updateCalendarEvent(user.id, event.id, {
        title: "Updated: Mock Interview with Senior Alumni",
      });
      expect(updated.title).toBe("Updated: Mock Interview with Senior Alumni");

      // Verify User B cannot delete Heidi's event
      const userOther = await createTestUser("ivan", "Ivan Student");
      await expect(deleteCalendarEvent(userOther.id, event.id)).rejects.toThrow(
        /forbidden/i
      );

      // Delete the event
      const deleted = await deleteCalendarEvent(user.id, event.id);
      expect(deleted.id).toBe(event.id);
    });

    it("aggregates custom events, application deadlines, and saved opportunities into personal career calendar", async () => {
      const user = await createTestUser("judy", "Judy Student");
      const creator = await createTestUser("recruiter", "Campus Recruiter");

      const year = 2026;
      const month = 11; // November 2026

      // 1. Create custom reminder in November 2026
      const customEventDate = new Date(year, month - 1, 10, 10, 0, 0);
      const customEvent = await createCalendarEvent(user.id, {
        title: "Resume Review Workshop",
        eventType: "REMINDER",
        startDate: customEventDate.toISOString(),
        isAllDay: true,
      });
      createdEventIds.push(customEvent.id);

      // 2. Create opportunity with deadline in November 2026
      const deadlineDate = new Date(year, month - 1, 20, 23, 59, 59);
      const { opportunity } = await createTestOpportunity(creator.id, deadlineDate);

      // User applies to this opportunity
      await prisma.application.create({
        data: {
          opportunityId: opportunity.id,
          applicantId: user.id,
          method: "INTERNAL",
          status: "UNDER_REVIEW",
        },
      });

      // 3. Create another opportunity bookmarked/saved by user in November 2026
      const savedDeadlineDate = new Date(year, month - 1, 25, 23, 59, 59);
      const { opportunity: savedOpp } = await createTestOpportunity(creator.id, savedDeadlineDate);

      await prisma.opportunityBookmark.create({
        data: {
          userId: user.id,
          opportunityId: savedOpp.id,
        },
      });

      // Fetch calendar for November 2026
      const calendar = await getUserCareerCalendar(user.id, year, month);

      expect(calendar.year).toBe(year);
      expect(calendar.month).toBe(month);
      expect(calendar.events.length).toBeGreaterThanOrEqual(3);

      const customFound = calendar.events.find((e) => e.id === customEvent.id);
      expect(customFound).toBeDefined();
      expect(customFound?.isSystemGenerated).toBe(false);

      const appDeadlineFound = calendar.events.find(
        (e) => e.eventType === "APPLICATION_DEADLINE" && e.relatedOpportunityId === opportunity.id
      );
      expect(appDeadlineFound).toBeDefined();
      expect(appDeadlineFound?.isSystemGenerated).toBe(true);

      const savedDeadlineFound = calendar.events.find(
        (e) => e.eventType === "SAVED_OPPORTUNITY_DEADLINE" && e.relatedOpportunityId === savedOpp.id
      );
      expect(savedDeadlineFound).toBeDefined();
      expect(savedDeadlineFound?.isSystemGenerated).toBe(true);
    });
  });

  describe("4. Deadline Reminders & Cron Scanning Idempotency", () => {
    it("dispatches deadline notifications and prevents duplicate dispatches via DeadlineReminderLog", async () => {
      const applicant = await createTestUser("mallory", "Mallory Student");
      const creator = await createTestUser("employer_mallory", "Employer Rep");

      // Deadline in 48 hours (within the 72-hour reminder window)
      const nearDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const { opportunity } = await createTestOpportunity(creator.id, nearDeadline);

      // Member applies to opportunity
      await prisma.application.create({
        data: {
          opportunityId: opportunity.id,
          applicantId: applicant.id,
          method: "INTERNAL",
          status: "UNDER_REVIEW",
        },
      });

      // Run reminder scan: first run should trigger notification
      const firstRun = await processScheduledDeadlineReminders();
      expect(firstRun.opportunitiesScanned).toBeGreaterThanOrEqual(1);
      expect(firstRun.remindersTriggered).toBeGreaterThanOrEqual(1);

      // Verify notification in database
      const notif = await prisma.notification.findFirst({
        where: {
          recipientId: applicant.id,
          type: "OPPORTUNITY_DEADLINE_APPROACHING",
          relatedEntityId: opportunity.id,
        },
      });
      expect(notif).toBeDefined();
      expect(notif?.title).toContain("Deadline");

      // Verify log entry was written
      const logEntry = await prisma.deadlineReminderLog.findFirst({
        where: {
          userId: applicant.id,
          opportunityId: opportunity.id,
          reminderType: "DEADLINE_72_HOURS",
        },
      });
      expect(logEntry).toBeDefined();

      // Run reminder scan a second time: must NOT dispatch duplicate notification (skipped duplicates increments)
      const secondRun = await processScheduledDeadlineReminders();
      expect(secondRun.skippedDuplicates).toBeGreaterThanOrEqual(1);
    });
  });

  describe("5. Email Notification Resiliency", () => {
    it("safely handles email dispatches and records to dev store without leaking credentials", async () => {
      const testEmail = `dev_email_test_${timestamp}@university.edu`;

      const result = await sendNotificationEmail({
        to: testEmail,
        recipientName: "Test Recipient",
        subject: "Application Deadline Reminder (72h Notice)",
        title: "Upcoming Application Deadline",
        message: "Your saved opportunity 'Software Engineer Intern' is closing soon.",
        actionUrl: "/opportunities/123",
        actionLabel: "View Opportunity Details",
      });

      expect(result.success).toBe(true);

      // Dev store recorded the email
      const record = devEmailStore.getLatestFor(testEmail);
      expect(record).toBeDefined();
      expect(record?.subject).toContain("Application Deadline Reminder");
    });
  });
});
