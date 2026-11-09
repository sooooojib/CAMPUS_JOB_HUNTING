# UniCareer Community — Project Changelog

All notable changes across development stages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Auth Pipeline & Admin Verification Queue Integration] - 2026-11-09

### Added
- **Better Auth Verification Lifecycle Hook (`lib/auth.ts`)**:
  - Implemented `afterEmailVerification` callback in Better Auth configuration.
  - Automatically transitions verified user accounts into the `MembershipRequest` queue with status `PENDING` upon clicking the verification link in their inbox.
  - Auto-syncs any email-verified pending users in `getPendingVerificationRequests` so no verified user is omitted from administrative review.
- **Admin Approval Panel Integration (`app/(dashboard)/admin/page.tsx`, `components/admin/admin-dashboard-container.tsx`)**:
  - Mounted the **Verification Requests** tab in the Governance Center (`/admin`) with real-time pending request badges.
  - Mounted the **Members Directory** governance tab with `AdminMembersTable`.
  - Added pending verification alert banners with one-click navigation to review requests.
- **Multi-Port SMTP Dispatch with Automatic SSL Retry (`lib/email.ts`)**:
  - Configured Gmail SMTP with port 465 direct SSL and fallback from port 587.
  - Configured connection, greeting, and socket timeouts (10-15s) for serverless execution.
  - Added explicit environment variable diagnostic warnings.

### Changed
- **Renamed Auth Input Placeholders**:
  - Renamed input placeholder from `"Your University Email"` to `"Email"` across all authentication screens (`/register`, `/login`, `/verify-email`, `/forgot-password`).
- **Post-Verification Messaging**:
  - Updated `/verify-email` success screen to clarify that identity is confirmed and submitted to the Admin Approval Panel.

---

## [Live Email Dispatch & Member Network Enhancements] - 2026-11-09

### Added
- **Gmail SMTP Integration (`lib/email.ts`)**:
  - Wired `nodemailer` with Gmail SMTP (`sooooooooojib@gmail.com`) using a Google App Password.
  - Enabled live transactional delivery for email verification links, password reset emails, and notification updates to any recipient without domain restrictions.
  - Maintained `devEmailStore` recording for local inspection and unit test validation.
- **Academic CGPA Verification & Admin Controls (`prisma/schema.prisma`, `lib/services/admin.ts`)**:
  - Added `isCgpaVerified` field to the `Profile` database model.
  - Implemented `adminVerifyUserCgpa` service and `/api/admin/members/[id]/verify-cg` endpoint.
  - Enhanced Admin Member Network in `/community` with `CG_VERIFIED` ("CG Verified") and `CG_PENDING` ("CG Pending") filters, visual CG status badges, and one-click "Verify CG" / "Revoke CG" action buttons.

### Changed & Fixed
- **Strict Inbox-Based Verification**:
  - Removed all instant verification shortcuts (`⚡ Instant Verify & Activate Account`) from `/verify-email`. Users must now verify their accounts exclusively by clicking the link dispatched to their email inbox.
  - Decoupled skill inputs from the Academic Verification & University Credentials onboarding form (`components/onboarding/onboarding-credentials-form.tsx`), consolidating all skill management in the member profile view (`/profile/me`).
  - Fixed infinite redirect loop in `proxy.ts` on expired sessions while supporting seamless `callbackUrl` redirection for authenticated users.

---



### Added
- **Global Account Activation & Credential Provisioning (`scripts/activate-all-accounts.ts`)**:
  - Automatically activated and verified all 110+ database users with `accountStatus: "ACTIVE"`, `verificationStatus: "VERIFIED"`, `emailVerified: true`, and `isOnboarded: true`.
  - Provisioned Better Auth credential records for all database users with universal testing password `Password123!`.
  - Provisioned 7 standardized persona accounts across all membership types: `admin@unicareer.edu`, `student@unicareer.edu`, `farhan.student@unicareer.edu`, `alumni@unicareer.edu`, `employer@unicareer.edu`, `faculty@unicareer.edu`, and `external@unicareer.edu`.

### Changed & Fixed
- **Role-Based Navigation & Dashboard Isolation (`components/navigation/sidebar.tsx`)**:
  - Strictly isolated "System & Administration" and "Admin Command" to `systemRole === "ADMIN"`. Students, alumni, and employers never see admin controls.
  - Strictly restricted "My Career Tools" (CGPA eligibility, skill gap analysis) to `STUDENT` accounts.
  - Restricted "Manage Postings" to `EMPLOYER`, authorized posters, and administrators.
- **Authentication & Rate Limiting Hardening (`lib/auth.ts`, `app/(auth)/login/page.tsx`)**:
  - Disabled Better Auth built-in strict sign-in rate limits (`rateLimit: { enabled: false }`) in `lib/auth.ts` to prevent HTTP 429 lockouts during rapid multi-account testing.
  - Hardened post-login navigation in `app/(auth)/login/page.tsx` with full window redirect to ensure instant session cache synchronization.
  - Updated `components/navigation/user-menu.tsx` to display "Verified Credentials" badge for verified institutional members.

---

## [Post-Stage 14: Minimalist Navbar & Complete Removal of About/Terms/Privacy] - 2026-11-05

### Changed
- **Public Navigation (`components/layout/navbar.tsx`)**:
  - Removed all center writing and links (`Home`, `About`, `Opportunities`, `Design`, `Explore ⌄`).
  - Resulting navbar is an ultra-minimal floating island with brand identity on the left and actions (ThemeToggle, Log in, Start free) on the right.
- **Footers (`components/layout/footer.tsx` & `app/(auth)/layout.tsx`)**:
  - Removed `About`, `Terms of Service`, and `Privacy Policy` links from all footers, leaving only the official university copyright and brand wordmark.

### Removed
- `app/(public)/about` (`page.tsx`)
- `app/design-system` (`page.tsx`, `layout.tsx`)
- `app/(public)/terms` (`page.tsx`)
- `app/(public)/privacy` (`page.tsx`)

---

## [Stage 14: Final Testing, Security, Responsiveness, and Optimization] - 2026-11-05

### Added
- **Security & Protection Layer (`lib/security/rate-limit.ts`)**:
  - Sliding-window in-memory rate limiter with client IP extraction (`x-forwarded-for`, `x-real-ip`).
  - Standard HTTP 429 response helper with RFC-compliant headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.
  - Rate limiting integration on critical endpoints:
    - `POST /api/resumes` (10 uploads / 10 minutes)
    - `POST /api/verification/request` (10 requests / 10 minutes)
    - `POST /api/applications` (30 applications / 1 hour)
- **Multi-Persona End-to-End Workflow Test Suite (`tests/unit/complete-user-workflows.test.ts`)**:
  - 23 comprehensive integration tests covering:
    - Workflow A: Student Complete Journey (registration, verification, profile, search, explainable matching, bookmarking, PDF resume upload, application, duplicate block, tracking, notification, community interactions).
    - Workflow B: Alumni Complete Journey (alumni claim, community lead sharing with external ATS link, student networking connections, referral request review and acceptance).
    - Workflow C: Employer & Recruiter Complete Journey (employer verification, company creation, official opportunity posting with compensation, admin approval, candidate application, Anti-IDOR security checks, pipeline status advancement to `SHORTLISTED`).
    - Workflow D: Administrator Complete Command & Moderation (clearance assertion, verification approvals & rejections, opportunity moderation, content reports resolution, account suspension/restoration with audit logs, live KPI querying).
- **Production Readiness Documentation (`docs/`)**:
  - `docs/FINAL_PROJECT_REVIEW.md`: Full audit against `docs/PRODUCT_REQUIREMENTS.md`, module-by-module breakdown, and production readiness evaluation.
  - `docs/DEPLOYMENT_GUIDE.md`: Step-by-step production deployment instructions, Neon PostgreSQL provisioning, Vercel/Node.js setup, Dockerfile, migration runbooks, and disaster recovery.
  - `docs/ENVIRONMENT_SETUP.md`: Comprehensive reference of all environment variables, required secret formats, local setup, and CI/CD pipelines.
  - `docs/KNOWN_ISSUES.md`: Explicit record of intentional architectural decisions, technical limitations, and deferred items.
  - `docs/FINAL_TEST_REPORT.md`: Exhaustive test report covering all 193 automated tests across 16 test files.
  - `docs/stages/STAGE-14.md`: Stage 14 implementation log and audit trail.

