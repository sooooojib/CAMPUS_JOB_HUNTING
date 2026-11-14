# Page 13: Group 2 — "Jobs and applications" (6 tables)

> **Slide Number in Deck:** Slide 13 of 42 (Slides 14–19 are its interactive Zoom slides)  
> **Slide Title:** `Jobs and applications`  
> **Header Badge:** `6 tables`  
> **Interactive Morph:** Clicking any card zooms into its full column specification!

---

## 1. Visual Layout (What is Physically on Screen?)

When looking at Slide 13 in PowerPoint, you see 4 columns with `opportunities` acting as the centerpiece:

```
 Column 0                Column 1                        Column 2 (Center)               Column 3
┌─────────────────────┐┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐
│ manual_applications ││         companies         │◄──│       opportunities       │──►│ opportunity_bookmarks │
│ (Off-campus tracker)││(Admin-verified directory) │   │     (Central Job Post)    │   │  (Saved Jobs List)    │
└─────────────────────┘├───────────────────────────┤   └───────────────────────────┘   ├───────────────────────┤
                       │       applications        │◄─────────────────┘                │ opportunity_comments  │
                       │(External apply tracker)   │                                   │(Q&A under job posts)  │
                       └───────────────────────────┘                                   └───────────────────────┘
```

### The 4 Visual Zones:
1. **Column 0 (Personal External Tracker):**
   * **`manual_applications`**: Lets students track jobs found outside UniCareer (e.g. from BDJobs or LinkedIn).
2. **Column 1 (Companies & Applications):**
   * **`companies`**: Institutional directory of verified employers (`name`, `slug`, `isVerified`, `isSuspended`).
   * **`applications`**: Outbound external application tracking records.
3. **Column 2 (The Central Job Hub):**
   * **`opportunities`**: The primary job post (`title`, `companyName`, `type`, `salaryOrStipend`, `deadline`, `externalUrl`, `status`).
4. **Column 3 (Engagement & Bookmarks):**
   * **`opportunity_bookmarks`**: Saved favorites list for students.
   * **`opportunity_comments`**: Public questions and discussion comments under the job post.

---

## 2. Plain-English Concept (The Campus Career Notice Board)

Think of Slide 13 as the **Campus Career Placement Center**:
* **`opportunities`** is the **Printed Job Flyer** pinned to the notice board by a verified alumnus.
* **`companies`** is the **Official Directory of Registered Partner Companies** stamped by the university administration.
* **`applications`** is the student's **Application Tracker Card** (*"I went to the company's website and submitted my application on Nov 14"*).
* **`opportunity_bookmarks`** is the student's **Saved Bookmark Folder** (*"I want to apply to this on Friday"*).
* **`opportunity_comments`** is the **Sticky Notes section** on the flyer where students ask: *"Is this open to 3rd-year students?"*
* **`manual_applications`** is the student's **Personal Job Diary** for tracking jobs they found outside campus.

---

## 3. Deep Dive into the 6 Tables

### 1. `opportunities` (The Centerpiece)
* **What it stores:** All job and internship listings.
* **Key Columns:** `title`, `companyName`, `type` (`FULL_TIME`/`INTERNSHIP`), `workplaceType` (`ON_SITE`/`REMOTE`/`HYBRID`), `salaryOrStipend`, `deadline`, `externalUrl`, `status` (`APPROVED`/`EXPIRED`/`CLOSED`).
* **Source Type:** Standardized as `COMMUNITY_SHARED` leads posted by verified campus members.

### 2. `companies` (Verified Employer Directory)
* **What it stores:** Corporate profiles verified by university administrators.
* **Relationship:** Connected to `opportunities` via a **Nullable Foreign Key (`companyId String?`)**.
* **Why Nullable?** Alumni can share opportunities from any employer (like Google or a remote startup) without that company needing an official account.

### 3. `applications` (Outbound Application Tracking)
* **What it stores:** Records when a student clicks *"Apply on Official Website"* and tracks the status in their personal dashboard.
* **Composite Unique Rule:** `@@unique([opportunityId, applicantId])` $\rightarrow$ Prevents duplicate applications.
* **Method:** Enforces `method = EXTERNAL` (no unverified PDF resume uploads).

### 4. `opportunity_bookmarks` (Saved Jobs)
* **What it stores:** Bookmarked jobs.
* **Composite Unique Rule:** `@@unique([userId, opportunityId])` $\rightarrow$ You cannot bookmark the same job twice.

### 5. `opportunity_comments` (Job Q&A Discussions)
* **What it stores:** Public comments and questions asked directly under a job post.
* **Columns:** `id`, `opportunityId`, `authorId`, `content`, `createdAt`.

### 6. `manual_applications` (Personal Career Journal)
* **What it stores:** Applications that students submitted outside of UniCareer.
* **Columns:** `userId`, `companyName`, `roleTitle`, `status`, `appliedDate`.

---

## 4. Word-for-Word Presentation Script (30–45 Seconds)

> *"Moving to Slide 13, this is **'Jobs and applications'**, consisting of 6 tables centered around **`opportunities`**.*
>
> *Under our Architectural Decision Record (ADR-002), all opportunities are standardized as **community-shared leads** directing students to official corporate application portals via **`externalUrl`**.*
>
> *The **`companies`** table provides an administrator-verified directory of recognized partner employers. Crucially, the connection between `opportunities` and `companies` uses a **nullable foreign key**, ensuring alumni can post leads from any global organization without administrative friction.*
>
> *Student applications are tracked in **`applications`**, protected against duplicates by a database composite unique constraint, while **`opportunity_bookmarks`** and **`opportunity_comments`** facilitate student engagement.*
>
> *Finally, **`manual_applications`** acts as a personal career ledger for students to track off-campus applications in one unified dashboard."*

---

## 5. Potential Teacher / Examiner Questions & Model Answers

### Question 1: "Why don't students upload PDF resumes into your database?"
> **Answer:**  
> *"Per ADR-002, storing arbitrary binary PDFs in the database exposes students to privacy leaks and predatory scraping. Instead, UniCareer connects students to official company ATS hiring portals (`EXTERNAL`), keeping student data safe and tracking application milestones on their personal dashboard."*

### Question 2: "What happens if a partner company is deleted from the database?"
> **Answer:**  
> *"The foreign key uses `onDelete: SetNull`. The company profile is unlinked, but the active job listings are not destroyed. They remain visible to students with their plain-text `companyName` and application link intact."*

### Question 3: "How do you stop a student from saving the same job 10 times?"
> **Answer:**  
> *"PostgreSQL enforces a composite unique constraint: `@@unique([opportunityId, applicantId])`. Duplicate writes are rejected at the database engine level."*
