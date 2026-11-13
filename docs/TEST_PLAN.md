# UniCareer Community — Test Plan

## 1. Quality Strategy

Quality assurance spans four rigorous layers to guarantee a production-grade experience:
1. **Type Safety & Static Analysis**: TypeScript compiler (`tsc --noEmit`) and ESLint.
2. **Unit & Domain Tests**: Vitest for utility functions, CGPA matching logic, and Zod schema validations.
3. **Integration Tests**: Database service tests with test transaction rollback.
4. **End-to-End Browser Tests**: Playwright for complete browser testing across desktop, tablet, and mobile viewports.

---

## 2. Test Suites

### 2.1 Authentication & Gatekeeping (Vitest & Playwright)
- **Registration**: Enforces password minimum 8 characters, password confirmation match, terms acceptance, valid institutional email.
- **Password Security**: Validates that passwords are encrypted with scrypt salt/hash and never saved plaintext to `accounts` or `users`.
- **Role Isolation**: Verifies that `membershipType` is separate from `systemRole` and cannot be escalated to `ADMIN` on registration.
- **Login Credentials**: Authenticates valid credentials, rejects invalid passwords, rejects non-existent emails.
- **Session Lifecycle**: Database session creation, cookie emission (`better-auth.session_token`), session invalidation on logout.
- **Email Verification**: Generates cryptographic verification token, dispatches through dev email logger, successfully validates token and sets `emailVerified: true`.
- **Password Reset**: Cryptographic token issuance valid for 30 minutes, token redemption updating password hash, invalidating previous credentials.
- **Route Protection & Proxy**: Unauthenticated user attempting to view `/dashboard`, `/opportunities`, `/applications`, `/community`, `/referrals`, `/admin` is redirected with 307 to `/login?callbackUrl=...`. Authenticated user on `/login` or `/register` is redirected to `/dashboard`.
- **Account Status Guard**: Suspended or deactivated accounts are rejected by server layout.

### 2.2 Companies, Opportunities, and Approval System (Vitest)
- **Company Management**:
  - Registered members can create a company and become `OWNER` with full management clearance.
  - Authorized company members can update company metadata.
  - Ordinary/unauthorized members are blocked with `403 FORBIDDEN_COMPANY_MODIFICATION`.
  - Adding company members with custom roles (`MEMBER`, `ADMIN`) and capability flags.
- **Opportunity Creation & Posting Clearance**:
  - Unverified users (`PENDING`, `REJECTED`, `SUSPENDED`) are blocked from publishing opportunities.
  - Verified members can post `COMMUNITY_SHARED` opportunities with required external application URLs.
  - All opportunities are standardized as `COMMUNITY_SHARED` leads with transparent peer attribution.
  - Validation: Future deadline check, required description length (min 20 characters), external URL requirement when `applicationMethod = EXTERNAL`.
- **Admin Moderation & Review Workflow**:
  - Submitted opportunities enter `PENDING` status and are queued for administrator review.
  - Platform administrators can approve an opportunity (`APPROVED`), making it visible immediately in catalog.
  - Platform administrators can reject an opportunity with a mandatory rejection reason (`REJECTED`).
  - Reviewer ID and review timestamp are permanently recorded in the database.
- **Access Control & Anti-IDOR**:
  - `DRAFT`, `PENDING`, and `REJECTED` opportunities are completely hidden from regular members.
  - Only the author, authorized company managers, or platform `ADMIN` can retrieve non-approved opportunities.
  - Only the author, company managers, or admin can update, submit, or close opportunities.
- **Department Targeting & Filtering**:
  - Filtering opportunities targeting a specific department (e.g. `Computer Science & Engineering`) matches both explicitly targeted and open-to-all opportunities.
- **Opportunity Lifecycle & Expiration**:
  - `expireOverdueOpportunities()` transitions past-deadline opportunities to `EXPIRED` status.

### 2.3 Opportunity Discovery, Multi-Filter Search & Posting (Stage 7 - Vitest & Integration)
- Multi-filter query parsing: keywords, opportunity types, workplace modes, department targeting, minimum CGPA cutoff, and bookmark filtering.
- Public/unauthenticated restriction: verifies anonymous users cannot access `/opportunities`, `/opportunities/[id]`, or `/opportunities/post`.
- Posting permission gate: blocks unauthorized or unverified users; ensures verified members post `COMMUNITY_SHARED` leads with external application URLs.
- Draft creation, preview toggling, and review submission into moderation queue.
- Bookmark toggling: verifies atomic bookmark creation and removal; confirms duplicate prevention with composite unique index.
- Author management console: verifies status filtering, closure, and resubmission workflows.

