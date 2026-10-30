# UniCareer Community — Test Plan

## 1. Quality Strategy

Quality assurance spans four rigorous layers to guarantee a production-grade experience:
1. **Type Safety & Static Analysis**: TypeScript compiler (`tsc --noEmit`) and ESLint.
2. **Unit & Domain Tests**: Vitest for utility functions, CGPA matching logic, and Zod schema validations.
3. **Integration Tests**: Database service tests with test transaction rollback.
4. **End-to-End Browser Tests**: Playwright for complete browser testing across desktop, tablet, and mobile viewports.

---

## 2. Test Suites

### 2.1 Authentication & Gatekeeping (Playwright)
- Unauthenticated user attempting to view `/opportunities` is redirected to `/login?callbackUrl=/opportunities`.
- Registration enforces email format, password complexity, and institutional details.
- User with `PENDING` verification status sees verification banner and cannot access restricted feeds.
- Verified member gets direct access.

### 2.2 Opportunity Portal (Playwright & Vitest)
- Filtering by type (`INTERNSHIP`, `FULL_TIME`) and classification (`OFFICIAL_EMPLOYER`, `COMMUNITY_SHARED`).
- Submitting an opportunity defaults to `PENDING` status.
- Admin approving the opportunity promotes it to `APPROVED` and visible in search.
- Expired opportunities are excluded from active search results.

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

