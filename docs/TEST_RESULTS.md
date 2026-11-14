# UniCareer Community — Test Execution Results

> This log records actual automated and manual test runs across project stages. Never fabricate test results.

---

## Verification & Pre-Approval Gate Lifecycle Tests (2026-11-14)

- **Date**: 2026-11-14
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (194/194 Passing across 16 Test Files, 0 Failures)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/membership-and-profiles.test.ts` | Verification Queue Gating, Approval Email Dispatch, Rejection Feedback Email & Pre-Approval Access Control | **PASSED** (16/16) | 1. Verified that unverified email accounts are excluded from the admin pending verification queue (`getPendingVerificationRequests`).<br>2. Verified that attempting to approve an account whose email has not been confirmed strictly throws `EMAIL_NOT_VERIFIED`.<br>3. Verified that administrative approval immediately dispatches `sendMembershipApprovedEmail` and records the notification in `devEmailStore`.<br>4. Verified that administrative rejection with reason immediately dispatches `sendMembershipRejectedEmail` with feedback.<br>5. Verified role decoupling, privacy redaction, and server-side posting clearance. |
| `tests/unit/auth.test.ts` | Email Verification Token Redemption, Scrypt Hashes & Pre-Auth Gate | **PASSED** (8/8) | All 8 tests passing. |
| `tests/unit/complete-user-workflows.test.ts` | Multi-Persona End-to-End Journeys (Student, Alumni, Admin) | **PASSED** (23/23) | All 23 tests passing. |
| **All Other Test Suites (13 files)** | Jobs, Companies, Community, Directory, Applications, Notifications, Database, Config, Layout | **PASSED** (147/147) | All tests passing. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Total** | **Full Regression Suite** | **PASSED** | **194/194 Passing (100%)** |

## Stage 14 Verification: Final Testing, Security, Responsiveness, and Optimization (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (193/193 Passing across 16 Test Files, 0 Failures)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/complete-user-workflows.test.ts` | End-to-End Multi-Persona User Journeys (Student, Alumni, Employer, Administrator) & Security Anti-IDOR | **PASSED** (23/23) | 1. Workflow A (Student): Registration, email verification, registrar claim, profile completion, opportunity search, explainable matching, bookmarking, PDF resume upload, application, duplicate block, tracking, notifications, community feed interactions.<br>2. Workflow B (Alumni): Registration, verification, community lead posting with external ATS link, networking connection request and acceptance, referral review and response.<br>3. Workflow C (Employer): Recruiter verification with posting clearance, company creation, official opportunity posting with compensation, admin approval, candidate application, Anti-IDOR security checks, pipeline status advancement to SHORTLISTED.<br>4. Workflow D (Administrator): Session clearance assertion, verification review queue, opportunity moderation, content reports resolution, account suspension/restoration with audit logs, live platform KPI querying. |
| `tests/unit/admin-and-moderation.test.ts` | Admin Access Control, Platform Statistics, Member Governance, Opportunity Moderation, Content Reports, Company Governance, Audit Logs & Analytics Compilation | **PASSED** (13/13) | All 13 tests passing. |
| `tests/unit/notifications-and-calendar.test.ts` | Notifications Engine, Preferences Suppression, Event Deduplication, Career Calendar Aggregation, Deadline Reminders & Cron Scanning | **PASSED** (12/12) | All 12 tests passing. |
| `tests/unit/smart-matching-and-career-tools.test.ts` | Controlled Skills Catalog, Explainable Match Scores, Eligibility Verification, Skill Gap Market Analytics & Confidential Academic Transcripts | **PASSED** (20/20) | All 20 tests passing. |
| `tests/unit/connections-and-referrals.test.ts` | Member Directory Search, Privacy Filters, Connections Engine & Referrals Dossier | **PASSED** (12/12) | All 12 tests passing. |
| `tests/unit/community.test.ts` | Community Posts, Threaded Comments, Reactions, Bookmarks & Moderation | **PASSED** (22/22) | All 22 tests passing. |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | All 17 tests passing. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | All 14 tests passing. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | All 18 tests passing. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (14/14) | All 14 tests passing. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | All 8 tests passing. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | All 7 tests passing. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database check passing. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Base parameters passing. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Tokens & contrast passing. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Layout & navigation passing. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **ESLint Check** (`npm run lint`) | Code Style & React 19 Compiler | **PASSED** | 0 errors. |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 68 App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 13 Verification: Admin Command Center, Moderation & Audit System (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (170/170 Passing across 15 Test Files, 0 Failures)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/admin-and-moderation.test.ts` | Admin Access Control, Platform Statistics, Member Governance, Opportunity Moderation, Content Reports, Company Governance, Audit Logs & Analytics Compilation | **PASSED** (13/13) | 1. Correctly identifies platform admins vs regular members.<br>2. Enforces admin assertion and throws error for non-admin accounts.<br>3. Verifies platform ADMIN role is completely decoupled from membershipType.<br>4. Accurately computes live database aggregates with zero fake data.<br>5. Searches and filters members by membership type and verification status.<br>6. Suspends a member account, blocks self-suspension, and restores accounts.<br>7. Approves pending opportunities, records reviewer attribution, and writes audit log.<br>8. Enforces mandatory feedback reason ($\ge 5$ chars) on opportunity rejection.<br>9. Closes and deletes opportunities with immutable audit tracking.<br>10. Verifies and suspends companies with administrative audit logging.<br>11. Processes content reports with dismissal, content removal, and author suspension options.<br>12. Creates structured audit log entries and allows querying by action and target entity.<br>13. Compiles genuine database time-series metrics without synthetic data. |
| `tests/unit/notifications-and-calendar.test.ts` | Notifications Engine, Preferences Suppression, Event Deduplication, Career Calendar Aggregation, Deadline Reminders & Cron Scanning | **PASSED** (12/12) | All 12 tests passing. |
| `tests/unit/smart-matching-and-career-tools.test.ts` | Controlled Skills Catalog, Explainable Match Scores, Eligibility Verification, Skill Gap Market Analytics & Confidential Academic Transcripts | **PASSED** (20/20) | All 20 tests passing. |
| `tests/unit/connections-and-referrals.test.ts` | Member Directory Search, Privacy Filters, Connections Engine & Referrals Dossier | **PASSED** (12/12) | All 12 tests passing. |
| `tests/unit/community.test.ts` | Community Posts, Threaded Comments, Reactions, Bookmarks & Moderation | **PASSED** (22/22) | All 22 tests passing. |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | All 17 tests passing. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | All 14 tests passing. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | All 18 tests passing. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | All 15 tests passing. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | All 8 tests passing. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | All 7 tests passing. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database check passing. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Base parameters passing. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Tokens & contrast passing. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Layout & navigation passing. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 68 App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 12 Verification: Notifications and Career Calendar System (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (157/157 Passing across 14 Test Files, 0 Failures)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/notifications-and-calendar.test.ts` | Notifications Engine, Preferences Suppression, Event Deduplication, Career Calendar Aggregation, Deadline Reminders & Cron Scanning | **PASSED** (12/12) | 1. Creates a new notification when recipient has in-app notifications enabled.<br>2. Prevents duplicate unread notifications by updating existing unread record.<br>3. Retrieves paginated notifications and accurate unread count.<br>4. Marks an individual notification as read and records read timestamp.<br>5. Marks all unread notifications as read in a single batch operation.<br>6. Enforces recipient authorization boundaries (cannot mark or delete other member's notifications).<br>7. Returns default preferences if not yet configured.<br>8. Updates preferences and suppresses in-app notification when toggled off.<br>9. Creates, retrieves, updates, and deletes custom career reminders with user ownership checks.<br>10. Aggregates custom events, application deadlines, and saved opportunities into personal career calendar.<br>11. Dispatches deadline notifications and prevents duplicate dispatches via `DeadlineReminderLog`.<br>12. Safely handles email dispatches and records to dev store without leaking credentials. |
| `tests/unit/smart-matching-and-career-tools.test.ts` | Controlled Skills Catalog, Explainable Match Scores, Eligibility Verification, Skill Gap Market Analytics & Confidential Academic Transcripts | **PASSED** (20/20) | All 20 tests passing. |
| `tests/unit/connections-and-referrals.test.ts` | Member Directory Search, Privacy Filters, Connections Engine & Referrals Dossier | **PASSED** (12/12) | All 12 tests passing. |
| `tests/unit/community.test.ts` | Community Posts, Threaded Comments, Reactions, Bookmarks & Moderation | **PASSED** (22/22) | All 22 tests passing. |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | All 17 tests passing. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | All 14 tests passing. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | All 18 tests passing. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | All 15 tests passing. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | All 8 tests passing. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | All 7 tests passing. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database check passing. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Base parameters passing. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Tokens & contrast passing. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Layout & navigation passing. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 62 App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 11 Verification: Skills and Algorithmic Matching (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (145/145 Passing across 13 Test Files, 0 Failures)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/smart-matching-and-career-tools.test.ts` | Controlled Skills Catalog, Explainable Match Scores, Eligibility Verification, Skill Gap Market Analytics & Confidential Academic Transcripts | **PASSED** (20/20) | 1. Creates controlled skills with categories and retrieves without duplicates.<br>2. Associates skills with member profile and syncs `Profile.skills` string array.<br>3. Removes skills from profile and updates array.<br>4. Accurately calculates skill match percentage: `(Matched / Total) * 100`.<br>5. Handles 0 required skills by returning 100% score with empty lists.<br>6. Applies exact color thresholds (>= 80% green, 50-79% yellow, < 50% red).<br>7. Parses academic year standing correctly.<br>8. Evaluates `ELIGIBLE` when student meets all criteria.<br>9. Evaluates `NOT_ELIGIBLE` when student falls below minimum CGPA.<br>10. Evaluates `NOT_ELIGIBLE` when department is outside target departments.<br>11. Evaluates `NOT_ELIGIBLE` when deadline has passed.<br>12. Evaluates `NEEDS_REVIEW` when profile data is incomplete.<br>13. Identifies missing skills, ranks by campus market demand, and curates learning tracks.<br>14. Calculates cumulative CGPA with exact credit weighting: `Sum(GPA * Credits) / Sum(Credits)`.<br>15. Returns null CGPA when records array is empty or 0 credits.<br>16. Prevents duplicate semesters for the same student (`@@unique([userId, semester])`).<br>17. Automatically syncs `Profile.currentCgpa` on record create, update, and delete.<br>18. Enforces strict academic transcript privacy (students access own, admins access, third-parties blocked with `ACCESS_DENIED`).<br>19. Blocks non-student accounts from career tools via `canAccessStudentTools`.<br>20. Returns ranked recommendations with explainable match scores, checklist reasons, and mandatory disclaimers. |
| `tests/unit/connections-and-referrals.test.ts` | Member Directory Search, Privacy Filters, Connections Engine & Referrals Dossier | **PASSED** (12/12) | Search filters, privacy redaction, connection lifecycle, and referral dossier governance. |
| `tests/unit/community.test.ts` | Community Posts, Threaded Comments, Reactions, Bookmarks & Moderation | **PASSED** (22/22) | Full community suite passing. |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | External tracking, duplicate prevention, withdrawal, self-service dashboard, isolation. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | Browsing, multi-filters, pagination, draft/submit lifecycle, atomic bookmarks, author console. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | Company CRUD, ownership governance, admin approval, deadline expiration, rejection reasons. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | Validates onboarding submission for all 6 membership types, admin approval/rejection with mandatory reason, profile updates, private student ID & phone redaction. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, session persistence, email verification, password reset. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on protected routes and public route access. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Environmental parameters, Next.js configuration, system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 56 App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 10 Verification: Member Directory, Connections & Referrals (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (125/125 Passing across 12 Test Files)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/connections-and-referrals.test.ts` | Member Directory Search, Privacy Filters, Connections Engine & Referrals Dossier | **PASSED** (12/12) | 1. Searches member directory and filters by department, membership type, and skill.<br>2. Enforces strict privacy restrictions in directory output (no studentId or phone).<br>3. Reveals email only if showEmail: true or viewer is platform ADMIN.<br>4. Prevents a member from connecting with themselves.<br>5. Sends a connection request and transitions state to PENDING.<br>6. Prevents duplicate pending connection requests.<br>7. Allows recipient to accept connection and blocks unauthorized responders.<br>8. Allows cancelling outgoing requests and removing existing connections.<br>9. Prevents requesting a referral from oneself.<br>10. Creates referral request and verifies non-guarantee disclaimer.<br>11. Allows recipient to respond (ACCEPTED, COMPLETED, DECLINED) and prevents unauthorized responses.<br>12. Enforces strict server-side access control for referral dossier (assertCanAccessReferral). |
| `tests/unit/community.test.ts` | Community Posts, Threaded Comments, Reactions, Bookmarks & Moderation | **PASSED** (22/22) | Full community suite passing. |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | External tracking, duplicate prevention, withdrawal, self-service dashboard, isolation. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | Browsing, multi-filters, pagination, draft/submit lifecycle, atomic bookmarks, author console. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | Company CRUD, ownership governance, admin approval, deadline expiration, rejection reasons. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | Validates onboarding submission for all 6 membership types, admin approval/rejection with mandatory reason, profile updates, private student ID & phone redaction. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, session persistence, email verification, password reset. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on protected routes and public route access. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Environmental parameters, Next.js configuration, system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 50 App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 9 Verification: Community Feed, Discussions & Moderation (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (113/113 Passing across 11 Test Files)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/community.test.ts` | Community Posts, Threaded Comments, Reactions, Bookmarks & Moderation | **PASSED** (22/22) | 1. Creates a community post with valid content and type.<br>2. Rejects post creation with content shorter than 10 characters.<br>3. Blocks suspended users from creating community posts.<br>4. Allows post author to edit their own post.<br>5. Prevents unauthorized member from editing another user's post.<br>6. Allows platform admin to edit any post for moderation.<br>7. Adds a top-level comment to a post and increments comments count.<br>8. Adds a nested reply to an existing comment using parentId.<br>9. Allows comment author to edit their own comment.<br>10. Prevents unauthorized users from editing other comments.<br>11. Allows comment deletion and decrements post comments count.<br>12. Adds a reaction (LIKE) to a post and increments count.<br>13. Removes reaction when the same reaction is clicked again.<br>14. Switches reaction type seamlessly (e.g., LIKE to INSIGHTFUL).<br>15. Toggles bookmark on a post and enforces unique constraint.<br>16. Submits a content report for an inappropriate post.<br>17. Prevents duplicate pending reports from the same user on the same post.<br>18. Submits a content report for an inappropriate comment.<br>19. Filters community feed by PostType (QUESTION).<br>20. Filters community feed by keyword search and pagination.<br>21. Retrieves single post by ID with reactions and bookmarks context.<br>22. Author successfully deletes their post and cascades. |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | External tracking, duplicate prevention, withdrawal, self-service dashboard, isolation. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | Browsing, multi-filters, pagination, draft/submit lifecycle, atomic bookmarks, author console. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | Company CRUD, ownership governance, admin approval, deadline expiration, rejection reasons. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | Validates onboarding submission for all 6 membership types, admin approval/rejection with mandatory reason, profile updates, private student ID & phone redaction. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, session persistence, email verification, password reset. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on protected routes and public route access. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Environmental parameters, Next.js configuration, system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 46 static and dynamic App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 8 Verification: Applications and Applicant Management (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (91/91 Passing across 10 Test Files)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/applications.test.ts` | Applications & External Portal Tracking | **PASSED** (17/17) | 1. Verifies pre-application eligibility and guidelines.<br>2. Verifies department eligibility checks.<br>3. Verifies advisory CGPA warnings when below cutoff.<br>4. Prevents application submission past opportunity deadline.<br>5. Prevents application submission to closed opportunities.<br>6. Prevents application submission to rejected opportunities.<br>7. Records application tracking with external company portal link.<br>8. Prevents duplicate application tracking via database composite constraint.<br>9. Records tracking metadata and timestamp.<br>10. Allows applicant to retrieve their own application list.<br>11. Allows applicant to delete or remove their tracked application.<br>12. Prevents non-owner members from accessing another user's applications.<br>13. Isolates community lead posters from viewing private applicant records.<br>14. Rejects unauthenticated application tracking requests with 401.<br>15. Enforces rate limits on application submissions.<br>16. Sanitizes external destination URLs against open redirect vulnerabilities.<br>17. Protects applicant confidentiality across all community views. |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | Browsing, multi-filters, pagination, draft/submit lifecycle, atomic bookmarks, author console. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | Company CRUD, ownership governance, admin approval, deadline expiration, rejection reasons. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | Validates onboarding submission for all 6 membership types, admin approval/rejection with mandatory reason, profile updates, private student ID & phone redaction. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, session persistence, email verification, password reset. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on protected routes and public route access. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Environmental parameters, Next.js configuration, system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 44 static and dynamic App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 7 Verification: Job Browsing, Searching, and Posting Interfaces (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL 16
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (74/74 Passing across 9 Test Files)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | 1. Filters opportunities by role type.<br>2. Filters opportunities by workplace mode.<br>3. Searches opportunities by keyword query matching title or skills.<br>4. Filters opportunities by department including openToAllDepartments.<br>5. Filters opportunities by maximum acceptable minimum CGPA.<br>6. Validates and parses query parameters through opportunityFilterSchema.<br>7. Bookmarks an opportunity for an authenticated member.<br>8. Removes a bookmark when toggled again.<br>9. Decorates query results with isBookmarked = true for active user.<br>10. Retrieves user bookmarked opportunities with pagination.<br>11. Retrieves opportunities authored by user with status counts.<br>12. Filters authored opportunities by status.<br>13. Retrieves full opportunity specifications with poster and company details.<br>14. Retrieves related opportunities by target department or role type. |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | Company CRUD, ownership governance, admin approval, deadline expiration, rejection reasons. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | Validates onboarding submission for all 6 membership types, admin approval/rejection with mandatory reason, profile updates, private student ID & phone redaction. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, session persistence, email verification, password reset. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on protected routes and public route access. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Environmental parameters, Next.js configuration, system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 41 static and dynamic App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 6 Verification: Companies, Opportunities, and Approval System (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (60/60 Passing across 8 Test Files)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/companies-and-opportunities.test.ts` | Company Management, Opportunity Lifecycle, Moderation & Permissions | **PASSED** (18/18) | 1. Creates company and assigns creator as OWNER.<br>2. Allows company manager to update company info.<br>3. Blocks unauthorized members from updating unmanaged companies.<br>4. Adds company members with custom permissions.<br>5. Blocks unverified users from creating opportunities.<br>6. Rejects official employer opportunities without verified company membership.<br>7. Allows authorized company member to create official employer opportunities.<br>8. Allows verified student/alumni to share community opportunities.<br>9. Enforces future deadline requirement.<br>10. Enforces external URL when application method is EXTERNAL.<br>11. Prevents unapproved opportunities from public discovery.<br>12. Allows platform admin to approve pending opportunities with reviewer attribution.<br>13. Requires rejection reason when admin rejects opportunities.<br>14. Prevents unauthorized users from modifying opportunities.<br>15. Allows author to update their draft opportunity.<br>16. Allows author to close their opportunity.<br>17. Automatically expires overdue opportunities.<br>18. Filters department-targeted and open-to-all opportunities correctly. |
| `tests/unit/membership-and-profiles.test.ts` | Membership Verification & Profile Privacy | **PASSED** (15/15) | Validates onboarding submission for all 6 membership types, admin approval/rejection with mandatory reason, profile updates, private student ID & phone redaction for other members, showEmail toggle privacy, and server-side posting clearance checks. |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, invalid password rejection, session persistence in PostgreSQL, email verification token issuance & redemption, and password reset cycle. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on protected routes and public route access. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Verifies environmental parameters, Next.js configuration, and basic system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Verifies token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Verifies template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 37 static and dynamic App Router routes compiled cleanly with active `ƒ Proxy (Middleware)`. |

---

## Stage 5 Verification: Membership Verification & User Profiles (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (42/42 Passing across 7 Test Files)**

---

## Stage 4 Verification: Authentication & Account Security (2026-11-05)

- **Date**: 2026-11-05
- **Environment**: macOS / Node.js v22.21.1 / Next.js 16.4.3 / Neon PostgreSQL
- **Test Engine**: Vitest v5.0.5 + TypeScript 5
- **Status**: **ALL TESTS PASSED (27/27 Passing)**

| Test Suite / File | Scope | Status | Details |
| :--- | :--- | :---: | :--- |
| `tests/unit/auth.test.ts` | Registration, Password Hashing, Role Separation | **PASSED** (8/8) | Validates scrypt hashing (>60 chars, non-plaintext), `membershipType` vs `systemRole` separation, duplicate email rejection, invalid password rejection, session persistence in PostgreSQL, email verification token issuance & redemption, and password reset cycle. |
| `tests/unit/middleware.test.ts` | Server Route Protection & Proxy Gate | **PASSED** (7/7) | Verifies 307 redirects for unauthenticated requests on `/dashboard`, `/opportunities/post?type=internship`, `/community`, `/referrals`, `/admin`; verifies public access to `/`, `/about`, `/terms`, `/privacy`, `/login`, `/register`; verifies authenticated redirect away from `/login`. |
| `tests/unit/database.test.ts` | Neon PostgreSQL Driver Adapter Connection | **PASSED** (1/1) | Real database connection check via `SELECT 1` on pooled connection. |
| `tests/unit/foundation.test.ts` | Base Architecture & Config | **PASSED** (5/5) | Verifies environmental parameters, Next.js configuration, and basic system integrity. |
| `tests/unit/design-system.test.ts` | Design Token System & WCAG Contrast | **PASSED** (2/2) | Verifies token definitions and theme contrast constraints. |
| `tests/unit/navigation-layout.test.ts` | Template Components & Nav Items | **PASSED** (4/4) | Verifies template structures and sidebar items. |
| **Type Check** (`npm run type-check`) | TypeScript Compilation | **PASSED** | 0 TypeScript errors (`tsc --noEmit`). |
| **Production Build** (`npm run build`) | Turbopack Production Build | **PASSED** | All 27 static and dynamic routes compiled in 513ms with active `ƒ Proxy (Middleware)`. |

---

## Baseline Verification (Project Setup Stage)

- **Date**: Baseline (2026-10-30)
- **Environment**: macOS / Node.js v22.17.1
- **Status**: Initialized
