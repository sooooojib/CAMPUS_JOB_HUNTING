# UniCareer Community — API & Server Actions Reference

## 1. Authentication & Session (Stage 4 Implemented)

### Better Auth Handler: `/api/auth/[...all]`
Powered by `toNextJsHandler(auth.handler)` via `better-auth/next-js`.

- `POST /api/auth/sign-up/email`
  - Registers a new user.
  - **Body**: `{ email, password, name, membershipType, callbackURL }`
  - **Validation**: Passwords must be at least 8 characters. Valid email format. `membershipType` defaults to `STUDENT`.
  - **Behavior**: Scrypt-hashes password into `accounts` table, creates `users` record, creates `sessions` record, generates email verification token, and calls `sendVerificationEmail`.
  - **Output**: `{ user: User, session: Session }`

- `POST /api/auth/sign-in/email`
  - Authenticates an existing user.
  - **Body**: `{ email, password, rememberMe, callbackURL }`
  - **Behavior**: Validates scrypt hash, verifies account status is not `SUSPENDED`, creates session cookie `better-auth.session_token`.
  - **Output**: `{ user: User, session: Session }`

- `POST /api/auth/sign-out`
  - Terminates the session.
  - **Behavior**: Deletes session record from PostgreSQL `sessions` table and clears the session cookie.
  - **Output**: `{ success: true }`

- `GET /api/auth/get-session`
  - Returns authenticated user and session metadata.
  - **Headers**: Session cookie or Bearer token.
  - **Output**: `{ user: User, session: Session }` or `null`.

- `GET /api/auth/verify-email?token=<token>`
  - Verifies institutional email address.
  - **Behavior**: Validates cryptographic verification token, sets `users.emailVerified = true`, and returns status.
  - **Output**: `{ status: true }`

- `POST /api/auth/send-verification-email`
  - Dispatches a new email verification token.
  - **Body**: `{ email, callbackURL }`

- `POST /api/auth/request-password-reset` (or `forget-password`)
  - Initiates password recovery.
  - **Body**: `{ email, redirectTo }`
  - **Behavior**: Generates cryptographic token valid for 30 minutes, calls `sendPasswordResetEmail`.

- `POST /api/auth/reset-password`
  - Sets a new password using recovery token.
  - **Body**: `{ newPassword, token }`
  - **Behavior**: Re-hashes new password into `accounts` table, revokes old credentials.

---

## 2. Membership Verification & Profile API (Stage 5 Implemented)

### Profile Endpoints

- `GET /api/profile`
  - Retrieves current authenticated user's profile record, full account details, and recent verification requests.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: MemberDataWithProfile }`

- `PUT /api/profile`
  - Updates member profile information (bio, headline, department, company, designation, skills, links, showEmail).
  - **Access**: Authenticated member.
  - **Body**: `UpdateProfileInput`
  - **Output**: `{ success: true, data: Profile }`

- `GET /api/profile/[id]`
  - Retrieves a member's public profile with strict server-side privacy filtering.
  - **Access**: Authenticated members.
  - **Privacy Enforcement**:
    - `studentId` and `phone` are **strictly omitted** unless viewed by the profile owner or platform admin.
    - `email` is masked unless the user enabled `showEmail: true`.
    - Internal verification notes and proof documents are excluded.
  - **Output**: `{ success: true, data: PublicProfileResult }`

### Onboarding & Verification Endpoints

- `POST /api/onboarding`
  - Submits role-specific onboarding credentials, provisions the user profile, and triggers an initial institutional verification request.
  - **Access**: Authenticated member.
  - **Body**: `{ membershipType, studentData?, alumniData?, facultyData?, employerData? }`
  - **Behavior**: Updates user's `membershipType`, creates `Profile`, creates `MembershipRequest` with status `PENDING`, sets `user.verificationStatus = PENDING`.
  - **Output**: `{ success: true, data: { profile, verificationRequest } }`

