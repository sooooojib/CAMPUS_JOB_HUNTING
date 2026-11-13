# UniCareer Community — API & Server Actions Reference

> **Standard Security & Rate Limiting Policy**:  
> Sensitive mutation routes (`POST /api/resumes`, `POST /api/verification/request`, `POST /api/applications`) enforce sliding-window rate limiting. When a limit is reached, endpoints return `429 Too Many Requests` with headers:  
> - `X-RateLimit-Limit`: Maximum permitted operations in the sliding window.  
> - `X-RateLimit-Remaining`: Remaining allowed attempts.  
> - `X-RateLimit-Reset`: Epoch timestamp when quota refreshes.  
> - `Retry-After`: Seconds to wait before retrying.  

---

## 1. Authentication & Session (Stage 4 Implemented)

### Better Auth Handler: `/api/auth/[...all]`
Powered by `toNextJsHandler(auth.handler)` via `better-auth/next-js`.

- `POST /api/auth/sign-up/email`
  - Registers a new user.
  - **Body**: `{ email, password, name, membershipType, callbackURL }`
  - **Validation**: Passwords must be at least 8 characters. Valid email format. `membershipType` is either `STUDENT` or `ALUMNI`.
  - **Behavior**: Scrypt-hashes password into `accounts` table, creates `users` record, creates `sessions` record, generates email verification token, and calls `sendVerificationEmail`.
  - **Output**: `{ user: User, session: Session }`

- `POST /api/auth/register-details`
  - Persists initial Student ID, Department, and Membership Type immediately after signup.
  - **Body**: `{ email, studentId, department, membershipType }`
  - **Behavior**: Stores credentials on the user's profile and enqueues initial `MembershipRequest`.
  - **Output**: `{ success: true }`

- `POST /api/auth/sign-in/email`
  - Authenticates an existing user.
  - **Body**: `{ email, password, rememberMe, callbackURL }`
  - **Verification-First Enforcement**: If `user.emailVerified === false`, authentication is strictly rejected with HTTP 403 `EMAIL_NOT_VERIFIED` and zero session is issued.
  - **Behavior**: Validates scrypt hash, verifies email verification status, verifies account status is not `SUSPENDED`, creates session cookie `better-auth.session_token`.
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
  - Submits role-specific onboarding credentials (`STUDENT` or `ALUMNI`), provisions the user profile, and triggers an initial institutional verification request.
  - **Access**: Authenticated member.
  - **Body**: `{ membershipType: 'STUDENT' | 'ALUMNI', studentData?, alumniData? }`
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
  - **Query Params**: `query`, `type`, `department`, `workplaceType`, `page`, `limit`.
  - **Filtering**: Returns postings where `status = APPROVED` and `deadline > now()`. When filtered by department, includes both department-matched and `openToAllDepartments = true` postings.
  - **Output**: `{ success: true, data: Opportunity[], pagination: { total, page, limit, totalPages } }`

- `POST /api/opportunities`
  - Creates a new career opportunity (internship or job).
  - **Access**: Authorized members with `canPostOpportunities: true`.
  - **Validation**: Enforces future deadline, required description (min 20 chars), and external URL when application method is `EXTERNAL`.
  - **Provenance**: All opportunities are published as `sourceType: COMMUNITY_SHARED` (community / alumni shared leads) with direct links to the official employer portal.
  - **Status**: Sets status to `APPROVED`.
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

## 7. Application Tracking APIs (Stage 8 Implemented)

### Endpoints: `/api/applications`

- `GET /api/applications`
  - Retrieves candidate's tracked application records and status updates.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: Application[] }`

- `POST /api/applications`
  - Submits or tracks an external job application record.
  - **Access**: Authenticated member.
  - **Body**: `{ opportunityId, method: 'EXTERNAL', externalNotes? }`
  - **Output**: `{ success: true, data: Application }`

### Endpoints: `/api/applications/[id]`

- `GET /api/applications/[id]`
  - Retrieves application details.
  - **Access**: Applicant owner or platform `ADMIN`.

- `DELETE /api/applications/[id]`
  - Removes the application record from the member's application dashboard.
  - **Access**: Applicant owner or platform `ADMIN`.

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

