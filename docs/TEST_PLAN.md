# UniCareer Community — Test Plan

## 1. Quality Strategy

Quality assurance spans four rigorous layers to guarantee a production-grade experience:
1. **Type Safety & Static Analysis**: TypeScript compiler (`tsc --noEmit`) and ESLint.
2. **Unit & Domain Tests**: Vitest for utility functions, CGPA matching logic, and Zod schema validations.
3. **Integration Tests**: Database service tests with test transaction rollback.
4. **End-to-End Browser Tests**: Playwright for complete browser testing across desktop, tablet, and mobile viewports.

---

## 2. Test Suites

### 2.1 Authentication & Gatekeeping (Vitest & Playwright)
- **Registration**: Enforces password minimum 8 characters, password confirmation match, terms acceptance, valid institutional email.
- **Password Security**: Validates that passwords are encrypted with scrypt salt/hash and never saved plaintext to `accounts` or `users`.
- **Role Isolation**: Verifies that `membershipType` is separate from `systemRole` and cannot be escalated to `ADMIN` on registration.
- **Login Credentials**: Authenticates valid credentials, rejects invalid passwords, rejects non-existent emails.
- **Session Lifecycle**: Database session creation, cookie emission (`better-auth.session_token`), session invalidation on logout.
- **Email Verification**: Generates cryptographic verification token, dispatches through dev email logger, successfully validates token and sets `emailVerified: true`.
- **Password Reset**: Cryptographic token issuance valid for 30 minutes, token redemption updating password hash, invalidating previous credentials.
- **Route Protection & Proxy**: Unauthenticated user attempting to view `/dashboard`, `/opportunities`, `/applications`, `/community`, `/referrals`, `/admin` is redirected with 307 to `/login?callbackUrl=...`. Authenticated user on `/login` or `/register` is redirected to `/dashboard`.
- **Account Status Guard**: Suspended or deactivated accounts are rejected by server layout.

### 2.2 Companies, Opportunities, and Approval System (Vitest)
- **Company Management**:
  - Registered members can create a company and become `OWNER` with full management clearance.
  - Authorized company members can update company metadata.
  - Ordinary/unauthorized members are blocked with `403 FORBIDDEN_COMPANY_MODIFICATION`.
  - Adding company members with custom roles (`MEMBER`, `ADMIN`) and capability flags.
- **Opportunity Creation & Posting Clearance**:
  - Unverified users (`PENDING`, `REJECTED`, `SUSPENDED`) are blocked from publishing opportunities.
  - Verified members can post `COMMUNITY_SHARED` opportunities with required external application URLs.
  - Verified company members with `canPostOpportunities: true` can publish `OFFICIAL_EMPLOYER` opportunities.
  - Non-company members attempting to publish `OFFICIAL_EMPLOYER` opportunities are rejected.
  - Validation: Future deadline check, required description length (min 20 characters), external URL requirement when `applicationMethod = EXTERNAL`.
- **Admin Moderation & Review Workflow**:
  - Submitted opportunities enter `PENDING` status and are queued for administrator review.
  - Platform administrators can approve an opportunity (`APPROVED`), making it visible immediately in catalog.
  - Platform administrators can reject an opportunity with a mandatory rejection reason (`REJECTED`).
  - Reviewer ID and review timestamp are permanently recorded in the database.
- **Access Control & Anti-IDOR**:
  - `DRAFT`, `PENDING`, and `REJECTED` opportunities are completely hidden from regular members.
  - Only the author, authorized company managers, or platform `ADMIN` can retrieve non-approved opportunities.
  - Only the author, company managers, or admin can update, submit, or close opportunities.
- **Department Targeting & Filtering**:
  - Filtering opportunities targeting a specific department (e.g. `Computer Science & Engineering`) matches both explicitly targeted and open-to-all opportunities.
- **Opportunity Lifecycle & Expiration**:
  - `expireOverdueOpportunities()` transitions past-deadline opportunities to `EXPIRED` status.

### 2.3 Applications & Resume Safeguard (Playwright)
- Applying internally with a resume upload.
- Preventing duplicate submissions by the same user to the same opportunity.
- Withdrawing an application and verifying status change.
- Verifying resume URL signature expiration and authorization walls.

### 2.4 Career Tools & CGPA Checking (Vitest)
- Student with GPA 3.4 checks opportunity requiring GPA 3.5: reports `isEligible: false`.
- Skill matching algorithm correctly computes overlap percentage and missing skill list.
- Non-student user attempting to open `/career-tools` is blocked.

### 2.5 Responsive & Theme Audits (Playwright + Axe-Core)
- Theme switching light/dark preserves WCAG AA contrast.
- Layout verification on iPhone 14 (390px), iPad (768px), and Desktop (1440px).

