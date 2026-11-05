# Stage 8 Implementation Report: Applications and Applicant Management

## 1. Stage Overview
- **Stage Name**: Stage 8 — Applications and Applicant Management
- **Status**: `COMPLETE`
- **Scope**: Build the complete application system for internal job applications and employer applicant management. Implement application database models with duplicate prevention, dual application methods (`INTERNAL` and `EXTERNAL`), private resume storage with magic-bytes inspection, pre-flight eligibility checking, candidate dashboard with withdrawal capability, and employer applicant management with status transitions, notes, and audit history.
- **Strict Scope Boundaries**:
  - Do NOT implement the community feed or career discussions.
  - Do NOT implement referrals or mentor networking.
  - Do NOT implement smart matching or career tools (CGPA analysis tools).
  - Do NOT implement private messaging.

---

## 2. What Was Completed

### 2.1 Task 1: Application Database Models
- Created `Application`, `Resume`, and `ApplicationStatusHistory` models in `prisma/schema.prisma`.
- Prevented duplicate applications at the database engine level via composite unique index:
  ```prisma
  @@unique([opportunityId, applicantId])
  ```
- Added `ApplicationStatus` enum with 7 granular states:
  - `SUBMITTED`: Candidate has submitted application.
  - `UNDER_REVIEW`: Recruiter or hiring manager is reviewing dossier.
  - `SHORTLISTED`: Candidate advanced to candidate shortlist.
  - `INTERVIEW`: Candidate invited for interview/assessment.
  - `SELECTED`: Candidate selected for offer or hiring.
  - `REJECTED`: Candidate not selected.
  - `WITHDRAWN`: Candidate voluntarily retracted application.
- Added `ApplicationStatusHistory` model tracking complete transition lifecycle with `fromStatus`, `toStatus`, `changedById`, `notes`, and `createdAt`.
- Added `Resume` model tracking private disk storage key, original filename, MIME type, file size, default flag, and relations to user and applications.
- Synchronized schema to Neon PostgreSQL with `npm run db:push` and regenerated Prisma Client with `npm run db:generate`.

### 2.2 Task 2: Application Methods
- **INTERNAL_APPLICATION**:
  - Applied directly through UniCareer using candidate's uploaded resume from vault or on-the-fly file upload.
  - Includes optional cover letter (up to 3,000 characters).
  - Creates active application record, status history entry, and notifies recruiter.
- **EXTERNAL_APPLICATION**:
  - Handled via `ExternalApplyDialog` with clear warning modal explaining the candidate will be redirected to an external third-party corporate careers site.
  - Explicitly informs candidates that external portals are independent and not automatically synchronized.
  - Permits members to manually record their external application to track status in their personal applications dashboard (`/applications`).

### 2.3 Task 3: Secure Resume Management
- Private disk storage vault located at `storage/resumes/` outside of the public web directory (`public/`).
- **Binary Magic-Bytes Inspection**: Implemented `inspectFileMagicBytes` in `lib/validations/application.ts`. Never trusts browser MIME types or file extensions:
  - Inspects initial buffer bytes for `%PDF-` (`0x25 0x50 0x44 0x46`) for PDF documents.
  - Inspects initial buffer bytes for `PK\x03\x04` (`0x50 0x4B 0x03 0x04`) for DOCX (Office Open XML ZIP packages).
  - Rejects spoofed or malicious executables disguised with fake `.pdf` or `.docx` extensions.
- **Size Validation**: Enforces maximum file size of 5 MB.
- **Anti-IDOR Authorization Gate**: `/api/resumes/[id]/download` uses `assertCanAccessResume` in `lib/services/resume.ts`:
  - Candidate owner can download their own resume.
  - Platform administrator can inspect any resume for moderation.
  - Authorized employer can only download resumes attached to applications submitted to opportunities belonging to their managed company.
  - Unauthorized third parties are denied access with HTTP 403 Forbidden.
- **Resume Vault API**:
  - `GET /api/resumes`: Retrieve authenticated user's resumes.
  - `POST /api/resumes`: Upload new resume with magic-bytes verification.
  - `DELETE /api/resumes/[id]`: Secure deletion from disk and database.