- `POST /api/verification/request`
  - Submits an institutional verification request or resubmits updated credentials following a rejection.
  - **Access**: Authenticated member.
  - **Body**: `SubmitVerificationRequestInput`
  - **Behavior**: Creates a new `MembershipRequest` record with status `PENDING`, updates `user.verificationStatus = PENDING`. Retains previous records in audit history.
  - **Output**: `{ success: true, data: MembershipRequest }`

- `GET /api/verification/request`
  - Returns verification request history for the current authenticated user.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: MembershipRequest[] }`

### Administration Governance Endpoints

- `GET /api/admin/verifications`
  - Fetches all pending membership verification requests awaiting administrative review.
  - **Access**: Platform `ADMIN` only (`assertAdmin` enforced).
  - **Output**: `{ success: true, data: PendingVerificationRequest[] }`

- `POST /api/admin/verifications`
  - Evaluates an applicant's verification request (APPROVE or REJECT).
  - **Access**: Platform `ADMIN` only.
  - **Body**: `{ requestId: string, decision: 'APPROVE' | 'REJECT', rejectionReason?: string }`
  - **Behavior**:
    - If `APPROVE`: Updates request to `APPROVED`, sets `user.verificationStatus = VERIFIED`, sets `verifiedAt` and `verifiedBy`. For employers, faculty, and staff, automatically activates opportunity posting clearance (`canPostOpportunities = true`).
    - If `REJECT`: Requires a non-empty `rejectionReason`. Updates request to `REJECTED`, stores explanation, sets `user.verificationStatus = REJECTED`, revokes posting clearance.
  - **Output**: `{ success: true, data: { request, user, decision } }`

---

## 3. Companies & Corporate Directory API (Stage 6 Implemented)

### Endpoints: `/api/companies`

- `GET /api/companies?query=<term>&industry=<term>&limit=20`
  - Lists verified corporate partner entities and employers.
  - **Access**: Authenticated members.
  - **Output**: `{ success: true, data: Company[] }`

- `POST /api/companies`
  - Registers a new corporate entity profile.
  - **Access**: Authenticated member. Creator is automatically designated as `OWNER` with `canManageCompany: true` and `canPostOpportunities: true`.
  - **Body**: `{ name, logo?, description?, website?, industry?, location? }`
  - **Output**: `{ success: true, data: Company }`

### Endpoints: `/api/companies/[id]`

- `GET /api/companies/[id]`
  - Retrieves detailed company profile including authorized company members.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: CompanyWithMembers }`

- `PUT /api/companies/[id]`
  - Updates corporate metadata.
  - **Access**: Company managers (`OWNER`, `ADMIN`, or member with `canManageCompany: true`) and platform `ADMIN`.
  - **Body**: `{ name?, logo?, description?, website?, industry?, location? }`
  - **Output**: `{ success: true, data: Company }`

### Endpoints: `/api/companies/[id]/members`

- `POST /api/companies/[id]/members`
  - Associates a verified member with a company.
  - **Access**: Company managers (`OWNER`, `ADMIN`) or platform `ADMIN`.
  - **Body**: `{ userId, role?, canPostOpportunities?, canManageCompany? }`
  - **Output**: `{ success: true, data: CompanyMember }`

---

## 4. University Departments API (Stage 6 Implemented)

### Endpoint: `/api/departments`

- `GET /api/departments?faculty=<term>`
  - Retrieves active university faculties and academic departments for targeting and filtering.
  - **Access**: Authenticated members.
  - **Output**: `{ success: true, data: Department[] }`

---

## 5. Opportunities & Career Postings API (Stage 6 Implemented)

### Endpoints: `/api/opportunities`

- `GET /api/opportunities`
  - Retrieves approved and active opportunities with department, search, and type filtering.
  - **Access**: Authenticated members.
  - **Query Params**: `query`, `type`, `department`, `workplaceType`, `sourceType`, `page`, `limit`.
  - **Filtering**: Returns postings where `status = APPROVED` and `deadline > now()`. When filtered by department, includes both department-matched and `openToAllDepartments = true` postings.
  - **Output**: `{ success: true, data: Opportunity[], pagination: { total, page, limit, totalPages } }`

