# UniCareer Community — Routes & Pages Inventory

> **Stage 3 Status**: Shell layouts, navigation system, and page templates fully implemented and statically/partially prerendered with Turbopack.

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
| `/dashboard` | Member Overview, Recent Activity, Alerts | `DashboardTemplate` | **Implemented** |
| `/feed` | Redirect alias to `/dashboard` | Server redirect | **Implemented** |
| `/opportunities` | Job & Internship Portal, Filter, Search | `ListingTemplate` | **Implemented** |
| `/opportunities/[id]` | Full Job Description, Requirements, Apply CTA | `DetailsTemplate` | **Implemented** |
| `/opportunities/post` | Submit New Opportunity (Employer / Community) | `FormTemplate` | **Implemented** |
| `/community` | Member Directory, Networking & Discussions | `ListingTemplate` | **Implemented** |
| `/referrals` | Alumni Referral Hub & Sponsorships | `ListingTemplate` | **Implemented** |
| `/applications` | Candidate's Submitted Applications Tracker | `ListingTemplate` | **Implemented** |
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
