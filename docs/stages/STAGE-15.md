# Stage 15 — Live Transactional Delivery, Verification-First Gate & UI De-AI-ification

> **Status**: COMPLETE  
> **Date**: November 9, 2026  
> **Target**: Wire real outbound Gmail SMTP delivery, enforce verification-first login, decouple academic CGPA verification, resolve redirect loops, and de-AI-ify UI badges.

---

## 1. Overview & Objectives

Following the full implementation of all 14 functional stages, this stage hardened the authentication lifecycle and visual identity based on live deployment feedback:
1. Replaced the sandboxed Resend API with direct Gmail SMTP via `nodemailer`, enabling universal delivery of verification links and password resets without domain verification restrictions.
2. Enforced a strict verification-first sign-in gate in Better Auth (`requireEmailVerification: true`) so unverified accounts are strictly blocked from signing in until they click the link in their inbox.
3. Completely removed the dev/fallback "Instant Verify" button from `/verify-email`.
4. Decoupled technical skills from the initial academic credentials onboarding form, routing all skill management directly to the member Profile (`/profile/me`).
5. Added independent academic CGPA verification to `Profile` with admin controls and filters (`CG_VERIFIED`, `CG_PENDING`).
6. Fixed Chrome redirect loops (`ERR_TOO_MANY_REDIRECTS`) on expired sessions by issuing explicit `?signout=true` cookie-clearing directives.
7. De-AI-ified generic UI badges (floating capsule pills with pulsing radar dots) into grounded institutional breadcrumbs and clean micro-tags.

---

## 2. Inventory of Files Created & Modified

### Files Created
- `app/api/admin/members/[id]/verify-cg/route.ts` — Server endpoint to verify or revoke student CGPA claims.
- `docs/stages/STAGE-15.md` — This stage completion document.

### Files Modified
- `lib/email.ts` — Integrated `nodemailer` transporter with Gmail SMTP credentials, retaining `devEmailStore` for test suites.
- `lib/auth.ts` — Configured `emailAndPassword: { requireEmailVerification: true, autoSignIn: false }` and `emailVerification: { sendOnSignIn: true }`.
- `app/(auth)/login/page.tsx` — Handled `EMAIL_NOT_VERIFIED` HTTP 403 error code with clean prompt and resend link action.
- `app/(auth)/verify-email/page.tsx` — Removed instant verification shortcut button; streamlined token validation.
- `app/(dashboard)/layout.tsx` — Redirects expired or missing sessions to `/login?signout=true` to eliminate redirect loops.
- `proxy.ts` — Handles `?signout=true` by deleting session cookies in the response; routes authenticated members to `callbackUrl`.
- `prisma/schema.prisma` — Added `isCgpaVerified Boolean @default(false) @map("is_cgpa_verified")` to `Profile`.
- `lib/services/admin.ts` — Added `adminVerifyUserCgpa` and updated `getAdminMembersList` to support `CG_VERIFIED` and `CG_PENDING`.
- `lib/validations/admin.ts` — Expanded `adminMemberQuerySchema` to allow `"ALL"`, `"CG_VERIFIED"`, and `"CG_PENDING"`.
- `components/navigation/header.tsx` — Replaced floating capsule pill and `animate-ping` dot with authentic institutional breadcrumb.
- `components/community/member-directory-view.tsx` — Added CG verification filters, status badges, admin action buttons, and refactored bubble capsules to `rounded-md`/`rounded-lg`.
- `components/onboarding/onboarding-credentials-form.tsx` — Removed skills input from the academic verification form.
- `tests/unit/auth.test.ts` — Added test verifying that login attempts before email verification are strictly blocked.
- `.env` & `.env.example` — Documented `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`.

---

## 3. Database Changes

Executed via `npx prisma db push` and `npx prisma generate`:
```prisma
model Profile {
  ...
  currentCgpa    Float?
  isCgpaVerified Boolean   @default(false) @map("is_cgpa_verified")
  ...
}
```

---

## 4. Verification & Testing Performed

1. **Live Email Delivery Test**:
   - Sent test email from `sooooooooojib@gmail.com` to `sajibhasanbd2345@gmail.com` via Nodemailer.
   - Message ID received: `<4ec33e70-1eb0-3572-031e-240234049183@gmail.com>`.
2. **Automated Unit Tests**:
   - `tests/unit/auth.test.ts`: 8/8 passed (including test 5 strictly blocking login before verification).
   - `tests/unit/admin-and-moderation.test.ts`: 13/13 passed.
   - `tests/unit/middleware.test.ts`: 8/8 passed.
3. **Production Build**:
   - `npm run build` compiled all 47 routes with Turbopack in 1.5s with zero errors.

---

## 5. Scope Compliance Confirmation

All user directives have been strictly fulfilled without regressions. The platform is running live on Vercel at `https://jnujobhunting.vercel.app`.