- `DELETE /api/applications/[id]`
  - Removes the application record from the member's application dashboard.
  - **Access**: Applicant owner or platform `ADMIN`.

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

## 8. Community Feed, Discussions & Moderation APIs (Stage 9 Implemented)

### Endpoints: `/api/posts`

- `GET /api/posts`
  - Retrieves paginated community discussions with filters, reaction counts, user reaction state, and bookmark indicators.
  - **Access**: Authenticated member.
  - **Query Parameters**:
    - `postType`: Filter by `GENERAL_DISCUSSION`, `CAREER_ADVICE`, `QUESTION`, `REFERRAL_REQUEST`, `JOB_ANNOUNCEMENT`, `INTERNSHIP_ANNOUNCEMENT`, `ACHIEVEMENT`, or `ALL`.
    - `search`: Case-insensitive text search matching title or content.
    - `bookmarkedOnly`: If `true`, returns viewer's saved posts.
    - `page`: Page number (default: 1).
    - `limit`: Items per page (default: 10, max: 30).
  - **Output**: `{ success: true, data: FeedPostResult[], pagination: Pagination }`

- `POST /api/posts`
  - Creates a new community post.
  - **Access**: Authenticated active member.
  - **Body**: `{ title?, content, postType, visibility?, attachedOpportunityId? }`
  - **Rules**: Content min 10 chars, max 5,000 chars. Suspended accounts are blocked.
  - **Output**: `{ success: true, data: FeedPostResult }` (Status 201)

### Endpoints: `/api/posts/[id]`

- `GET /api/posts/[id]`
  - Retrieves a single community post by ID with comments, reactions, and bookmark context.
  - **Access**: Authenticated member.

- `PUT /api/posts/[id]`
  - Updates post title, content, or postType.
  - **Access**: Post author or platform `ADMIN`.

- `DELETE /api/posts/[id]`
  - Permanently deletes post and cascading comments/reactions.
  - **Access**: Post author or platform `ADMIN`.

### Endpoints: `/api/posts/[id]/react`

- `POST /api/posts/[id]/react`
  - Atomically toggles a reaction (`LIKE`).
  - **Access**: Authenticated member.
  - **Body**: `{ type: ReactionType }`
  - **Behavior**: Toggles like on/off; updates post like counter. Prevents duplicate reactions via database constraint.
  - **Output**: `{ success: true, data: { reacted: boolean, currentReaction, reactions, totalLikes } }`

### Endpoints: `/api/posts/[id]/bookmark` & `/bookmarks`

- `POST /api/posts/[id]/bookmark`
  - Toggles saving a post for the authenticated user.
  - **Access**: Authenticated member.
  - **Output**: `{ success: true, data: { bookmarked: boolean } }`

- `GET /api/posts/bookmarks`
  - Retrieves all saved/bookmarked posts for the viewer.
  - **Access**: Authenticated member.

### Endpoints: `/api/posts/[id]/comments` & `/api/comments/[id]`

- `GET /api/posts/[id]/comments`
  - Retrieves top-level comments and nested replies for a post.
  - **Access**: Authenticated member.

- `POST /api/posts/[id]/comments`
  - Adds a top-level comment or reply (`parentId`). Increments `commentsCount`.
  - **Access**: Authenticated member.
  - **Body**: `{ content, parentId? }`
  - **Output**: `{ success: true, data: CommentItem }` (Status 201)

- `PUT /api/comments/[id]`
  - Updates an existing comment.
  - **Access**: Comment author only.

- `DELETE /api/comments/[id]`
  - Deletes a comment (and its nested replies). Decrements `commentsCount`.
  - **Access**: Comment author or platform `ADMIN`.

### Endpoints: Content Moderation & Reporting

- `POST /api/posts/[id]/report`
  - Submits a content report for an inappropriate post.
  - **Access**: Authenticated member.
  - **Body**: `{ reason: ReportReason, description? }`
  - **Behavior**: Prevents duplicate pending reports from same user; flags post when >= 3 reports are lodged.

- `POST /api/comments/[id]/report`
  - Submits a content report for an inappropriate comment.
  - **Access**: Authenticated member.
  - **Body**: `{ reason: ReportReason, description? }`


---