### 2.4 Task 4: Application Submission Workflow
- **Pre-Flight Eligibility Checking** (`GET /api/opportunities/[id]/eligibility`):
  - Checks if user already applied (returning existing application state).
  - Checks opportunity deadline: rejects application if deadline has expired.
  - Checks opportunity status: rejects application if opportunity is closed, draft, or pending.
  - Checks department eligibility: validates candidate profile against target departments or open-to-all flag.
  - Evaluates CGPA threshold: provides advisory warning to candidate if their profile CGPA is below the minimum required, allowing them to proceed with awareness.
- **Interactive Multi-Step Modal (`ApplyModal`)**:
  - Step 1: Pre-flight eligibility review & CGPA advisory check.
  - Step 2: Resume selection from vault or new file upload with drag-and-drop.
  - Step 3: Optional cover letter input.
  - Step 4: Submission review and confirmation.
  - Step 5: Success state with direct navigation link to `/applications`.

### 2.5 Task 5: Candidate Applications Dashboard (`/applications`)
- Replaced the mockup placeholder with live `MyApplicationsView` (`components/applications/my-applications-view.tsx`).
- Renders user's applications grouped by status tabs: `ALL`, `SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`.
- Search by opportunity title or company name.
- Application card showing:
  - Job title, company logo, opportunity type, and workplace mode.
  - Real-time status badge with color coding (`ApplicationStatusBadge`).
  - Applied date, application method badge (`INTERNAL` vs `EXTERNAL`).
  - Submitted resume download button.
  - "View Details" modal showing full application dossier, submitted cover letter, and complete status history timeline.
  - "Withdraw" button with confirmation modal (active applications can be retracted by candidate at any time).

### 2.6 Task 6: Employer Applicant Management Console (`/opportunities/[id]/applicants`)
- Created `EmployerApplicantManager` (`components/applications/employer-applicant-manager.tsx`) and protected server page `app/(dashboard)/opportunities/[id]/applicants/page.tsx`.
- **Server-Side Clearance**: `assertCanManageApplicantsForOpportunity` strictly enforces that only verified employers managing the associated company or platform admins can access candidate data.
- **Community Poster Strict Isolation**: Community members who shared a lead (`COMMUNITY_SHARED`) are explicitly blocked with HTTP 403 Forbidden.
- Recruiter capabilities:
  - Metrics banner: Total applicants, under review, shortlisted, interview, selected, and rejected counts.
  - Search applicants by candidate name, email, department, or skills.
  - Filter applicants by status.
  - Candidate profile view: Name, avatar, membership badge, department, academic year, CGPA, graduation year, skills list.
  - Direct secure resume download button.
  - Interactive "Update Status" dialog: change candidate status, add transition notes, and save private internal recruiter notes.
  - Complete status transition history timeline for each applicant.

### 2.7 Task 7: Authorization & Server-Side Security
- All checks executed on the server before database queries or file access:
  - `assertCanManageApplicantsForOpportunity(userId, opportunityId)`: Verifies company association or admin role.
  - `assertCanAccessResume(userId, resumeId)`: Verifies owner, authorized reviewer, or admin.
  - `checkApplicationEligibility(userId, opportunityId)`: Enforces deadline, status, and duplicate prevention.
  - Database composite unique index prevents race conditions on duplicate submissions.

### 2.8 Task 8: Automated Testing
- Created `tests/unit/applications.test.ts` with 17 exhaustive unit and integration tests.
- All 17 tests passed in Vitest.
- Total test suite expanded to **91 tests passing across 10 test files**.
- Zero TypeScript errors (`npm run type-check`).
- Next.js Turbopack production build compiled 44 routes cleanly.

---

## 3. Files Created and Modified