- `POST /api/opportunities`
  - Creates a new career opportunity (internship or job).
  - **Access**: Authorized members with `canPostOpportunities: true`.
  - **Validation**: Enforces future deadline, required description (min 20 chars), and external URL when application method is `EXTERNAL`.
  - **Provenance**:
    - If `sourceType: OFFICIAL_EMPLOYER`: Requires valid `companyId` and asserts poster is an authorized company member.
    - If `sourceType: COMMUNITY_SHARED`: Accessible to verified members/alumni sharing external leads with explicit disclaimer.
  - **Initial State**: Sets status to `PENDING` (or `DRAFT` if `submitForReview: false`).
  - **Output**: `{ success: true, data: Opportunity }`

### Endpoints: `/api/opportunities/[id]`

- `GET /api/opportunities/[id]`
  - Retrieves opportunity details.
  - **Access Gating**:
    - `APPROVED`: Accessible to all authenticated members.
    - `DRAFT`, `PENDING`, `REJECTED`, `CLOSED`: Strictly restricted to original poster, associated company managers, or platform `ADMIN`.
  - **Output**: `{ success: true, data: Opportunity }`

- `PUT /api/opportunities/[id]`
  - Modifies an existing opportunity.
  - **Access**: Original poster, associated company managers, or platform `ADMIN`.
  - **Output**: `{ success: true, data: Opportunity }`

- `DELETE /api/opportunities/[id]`
  - Deletes an opportunity record.
  - **Access**: Original poster, associated company managers, or platform `ADMIN`.
  - **Output**: `{ success: true, message: string }`

### Endpoints: `/api/opportunities/[id]/submit` & `/close`

- `POST /api/opportunities/[id]/submit`
  - Submits a `DRAFT` opportunity to the administrator moderation queue (`PENDING`).
  - **Access**: Authorized poster or company manager.

- `POST /api/opportunities/[id]/close`
  - Manually closes an opportunity before deadline (`CLOSED`).
  - **Access**: Authorized poster or company manager.

### Endpoints: `/api/opportunities/[id]/bookmark` & `/bookmarks` (Stage 7 Implemented)

- `POST /api/opportunities/[id]/bookmark`
  - Atomically toggles bookmark / saved state for an opportunity for the authenticated member.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, bookmarked: boolean }`

- `GET /api/opportunities/bookmarks?page=1&limit=12`
  - Retrieves all active opportunities saved by the authenticated member.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: Opportunity[], pagination: PaginationMeta }`

### Endpoint: `/api/opportunities/my` (Stage 7 Implemented)

- `GET /api/opportunities/my?status=ALL`
  - Retrieves all opportunities authored by the authenticated member, categorized with status counts (`ALL`, `APPROVED`, `PENDING`, `DRAFT`, `REJECTED`, `CLOSED`, `EXPIRED`).
  - **Access**: Authenticated member (owner).
  - **Output**: `{ success: true, data: Opportunity[], counts: Record<string, number> }`

---

## 6. Admin Opportunity Moderation API (Stage 6 Implemented)

### Endpoints: `/api/admin/opportunities`

- `GET /api/admin/opportunities?status=PENDING`
  - Retrieves pending opportunities queued for institutional moderation.
  - **Access**: Platform `ADMIN` only.
  - **Output**: `{ success: true, data: Opportunity[] }`

- `POST /api/admin/opportunities`
  - Evaluates an opportunity dossier (`APPROVE` or `REJECT`).
  - **Access**: Platform `ADMIN` only.
  - **Body**: `{ opportunityId, action: 'APPROVE' | 'REJECT', rejectionReason? }`
  - **Rules**:
    - If `APPROVE`: Transitions status to `APPROVED`, records `reviewerId` and `reviewedAt`. Immediately becomes visible in member listings.
    - If `REJECT`: Requires a non-empty `rejectionReason`. Sets status to `REJECTED`, records explanation and reviewer metadata.
  - **Output**: `{ success: true, data: Opportunity }`

---

## 7. Resume Vault & Application APIs (Stage 8 Implemented)

