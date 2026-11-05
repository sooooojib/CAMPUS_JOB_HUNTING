# UniCareer Community — Development Roadmap & Stage Dependency Matrix

## 1. Stage Dependency Graph

```mermaid
flowchart TD
    S0["Stage 0: Inspection & Planning"] --> S1["Stage 1: Foundation & Architecture"]
    S1 --> S2["Stage 2: Complete UI/UX Design System"]
    S2 --> S3["Stage 3: Website Layout & Navigation (Current)"]
    S3 --> S4["Stage 4: Authentication Engine & Verification"]
    S4 --> S5["Stage 5: Opportunity Portal & Review Engine"]
    S4 --> S6["Stage 6: Applications & Resume Vault"]
    S5 & S6 --> S7["Stage 7: Community Feed & Member Networking"]
    S6 --> S8["Stage 8: Student Career Tools (CGPA / Skills)"]
    S7 & S8 --> S9["Stage 9: Referrals & Notification Pipeline"]
    S4 & S5 & S6 & S7 & S8 & S9 --> S10["Stage 10: Admin Governance & Moderation"]
    S10 --> S11["Stage 11: End-to-End QA, Security & Deployment"]
```

---

## 2. Stage Execution Log & Milestones

### Stage 0: Project Inspection & Planning
- **Status**: **COMPLETE** (2026-10-30)
- **Prerequisites**: None.
- **Core Deliverables Delivered**:
  - Environmental inspection and package stack verification.
  - 13 development skills installed and configured.
  - Git repository initialized.
  - 27-entity relational database ERD and comprehensive architectural contracts.
  - Complete living documentation system created in `docs/`.

### Stage 1: Project Foundation & Architecture
- **Status**: **COMPLETE** (2026-10-30)
- **Prerequisites**: Stage 0.
- **Core Deliverables Delivered**:
  - Next.js 16.4.3 (App Router) + React 19.3.0 + TypeScript 5.
  - Tailwind CSS v4 with `@tailwindcss/turbopack` and shadcn/ui components integration.
  - OKLCH University Navy / Royal Blue color tokens with Light, Dark, and System theme switching.
  - Shell layout with `AppNavbar`, `AppFooter`, `ThemeToggle`, `ErrorBoundary`, `GlobalError`, and `NotFound` pages.
  - Database connectivity established with PostgreSQL 16 via Prisma 7 & `@prisma/adapter-pg`.
  - Development and test scripts configured (`dev`, `build`, `start`, `lint`, `type-check`, `test`, `db:seed`, `db:generate`).
  - Unit tests verified using Vitest (5/5 passing).

### Stage 2: Complete UI/UX Design System
- **Status**: **COMPLETE** (2026-10-30)
- **Prerequisites**: Stage 1.
- **Core Deliverables Delivered**:
  - Full design tokens, OKLCH palette, Inter typography scale, and WCAG 2.1 AA contrast in `app/globals.css`.
  - Light, Dark, and System theme persistence with zero-cascading-render `ThemeToggle`.
  - 17 reusable UI primitives in `components/ui/` (buttons, forms, badges, dialogs, tables, tabs, toasts, skeletons).
  - 3 feedback micro-UIs in `components/feedback/` (`EmptyState`, `ErrorBanner`, `ConfirmDialog`).
  - 8 Opportunity domain components in `components/opportunities/` (`JobCard`, `CompanyCard`, `EmployerBadge`, `VerifiedBadge`, `MatchScoreIndicator`, `DeadlineIndicator`, `ApplicationStatusBadge`, `ApplicantSummaryCard`).
  - 7 Community domain components in `components/community/` (`CreatePostBox`, `FeedPostCard`, `ReactionButtons`, `MemberProfileCard`, `ConnectionButton`, `ReferralCard`, `CommentThread`).
  - Interactive Design System demonstration page at `/design-system`.
  - Automated component unit tests (7/7 passing).

### Stage 3: Website Layout & Navigation
- **Status**: **COMPLETE** (2026-10-30)
- **Prerequisites**: Stage 2.
- **Core Deliverables Delivered**:
  - **Shared Authenticated Shell**: Responsive desktop sidebar (`AppSidebar`), sticky header (`AppHeader`) with global search and notification drawer, and mobile bottom bar + off-canvas drawer (`MobileNav`).
  - **Public Gated Entry Layout**: `app/(public)/layout.tsx` wrapping welcome landing (`/`), mission background (`/about`), terms of service (`/terms`), and student data privacy statement (`/privacy`). Zero public leakage of member directories or job details.
  - **Distraction-Free Auth Shell**: `app/(auth)/layout.tsx` wrapping member login (`/login`), verified registration (`/register`), and password recovery (`/forgot-password`).
  - **6 Reusable Page Templates**: `DashboardTemplate`, `ListingTemplate`, `DetailsTemplate`, `FormTemplate`, `ProfileTemplate`, `AdminTemplate`.
  - **Authenticated Domain Views**: Full page implementations for `/dashboard`, `/feed`, `/opportunities`, `/opportunities/[id]`, `/opportunities/post`, `/community`, `/referrals`, `/applications`, `/career-tools`, `/contributions`, `/profile/me`, `/settings`, `/notifications`, `/admin`.
  - **Added UI Primitives**: `Label` and `Progress` components.
  - **Unit Testing**: Vitest test suite expanded to 11 passing tests.
  - **Production Build**: 24/24 static and partial prerendered routes compiled with Turbopack. Zero TypeScript or ESLint errors.