## 6. Member Directory, Connections & Referrals API (Stage 10 Implemented)

### Endpoint: `/api/members`

- `GET /api/members`
  - Searches and paginates the authenticated university member directory.
  - **Access**: Authenticated member.
  - **Query Params**: `q`, `department`, `membershipType`, `company`, `skill`, `interest`, `page`, `pageSize`.
  - **Privacy Enforcement**: Excludes `studentId`, `phone`, and verification documents. Redacts `email` unless `showEmail: true` or viewer is platform ADMIN. Enriches with viewer's `connectionStatus` (`NONE`, `PENDING_SENT`, `PENDING_RECEIVED`, `CONNECTED`, `SELF`).
  - **Output**: `{ success: true, items: MemberDirectoryItem[], pagination: Pagination }`

### Endpoints: `/api/connections`

- `GET /api/connections`
  - Lists connections or pending requests.
  - **Query Params**: `type` (`ACCEPTED`, `PENDING_INCOMING`, `PENDING_OUTGOING`), `page`, `pageSize`.
  - **Access**: Authenticated member.

- `POST /api/connections`
  - Initiates a connection request to another member.
  - **Access**: Authenticated member.
  - **Body**: `{ receiverId: string }`
  - **Validation**: Prohibits self-connection (`senderId !== receiverId`), prevents duplicate pending requests.

- `PUT /api/connections/[id]`
  - Responds to an incoming connection request (`ACCEPT` or `REJECT`).
  - **Access**: Recipient of the connection request only.
  - **Body**: `{ action: "ACCEPT" | "REJECT" }`

- `DELETE /api/connections/[id]`
  - Cancels an outgoing pending request (`?action=cancel`) or dissolves an accepted connection.
  - **Access**: Sender (for cancel) or either connected member (for removal).

- `GET /api/connections/status`
  - Queries active connection state with another member.
  - **Query Params**: `userId: string`
  - **Output**: `{ success: true, state: ConnectionState, connectionId?: string }`

### Endpoints: `/api/referrals`

- `GET /api/referrals`
  - Queries user's incoming and outgoing referral dossiers.
  - **Access**: Authenticated member.
  - **Query Params**: `role` (`SENT`, `RECEIVED`, `ALL`), `status`, `page`, `pageSize`.
  - **Output**: `{ success: true, items: ReferralItem[], disclaimer: string, pagination: Pagination }`

- `POST /api/referrals`
  - Submits a formal referral request to an alumni or enterprise member.
  - **Access**: Authenticated member.
  - **Body**: `{ recipientId, companyName, companyId?, roleTitle, opportunityId?, message, resumeUrl? }`
  - **Validation**: Minimum 20 characters for message, blocks self-referral, verifies active recipient.

- `GET /api/referrals/[id]`
  - Retrieves full private referral dossier.
  - **Access**: Requester, recipient, or platform `ADMIN` only. Strictly throws 403 Forbidden for unauthorized parties.

- `PUT /api/referrals/[id]`
  - Recipient responds (`ACCEPTED`, `DECLINED`, `COMPLETED`) with feedback note, or requester cancels (`?action=cancel`).
  - **Access**: Recipient (for response) or requester (for cancel).
  - **Body**: `{ status: "ACCEPTED" | "DECLINED" | "COMPLETED", responseNote?: string }`

---

## 7. Stage 11 API: Skills, Academic Records & Smart Career Tools

### 7.1 Controlled Skills Endpoints

#### `GET /api/skills`
- **Description**: Returns all platform-controlled skills with optional category filter. Automatically initializes standard university catalog if database is fresh.
- **Access**: Authenticated member.
- **Query Params**: `category?: SkillCategory`
- **Output**: `{ success: true, count: number, skills: SkillItem[] }`

#### `POST /api/skills`
- **Description**: Registers a new skill in the controlled taxonomy.
- **Access**: Authenticated member.
- **Body**: `{ name: string, category?: SkillCategory, description?: string }`
- **Output**: `{ success: true, skill: SkillItem }`

#### `GET /api/skills/my`
- **Description**: Returns all associated skills for the authenticated member with proficiency levels and verification badges.
- **Access**: Authenticated member.
- **Output**: `{ success: true, skills: MemberSkillItem[] }`

