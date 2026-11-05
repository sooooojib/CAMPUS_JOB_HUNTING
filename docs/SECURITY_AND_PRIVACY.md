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

## 2. Server-Side Authorization & Anti-IDOR

1. **No Trust in Frontend**: Frontend controls (such as disabled buttons or hidden menus) are visual aids only. All Server Actions and Route Handlers validate:
   - Is user authenticated?
   - Is user verified?
   - Is user the owner of the resource or an authorized administrator?
2. **Anti-IDOR (Insecure Direct Object Reference)**:
   - For applicant records: Only the applicant and the verified employer associated with the opportunity can retrieve applicant resumes and details.
   - For opportunity editing: Only the opportunity author or an admin can update or close an opportunity.

---

## 3. Resume & File Storage Security

1. **Private Object Storage**: Resumes and verification proof documents are stored in private, unguessable storage buckets (never in `/public/`).
2. **Time-Limited Signed URLs**: Resumes are accessed exclusively via temporary pre-signed download URLs with an expiration lifetime of at most 15 minutes.
3. **MIME-Type & Virus Validation**: File uploads enforce strict MIME-type checking (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) and file size limits (max 5MB).

---

## 4. Privacy & Data Protection

1. **Academic Confidentiality**: Student CGPAs and academic records are stored in the segregated `StudentAcademic` model and are never exposed in public profile views or community directories.
2. **Audit Trails**: All elevated administrative actions (approving opportunities, changing member verification statuses, viewing sensitive applicant files) generate immutable entries in the `AuditLog` table.

