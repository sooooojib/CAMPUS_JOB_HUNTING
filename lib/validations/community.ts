import { z } from "zod";

export const POST_TYPES = [
  "GENERAL_DISCUSSION",
  "CAREER_ADVICE",
  "JOB_ANNOUNCEMENT",
  "INTERNSHIP_ANNOUNCEMENT",
  "REFERRAL_REQUEST",
  "ACHIEVEMENT",
  "QUESTION",
] as const;

export const POST_VISIBILITIES = [
  "PUBLIC",
  "STUDENTS_ONLY",
  "ALUMNI_ONLY",
] as const;

export const REACTION_TYPES = [
  "LIKE",
  "INSIGHTFUL",
  "SUPPORT",
  "CELEBRATE",
] as const;

export const REPORT_REASONS = [
  "SPAM",
  "HARASSMENT",
  "INAPPROPRIATE",
  "MISINFORMATION",
  "OTHER",
] as const;

export const REPORT_TARGET_TYPES = ["POST", "COMMENT"] as const;

export const postTypeEnum = z.enum(POST_TYPES);
export const postVisibilityEnum = z.enum(POST_VISIBILITIES);
export const reactionTypeEnum = z.enum(REACTION_TYPES);
export const reportReasonEnum = z.enum(REPORT_REASONS);
export const reportTargetTypeEnum = z.enum(REPORT_TARGET_TYPES);

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .max(150, "Title cannot exceed 150 characters")
    .optional()
    .nullable(),
  content: z
    .string()
    .trim()
    .min(10, "Post content must be at least 10 characters long")
    .max(5000, "Post content cannot exceed 5,000 characters"),
  postType: postTypeEnum.default("GENERAL_DISCUSSION"),
  visibility: postVisibilityEnum.default("PUBLIC"),
  attachedOpportunityId: z.string().trim().cuid().optional().nullable(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(30, "Tag cannot exceed 30 characters")
    )
    .max(5, "Maximum 5 tags allowed")
    .optional(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .max(150, "Title cannot exceed 150 characters")
    .optional()
    .nullable(),
  content: z
    .string()
    .trim()
    .min(10, "Post content must be at least 10 characters long")
    .max(5000, "Post content cannot exceed 5,000 characters")
    .optional(),
  postType: postTypeEnum.optional(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(30, "Tag cannot exceed 30 characters")
    )
    .max(5, "Maximum 5 tags allowed")
    .optional(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Comment must be at least 2 characters long")
    .max(2000, "Comment cannot exceed 2,000 characters"),
  parentId: z.string().trim().cuid().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Comment must be at least 2 characters long")
    .max(2000, "Comment cannot exceed 2,000 characters"),
});

export const toggleReactionSchema = z.object({
  type: reactionTypeEnum,
});

export const createReportSchema = z.object({
  targetType: reportTargetTypeEnum,
  postId: z.string().trim().cuid().optional().nullable(),
  commentId: z.string().trim().cuid().optional().nullable(),
  reason: reportReasonEnum,
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1,000 characters")
    .optional()
    .nullable(),
}).refine(
  (data) => (data.targetType === "POST" && data.postId) || (data.targetType === "COMMENT" && data.commentId),
  {
    message: "Either postId or commentId must be provided according to targetType",
    path: ["targetType"],
  }
);

export const communityFilterSchema = z.object({
  postType: z.string().optional(),
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  authorId: z.string().trim().optional(),
  bookmarkedOnly: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1"),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(30, Math.max(1, parseInt(val, 10))) : 10)),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type ToggleReactionInput = z.infer<typeof toggleReactionSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type CommunityFilterInput = z.infer<typeof communityFilterSchema>;
