import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens").optional(),
  logo: z.string().url("Logo must be a valid URL").optional().or(z.literal("")),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional(),
  website: z.string().url("Website must be a valid URL").optional().or(z.literal("")),
  industry: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = createCompanySchema.partial();
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

export const addCompanyMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]).default("MEMBER"),
  title: z.string().max(100).optional(),
  canPostOpportunities: z.boolean().default(true),
  canManageCompany: z.boolean().default(false),
});

export type AddCompanyMemberInput = z.infer<typeof addCompanyMemberSchema>;
