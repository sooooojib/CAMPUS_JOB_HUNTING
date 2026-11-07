import { z } from "zod";

export const applicationMethodSchema = z.enum(["INTERNAL", "EXTERNAL"]);

export const applicationStatusSchema = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
  "WITHDRAWN",
]);

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

/**
 * Validation schema for internal application submission
 */
export const submitApplicationSchema = z.object({
  opportunityId: z.string().min(1, "Opportunity ID is required."),
  resumeId: z.string().optional(),
  coverLetter: z
    .string()
    .max(5000, "Cover letter cannot exceed 5000 characters.")
    .optional()
    .nullable(),
  method: applicationMethodSchema.default("INTERNAL"),
  externalNotes: z
    .string()
    .max(1000, "External notes cannot exceed 1000 characters.")
    .optional()
    .nullable(),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;

/**
 * Validation schema for updating candidate application status by employers
 */
export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
  note: z
    .string()
    .max(2000, "Status transition note cannot exceed 2000 characters.")
    .optional()
    .nullable(),
  employerNotes: z
    .string()
    .max(5000, "Internal employer notes cannot exceed 5000 characters.")
    .optional()
    .nullable(),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

/**
 * Validation schema for recording external application tracking
 */
export const recordExternalApplicationSchema = z.object({
  opportunityId: z.string().min(1, "Opportunity ID is required."),
  externalNotes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional()
    .nullable(),
});

export type RecordExternalApplicationInput = z.infer<typeof recordExternalApplicationSchema>;

/**
 * Validation schema for candidate withdrawing their application
 */
export const withdrawApplicationSchema = z.object({
  reason: z
    .string()
    .max(1000, "Withdrawal reason cannot exceed 1000 characters.")
    .optional()
    .nullable(),
});

export type WithdrawApplicationInput = z.infer<typeof withdrawApplicationSchema>;

/**
 * File validation constants and helpers for Secure Resume Storage
 */
export const RESUME_UPLOAD_LIMITS = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],
  allowedExtensions: [".pdf", ".docx", ".doc"],
};

/**
 * Inspect magic bytes of uploaded buffer to prevent content-type spoofing
 */
export function inspectFileMagicBytes(buffer: Buffer): {
  isValid: boolean;
  detectedMime: string | null;
  detectedExt: string | null;
  error?: string;
} {
  if (!buffer || buffer.length < 4) {
    return { isValid: false, detectedMime: null, detectedExt: null, error: "Empty or invalid file payload." };
  }

  // PDF check: starts with "%PDF-" (0x25 0x50 0x44 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return {
      isValid: true,
      detectedMime: "application/pdf",
      detectedExt: ".pdf",
    };
  }

  // DOCX / Office Open XML: ZIP archive starts with PK\x03\x04 (0x50 0x4B 0x03 0x04)
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return {
      isValid: true,
      detectedMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      detectedExt: ".docx",
    };
  }

  // Legacy DOC: OLE compound file starts with 0xD0 0xCF 0x11 0xE0
  if (
    buffer[0] === 0xd0 &&
    buffer[1] === 0xcf &&
    buffer[2] === 0x11 &&
    buffer[3] === 0xe0
  ) {
    return {
      isValid: true,
      detectedMime: "application/msword",
      detectedExt: ".doc",
    };
  }

  return {
    isValid: false,
    detectedMime: null,
    detectedExt: null,
    error: "Security validation failed: File signature does not match authorized PDF or Word document standards.",
  };
}

export const createManualApplicationSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required.").max(150),
  roleTitle: z.string().trim().min(1, "Role title is required.").max(150),
  location: z.string().trim().max(150).optional().nullable(),
  jobUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]).default("APPLIED"),
  appliedDate: z.string().optional(),
});

export const updateManualApplicationSchema = z.object({
  companyName: z.string().trim().min(1).max(150).optional(),
  roleTitle: z.string().trim().min(1).max(150).optional(),
  location: z.string().trim().max(150).optional().nullable(),
  jobUrl: z.string().trim().url().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]).optional(),
  appliedDate: z.string().optional(),
});


