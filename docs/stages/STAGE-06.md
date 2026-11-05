# Stage 6 Implementation Report: Companies, Opportunities, and Approval System

## 1. Stage Overview
- **Stage Name**: Stage 6 — Companies, Opportunities, and Approval System
- **Status**: `COMPLETE`
- **Scope**: Build the backend foundation for companies, job opportunities, internships, and the opportunity approval system. This stage focuses on database models, business logic, validation, authorization, and APIs. Maintain strict scope compliance: do not build the complete job browsing or posting frontend yet, do not implement applications, and do not implement the community feed.

---

## 2. What Was Completed

### 2.1 Task 1: Company Management
- **Database Model (`prisma/schema.prisma`)**:
  - Implemented `Company` model with `id`, `name` (unique), `logo`, `description`, `website`, `industry`, `location`, `createdById`, `createdAt`, `updatedAt`.
  - Implemented `CompanyMember` model with `id`, `companyId`, `userId`, `role` (`OWNER`, `ADMIN`, `MEMBER`), `canPostOpportunities`, `canManageCompany`, `createdAt`, `updatedAt`, and composite unique constraint `@@unique([companyId, userId])`.
- **Business Logic Services (`lib/services/company.ts`)**:
  - `createCompany`: Creates new corporate profile; automatically designates creator as `OWNER` with full management and posting privileges.
  - `updateCompany`: Updates company metadata with server-side authorization check.
  - `getCompany`: Retrieves company with authorized member listings.
  - `listCompanies`: Lists verified companies with optional term/industry search.
  - `addCompanyMember`: Adds or delegates permissions to members within a company.
  - `getUserCompanies`: Retrieves companies managed or represented by a given user.
  - `assertCanManageCompany`: Asserts user is platform `ADMIN` or holds `OWNER`/`ADMIN`/`canManageCompany` for that company. Blocks ordinary users with `FORBIDDEN_COMPANY_MODIFICATION (403)`.
  - `assertCanPostForCompany`: Asserts user is authorized to represent and publish official opportunities for that company.

