import { z } from "zod";

export const SKILL_CATEGORIES = [
  "PROGRAMMING_LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "DEVOPS",
  "CLOUD",
  "DATA_AI",
  "DESIGN",
  "MOBILE",
  "SECURITY",
  "MANAGEMENT",
  "SOFT_SKILLS",
  "OTHER",
] as const;

export const SKILL_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;

export const skillCategoryEnum = z.enum(SKILL_CATEGORIES);
export const skillLevelEnum = z.enum(SKILL_LEVELS);

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters")
    .max(60, "Skill name cannot exceed 60 characters"),
  category: skillCategoryEnum.default("OTHER"),
  description: z.string().trim().max(300).optional().nullable(),
});

export const addMemberSkillSchema = z.object({
  skillName: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters")
    .max(60, "Skill name cannot exceed 60 characters"),
  category: skillCategoryEnum.optional(),
  level: skillLevelEnum.default("INTERMEDIATE"),
});

export const updateMemberSkillsBatchSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().trim().min(2).max(60),
      category: skillCategoryEnum.optional(),
      level: skillLevelEnum.default("INTERMEDIATE"),
    })
  ),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type AddMemberSkillInput = z.infer<typeof addMemberSkillSchema>;
export type UpdateMemberSkillsBatchInput = z.infer<typeof updateMemberSkillsBatchSchema>;

