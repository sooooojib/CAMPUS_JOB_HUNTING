# UniCareer Community — User Roles & Permissions Matrix

> **Status**: Stage 8 Implemented & Verified  
> **Verification & Profile Engine**: Better Auth 1.7.17 + PostgreSQL 16 via Prisma 7 `@prisma/adapter-pg` + Secure Private Resume Vault

---

## 1. Membership Hierarchy & Account Model

UniCareer Community uses a **Single Unified Account Architecture**. Users possess:
1. `membershipType`: Represents the user's primary connection to the university (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`).
2. `systemRole`: Administrative privileges within the platform (`MEMBER`, `MODERATOR`, `ADMIN`). **Kept strictly separate from membershipType.**
3. `accountStatus`: High-level account health (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`, `DEACTIVATED`).
4. `verificationStatus`: University credentials verification (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`).
5. `canPostOpportunities`: Server-enforced boolean determining opportunity publishing rights. Only granted to Platform Admins, Verified Employers, Verified Faculty/Staff, or explicitly authorized members.
6. `canReviewApplicants`: Server-enforced boolean determining whether an employer or administrator can review candidate dossiers.
7. `emailVerified`: Boolean indicating whether the registered institutional email address was verified via cryptographic link.

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
         │
         ▼
┌───────────────────────────────────────────────┐
│ Institutional Verification Engine (Stage 5)   │
├───────────────────────────────────────────────┤
│ • Status: PENDING | VERIFIED | REJECTED       │
│ • Permissions: canPostOpportunities (Server)  │
│ • Permissions: canReviewApplicants (Server)   │
│ • Audit: reviewedBy, reviewedAt, reason       │
└───────────────────────────────────────────────┘
```

---

## 2. Granular Permissions Matrix

| Platform Capability | Unauthenticated | Registered (Unverified Email) | Email Verified (`MEMBER`) | Verified `STUDENT` | Verified `ALUMNI` / `STAFF` | Verified `EMPLOYER` | Platform `ADMIN` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Marketing & Info Pages** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Register / Sign In / Password Reset** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Access Dashboard & Protected Shell** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Submit Verification Dossier (/onboarding)** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Resubmit Rejected Verification** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Edit Profile Info & Privacy Controls** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Other Member Profiles (/profile/[id])** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Private Student IDs & Phones** | ❌ | ❌ | ❌ | ❌ (Own only) | ❌ (Own only) | ❌ (Own only) | ✅ (Audit) |
| **Browse Opportunities Catalog** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **View Full Opportunity Details** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Submit Job / Internship Application** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ (Testing) |
| **Post Opportunity (`canPostOpportunities`)** | ❌ | ❌ | ❌ | ❌ | ✅ (Faculty/Staff) | ✅ (Official Employer) | ✅ (Direct) |
| **Review Candidate Applications** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Own Jobs) | ✅ (All) |
| **Browse Community Feed & Posts** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Access Student Tools (CGPA, Gaps)** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ (Audit) |
| **Approve / Reject Member Verifications** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Access Admin Center (`/admin`)** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Server-Side Enforcement Services

1. `canPostOpportunity(user)` (`lib/permissions.ts`):
   - Asserts active account status (`accountStatus === 'ACTIVE'`).
   - Platform ADMINs return `true`.
   - Returns `false` for unverified statuses (`PENDING`, `REJECTED`, `SUSPENDED`).
   - Returns `true` for verified `EMPLOYER`, `FACULTY`, `STAFF`, or users with `canPostOpportunities === true`.
2. `assertCanManageCompany(userId, companyId)` (`lib/services/company.ts`):
   - Asserts the user is a platform `ADMIN` or holds a company membership with `OWNER`, `ADMIN`, or `canManageCompany === true`.
   - Ordinary members are prevented from editing companies they do not manage.
3. `assertCanPostForCompany(userId, companyId)` (`lib/services/company.ts`):
   - Asserts the user is authorized to submit official employer opportunities on behalf of the company (`canPostOpportunities === true`).
4. `assertCanModifyOpportunity(userId, opportunityId)` (`lib/services/opportunity.ts`):
   - Asserts the user is either the original poster (`posterId === userId`), an authorized manager of the associated company, or a platform `ADMIN`.
5. `canReviewApplicants(user)` (`lib/permissions.ts`):
   - Platform ADMINs and verified Employers return `true`.
6. `canAccessStudentTools(user)` (`lib/permissions.ts`):
   - Only `STUDENT` membership accounts can access academic CGPA and course gap analyzers.
7. `getPublicProfile(targetUserId, viewerUserId)` (`lib/services/profile.ts`):
   - Strips `studentId`, `phone`, and internal proof details for all non-owner, non-admin viewers.
   - Masks email unless `showEmail === true`.

---

## 4. Opportunity Lifecycle & Moderation Matrix

| Opportunity Status | Authenticated Member | Author / Poster | Company Managers | Platform Admin |
| :--- | :---: | :---: | :---: | :---: |
| `DRAFT` | ❌ Blocked | ✅ View / Edit / Submit | ✅ View / Edit / Submit | ✅ View / Edit |
| `PENDING` (Review Queue) | ❌ Blocked | ✅ View Status | ✅ View Status | ✅ View / Approve / Reject |
| `APPROVED` (Active) | ✅ Visible in Catalog | ✅ View / Edit / Close | ✅ View / Edit / Close | ✅ View / Edit / Close |
| `REJECTED` | ❌ Blocked | ✅ View with Reason | ✅ View with Reason | ✅ View / Edit |
| `EXPIRED` | ❌ Excluded from Feed | ✅ View Archive | ✅ View Archive | ✅ View Archive |
| `CLOSED` | ❌ Excluded from Feed | ✅ View Archive | ✅ View Archive | ✅ View Archive |

---

## 5. Application & Applicant Management Governance (Stage 8)

| Capability / Action | Candidate / Applicant | Community Poster (`COMMUNITY_SHARED`) | Official Employer Manager | Platform Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Apply to Active Opportunity** | ✅ (`STUDENT` / `ALUMNI`) | ❌ (Own post) | ❌ (Own post) | ✅ (Testing) |
| **Withdraw Own Application** | ✅ | ❌ | ❌ | ✅ |
| **View Own Application Dossier** | ✅ | ❌ | ❌ | ✅ |
| **Manage Opportunity Applicants** | ❌ | ❌ **FORBIDDEN (403)** | ✅ (For Authorized Company) | ✅ (All) |
| **Update Applicant Status** | ❌ | ❌ | ✅ (`SUBMITTED` -> `SELECTED`/`REJECTED`) | ✅ |
| **Download Candidate Resume** | ✅ (Own resume) | ❌ **FORBIDDEN (403)** | ✅ (For Applied Opportunity) | ✅ |
| **Write Internal Recruiter Notes** | ❌ | ❌ | ✅ | ✅ |

### Key Security & Authorization Directives:
1. **Community Poster Isolation**: Community members who post external job leads (`COMMUNITY_SHARED`) **CANNOT** view candidate profiles, download resumes, or manage application pipelines. Only verified company representatives with confirmed corporate domain or institutional affiliation (`canReviewApplicants === true` and company member role `OWNER`/`ADMIN`/`MEMBER`) have access to candidate data.
2. **Resume Anti-IDOR Authorization**: `assertCanAccessResume(userId, resumeId)` verifies either:
   - The user is the owner of the resume (`resume.userId === userId`).
   - The user is a platform `ADMIN`.
   - The user is an authorized employer reviewing an active or historic application referencing the resume for their company.
3. **Database-Level Duplicate Prevention**: Composite unique index `@@unique([opportunityId, applicantId])` guarantees at the database engine level that no member can submit duplicate applications to the same opportunity.