### Files Created:
1. `lib/validations/application.ts` — Zod schemas and magic-bytes inspection (`inspectFileMagicBytes`).
2. `lib/services/resume.ts` — Secure disk storage service, magic-bytes checks, and anti-IDOR authorization.
3. `lib/services/application.ts` — Application lifecycle service, eligibility checking, submissions, and status transitions.
4. `app/api/resumes/route.ts` — Resume vault list and upload endpoint.
5. `app/api/resumes/[id]/route.ts` — Resume deletion endpoint.
6. `app/api/resumes/[id]/download/route.ts` — Anti-IDOR protected binary download endpoint.
7. `app/api/applications/route.ts` — Candidate applications list and submission endpoint.
8. `app/api/applications/[id]/route.ts` — Application dossier detail endpoint.
9. `app/api/applications/[id]/withdraw/route.ts` — Candidate application withdrawal endpoint.
10. `app/api/opportunities/[id]/eligibility/route.ts` — Pre-flight eligibility check endpoint.
11. `app/api/opportunities/[id]/applicants/route.ts` — Employer candidate pipeline retrieval endpoint.
12. `app/api/opportunities/[id]/applicants/[applicationId]/status/route.ts` — Employer status update endpoint.
13. `components/applications/apply-modal.tsx` — Multi-step internal application modal with CGPA warning and resume selector.
14. `components/applications/external-apply-dialog.tsx` — External portal redirect disclaimer and manual tracking dialog.
15. `components/applications/my-applications-view.tsx` — Candidate applications dashboard.
16. `components/applications/employer-applicant-manager.tsx` — Recruiter applicant management console.
17. `app/(dashboard)/opportunities/[id]/applicants/page.tsx` — Server-protected recruiter management page.
18. `tests/unit/applications.test.ts` — 17 unit and integration tests.
19. `docs/stages/STAGE-08.md` — This stage implementation report.

### Files Modified:
1. `prisma/schema.prisma` — Added `Application`, `Resume`, `ApplicationStatusHistory`, and `ApplicationStatus` enum.
2. `types/index.ts` — Updated `ApplicationStatus` enum to include `INTERVIEW` and `SELECTED`.
3. `components/opportunities/application-status-badge.tsx` — Added support for `INTERVIEW` and `SELECTED` badges.
4. `components/opportunities/opportunity-detail-actions.tsx` — Connected `ApplyModal` and `ExternalApplyDialog`, and added "Manage Applicants" button for employers.
5. `components/opportunities/my-opportunities-view.tsx` — Added "Applicants" navigation button for author's official employer postings.
6. `app/(dashboard)/applications/page.tsx` — Overwritten to render `MyApplicationsView`.
7. `app/(dashboard)/opportunities/[id]/page.tsx` — Passed applicant management clearance to action components.
8. `lib/services/opportunity.ts` — Enhanced `getOpportunityById` to include associated company members for permission checks.
9. `.gitignore` — Added `storage/resumes/` to prevent committing candidate resumes.
10. `docs/DATABASE_SCHEMA.md` — Documented `resumes`, `applications`, `application_status_history`, and constraints.
11. `docs/API_REFERENCE.md` — Documented 9 new API endpoints for resumes and applications.
12. `docs/SECURITY_AND_PRIVACY.md` — Documented private resume storage, magic-bytes checks, IDOR safeguards, and duplicate prevention.
13. `docs/USER_ROLES_AND_PERMISSIONS.md` — Documented applicant permissions, employer review rights, and community poster restrictions.
14. `docs/TEST_PLAN.md` — Added Stage 8 test plan.
15. `docs/TEST_RESULTS.md` — Recorded Stage 8 test results (91/91 tests passing).
16. `docs/PROGRESS.md` — Marked Stage 8 as COMPLETE, updated next stage preview.
17. `docs/CHANGELOG.md` — Recorded Stage 8 changes in changelog.

---

## 4. Database Changes
- **Tables Created**:
  - `resumes`: User uploaded resume documents stored in private vault.
  - `applications`: Applications submitted to opportunities with composite unique constraint `@@unique([opportunityId, applicantId])`.
  - `application_status_history`: Audit trail for application status changes.
- **Enums Created**:
  - `ApplicationStatus`: `SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`.
- **Database Engine**: Neon PostgreSQL 16 synchronized using `npx prisma db push`.
- **ORM Client**: Prisma Client regenerated using `npx prisma generate`.

