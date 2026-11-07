import { z } from "zod";

export const submitVerificationRequestSchema = z.object({
  membershipType: z.enum([
    "STUDENT",
    "ALUMNI",
    "ADMIN",
  ]),
  institutionalId: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  academicYear: z.string().max(50).optional(),
  graduationYear: z.number().int().optional().nullable(),
  organization: z.string().max(150).optional(),
  designation: z.string().max(100).optional(),
  workEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  connectionNote: z.string().max(1000).optional(),
  proofDetails: z.string().max(1000).optional(),
  proofDocumentUrl: z.string().url("Must be a valid document URL").optional().or(z.literal("")),
});

export type SubmitVerificationRequestInput = z.infer<typeof submitVerificationRequestSchema>;

export const adminReviewVerificationSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  decision: z.enum(["APPROVE", "REJECT"]),
  rejectionReason: z.string().max(500).optional(),
}).refine(
  (data) => {
    if (data.decision === "REJECT" && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: "A specific rejection reason is required when rejecting a verification request.",
    path: ["rejectionReason"],
  }
);

export type AdminReviewVerificationInput = z.infer<typeof adminReviewVerificationSchema>;