#### `POST /api/skills/my`
- **Description**: Associates a skill with the authenticated member's profile and updates the cached `profile.skills` array.
- **Access**: Authenticated member.
- **Body**: `{ skillName: string, category?: SkillCategory, level?: SkillLevel }`
- **Output**: `{ success: true, memberSkill: MemberSkillItem }`

#### `DELETE /api/skills/my`
- **Description**: Unlinks a skill from the member profile and syncs `profile.skills`.
- **Access**: Authenticated member.
- **Query Params**: `skillId: string`
- **Output**: `{ success: true, message: string }`

### 7.2 Academic Records & Cumulative CGPA Endpoints

#### `GET /api/academic/records`
- **Description**: Retrieves confidential semester transcripts and credit-weighted cumulative CGPA.
- **Access**: Enrolled student owner or platform `ADMIN` only (`canAccessStudentTools`). All third-party viewers are blocked with HTTP 403 Forbidden.
- **Query Params**: `userId?: string` (Admin only)
- **Output**:
  ```json
  {
    "success": true,
    "data": {
      "records": [
        { "id": "...", "semester": "Fall 2025", "gpa": 3.85, "credits": 15, "academicYear": "Senior" }
      ],
      "cumulativeCgpa": 3.85,
      "totalCredits": 15,
      "department": "Computer Science",
      "academicYear": "Senior"
    }
  }
  ```

#### `POST /api/academic/records`
- **Description**: Records a semester academic performance entry. Recalculates and caches student cumulative CGPA on `Profile.currentCgpa`.
- **Access**: Enrolled student (`STUDENT` role).
- **Body**: `{ semester: string, gpa: number, credits?: number, academicYear?: string, notes?: string }`
- **Constraints**: Enforces unique semester per student (`@@unique([userId, semester])`).
- **Output**: `{ success: true, record: AcademicRecordItem, cumulativeCgpa: number }`

#### `PUT /api/academic/records/[id]`
- **Description**: Updates an existing semester transcript record and refreshes cumulative CGPA.
- **Access**: Owner of academic record or platform `ADMIN`.
- **Body**: `{ semester?: string, gpa?: number, credits?: number, academicYear?: string, notes?: string }`
- **Output**: `{ success: true, record: AcademicRecordItem, cumulativeCgpa: number }`

#### `DELETE /api/academic/records/[id]`
- **Description**: Deletes a semester record and re-indexes cumulative CGPA automatically.
- **Access**: Owner of academic record or platform `ADMIN`.
- **Output**: `{ success: true, cumulativeCgpa: number | null }`

### 7.3 Smart Matching & Career Analytics Endpoints

#### `GET /api/career/recommendations`
- **Description**: Generates explainable, personalized opportunity recommendations for enrolled students based on exact mathematical skill match scores `(Matched / Total) * 100` and institutional eligibility rules.
- **Access**: Authenticated student account (`STUDENT`).
- **Query Params**: `limit?: number`, `departmentFilterOnly?: boolean`
- **Output**:
  ```json
  {
    "success": true,
    "count": 12,
    "recommendations": [
      {
        "opportunity": { "id": "...", "title": "...", "companyName": "..." },
        "match": {
          "matchPercentage": 85,
          "scoreColor": "green",
          "matchedSkills": ["TypeScript", "React"],
          "missingSkills": ["Docker"],
          "totalRequiredSkills": 3,
          "eligibility": {
            "status": "ELIGIBLE",
            "isEligible": true,
            "canApply": true,
            "cgpaEligible": true,
            "departmentEligible": true,
            "academicYearEligible": true,
            "deadlineValid": true,
            "statusApproved": true,
            "reasons": ["Targeted to your academic department (Computer Science)."],
            "warnings": []
          },
          "recommendationReasons": ["High skill overlap (85%)."]
        }
      }
    ],
    "disclaimer": "Skill match score reflects algorithmic overlap between your verified profile skills and the job's required competencies. A high match score does not guarantee academic eligibility, interview shortlisting, or employment offer."
  }
  ```