---

## 5. Pages and Routes Implemented
- `GET /applications`: Candidate personal applications dashboard (`MyApplicationsView`).
- `GET /opportunities/[id]/applicants`: Recruiter candidate management console (`EmployerApplicantManager`).
- `GET /api/resumes`: Fetch user resumes from vault.
- `POST /api/resumes`: Upload resume with magic-bytes verification.
- `DELETE /api/resumes/[id]`: Remove resume from vault.
- `GET /api/resumes/[id]/download`: Anti-IDOR protected binary file stream.
- `GET /api/applications`: Fetch user submitted applications with counts.
- `POST /api/applications`: Submit internal or external application.
- `GET /api/applications/[id]`: Fetch application dossier.
- `POST /api/applications/[id]/withdraw`: Retract application with history audit.
- `GET /api/opportunities/[id]/eligibility`: Pre-flight candidate eligibility evaluation.
- `GET /api/opportunities/[id]/applicants`: Candidate pipeline for authorized company managers.
- `POST /api/opportunities/[id]/applicants/[applicationId]/status`: Recruiter status transition with notes.

---

## 6. Tests Executed and Actual Test Results
- **Vitest Unit & Integration Test Suite** (`npm test`):
  - **10 / 10 test files passed (91 / 91 tests passed, 100% success)**.
  - `tests/unit/applications.test.ts` (17 tests):
    1. Accepts valid PDF with `%PDF-` header magic bytes.
    2. Accepts valid DOCX with `PK\x03\x04` zip header magic bytes.
    3. Rejects executable/spoofed file attempting to disguise as PDF.
    4. Rejects resume exceeding 5MB size limit.
    5. Stores resume securely on disk and records database metadata.
    6. Verifies eligibility and returns CGPA advisory warning when CGPA is below cutoff.
    7. Prevents application submission past opportunity deadline.
    8. Prevents application submission to closed opportunities.
    9. Submits internal application with selected resume and cover letter.
    10. Prevents duplicate internal application submission via database constraint.
    11. Records external application with metadata.
    12. Allows applicant to retrieve their own applications list.
    13. Allows applicant to withdraw their application with audit history.
    14. Prevents non-employer community poster from managing applicants (403 Forbidden).
    15. Allows authorized company representative to list applicants.
    16. Allows authorized company representative to update applicant status with notes.
    17. Protects resume binary downloads with anti-IDOR authorization.
- **TypeScript Static Verification** (`npm run type-check`):
  - 0 type errors (`tsc --noEmit`).
- **Production Build** (`npm run build`):
  - Next.js Turbopack compiled 44 routes cleanly.

---

## 7. Known Issues or Limitations
1. **Direct Disk Storage**: Resumes are currently stored on local disk under `storage/resumes/`. When scaling to multi-instance cloud deployments (e.g. AWS ECS / Vercel Serverless), this service can be swapped to S3/GCS or Neon Object Storage with pre-signed URLs without altering any API interfaces.
2. **External Applications**: External applications cannot be automatically synchronized with third-party ATS platforms (Workday, Greenhouse, Lever) without dedicated partner webhook integrations; manual status recording is supported.

---

## 8. Manual Setup Requirements
- Ensure `DATABASE_URL` is set to the Neon PostgreSQL connection string.
- The `storage/resumes/` directory is automatically created on startup by `lib/services/resume.ts`.

---

## 9. Documentation Updated
- `docs/DATABASE_SCHEMA.md`
- `docs/API_REFERENCE.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `docs/USER_ROLES_AND_PERMISSIONS.md`
- `docs/TEST_PLAN.md`
- `docs/TEST_RESULTS.md`
- `docs/PROGRESS.md`
- `docs/CHANGELOG.md`
- `docs/stages/STAGE-08.md` (this file)

---

## 10. Scope Compliance Confirmation
- Application submission, private resume storage, magic-bytes validation, and candidate management are fully implemented.
- No community feed, discussions, referrals, smart matching, or private messaging features were built in this stage, adhering strictly to Stage 8 boundaries.

