import { z } from "zod";

export const adminMemberQuerySchema = z.object({
  q: z.string().trim().optional(),
  membershipType: z
    .enum(["ALL", "STUDENT", "ALUMNI", "ADMIN"])
    .optional(),
  verificationStatus: z
    .enum(["ALL", "PENDING", "VERIFIED", "REJECTED", "SUSPENDED", "CG_VERIFIED", "CG_PENDING"])
    .optional(),
  accountStatus: z
    .enum(["ALL", "ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "DEACTIVATED"])
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
});

export const adminSuspendUserSchema = z.object({
  action: z.enum(["SUSPEND", "RESTORE"]),
  reason: z
    .string()
    .trim()
    .min(5, "A reason of at least 5 characters is required for accountability")
    .max(500, "Reason cannot exceed 500 characters"),
});

export const adminVerifyUserSchema = z.object({
  status: z.enum(["VERIFIED", "PENDING", "REJECTED", "SUSPENDED"]),
  reason: z.string().trim().max(500).optional(),
});

export const adminDeleteUserSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const adminOpportunityQuerySchema = z.object({
  status: z
    .enum(["ALL", "DRAFT", "PENDING", "APPROVED", "REJECTED", "EXPIRED", "CLOSED"])
    .optional(),
  type: z.string().optional(),
  q: z.string().trim().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
});

export const adminOpportunityReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "CLOSE", "DELETE"]),
  reason: z.string().trim().max(1000).optional(),
}).refine(
  (data) => {
    if (data.action === "REJECT" && (!data.reason || data.reason.trim().length < 5)) {
      return false;
    }
    return true;
  },
  {
    message: "A rejection reason of at least 5 characters is required",
    path: ["reason"],
  }
);

export const adminReportActionSchema = z.object({
  action: z.enum(["RESOLVE", "DISMISS", "REMOVE_CONTENT", "SUSPEND_AUTHOR"]),
  reviewNotes: z.string().trim().max(1000).optional(),
});

export const adminCompanyActionSchema = z.object({
  action: z.enum(["VERIFY", "UNVERIFY", "SUSPEND", "RESTORE"]),
  reason: z.string().trim().max(500).optional(),
});

export const adminAuditQuerySchema = z.object({
  action: z.string().optional(),
  targetType: z.string().optional(),
  adminId: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
});

export type AdminMemberQueryInput = z.infer<typeof adminMemberQuerySchema>;
export type AdminOpportunityQueryInput = z.infer<typeof adminOpportunityQuerySchema>;
export type AdminSuspendUserInput = z.infer<typeof adminSuspendUserSchema>;
export type AdminOpportunityReviewInput = z.infer<typeof adminOpportunityReviewSchema>;
export type AdminReportActionInput = z.infer<typeof adminReportActionSchema>;
export type AdminCompanyActionInput = z.infer<typeof adminCompanyActionSchema>;
export type AdminAuditQueryInput = z.infer<typeof adminAuditQuerySchema>;
