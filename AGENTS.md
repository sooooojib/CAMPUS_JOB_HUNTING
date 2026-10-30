# UniCareer Community — Master Project Development Guidelines

> **Permanent Project Guidelines**: This document serves as the permanent development standard and architecture reference for the UniCareer Community project. All agents and contributors must strictly adhere to these rules throughout development across all stages.

---

# 1. Project Overview

- **Project Name**: UniCareer Community
- **Project Type**: Private university-connected career and job-seeking community platform.
- **Target Audience**:
  - Current university students.
  - University alumni.
  - Faculty and university staff.
  - Recruiters and employers connected to the university.
  - Approved external individuals with a genuine, verified connection to the university.
- **Platform Synergy**:
  1. A curated job and internship portal.
  2. A university-connected professional community feed and discussions.
  3. An alumni and member networking directory.
  4. A high-trust referral and career-support system.
  5. A personalized career development toolkit.
- **Core Principle**: This is **NOT** a generic public job board, nor is it exclusively for students. It facilitates trusted career connections, referrals, and opportunities within the university ecosystem.

---

# 2. Non-Negotiable Business Rules

## Account & Authentication
- **Mandatory Authentication**: Unauthenticated visitors cannot browse job listings, view full job descriptions, search opportunities, access the community, or use member features.
- **Public Routes Only**: Landing/marketing page, login, registration, password recovery, and email verification.
- **Email Verification**: Required before gaining access to member functionality.
- **Post-Login Redirection**: Return users to their originally requested URL after successful authentication.

## Membership Types & Verification
- **Supported Membership Types**:
  - `STUDENT`
  - `ALUMNI`
  - `FACULTY`
  - `STAFF`
  - `EMPLOYER`
  - `EXTERNAL_CONNECTION`
- **Verification Statuses**:
  - `PENDING`
  - `VERIFIED`
  - `REJECTED`
  - `SUSPENDED`
- **Verification Process**:
  - Students and alumni can be validated against official university records.
  - External connections must demonstrate an authentic institutional relationship, requiring admin approval or an approved invitation/referral.
- **Single Account Architecture**: Do NOT create separate authentication systems for different roles. A single unified account model manages membership types, verification statuses, and capabilities. A verified member can both apply for jobs and submit opportunities when authorized.

## Opportunities & Moderation
- **Opportunity Types**:
  - `INTERNSHIP`
  - `FULL_TIME`
  - `PART_TIME`
  - `CONTRACT`
  - `OTHER`
- **Opportunity Classifications**:
  - `OFFICIAL_EMPLOYER`: Submitted by an authorized representative of the hiring company.
  - `COMMUNITY_SHARED`: Shared by a verified community member (lead/referral); must visibly clarify that the poster is sharing an opportunity and may not represent the employer.
- **Lifecycle & Statuses**:
  - `DRAFT`
  - `PENDING` (Admin review required before becoming public to members)
  - `APPROVED` (Visible in feeds and search)
  - `REJECTED`
  - `EXPIRED`
  - `CLOSED`
- **Employer Rights**: Only authorized employers can manage applicants submitted to their postings.

## Applications
- **Methods**: Internal direct applications and external application links.
- **Components**: Resume upload (PDF/DOCX), optional cover letter, customized questions where configured.
- **Integrity**: Duplicate application prevention, applicant withdrawal capability, automatic deadline closure.
- **Privacy**: Resumes and candidate data must be stored in private storage with time-limited signed URLs. Never expose candidate records publicly.

## Community Features
- Community feed, job announcements, career discussions, referral requests, member profiles, threaded comments/replies, reactions, post saving, reporting/moderation, member directory, and connection requests.
- *(Note: Private messaging and advanced events are deferred to later stages).*

## University Career Tools (Verified Student Profiles)
- CGPA eligibility checker, skill matching, personalized job recommendations, skill gap analysis, resume version management, deadline tracking, and career readiness progress.
- Non-student profiles must not see academic/CGPA tooling.

---

# 3. Technology Stack

