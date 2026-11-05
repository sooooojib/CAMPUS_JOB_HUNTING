import { prisma } from "@/lib/prisma";
import {
  NotificationType,
  RelatedEntityType,
  NotificationItem,
  NotificationPreferencesItem,
} from "@/types";
import { UpdateNotificationPreferencesInput } from "@/lib/validations/notification";
import { sendNotificationEmail } from "@/lib/email";

export interface CreateNotificationParams {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: RelatedEntityType;
  relatedEntityId?: string;
  actionUrl?: string;
}

/**
 * Maps a NotificationType to its parent category for preferences check.
 */
export function getNotificationCategory(
  type: NotificationType
): "OPPORTUNITY" | "APPLICATION" | "COMMUNITY" | "MEMBERSHIP" | "REMINDER" {
  if (type.startsWith("OPPORTUNITY_")) return "OPPORTUNITY";
  if (type.startsWith("APPLICATION_")) return "APPLICATION";
  if (
    type.startsWith("POST_") ||
    type.startsWith("COMMENT_") ||
    type.startsWith("CONNECTION_") ||
    type.startsWith("REFERRAL_")
  ) {
    return "COMMUNITY";
  }
  if (type.startsWith("MEMBERSHIP_")) return "MEMBERSHIP";
  return "REMINDER";
}

/**
 * Retrieves the notification preferences for a user, or provides default settings.
 */
export async function getUserNotificationPreferences(
  userId: string
): Promise<NotificationPreferencesItem> {
  const pref = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  if (pref) {
    return {
      opportunitiesInApp: pref.opportunitiesInApp,
      opportunitiesEmail: pref.opportunitiesEmail,
      applicationsInApp: pref.applicationsInApp,
      applicationsEmail: pref.applicationsEmail,
      communityInApp: pref.communityInApp,
      communityEmail: pref.communityEmail,
      membershipInApp: pref.membershipInApp,
      membershipEmail: pref.membershipEmail,
      remindersInApp: pref.remindersInApp,
      remindersEmail: pref.remindersEmail,
    };
  }

  // Default institutional preferences
  return {
    opportunitiesInApp: true,
    opportunitiesEmail: true,
    applicationsInApp: true,
    applicationsEmail: true,
    communityInApp: true,
    communityEmail: false, // Low frequency for social/reactions
    membershipInApp: true,
    membershipEmail: true,
    remindersInApp: true,
    remindersEmail: true,
  };
}

/**
 * Updates or creates notification preferences for a member.
 */
export async function updateUserNotificationPreferences(
  userId: string,
  input: UpdateNotificationPreferencesInput
): Promise<NotificationPreferencesItem> {
  const updated = await prisma.notificationPreference.upsert({
    where: { userId },
    create: {
      userId,
      ...input,
    },
    update: {
      ...input,
    },
  });

  return {
    opportunitiesInApp: updated.opportunitiesInApp,
    opportunitiesEmail: updated.opportunitiesEmail,
    applicationsInApp: updated.applicationsInApp,
    applicationsEmail: updated.applicationsEmail,
    communityInApp: updated.communityInApp,
    communityEmail: updated.communityEmail,
    membershipInApp: updated.membershipInApp,
    membershipEmail: updated.membershipEmail,
    remindersInApp: updated.remindersInApp,
    remindersEmail: updated.remindersEmail,
  };
}

/**
 * Creates an in-app notification and dispatches an email if permitted by user preferences.
 * Enforces deduplication logic to prevent spamming notifications.
 */