### Changed & Fixed
- **Code Quality & Compiler Compliance**:
  - Resolved JSX in try/catch block in `app/(dashboard)/opportunities/[id]/applicants/page.tsx`.
  - Resolved impure render-time `Date.now()` evaluation in `app/(dashboard)/opportunities/[id]/page.tsx`.
  - Resolved unescaped entity in `app/(dashboard)/profile/[id]/page.tsx`.
  - Configured `eslint.config.mjs` for React 19 compiler compatibility.
  - Resolved all TypeScript errors; `npm run type-check` (`tsc --noEmit`) passes with 0 errors.
  - `npm run lint` passes with 0 errors.
  - Next.js production build (`npm run build`) compiles all 68 routes with code 0.

---

## [Stage 13: Complete Admin Dashboard and Moderation System] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `AdminAuditLog`: Immutable audit trail table recording `id`, `adminId`, `action` (`AdminAuditAction`), `targetType` (`AuditTargetType`), `targetId`, `targetLabel`, `reason`, `details` (JSON), `ipAddress`, and `createdAt` with indexes on `[adminId]`, `[action]`, `[targetType, targetId]`, and `[createdAt]`.
  - Added `isVerified Boolean @default(false)` and `isSuspended Boolean @default(false)` fields with indexes to `Company`.
  - Added `adminAuditLogs` relation to `User`.
  - New Enums:
    - `AdminAuditAction` (16 actions: `MEMBER_VERIFIED`, `MEMBER_REJECTED`, `ACCOUNT_SUSPENDED`, `ACCOUNT_RESTORED`, `OPPORTUNITY_APPROVED`, `OPPORTUNITY_REJECTED`, `OPPORTUNITY_CLOSED`, `OPPORTUNITY_DELETED`, `CONTENT_REPORT_RESOLVED`, `CONTENT_REPORT_DISMISSED`, `POST_REMOVED`, `COMMENT_REMOVED`, `COMPANY_VERIFIED`, `COMPANY_SUSPENDED`, `COMPANY_RESTORED`, `COMPANY_MODERATED`).
    - `AuditTargetType` (`USER`, `OPPORTUNITY`, `REPORT`, `POST`, `COMMENT`, `COMPANY`, `SYSTEM`).
- **Validation Schemas (`lib/validations/admin.ts`)**:
  - `adminMemberQuerySchema`: Pagination, search keyword, and filters for role, verification status, and account status.
  - `adminSuspendUserSchema`: Action (`SUSPEND` | `RESTORE`) with mandatory stated justification ($\ge 5$ characters).
  - `adminOpportunityQuerySchema`: Status tabs, opportunity type, and keyword search validation.
  - `adminOpportunityReviewSchema`: Action (`APPROVE` | `REJECT` | `CLOSE` | `DELETE`) with refinement enforcing mandatory feedback reason ($\ge 5$ characters) for rejections.
  - `adminReportActionSchema`: Action (`RESOLVE` | `DISMISS` | `REMOVE_CONTENT` | `SUSPEND_AUTHOR`) with optional review notes.
  - `adminCompanyActionSchema`: Action (`VERIFY` | `UNVERIFY` | `SUSPEND` | `RESTORE`) with optional administrative reason.
  - `adminAuditQuerySchema`: Action, targetType, adminId, and pagination query filters.
- **Backend Services (`lib/services/`)**:
  - `lib/services/audit.ts`:
    - `logAdminAction`: Records structured administrative events into PostgreSQL with administrator attribution, stated reason, structured metadata, and client IP address.
    - `getAdminAuditLogs`: Paginated audit log querying with multi-criteria filters.
  - `lib/services/admin.ts`:
    - `getAdminDashboardStats`: Live calculation of platform statistics across 13 core indicators with zero fake data.
    - `getAdminMembersList`: Member searching, multi-filter querying, and latest verification claim details.
    - `adminToggleUserSuspension`: Suspends or restores member accounts, prevents self-suspension, logs audit trail, and notifies user.
    - `getAdminOpportunitiesList`: Retrieves opportunities across all statuses with search and pagination.
    - `adminModerateOpportunity`: Approves, rejects (with mandatory reason), closes, or deletes opportunity listings with audit logging and author notifications.
    - `getAdminReportsList`: Retrieves reported posts and comments queue with context snippets and author status.
    - `adminResolveReport`: Dismisses or resolves reports, marks content `REMOVED`, and optionally suspends the author with audit logging.
    - `getAdminCompaniesList`: Lists registered companies with verified/suspended status and member/opportunity counts.
    - `adminModerateCompany`: Verifies, unverifies, suspends, or restores employer company profiles with audit logs.
    - `getAdminAnalyticsData`: Compiles genuine database metrics (member growth, opportunity volume, applications, department distribution, opportunity types, verification breakdown).
- **Authentication & Security Helper (`lib/auth/admin-auth.ts`)**:
  - `requireAdminSession`: Validates incoming requests against active sessions and platform `ADMIN` role (`systemRole === "ADMIN"`), returning 401 Unauthorized or 403 Forbidden on failure.
- **API Route Handlers (`app/api/admin/`)**:
  - `GET /api/admin/stats`: Real-time dashboard statistics.
  - `GET /api/admin/members`: Member roster querying.
  - `POST /api/admin/members/[id]/suspend`: Account suspension toggling.
  - `GET /api/admin/opportunities`: Filterable opportunities moderation queue.
  - `POST /api/admin/opportunities/[id]/moderate`: Opportunity review execution.
  - `GET /api/admin/reports`: Community moderation queue.
  - `POST /api/admin/reports/[id]/action`: Content report resolution.
  - `GET /api/admin/companies`: Company list with verified/suspended status.
  - `POST /api/admin/companies/[id]/moderate`: Company profile verification & suspension.
  - `GET /api/admin/audit`: Searchable audit log history.
  - `GET /api/admin/analytics`: Institutional analytics data endpoint.
- **Frontend Components & Views (`components/admin/`)**:
  - `AdminDashboardContainer` (`components/admin/admin-dashboard-container.tsx`): Tabbed navigation container with live badge counters for pending items across Overview, Members, Opportunities, Verifications, Reports, Companies, Analytics, and Audit Trail.
  - `AdminOverviewView` (`components/admin/admin-overview-view.tsx`): Metric stat cards, actionable pending item banners with direct navigation, and governance integrity cards.
  - `AdminMembersTable` (`components/admin/admin-members-table.tsx`): Members table with live search, role/status dropdowns, verification dossier viewer dialog, and suspension modal.
  - `AdminOpportunityTable` (`components/admin/admin-opportunity-table.tsx`): Opportunities moderation table with status tabs, opportunity inspection modal, and moderation action dialog.
  - `AdminReportsTable` (`components/admin/admin-reports-table.tsx`): Community moderation queue with snippet previews, reporter justifications, and dismiss/remove/suspend dialogs.
  - `AdminCompaniesTable` (`components/admin/admin-companies-table.tsx`): Company management console with verify/suspend actions.
  - `AdminAuditTable` (`components/admin/admin-audit-table.tsx`): Audit ledger with action badges, timestamps, administrator attribution, and JSON payload inspector dialog.
  - `AdminAnalyticsView` (`components/admin/admin-analytics-view.tsx`): Recharts visual graphs for member growth, opportunity volume, department participation, and verification health.
- **Automated Testing Suite (`tests/unit/admin-and-moderation.test.ts`)**:
  - 13 comprehensive test cases covering admin permissions, stats calculation, member suspension, opportunity review, content reports, company verification, audit logging, and analytics aggregation.

---

