# UniCareer Community — Security & Privacy Specification

## 1. Authentication & Session Security (Stage 4 Implemented)

1. **Password Hashing & Storage**:
   - High-cost scrypt cryptographic hashing via Better Auth.
   - Plaintext passwords are NEVER stored in the database.
   - Hashed secrets reside exclusively in the `accounts` table and are never returned in user payloads or client session queries.
2. **Session Integrity**:
   - HTTP-only, SameSite: `lax`, and `secure` (in production) cookies (`better-auth.session_token`).
   - 7-day default session lifetime with automatic 24-hour rolling updates and a 5-minute cookie cache.
   - Database-backed session invalidation on logout (`POST /api/auth/sign-out`) and account suspension.
3. **Cryptographic Token Lifecycle**:
   - Password reset tokens expire in 30 minutes (`resetPasswordTokenExpiresIn: 1800`) and are single-use.
   - Verification tokens are signed JWTs with expiration bounds.
   - In development, tokens are captured in an in-memory test store (`lib/email.ts`) and never exposed to unauthenticated public endpoints.
4. **Two-Layer Route Enforcement**:
   - **Layer 1 (Network Edge / Proxy)**: `proxy.ts` rejects unauthenticated requests to protected paths (`/dashboard`, `/opportunities`, `/community`, etc.) with a 307 redirect preserving the target `callbackUrl`.
   - **Layer 2 (Server Component Runtime)**: `app/(dashboard)/layout.tsx` validates session authenticity against PostgreSQL on the server and blocks `SUSPENDED` or `DEACTIVATED` accounts.

---

## 2. Profile Privacy & Sensitive Data Redaction (Stage 5 Implemented)

1. **Private Identifier Redaction**:
   - University Student IDs (`studentId`), personal phone numbers (`phone`), and verification evidence notes (`proofDetails`) are strictly classified as **Private Institutional Data**.
   - The server service `getPublicProfile(targetUserId, viewerUserId)` (`lib/services/profile.ts`) intercepts all member profile lookups:
     - If the viewer is NOT the profile owner and NOT a platform `ADMIN`, `studentId`, `phone`, and `proofDetails` are stripped completely (`undefined`).
     - Regular members browsing `/profile/[id]` cannot inspect another member's student ID or personal phone number under any condition.
2. **Contact Email Privacy Control**:
   - By default, member emails are withheld from public directory profiles (`showEmail: false`).
   - A member's email address is displayed to other authenticated community members only if the user explicitly enables `showEmail: true` in their profile settings.
   - Profile owners and platform administrators retain full visibility for account administration and verification audits.
3. **Verification Dossier Confidentiality**:
   - Academic transcripts, proof documents, and employer partnership agreements submitted during onboarding or resubmission are visible exclusively to the applicant and platform administrators.
   - Non-administrators attempting to query `/api/admin/verifications` receive an immediate `403 FORBIDDEN` response.

---

## 3. Server-Side Posting Clearance & Anti-Privilege Escalation

1. **Server-Enforced Opportunity Posting (`assertCanPostOpportunity`)**:
   - Unverified members (`PENDING`, `REJECTED`, `SUSPENDED`) are strictly prohibited from publishing opportunities.
   - The posting clearance check is executed on the server (`lib/permissions.ts`):
     - Platform administrators (`systemRole === 'ADMIN'`) always hold posting clearance.
     - Verified `EMPLOYER`, `FACULTY`, and `STAFF` hold posting clearance upon institutional approval.
     - Unverified accounts cannot bypass posting restrictions by modifying client payloads or DOM state.
2. **Separation of Platform Role vs. Membership Type**:
   - Institutional membership types (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`) are strictly separated from administrative roles (`systemRole: MEMBER | MODERATOR | ADMIN`).
   - Better Auth user input configurations declare `systemRole`, `accountStatus`, and `canPostOpportunities` with `input: false`, preventing client-side registration payloads from self-elevating privileges.

---

## 4. Resume & File Storage Security

1. **Private Object Storage**: Resumes and verification proof documents are stored in private, unguessable storage buckets (never in `/public/`).
2. **Time-Limited Signed URLs**: Resumes are accessed exclusively via temporary pre-signed download URLs with an expiration lifetime of at most 15 minutes.
3. **MIME-Type & Virus Validation**: File uploads enforce strict MIME-type checking (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) and file size limits (max 5MB).

---

## 5. Audit Trails & Governance History

1. **Immutable Request History**: Rejections and resubmissions create distinct records in `membership_requests`, ensuring complete historical traceability of credential reviews and rejection justifications.
2. **Reviewer Attribution**: Every approved or rejected verification logs the `reviewerId` and `reviewedAt` timestamp in PostgreSQL.