### Endpoints: `/api/resumes`

- `GET /api/resumes`
  - Retrieves all active resume documents in the authenticated user's private vault.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: Resume[] }`

- `POST /api/resumes`
  - Uploads a new PDF/DOCX resume file (max 5 MB). Validates magic bytes to prevent content-type spoofing.
  - **Access**: Authenticated member.
  - **Body**: `multipart/form-data` with `file`.
  - **Output**: `{ success: true, data: Resume }`

### Endpoints: `/api/resumes/[id]` & `/download`

- `DELETE /api/resumes/[id]`
  - Deletes a resume from user's vault.
  - **Access**: Resume owner only.

- `GET /api/resumes/[id]/download`
  - Securely streams binary resume buffer with proper content headers.
  - **Access**: Owner, authorized employer whose opportunity received an application with this resume, or platform `ADMIN`. Strictly prevents IDOR access.

### Endpoints: `/api/applications`

- `GET /api/applications?status=ALL`
  - Retrieves all applications submitted or recorded by the authenticated member.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: Application[], counts: Record<string, number> }`

- `POST /api/applications`
  - Submits an internal application or records an external company portal application.
  - **Access**: Authenticated member.
  - **Body (INTERNAL)**: `{ opportunityId, resumeId?, coverLetter?, method: 'INTERNAL' }`
  - **Body (EXTERNAL)**: `{ opportunityId, externalNotes?, method: 'EXTERNAL' }`
  - **Output**: `{ success: true, data: Application }`

### Endpoints: `/api/applications/[id]` & `/withdraw`

- `GET /api/applications/[id]`
  - Retrieves complete application dossier including cover letter, resume, and status change audit log.
  - **Access**: Applicant owner, authorized employer for that opportunity, or platform `ADMIN`.

- `POST /api/applications/[id]/withdraw`
  - Retracts submitted application, transitioning status to `WITHDRAWN`.
  - **Access**: Applicant owner only.
  - **Body**: `{ reason?: string }`

### Endpoints: `/api/opportunities/[id]/eligibility`

- `GET /api/opportunities/[id]/eligibility`
  - Evaluates deadline status, duplicate application checks, and academic criteria advisory warnings prior to submission.
  - **Access**: Authenticated member.

### Endpoints: `/api/opportunities/[id]/applicants` & `.../status`

- `GET /api/opportunities/[id]/applicants?status=ALL`
  - Retrieves all candidates who applied to the opportunity with permitted recruitment data.
  - **Access**: Authorized employer representing the opportunity's company, or platform `ADMIN`. Community-shared job posters are strictly blocked.
  - **Output**: `{ success: true, data: ApplicantDossier[], opportunity: Opportunity, counts: Record<string, number> }`

- `POST /api/opportunities/[id]/applicants/[applicationId]/status`
  - Updates candidate recruitment stage (`UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`) and logs status change history.
  - **Access**: Authorized employer for the opportunity, or platform `ADMIN`.
  - **Body**: `{ status: ApplicationStatus, note?: string, employerNotes?: string }`

---

## 8. Community API & Actions (Upcoming Stage 9)

### `createPost(input: CreatePostSchema)`
- **Access**: Verified Members
- **Input**: `content`, `category`, optional `opportunityId`, `title`.

### `createComment(postId: string, content: string, parentId?: string)`
- **Access**: Verified Members
- **Behavior**: Adds top-level comment or nested reply; notifies post author.

### `toggleReaction(postId: string, type: ReactionType)`
- **Access**: Verified Members
- **Behavior**: Adds or removes user reaction atomically.

---

## 5. Career Tools API (Student Only)

### `checkCgpaEligibility(studentCgpa: number, opportunityId: string)`
- **Access**: Verified `STUDENT`
- **Output**: `{ isEligible: boolean, difference: number, minRequired: number }`

### `analyzeSkillGaps(studentSkills: string[], opportunityId: string)`
- **Access**: Verified `STUDENT`
- **Output**: `{ matchedSkills: string[], missingSkills: string[], matchPercentage: number }`

