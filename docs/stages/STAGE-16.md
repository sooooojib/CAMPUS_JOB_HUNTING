# Stage 16 — Verification Lifecycle: Mail-Click Admin Dispatch, Approval Email & Pre-Approval Login Gate

> **Status**: COMPLETE  
> **Date**: November 14, 2026  
> **Target**: Strictly enforce the institutional verification flow: registration -> cryptographic email -> clicking email link submits request to Admin Dashboard -> pre-approval login gate -> admin approval -> approval email dispatch -> login unlocked.

---

## 1. Overview & Objectives

In response to governance specifications, this stage hardened the authentication and verification lifecycle to guarantee institutional trust:
1. **Mail-Click Admin Dispatch**: Registration stores initial credentials on the profile without pushing unverified accounts into the administrator verification queue. When the user clicks the verification link in their email, Better Auth's `afterEmailVerification` hook validates `emailVerified = true` and automatically enrolls the user into the Admin Verification Queue.
2. **Pre-Approval Login Gate**: Non-admin accounts with `verificationStatus !== "VERIFIED"` are strictly prevented from logging in. 
   - On the client (`/login`), the user is shown an **"Awaiting Administrator Approval"** card and their session is immediately terminated.
   - On the server (`app/(dashboard)/layout.tsx`), any unauthorized unverified session attempting to access `/feed`, `/profile`, `/opportunities`, etc., is redirected back to `/login?error=pending_admin_approval&signout=true`.
3. **Approval Email Dispatch**: When an administrator approves the application on `/admin`, the system immediately dispatches an official approval email (`sendMembershipApprovedEmail`) containing their direct sign-in button.
4. **Rejection Email Dispatch**: When an administrator rejects the application with registrar feedback, the system immediately dispatches `sendMembershipRejectedEmail` with the feedback explanation.
5. **Decoupled Auto-Sign-In**: Set `autoSignInAfterVerification: false` so clicking the verification link confirms the email without creating an unauthorized dashboard session.

---

## 2. Files Created & Modified

### Files Created
- `docs/stages/STAGE-16.md` — This stage implementation document.

### Files Modified
- `lib/email.ts` — Added `sendMembershipApprovedEmail` and `sendMembershipRejectedEmail` with responsive HTML templates and dev store integration.
- `lib/services/verification.ts` — Wired email dispatchers into `reviewVerificationRequest` and added server-side check ensuring only email-verified accounts can be approved.
- `lib/auth.ts` — Set `autoSignInAfterVerification: false`; retained `afterEmailVerification` hook as the single source of truth for admin queue enrollment.
- `app/api/auth/register-details/route.ts` — Guarded `MembershipRequest` insertion so unverified accounts are not prematurely enrolled into the admin queue.
- `app/(auth)/login/page.tsx` — Added pre-approval institutional status check, session termination on pending, and dedicated "Awaiting Administrator Approval" alert.
- `app/(auth)/verify-email/page.tsx` — Removed premature "Proceed to Community Feed" button; clearly guides user that their request is under review and they must wait for the approval email.
- `app/(dashboard)/layout.tsx` — Server-side redirect for non-admin accounts whose `verificationStatus !== "VERIFIED"`.
- `app/api/auth/verification-status/route.ts` — Added `systemRole` to verification status response payload.
- `docs/USER_ROLES_AND_PERMISSIONS.md` — Updated capabilities matrix to reflect that pending accounts cannot log in.
- `docs/PRODUCT_REQUIREMENTS.md` — Updated authentication & verification requirements.
- `docs/ARCHITECTURE.md` — Added Verification & Pre-Approval Gate Lifecycle section; removed obsolete private resume storage references.
- `docs/SECURITY_AND_PRIVACY.md` — Added strict administrator pre-approval gate specification.
- `docs/API_REFERENCE.md` — Updated `/api/auth/register-details`, `/api/auth/sign-in/email`, `/api/auth/verify-email`, and `/api/admin/verifications` specifications.
- `docs/PROJECT_OVERVIEW.md` — Updated key differentiators with two-stage verification and external portals.
- `docs/DECISIONS.md` — Added ADR-011.
- `docs/TEST_PLAN.md` & `docs/TEST_RESULTS.md` — Documented test execution and pass rates (194/194).
- `docs/PROGRESS.md` & `docs/CHANGELOG.md` — Updated progress milestones and changelog.
- `README.md` & `AGENTS.md` — Updated core security rules.
- `tests/unit/membership-and-profiles.test.ts` — Added test assertions verifying approval and rejection email dispatches.

---

## 3. Verification & Testing Performed

1. **Automated Unit & Regression Tests**:
   - `tests/unit/membership-and-profiles.test.ts`: 16/16 passed (including approval & rejection email dispatch assertions).
   - `tests/unit/auth.test.ts`: 8/8 passed.
   - `tests/unit/complete-user-workflows.test.ts`: 23/23 passed.
   - All 16 test files: **194/194 passing (100% pass rate)**.
2. **TypeScript Compilation**:
   - `npm run type-check`: 0 errors (`tsc --noEmit`).

---

## 4. Scope Compliance Confirmation

All user directives have been completely fulfilled. The verification process strictly follows:
`Registration -> Verification Email Sent -> User clicks Link -> Link sets emailVerified: true & submits request to Admin -> Non-admin login strictly blocked while PENDING -> Admin clicks Approve -> Approval Email dispatched -> User logs in.`
