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
  | "GENERAL_DISCUSSION"
  | "CAREER_ADVICE"
  | "JOB_ANNOUNCEMENT"
  | "INTERNSHIP_ANNOUNCEMENT"
  | "REFERRAL_REQUEST"
  | "ACHIEVEMENT"
  | "QUESTION"
  | "EVENT"
  | "ACADEMIC";

export type PostType =
  | "GENERAL_DISCUSSION"
  | "CAREER_ADVICE"
  | "JOB_ANNOUNCEMENT"
  | "INTERNSHIP_ANNOUNCEMENT"
  | "REFERRAL_REQUEST"
  | "ACHIEVEMENT"
  | "QUESTION";

export type ModerationStatus =
  | "ACTIVE"
  | "PENDING_REVIEW"
  | "FLAGGED"
  | "REMOVED";

export type PostVisibility =
  | "PUBLIC"
  | "STUDENTS_ONLY"
  | "ALUMNI_ONLY";

export type ReportTargetType =
  | "POST"
  | "COMMENT";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "INAPPROPRIATE"
  | "MISINFORMATION"
  | "OTHER";

export type ReportStatus =
  | "PENDING"
  | "REVIEWED"
  | "RESOLVED"
  | "DISMISSED";

export type ReactionType =
  | "LIKE"
  | "INSIGHTFUL"
  | "SUPPORT"
  | "CELEBRATE";

export type ConnectionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export type ReferralStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED"
  | "CANCELLED";

export interface MemberDirectoryItem {
  id: string;
  name: string;
  image: string | null;
  membershipType: MembershipType;
  verificationStatus: VerificationStatus;
  department: string | null;
  graduationYear: number | null;
  company: string | null;
  designation: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  connectionStatus?: "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "CONNECTED" | "SELF";
  connectionId?: string;
}

export interface ReferralRequestDetails {
  id: string;
  requesterId: string;
  requester: {
    id: string;
    name: string;
    image: string | null;
    membershipType: MembershipType;
    verificationStatus: VerificationStatus;
    profile?: {
      department: string | null;
      graduationYear: number | null;
      headline: string | null;
    } | null;
  };
  recipientId: string;
  recipient: {
    id: string;
    name: string;
    image: string | null;
    membershipType: MembershipType;
    verificationStatus: VerificationStatus;
    profile?: {
      company: string | null;
      designation: string | null;
      headline: string | null;
    } | null;
  };
  companyId?: string | null;
  companyName: string;
  roleTitle: string;
  opportunityId?: string | null;
  opportunity?: {
    id: string;
    title: string;
    opportunityType: OpportunityType;
    companyName?: string;
  } | null;
  message: string;
  resumeUrl?: string | null;
  status: ReferralStatus;
  responseNote?: string | null;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

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

