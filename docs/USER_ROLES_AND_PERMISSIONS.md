# UniCareer Community — User Roles & Permissions Matrix

> **Platform Architecture**: Single Unified Account Architecture  
> **Active User Personas**: **Student**, **Alumni**, and **Administrator**  
> **Auth Engine**: Better Auth + PostgreSQL 16 (Neon) via Prisma ORM + Server-Side Authorization Gates

---

## 1. Unified Account Model & The 3 Platform Personas

UniCareer Community operates on a **Single Unified Account Architecture**. Rather than maintaining fragmented databases or separate login portals for different audiences, all users share one unified account structure composed of:

1. `membershipType`: Defines the member's institutional affiliation:
   - **`STUDENT`**: Enrolled university students actively seeking internships, full-time jobs, mentorship, and career readiness tools.
   - **`ALUMNI`**: Graduated university members sharing opportunities, providing internal company referrals, and mentoring students.
2. `systemRole`: Platform governance privileges:
   - **`MEMBER`**: Standard authenticated member (default for all Students and Alumni).
   - **`ADMIN`**: Platform administrators who govern verifications, moderate opportunities, review reports, and audit system activities.
3. `verificationStatus`: University credential approval state:
   - **`PENDING`**: Initial state after email verification, awaiting administrator review.
   - **`VERIFIED`**: University credentials approved; full community, application, and posting capabilities unlocked.
   - **`REJECTED`**: Dossier rejected with actionable administrator feedback.
   - **`SUSPENDED`**: Administrative hold on all account activities.

```
                    ┌───────────────────────────┐
                    │       User Account        │
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                              ┌──────────────────┐
│ Membership Type  │                              │   System Role    │
├──────────────────┤                              ├──────────────────┤
│ • STUDENT        │                              │ • MEMBER         │
│ • ALUMNI         │                              │ • ADMIN          │
└──────────────────┘                              └──────────────────┘
         │                                                 │
         ▼                                                 ▼
┌──────────────────────────────────────────┐      ┌──────────────────┐
│ Institutional Credentials Onboarding     │      │ Governance       │
├──────────────────────────────────────────┤      │ Center (/admin)  │
│ • University ID & Department (Locked)    │      └──────────────────┘
│ • Verification Status: PENDING / VERIFIED│
└──────────────────────────────────────────┘
```

---

## 2. Granular Permissions & Capabilities Matrix

| Platform Capability | Unauthenticated | Registered (Unverified Email) | Email Verified (`PENDING`) | Verified `STUDENT` | Verified `ALUMNI` | Platform `ADMIN` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Browse Landing Page (`/`)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Register & Request Password Reset** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sign In with Credentials** | ❌ | ❌ (Email Link Required) | ❌ (Admin Approval Required) | ✅ | ✅ | ✅ |
| **Access Member Shell & Feed** | ❌ | ❌ | ❌ (Awaiting Approval) | ✅ | ✅ | ✅ |
| **Submit Academic Verification (/onboarding)** | ❌ | ❌ | ❌ (Auto-submitted via mail click) | ✅ | ✅ | ❌ (Not applicable) |
| **View Other Member Profiles (/profile/[id])** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **View Private Student IDs & Phone Numbers** | ❌ | ❌ | ❌ | ❌ (Own only) | ❌ (Own only) | ✅ (Audit view) |
| **Browse & Search Opportunities Catalog** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Submit Job / Internship Applications** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ (Testing) |
| **Manage / Remove Own Submitted Applications** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Post Opportunities & Job Leads** | ❌ | ❌ | ❌ | ✅ (Community Lead) | ✅ (Community Lead) | ✅ (Direct) |
| **Review Applicants to Postings** | ❌ | ❌ | ❌ | ❌ | ✅ (Own Posts) | ✅ (All Posts) |
| **Request Internal Referrals** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Review & Grant Inbound Referrals** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Approve / Reject Member Verifications** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Verify / Revoke Student CGPAs** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Suspend / Restore Member Accounts** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Access Admin Center (`/admin`)** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Persona Profiles & Core User Journeys

