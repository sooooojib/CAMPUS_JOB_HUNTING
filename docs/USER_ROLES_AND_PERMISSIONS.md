# UniCareer Community — User Roles & Permissions Matrix

> **Status**: Stage 13 Implemented & Verified  
> **Verification & Governance Engine**: Better Auth 1.7.17 + PostgreSQL 16 via Prisma 7 `@prisma/adapter-pg` + Immutable Audit Logs + Server-Side Authorization Gates

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

---

## 6. Member Directory, Connections & Referrals Governance (Stage 10)

| Capability / Action | Active Student / Alumnus | Target Recipient (Alumni/Employer) | Third-Party Member | Platform Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Search Member Directory** | ✅ | ✅ | ✅ | ✅ |
| **View Redacted Student ID / Phone** | ❌ (Own only) | ❌ | ❌ **Strictly Hidden** | ✅ |
| **View Member Email** | If `showEmail=true` | If `showEmail=true` | If `showEmail=true` | ✅ (Always) |
| **Send Connection Request** | ✅ | ✅ | ✅ | ✅ |
| **Connect to Oneself** | ❌ **PROHIBITED** | ❌ **PROHIBITED** | ❌ **PROHIBITED** | ❌ **PROHIBITED** |
| **Accept / Decline Connection Request** | ❌ (If not recipient) | ✅ (Designated recipient) | ❌ **FORBIDDEN (403)** | ✅ |
| **Cancel Outgoing Connection** | ✅ (Sender only) | ❌ | ❌ | ✅ |
| **Remove Established Connection** | ✅ (If party) | ✅ (If party) | ❌ | ✅ |
| **Send Referral Request** | ✅ | ✅ | ✅ | ✅ |
| **Request Referral from Oneself** | ❌ **PROHIBITED** | ❌ **PROHIBITED** | ❌ **PROHIBITED** | ❌ **PROHIBITED** |
| **View Referral Request Dossier** | ✅ (Requester) | ✅ (Recipient) | ❌ **FORBIDDEN (403)** | ✅ |
| **Respond to Referral Request** | ❌ | ✅ (`ACCEPTED`/`DECLINED`/`COMPLETED`) | ❌ **FORBIDDEN (403)** | ✅ |
| **Cancel Outgoing Referral Request** | ✅ (Requester only) | ❌ | ❌ | ✅ |

---

## 7. Academic Records & Career Tools Governance (Stage 11)

| Capability / Action | Enrolled Student (`STUDENT`) | Alumni / Faculty / Staff | Employer / External | Platform Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Access `/career-tools` Dashboard** | ✅ **Full Access** | ❌ (Role Banner + Redirect) | ❌ (Role Banner + Redirect) | ✅ **Full Access** |
| **View Own Academic Records / GPA** | ✅ | ❌ (Non-student) | ❌ (Non-student) | ✅ |
| **View Another Member's Academic Records** | ❌ **FORBIDDEN (403)** | ❌ **FORBIDDEN (403)** | ❌ **FORBIDDEN (403)** | ✅ **Registrar Clearance** |
| **Log / Update Semester GPA & Credits** | ✅ (Own transcript) | ❌ | ❌ | ✅ |
| **View Explainable Matching Recommendations** | ✅ | ❌ (Directed to general catalog) | ❌ | ✅ |
| **Access Skill Gap & Curriculum Analytics** | ✅ | ❌ | ❌ | ✅ |
| **Associate Skills with Profile** | ✅ | ✅ | ✅ | ✅ |
| **Manage Controlled Skills Dictionary** | ❌ (Standard member) | ❌ | ❌ | ✅ |

### Key Academic Privacy & Integrity Rules:
1. **Academic Transcript Confidentiality**: `getUserAcademicProfile(viewerUserId, targetUserId)` strictly forbids any member (student, alumni, faculty, staff, employer) from inspecting another student's semester GPA, credit count, or coursework notes. Only the student themselves and institutional platform administrators (`systemRole === "ADMIN"`) have viewing authorization.
2. **Non-Student Tool Isolation**: Non-student membership types (`ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`) are explicitly blocked by `canAccessStudentTools(user)`. Navigating to `/career-tools` displays a polite explanation of institutional scope and directs members to public opportunity discovery and professional community feeds.
3. **Audit & Calculation Transparency**: Cumulative CGPA is computed using the university standard credit-weighted formula $\frac{\sum (\text{GPA}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$ and cached on `Profile.currentCgpa` to prevent repetitive aggregation during bulk recommendation scoring.
4. **Explainable Matching Rules**: Skill match percentage is strictly derived from verified mathematical overlap $\frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$. Eligibility status (`ELIGIBLE`, `NOT_ELIGIBLE`, `NEEDS_REVIEW`) is evaluated as an independent institutional check with mandatory disclaimer notices.

---

## 8. Administrative Governance, Moderation & Audit Trail (Stage 13)

| Capability / Action | Standard Member | Suspended Member | Community Moderator | Platform Admin (`ADMIN`) |
| :--- | :---: | :---: | :---: | :---: |
| **Access `/admin` Dashboard** | ❌ **FORBIDDEN (403)** | ❌ **FORBIDDEN (403)** | ❌ (Unless elevated) | ✅ **Full Clearance** |
| **View Real-Time Platform Stats** | ❌ | ❌ | ❌ | ✅ **Live DB Queries** |
| **Search & Inspect All Members** | ❌ (Directory only) | ❌ | ❌ | ✅ **Full Administrative Access** |
| **Approve / Reject Verification Claims** | ❌ | ❌ | ❌ | ✅ |
| **Suspend / Restore Member Account** | ❌ | ❌ | ❌ | ✅ (Self-suspension blocked) |
| **Moderate Opportunities (Approve/Reject/Close/Delete)** | ❌ (Own opps only) | ❌ | ❌ | ✅ (Mandatory reason on reject) |
| **Moderate Content Reports (Dismiss/Remove/Suspend)** | ❌ | ❌ | ❌ | ✅ |
| **Verify / Suspend Companies** | ❌ | ❌ | ❌ | ✅ |
| **Inspect Immutable Audit Trail** | ❌ | ❌ | ❌ | ✅ (Filterable by action/target) |
| **View Platform Analytics Visualizations** | ❌ | ❌ | ❌ | ✅ (Real Recharts Aggregates) |

### Key Administrative Safeguards:
1. **Server-Side Gate Enforcement**: Every administrative endpoint (`/api/admin/*`) and service strictly validates `isPlatformAdmin(user)`. Non-admin sessions receive HTTP 403 Forbidden with `{ error: { code: "FORBIDDEN", message: "Administrator clearance required." } }`.
2. **Account Suspension Safeguard**: Administrators are strictly prevented from suspending their own accounts (`adminUserId === targetUserId` throws `FORBIDDEN`). Suspended accounts immediately have authenticated capabilities (applications, job postings, discussions) revoked across the platform.
3. **Mandatory Feedback on Rejection**: Rejecting an opportunity posting requires a detailed administrative reason ($\ge 5$ characters) that is dispatched to the author via in-app notification and email.
4. **Immutable Audit Register**: All administrative actions are recorded in the `AdminAuditLog` table with administrator ID, action enum, target type, target entity ID, human-readable label, stated reason, structured JSON metadata, and client IP address.



