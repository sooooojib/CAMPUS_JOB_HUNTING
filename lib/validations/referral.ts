import { z } from "zod";

export const REFERRAL_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const referralStatusEnum = z.enum(REFERRAL_STATUSES);

export const createReferralSchema = z.object({
  recipientId: z.string().min(1, "Recipient member is required"),
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),
  companyId: z.string().optional().nullable(),
  roleTitle: z
    .string()
    .trim()
    .min(2, "Role title must be at least 2 characters")
    .max(100, "Role title cannot exceed 100 characters"),
  opportunityId: z.string().optional().nullable(),
  message: z
    .string()
    .trim()
    .min(20, "Please provide a polite message explaining your background and target role (at least 20 characters)")
    .max(2000, "Message cannot exceed 2000 characters"),
  resumeUrl: z
    .string()
    .trim()
    .url("Resume URL must be a valid link")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export const respondReferralSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "COMPLETED"]),
  responseNote: z
    .string()
    .trim()
    .max(1000, "Note cannot exceed 1000 characters")
    .optional()
    .nullable(),
});

export const referralQuerySchema = z.object({
  role: z.enum(["SENT", "RECEIVED", "ALL"]).default("ALL"),
  status: referralStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;
export type RespondReferralInput = z.infer<typeof respondReferralSchema>;
export type ReferralQueryInput = z.infer<typeof referralQuerySchema>;