### 2.4 Applications & Applicant Management (Stage 8 - Vitest & Integration)
- **Pre-Application Eligibility**:
  - Verifies department restrictions, CGPA warnings (advisory vs disqualifying), open deadline checks.
  - Verifies that closed, rejected, or expired opportunities reject applications.
- **External Application Link Tracking**:
  - Direct redirection to official external corporate career URL ("Apply on Official Website") with clear peer-lead disclaimer notice.
  - Records user's tracking state (`method: EXTERNAL`) cleanly in student dashboard.
- **Database Duplicate Prevention**:
  - Composite unique constraint `@@unique([opportunityId, applicantId])` blocks second application attempt with `DUPLICATE_APPLICATION`.
- **Candidate Self-Service & Privacy**:
  - Viewing user's active/historic tracked applications with real-time status badges.
  - Application deletion/removal (`DELETE /api/applications?id=...`).
  - Community posters who share leads are strictly blocked from viewing or managing other members' applications.

### 2.5 Community Feed, Discussions & Moderation (Stage 9 - Vitest & Integration)
- **Post Creation & Validation**:
  - Validates post creation with required content (min 10, max 5,000 chars) and post types (`GENERAL_DISCUSSION`, `CAREER_ADVICE`, `QUESTION`, `REFERRAL_REQUEST`, `JOB_ANNOUNCEMENT`, `INTERNSHIP_ANNOUNCEMENT`, `ACHIEVEMENT`).
  - Rejects short content (< 10 chars).
  - Blocks suspended and deactivated accounts from creating posts (`accountStatus: SUSPENDED`).
- **Post Lifecycle & Access Control**:
  - Author can update title, content, and postType.
  - Unauthorized members are blocked from editing or deleting other users' posts (403 Forbidden).
  - Platform administrators can edit or delete any post for moderation.
  - Cascading deletion of comments, reactions, bookmarks, and reports when post is deleted.
- **Threaded Comments & Replies**:
  - Adding top-level comments and incrementing `commentsCount`.
  - Adding nested replies linked via `parentId`.
  - Author editing of comments.
  - Author deletion of comments and decrementing `commentsCount`.
  - Unauthorized members blocked from editing other users' comments.
- **Reactions Engine & Duplicate Prevention**:
  - Adding reactions (`LIKE`) and incrementing counters.
  - Toggling off reaction when clicked again (duplicate reaction prevention).
  - Updating reaction state atomically.
- **Post Bookmarks & Saved Feed**:
  - Saving/bookmarking posts with composite unique constraint `@@unique([postId, userId])`.
  - Un-bookmarking and querying saved posts feed.
- **Content Reporting & Moderation**:
  - Submitting report for posts and comments with reasons (`SPAM`, `HARASSMENT`, `INAPPROPRIATE`, `MISINFORMATION`, `OTHER`).
  - Preventing duplicate pending reports from the same user for the same content target (409 Conflict).
  - Automatic status escalation to `FLAGGED` when >= 3 reports are lodged.
- **Feed Filtering & Pagination Performance**:
  - Filtering by PostType channels.
  - Real-time debounced keyword and hashtag search.
  - Paginated loading with page, pageSize, totalPages, and boundary flags.

### 2.6 CGPA & Eligibility Checking (Vitest)
- Student with GPA 3.4 checks opportunity requiring GPA 3.5: reports `isEligible: false`.
- Skill matching algorithm correctly computes overlap percentage and missing skill list.

### 2.7 Responsive & Theme Audits (Playwright + Axe-Core)
- Theme switching light/dark preserves WCAG AA contrast.
- Layout verification on iPhone 14 (390px), iPad (768px), and Desktop (1440px).

### 2.8 Member Directory, Connections & Referrals (Stage 10: Vitest)
- **Member Directory Search & Filtering**:
  - Filter by department, membershipType, company, skill, interest, and keyword `q`.
  - Pagination boundary tests (`page`, `pageSize`, `totalPages`, `hasNextPage`, `hasPreviousPage`).
- **Strict Privacy Redaction**:
  - Student IDs (`studentId`) and personal phone numbers (`phone`) are never returned in directory searches.
  - Emails are redacted unless `showEmail: true` or viewer is platform `ADMIN`.
- **Connection Request Lifecycle**:
  - Sending connection request transitions state to `PENDING`.
  - Self-connection prohibition (`senderId === receiverId` throws).
  - Duplicate connection prevention.
  - Responding to connection request (`ACCEPT` / `REJECT`).
  - Unauthorized responder blocking (only recipient can accept/reject).
  - Outgoing request cancellation (only sender can cancel).
  - Connection dissolution (either party can remove).
