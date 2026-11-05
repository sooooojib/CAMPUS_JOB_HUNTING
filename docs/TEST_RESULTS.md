# UniCareer Community — Test Execution Results

> This log records actual automated and manual test runs across project stages. Never fabricate test results.

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
| `tests/unit/applications.test.ts` | Applications, Resume Vault & Recruiter Management | **PASSED** (17/17) | Magic bytes inspection, size limits, duplicate prevention, external tracking, withdrawal, recruiter review. |
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
| `tests/unit/applications.test.ts` | Applications, Resume Vault & Recruiter Management | **PASSED** (17/17) | Magic bytes inspection, size limits, duplicate prevention, external tracking, withdrawal, recruiter review. |
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
| `tests/unit/applications.test.ts` | Applications, Resume Vault & Recruiter Management | **PASSED** (17/17) | 1. Accepts valid PDF with `%PDF-` header magic bytes.<br>2. Accepts valid DOCX with `PK\x03\x04` zip header magic bytes.<br>3. Rejects executable/spoofed file attempting to disguise as PDF.<br>4. Rejects resume exceeding 5MB size limit.<br>5. Stores resume securely on disk and records database metadata.<br>6. Verifies eligibility and returns CGPA advisory warning when CGPA is below cutoff.<br>7. Prevents application submission past opportunity deadline.<br>8. Prevents application submission to closed opportunities.<br>9. Submits internal application with selected resume and cover letter.<br>10. Prevents duplicate internal application submission via database constraint.<br>11. Records external application with metadata.<br>12. Allows applicant to retrieve their own applications list.<br>13. Allows applicant to withdraw their application with audit history.<br>14. Prevents non-employer community poster from managing applicants (403 Forbidden).<br>15. Allows authorized company representative to list applicants.<br>16. Allows authorized company representative to update applicant status with notes.<br>17. Protects resume binary downloads with anti-IDOR authorization. |
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
| `tests/unit/job-browsing-and-posting.test.ts` | Opportunity Discovery, Multi-Filter Search, Submission & Bookmarks | **PASSED** (14/14) | 1. Browsing endpoint returns approved opportunities with active deadlines.<br>2. Keyword search filters by title, description, or target company.<br>3. Filters opportunities accurately by OpportunityType (INTERNSHIP, FULL_TIME).<br>4. Filters opportunities accurately by WorkplaceType (REMOTE, HYBRID, ONSITE).<br>5. Filters opportunities accurately by SourceType (OFFICIAL_EMPLOYER, COMMUNITY_SHARED).<br>6. Filters opportunities by Department including open-to-all listings.<br>7. Filters opportunities by minimum CGPA cutoff.<br>8. Respects pagination parameters (page, limit).<br>9. Opportunity submission requires authenticated member with posting clearance.<br>10. OFFICIAL_EMPLOYER opportunity requires user to be an authorized company manager.<br>11. Creates draft and transitions to PENDING review on submit.<br>12. Bookmark toggle adds and removes opportunity from user saved list.<br>13. Prevents duplicate bookmark creation via database unique constraint.<br>14. My Opportunities API retrieves author's postings with status breakdown. |
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
