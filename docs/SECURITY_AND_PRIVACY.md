# UniCareer Community — Security & Privacy Specification

## 1. Authentication & Session Security

1. **Password Hashing**: Strong salted hashing (e.g. bcrypt/argon2 via chosen authentication library).
2. **Session Integrity**:
   - HTTP-only, secure, SameSite cookies.
   - CSRF protection enabled on all mutation endpoints and Server Actions.
   - Session revocation on password changes or administrative account suspension.

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