- **Referral Request Lifecycle & Privacy**:
  - Creating referral request with recipient, company, role, message, and optional resume.
  - Self-referral prohibition (`requesterId === recipientId` throws).
  - Non-guarantee disclaimer presence assertion in responses and dashboards.
  - Recipient responses (`ACCEPTED`, `COMPLETED`, `DECLINED`) with notes.
  - Server-side access authorization (`assertCanAccessReferral`): requester allowed, recipient allowed, admin allowed, unauthorized third-party rejected with 403 Forbidden.

### 2.9 Skills & Algorithmic Matching (Stage 11: Vitest)
- **Shared Skill System**:
  - Controlled skill creation with category and description.
  - Idempotent retrieval of existing skills without duplication.
  - Association of skills with member profile and proficiency levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
  - Automatic synchronization of `Profile.skills` string array on skill association and removal.
- **Explainable Skill Match Score**:
  - Mathematical formula verification: $\frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$.
  - Edge case of 0 required skills yielding 100% score with empty lists.
  - Case-insensitive trimming and normalization.
  - Color-coding thresholds: Green ($\ge 80\%$), Yellow ($50\% - 79\%$), Red ($< 50\%$).
- **Institutional Opportunity Eligibility Checker**:
  - Academic year standing parsing ("Freshman"=1, "Sophomore"=2, "Junior"=3, "Senior"=4, "Graduate"=5).
  - Meets all requirements $\to$ `ELIGIBLE`.
  - Student CGPA below required cutoff $\to$ `NOT_ELIGIBLE` with descriptive warning.
  - Student department outside targeted departments $\to$ `NOT_ELIGIBLE`.
  - Past application deadline $\to$ `NOT_ELIGIBLE`.
  - Incomplete profile data (missing CGPA or department) $\to$ `NEEDS_REVIEW`.
- **Skill Gap & Market Demand Analyzer**:
  - Aggregation of required competencies across all active approved campus opportunities.
  - Detection of student's verified competencies vs missing skills.
  - Ranking missing skills by real market frequency.
  - Production of top 5 prioritized learning recommendations and curated learning resources.