- **Framework**: Next.js (App Router, Server Components, Route Handlers, Server Actions)
- **Frontend**: React 19, TypeScript (Strict, no implicit `any`)
- **Styling**: Tailwind CSS, shadcn/ui, Lucide React
- **Database**: PostgreSQL with Prisma ORM
- **Forms & Validation**: React Hook Form with Zod (mirrored client & server validation)
- **Authentication**: Either Auth.js or Better Auth (evaluate compatibility during project setup; do not install both)
- **Visualizations**: Recharts
- **Testing**: Playwright (E2E browser testing), Vitest (unit/integration testing)
- **Strict Prohibition**: No PHP, no extraneous frameworks, no unapproved database clients.

---

# 4. Code Architecture & Standards

- **Separation of Concerns**:
  - UI Presentation (`components/`, `app/`)
  - Server actions & route handlers (`app/api/`, server actions)
  - Business logic services (`services/` or `lib/services/`)
  - Database access & ORM (`lib/prisma.ts`, `prisma/`)
  - Validation schemas (`lib/validations/`)
  - Authentication & permissions (`lib/auth/`, `lib/permissions.ts`)
  - Shared types & utils (`types/`, `lib/utils.ts`)
- **Zero Fake Data**: Never use hardcoded mock data as a substitute for real backend functionality.
- **Server Enforcement**: All permission, membership, and role checks must be executed on the server. Never rely on frontend UI hiding alone.

---

# 5. Design & UI/UX Standards

- **Color System**: Professional blue-based palette with neutral slates/grays and high-contrast accents:
  - Primary: Deep University Navy / Royal Blue
  - Neutral Dark: Slate `#0F172A`
  - Neutral Light: Paper / Off-white `#F8FAFC`
  - Surface: Pure White `#FFFFFF` / Slate `#1E293B` (Dark Mode)
- **Themes**: Full support for Light mode, Dark mode, and System preference.
- **State Completeness**: Every view must handle Loading (skeletons), Empty, Error, and Success states without layout shifts.
- **Functional Integrity**: No dead buttons or non-functional mock links. Every control must trigger an action or display an explicit disabled state.
- **Accessibility**: Full keyboard navigation, visible focus rings, ARIA attributes, WCAG 2.1 AA color contrast.

---

# 6. Documentation Requirements

A living documentation system must be maintained in the `docs/` folder:
- `AGENTS.md` (this file)
- `docs/PROJECT_OVERVIEW.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/USER_ROLES_AND_PERMISSIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/ROUTES_AND_PAGES.md`
- `docs/API_REFERENCE.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `docs/TEST_PLAN.md`
- `docs/TEST_RESULTS.md`
- `docs/DECISIONS.md`
- `docs/PROGRESS.md`
- `docs/CHANGELOG.md`
- `docs/stages/` (stage-by-stage implementation logs)

After **EVERY** development stage:
1. Create a stage document in `docs/stages/`.
2. List all files created and modified.
3. Document architectural, database, routing, and security changes.
4. Record tests performed and actual results.
5. Record limitations and remaining items.
6. Update `docs/PROGRESS.md` and `docs/CHANGELOG.md`.

---

# 7. Development & Stage Control

- Work strictly **one stage at a time** as defined by the user's stage prompts.
- Complete only the requested stage scope; do not pre-emptively start future stages.
- Inspect before changing; preserve existing working functionality.
- At the end of the stage, deliver the Stage Completion Report and stop. Wait for the next prompt.

---

# 8. Stage Completion Report Format

At the conclusion of each stage, output the standard report:
1. **Stage Name**
2. **Status**: `COMPLETE` | `PARTIALLY COMPLETE` | `BLOCKED`
3. **What was completed**
4. **Files created**
5. **Files modified**
6. **Database changes**
7. **Pages and routes implemented**
8. **Tests executed and actual test results**
9. **Known issues or limitations**
10. **Manual setup requirements (e.g. environment variables)**
11. **Documentation updated**
12. **Scope compliance confirmation**

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
