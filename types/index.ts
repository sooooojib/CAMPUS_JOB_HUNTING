/**
 * UniCareer Community — Global TypeScript Domain Types
 */

export type MembershipType =
  | "STUDENT"
  | "ALUMNI"
  | "ADMIN";

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
  | "JOB_ANNOUNCEMENT"
  | "REFERRAL_REQUEST"
  | "ACHIEVEMENT";

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

export type SkillCategory =
  | "PROGRAMMING_LANGUAGE"
  | "FRAMEWORK"
  | "DATABASE"
  | "DEVOPS"
  | "CLOUD"
  | "DATA_AI"
  | "DESIGN"
  | "MOBILE"
  | "SECURITY"
  | "MANAGEMENT"
  | "SOFT_SKILLS"
  | "OTHER";

export type SkillLevel =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT";

export type EligibilityStatus =
  | "ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "NEEDS_REVIEW";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string | null;
}

export interface MemberSkillItem {
  id: string;
  skillId: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface AcademicRecordItem {
  id: string;
  userId: string;
  semester: string;
  gpa: number;
  credits: number;
  academicYear?: string | null;
  notes?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityCheckResult {
  status: EligibilityStatus;
  isEligible: boolean;
  canApply: boolean;
  cgpaEligible: boolean;
  departmentEligible: boolean;
  academicYearEligible: boolean;
  deadlineValid: boolean;
  statusApproved: boolean;
  studentCgpa: number | null;
  minRequiredCgpa: number | null;
  reasons: string[];
  warnings: string[];
}

export interface MatchScoreExplanation {
  matchPercentage: number;
  scoreColor: "green" | "yellow" | "red";
  matchedSkills: string[];
  missingSkills: string[];
  totalRequiredSkills: number;
  eligibility: EligibilityCheckResult;
  recommendationReasons: string[];
}

export interface OpportunityRecommendation {
  opportunity: {
    id: string;
    title: string;
    description: string;
    companyName: string;
    companyLogo?: string | null;
    type: OpportunityType;
    location: string;
    workplaceType: string;
    salaryOrStipend?: string | null;
    deadline: string;
    minCgpa?: number | null;
    minAcademicYear?: string | null;
    targetDepartments: string[];
    openToAllDepartments: boolean;
    requiredSkills: string[];
  };
  match: MatchScoreExplanation;
}

export interface SkillGapAnalysisResult {
  studentSkills: string[];
  missingSkills: {
    name: string;
    demandCount: number;
    category: SkillCategory;
  }[];
  topDemandedSkills: {
    name: string;
    demandCount: number;
    category: SkillCategory;
  }[];
  recommendedPriorities: {
    name: string;
    demandCount: number;
    category: SkillCategory;
    reason: string;
  }[];
  curatedResources: {
    title: string;
    provider: string;
    url: string;
    skillName: string;
  }[];
}

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

// =========================================================================
// STAGE 12: Notifications, Preferences & Career Calendar Types
// =========================================================================

export type NotificationType =
  // Opportunities
  | "OPPORTUNITY_MATCH"
  | "OPPORTUNITY_DEADLINE_APPROACHING"
  | "OPPORTUNITY_APPROVED"
  | "OPPORTUNITY_REJECTED"
  | "OPPORTUNITY_CLOSED"
  | "OPPORTUNITY_EXPIRED"
  // Applications
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_STATUS_CHANGED"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_INTERVIEW_SCHEDULED"
  | "APPLICATION_WITHDRAWN"
  // Community
  | "POST_COMMENT"
  | "COMMENT_REPLY"
  | "POST_REACTION"
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "REFERRAL_REQUEST"
  | "REFERRAL_RESPONSE"
  // Membership
  | "MEMBERSHIP_APPROVED"
  | "MEMBERSHIP_REJECTED"
  | "MEMBERSHIP_INFO_REQUIRED"
  // Reminders & System
  | "CAREER_REMINDER"
  | "SYSTEM_ANNOUNCEMENT";

export type RelatedEntityType =
  | "OPPORTUNITY"
  | "APPLICATION"
  | "POST"
  | "COMMENT"
  | "CONNECTION"
  | "REFERRAL"
  | "MEMBERSHIP"
  | "CALENDAR_EVENT"
  | "SYSTEM";

export type CalendarEventType =
  | "APPLICATION_DEADLINE"
  | "SAVED_OPPORTUNITY_DEADLINE"
  | "INTERVIEW"
  | "CAREER_FAIR"
  | "REMINDER"
  | "OTHER";

export interface NotificationItem {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: RelatedEntityType | null;
  relatedEntityId?: string | null;
  actionUrl?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferencesItem {
  opportunitiesInApp: boolean;
  opportunitiesEmail: boolean;
  applicationsInApp: boolean;
  applicationsEmail: boolean;
  communityInApp: boolean;
  communityEmail: boolean;
  membershipInApp: boolean;
  membershipEmail: boolean;
  remindersInApp: boolean;
  remindersEmail: boolean;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description?: string | null;
  eventType: CalendarEventType;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  isAllDay: boolean;
  relatedOpportunityId?: string | null;
  relatedApplicationId?: string | null;
  isSystemGenerated?: boolean;
  companyName?: string | null;
  actionUrl?: string | null;
  statusBadge?: string | null;
}

// ----------------------------------------------------------------------
// STAGE 13: ADMINISTRATIVE GOVERNANCE, AUDIT LOGS & MODERATION
// ----------------------------------------------------------------------

export type AccountStatus =
  | "ACTIVE"
  | "PENDING_VERIFICATION"
  | "SUSPENDED"
  | "DEACTIVATED";

export type AdminAuditAction =
  | "MEMBER_VERIFIED"
  | "MEMBER_REJECTED"
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_RESTORED"
  | "OPPORTUNITY_APPROVED"
  | "OPPORTUNITY_REJECTED"
  | "OPPORTUNITY_CLOSED"
  | "OPPORTUNITY_DELETED"
  | "CONTENT_REPORT_RESOLVED"
  | "CONTENT_REPORT_DISMISSED"
  | "POST_REMOVED"
  | "COMMENT_REMOVED"
  | "COMPANY_VERIFIED"
  | "COMPANY_SUSPENDED"
  | "COMPANY_RESTORED"
  | "SYSTEM_SETTINGS_UPDATED";

export type AuditTargetType =
  | "USER"
  | "OPPORTUNITY"
  | "COMPANY"
  | "POST"
  | "COMMENT"
  | "REPORT"
  | "SETTINGS";

export interface AdminAuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: AdminAuditAction;
  targetType: AuditTargetType;
  targetId: string;
  targetLabel?: string | null;
  reason?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalMembers: number;
  verifiedMembers: number;
  pendingVerifications: number;
  totalOpportunities: number;
  pendingOpportunities: number;
  approvedOpportunities: number;
  rejectedOpportunities: number;
  activeOpportunities: number;
  totalApplications: number;
  communityPosts: number;
  pendingReports: number;
  suspendedAccounts: number;
  totalCompanies: number;
}

export interface AdminMemberItem {
  id: string;
  name: string;
  email: string;
  membershipType: MembershipType;
  systemRole: SystemRole;
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  department?: string | null;
  studentId?: string | null;
  headline?: string | null;
  createdAt: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  lastVerificationRequest?: {
    id: string;
    membershipType: MembershipType;
    status: string;
    organization?: string | null;
    designation?: string | null;
    connectionNote?: string | null;
    proofDetails?: string | null;
    createdAt: string;
  } | null;
}

export interface AdminReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  targetType: "POST" | "COMMENT";
  reason: string;
  description?: string | null;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  postId?: string | null;
  commentId?: string | null;
  contentSnippet?: string;
  authorId?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  authorSuspended?: boolean;
}

export interface AdminCompanyItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  createdById: string;
  creatorName: string;
  creatorEmail: string;
  opportunitiesCount: number;
  membersCount: number;
}