- **Academic Performance & CGPA Calculation**:
  - Credit-weighted cumulative CGPA calculation: $\frac{\sum (\text{GPA}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$.
  - Empty transcript handling returning null.
  - Database constraint preventing duplicate semesters for the same student (`@@unique([userId, semester])`).
  - Automatic synchronization of `Profile.currentCgpa` cached field on semester create, update, and delete.
- **Academic Privacy & Access Control**:
  - Students can view their own academic transcripts.
  - Platform administrators can view student academic transcripts.
  - Third-party members (other students, alumni, employers) are blocked with `ACCESS_DENIED` (403 Forbidden).
  - Role restriction: non-student accounts (`ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`) blocked from student tools via `canAccessStudentTools`.
- **Personalized Recommendations Ranking**:
  - Sorting opportunities by match percentage descending, then eligibility status, then deadline.
  - Inclusion of transparent recommendation reasons and mandatory non-guarantee disclaimer.

### 2.10 Notifications and Calendar System (Stage 12: Vitest)
- **Notification Database & Core Operations**:
  - Creating in-app notifications with type, title, message, related entity, and deep link.
  - In-app notification deduplication: updating unread duplicate notification records rather than creating redundant cards.
  - Paginated notification retrieval with total and unread counts.
  - Marking single notifications as read and recording exact `readAt` timestamps.
  - Marking all unread notifications as read via batch operation.
  - Strict recipient access control: verifying that member A cannot read, mark, or delete member B's notifications.
- **Notification Preferences & Granular Controls**:
  - Initializing default institutional preferences.
  - Updating preferences across the 5 functional categories (opportunities, applications, community, membership, reminders).
  - In-app and email suppression: verifying that notifications are not dispatched when the respective preference is disabled.
- **Career Calendar Management**:
  - Creating, updating, and deleting custom career events and notes.
  - User boundary protection: verifying that member A cannot edit or delete member B's calendar reminders.
  - Aggregated career calendar view (`getUserCareerCalendar`): combining custom events, application deadlines for applied jobs, interview stages, and saved opportunity deadlines.
  - Deduplication: ensuring that an opportunity that is both applied and saved is not displayed twice.
  - Month filtering: ensuring only events falling within the month grid window are included.
- **Deadline Reminders & Cron Scanning Idempotency**:
  - Scanning opportunities closing in the next 72 hours.
  - Dispatching reminder notifications to interested applicants and bookmarkers.
  - Recording dispatches in `DeadlineReminderLog` with composite unique constraint.
  - Idempotency verification: confirming that secondary cron runs skip previously dispatched reminders without producing duplicate alerts.
- **Email Notification Templates & Provider Resilience**:
  - Safe error handling without credential leakage when email provider is unreachable.
  - Verification that dev environment captures outbound notification emails in `devEmailStore`.

### 2.11 Administrative Governance, Moderation & Audit System (Stage 13: Vitest)
- **Admin Access Control & Role Decoupling**:
  - Platform administrator identification (`isPlatformAdmin`).
  - Assertion gatekeeper (`assertAdmin`) throwing `FORBIDDEN_ADMIN_ACCESS` for non-admin accounts.
  - Decoupling verification: verifying platform `ADMIN` status can be held across different membership types (`STUDENT`, `EMPLOYER`, etc.).
- **Live Platform Dashboard Statistics**:
  - Accurate calculation of real database aggregates (total members, verified members, pending verifications, total/active opportunities, applications, community posts, pending reports, suspended accounts, companies).
  - Mathematical integrity: verified members $\le$ total members; active opportunities $\le$ total opportunities.
- **Member Management & Suspension Safeguards**:
  - Search and multi-criteria filtering across membership types, verification statuses, and account statuses.
  - Account suspension toggling (`adminToggleUserSuspension`) setting `accountStatus = "SUSPENDED"`.
  - Self-suspension safeguard: administrator attempting to suspend their own account is blocked with forbidden error.
  - Account restoration setting `accountStatus = "ACTIVE"`.
  - Notification dispatch upon suspension/restoration.
- **Opportunity Moderation Workflows**:
  - Opportunity review queue retrieval with status filtering.
  - Opportunity approval: status set to `APPROVED`, reviewer attribution recorded, audit log entry written.
  - Mandatory rejection feedback: rejecting without a reason or with $< 5$ characters is rejected by validation; valid rejection sets status to `REJECTED` and dispatches notification with feedback.
  - Opportunity closure and permanent deletion with audit tracking.
- **Company Profile Moderation**:
  - Institutional company verification (`isVerified: true`) and suspension (`isSuspended: true`).
  - Restoration of company posting privileges.
- **Content Moderation & Report Processing**:
  - Content report queue retrieval with flagged snippet preview and author details.
  - Resolution with content removal: updating post/comment status to `REMOVED`.
  - Resolution with author suspension: triggering account suspension on the author.
  - Dismissal leaving content intact.
- **Immutable Audit Trail Operations**:
  - Structured audit log persistence via `logAdminAction`.
  - Query filtering by administrator, action type, and target entity with pagination.
- **Institutional Analytics Compilation**:
  - Verification of non-fabricated time-series aggregates (`memberGrowth`, `opportunityActivity`, `applicationActivity`, `departmentParticipation`, `opportunityTypes`, `verificationBreakdown`).

### 2.12 End-to-End Multi-Persona Workflows & Security Hardening (Stage 14: Vitest)
- **Workflow A: Student Complete Journey**:
  - Registration and email verification link processing.
  - Institutional membership claim submission and registrar approval.
  - Complete profile creation with skills and current CGPA.
  - Multi-faceted opportunity discovery with hybrid filtering.
  - Explainable algorithmic match scoring (`calculateSkillMatch`) and eligibility verification (`evaluateEligibility`).
  - Opportunity bookmarking with duplicate prevention.
  - Magic-bytes validated PDF resume upload and internal application submission.
  - Database-enforced duplicate application rejection.
  - Real-time application status tracking and notification dispatch.
  - Community feed engagement (posting, commenting, like reaction toggle).
- **Workflow B: Alumni Complete Journey**:
  - Alumni claim submission with graduation year and employer details.
  - Community opportunity lead sharing with external ATS link.
  - Student connection request reception and acceptance.
  - Career referral request review and acceptance with personalized response note.
- **Workflow C: Employer & Recruiter Complete Journey**:
  - Recruiter registration and institutional verification granting posting clearance.
  - Corporate company profile creation.
  - Official employer opportunity publication with compensation and deadline.
  - Admin approval, candidate application ingestion, Anti-IDOR security checks (unauthorized users strictly blocked from candidate records), and candidate pipeline status advancement to `SHORTLISTED`.
- **Workflow D: Administrator Complete Command & Moderation**:
  - Admin session clearance assertion.
  - Pending verification review queue (approving and rejecting with feedback).
  - Opportunity moderation (approving, closing, and deleting).
  - Community content reports review & spam content removal.
  - User account suspension & restoration with immutable audit logging.
  - Live platform KPIs & analytics verification.
- **Security & Rate Limiting Verification**:
  - Verification of sliding-window rate limiter on sensitive mutation endpoints (`/api/resumes`, `/api/verification/request`, `/api/applications`).
  - Validation of HTTP 429 response codes with rate limit headers (`Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).





