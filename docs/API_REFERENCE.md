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

## 3. Opportunities API & Actions

### `createOpportunity(input: CreateOpportunitySchema)`
- **Access**: Verified Members
- **Input**: Title, company, location, isRemote, type, classification, description, requirements, minCgpa, applyType, externalUrl, deadline.
- **Behavior**: Creates record with status `PENDING`. Dispatches notification to admin moderation queue.
- **Output**: `{ success: boolean, opportunityId: string }`

### `getOpportunities(filters: OpportunityFilterSchema)`
- **Access**: Verified Members
- **Parameters**: `query`, `type`, `classification`, `location`, `isRemote`, `minCgpa`, `page`, `limit`.
- **Behavior**: Returns paginated list of approved and active opportunities.

### `moderateOpportunity(id: string, action: 'APPROVE' | 'REJECT', reason?: string)`
- **Access**: `ADMIN`, `MODERATOR`
- **Behavior**: Updates status, writes to `AuditLog`, notifies author.

---

## 3. Applications API & Actions

### `submitApplication(opportunityId: string, data: SubmitApplicationSchema)`
- **Access**: Verified Members (Students/Alumni)
- **Validation**: Enforces non-duplicate application per opportunity; checks deadline.
- **Input**: `resumeFile` (uploaded to private bucket) or `savedResumeId`, `coverLetter`.
- **Output**: `{ success: boolean, applicationId: string }`

### `withdrawApplication(applicationId: string)`
- **Access**: Applicant owner
- **Behavior**: Marks application `WITHDRAWN`.

### `updateApplicantStatus(applicationId: string, status: ApplicationStatus)`
- **Access**: Authorized employer of the target opportunity, or Admin.
- **Behavior**: Transitions applicant lifecycle state; records timestamp.

---

## 4. Community API & Actions

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