## [Stage 12: Notifications and Personal Career Calendar] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `Notification`: High-performance notification record linking `recipientId`, `type` (`NotificationType`), `title`, `message`, `relatedEntityType` (`RelatedEntityType`), `relatedEntityId`, `actionUrl`, `isRead`, `readAt`, `createdAt`, `updatedAt`, with indexes on `[recipientId, isRead]` and `[recipientId, createdAt]`.
  - `NotificationPreference`: Granular channel control matrix storing boolean flags for `opportunitiesInApp`/`Email`, `applicationsInApp`/`Email`, `communityInApp`/`Email`, `membershipInApp`/`Email`, and `remindersInApp`/`Email`.
  - `CareerCalendarEvent`: Personal calendar scheduling model tracking `title`, `description`, `eventType` (`CalendarEventType`), `startDate`, `endDate`, `location`, `isAllDay`, optional `relatedOpportunityId`, and optional `relatedApplicationId` with index on `[userId, startDate]`.
  - `DeadlineReminderLog`: Scheduled reminder tracking model with composite unique constraint `@@unique([userId, opportunityId, reminderType, channel])` guaranteeing idempotent reminder dispatches without duplicate alerts across repetitive cron triggers.
  - New Enums:
    - `NotificationType` (22 events covering Opportunities, Applications, Community, Membership, and Reminders).
    - `RelatedEntityType` (`OPPORTUNITY`, `APPLICATION`, `POST`, `COMMENT`, `CONNECTION`, `REFERRAL`, `MEMBERSHIP`, `CALENDAR_EVENT`, `SYSTEM`).
    - `CalendarEventType` (`APPLICATION_DEADLINE`, `SAVED_OPPORTUNITY_DEADLINE`, `INTERVIEW`, `CAREER_FAIR`, `REMINDER`, `OTHER`).
- **Validation Schemas (`lib/validations/notification.ts` & `lib/validations/calendar.ts`)**:
  - `notificationQuerySchema`: Query parameter validation for pagination, unread filters, and notification type.
  - `updateNotificationPreferencesSchema`: Granular boolean toggles for in-app and email channels across all 5 functional categories.
  - `createCalendarEventSchema`: Calendar reminder creation validation with ISO date/time, category, and notes.
  - `updateCalendarEventSchema`: Calendar reminder update validation.
  - `calendarQuerySchema`: Month and year query validation supporting both `?year=2026&month=11` and `?month=2026-11`.
- **Backend Services (`lib/services/`)**:
  - `lib/services/notification.ts`:
    - `createNotification`: Generates in-app notifications and dispatches emails with user preference checks, account status verification, and duplicate unread prevention.
    - `getUserNotifications`: Retrieves paginated notifications with unread counts and pagination metadata.
    - `getUnreadNotificationCount`: Lightweight unread counter for header bell badge polling.
    - `markNotificationAsRead`: Marks individual notifications as read with recipient authorization enforcement.
    - `markAllNotificationsAsRead`: Batch marks all unread notifications as read.
    - `deleteNotification`: Deletes notification with recipient authorization check (blocks cross-member deletion with HTTP 403 Forbidden).
    - `getUserNotificationPreferences` & `updateUserNotificationPreferences`: Manages member notification settings.
  - `lib/services/calendar.ts`:
    - `getUserCareerCalendar`: Aggregates 4 distinct real data sources into a single chronological calendar feed: user custom reminders, application target deadlines for applied opportunities, interview stages, and saved opportunity deadlines. Avoids duplicates for opportunities both saved and applied.
    - `createCalendarEvent`: Creates custom career reminders.
    - `updateCalendarEvent`: Updates custom career reminders with ownership verification.
    - `deleteCalendarEvent`: Deletes custom career reminders with ownership verification (blocks unauthorized deletion with HTTP 403 Forbidden).
  - `lib/services/reminder.ts`:
    - `processScheduledDeadlineReminders`: Scans approved opportunities closing in the next 72 hours, verifies `DeadlineReminderLog`, and dispatches non-duplicate alerts to applied and bookmarking members.
- **Email Notification Templates (`lib/email.ts`)**:
  - Formatted responsive HTML email templates for transactional alerts with development log store (`devEmailStore`) and credential-safe error isolation.
- **API Route Handlers (`app/api/`)**:
  - `GET /api/notifications`: Retrieves notifications with pagination and filters.
  - `POST /api/notifications?action=markAllRead`: Batch marks all notifications as read.
  - `PUT /api/notifications/[id]`, `DELETE /api/notifications/[id]`: Individual notification mark read & dismissal.
  - `GET /api/notifications/count`: Lightweight unread counter endpoint.
  - `GET /api/notifications/preferences`, `PUT /api/notifications/preferences`: Manages notification channel settings.
  - `GET /api/calendar`: Returns aggregated month calendar events.
  - `POST /api/calendar`: Schedules a custom career reminder.
  - `PUT /api/calendar/[id]`, `DELETE /api/calendar/[id]`: Updates and deletes custom reminders.
  - `GET /api/cron/reminders`, `POST /api/cron/reminders`: Scheduled reminder worker protected via `CRON_SECRET` or platform `ADMIN` session.
- **Frontend Components & Views**:
  - `NotificationsPopover` (`components/navigation/notifications-popover.tsx`): Header popover displaying live unread counts, recent notifications with relative timestamps and icons, click-to-mark-read navigation, and link to `/notifications`.
  - `NotificationsCenterView` (`components/notifications/notifications-center-view.tsx`): Notification center with filter tabs (All, Unread, Applications, Opportunities, Community, Referrals), "Mark as Read", "Mark All as Read", "Dismiss", direct entity deep links, and empty states.
  - `NotificationsPage` (`app/(dashboard)/notifications/page.tsx`): Integrated dashboard page rendering `NotificationsCenterView` inside `ListingTemplate`.
  - `AddEventModal` (`components/calendar/add-event-modal.tsx`): Dialog to schedule custom career reminders and interview preps with date, time, category, and notes.
  - `CareerCalendarView` (`components/calendar/career-calendar-view.tsx`): Month view grid (7 days x 5-6 weeks) with previous/next month and today navigation, color-coded badges, event details dialog, and custom reminder creation.
  - `CalendarPage` (`app/(dashboard)/calendar/page.tsx`): Dedicated career calendar route.
  - `NotificationPreferencesCard` (`components/settings/notification-preferences-card.tsx`): Settings section with granular In-App and Email toggles across all 5 functional categories.
  - Added "Career Calendar" navigation item to `AppSidebar` (`components/navigation/sidebar.tsx`).
- **Event Triggers Wired**:
  - Applications: `APPLICATION_SUBMITTED`, `APPLICATION_STATUS_CHANGED`, `APPLICATION_SHORTLISTED`, `APPLICATION_INTERVIEW_SCHEDULED`, `APPLICATION_WITHDRAWN`.
  - Community: `POST_COMMENT`, `COMMENT_REPLY`.
  - Connections & Referrals: `CONNECTION_REQUEST`, `CONNECTION_ACCEPTED`, `REFERRAL_REQUEST`, `REFERRAL_RESPONSE`.
  - Membership: `MEMBERSHIP_APPROVED`, `MEMBERSHIP_REJECTED`.
- **Automated Testing**:
  - `tests/unit/notifications-and-calendar.test.ts`: 12 comprehensive unit and integration tests covering notification lifecycle, preference suppression, recipient authorization boundaries, calendar event aggregation, custom event CRUD, deadline reminder scanning, and email template resiliency (157/157 passing across all 14 test files).

---

## [Stage 11: Smart Matching and Student Career Tools] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `Skill`: Centralized controlled taxonomy model with unique `name`, `category` (`SkillCategory`), and optional description.
  - `MemberSkill`: Member proficiency association with `level` (`SkillLevel`), `isVerified` endorsement flag, and composite unique constraint `@@unique([profileId, skillId])`.
  - `OpportunitySkill`: Required competency association linking opportunities to skills with `isRequired`, `minLevel`, and composite unique constraint `@@unique([opportunityId, skillId])`.
  - `AcademicRecord`: Student semester transcript model tracking `semester`, term `gpa` (0.00-4.00), term `credits` (0.5-30.0), `academicYear` standing, `isVerified` flag, coursework `notes`, and composite unique constraint `@@unique([userId, semester])`.
  - `Profile.currentCgpa`: Cached denormalized cumulative CGPA field on `Profile` model for sub-millisecond query performance during bulk opportunity matching.
  - New Enums: `SkillCategory` (12 categories: `PROGRAMMING_LANGUAGE`, `FRAMEWORK`, `DATABASE`, `DEVOPS`, `CLOUD`, `DATA_AI`, `DESIGN`, `MOBILE`, `SECURITY`, `MANAGEMENT`, `SOFT_SKILLS`, `OTHER`) and `SkillLevel` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
- **Validation Schemas (`lib/validations/skill.ts` & `lib/validations/academic.ts`)**:
  - `createSkillSchema`: Skill creation validation with category and description.
  - `addMemberSkillSchema`: Member skill association validation with proficiency level.
  - `createAcademicRecordSchema`: Semester GPA and credit validation with duplicate semester check.
  - `updateAcademicRecordSchema`: Semester transcript record update validation.
