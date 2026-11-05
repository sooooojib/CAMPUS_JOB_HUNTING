# Stage 10 Implementation Report: Member Directory, Connections, and Referrals

## 1. Stage Overview
- **Stage Name**: Stage 10 — Member Directory, Connections, and Referrals
- **Status**: `COMPLETE`
- **Scope**: Build the professional member discovery and referral system to help university-connected members find peers, alumni, and recruiters who can support their career growth. Implement database models for network connections and referral requests with composite unique constraints; build a searchable, multi-filtered member directory (`/community`) with strict privacy protection; enhance member profiles (`/profile/[id]`) with connection controls, referral actions, shared connection counts, and recent discussions; implement a dedicated referrals hub (`/referrals`) with request tracking, response workflows, and non-guarantee disclaimers; and enforce server-side privacy authorization.
- **Strict Scope Boundaries**:
  - Do NOT implement private messaging.
  - Do NOT implement AI matching.
  - Do NOT implement external social network integrations.
  - Do NOT implement unrelated community features.

---

## 2. What Was Completed

### 2.1 Task 1: Searchable Member Directory
- Created [`searchMemberDirectory`](file:///Users/sajib/se_project/lib/services/profile.ts) querying real PostgreSQL data (`User` and `Profile` models).
- Built [`MemberDirectoryView`](file:///Users/sajib/se_project/components/community/member-directory-view.tsx) and updated [`app/(dashboard)/community/page.tsx`](file:///Users/sajib/se_project/app/(dashboard)/community/page.tsx), completely eradicating sample/mock member arrays.
- Display components:
  - Member name with direct profile link.
  - Profile image with initials fallback.
  - Institutional membership badge (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`).
  - Registrar verification badge (`Verified Member`).
  - Professional headline and biography.
  - Department and graduation year.
  - Company and work designation.
  - Endorsed skill chips.
  - Interactive [`ConnectionButton`](file:///Users/sajib/se_project/components/community/connection-button.tsx) wired to live user connection state.
  - "Request Referral" trigger button opening [`RequestReferralModal`](file:///Users/sajib/se_project/components/referrals/request-referral-modal.tsx).
- Multi-filter search engine:
  - Live debounced keyword search across name, headline, bio, company, and department.
  - Affiliation selector (`ALL`, `STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`).
  - Department input filter.
  - Company input filter.
  - Skill input filter.
  - Reset filters shortcut.
  - Pagination controls (`page`, `pageSize`, `totalPages`, `totalCount`).
- **Strict Profile Privacy Guarantees**:
  - University student IDs (`studentId`) and personal phone numbers (`phone`) are never returned in directory searches.
  - Member email addresses are strictly masked (`undefined`) unless the member explicitly enabled `showEmail: true`, or the viewer is a platform administrator (`systemRole: "ADMIN"`).
  - Suspended and deactivated accounts are filtered out (`accountStatus: "ACTIVE"`).

### 2.2 Task 2: Enhanced Member Profiles
- Enriched [`app/(dashboard)/profile/[id]/page.tsx`](file:///Users/sajib/se_project/app/(dashboard)/profile/[id]/page.tsx) with live backend services:
  - Added [`ProfileActions`](file:///Users/sajib/se_project/components/profile/profile-actions.tsx) toolbar containing dynamic connection state button, "Request Referral" button, and direct mail link.
  - Integrated mutual university connections calculator (`sharedCount`) displaying shared peer count in the sidebar.
  - Added "Recent Community Activity" section displaying the member's last 3 active posts with post type badges and direct links to `/feed?post=[id]`.
  - Added structured "Key Projects" section for tech stack showcase.
  - Maintained full design system consistency with university branding.

### 2.3 Task 3: Connection System
- Implemented `Connection` model in [`prisma/schema.prisma`](file:///Users/sajib/se_project/prisma/schema.prisma) with composite unique constraint `@@unique([senderId, receiverId])`.
- Built backend service [`lib/services/connection.ts`](file:///Users/sajib/se_project/lib/services/connection.ts):
  - `sendConnectionRequest(senderId, receiverId)`:
    - **Prohibits self-connections**: throws error if `senderId === receiverId`.
    - **Prevents duplicate requests**: checks existing connections in both directions; directs user to accept if an incoming request already exists.
    - Rejects requests to inactive or suspended accounts.
  - `respondToConnectionRequest(userId, connectionId, action)`:
    - Restricts authorization to the designated `receiverId` only (unauthorized members cannot accept/reject).
    - Transitions status between `PENDING`, `ACCEPTED`, and `REJECTED`.
  - `cancelConnectionRequest(userId, connectionId)`:
    - Restricts authorization to the original sender (`senderId`).
  - `removeConnection(userId, connectionId)`:
    - Allows either party in an established connection to dissolve the connection.
  - `getConnectionState(viewerId, targetUserId)`:
    - Returns `"SELF"`, `"NONE"`, `"PENDING_SENT"`, `"PENDING_RECEIVED"`, or `"CONNECTED"`.
  - `getUserConnections`: Paginated list of accepted connections with peer profile metadata.
  - `getPendingIncomingConnections` & `getPendingOutgoingConnections`.
- Built API route handlers:
  - `GET /api/connections`, `POST /api/connections` in [`app/api/connections/route.ts`](file:///Users/sajib/se_project/app/api/connections/route.ts).
  - `PUT /api/connections/[id]`, `DELETE /api/connections/[id]` in [`app/api/connections/[id]/route.ts`](file:///Users/sajib/se_project/app/api/connections/[id]/route.ts).
  - `GET /api/connections/status` in [`app/api/connections/status/route.ts`](file:///Users/sajib/se_project/app/api/connections/status/route.ts).

### 2.4 Task 4: Dedicated Referral Request System
- Implemented `ReferralRequest` model in [`prisma/schema.prisma`](file:///Users/sajib/se_project/prisma/schema.prisma) with `ReferralStatus` enum (`PENDING`, `ACCEPTED`, `DECLINED`, `COMPLETED`, `CANCELLED`).
- Built backend service [`lib/services/referral.ts`](file:///Users/sajib/se_project/lib/services/referral.ts):
  - `createReferralRequest(requesterId, input)`:
    - Validates target company and optional opportunity reference.
    - Enforces polite message (min 20, max 2000 chars) and optional resume link.
    - **Prohibits self-referrals**: throws error if `requesterId === recipientId`.
  - `respondToReferralRequest(recipientId, referralId, input)`:
    - Restricts response authorization to designated recipient only.
    - Supports `ACCEPTED`, `DECLINED`, and `COMPLETED` transitions with optional recipient note.
  - `cancelReferralRequest(requesterId, referralId)`:
    - Allows requester to cancel pending requests.
  - `getUserReferralRequests(userId, options)`:
    - Queries sent, received, or all referral requests with status filtering and pagination.
  - **Regulatory Non-Guarantee Disclaimer**:
    - Disseminates the mandatory disclaimer on all referral creation modals and dashboards:
      > *"UniCareer Community referral requests facilitate trusted professional recommendations between university-connected members. Submitting or receiving a referral does not guarantee an interview, employment offer, or institutional endorsement."*
- Built API route handlers:
  - `GET /api/referrals`, `POST /api/referrals` in [`app/api/referrals/route.ts`](file:///Users/sajib/se_project/app/api/referrals/route.ts).
  - `GET /api/referrals/[id]`, `PUT /api/referrals/[id]` in [`app/api/referrals/[id]/route.ts`](file:///Users/sajib/se_project/app/api/referrals/[id]/route.ts).
- Built frontend components:
  - [`ReferralsHubView`](file:///Users/sajib/se_project/components/referrals/referrals-hub-view.tsx) in [`app/(dashboard)/referrals/page.tsx`](file:///Users/sajib/se_project/app/(dashboard)/referrals/page.tsx), completely replacing mock data.
  - [`RequestReferralModal`](file:///Users/sajib/se_project/components/referrals/request-referral-modal.tsx) for direct referral submissions from directory cards and profile detail pages.

### 2.5 Task 5: Referral Privacy Enforcement
- Built [`assertCanAccessReferral(viewerUserId, referralId)`](file:///Users/sajib/se_project/lib/services/referral.ts#L105):
  - Checks whether `referral.requesterId === viewerUserId`, `referral.recipientId === viewerUserId`, or viewer is platform `ADMIN`.
  - Rejects third-party access attempts with HTTP 403 Forbidden error (`Access denied. You do not have permission to view this referral request.`).
  - Protects candidate resumes, pitch messages, and private sponsor feedback notes.

### 2.6 Task 6: Community Integration
- Interconnected links between:
  - Directory cards -> Member profile pages (`/profile/[id]`).
  - Member profiles -> "Request Referral" modal pre-populating company name.
  - Referral dossiers -> Direct links to attached opportunities (`/opportunities/[id]`) and member profiles.
  - Profile detail pages -> Author's recent discussions linking to `/feed?post=[id]`.
  - Directory header -> Fast navigation to `/feed` and `/referrals`.

### 2.7 Task 7: Automated Testing
- Created Vitest test suite [`tests/unit/connections-and-referrals.test.ts`](file:///Users/sajib/se_project/tests/unit/connections-and-referrals.test.ts):
  - 12 comprehensive unit and integration tests passing.
  - Full test suite: **125 out of 125 tests passing across all 12 test files**.
  - TypeScript type check: **0 errors** (`npm run type-check`).
  - Next.js Turbopack build: **50 out of 50 routes compiled cleanly** (`npm run build`).

---

## 3. Files Created
1. `lib/validations/connection.ts`: Zod schemas for connection requests, responses, and queries.
2. `lib/validations/referral.ts`: Zod schemas for referral creation, responses, and status filters.
3. `lib/services/connection.ts`: Backend service for connection requests, responses, cancellation, dissolution, and mutual queries.
4. `lib/services/referral.ts`: Backend service for referral requests, response lifecycle, cancellation, and privacy authorization.
5. `app/api/members/route.ts`: Authenticated `GET` route handler for member directory queries.
6. `app/api/connections/route.ts`: `GET` (list) and `POST` (send request) route handlers.
7. `app/api/connections/[id]/route.ts`: `PUT` (accept/reject) and `DELETE` (cancel/remove) route handlers.
8. `app/api/connections/status/route.ts`: `GET` route handler for relationship status between viewer and target member.
9. `app/api/referrals/route.ts`: `GET` (dashboard list) and `POST` (create request) route handlers.
10. `app/api/referrals/[id]/route.ts`: `GET` (dossier with privacy check) and `PUT` (respond/cancel) route handlers.
11. `components/community/member-directory-view.tsx`: Client view for member directory with debounced search, filters, pagination, and action buttons.
12. `components/referrals/request-referral-modal.tsx`: Client modal dialog for sending referral requests with non-guarantee disclaimer.
13. `components/referrals/referrals-hub-view.tsx`: Client dashboard view for incoming/outgoing referrals with status responses and notes.
14. `components/profile/profile-actions.tsx`: Client toolbar for profile detail page actions.
15. `tests/unit/connections-and-referrals.test.ts`: Vitest test suite with 12 tests covering all Stage 10 requirements.
16. `docs/stages/STAGE-10.md`: This stage report.

---

## 4. Files Modified
1. `prisma/schema.prisma`: Added `ConnectionStatus` and `ReferralStatus` enums, added `Connection` and `ReferralRequest` models, and relations on `User`, `Company`, and `Opportunity`.
2. `types/index.ts`: Added `ConnectionStatus`, `ReferralStatus`, `MemberDirectoryItem`, and `ReferralRequestDetails` domain types.
3. `lib/validations/profile.ts`: Added `memberDirectoryQuerySchema` with multi-filter and pagination fields.
4. `lib/services/profile.ts`: Added `searchMemberDirectory` with strict privacy redaction and batch connection state computation.
5. `components/community/connection-button.tsx`: Enhanced to live-call `/api/connections` with optimistic updates, toasts, cancel, and remove actions.
6. `components/community/member-profile-card.tsx`: Updated default `connectionState` to `"NONE"`.
7. `app/(dashboard)/community/page.tsx`: Replaced mock `SAMPLE_MEMBERS` with real database-backed `MemberDirectoryView`.
8. `app/(dashboard)/referrals/page.tsx`: Replaced mock `SAMPLE_REFERRALS` with real database-backed `ReferralsHubView`.
9. `app/(dashboard)/profile/[id]/page.tsx`: Enhanced with live connection button, referral request action, mutual connections count, and recent posts.
10. `app/design-system/page.tsx`: Updated showcase connection state to `"NONE"`.
11. `docs/DATABASE_SCHEMA.md`: Added models, enums, tables, and index documentation for Stage 10.
12. `docs/API_REFERENCE.md`: Added Section 6 documenting member directory, connections, and referrals API endpoints.
13. `docs/USER_ROLES_AND_PERMISSIONS.md`: Added Section 6 permissions matrix for directory, connections, and referrals.
14. `docs/SECURITY_AND_PRIVACY.md`: Added Section 10 documenting privacy guarantees, self-connection blocks, and anti-IDOR checks.
15. `docs/ROUTES_AND_PAGES.md`: Updated route inventory table for `/community`, `/referrals`, and `/profile/[id]`.
16. `docs/TEST_PLAN.md`: Added Section 2.8 for Stage 10 test scope.
17. `docs/TEST_RESULTS.md`: Added Stage 10 test execution results log (125/125 passing).
18. `docs/PROGRESS.md`: Marked Stage 10 complete and previewed Stage 11.
19. `docs/CHANGELOG.md`: Added Stage 10 entry in Keep a Changelog format.

---

## 5. Database Changes
- **Enums**:
  - `ConnectionStatus`: `PENDING`, `ACCEPTED`, `REJECTED`.
  - `ReferralStatus`: `PENDING`, `ACCEPTED`, `DECLINED`, `COMPLETED`, `CANCELLED`.
- **New Tables**:
  - `connections`: `id`, `sender_id`, `receiver_id`, `status`, `created_at`, `updated_at`.
    - Constraint: `UNIQUE(sender_id, receiver_id)`.
  - `referral_requests`: `id`, `requester_id`, `recipient_id`, `company_id`, `company_name`, `role_title`, `opportunity_id`, `message`, `resume_url`, `status`, `response_note`, `responded_at`, `created_at`, `updated_at`.
- **New Indexes**:
  - `connections_sender_id_idx`, `connections_receiver_id_idx`, `connections_status_idx`.
  - `referral_requests_requester_id_idx`, `referral_requests_recipient_id_idx`, `referral_requests_status_idx`.

---

## 6. Pages and Routes Implemented
- `/community`: Real database-driven member directory search with filters.
- `/referrals`: Dedicated alumni and member referral requests hub.
- `/profile/[id]`: Enhanced profile with connection actions, referral trigger, mutual connection counts, and recent discussions.
- `/api/members`: Paginated member directory query endpoint.
- `/api/connections`: Connection queries and request submission.
- `/api/connections/[id]`: Connection request responses and removal.
- `/api/connections/status`: Viewer-to-member connection status.
- `/api/referrals`: Referral list and creation.
- `/api/referrals/[id]`: Referral detail and response updates.

---

## 7. Tests Executed and Actual Test Results
- **Command**: `npx vitest run tests/unit/connections-and-referrals.test.ts`
  - Result: **12 / 12 PASSED** (0 failures).
- **Command**: `npm test` (Full Suite)
  - Result: **125 / 125 PASSED across 12 test files** (0 failures).
- **Command**: `npm run type-check`
  - Result: **0 TypeScript errors** (`tsc --noEmit`).
- **Command**: `npm run build`
  - Result: **50 / 50 Next.js routes compiled cleanly with Turbopack**.

---

## 8. Known Issues or Limitations
- Private chat messaging between connected members is intentionally deferred to later stages in accordance with strict project scope limits.
- AI-driven skill-matching recommendations for referrals are deferred in accordance with strict limits.

---

## 9. Manual Setup Requirements
- No new environment variables required. Uses existing PostgreSQL connection string and Better Auth configuration.

---

## 10. Documentation Updated
- `docs/DATABASE_SCHEMA.md`
- `docs/API_REFERENCE.md`
- `docs/USER_ROLES_AND_PERMISSIONS.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `docs/ROUTES_AND_PAGES.md`
- `docs/TEST_PLAN.md`
- `docs/TEST_RESULTS.md`
- `docs/PROGRESS.md`
- `docs/CHANGELOG.md`
- `docs/stages/STAGE-10.md`

---

## 11. Scope Compliance Confirmation
- Private messaging was NOT implemented.
- AI matching was NOT implemented.
- External social networks were NOT integrated.
- Only requested Stage 10 scope was delivered.