### 2.2 Task 2: Opportunity Database Model
- **Schema (`prisma/schema.prisma`)**:
  - Implemented `Opportunity` model with all required attributes:
    - Identity: `id`, `title`, `description` (min 20 chars).
    - Corporate Affiliation: `companyId` (nullable FK), `companyName`, `companyLogo`.
    - Opportunity Classification: `type` (`INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`, `OTHER`).
    - Author & Provenance: `posterId` (FK to `users`), `sourceType` (`OFFICIAL_EMPLOYER` vs `COMMUNITY_SHARED`).
    - Moderation State: `status` (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`, `CLOSED`).
    - Eligibility Criteria: `minCgpa` (decimal 3,2), `minAcademicYear`, `requiredSkills` (string array), `targetDepartments` (string array), `openToAllDepartments` (boolean).
    - Logistics: `salaryOrStipend`, `location`, `workplaceType` (`ON_SITE`, `REMOTE`, `HYBRID`), `applicationMethod` (`INTERNAL`, `EXTERNAL`), `externalUrl`, `contactEmail`, `deadline` (timestamp).
    - Review Metadata: `reviewerId` (FK to `users`), `reviewedAt` (timestamp), `rejectionReason` (text).
    - Timestamps: `createdAt`, `updatedAt`.

### 2.3 Task 3: Opportunity Business Logic
- **Services (`lib/services/opportunity.ts`)**:
  - `createOpportunity`: Enforces server-side posting clearance (`assertCanPostOpportunity`). Validates input through `createOpportunitySchema`. If `sourceType = OFFICIAL_EMPLOYER`, asserts `companyId` exists and verifies `assertCanPostForCompany`. Sets initial status to `PENDING` (or `DRAFT` if `submitForReview: false`).
  - `updateOpportunity`: Enforces `assertCanModifyOpportunity`. Allows author, company managers, or admin to modify listing details.
  - `submitOpportunityForReview`: Transitions `DRAFT` opportunities into `PENDING` status for administrative review.
  - `closeOpportunity`: Manually closes an opportunity before deadline (`CLOSED`).
  - `deleteOpportunity`: Removes opportunity with authorization check.
  - `getOpportunityById`: Access-gated retrieval. `APPROVED` opportunities are visible to all members; `DRAFT`, `PENDING`, `REJECTED`, and `CLOSED` opportunities are strictly restricted to author, company managers, or platform `ADMIN`.
  - `getApprovedOpportunities`: Returns active approved opportunities (`status = APPROVED` and `deadline > now()`) with department-targeting and text filtering.
  - `expireOverdueOpportunities`: Automatically transitions past-deadline opportunities to `EXPIRED`.
  - `assertCanModifyOpportunity`: Validates ownership or administrative authority.

### 2.4 Task 4: Admin Approval System
- **Institutional Moderation Flow**:
  - `getPendingOpportunities`: Queries pending opportunities for platform administrators.
  - `reviewOpportunity`: Evaluates pending dossier (`APPROVE` or `REJECT`).
    - **Approval**: Sets status to `APPROVED`, records `reviewerId` and `reviewedAt`. Listing becomes immediately visible in public opportunity catalog.
    - **Rejection**: Requires a non-empty `rejectionReason`. Sets status to `REJECTED`, records feedback and reviewer metadata.
  - **Admin UI Integration (`components/admin/opportunity-review-table.tsx`)**:
    - Live review table on `/admin` displaying pending opportunities with source type badges, company info, target departments, and application method.
    - Interactive Approve modal and Reject modal with mandatory reason textarea.
    - Instant optimistic state updates upon administrative decision.

### 2.5 Task 5: University Department Targeting
- **Seeded Departments (`prisma/seed.ts`)**:
  - Seeded 16 canonical Jagannath University departments across 6 faculties into PostgreSQL `departments` table (`CSE`, `SWE`, `BBA`, `MATH`, `PHY`, `ENG`, `LAW`, etc.).
- **Filtering Logic**:
  - When filtering opportunities by department in `getApprovedOpportunities`, opportunities flagged `openToAllDepartments = true` match alongside opportunities explicitly targeting that department.
  - Avoids duplicating department definitions.

### 2.6 Task 6: REST API Implementation
- Implemented robust, validated App Router route handlers:
  - `GET /api/companies`, `POST /api/companies`
  - `GET /api/companies/[id]`, `PUT /api/companies/[id]`
  - `POST /api/companies/[id]/members`
  - `GET /api/departments`
  - `GET /api/opportunities`, `POST /api/opportunities`
  - `GET /api/opportunities/[id]`, `PUT /api/opportunities/[id]`, `DELETE /api/opportunities/[id]`
  - `POST /api/opportunities/[id]/submit`
  - `POST /api/opportunities/[id]/close`
  - `GET /api/admin/opportunities`, `POST /api/admin/opportunities`

### 2.7 Task 7: Database Integrity
- Foreign keys with appropriate delete behaviors:
  - `Company.createdById` references `User(id)` with `onDelete: Restrict`.
  - `CompanyMember.companyId` references `Company(id)` with `onDelete: Cascade`.
  - `CompanyMember.userId` references `User(id)` with `onDelete: Cascade`.
  - `Opportunity.companyId` references `Company(id)` with `onDelete: SetNull`.
  - `Opportunity.posterId` references `User(id)` with `onDelete: Cascade`.
  - `Opportunity.reviewerId` references `User(id)` with `onDelete: SetNull`.
- Indexes created for high-performance querying on `status`, `posterId`, `companyId`, `type`, `deadline`.
- Synchronized schema to Neon PostgreSQL using `prisma db push` and seeded via `prisma db seed`.

### 2.8 Task 8: Testing
- Comprehensive Vitest test suite in `tests/unit/companies-and-opportunities.test.ts` (18 tests).
- All 60 tests passing across all 8 test files in the project.

---

## 3. Files Created
1. `lib/validations/company.ts` — Zod validation schemas for company creation, update, and member additions.
2. `lib/validations/opportunity.ts` — Zod validation schemas for opportunity creation, update, review, and filtering.
3. `lib/services/company.ts` — Company management services and authorization assertions.
4. `lib/services/opportunity.ts` — Opportunity lifecycle, moderation, access gating, and filtering services.
5. `app/api/companies/route.ts` — List and create companies.
6. `app/api/companies/[id]/route.ts` — Get and update company by ID.
7. `app/api/companies/[id]/members/route.ts` — Add company members.
8. `app/api/departments/route.ts` — Query university academic departments.
9. `app/api/opportunities/route.ts` — Query approved opportunities and create new listings.
10. `app/api/opportunities/[id]/route.ts` — View, update, and delete opportunity by ID.
11. `app/api/opportunities/[id]/submit/route.ts` — Submit draft opportunity for review.
12. `app/api/opportunities/[id]/close/route.ts` — Close opportunity before deadline.
13. `app/api/admin/opportunities/route.ts` — Admin pending opportunity queue and moderation decision endpoint.
14. `components/admin/opportunity-review-table.tsx` — Interactive admin opportunity review table with live Approve and Reject dialogs.
15. `tests/unit/companies-and-opportunities.test.ts` — Vitest unit and integration test suite (18 tests).
16. `docs/stages/STAGE-06.md` — This stage implementation report.

---

## 4. Files Modified
1. `prisma/schema.prisma` — Added `Company`, `CompanyMember`, `Department`, `Opportunity` models, relationships to `User`, and associated enums.
2. `prisma/seed.ts` — Added database seeding for 16 canonical Jagannath University departments across 6 faculties.
3. `app/(dashboard)/admin/page.tsx` — Integrated real database counts for opportunities and connected `OpportunityReviewTable`.
4. `docs/DATABASE_SCHEMA.md` — Documented Stage 6 schema additions, ERD diagram, table definitions, and indexes.
5. `docs/API_REFERENCE.md` — Documented all 9 new REST API routes.
6. `docs/USER_ROLES_AND_PERMISSIONS.md` — Documented company RBAC, opportunity modification assertions, and visibility matrix.
7. `docs/SECURITY_AND_PRIVACY.md` — Documented anti-IDOR controls, moderation isolation, and temporal expiration guards.
8. `docs/TEST_PLAN.md` — Added Stage 6 test specifications.
9. `docs/TEST_RESULTS.md` — Recorded Stage 6 test execution results (18/18 passing, 60/60 total).
10. `docs/PROGRESS.md` — Marked Stage 6 COMPLETE and previewed Stage 7.
11. `docs/CHANGELOG.md` — Recorded Stage 6 changes under Keep a Changelog standards.

---

## 5. Database Changes
- **New Tables**:
  - `companies`
  - `company_members`
  - `departments`
  - `opportunities`
- **New Enums**:
  - `CompanyMemberRole` (`OWNER`, `ADMIN`, `MEMBER`)
  - `OpportunityType` (`INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`, `OTHER`)
  - `OpportunitySourceType` (`OFFICIAL_EMPLOYER`, `COMMUNITY_SHARED`)
  - `OpportunityStatus` (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`, `CLOSED`)
  - `WorkplaceType` (`ON_SITE`, `REMOTE`, `HYBRID`)
  - `ApplicationMethod` (`INTERNAL`, `EXTERNAL`)
