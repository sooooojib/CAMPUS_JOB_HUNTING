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
- **Email Verification**: Mandatory verification-first security gate. Users cannot sign in until clicking the cryptographic link sent to their university inbox via Gmail SMTP.
- **Return Path Retention**: `callbackUrl` query parameter preserves the user's intended route across login and verification.
- **Password Strength**: Minimum 8 characters with at least one uppercase letter, one number, and one special character.
- **Session Security**: HttpOnly, SameSite cookies with rolling updates and CSRF defense.

### 3.2 Membership Verification & Institutional Credentials
- **Credentials Capture**:
  - **Student Dossier**: Pre-populated and locked Student ID & Department, academic standing (e.g. 3rd Year / Junior), degree, graduation year, and registrar enrollment proof.
  - **Alumni Dossier**: Pre-populated and locked Department, graduation year, degree, current company, designation, and alumni proof (thesis topic, batch number, or advisor).
- **Admin Verification Queue (`/admin`)**:
  - Submissions are queued in `membership_requests` with status `PENDING`.
  - Administrators inspect claims, review submitted evidence, and approve or reject with specific feedback.
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

### 3.6 Student Career Tools (Exclusive to `STUDENT` Profiles)
- **Explainable Skill Match Score**:
  - Deterministic formula: $\frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$.
  - Color-coded badges: Green ($\ge 80\%$), Yellow ($50\%-79\%$), Red ($< 50\%$).
  - Breakdown of matched competencies vs missing requirements.
- **Campus Market Skill Gap Analysis**:
  - Compares student skills against actual hiring demand across all approved opportunities.
  - Prioritizes top missing skills and provides direct links to verified learning resources.
- **Confidential Academic Transcript Logger**:
  - Private semester GPA and credit logger (`components/career/add-semester-modal.tsx`).
  - Credit-weighted cumulative CGPA calculation: $\frac{\sum (\text{GPA}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$.
  - Academic privacy: Transcripts are strictly visible only to the student and platform administrators.

### 3.7 Referrals System & Contributions
- **Structured Referral Requests (`/referrals`)**:
  - Students submit tailored elevator pitches and resumes directly to alumni at specific companies.
  - Inbound queue allows alumni to review candidate qualifications, accept with personal response notes, or decline.
- **Contributions Dashboard (`/contributions`)**:
  - Telemetry tracking jobs posted, student referrals handled, and feed discussions authored.

### 3.8 Notifications & Career Calendar
- **Notification Center (`/notifications`)**: Activity alerts for application status changes, referral responses, post interactions, and deadline reminders.
- **Personal Career Calendar (`/calendar`)**: Aggregates job application deadlines, scheduled interviews, and personal career milestone notes.

### 3.9 Administrative Governance Center (`/admin`)
- **Overview**: Real-time institutional telemetry (Talent Pool, Verification Rate, Corporate Partners) and pending action alerts.
- **Verification Review Queue**: Approve or reject student/alumni credential claims with registrar notes.
- **Members Directory**: Member searching, filtering by role and verification state, one-click CGPA verification (`verify-cg`), and account suspension/restoration.
- **Content Reports**: Triage user-flagged posts and comments with content removal and author suspension actions.
- **Company Management**: Verify or suspend employer profiles.
- **Security Audit Trail**: Append-only log recording all administrative mutations with admin attribution, affected entity, stated reason, and IP address.