#### `GET /api/career/skill-gap`
- **Description**: Analyzes enrolled student's competencies against real campus job market demand, identifying missing competencies, demand rankings, top 5 prioritized learning goals, and verified curated educational resources.
- **Access**: Authenticated student account (`STUDENT`).
- **Output**:
  ```json
  {
    "success": true,
    "data": {
      "studentSkills": ["TypeScript", "Next.js"],
      "missingSkills": [{ "name": "Kubernetes", "demandCount": 4, "category": "DEVOPS" }],
      "topDemandedSkills": [{ "name": "TypeScript", "demandCount": 8, "category": "PROGRAMMING_LANGUAGE" }],
      "recommendedPriorities": [{ "name": "Kubernetes", "demandCount": 4, "reason": "..." }],
      "curatedResources": [{ "title": "Kubernetes Official Docs", "provider": "Kubernetes.io", "url": "..." }]
    }
  }
  ```

#### `GET /api/career/eligibility`
- **Description**: Standalone institutional criteria evaluation checking department targeting, CGPA cutoffs, class standing, and deadlines for a specific opportunity.
- **Access**: Authenticated member.
- **Query Params**: `opportunityId: string`
- **Output**: `{ success: true, eligibility: EligibilityCheckResult }`

---

## 8. Stage 12 API: Notifications, Calendar & Reminders

### 8.1 Notifications Endpoints

#### `GET /api/notifications`
- **Description**: Returns paginated notifications for the authenticated user with unread counts and pagination metadata.
- **Access**: Authenticated member (recipient-restricted).
- **Query Params**:
  - `unreadOnly?: boolean` (filter for unread items only)
  - `page?: number` (default: 1)
  - `pageSize?: number` (default: 20, max: 100)
- **Output**:
  ```json
  {
    "success": true,
    "notifications": [
      {
        "id": "notif_123",
        "recipientId": "user_456",
        "type": "APPLICATION_SHORTLISTED",
        "title": "Application Shortlisted",
        "message": "Your submission for Cloud Systems Intern has been shortlisted.",
        "relatedEntityType": "APPLICATION",
        "relatedEntityId": "app_789",
        "actionUrl": "/applications",
        "isRead": false,
        "readAt": null,
        "createdAt": "2026-11-05T07:30:00.000Z",
        "updatedAt": "2026-11-05T07:30:00.000Z"
      }
    ],
    "unreadCount": 1,
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalCount": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
  ```

#### `POST /api/notifications?action=markAllRead`
- **Description**: Marks all unread notifications for the authenticated user as read in a single batch.
- **Access**: Authenticated member.
- **Output**: `{ "success": true, "count": 4 }`

#### `PUT /api/notifications/[id]`
- **Description**: Marks a specific notification as read, recording the exact `readAt` timestamp.
- **Access**: Recipient owner only. Strictly blocks unauthorized members with 403 Forbidden.
- **Output**: `{ "success": true, "notification": NotificationItem }`

#### `DELETE /api/notifications/[id]`
- **Description**: Deletes / dismisses a notification from the recipient's feed.
- **Access**: Recipient owner only.
- **Output**: `{ "success": true, "id": "notif_123" }`

#### `GET /api/notifications/count`
- **Description**: Lightweight endpoint returning the unread notification count for header badge polling.
- **Access**: Authenticated member.
- **Output**: `{ "success": true, "unreadCount": 3 }`

#### `GET /api/notifications/preferences`
- **Description**: Retrieves granular in-app and email notification preferences for the authenticated member.
- **Access**: Authenticated member.
- **Output**:
  ```json
  {
    "success": true,
    "preferences": {
      "opportunitiesInApp": true,
      "opportunitiesEmail": true,
      "applicationsInApp": true,
      "applicationsEmail": true,
      "communityInApp": true,
      "communityEmail": false,
      "membershipInApp": true,
      "membershipEmail": true,
      "remindersInApp": true,
      "remindersEmail": true
    }
  }
  ```

#### `PUT /api/notifications/preferences`
- **Description**: Updates in-app and email preferences across the 5 platform categories.
- **Access**: Authenticated member.
- **Body**: Partial or complete preference flags.
- **Output**: `{ "success": true, "preferences": NotificationPreferencesItem }`

---

### 8.2 Career Calendar Endpoints

