# UniCareer Community — Comprehensive Product Requirements Document (PRD)

## 1. Product Identity & Purpose

**UniCareer Community** is a private, university-connected career and job-seeking community platform bridging students, alumni, faculty, staff, and authorized industry partners.

---

## 2. Complete Module & Feature Specifications

### 2.1 Authentication & Session Management
- **Public Entrypoints**: Only `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, and `/about` are publicly reachable.
- **Email Verification**: Required prior to interacting with any authenticated member feature.
- **Return Path Retention**: Query param `?callbackUrl=...` preserves the exact destination route so users return seamlessly upon login.
- **Password Strength**: Minimum 8 characters with at least one uppercase, one number, and one special character (enforced on both client and server via Zod).
- **Session Strategy**: HttpOnly, SameSite cookies with CSRF defense.

### 2.2 Membership Verification & Types
- **Membership Types**:
  - `STUDENT`: Current enrolled students.
  - `ALUMNI`: Graduated former students.
  - `FACULTY`: University teaching faculty.
  - `STAFF`: Administrative campus personnel.
  - `EMPLOYER`: Authorized corporate recruiters/partners.
  - `EXTERNAL_CONNECTION`: Vetted external mentors/partners.
- **Verification Statuses**:
  - `PENDING`: Account created and email verified, awaiting identity validation.
  - `VERIFIED`: Identity approved; full platform capabilities unlocked.
  - `REJECTED`: Submission rejected with actionable reviewer feedback.
  - `SUSPENDED`: Administrative hold on all activities.
- **Verification Channels**:
  1. *Instant Academic Record Match*: Matches student ID and institutional email against pre-seeded `university_records`.
  2. *Document Review Queue*: Manual document upload (student card, degree certificate, corporate email badge) for admin triage.

### 2.3 User & Company Profiles
- **Member Profiles**: Headline, biography, avatar, department/graduation year, skill tags, LinkedIn/GitHub links, and "Available for Mentorship" flag.
- **Student-Specific Section**: Academic records (CGPA, completed credits) visible strictly to the student and authorized academic advisors.
- **Company Profiles**: Company name, logo, industry, verified partner badge, company overview, active job listings, and affiliated team members.

### 2.4 Opportunities & Job Approval Workflow
- **Opportunity Types**: `INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`, `OTHER`.
- **Classifications**:
  - `OFFICIAL_EMPLOYER`: Submitted by an authorized employee/recruiter representing the hiring organization.
  - `COMMUNITY_SHARED`: Shared by a verified alumni/student lead; clearly labeled as a referral/lead rather than official recruitment.
- **Approval Lifecycle**:
  - Default status upon creation: `PENDING`.
  - Admin/Moderator reviews title, salary transparency, and compliance before promoting to `APPROVED`.
  - Automated deadline tracking transitions expired listings to `EXPIRED`.
  - Posters can manually mark listings as `CLOSED`.

### 2.5 Job Applications & Candidate Vault
- **Application Modalities**:
  - `INTERNAL`: Submitted on-platform with resume selection/upload and optional cover letter.
  - `EXTERNAL`: Outbound redirect link to company ATS.
- **Integrity Constraints**:
  - Database-enforced uniqueness: `@@unique([opportunity_id, applicant_id])` blocks duplicate submissions.
  - Applicants can withdraw submissions while status is `SUBMITTED` or `UNDER_REVIEW`.
- **Private Storage**: Resumes stored in private object storage; downloaded via temporary pre-signed URLs (<= 15 minute lifespan).

### 2.6 Employer Applicant Management
- Dedicated dashboard (`/employer/postings/[id]/applicants`) for authorized posters.
- Candidate pipeline columns: `SUBMITTED` → `UNDER_REVIEW` → `SHORTLISTED` → `INTERVIEWING` → `OFFERED` / `REJECTED`.
- Status updates generate historical timeline entries in `application_status_history` and trigger applicant notifications.

### 2.7 Community Feed, Posts, Comments & Reactions
- **Feed Topics / Categories**: `GENERAL`, `CAREER_ADVICE`, `JOB_ANNOUNCEMENT`, `REFERRAL_REQUEST`, `EVENT`, `ACADEMIC`.
- **Rich Post Capabilities**: Optional opportunity card embedding, code snippets, and pinned announcements.
- **Threaded Discussions**: Nested comment replies with self-referencing hierarchy.
- **Reactions**: `LIKE`, `INSIGHTFUL`, `SUPPORT`, `CELEBRATE` (one reaction type per user per post).
- **Post Bookmarking**: Personal bookmarking feed for offline reading.

### 2.8 Member Directory & Connections
- Searchable member directory filterable by role, department, graduation year, skills, and mentorship availability.
- Connection requests (`PENDING` → `ACCEPTED` / `DECLINED`) enabling direct professional networking.

### 2.9 Referrals System
- Structured referral request pipeline allowing students to submit an elevator pitch and resume directly to alumni working at target companies.
- Alumni advocate dashboard to review, offer assistance, or submit internally.

### 2.10 Student Career Tools
- **CGPA Eligibility Checker**: Real-time evaluation of student CGPA against opportunity minimum thresholds.
- **Skill Gap Analyzer**: Visual comparison between student skills and job requirements with percentage match and suggested skill additions.
- **Personalized Job Recommendations**: Algorithmic ranking prioritizing opportunities matching student department, graduation year, and skill sets.

### 2.11 Notifications & Alerts
- In-app notification center and badge count for application status updates, referral feedback, post mentions, and connection requests.

### 2.12 Admin Moderation & Audit Trails
- Central moderation dashboard (`/admin`) for:
  - Reviewing pending opportunities.
  - Processing member verification requests.
  - Investigating user reports on posts, comments, or opportunities.
  - Inspecting the immutable `audit_logs` table for administrative traceability.

---

## 3. Feature Allocation Across Implementation Stages

| Stage | Focus Area | Detailed Scope |
| :---: | :--- | :--- |
| **Stage 1** | **Design System & Shell** | Tailwind CSS tokens, shadcn/ui primitives, theme toggle (Light/Dark/System), AppNavbar, Sidebar, Footer, Responsive Layout, Loading/Empty/Error UI states. |
| **Stage 2** | **Auth & Identity Engine** | Session handler (Better Auth / Auth.js), Registration, Login, Email Verification, Membership selection, Verification queue submission, Route Guard Middleware. |
| **Stage 3** | **Opportunity Engine** | Job portal (`/opportunities`), filters, search, Posting Form (Official vs Community-shared), Admin Opportunity Review Queue, Details page. |
| **Stage 4** | **Applications & Resumes** | Application modal, resume storage integration with signed URLs, duplicate prevention, candidate withdrawal, Employer Applicant Management Kanban. |
| **Stage 5** | **Community & Networking** | Authenticated Feed, Category filters, Threaded comments, Reactions, Bookmarks, Member Directory, Connection requests. |
| **Stage 6** | **Student Career Tools** | CGPA Eligibility Checker, Skill Matching radar, Skill Gap Analyzer, Student Dashboard with deadline reminders. |
| **Stage 7** | **Referrals & Notifications** | Referral request pipeline, Alumni advocate dashboard, Notification dropdown & alert center. |
| **Stage 8** | **Admin Suite & Moderation** | Admin command center, Verification review queue, Report investigation, System Audit Logs, Platform analytics. |
| **Stage 9** | **QA, Security & Production** | Playwright E2E suites, Accessibility WCAG AA compliance, Performance optimization, Production deployment prep. |
