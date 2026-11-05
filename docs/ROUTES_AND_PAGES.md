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
| `/calendar` | Personal Career Calendar (Deadlines, Interviews, Saved Targets, Custom Reminders) | `ListingTemplate` + `CareerCalendarView` | **Implemented (Stage 12)** |
| `/contributions` | Shared Leads, Referrals Offered, Community Posts | `DashboardTemplate` | **Implemented** |
| `/notifications` | Activity alerts, status updates & announcements | `ListingTemplate` + `NotificationsCenterView` | **Implemented (Stage 12)** |
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

---

## 2. Stage 11: Student Career Tools & Smart Matching (`/career-tools`)

### Overview
- **Path**: `/career-tools`
- **Target Role**: Enrolled Students (`STUDENT` membership role).
- **Access Guard**: `canAccessStudentTools(user)`. Non-student profiles receive a graceful role explanation and redirect links to opportunities and community feeds.
- **Client View**: `components/career/career-dashboard-view.tsx`

### Functional Tabs & Features:
1. **Personalized Opportunity Recommendations**:
   - Algorithmic skill matching score: $\frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$.
   - Strict color coding: Green ($\ge 80\%$), Yellow ($50\% - 79\%$), Red ($< 50\%$).
   - Breakdown of matched vs missing competencies.
   - Institutional eligibility badge (`ELIGIBLE`, `NOT_ELIGIBLE`, `NEEDS_REVIEW`) and specific checklist warnings (CGPA cutoff, target department, academic year standing, application deadline).
   - Mandatory disclaimer: High match score does not guarantee academic eligibility, interview shortlisting, or job offers.
2. **Skill Gap & Curriculum Analytics**:
   - Real campus market demand frequency calculated across all active approved opportunities.
   - Categorized view of verified student skills vs missing skills.
   - Top 5 prioritized learning recommendations based on market demand.
   - Curated list of verified external learning resources (official documentation, university tracks) matching student's priority gaps.
