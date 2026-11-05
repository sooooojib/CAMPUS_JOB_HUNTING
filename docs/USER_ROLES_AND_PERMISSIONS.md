# UniCareer Community — User Roles & Permissions Matrix

> **Status**: Stage 4 Implemented & Verified  
> **Authentication Core**: Better Auth 1.7.17 + PostgreSQL 16 via Prisma 7 `@prisma/adapter-pg`

---

## 1. Membership Hierarchy & Account Model

UniCareer Community uses a **Single Unified Account Architecture**. Users possess:
1. `membershipType`: Represents the user's primary connection to the university (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`).
2. `systemRole`: Administrative privileges within the platform (`MEMBER`, `MODERATOR`, `ADMIN`). **Kept strictly separate from membershipType.**
3. `accountStatus`: High-level account health (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`, `DEACTIVATED`).
4. `verificationStatus`: University credentials verification (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`).
5. `emailVerified`: Boolean indicating whether the registered institutional email address was verified via cryptographic link.

```
                    ┌───────────────────────────┐
                    │       User Account        │
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Membership Type  │    │  Account Status  │    │   System Role    │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ • STUDENT        │    │ • ACTIVE         │    │ • MEMBER         │
│ • ALUMNI         │    │ • PENDING_VERIF  │    │ • MODERATOR      │
│ • FACULTY        │    │ • SUSPENDED      │    │ • ADMIN          │
│ • STAFF          │    │ • DEACTIVATED    │    └──────────────────┘
│ • EMPLOYER       │    └──────────────────┘
│ • EXTERNAL_CONN  │
└──────────────────┘
```

---

## 2. Granular Permissions Matrix

| Platform Capability | Unauthenticated | Registered (Unverified Email) | Email Verified (`MEMBER`) | Verified `STUDENT` | Verified `ALUMNI` / `STAFF` | Verified `EMPLOYER` | Platform `ADMIN` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Marketing & Info Pages** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Register / Sign In / Password Reset** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Access Dashboard & Protected Shell** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Submit Verification Proof** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Browse Opportunities Catalog** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **View Full Opportunity Details** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Submit Job / Internship Application** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ (Testing) |
| **Withdraw Active Application** | ❌ | ❌ | ❌ | ✅ (Own) | ✅ (Own) | ❌ | ✅ |
| **Post Opportunity (Official Employer)** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Pending Review) | ✅ (Direct) |
| **Post Opportunity (Community Shared)** | ❌ | ❌ | ❌ | ✅ (Pending Review) | ✅ (Pending Review) | ✅ (Pending Review) | ✅ (Direct) |
| **Manage Received Applications** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Own Jobs) | ✅ (All) |
| **Browse Community Feed & Posts** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Publish Community Post / Comment** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **React, Bookmark & Connect** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Submit Referral Request** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Fulfill Referral as Advocate** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Access Student Tools (CGPA, Gaps)**| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ (Audit) |
| **Approve / Reject Opportunities** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Verify Member Accounts** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Moderate Reports & Audit Logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Server-Side Enforcement Rules (Stage 4 Implemented)

1. **Edge/Network Proxy Boundary (`proxy.ts`)**:
   - Inspects `better-auth.session_token` (or `__Secure-better-auth.session_token`).
   - Blocks unauthenticated access to `/dashboard`, `/feed`, `/opportunities`, `/applications`, `/community`, `/referrals`, `/career-tools`, `/contributions`, `/profile`, `/settings`, `/notifications`, `/admin`.
   - Issues `307 Temporary Redirect` to `/login?callbackUrl=<requested_path>`.
   - Redirects already-authenticated members attempting to visit `/login` or `/register` to `/dashboard` (or target `callbackUrl`).

2. **Server Component Shell Gate (`app/(dashboard)/layout.tsx`)**:
   - Evaluates active session via `auth.api.getSession({ headers: await headers() })`.
   - Never relies on client-side state alone.
   - Re-validates `accountStatus`: Immediately terminates access if account status is `SUSPENDED` or `DEACTIVATED`.

3. **Separation of Concerns**:
   - `membershipType` cannot be used to grant platform moderation or administration powers.
   - `systemRole` controls administrative privileges (`/admin`) and cannot be populated or altered via public signup payloads (`input: false` on `systemRole`).

4. **Cryptographic Password Security**:
   - Plaintext passwords are NEVER stored in the database.
   - Passwords are encrypted with salt and hash algorithms (scrypt) via Better Auth before persisting to the `accounts` table.
