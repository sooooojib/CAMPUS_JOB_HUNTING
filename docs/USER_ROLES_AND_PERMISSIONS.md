# UniCareer Community — User Roles & Permissions Matrix

## 1. Membership Hierarchy & Account Model

UniCareer Community uses a **Single Unified Account Architecture**. Users possess:
1. `membershipType`: Represents the user's primary connection to the university.
2. `verificationStatus`: Governs access to authenticated member-only functionality.
3. `systemRole`: Administrative privileges within the platform.
4. `capabilities`: Granular authorization flags (e.g. `can_post_opportunities`, `can_review_applicants`).

```
                    ┌───────────────────────────┐
                    │       User Account        │
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Membership Type  │    │  Verify Status   │    │   System Role    │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ • STUDENT        │    │ • PENDING        │    │ • MEMBER         │
│ • ALUMNI         │    │ • VERIFIED       │    │ • MODERATOR      │
│ • FACULTY        │    │ • REJECTED       │    │ • ADMIN          │
│ • STAFF          │    │ • SUSPENDED      │    └──────────────────┘
│ • EMPLOYER       │    └──────────────────┘
│ • EXTERNAL_CONN  │
└──────────────────┘
```

---

## 2. Granular Permissions Matrix

| Platform Capability | Unauthenticated | Unverified (`PENDING`) | Verified `STUDENT` | Verified `ALUMNI` / `STAFF` | Verified `EMPLOYER` | Platform `ADMIN` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Marketing & Info Pages** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Register / Sign In / Password Reset** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Submit Verification Proof** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Browse Opportunities Catalog** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **View Full Opportunity Details** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Submit Job / Internship Application** | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ (Testing) |
| **Withdraw Active Application** | ❌ | ❌ | ✅ (Own) | ✅ (Own) | ❌ | ✅ |
| **Post Opportunity (Official Employer)** | ❌ | ❌ | ❌ | ❌ | ✅ (Pending Review) | ✅ (Direct) |
| **Post Opportunity (Community Shared)** | ❌ | ❌ | ✅ (Pending Review) | ✅ (Pending Review) | ✅ (Pending Review) | ✅ (Direct) |
| **Manage Received Applications** | ❌ | ❌ | ❌ | ❌ | ✅ (Own Jobs) | ✅ (All) |
| **Browse Community Feed & Posts** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Publish Community Post / Comment** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **React, Bookmark & Connect** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Submit Referral Request** | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Fulfill Referral as Advocate** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Access Student Tools (CGPA, Gaps)**| ❌ | ❌ | ✅ | ❌ | ❌ | ✅ (Audit) |
| **Approve / Reject Opportunities** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Verify Member Accounts** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Moderate Reports & Audit Logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Server-Side Enforcement Rules

1. **Authentication Gate**: All routes outside `(auth)` and `(public)` validate `session != null`. Missing sessions redirect to `/login?callbackUrl=<requested_path>`.
2. **Verification Gate**: Any mutation on opportunities, applications, or posts asserts `session.user.verificationStatus === 'VERIFIED'`.
3. **Student Tool Privacy**: Academic views (`/career-tools/*`) verify `session.user.membershipType === 'STUDENT'`. Other roles receive a 403 Forbidden page.
4. **Applicant Privacy & Anti-IDOR**:
   - Resumes can be fetched only by the applicant who uploaded them or an authorized member of the company attached to the opportunity.
   - All resume downloads generate temporary signed URLs with 15-minute expiration.
