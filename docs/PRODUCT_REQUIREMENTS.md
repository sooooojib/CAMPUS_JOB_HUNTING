# UniCareer Community — Comprehensive Product Requirements Document (PRD)

## 1. Product Identity & Purpose

**UniCareer Community** is a university-connected career, mentorship, and opportunity networking platform bridging **Current Students**, **Alumni**, and **University Administrators** within the institutional ecosystem.

The platform eliminates the impersonal noise, fake recruiters, and spam of open public job boards by anchoring access to verified institutional affiliation, transparent opportunity provenance, and peer advocacy.

---

## 2. Active User Personas

The platform operates on a single unified account model supporting three active personas:

1. **Student (`STUDENT`)**:
   - Currently enrolled university students.
   - Accesses personalized job recommendations, explainable skill matching, and market skill gap telemetry.
   - Logs confidential semester academic records for automated CGPA calculation.
   - Applies for opportunities, saves bookmarks, and requests internal referrals from alumni.
2. **Alumni (`ALUMNI`)**:
   - Graduated university members.
   - Posts job opportunities and verified hiring leads.
   - Reviews candidate applicants for posted roles and manages pipeline stages.
   - Evaluates incoming student referral requests and provides mentorship.
3. **Platform Administrator (`ADMIN`)**:
   - University administration / governance staff.
   - Validates student and alumni verification claims.
   - Verifies academic CGPAs and handles account suspensions.
   - Moderates opportunities and community content reports, backed by an immutable audit trail.

---

## 3. Core Modules & Feature Specifications

### 3.1 Authentication & Session Integrity
- **Public Routes**: Only `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/verify-email` are publicly accessible.
- **Registration**: Captures Full Name, Institutional Email, University ID / Student ID, and Department dropdown selection. Both University ID and Department are locked to prevent tampering.
- **Email Verification**: Mandatory verification-first security gate. Users receive a cryptographic link in their inbox. Clicking the link verifies their email and submits their profile to the Administrator Approval Queue.
- **Strict Pre-Approval Login Gate**: Unapproved accounts cannot sign in. Users must be approved by the administrator before being granted platform access.
- **Admin Approval Notification**: Upon admin approval, the user receives an official approval email granting access to sign in.
- **Return Path Retention**: `callbackUrl` query parameter preserves the user's intended route across login and verification.
- **Password Strength**: Minimum 8 characters with at least one uppercase letter, one number, and one special character.
- **Session Security**: HttpOnly, SameSite cookies with rolling updates and CSRF defense.

### 3.2 Membership Verification & Institutional Credentials
- **Credentials Capture**:
  - **Student Dossier**: Pre-populated and locked Student ID & Department, academic standing (e.g. 3rd Year / Junior), degree, graduation year, and registrar enrollment proof.
  - **Alumni Dossier**: Pre-populated and locked Department, graduation year, degree, current company, designation, and alumni proof (thesis topic, batch number, or advisor).
- **Admin Verification Queue (`/admin`)**:
  - Verification requests enter `membership_requests` with status `PENDING` only after email verification is confirmed.
  - Administrators inspect claims, review submitted evidence, and approve or reject with specific feedback.
  - Upon approval, the system immediately dispatches an official approval email to the member's university inbox and unlocks login access.
  - Verified members receive verified badges and full platform privileges.

### 3.3 Opportunities & Job Engine
- **Opportunity Types**: `INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`, `OTHER`.
- **Workplace Types**: `ON_SITE`, `REMOTE`, `HYBRID`.
- **Provenance Classification**:
  - `COMMUNITY_SHARED`: All opportunities are shared by verified community members/alumni as verified job leads with official external application portals.
- **Statuses**:
  - `APPROVED`: Active, published opportunity visible in search and feeds.
  - `REJECTED`: Opportunity rejected during administrative review with feedback.
  - `EXPIRED`: Application deadline has passed.
  - `CLOSED`: Manually closed by the poster or administrator.
- **Discovery & Search**:
  - Multi-faceted filtering by Role Type, Workplace Type, Department, and Minimum CGPA cutoff.
  - Debounced keyword search matching title, description, or hiring company.
  - Personal bookmarked opportunities collection (`/opportunities/saved`) with duplicate prevention.

### 3.4 Applications & Candidate Management
- **Application Modalities**:
  - `EXTERNAL`: Direct outbound application via official company careers portal ("Apply on Official Website").
- **Integrity & Safeguards**:
  - Database composite constraint `@@unique([opportunityId, applicantId])` prevents duplicate application records.
  - Applicants can remove their application records directly from `/applications` using the "Remove" button.
  - Deadline tracking automatically transitions expired opportunities to `EXPIRED`.
- **Applicant Management (`/opportunities/[id]/applicants`)**:
  - Author and administrator review dashboard to track candidate engagement and application status history.

### 3.5 Community Feed & Discussions
- **Feed Channels**: All Feed, Discussions & Q&A (`GENERAL_DISCUSSION`), Referrals (`REFERRAL_REQUEST`), Achievements (`ACHIEVEMENT`), and Saved Posts (`BOOKMARKED`).
- **Post Composer (`CreatePostBox`)**: Rich text editor supporting optional headline, post type selection, character count limits (10–5,000 chars), and attached opportunity cards.
- **Threaded Comments**: Hierarchical replies (`parentId`) with author editing, comment deletion, and reporting.
- **Reactions**: Single-click atomic `LIKE` toggling with real-time counter updates.
- **Content Moderation**: Flagging posts or comments with structured reasons (`SPAM`, `HARASSMENT`, `INAPPROPRIATE`, `MISINFORMATION`, `OTHER`); automatic escalation to `FLAGGED` upon receiving $\ge 3$ reports.

### 3.6 Referrals System & Contributions
- **Structured Referral Requests (`/referrals`)**:
  - Students submit tailored elevator pitches directly to alumni at specific companies.
  - Inbound queue allows alumni to review candidate qualifications, accept with personal response notes, or decline.
- **Contributions Dashboard (`/contributions`)**:
  - Telemetry tracking jobs posted, student referrals handled, and feed discussions authored.

### 3.7 Notifications & Career Calendar
- **Notification Center (`/notifications`)**: Activity alerts for application status changes, referral responses, post interactions, and deadline reminders.
- **Personal Career Calendar (`/calendar`)**: Aggregates job application deadlines, scheduled interviews, and personal career milestone notes.

### 3.8 Administrative Governance Center (`/admin`)
- **Overview**: Real-time institutional telemetry (Talent Pool, Verification Rate, Corporate Partners) and pending action alerts.
- **Verification Review Queue**: Approve or reject student/alumni credential claims with registrar notes.
- **Members Directory**: Member searching, filtering by role and verification state, one-click CGPA verification (`verify-cg`), and account suspension/restoration.
- **Content Reports**: Triage user-flagged posts and comments with content removal and author suspension actions.
- **Company Management**: Verify or suspend employer profiles.
- **Security Audit Trail**: Append-only log recording all administrative mutations with admin attribution, affected entity, stated reason, and IP address.
