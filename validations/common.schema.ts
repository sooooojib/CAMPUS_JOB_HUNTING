import { z } from "zod";

/**
 * Common Zod Schemas for Mirrored Client & Server Validation
 */

export const idSchema = z.string().min(1, "Identifier is required");

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(255, "Email is too long");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(15),
  query: z.string().trim().optional(),
});

export const searchFilterSchema = paginationSchema.extend({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchFilterInput = z.infer<typeof searchFilterSchema>;