#### `GET /api/calendar`
- **Description**: Returns all aggregated calendar events for a given month: custom reminders, application deadlines, interview milestones, and saved opportunity deadlines.
- **Access**: Authenticated member.
- **Query Params**: `year?: number`, `month?: number` (or `month=YYYY-MM`)
- **Output**:
  ```json
  {
    "success": true,
    "year": 2026,
    "month": 11,
    "data": [
      {
        "id": "app_deadline_123",
        "title": "Deadline: Distributed Systems Intern",
        "description": "Application deadline for your submitted application at Google.",
        "eventType": "APPLICATION_DEADLINE",
        "startDate": "2026-11-20T23:59:59.000Z",
        "endDate": null,
        "isAllDay": true,
        "isSystemGenerated": true,
        "companyName": "Google",
        "actionUrl": "/applications",
        "statusBadge": "Applied: UNDER REVIEW"
      }
    ]
  }
  ```

#### `POST /api/calendar`
- **Description**: Schedules a personal career calendar event or reminder.
- **Access**: Authenticated member.
- **Body**:
  ```json
  {
    "title": "Mock Technical Interview with Alumni",
    "description": "Review system design and data structures.",
    "eventType": "INTERVIEW",
    "startDate": "2026-11-15T14:00:00.000Z",
    "isAllDay": false
  }
  ```
- **Output**: `{ "success": true, "event": CalendarEventItem }`

#### `PUT /api/calendar/[id]`
- **Description**: Updates a custom career reminder (title, description, date, type).
- **Access**: Event creator only.
- **Output**: `{ "success": true, "event": CalendarEventItem }`

#### `DELETE /api/calendar/[id]`
- **Description**: Deletes a custom calendar reminder.
- **Access**: Event creator only.
- **Output**: `{ "success": true, "id": "event_123" }`

---

### 8.3 Cron Scheduled Worker

#### `GET /api/cron/reminders` | `POST /api/cron/reminders`
- **Description**: Scans closing opportunities in the next 72 hours and dispatches non-duplicate reminders to applied and bookmarked members.
- **Access**: Authorized via `Authorization: Bearer <CRON_SECRET>` or platform `ADMIN` session.
- **Output**:
  ```json
  {
    "success": true,
    "summary": {
      "opportunitiesScanned": 5,
      "remindersTriggered": 3,
      "skippedDuplicates": 8,
      "errors": 0
    }
  }
  ```

---

## 9. Administrative Governance & Moderation Endpoints (Stage 13)

### 9.1 Platform Statistics & Analytics

#### `GET /api/admin/stats`
- **Description**: Returns live, real-time platform statistics aggregated directly from PostgreSQL.
- **Access**: Platform `ADMIN` only (`systemRole === "ADMIN"`).
- **Output**:
  ```json
  {
    "success": true,
    "data": {
      "totalMembers": 128,
      "verifiedMembers": 94,
      "pendingVerifications": 12,
      "totalOpportunities": 45,
      "pendingOpportunities": 6,
      "approvedOpportunities": 32,
      "rejectedOpportunities": 4,
      "activeOpportunities": 28,
      "totalApplications": 215,
      "communityPosts": 87,
      "pendingReports": 2,
      "suspendedAccounts": 1,
      "totalCompanies": 19
    }
  }
  ```

#### `GET /api/admin/analytics`
- **Description**: Compiles institutional career analytics for visual charts (member growth, opportunity activity, application activity, department participation, opportunity types, verification breakdown).
- **Access**: Platform `ADMIN` only.
- **Output**: `{ "success": true, "data": AdminAnalyticsData }`

### 9.2 Member Governance & Suspension

#### `GET /api/admin/members`
- **Description**: Retrieves searchable, filterable roster of all platform members including verification claims, current CGPA, CG verification status, and account status.
- **Access**: Platform `ADMIN` only.
- **Query Params**:
  - `q?: string` — Keyword search across name, email, department, student ID.
  - `membershipType?: "ALL" | "STUDENT" | "ALUMNI" | "ADMIN"`
  - `verificationStatus?: "ALL" | "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED" | "CG_VERIFIED" | "CG_PENDING"`
  - `accountStatus?: "ALL" | "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED"`
  - `page?: number`, `pageSize?: number`