### Stage 4: Authentication Engine, Accounts & Verification
- **Status**: **COMPLETE** (2026-11-05)
- **Prerequisites**: Stage 3.
- **Core Deliverables Delivered**:
  - **Selected Authentication Core**: Better Auth 1.7.17 configured with Prisma 7 adapter (`@prisma/adapter-pg`) on PostgreSQL 16.
  - **Account Data Models (`prisma/schema.prisma`)**: `users`, `sessions`, `accounts`, `verifications` tables synced to PostgreSQL.
  - **Role & Membership Separation**: `membershipType` (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`) kept completely separate from `systemRole` (`MEMBER`, `MODERATOR`, `ADMIN`).
  - **Password Security**: Scrypt salted/hashed password storage in `accounts` table. Plaintext passwords never stored.
  - **Email Verification Pipeline**: Cryptographic verification token generation, token dispatch via development logger store (`lib/email.ts`), automated redemption at `/verify-email`.
  - **Password Reset Pipeline**: 30-minute cryptographic recovery token issuance and single-use password update at `/reset-password`.
  - **Two-Layer Route Protection**:
    - Network Edge Proxy (`proxy.ts`): 307 temporary redirects for unauthenticated requests on protected routes with preserved `callbackUrl`.
    - Server Component Layout Guard (`app/(dashboard)/layout.tsx`): Authenticates session against PostgreSQL, enforces account active status (`SUSPENDED`/`DEACTIVATED` rejection).
  - **Polished Authentication UX**: Fully functional client forms for Login, Multi-Role Registration, Forgot Password, Reset Password, and Email Verification with loading spinners and accessible error states.
  - **Interactive User Menu**: Integrated live session display with working `signOut()` action.
  - **Automated Testing**: 27/27 Vitest unit and integration tests passing. Clean Next.js 16 production build.

### Stage 5: Membership Verification & User Profiles Engine
- **Status**: **COMPLETE** (2026-11-05)
- **Prerequisites**: Stage 4.
- **Core Deliverables Delivered**:
  - **Decoupled Identity Models (`prisma/schema.prisma`)**: Integrated `Profile` and `MembershipRequest` models into PostgreSQL. Retained strict separation between institutional `MembershipType` and platform `SystemRole`.
  - **Role-Tailored Onboarding Flow (`/onboarding`)**: Dynamic multi-step onboarding tailored to `STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, and `EXTERNAL_CONNECTION` with instant validation and database submission.
  - **Verification Review & Admin Center (`/admin`)**: Fully functional administrative verification management interface displaying applicant claims and evidence with live Approve and Reject with mandatory reason workflows.
  - **Resubmission & Historical Audit**: Rejection reasons displayed clearly to members with one-click resubmission modal and multi-attempt historical tracking in `membership_requests`.
  - **Profile System & In-Place Editing (`/profile/me`)**: Live database-connected member profile with status badges, institutional dossier, skills, experience, projects, links, and responsive `EditProfileModal`.
  - **Strict Profile Privacy Redaction (`/profile/[id]`)**: `getPublicProfile` server service redacts sensitive Student IDs, personal phone numbers, and private emails for general community members.
  - **Server-Enforced Opportunity Posting Clearance (`lib/permissions.ts`)**: `canPostOpportunity` and `assertCanPostOpportunity` guarantee that unverified members cannot publish opportunities by altering frontend state.
  - **Automated Testing**: 42/42 Vitest unit and integration tests passing. Clean Next.js 16 production build.

---

## 3. Next Stage Preview

### Stage 6: Opportunity Portal & Review Engine
- **Status**: Planned (Next)
- **Prerequisites**: Stage 5.
- **Core Deliverables**:
  - Opportunity lifecycle management (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`, `CLOSED`).
  - Opportunity provenance classification (`OFFICIAL_EMPLOYER` vs `COMMUNITY_SHARED`).
  - Opportunity creation forms with department and skill tagging.
  - Admin moderation queue and approval/rejection workflows.
  - Filterable career opportunities directory and detailed view.
