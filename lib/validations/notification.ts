import { z } from "zod";

export const NOTIFICATION_TYPES = [
  "OPPORTUNITY_MATCH",
  "OPPORTUNITY_DEADLINE_APPROACHING",
  "OPPORTUNITY_APPROVED",
  "OPPORTUNITY_REJECTED",
  "OPPORTUNITY_CLOSED",
  "OPPORTUNITY_EXPIRED",
  "APPLICATION_SUBMITTED",
  "APPLICATION_STATUS_CHANGED",
  "APPLICATION_SHORTLISTED",
  "APPLICATION_INTERVIEW_SCHEDULED",
  "APPLICATION_WITHDRAWN",
  "POST_COMMENT",
  "COMMENT_REPLY",
  "POST_REACTION",
  "CONNECTION_REQUEST",
  "CONNECTION_ACCEPTED",
  "REFERRAL_REQUEST",
  "REFERRAL_RESPONSE",
  "MEMBERSHIP_APPROVED",
  "MEMBERSHIP_REJECTED",
  "MEMBERSHIP_INFO_REQUIRED",
  "CAREER_REMINDER",
  "SYSTEM_ANNOUNCEMENT",
] as const;

export const notificationQuerySchema = z.object({
  unreadOnly: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  type: z.enum(NOTIFICATION_TYPES).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10))) : 20)),
});

export const updateNotificationPreferencesSchema = z.object({
  opportunitiesInApp: z.boolean().optional(),
  opportunitiesEmail: z.boolean().optional(),
  applicationsInApp: z.boolean().optional(),
  applicationsEmail: z.boolean().optional(),
  communityInApp: z.boolean().optional(),
  communityEmail: z.boolean().optional(),
  membershipInApp: z.boolean().optional(),
  membershipEmail: z.boolean().optional(),
  remindersInApp: z.boolean().optional(),
  remindersEmail: z.boolean().optional(),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;

