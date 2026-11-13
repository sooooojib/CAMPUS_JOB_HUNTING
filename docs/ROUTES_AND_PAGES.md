# UniCareer Community — Routes & Pages Inventory

> **Platform Deployment**: Production Verified on Vercel (`https://jnujobhunting.vercel.app`)  
> **Target Audience**: Current Students, Alumni, and University Administrators

---

## 1. Route Map & Implementation Status

### 1.1 Public Routes (Unauthenticated Allowed)
| Route | Component / Purpose | Layout Group | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/` | Landing / Marketing Homepage (No Private Data Leaks) | `app/(public)/layout.tsx` | **Implemented** |
| `/login` | Member Login with email verification-first enforcement | `app/(auth)/layout.tsx` | **Implemented** |
| `/register` | Member Registration (Student ID & Department Dropdown) | `app/(auth)/layout.tsx` | **Implemented** |
| `/forgot-password` | Password Reset Request | `app/(auth)/layout.tsx` | **Implemented** |
| `/reset-password` | Single-Use Cryptographic Password Reset | `app/(auth)/layout.tsx` | **Implemented** |
| `/verify-email` | Cryptographic Token Redemption & Resend Gateway | `app/(auth)/layout.tsx` | **Implemented** |

### 1.2 Authenticated Member Routes (Protected Application Shell)
All wrapped by `app/(dashboard)/layout.tsx` using `<AuthenticatedShell>`:

| Route | Purpose | Target Personas | Template / View Used |
| :--- | :--- | :--- | :--- |
| `/feed` | University Community Feed (Discussions, Q&A, Referrals, Achievements) | All Verified Members | `DashboardTemplate` + `CommunityFeedView` |
| `/dashboard` | Member Dashboard & Community Overview | All Verified Members | `DashboardTemplate` + `CommunityFeedView` |
| `/opportunities` | Job & Internship Portal, Multi-Filter Search, Pagination | Students & Alumni | `OpportunitiesBrowser` |
| `/opportunities/[id]` | Full Job Description, Requirements, Apply Routing | Students & Alumni | Server Page + `OpportunityDetailActions` |
| `/opportunities/[id]/applicants` | Applicant Management Pipeline & Dossier Review | Alumni Posters & Admins | `EmployerApplicantManager` |
| `/opportunities/post` | Submit Opportunity (Company Posting or Community Lead) | Verified Alumni, Students & Admins | `OpportunityForm` |
| `/opportunities/my` | Manage Postings (Status Tabs, Edit, Close) | Alumni Posters & Admins | `MyOpportunitiesView` |
| `/opportunities/saved` | Member Bookmarked Opportunities Collection | Students & Alumni | `OpportunitiesBrowser` (Bookmarked Mode) |
| `/community` | Member Network Directory & Campus Search | All Verified Members | `ListingTemplate` + `MemberDirectoryView` |
| `/referrals` | Referral Hub (Incoming Requests & Sent Requests) | Students & Alumni | `ListingTemplate` + `ReferralsHubView` |
| `/profile/[id]` | Member Profile, Connection State, Shared Network | All Authenticated Members | `ProfileTemplate` + `ProfileActions` |
| `/applications` | Candidate's Submitted Applications Tracker & Removal | Students & Alumni | `MyApplicationsView` |
| `/calendar` | Personal Career Calendar (Deadlines, Interviews, Notes) | Students & Alumni | `ListingTemplate` + `CareerCalendarView` |
| `/contributions` | Shared Leads, Referrals Handled, Community Footprint | Students & Alumni | `DashboardTemplate` + `ContributionsPage` |
| `/notifications` | Activity Alerts, Status Updates & Reminders | All Authenticated Members | `ListingTemplate` + `NotificationsCenterView` |
| `/profile/me` | Current Member Profile & Career Experience | All Authenticated Members | `ProfileTemplate` |
| `/settings` | Edit Profile Info, Privacy Controls, Locked Credentials | All Authenticated Members | `FormTemplate` + `SettingsProfileForm` |
| `/onboarding` | Academic / Alumni Verification Dossier Submission | Students & Alumni (`PENDING`) | `Card` + `OnboardingCredentialsForm` |

### 1.3 Admin & Governance Routes (Exclusive to `systemRole === "ADMIN"`)
| Route | Purpose | Target Personas | Template Used |
| :--- | :--- | :--- | :--- |
| `/admin` | Administration Command Center, Review Queues, Audit Trail | Platform Admins Only | `AdminTemplate` + `AdminDashboardContainer` |

---

## 2. Core Functional Views

### 2.1 Community Feed (`/feed`)
* **Component**: `components/community/community-feed-view.tsx`
* **Filter Tabs**: All Feed, Discussions & Q&A (`GENERAL_DISCUSSION`), Referrals (`REFERRAL_REQUEST`), Achievements (`ACHIEVEMENT`), and Saved Posts (`BOOKMARKED`).
* **Post Box (`CreatePostBox`)**: Rich text composer supporting optional headline, post type selection, character count limits (10–5,000 chars), and attached opportunity cards.
* **Interactions**: Single-click atomic `LIKE` toggling, threaded comment replies with author editing/deletion, post bookmarks, and content reporting.

### 2.2 Opportunity Engine (`/opportunities`)
* **Component**: `components/opportunities/opportunities-browser.tsx`
* **Filters**: Role Type (`INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`, `OTHER`), Workplace Type (`ON_SITE`, `REMOTE`, `HYBRID`), Department, Minimum CGPA cutoff, and debounced text search. All postings are community-shared leads (`COMMUNITY_SHARED`).
* **Detail Page (`/opportunities/[id]`)**: Full job description, salary/compensation, requirements, and application trigger.

### 2.3 Candidate Applications Tracker (`/applications`)
* **Component**: `components/applications/my-applications-view.tsx`
* **Features**: Displays candidate's submitted application records, company name, applied date, opportunity deadline, and direct link to target portal.
* **Removal**: Candidate can remove an application record with a single click ("Remove" button).

### 2.4 Referrals Hub (`/referrals`)
* **Component**: `components/referrals/referrals-hub-view.tsx`
* **Tabs**:
  - `Incoming Requests`: For alumni to review candidate pitches, view student profiles, and accept/decline referral requests.
  - `Sent Requests`: For students to track referral requests submitted to alumni.

### 2.5 Admin Command Center (`/admin`)
* **Component**: `components/admin/admin-dashboard-container.tsx`
* **Access Guard**: `isPlatformAdmin(user)`. Returns HTTP 403 / Access Restricted for non-admins.
* **6 Operational Tabs**:
  1. `Overview`: High-density institutional KPI ribbon (Talent Pool, Verification Rate, Corporate Partners) and pending action alerts.
  2. `Verification Requests`: Review student and alumni credential claims, inspect proof details, and approve or reject with registrar feedback.
  3. `Members Directory`: Roster of all members with search, role filters, quick verify, CGPA verification toggle (`verify-cg`), and account suspension/restoration.
  4. `Content Reports`: Community moderation queue for flagged posts and comments with one-click content removal and author suspension.
  5. `Companies`: View and manage employer partner organizations.
  6. `Analytics`: Visual Recharts graphs for registration growth, opportunity volume, and department distributions.