3. **Academic Performance & Semester Log**:
   - Confidential semester transcript logger (`components/career/add-semester-modal.tsx`).
   - Credit-weighted cumulative CGPA calculation: $\frac{\sum (\text{GPA}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$.
   - Auto-synced `Profile.currentCgpa` cached field.
   - Semester history table with Term, GPA, Credits, Standing, Notes, and record removal.
   - Strict academic privacy: Academic records visible only to the student and platform administrators.

---

## 3. Stage 12: Notifications, Activity Alerts & Personal Career Calendar

### 3.1 Notification Center (`/notifications`)
- **Path**: `/notifications`
- **Component**: `components/notifications/notifications-center-view.tsx`
- **Features**:
  - Filter tabs: All Alerts, Unread, Applications, Opportunities, Community, Referrals.
  - Granular action controls: "Mark as Read", "Mark All as Read", "Dismiss / Delete".
  - Deep-link action targets: Direct navigation to related applications, job descriptions, community posts, or referral requests.
  - Real-time unread counter badge.
  - Recipient-isolated data fetching: Members can only view and mutate their own notifications.
  - Header Popover integration (`components/navigation/notifications-popover.tsx`): Displays recent unread notifications and links directly to the full notification center.

### 3.2 Personal Career Calendar (`/calendar`)
- **Path**: `/calendar`
- **Component**: `components/calendar/career-calendar-view.tsx`
- **Features**:
  - Full-month calendar grid (7 days x 5-6 weeks) with previous/next month navigation and "Today" quick button.
  - Automated event aggregation:
    - Target Application Deadlines (Blue badge)
    - Active Interview Rounds & Stages (Emerald badge)
    - Saved / Bookmarked Opportunity Closures (Amber badge)
    - Custom Career Notes & Reminders (Purple badge)
  - Interactive Event Detail Dialog: Displays title, company name, date/time, action links to the opportunity/application, and reminder deletion.
  - "Add Career Reminder" Modal (`components/calendar/add-event-modal.tsx`): Allows scheduling custom reminders, interview preps, and milestone notes.

### 3.3 Notification Channels & Preferences (`/settings`)
- **Path**: `/settings` (Section 4)
- **Component**: `components/settings/notification-preferences-card.tsx`
- **Features**:
  - Independent In-App and Email toggles across 5 key functional categories:
    - Opportunities & Matches
    - Applications & Status
    - Community & Networking
    - Membership & Verification
    - Reminders & Deadlines
  - Instant preferences synchronization with `/api/notifications/preferences`.
  - Notification suppression: When a channel is toggled off, automated notification services suppress dispatches accordingly.

---

## 4. Stage 13: Complete Admin Dashboard and Moderation Command Center (`/admin`)

### Overview
- **Path**: `/admin`
- **Target Role**: Platform Administrators (`systemRole === "ADMIN"`).
- **Access Guard**: `isPlatformAdmin(currentUser)`. Non-admins receive an immediate HTTP 403 / Access Restricted interface.
- **Client Container**: `components/admin/admin-dashboard-container.tsx`
- **Layout**: `AdminTemplate` with real-time clearance badges and action alerts.

### Functional Command Tabs:
1. **Overview (`components/admin/admin-overview-view.tsx`)**:
   - Institutional governance metric cards: Total registered members, verified members, active opportunities, total applications, community posts, pending reports, suspended accounts, and registered companies.
   - Actionable alert banners with direct navigation buttons for pending verifications, opportunity reviews, and content reports.
   - Zero fake data guarantee: All metrics computed directly from PostgreSQL rows.
2. **Members Management (`components/admin/admin-members-table.tsx`)**:
   - Search by name, email, department, or student ID.
   - Granular filters by Membership Type, Verification Status, and Account Status.
   - Member profile and latest verification claim inspection modal.
   - Account Suspension / Restoration modal with mandatory stated reason ($\ge 5$ characters) and self-suspension blocking.
3. **Opportunity Moderation (`components/admin/admin-opportunity-table.tsx`)**:
   - Status tabs: Pending Review, Approved, Rejected, Closed, All.
   - Search by title, keyword, company; filter by opportunity type.
   - Moderation actions: Approve, Reject (with mandatory feedback reason $\ge 5$ characters sent to author), Close, Delete.
   - Comprehensive posting details dialog with department targeting and applications count.
4. **Verifications Queue (`components/admin/verification-table.tsx`)**:
   - In-depth review of student, alumni, faculty, staff, employer, and external connection credential requests.
   - Approval and rejection with registrar feedback.
5. **Content Moderation (`components/admin/admin-reports-table.tsx`)**:
   - Community moderation queue for flagged posts and comments.
   - Previews flagged content snippets, reporter justifications, and author details.
   - Actions: Dismiss Report, Remove Inappropriate Content, Suspend Author.
6. **Company Management (`components/admin/admin-companies-table.tsx`)**:
   - View all employer companies, creators, member counts, and opportunity counts.
   - Actions: Verify / Unverify organization, Suspend / Restore company profile (suspending prevents posting).
7. **Institutional Analytics (`components/admin/admin-analytics-view.tsx`)**:
   - Recharts visual graphs computed from actual database aggregates:
     - Member Registrations Over Time (Line Chart)
     - Opportunity Volume: Created vs Approved (Bar Chart)
     - Department Participation: Members & Applications (Horizontal Bar Chart)
     - Opportunity Types & Member Verification Distributions (Donut / Pie Charts)
8. **Audit Trail (`components/admin/admin-audit-table.tsx`)**:
   - Searchable, filterable security event ledger.
   - Filter by Action Enum and Target Entity Type.
   - Displays timestamp, administrator, action badge, target entity/label, stated reason, and client IP address.
   - Modal to inspect full JSON payload and pre/post transition state metadata.