- **Seeded Data**:
  - 16 university academic departments in `departments`.

---

## 6. Pages and Routes Implemented
- **API Routes**:
  - `GET`, `POST /api/companies`
  - `GET`, `PUT /api/companies/[id]`
  - `POST /api/companies/[id]/members`
  - `GET /api/departments`
  - `GET`, `POST /api/opportunities`
  - `GET`, `PUT`, `DELETE /api/opportunities/[id]`
  - `POST /api/opportunities/[id]/submit`
  - `POST /api/opportunities/[id]/close`
  - `GET`, `POST /api/admin/opportunities`
- **Admin Page Enhancement**:
  - `app/(dashboard)/admin/page.tsx` (Opportunities review tab with live database counts and review table).

---

## 7. Tests Executed and Actual Test Results
- **Test Suite**: Vitest v5.0.5 (`npm test`)
- **Execution Time**: ~29.5s
- **Test Files**: 8 passed (8 total)
- **Tests**: 60 passed (60 total, 0 failed)
- **Breakdown**:
  - `tests/unit/companies-and-opportunities.test.ts`: **18 / 18 PASSED**
    1. Creates company and assigns creator as OWNER.
    2. Allows company manager to update company info.
    3. Blocks unauthorized members from updating unmanaged companies (403).
    4. Adds company members with custom permissions.
    5. Blocks unverified users from creating opportunities.
    6. Rejects official employer opportunities without verified company membership.
    7. Allows authorized company member to create official employer opportunities.
    8. Allows verified student/alumni to share community opportunities.
    9. Enforces future deadline requirement.
    10. Enforces external URL when application method is EXTERNAL.
    11. Prevents unapproved opportunities from public discovery.
    12. Allows platform admin to approve pending opportunities with reviewer attribution.
    13. Requires rejection reason when admin rejects opportunities.
    14. Prevents unauthorized users from modifying opportunities.
    15. Allows author to update their draft opportunity.
    16. Allows author to close their opportunity.
    17. Automatically expires overdue opportunities.
    18. Filters department-targeted and open-to-all opportunities correctly.
  - `tests/unit/membership-and-profiles.test.ts`: **15 / 15 PASSED**
  - `tests/unit/auth.test.ts`: **8 / 8 PASSED**
  - `tests/unit/middleware.test.ts`: **7 / 7 PASSED**
  - `tests/unit/foundation.test.ts`: **5 / 5 PASSED**
  - `tests/unit/navigation-layout.test.ts`: **4 / 4 PASSED**
  - `tests/unit/design-system.test.ts`: **2 / 2 PASSED**
  - `tests/unit/database.test.ts`: **1 / 1 PASSED**
- **Type Check (`npm run type-check`)**: **0 errors** (`tsc --noEmit`).
- **Production Build (`npm run build`)**: **37 routes compiled successfully** with Next.js Turbopack.

---

## 8. Known Issues or Limitations
1. Stage 6 intentionally focuses on backend models, business logic, validation, authorization, and APIs. The end-user job browsing directory (`/opportunities`), detailed job view (`/opportunities/[id]`), and posting wizard (`/opportunities/post`) are planned for Stage 7.
2. Candidate resume application submissions and private vault storage are deferred to Stage 7 per project boundaries.

---

## 9. Manual Setup Requirements
- None. Database schema changes have been pushed to Neon PostgreSQL and seeded.

---

## 10. Documentation Updated
- `docs/DATABASE_SCHEMA.md`
- `docs/API_REFERENCE.md`
- `docs/USER_ROLES_AND_PERMISSIONS.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `docs/TEST_PLAN.md`
- `docs/TEST_RESULTS.md`
- `docs/PROGRESS.md`
- `docs/CHANGELOG.md`
- `docs/stages/STAGE-06.md`

---

## 11. Scope Compliance Confirmation
- Did not build the complete job browsing frontend interface (deferred to Stage 7).
- Did not implement applications or resume vault (deferred to Stage 7).
- Did not implement the community feed (deferred to Stage 8).
- Did not implement smart matching (deferred to Stage 9).
- Did not start future stages.
