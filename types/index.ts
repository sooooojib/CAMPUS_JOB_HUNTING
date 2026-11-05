/**
 * UniCareer Community — Global TypeScript Domain Types
 */

export type MembershipType =
  | "STUDENT"
  | "ALUMNI"
  | "FACULTY"
  | "STAFF"
  | "EMPLOYER"
  | "EXTERNAL_CONNECTION";

export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED";

export type SystemRole =
  | "MEMBER"
  | "MODERATOR"
  | "ADMIN";

export type OpportunityType =
  | "INTERNSHIP"
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "OTHER";

export type OpportunityClassification =
  | "OFFICIAL_EMPLOYER"
  | "COMMUNITY_SHARED";

export type OpportunityStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CLOSED";

export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "INTERVIEWING"
  | "SELECTED"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

export type PostCategory =
  | "GENERAL"
  | "CAREER_ADVICE"
  | "JOB_ANNOUNCEMENT"
  | "REFERRAL_REQUEST"
  | "EVENT"
  | "ACADEMIC";

export type ReactionType =
  | "LIKE"
  | "INSIGHTFUL"
  | "SUPPORT"
  | "CELEBRATE";

/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Paginated API Response Wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