### A. The Student (`STUDENT`)
* **Primary Mission**: Discover career pathways, prepare for campus recruitment, track applications, and request mentorship from alumni.
* **Onboarding Dossier**: Pre-populated and locked Student ID and Department, academic year, degree, expected graduation year, and registrar enrollment proof.
* **Exclusive Modules**:
  * **My Applications (`/applications`)**: Track submitted jobs, access target portals, and remove outdated application records.
  * **Career Calendar (`/calendar`)**: Aggregates job deadlines, upcoming interview rounds, and personal milestone notes.
  * **Referral Outbox (`/referrals`)**: Send structured elevator pitches to alumni working at target companies.

### B. The Alumni (`ALUMNI`)
* **Primary Mission**: Share job openings, provide referral advocacy for students, and build a trusted professional alumni network.
* **Onboarding Dossier**: Graduation year, degree, current employer, job designation, and verification proof (thesis topic, batch number, or advisor).
* **Exclusive Modules**:
  * **Manage Postings (`/opportunities/my`)**: Create, edit, and close job postings.
  * **Applicant Review Dashboard (`/opportunities/[id]/applicants`)**: Review candidate applications, inspect dossiers, and manage recruitment pipeline stages.
  * **Referrals Hub (`/referrals`)**: Inbound referral queue to evaluate student pitches and provide internal recommendations.
  * **Contributions Hub (`/contributions`)**: Telemetry tracking total jobs posted, student referrals handled, and feed discussions authored.

### C. The Platform Administrator (`ADMIN`)
* **Primary Mission**: Institutional governance, credential verification, platform safety, and content moderation.
* **System Clearance**: Granted via `systemRole: "ADMIN"`. Decoupled from membership types.
* **Exclusive Governance Center (`/admin`)**:
  * **Overview**: Live institutional KPI ribbon (Talent Pool, Institutional Verification Rate, Corporate Partners) and actionable pending alerts.
  * **Verification Requests**: Review student and alumni credential claims, inspect proof details, and approve or reject with registrar feedback.
  * **Members Directory**: Search across all members, inspect claims, toggle CGPA verification (`verify-cg`), and execute account suspensions/restorations with mandatory justifications.
  * **Content Reports**: Triage user-flagged posts and comments with one-click content removal and author suspension.
  * **Companies Management**: Manage partner organizations and corporate affiliations.
  * **Analytics & Telemetry**: Visualize student registration trends, opportunity volume, and departmental distributions.
  * **Security Audit Trail**: Append-only audit log recording every administrative action with timestamp, admin attribution, affected entity, stated reason, and IP address.

---

## 4. Server-Side Enforcement Services (`lib/permissions.ts`)

Frontend UI visibility conditionally guides user experience, but **all security boundaries are strictly enforced on the server**:

1. `canPostOpportunity(user)`:
   - Asserts active account status (`accountStatus === "ACTIVE"`).
   - Platform ADMINs return `true`.
   - Unverified accounts (`PENDING`, `REJECTED`, `SUSPENDED`) return `false`.
   - Verified `ALUMNI` and verified `STUDENT` return `true`.
2. `canReviewApplicants(user)`:
   - Asserts active status and institutional verification.
   - Platform ADMINs return `true`.
   - Verified `ALUMNI` holding author permissions return `true`.
   - Students cannot manage applicant pipelines.
3. `canAccessStudentTools(user)`:
   - Strictly validates `membershipType === "STUDENT"`. Non-student accounts are blocked at server routes and client wrappers.
4. `isPlatformAdmin(user)`:
   - Strictly asserts `systemRole === "ADMIN"`. Guards all `/api/admin/*` endpoints and `/admin` views.
5. `getPublicProfile(targetUserId, viewerUserId)`:
   - Automatically redacts `studentId`, `phone`, and `proofDetails` unless the viewer is the profile owner or a platform administrator.