- **Output**: `{ "success": true, "data": AdminMemberItem[], "totalCount": number, "pagination": {...} }`

#### `POST /api/admin/members/[id]/verify-cg`
- **Description**: Formally verifies or revokes a student's academic CGPA claim in their university profile. Dispatches audit event and notification to student.
- **Access**: Platform `ADMIN` only.
- **Body**:
  ```json
  {
    "isVerified": true
  }
  ```
- **Output**:
  ```json
  {
    "success": true,
    "message": "Student CGPA verification status updated successfully.",
    "data": {
      "id": "profile_123",
      "userId": "usr_456",
      "currentCgpa": 3.85,
      "isCgpaVerified": true
    }
  }
  ```

#### `POST /api/admin/members/[id]/suspend`
- **Description**: Suspends or restores a member account. Self-suspension is blocked. Records audit log and dispatches notification.
- **Access**: Platform `ADMIN` only.
- **Body**: `{ "action": "SUSPEND" | "RESTORE", "reason": "string (min 5 chars)" }`
- **Output**: `{ "success": true, "data": User }`

### 9.3 Opportunity Moderation

#### `GET /api/admin/opportunities`
- **Description**: Retrieves opportunities across all statuses (PENDING, APPROVED, REJECTED, CLOSED) with keyword search and type filter.
- **Access**: Platform `ADMIN` only.
- **Query Params**: `status?: string`, `type?: string`, `q?: string`, `page?: number`, `pageSize?: number`.
- **Output**: `{ "success": true, "data": AdminOpportunityItem[], "totalCount": number, "pagination": {...} }`

#### `POST /api/admin/opportunities/[id]/moderate`
- **Description**: Moderates an opportunity posting (APPROVE, REJECT with mandatory reason, CLOSE, DELETE).
- **Access**: Platform `ADMIN` only.
- **Body**: `{ "action": "APPROVE" | "REJECT" | "CLOSE" | "DELETE", "reason": "string (min 5 for REJECT)" }`
- **Output**: `{ "success": true, "data": { ... } }`

### 9.4 Content Moderation & Reports

#### `GET /api/admin/reports`
- **Description**: Lists reported community posts and comments with author details and content snippet.
- **Access**: Platform `ADMIN` only.
- **Query Params**: `status?: string`, `targetType?: string`, `page?: number`, `pageSize?: number`.
- **Output**: `{ "success": true, "data": AdminReportItem[], "totalCount": number, "pagination": {...} }`

#### `POST /api/admin/reports/[id]/action`
- **Description**: Resolves or dismisses a report, removes offending content, or suspends the author.
- **Access**: Platform `ADMIN` only.
- **Body**: `{ "action": "RESOLVE" | "DISMISS" | "REMOVE_CONTENT" | "SUSPEND_AUTHOR", "reviewNotes": "string" }`
- **Output**: `{ "success": true, "data": { ... } }`

### 9.5 Company Governance

#### `GET /api/admin/companies`
- **Description**: Lists all registered companies with verified/suspended flags and counts.
- **Access**: Platform `ADMIN` only.
- **Query Params**: `q?: string`, `isVerified?: boolean`, `isSuspended?: boolean`, `page?: number`, `pageSize?: number`.
- **Output**: `{ "success": true, "data": AdminCompanyItem[], "totalCount": number, "pagination": {...} }`

#### `POST /api/admin/companies/[id]/moderate`
- **Description**: Verifies, unverifies, suspends, or restores an employer company profile.
- **Access**: Platform `ADMIN` only.
- **Body**: `{ "action": "VERIFY" | "UNVERIFY" | "SUSPEND" | "RESTORE", "reason": "string" }`
- **Output**: `{ "success": true, "data": Company }`

### 9.6 Administrative Audit Trail

#### `GET /api/admin/audit`
- **Description**: Retrieves immutable historical audit log entries with action, target, administrator, and timestamp filters.
- **Access**: Platform `ADMIN` only.
- **Query Params**: `action?: string`, `targetType?: string`, `adminId?: string`, `page?: number`, `pageSize?: number`.
- **Output**: `{ "success": true, "data": AdminAuditLogItem[], "totalCount": number, "pagination": {...} }`




