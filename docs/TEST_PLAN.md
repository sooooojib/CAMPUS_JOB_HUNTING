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
  - Verified company members with `canPostOpportunities: true` can publish `OFFICIAL_EMPLOYER` opportunities.
  - Non-company members attempting to publish `OFFICIAL_EMPLOYER` opportunities are rejected.
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
- Multi-filter query parsing: keywords, opportunity types, workplace modes, source types, department targeting, minimum CGPA cutoff, and bookmark filtering.
- Public/unauthenticated restriction: verifies anonymous users cannot access `/opportunities`, `/opportunities/[id]`, or `/opportunities/post`.
- Posting permission gate: blocks unauthorized or unverified users; requires managed company for `OFFICIAL_EMPLOYER` postings.
- Draft creation, preview toggling, and review submission into `PENDING` queue.
- Bookmark toggling: verifies atomic bookmark creation and removal; confirms duplicate prevention with composite unique index.
- Author management console: verifies status filtering, closure, and rejected resubmission workflows.

### 2.4 Applications & Applicant Management (Stage 8 - Vitest & Integration)
- **Pre-Application Eligibility**:
  - Verifies department restrictions, CGPA warnings (advisory vs disqualifying), open deadline checks.
  - Verifies that closed, draft, pending, or expired opportunities reject applications.
- **Resume Vault Management**:
  - File upload with magic-bytes inspection (`%PDF-` for PDF, `PK\x03\x04` for DOCX). Rejects spoofed MIME types.
  - File size validation (<= 5MB).
  - Private disk storage (`storage/resumes/` outside public web directory).
  - Anti-IDOR download authorization: permits owner, employer reviewing candidate application, or platform admin. Blocks unauthorized third-party members.
  - Setting default resume and deleting unused resumes.
- **Internal Application Workflow**:
  - Submitting application with existing vault resume or immediate upload.
  - Optional cover letter and metadata tracking.
  - Audit trail logging initial status transition (`SUBMITTED`) in `ApplicationStatusHistory`.
- **Database Duplicate Prevention**:
  - Composite unique constraint `@@unique([opportunityId, applicantId])` blocks second application attempt with `DUPLICATE_APPLICATION`.
- **External Application Tracking**:
  - Redirects to external corporate career URL with disclaimer notice.
  - Records user's manual tracking state (`method: EXTERNAL`) without claiming automated ATS sync.
- **Candidate Self-Service**:
  - Viewing user's active/historic applications with real-time status badges.
  - Application withdrawal (`WITHDRAWN`) with reason tracking in history log.
- **Employer Pipeline Management**:
  - Candidate dossier review: profile, department, skills, resume access.
  - Status updates: `SUBMITTED` -> `UNDER_REVIEW` -> `SHORTLISTED` -> `INTERVIEW` -> `SELECTED` / `REJECTED`.
  - Recruiter notes and audit logging of state changes with reviewer ID and timestamp.
  - **Community Poster Strict Restriction**: Verified community member sharing `COMMUNITY_SHARED` opportunity is blocked with 403 Forbidden from viewing applicants or downloading candidate resumes.

### 2.5 Community Feed, Discussions & Moderation (Stage 9 - Vitest & Integration)
- **Post Creation & Validation**:
  - Validates post creation with required content (min 10, max 5,000 chars) and post types (`GENERAL_DISCUSSION`, `CAREER_ADVICE`, `QUESTION`, `REFERRAL_REQUEST`, `JOB_ANNOUNCEMENT`, `INTERNSHIP_ANNOUNCEMENT`, `ACHIEVEMENT`).
  - Rejects short content (< 10 chars).
  - Blocks suspended and deactivated accounts from creating posts (`accountStatus: SUSPENDED`).
- **Post Lifecycle & Access Control**:
  - Author can update title, content, postType, and tags.
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
  - Adding reactions (`LIKE`, `INSIGHTFUL`, `SUPPORT`, `CELEBRATE`) and incrementing counters.
  - Toggling off reaction when clicked again (duplicate reaction prevention).
  - Switching reaction type atomically (e.g. `LIKE` to `INSIGHTFUL`).
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

### 2.6 Career Tools & CGPA Checking (Vitest)
- Student with GPA 3.4 checks opportunity requiring GPA 3.5: reports `isEligible: false`.
- Skill matching algorithm correctly computes overlap percentage and missing skill list.
- Non-student user attempting to open `/career-tools` is blocked.

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

### 2.9 Smart Matching & Student Career Tools (Stage 11: Vitest)
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




