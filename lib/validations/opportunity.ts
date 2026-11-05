import { z } from "zod";

export const opportunityTypeEnum = z.enum([
  "INTERNSHIP",
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "OTHER",
]);

export const opportunitySourceTypeEnum = z.enum([
  "OFFICIAL_EMPLOYER",
  "COMMUNITY_SHARED",
]);

export const opportunityStatusEnum = z.enum([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
  "CLOSED",
]);

export const workplaceTypeEnum = z.enum(["ON_SITE", "REMOTE", "HYBRID"]);
export const applicationMethodEnum = z.enum(["INTERNAL", "EXTERNAL"]);

export const createOpportunitySchema = z
  .object({
    title: z.string().min(3, "Job/opportunity title must be at least 3 characters").max(120),
    description: z.string().min(20, "Detailed description must be at least 20 characters").max(10000),
    companyId: z.string().optional(),
    companyName: z.string().min(2, "Company name is required").max(100),
    companyLogo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    type: opportunityTypeEnum.default("FULL_TIME"),
    sourceType: opportunitySourceTypeEnum.default("COMMUNITY_SHARED"),
    minCgpa: z
      .number()
      .min(0.0, "Minimum CGPA cannot be negative")
      .max(4.0, "Maximum university CGPA scale is 4.0")
      .optional()
      .nullable(),
    minAcademicYear: z.string().max(50).optional(),
    requiredSkills: z.array(z.string().min(1).max(50)).default([]),
    targetDepartments: z.array(z.string().min(1).max(100)).default([]),
    openToAllDepartments: z.boolean().default(true),
    salaryOrStipend: z.string().max(100).optional(),
    location: z.string().min(2, "Location is required").max(100),
    workplaceType: workplaceTypeEnum.default("ON_SITE"),
    applicationMethod: applicationMethodEnum.default("INTERNAL"),
    externalUrl: z.string().url("Must be a valid external application URL").optional().or(z.literal("")),
    contactEmail: z.string().email("Invalid contact email format").optional().or(z.literal("")),
    deadline: z
      .string()
      .or(z.date())
      .refine((val) => {
        const d = new Date(val);
        return !isNaN(d.getTime()) && d.getTime() > Date.now();
      }, "Application deadline must be a valid future date"),
    submitForReview: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.applicationMethod === "EXTERNAL" && (!data.externalUrl || data.externalUrl.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "An external application URL is required when application method is set to EXTERNAL",
      path: ["externalUrl"],
    }
  );

export type CreateOpportunityInput = z.input<typeof createOpportunitySchema>;
export type CreateOpportunityOutput = z.output<typeof createOpportunitySchema>;

export const updateOpportunitySchema = z
  .object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(20).max(10000).optional(),
    companyId: z.string().optional(),
    companyName: z.string().min(2).max(100).optional(),
    companyLogo: z.string().url().optional().or(z.literal("")),
    type: opportunityTypeEnum.optional(),
    sourceType: opportunitySourceTypeEnum.optional(),
    minCgpa: z.number().min(0.0).max(4.0).optional().nullable(),
    minAcademicYear: z.string().max(50).optional(),
    requiredSkills: z.array(z.string()).optional(),
    targetDepartments: z.array(z.string()).optional(),
    openToAllDepartments: z.boolean().optional(),
    salaryOrStipend: z.string().max(100).optional(),
    location: z.string().min(2).max(100).optional(),
    workplaceType: workplaceTypeEnum.optional(),
    applicationMethod: applicationMethodEnum.optional(),
    externalUrl: z.string().url().optional().or(z.literal("")),
    contactEmail: z.string().email().optional().or(z.literal("")),
    deadline: z
      .string()
      .or(z.date())
      .optional()
      .refine((val) => {
        if (!val) return true;
        const d = new Date(val);
        return !isNaN(d.getTime()) && d.getTime() > Date.now();
      }, "Updated deadline must be a valid future date"),
    status: opportunityStatusEnum.optional(),
  })
  .refine(
    (data) => {
      if (data.applicationMethod === "EXTERNAL" && (!data.externalUrl || data.externalUrl.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "An external application URL is required when application method is set to EXTERNAL",
      path: ["externalUrl"],
    }
  );

export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;

export const adminReviewOpportunitySchema = z
  .object({
    opportunityId: z.string().min(1, "Opportunity ID is required"),
    decision: z.enum(["APPROVE", "REJECT"]),
    rejectionReason: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.decision === "REJECT" && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "A specific rejection reason is mandatory when rejecting an opportunity.",
      path: ["rejectionReason"],
    }
  );

export type AdminReviewOpportunityInput = z.infer<typeof adminReviewOpportunitySchema>;

export const opportunityFilterSchema = z.object({
  query: z.string().optional(),
  type: opportunityTypeEnum.optional(),
  sourceType: opportunitySourceTypeEnum.optional(),
  department: z.string().optional(),
  workplaceType: workplaceTypeEnum.optional(),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  location: z.string().optional(),
  skill: z.string().optional(),
  maxMinCgpa: z.coerce.number().min(0).max(4.0).optional(),
  openToAllDepartments: z.coerce.boolean().optional(),
  bookmarkedOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type OpportunityFilterInput = z.infer<typeof opportunityFilterSchema>;