export interface AdminOpportunityItem {
  id: string;
  title: string;
  type: string;
  location: string;
  workplaceType: string;
  targetDepartments: string[];
  openToAllDepartments: boolean;
  minCgpa?: number | null;
  salaryOrStipend?: string | null;
  deadline: string;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "CLOSED";
  rejectionReason?: string | null;
  sourceType: string;
  isOfficial: boolean;
  companyId?: string | null;
  companyName: string;
  companyLogo?: string | null;
  posterId: string;
  posterName: string;
  posterEmail: string;
  posterRole: string;
  posterVerificationStatus: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAnalyticsData {
  memberGrowth: { period: string; count: number }[];
  opportunityActivity: { period: string; created: number; approved: number }[];
  applicationActivity: { period: string; count: number }[];
  departmentParticipation: { department: string; members: number; applications: number }[];
  opportunityTypes: { type: string; count: number }[];
  verificationBreakdown: { status: string; count: number }[];
  memberActivityDetails?: {
    id: string;
    name: string;
    email: string;
    membershipType: string;
    verificationStatus: string;
    accountStatus: string;
    createdAt: string;
    applicationsCount: number;
    opportunitiesCount: number;
    postsCount: number;
    commentsCount: number;
  }[];
}

export interface ManualApplicationItem {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  location?: string | null;
  jobUrl?: string | null;
  notes?: string | null;
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityCommentItem {
  id: string;
  opportunityId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
    membershipType: MembershipType;
    verificationStatus: VerificationStatus;
  };
  content: string;
  createdAt: string;
}