export async function createNotification(
  params: CreateNotificationParams
): Promise<NotificationItem | null> {
  const {
    recipientId,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
    actionUrl,
  } = params;

  // 1. Fetch user & preferences
  const [user, preferences] = await Promise.all([
    prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, name: true, email: true, accountStatus: true },
    }),
    getUserNotificationPreferences(recipientId),
  ]);

  if (!user || user.accountStatus === "DEACTIVATED" || user.accountStatus === "SUSPENDED") {
    return null;
  }

  const category = getNotificationCategory(type);

  // Check in-app preference
  let inAppAllowed = true;
  let emailAllowed = false;

  switch (category) {
    case "OPPORTUNITY":
      inAppAllowed = preferences.opportunitiesInApp;
      emailAllowed = preferences.opportunitiesEmail;
      break;
    case "APPLICATION":
      inAppAllowed = preferences.applicationsInApp;
      emailAllowed = preferences.applicationsEmail;
      break;
    case "COMMUNITY":
      inAppAllowed = preferences.communityInApp;
      emailAllowed = preferences.communityEmail;
      break;
    case "MEMBERSHIP":
      inAppAllowed = preferences.membershipInApp;
      emailAllowed = preferences.membershipEmail;
      break;
    case "REMINDER":
      inAppAllowed = preferences.remindersInApp;
      emailAllowed = preferences.remindersEmail;
      break;
  }

  // 2. Prevent duplicate notifications
  // Skip if an unread notification of the same type and entity already exists
  if (relatedEntityId && relatedEntityType) {
    const existingUnread = await prisma.notification.findFirst({
      where: {
        recipientId,
        type,
        relatedEntityType,
        relatedEntityId,
        isRead: false,
      },
    });

    if (existingUnread) {
      // Notification already pending unread, update timestamp and contents
      const updated = await prisma.notification.update({
        where: { id: existingUnread.id },
        data: {
          title,
          message,
          actionUrl: actionUrl ?? existingUnread.actionUrl,
          updatedAt: new Date(),
        },
      });
      return formatNotification(updated);
    }
  }

  // 3. Create In-App Notification if enabled
  let notificationRecord = null;
  if (inAppAllowed) {
    notificationRecord = await prisma.notification.create({
      data: {
        recipientId,
        type,
        title,
        message,
        relatedEntityType,
        relatedEntityId,
        actionUrl,
      },
    });
  }

  // 4. Send Email Notification if enabled
  if (emailAllowed && user.email) {
    // Fire and record email asynchronously
    sendNotificationEmail({
      to: user.email,
      name: user.name,
      title,
      message,
      category,
      actionUrl,
    }).catch((err) => {
      console.error("[Notification Service] Error sending notification email:", err);
    });
  }

  return notificationRecord ? formatNotification(notificationRecord) : null;
}

/**
 * Queries paginated notifications for the authorized recipient only.
 */
export async function getUserNotifications(
  userId: string,
  options: {
    unreadOnly?: boolean;
    type?: NotificationType;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { unreadOnly = false, type, page = 1, pageSize = 20 } = options;
  const skip = (page - 1) * pageSize;

  const where: any = {
    recipientId: userId,
  };

  if (unreadOnly) {
    where.isRead = false;
  }

  if (type) {
    where.type = type;
  }

  const [totalCount, unreadCount, records] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    }),
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatted = records.map(formatNotification);

  return {
    notifications: formatted,
    items: formatted,
    totalCount,
    unreadCount,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Returns the unread notification count for the header bell badge.
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { recipientId: userId, isRead: false },
  });
}

/**
 * Marks a single notification as read, enforcing recipient authorization.
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<NotificationItem> {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found.");
  }

  if (notification.recipientId !== userId) {
    throw new Error("FORBIDDEN: You cannot modify notifications belonging to another member.");
  }

  if (notification.isRead) {
    return formatNotification(notification);
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return formatNotification(updated);
}

/**
 * Marks all notifications for a member as read.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<{ count: number }> {
  const result = await prisma.notification.updateMany({
    where: {
      recipientId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { count: result.count };
}

/**
 * Deletes a notification, ensuring recipient authorization.
 */
export async function deleteNotification(
  userId: string,
  notificationId: string
): Promise<{ success: boolean; id: string }> {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found.");
  }

  if (notification.recipientId !== userId) {
    throw new Error("FORBIDDEN: You cannot delete notifications belonging to another member.");
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { success: true, id: notificationId };
}

function formatNotification(n: any): NotificationItem {
  return {
    id: n.id,
    recipientId: n.recipientId,
    type: n.type as NotificationType,
    title: n.title,
    message: n.message,
    relatedEntityType: n.relatedEntityType as RelatedEntityType | null,
    relatedEntityId: n.relatedEntityId,
    actionUrl: n.actionUrl,
    isRead: n.isRead,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  };
}