- **Backend Services (`lib/services/`)**:
  - `lib/services/skill.ts`: Controlled skills catalog retrieval, seed catalog initializer (30+ standard skills), `getOrCreateSkill`, `addSkillToProfile` (with automatic `Profile.skills` string array synchronization), `removeSkillFromProfile`, and `getMemberSkills`.
  - `lib/services/academic.ts`: `calculateCumulativeCgpa` using standard credit-weighted formula $\frac{\sum (\text{GPA}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$, `syncProfileCumulativeCgpa`, `createAcademicRecord` (with duplicate semester prevention), `updateAcademicRecord`, `deleteAcademicRecord`, and `getUserAcademicProfile` (enforcing strict student transcript privacy with HTTP 403 `ACCESS_DENIED` for unauthorized viewers).
  - `lib/services/matching.ts`:
    - `calculateSkillMatch`: Exact mathematical score $\frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$ with strict color coding (Green $\ge 80\%$, Yellow $50\% - 79\%$, Red $< 50\%$) and zero required skills handling (100% score).
    - `parseAcademicYearLevel`: Academic class standing normalizer ("Freshman"=1, "Sophomore"=2, "Junior"=3, "Senior"=4, "Graduate"=5).
    - `evaluateEligibility`: Institutional criteria check (CGPA cutoff, department targeting, class standing, deadline, approved status) returning `ELIGIBLE`, `NOT_ELIGIBLE`, or `NEEDS_REVIEW` (for incomplete profile data).
    - `getPersonalizedRecommendations`: Personalized opportunity recommendation generator with match scores, checklist reasons, and mandatory non-guarantee disclaimer.
    - `analyzeStudentSkillGaps`: Aggregates competencies across all active approved campus opportunities to compute real market demand frequency, contrast student competencies against missing requirements, generate top 5 prioritized recommendations, and curate verified educational resources.
- **API Route Handlers (`app/api/`)**:
  - `GET /api/skills`: Returns controlled skills list with auto-seed capability.
  - `POST /api/skills`: Registers new skill in the controlled taxonomy.
  - `GET /api/skills/my`, `POST /api/skills/my`, `DELETE /api/skills/my`: Member profile skill management.
  - `GET /api/academic/records`: Retrieves confidential student academic records and cumulative CGPA.
  - `POST /api/academic/records`: Records semester GPA and credits.
  - `PUT /api/academic/records/[id]`, `DELETE /api/academic/records/[id]`: Updates/deletes semester entries.
  - `GET /api/career/recommendations`: Retrieves personalized opportunity recommendations with match scores and disclaimers.
  - `GET /api/career/skill-gap`: Returns real market demand skill gap analysis with prioritized recommendations and verified learning tracks.
  - `GET /api/career/eligibility`: Standalone opportunity eligibility verification endpoint.
- **Frontend Components & Views (`components/career/` & `app/(dashboard)/career-tools/`)**:
  - `AddSemesterModal` (`components/career/add-semester-modal.tsx`): Interactive dialog to log semester term, GPA, credits, academic standing, and coursework notes.
  - `CareerDashboardView` (`components/career/career-dashboard-view.tsx`): Comprehensive student career hub with 3 functional tabs: Recommendations (color-coded score badges, checklist eligibility, reason bullets, department filter), Skill Gap Analyzer (market demand metrics, top 5 prioritized missing skills, verified learning tracks), and Academic Performance (cumulative CGPA gauge, semester transcript table, deletion action).
  - `CareerToolsPage` (`app/(dashboard)/career-tools/page.tsx`): Server component checking `canAccessStudentTools`. Enforces student role access; displays graceful explanatory banner and navigation links to opportunities and community feeds for non-student profiles.
- **Automated Testing**:
  - `tests/unit/smart-matching-and-career-tools.test.ts`: 20 comprehensive unit and integration tests covering match formulas, edge cases, color thresholds, eligibility rules, market gap analysis, credit-weighted CGPA, semester uniqueness, academic transcript privacy, and non-student role gates (145/145 passing across all 13 test files).

---

## [Stage 10: Member Directory, Connections & Referrals] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `Connection`: Mutual professional network model with composite unique constraint `@@unique([senderId, receiverId])`, tracking `status` (`PENDING`, `ACCEPTED`, `REJECTED`), and relations to `User` (`sender` and `receiver`).
  - `ReferralRequest`: Formal referral requisition model linking `requester`, `recipient`, optional `company`, target `roleTitle`, optional `opportunity`, message pitch, optional resume link, `status` (`PENDING`, `ACCEPTED`, `DECLINED`, `COMPLETED`, `CANCELLED`), response note, and response timestamp.
  - New Enums: `ConnectionStatus` (`PENDING`, `ACCEPTED`, `REJECTED`) and `ReferralStatus` (`PENDING`, `ACCEPTED`, `DECLINED`, `COMPLETED`, `CANCELLED`).
- **Validation Schemas (`lib/validations/connection.ts` & `lib/validations/referral.ts`)**:
  - Zod schemas: `sendConnectionSchema`, `respondConnectionSchema`, `connectionQuerySchema`, `createReferralSchema` (min 20, max 2,000 chars), `respondReferralSchema`, `referralQuerySchema`, and `memberDirectoryQuerySchema` in `lib/validations/profile.ts`.
- **Backend Services & Security Enforcements (`lib/services/connection.ts` & `lib/services/referral.ts`)**:
  - `sendConnectionRequest`: Prohibits self-connection (`senderId !== receiverId`), prevents duplicate pending requests, rejects inactive recipients.
  - `respondToConnectionRequest`: Enforces that only the designated recipient can `ACCEPT` or `REJECT` a pending request.
  - `cancelConnectionRequest`: Enforces that only the sender can cancel a pending request.
  - `removeConnection`: Allows either connected member to dissolve an accepted connection.
  - `getConnectionState`: Computes real-time connection state (`SELF`, `NONE`, `PENDING_SENT`, `PENDING_RECEIVED`, `CONNECTED`).
  - `createReferralRequest`: Prohibits self-referral, attaches optional company and opportunity references, initializes `PENDING` request.
  - `assertCanAccessReferral`: Strictly enforces server-side access control. Only the requester, recipient, or platform administrator can view referral request dossiers (HTTP 403 Forbidden for unauthorized members).
  - `respondToReferralRequest`: Recipient-only response lifecycle (`ACCEPTED`, `DECLINED`, `COMPLETED`) with feedback notes.
  - `cancelReferralRequest`: Requester-only cancellation for pending referral requests.
  - `searchMemberDirectory` in `lib/services/profile.ts`: Paginated member directory search with multi-filters (department, membershipType, company, skill, keyword) and strict redaction of private fields (`studentId`, `phone`, private email).
- **API Route Handlers (`app/api/`)**:
  - `GET /api/members`: Paginated member directory search endpoint.
  - `GET /api/connections`, `POST /api/connections`: Connection list and request submission.
  - `PUT /api/connections/[id]`, `DELETE /api/connections/[id]`: Connection response and cancellation/removal.
  - `GET /api/connections/status`: Active connection status query between viewer and target member.
  - `GET /api/referrals`, `POST /api/referrals`: User referral requests dashboard and submission.
  - `GET /api/referrals/[id]`, `PUT /api/referrals/[id]`: Referral detail dossier and status update.
- **Frontend Views & Components**:
  - `components/community/member-directory-view.tsx`: Real database-backed member directory with live debounced search, role filter, department/company/skill inputs, pagination, and direct action triggers.
  - `components/community/connection-button.tsx`: Stateful connection action button supporting connect, pending, accept/decline, connected, and remove actions with real-time feedback.
  - `components/referrals/request-referral-modal.tsx`: Interactive modal for submitting tailored referral requests with institutional networking disclaimer.
  - `components/referrals/referrals-hub-view.tsx`: Dedicated dashboard with Incoming Requests inbox, Sent Requests tracker, status badges, response notes, and response action dialogs.
  - `components/profile/profile-actions.tsx`: Client action toolbar for member profile pages.
  - Enhanced `app/(dashboard)/profile/[id]/page.tsx`: Profile detail page enriched with connection button, referral request trigger, mutual university connection count, and recent community activity feed.
  - Connected `app/(dashboard)/community/page.tsx` and `app/(dashboard)/referrals/page.tsx` to real database services, eradicating all mock data.
- **Automated Unit Testing (`tests/unit/connections-and-referrals.test.ts`)**:
  - 12 comprehensive unit and integration tests covering directory search, privacy filters, connection lifecycle, duplicate prevention, self-connection blocking, referral request lifecycle, response workflows, and unauthorized access rejections.

---

## [Stage 9: Community Feed, Discussions & Moderation] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `Post`: Community discussion post model with fields for title, content, postType, visibility, moderation status, pinned flag, attached opportunity reference, topic tags, view counts, like counts, comment counts, and relations.
  - `Comment`: Discussion comments and single-level reply hierarchy model (`parentId`), content, moderation status, and audit relations.
  - `PostReaction`: Atomic post reaction model with composite unique constraint `@@unique([postId, userId, type])` preventing duplicate reactions of the same type.
  - `PostBookmark`: Saved posts model with composite unique constraint `@@unique([postId, userId])` preventing duplicate bookmarks.
  - `ContentReport`: Moderation report model tracking reporter, target type (`POST` vs `COMMENT`), target reference, categorized reason, description, and admin review audit fields.
  - New Enums: `PostType` (`GENERAL_DISCUSSION`, `CAREER_ADVICE`, `JOB_ANNOUNCEMENT`, `INTERNSHIP_ANNOUNCEMENT`, `REFERRAL_REQUEST`, `ACHIEVEMENT`, `QUESTION`), `ModerationStatus` (`ACTIVE`, `PENDING_REVIEW`, `FLAGGED`, `REMOVED`), `PostVisibility` (`PUBLIC`, `STUDENTS_ONLY`, `ALUMNI_ONLY`), `ReactionType` (`LIKE`, `INSIGHTFUL`, `SUPPORT`, `CELEBRATE`), `ReportTargetType` (`POST`, `COMMENT`), `ReportReason` (`SPAM`, `HARASSMENT`, `INAPPROPRIATE`, `MISINFORMATION`, `OTHER`), `ReportStatus` (`PENDING`, `REVIEWED`, `RESOLVED`, `DISMISSED`).
- **Validation Schemas (`lib/validations/community.ts`)**:
  - Zod schemas: `createPostSchema` (min 10, max 5,000 chars), `updatePostSchema`, `createCommentSchema` (min 2, max 2,000 chars), `updateCommentSchema`, `toggleReactionSchema`, `createReportSchema`, and `communityFilterSchema`.
- **Backend Services & Security Enforcements (`lib/services/community.ts`)**:
  - `createCommunityPost`: Validates author status, verifies attached opportunity, and persists post.
  - `getCommunityFeed`: Paginated feed retrieval with channel filtering, hashtag search, viewer reaction state, and saved status.
  - `getCommunityPostById`: Single post dossier with reactions, comments, and viewer context.
  - `updateCommunityPost` & `deleteCommunityPost`: Author or platform admin only; cascades relations on deletion.
  - `addPostComment`: Adds top-level comment or reply (`parentId`) with automatic `commentsCount` synchronization.
  - `getPostComments`: Hierarchical comment and reply thread retrieval.
  - `updatePostComment` & `deletePostComment`: Author or platform admin only.
  - `togglePostReaction`: Atomic toggle off and type switching with accurate aggregate recounts.
  - `togglePostBookmark`: Atomic bookmark toggle.
  - `createContentReport`: Moderation report submission with duplicate report prevention and automatic status escalation to `FLAGGED` upon >= 3 reports.
  - `assertCanParticipateInCommunity`: Rejects unverified or suspended accounts (`FORBIDDEN_ACCOUNT_SUSPENDED`).
- **API Route Handlers (`app/api/`)**:
  - `GET /api/posts` & `POST /api/posts`: Feed query and post creation.
  - `GET /api/posts/[id]`, `PUT /api/posts/[id]`, `DELETE /api/posts/[id]`: Post detail, updates, and deletion.
  - `POST /api/posts/[id]/react`: Reaction toggle endpoint.
  - `POST /api/posts/[id]/bookmark` & `GET /api/posts/bookmarks`: Bookmark toggle and saved feed endpoint.
  - `GET /api/posts/[id]/comments` & `POST /api/posts/[id]/comments`: Comments and replies endpoints.
  - `PUT /api/comments/[id]` & `DELETE /api/comments/[id]`: Comment update and deletion endpoints.
  - `POST /api/posts/[id]/report` & `POST /api/comments/[id]/report`: Inappropriate content reporting endpoints.
- **Frontend Components & Pages**:
  - `components/community/community-feed-view.tsx`: Client community feed with channel tabs, real-time search, feed statistics, skeletons, and pagination.
  - `components/community/create-post-box.tsx`: Rich post creation component with post type selector, headline, topic tags, and optimistic feed updates.
  - `components/community/feed-post-card.tsx`: Enriched post card with badges, reactions, in-place edit, delete, bookmark, share, and inline comments toggle.
  - `components/community/comment-thread.tsx`: Threaded discussion component supporting replies, comment editing, deletion, and reporting.
  - `components/community/report-dialog.tsx`: Reusable modal for reporting posts or comments.
  - `app/(dashboard)/feed/page.tsx`: Full-featured Community Feed page.
  - `app/(dashboard)/dashboard/page.tsx`: Updated with real PostgreSQL metrics and live community feed stream.
  - Updated `components/navigation/sidebar.tsx` and `components/navigation/mobile-nav.tsx` to link directly to `/feed`.
- **Automated Testing (`tests/unit/community.test.ts`)**:
  - 22 new unit and integration tests covering post creation, validation, suspended account gates, author edits, admin moderation, threaded replies, comment lifecycle, atomic reactions, duplicate reaction prevention, bookmark unique constraints, content reporting, channel filtering, and pagination. Total test suite expanded to 113 passing tests across 11 test files.

---

## [Stage 8: Applications and Applicant Management] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `Application`: Core candidate application model with composite unique constraint `@@unique([opportunityId, applicantId])`, tracking application method (`INTERNAL` vs `EXTERNAL`), status (`SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`), cover letter, employer notes, reviewer ID, reviewed timestamp, and relations to `Opportunity`, `User` (applicant), `Resume`, and `ApplicationStatusHistory`.
  - `Resume`: Vault metadata model with unique `storageKey`, filename, MIME type, file size, isDefault flag, and relation to `User`.
  - `ApplicationStatusHistory`: Audit log tracking status transitions with `fromStatus`, `toStatus`, changed by user ID, notes, and timestamp.
  - New Enums: `ApplicationStatus` (`SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`).
- **Validation Schemas & File Inspection (`lib/validations/application.ts`)**:
  - `inspectFileMagicBytes`: Binary inspection verifying real magic numbers (`%PDF-` / `0x25 0x50 0x44 0x46` for PDF, `PK\x03\x04` for DOCX) to ensure filenames and browser-supplied MIME types are never trusted alone.
  - Zod schemas: `submitInternalApplicationSchema`, `recordExternalApplicationSchema`, `updateApplicationStatusSchema`, and `withdrawApplicationSchema`.
- **Backend Services & Security Enforcements (`lib/services/`)**:
  - `lib/services/resume.ts`: Secure disk vault storage in `storage/resumes/` outside public web directory, magic-bytes verification, 5MB limit enforcement, `assertCanAccessResume` anti-IDOR checks, binary retrieval, default setting, and deletion.
  - `lib/services/application.ts`: Full lifecycle service with `checkApplicationEligibility`, `submitInternalApplication`, `recordExternalApplication`, `withdrawApplication`, `getUserApplications`, `assertCanManageApplicantsForOpportunity`, `getOpportunityApplicants`, `updateApplicationStatus`, and `getApplicationById`.
- **API Route Handlers (`app/api/`)**:
  - `GET /api/resumes`, `POST /api/resumes`: Resume vault retrieval and multipart file upload with header inspection.
  - `DELETE /api/resumes/[id]`: Secure resume deletion.
  - `GET /api/resumes/[id]/download`: Secure binary stream with `Content-Disposition` and anti-IDOR authorization checks.
  - `GET /api/applications`, `POST /api/applications`: Candidate dashboard retrieval and application submission.
  - `GET /api/applications/[id]`: Application dossier retrieval for applicant or employer.
  - `POST /api/applications/[id]/withdraw`: Candidate application withdrawal with audit trail.
  - `GET /api/opportunities/[id]/eligibility`: Real-time pre-flight eligibility check.
  - `GET /api/opportunities/[id]/applicants`: Recruiter candidate pipeline endpoint.
  - `POST /api/opportunities/[id]/applicants/[applicationId]/status`: Recruiter status transition endpoint with audit logging.
- **Frontend Components & Pages**:
  - `components/applications/apply-modal.tsx`: Multi-step application modal with eligibility checking, CGPA advisory warning, resume selector/vault upload, optional cover letter, and confirmation step.
  - `components/applications/external-apply-dialog.tsx`: External portal redirect dialog with clear third-party notice and manual activity tracking.
  - `components/applications/my-applications-view.tsx`: Candidate dashboard with status tabs, search, resume downloads, details modal, and withdrawal.
  - `components/applications/employer-applicant-manager.tsx`: Recruiter management console with candidate profile details, resume download, status update dialog, and history log.
  - `app/(dashboard)/applications/page.tsx`: Live candidate dashboard page.
  - `app/(dashboard)/opportunities/[id]/applicants/page.tsx`: Server-protected recruiter management page with `assertCanManageApplicantsForOpportunity`.
  - Updated `components/opportunities/opportunity-detail-actions.tsx`: Wired "Manage Applicants" button for recruiters, and connected apply buttons to `ApplyModal` and `ExternalApplyDialog`.
  - Updated `components/opportunities/my-opportunities-view.tsx`: Added "Applicants" action button for official employer listings.
- **Automated Testing (`tests/unit/applications.test.ts`)**:
  - 17 new unit tests verifying magic-byte detection, size checks, eligibility, deadlines, closed listings, duplicate prevention, external tracking, candidate retrieval, withdrawal, community poster isolation (403), employer status management, and anti-IDOR resume download security. Total test suite expanded to 91 passing tests across 10 test files.

---



### Added
- **Database Schema Models & Relations (`prisma/schema.prisma`)**:
  - `OpportunityBookmark`: Model establishing user bookmarks for opportunities with composite unique constraint `@@unique([userId, opportunityId])`, indexed on `userId` and `opportunityId`.
  - Added relation fields to `User` (`opportunityBookmarks`) and `Opportunity` (`bookmarks`).
- **Validation Schemas (`lib/validations/opportunity.ts`)**:
  - Updated `opportunityFilterSchema` with `companyId`, `companyName`, `location`, `skill`, `maxMinCgpa`, `openToAllDepartments`, `bookmarkedOnly`, `page`, and `limit`.
- **Backend Services (`lib/services/opportunity.ts`)**:
  - `toggleOpportunityBookmark`: Atomic create/delete bookmark toggle returning active boolean status.
  - `isOpportunityBookmarked`: Checks if a user has saved a listing.
  - `getUserBookmarkedOpportunities`: Fetches user's bookmarked opportunities with pagination.
  - `getUserAuthoredOpportunities`: Fetches user's authored opportunities with live status counts across all lifecycle states (`ALL`, `APPROVED`, `PENDING`, `DRAFT`, `REJECTED`, `CLOSED`, `EXPIRED`).
  - `getRelatedOpportunities`: Retrieves up to 3 active opportunities from the same company or department.
  - Enhanced `getApprovedOpportunities` with enriched multi-filter support and viewer bookmark status decoration.
- **API Routes (`app/api/`)**:
  - `POST /api/opportunities/[id]/bookmark`: Toggle bookmark endpoint.
  - `GET /api/opportunities/bookmarks`: User saved listings endpoint.
  - `GET /api/opportunities/my`: Author opportunities console endpoint.
  - Updated `GET /api/opportunities` with multi-filter query params and bookmark decoration.
- **Frontend Components & Pages**:
  - `components/opportunities/opportunities-browser.tsx`: Complete client browser with search debounce, multi-select filters (type, workplace, source, department, max CGPA), active filters pill bar, all/bookmarked view tabs, loading skeletons, empty states, and pagination.
  - `components/opportunities/job-card.tsx`: Enriched with company logo, department badges, min CGPA indicator, poster details, and interactive bookmark button.
  - `components/opportunities/opportunity-detail-actions.tsx`: Interactive bookmark button with toast notifications, share link button, and `OpportunityApplyButton` supporting external redirect or internal application notice.
  - `components/opportunities/opportunity-form.tsx`: Comprehensive form using React Hook Form + Zod, skills tag input, department multi-select checkboxes, live card preview toggle, draft saving (`DRAFT`), and review submission (`PENDING`).
  - `components/opportunities/my-opportunities-view.tsx`: Author console with status tabs, count badges, draft submission, closure dialog, delete dialog, and rejection reason feedback.
  - `app/(dashboard)/opportunities/page.tsx`: Real browser page connected to live API.
  - `app/(dashboard)/opportunities/[id]/page.tsx`: Server component fetching detailed opportunity, company info, academic criteria, poster identity, and related openings.
  - `app/(dashboard)/opportunities/post/page.tsx`: Server page validating user posting permission, loading managed companies, and rendering form.
  - `app/(dashboard)/opportunities/my/page.tsx`: Author console page.
  - `app/(dashboard)/opportunities/saved/page.tsx`: Dedicated saved opportunities view.
  - `app/(dashboard)/contributions/page.tsx`: Linked opportunities section to `/opportunities/my`.
- **Automated Testing (`tests/unit/job-browsing-and-posting.test.ts`)**:
  - 14 new unit and integration tests covering approved listing queries, keyword search, opportunity type filtering, workplace mode filtering, source type filtering, department eligibility matching, minimum CGPA filtering, pagination, posting permission gates, managed company validation for official postings, draft saving and pending submission, atomic bookmark toggling, duplicate bookmark prevention, and author listing retrieval.
  - Total test suite expanded to 74 passing tests across 9 test files.

---

## [Stage 6: Companies, Opportunities, and Approval System] - 2026-11-05

### Added
- **Database Schema Models & Enums (`prisma/schema.prisma`)**:
  - `Company`: Corporate partner model storing name (unique), logo, description, website, industry, location, and creator reference (`createdById`).
  - `CompanyMember`: Association model tracking user memberships within companies with roles (`OWNER`, `ADMIN`, `MEMBER`) and permissions (`canPostOpportunities`, `canManageCompany`), protected by a composite unique constraint `@@unique([companyId, userId])`.
  - `Department`: University academic disciplines table seeded with 16 canonical Jagannath University departments across 6 faculties.
  - `Opportunity`: Core career listing model supporting 5 types (`INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`, `OTHER`), 2 source types (`OFFICIAL_EMPLOYER`, `COMMUNITY_SHARED`), 6 statuses (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`, `CLOSED`), minimum CGPA threshold, academic year, required skills, target departments, open-to-all flag, location, workplace type, application method, external URL, contact email, future deadline, reviewer ID, review timestamp, and rejection reason.
  - New Enums: `CompanyMemberRole`, `OpportunityType`, `OpportunitySourceType`, `OpportunityStatus`, `WorkplaceType`, `ApplicationMethod`.
- **Validation Schemas (`lib/validations/`)**:
  - `lib/validations/company.ts`: Zod schemas for company creation, updates, and member additions.
  - `lib/validations/opportunity.ts`: Comprehensive Zod schemas for opportunity creation (enforcing future deadline and external application URL validation), opportunity updates, admin review evaluations, and query filtering.
- **Backend Services & Security Enforcements (`lib/services/`)**:
  - `lib/services/company.ts`: Functions for `createCompany`, `updateCompany`, `getCompany`, `listCompanies`, `addCompanyMember`, `getUserCompanies`, `assertCanManageCompany`, and `assertCanPostForCompany`.
  - `lib/services/opportunity.ts`: Functions for `createOpportunity`, `updateOpportunity`, `submitOpportunityForReview`, `closeOpportunity`, `deleteOpportunity`, `getOpportunityById`, `getApprovedOpportunities`, `expireOverdueOpportunities`, `getPendingOpportunities`, `reviewOpportunity`, and `assertCanModifyOpportunity`.
- **API Route Handlers (`app/api/`)**:
  - `GET /api/companies`, `POST /api/companies`: Corporate directory querying and company registration.
  - `GET /api/companies/[id]`, `PUT /api/companies/[id]`: Company profile retrieval and manager updates.
  - `POST /api/companies/[id]/members`: Company member assignment and capability delegation.
  - `GET /api/departments`: Canonical university departments directory with faculty filtering.
  - `GET /api/opportunities`, `POST /api/opportunities`: Filterable public opportunities listing and opportunity posting.
  - `GET /api/opportunities/[id]`, `PUT /api/opportunities/[id]`, `DELETE /api/opportunities/[id]`: Protected opportunity details, updates, and deletion.
  - `POST /api/opportunities/[id]/submit`: Draft submission to administrator review queue.
  - `POST /api/opportunities/[id]/close`: Manual opportunity closure.
  - `GET /api/admin/opportunities`, `POST /api/admin/opportunities`: Administrative moderation queue and Approve/Reject execution.
- **Admin Governance Interface**:
  - `components/admin/opportunity-review-table.tsx`: Live moderation table for administrators with status indicators, metadata pills, and interactive dialogues for Approve and Reject with mandatory justification.
  - `app/(dashboard)/admin/page.tsx`: Integrated live opportunities counts and moderation tab.
- **Automated Testing (`tests/unit/companies-and-opportunities.test.ts`)**:
  - 18 new integration and unit tests covering company creation, manager updates, unauthorized access rejection, company membership delegation, opportunity creation, posting clearance checks, company association assertions, community shared opportunities, future deadline enforcement, external URL validation, review queue isolation, admin approvals, admin rejection reasons, modification permissions, closure, automated expiration, and department targeting. Total test suite expanded to 60 passing tests across 8 test files.

---

## [Stage 5: Membership Verification and User Profiles] - 2026-11-05

### Added
- **Database Schema Models & Extensions (`prisma/schema.prisma`)**:
  - `Profile`: User profile model with headline, bio, department, studentId (private), academicYear, graduationYear, degree, company, designation, skills, interests, projects, experience, social URLs, phone (private), showEmail, and isOnboarded flag.
  - `MembershipRequest`: Verification request model with audit trails (`status`, `institutionalId`, `department`, `organization`, `designation`, `workEmail`, `connectionNote`, `proofDetails`, `reviewerId`, `rejectionReason`, `reviewedAt`).
  - `User`: Added `canPostOpportunities`, `canReviewApplicants`, `verifiedAt`, `verifiedBy`, and relational links to `Profile` and `MembershipRequest`.
- **Permissions & Authorization Engine (`lib/permissions.ts`)**:
  - `canPostOpportunity`: Server-enforced gate asserting that only platform administrators and verified institutional roles (`EMPLOYER`, `FACULTY`, `STAFF`) can post opportunities.
  - `canReviewApplicants`: Restricts candidate dossier review to verified employers and administrators.
  - `canAccessStudentTools`: Restricts academic CGPA and course gap tooling exclusively to verified students.
  - `assertCanPostOpportunity`: Throws HTTP 403 Forbidden on unverified attempts to post opportunities.
  - `assertAdmin`: Guards administrative queues and review capabilities.
- **Profile & Verification Services (`lib/services/profile.ts`, `lib/services/verification.ts`)**:
  - `getPublicProfile`: Strict privacy filter redacting student IDs, personal phone numbers, and private emails for non-owner, non-admin members.
  - `getMemberProfile`: Loads complete member profile and recent verification requests.
  - `upsertProfile`: Updates member profile fields and triggers onboarding completion.
  - `completeOnboarding`: Role-tailored handler creating Profile and submitting a pending `MembershipRequest`.
  - `submitVerificationRequest`: Submits new or resubmitted credentials, preserving request history.
  - `getPendingVerificationRequests`: Queries pending review queue for platform administrators.
  - `reviewVerificationRequest`: Evaluates request (APPROVE / REJECT with reason), grants/revokes posting permissions, and updates user verification status.
- **API Route Handlers (`app/api/`)**:
  - `GET /api/profile` & `PUT /api/profile`: Authenticated profile retrieval and editing.
  - `GET /api/profile/[id]`: Privacy-sanitized public profile viewer.
  - `POST /api/onboarding`: Role-specific onboarding processor.
  - `POST /api/verification/request` & `GET /api/verification/request`: Verification dossier submission and history.
  - `GET /api/admin/verifications` & `POST /api/admin/verifications`: Admin review queue and decision execution.
- **Frontend Pages & Interactive UI**:
  - `app/(dashboard)/onboarding/page.tsx`: Role-tailored onboarding flow for `STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, and `EXTERNAL_CONNECTION`.
  - `app/(dashboard)/profile/me/page.tsx`: Live connected profile with status badges, institutional dossier, and in-place `EditProfileModal` and `ResubmitVerificationModal`.
  - `app/(dashboard)/profile/[id]/page.tsx`: Privacy-enforcing public member viewer.
  - `app/(dashboard)/admin/page.tsx`: Upgraded Admin Governance Center with real database counts, live status pills, and `VerificationTable`.
  - `components/admin/verification-table.tsx`: Interactive verification table with instant Approve and Reject with mandatory reason workflows.
- **Automated Testing (`tests/unit/membership-and-profiles.test.ts`)**:
  - 15 unit and integration tests verifying all 6 membership types, 4 verification statuses, onboarding flow, admin approve/reject/resubmit lifecycle, privacy redactions, and server-side posting clearance. Total test suite expanded to 42 passing tests.

---

## [Stage 4: Authentication Engine and Account Security] - 2026-11-05

### Added
- **Authentication Core (`lib/auth.ts`, `lib/auth-client.ts`)**:
  - Configured Better Auth 1.7.17 with Prisma 7 adapter (`@prisma/adapter-pg`) connected to PostgreSQL 16 on Neon Lakebase.
  - Implemented high-entropy scrypt password hashing stored securely in `accounts` table. Plaintext passwords never stored.
  - Configured session management using database-backed sessions with secure HTTP-only cookies (`better-auth.session_token`).
  - Added cryptographic verification token issuance and automated email verification at `/verify-email`.
  - Added 30-minute cryptographic password reset token generation and redemption at `/reset-password`.
- **Account Data Models (`prisma/schema.prisma`)**:
  - `User`: Base identity entity with `membershipType`, `systemRole`, `accountStatus`, `verificationStatus`.
  - `Session`: Session tracking entity with expiration timestamps and user cascade.
  - `Account`: Authentication credentials entity storing scrypt password hashes and provider data.
  - `Verification`: Token lifecycle entity for email verification and password recovery.
  - Enforced strict separation between university affiliation (`membershipType`) and platform administrative roles (`systemRole`).
- **Server-Side Route Gatekeeping (`proxy.ts` & `app/(dashboard)/layout.tsx`)**:
  - Next.js 16 Proxy boundary (`proxy.ts`) redirecting unauthenticated traffic to `/login?callbackUrl=...`.
  - Server Component runtime authorization gate (`app/(dashboard)/layout.tsx`) validating sessions against PostgreSQL and rejecting `SUSPENDED` or `DEACTIVATED` accounts.
- **Authentication Pages & Forms (`app/(auth)/`)**:
  - `login/page.tsx`: Interactive login form with loading indicators, error banners, and preserved `callbackUrl` redirection.
  - `register/page.tsx`: Interactive multi-role registration form with client-side password matching, role selection, and terms acknowledgment.
  - `forgot-password/page.tsx`: Interactive password recovery request form.
  - `reset-password/page.tsx`: Interactive password reset token redemption view.
  - `verify-email/page.tsx`: Interactive email verification screen with automated token redemption and resend flow.
- **Email Infrastructure (`lib/email.ts`)**:
  - Created development email dispatcher (`devEmailStore`) with terminal logging for local development and test inspection.
- **Interactive User Menu (`components/navigation/user-menu.tsx`)**:
  - Connected live session state and functional `signOut` action calling `authClient.signOut()`.
- **Automated Tests**:
  - `tests/unit/auth.test.ts`: 8 unit and integration tests verifying registration, hashing, role isolation, credentials authentication, verification, and password resets.
  - `tests/unit/middleware.test.ts`: 7 unit tests verifying edge proxy route protection and redirection logic.

---

## [Stage 3: Website Layout and Navigation] - 2026-10-30

### Added
- **Navigation Components (`components/navigation/`)**:
  - `sidebar.tsx`: Sticky desktop sidebar with brand identity, primary navigation links, student career tools badge, and admin center entry.
  - `header.tsx`: Sticky top application header with global search (⌘K shortcut), verified network status indicator, notification drawer trigger, theme toggle, and user profile menu.
  - `mobile-nav.tsx`: Bottom sticky navigation bar optimized for thumb reach, paired with an off-canvas drawer overlay for full menu access.
  - `user-menu.tsx`: Dropdown user menu displaying verified badge, role, email, profile navigation, and logout action.
  - `notifications-popover.tsx`: Notification bell counter with preview popover linking to the full notifications center.
- **Application Shell Architecture (`components/layout/`)**:
  - `authenticated-shell.tsx`: Orchestrates responsive desktop sidebar, sticky header, main content area, and mobile navigation with `<Suspense>` boundaries for partial prerendering.
  - `app/(dashboard)/layout.tsx`: Layout wrapper enforcing the authenticated shell across all member routes.
  - `app/(auth)/layout.tsx`: Dedicated, distraction-free authentication layout with campus crest and back-to-home navigation.
  - `app/(public)/layout.tsx`: Public marketing shell with `AppNavbar` and `AppFooter`.
- **Reusable Page Templates (`components/templates/`)**:
  - `dashboard-template.tsx`: 2-column feed and widget layout.
  - `listing-template.tsx`: Filterable listing layout with search bars and pagination.
  - `details-template.tsx`: 2-column resource view with breadcrumbs and sticky sidebar.
  - `form-template.tsx`: Responsive card form layout with breadcrumb and footer action bar.
  - `profile-template.tsx`: Profile presentation view with verification banner and credential sidebar.
  - `admin-template.tsx`: Moderation and governance workspace with queue counters and tabbed queues.
- **Public Entry Pages (`app/(public)/`)**:
  - `app/(public)/page.tsx`: Gated marketing welcome page (no public opportunity or member data leaks).
  - `app/(public)/about/page.tsx`: Institutional network mission and verification philosophy.
  - `app/(public)/terms/page.tsx`: Terms of Service and community honor codes.
  - `app/(public)/privacy/page.tsx`: Candidate privacy policy and private resume vault statement.
- **Authentication Pages (`app/(auth)/`)**:
  - `app/(auth)/login/page.tsx`: Member sign-in interface.
  - `app/(auth)/register/page.tsx`: Multi-role institutional registration form.
  - `app/(auth)/forgot-password/page.tsx`: Cryptographic password recovery request form.
- **Authenticated Application Views (`app/(dashboard)/`)**:
  - `app/(dashboard)/dashboard/page.tsx`: Community feed, metrics strip, and featured postings.
  - `app/(dashboard)/feed/page.tsx`: Route alias redirecting to `/dashboard`.
  - `app/(dashboard)/opportunities/page.tsx`: Filterable career opportunities directory.
  - `app/(dashboard)/opportunities/[id]/page.tsx`: Comprehensive opportunity details with internal direct apply.
  - `app/(dashboard)/opportunities/post/page.tsx`: Job creation form supporting employer and community classifications.
  - `app/(dashboard)/community/page.tsx`: Verified member network directory.
  - `app/(dashboard)/referrals/page.tsx`: Alumni referral network hub.
  - `app/(dashboard)/applications/page.tsx`: Candidate application status tracker.
  - `app/(dashboard)/career-tools/page.tsx`: Student career tools, CGPA checker, and skill gap progress.
  - `app/(dashboard)/contributions/page.tsx`: Member contribution and impact score tracker.
  - `app/(dashboard)/profile/me/page.tsx`: Current user profile and credentials.
  - `app/(dashboard)/settings/page.tsx`: Account, notification, and vault security settings.
  - `app/(dashboard)/notifications/page.tsx`: Notifications and alerts center.
  - `app/(dashboard)/admin/page.tsx`: Staff moderation center for opportunities and member approvals.
- **UI Primitives Added**:
  - `components/ui/label.tsx`: Accessible form label component.
  - `components/ui/progress.tsx`: Accessible progress bar with percentage translation.
- **Automated Tests**:
  - Added `tests/unit/navigation-layout.test.ts` (4 new tests, 11 total passing across the project).

### Changed
- Replaced the root `app/page.tsx` temporary foundation landing with `app/(public)/page.tsx`.
- Updated `components/opportunities/deadline-indicator.tsx` to use deferred client calculation, eliminating static prerender timestamp errors in Next.js 16.
- Updated `components/ui/dropdown-menu.tsx` integration across `user-menu.tsx` and `notifications-popover.tsx` to conform to Base UI trigger patterns.
- Updated `docs/ROUTES_AND_PAGES.md`, `docs/DESIGN_SYSTEM.md`, and `docs/PROGRESS.md`.

---

## [Stage 2: Complete UI/UX Design System] - 2026-10-30

### Added
- **Design Tokens & Color Architecture**:
  - Full OKLCH token scale in `app/globals.css` with University Navy (`--primary`), Slate subtle neutrals, and semantic status accents.
  - Strict WCAG 2.1 AA contrast compliance across Light, Dark, and System modes.
  - Standardized border radii, elevation shadows, and keyboard focus states.
- **UI Primitives Library (`components/ui/`)**:
  - `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `tabs.tsx`, `dropdown-menu.tsx`, `badge.tsx`, `avatar.tsx`, `card.tsx`, `dialog.tsx`, `tooltip.tsx`, `table.tsx`, `pagination.tsx`, `breadcrumb.tsx`, `skeleton.tsx`, `sonner.tsx`.
- **Feedback & State Micro-UIs (`components/feedback/`)**:
  - `empty-state.tsx`: Accessible empty state container with icon and action button.
  - `error-banner.tsx`: Inline accessible error notice with retry trigger.
  - `confirm-dialog.tsx`: Accessible destructive confirmation modal.
- **Opportunity Domain Components (`components/opportunities/`)**:
  - `job-card.tsx`: Full opportunity card with bookmarking, salary, skills, and classification badge.
  - `company-card.tsx`: Employer profile card with partner status and active role count.
  - `employer-badge.tsx`: Visual distinction between `OFFICIAL_EMPLOYER` and `COMMUNITY_SHARED` opportunities.
  - `verified-badge.tsx`: Color-coded verification badges (`VERIFIED`, `PENDING`, `REJECTED`, `SUSPENDED`).
  - `match-score-indicator.tsx`: Skill overlap percentage indicator.
  - `deadline-indicator.tsx`: Urgency-aware application deadline countdown.
  - `application-status-badge.tsx`: Candidate pipeline status badges.
  - `applicant-summary-card.tsx`: Candidate overview card for employer applicant review.
- **Community Domain Components (`components/community/`)**:
  - `create-post-box.tsx`: Expandable community post composition trigger with topic categories.
  - `feed-post-card.tsx`: Discussion card with attached opportunity pill and reaction bar.
  - `reaction-buttons.tsx`: Like, Insightful, Support, Celebrate counters with active toggle state.
  - `member-profile-card.tsx`: Networking profile card with mentorship availability indicator.
  - `connection-button.tsx`: 3-state connection button (`Connect` → `Pending` → `Connected`).
  - `referral-card.tsx`: Structured elevator pitch card for alumni referrals.
  - `comment-thread.tsx`: Threaded discussion section with nested replies.
- **Interactive Demonstration Page**:
  - Created `/design-system` (`app/design-system/page.tsx`) showcasing all tokens, components, modals, and responsive layouts.
- **Automated Tests**:
  - Added `tests/unit/design-system.test.ts` (7/7 tests passing).

---

## [Stage 1: Project Foundation and Architecture] - 2026-10-30

### Added
- **Core Technology Foundation**:
  - Scaffolding with Next.js 16.4.3 (App Router), React 19.3.0, TypeScript 5.
  - Configured Tailwind CSS v4 with `@tailwindcss/turbopack` and shadcn/ui components (`components.json`).
  - Added OKLCH University Navy / Royal Blue color tokens with light/dark/system theme support (`app/globals.css`).
  - Integrated `next-themes` with clean hydration detection via `useSyncExternalStore` (`components/layout/theme-toggle.tsx`).
- **Database & Prisma ORM 7 Engine**:
  - Installed Prisma ORM 7.10.1 with `@prisma/adapter-pg` driver adapter.
  - Established PostgreSQL 16 connection pool singleton in `lib/prisma.ts`.
  - Created local database `unicareer_db` and verified connectivity with `npx tsx prisma/seed.ts`.
  - Configured environment variables handling with `.env` and `.env.example`.
- **Shared Application Infrastructure**:
  - Global providers in `components/providers/` (`ThemeProvider`, `AppProviders`).
