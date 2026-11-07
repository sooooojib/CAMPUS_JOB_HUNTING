/**
 * Institutional Permissions & Access Control Service
 * UniCareer Community - Stage 5
 *
 * Implements strict server-side authorization gates for membership types,
 * verification statuses, opportunity posting rights, and applicant moderation.
 */

export interface UserPermissionContext {
  id?: string;
  systemRole?: string | null;
  membershipType?: string | null;
  verificationStatus?: string | null;
  accountStatus?: string | null;
  canPostOpportunities?: boolean | null;
  canReviewApplicants?: boolean | null;
}

/**
 * Validates whether an account is actively authorized to use authenticated features.
 */
export function isAccountActive(user?: UserPermissionContext | null): boolean {
  if (!user) return false;
  return user.accountStatus === "ACTIVE" || !user.accountStatus;
}

/**
 * Checks whether the user is a platform administrator.
 * Platform ADMIN is strictly decoupled from institutional membership types.
 */
export function isPlatformAdmin(user?: UserPermissionContext | null): boolean {
  if (!user) return false;
  return user.systemRole === "ADMIN" || user.membershipType === "ADMIN";
}

/**
 * Checks whether the user is verified by the university registrar or administrator.
 */
export function isVerifiedMember(user?: UserPermissionContext | null): boolean {
  if (!user) return false;
  return user.verificationStatus === "VERIFIED";
}

/**
 * Checks whether a user possesses posting permissions to publish opportunities.
 *
 * RULES (Non-negotiable):
 * 1. Unverified users (PENDING, REJECTED, SUSPENDED) CANNOT post opportunities.
 * 2. Platform ADMINs can always post.
 * 3. Verified ALUMNI, or verified members with explicit canPostOpportunities authorization can post.
 * 4. Frontend state cannot bypass this; server must assert this before saving.
 */
export function canPostOpportunity(user?: UserPermissionContext | null): boolean {
  if (!user || !isAccountActive(user)) return false;

  // Platform administrator has full system posting rights
  if (isPlatformAdmin(user)) return true;

  // Must be verified by the institution
  if (!isVerifiedMember(user)) return false;

  // If explicit permission flag is set
  if (user.canPostOpportunities === true) return true;

  // Verified Alumni can post opportunities/job leads
  if (user.membershipType === "ALUMNI") {
    return true;
  }

  return false;
}

/**
 * Checks whether a member can review and manage candidate applications for an opportunity.
 * Restricted to Platform Administrators and Authorized posters.
 */
export function canReviewApplicants(user?: UserPermissionContext | null): boolean {
  if (!user || !isAccountActive(user)) return false;
  if (isPlatformAdmin(user)) return true;
  if (!isVerifiedMember(user)) return false;

  return user.membershipType === "ALUMNI" || user.canReviewApplicants === true;
}

/**
 * Checks whether the user can access student-specific academic career tools
 * (CGPA eligibility, course gap analytics).
 * Non-student profiles must not see academic/CGPA tooling per AGENTS.md.
 */
export function canAccessStudentTools(user?: UserPermissionContext | null): boolean {
  if (!user || !isAccountActive(user)) return false;
  return user.membershipType === "STUDENT";
}

/**
 * Assert posting permissions or throw an HTTP 403 Forbidden response.
 */
export function assertCanPostOpportunity(user?: UserPermissionContext | null): void {
  if (!canPostOpportunity(user)) {
    throw new Error("FORBIDDEN_POSTING_PERMISSION: Only verified members with posting clearance may publish opportunities.");
  }
}

/**
 * Assert platform admin role or throw an HTTP 403 Forbidden response.
 */
export function assertAdmin(user?: UserPermissionContext | null): void {
  if (!isPlatformAdmin(user)) {
    throw new Error("FORBIDDEN_ADMIN_ACCESS: Institutional administration clearance required.");
  }
}
