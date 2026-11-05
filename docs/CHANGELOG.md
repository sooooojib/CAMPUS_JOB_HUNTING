# UniCareer Community — Project Changelog

All notable changes across development stages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
