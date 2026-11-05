# UniCareer Community — Routes & Pages Inventory

> **Stage 10 Status**: Searchable Member Directory (`/community`), Member Profiles (`/profile/[id]`), Direct Connection Engine, and Dedicated Referrals Hub (`/referrals`) fully implemented and verified against PostgreSQL.

## 1. Route Map & Implementation Status

### 1.1 Public Routes (Unauthenticated Allowed)
| Route | Component / Purpose | Layout Group | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/` | Landing / Marketing Homepage (No Private Data Leaks) | `app/(public)/layout.tsx` | **Implemented** |
| `/about` | Institutional background & mission | `app/(public)/layout.tsx` | **Implemented** |
| `/terms` | Community Terms of Service & Integrity Standards | `app/(public)/layout.tsx` | **Implemented** |
| `/privacy` | Privacy Policy & Private Resume Vault Guarantees | `app/(public)/layout.tsx` | **Implemented** |
| `/login` | Member Login with redirect support | `app/(auth)/layout.tsx` | **Implemented** |
| `/register` | Member Registration & Role Selection | `app/(auth)/layout.tsx` | **Implemented** |
| `/forgot-password` | Password Reset Request | `app/(auth)/layout.tsx` | **Implemented** |

### 1.2 Authenticated Member Routes (Protected Application Shell)
All wrapped by `app/(dashboard)/layout.tsx` using `<AuthenticatedShell>`:

| Route | Purpose | Template Used | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/dashboard` | Member Overview, Recent Activity, Alerts & Live Feed | `DashboardTemplate` + `CommunityFeedView` | **Implemented (Stage 9)** |
| `/feed` | Dedicated University Community Feed, Discussions, Questions & Advice | `DashboardTemplate` + `CommunityFeedView` | **Implemented (Stage 9)** |
| `/opportunities` | Job & Internship Portal, Live Filter, Keyword Search, Pagination | `OpportunitiesBrowser` | **Implemented (Stage 7)** |
| `/opportunities/[id]` | Full Job Description, Requirements, Apply Routing, Related Openings | Server Page + `OpportunityDetailActions` | **Implemented (Stage 7)** |
| `/opportunities/[id]/applicants` | Recruiter Applicant Management Pipeline & Dossier Review | `EmployerApplicantManager` | **Implemented (Stage 8)** |
| `/opportunities/post` | Submit Opportunity (Managed Company or Community Lead, Preview Mode) | `OpportunityForm` | **Implemented (Stage 7)** |
| `/opportunities/my` | Author Console (Status Tabs, Edit, Close, Resubmit Rejected) | `MyOpportunitiesView` | **Implemented (Stage 7)** |
| `/opportunities/saved` | Member Bookmarked Opportunities Collection | `OpportunitiesBrowser` (Bookmarked Mode) | **Implemented (Stage 7)** |
| `/community` | Member Directory & Campus Network Search | `ListingTemplate` + `MemberDirectoryView` | **Implemented (Stage 10)** |
| `/referrals` | Dedicated Referral Hub, Inbound & Outbound Requests Tracker | `ListingTemplate` + `ReferralsHubView` | **Implemented (Stage 10)** |
| `/profile/[id]` | Member Profile, Connection State, Shared Network, Recent Activity | `ProfileTemplate` + `ProfileActions` | **Implemented (Stage 10)** |
| `/applications` | Candidate's Submitted Applications Tracker & Withdrawal | `MyApplicationsView` | **Implemented (Stage 8)** |
| `/contributions` | Shared Leads, Referrals Offered, Community Posts | `DashboardTemplate` | **Implemented** |
| `/notifications` | Activity alerts, status updates & announcements | `ListingTemplate` | **Implemented** |
| `/profile/me` | Current Member Profile & Experience | `ProfileTemplate` | **Implemented** |
| `/settings` | Edit Personal Profile, Privacy, Vault Security | `FormTemplate` | **Implemented** |

### 1.3 Student Career Tools (Exclusive to `STUDENT` Profiles)
| Route | Purpose | Template Used | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/career-tools` | Student Career Hub, CGPA Eligibility, Skill Matching, Vault | `DashboardTemplate` | **Implemented** |

### 1.4 Admin & Moderation Routes
| Route | Purpose | Template Used | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/admin` | Administration Command Center, Review Queues, Audit Trail | `AdminTemplate` | **Implemented** |

### 1.5 System & Design Showcase
| Route | Purpose | Layout Group | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/design-system` | Live Interactive Token & Component Showcase | `app/design-system/layout.tsx` | **Implemented** |
