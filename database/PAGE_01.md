# Page 1: "30 tables, 6 groups" (Database Overview)

> **Slide Number in Deck:** Slide 01 of 42  
> **Slide Title:** `30 tables, 6 groups`  
> **Header Badge:** `27 in use · 3 left over`  
> **Footer Note:** `Every group links back to users`

---

## 1. Visual Layout (What is Physically on Screen?)

When looking at Slide 1 in PowerPoint:
1. **Top Header**:
   - Left: `"30 tables, 6 groups"`
   - Right: `"27 in use   3 left over"`
2. **Left Side (The Central Hub)**:
   - A tall, dark blue/purple rounded rectangle card labeled **"People and login"** (marked `9 tables`).
   - Lists 9 tables vertically:
     - `users`
     - `profiles`
     - `membership_requests`
     - `departments`
     - `academic_records`
     - `skills`
     - `sessions`
     - `accounts`
     - `verifications`
3. **Right Side (5 Connected Group Cards)**:
   - Lines stretch from the purple "People" card to 5 horizontal cards stacked on the right:
     1. **Jobs and applications (6 tables)**: `opportunities`, `opportunity_bookmarks`, `opportunity_comments`, `companies`, `applications`, `manual_applications`.
     2. **Community and referrals (7 tables)**: `posts`, `comments`, `post_reactions`, `post_bookmarks`, `content_reports`, `connections`, `referral_requests`.
     3. **Alerts and calendar (4 tables)**: `notifications`, `notification_preferences`, `career_calendar_events`, `deadline_reminder_logs`.
     4. **Admin (1 table)**: `admin_audit_logs`.
     5. **Left over (no longer used) (3 tables)**: *(Grey background with dashed border)* `resumes`, `application_status_history`, `company_members`.
4. **Bottom Label**:
   - An italic caption pointing out: *"Every group links back to users"*.

---

## 2. Plain-English Concept (The Campus Metaphor)

Think of our system like a **University Campus**:
* You cannot walk into the exam hall, borrow a book from the library, or join a campus club without your **University Student ID Card**.
* The big purple box on the left (**People and login**) is the **Student ID Office**. It holds your identity (`users`), your login password (`accounts`), and your official department (`departments`).
* All the other 5 boxes on the right are **Campus Facilities**:
  * The Job Board (Jobs & applications)
  * The Student Lounge (Community & referrals)
  * The Notice Board / Bell (Alerts & calendar)
  * The Proctor / Dean's Office (Admin)
  * The Old Archive Storage (Left over)

**Why is there a line from the Left Box to EVERY box on the right?**  
Because in our database:
* A job post doesn't float in thin air — someone posted it (`userId`).
* A comment doesn't write itself — a student wrote it (`userId`).
* An administrative decision doesn't happen anonymously — an administrator made it (`adminId`).  
Every single action in our database connects back to a verified person.

---

## 3. What Do the Numbers Mean? (30 vs 27 vs 3)

* **30 Total Tables**:  
  PostgreSQL 16 running on Neon contains exactly 30 relational tables defined by our `schema.prisma`.
* **27 In Active Production Use**:  
  These 27 tables are actively queried, updated, and used by our current pages, APIs, forms, and background jobs.
* **3 Leftover Tables**:  
  `resumes`, `application_status_history`, and `company_members`.  
  * *Why are they there?* Early in development, we initially drafted features for raw PDF resume uploads and outside corporate recruiter accounts. Through software engineering evaluation (**ADR-002** in `docs/DECISIONS.md`), we eliminated third-party recruiter logins and PDF file uploads to protect students from spam and predatory job posts. We preserved these 3 models in the database schema to maintain backward migration stability and keep all test histories intact without regressions.

---

## 4. Word-for-Word Presentation Script (30–45 Seconds)

> *"Good morning respected teachers and committee members. This slide gives a high-level architectural view of our database, running on PostgreSQL 16 with Neon Serverless and Prisma ORM.*
>
> *Our schema consists of **30 tables**, organized into **6 functional domains**.*
>
> *As shown on the left, **'People and login'** is our central hub. It manages identity, authentication, and academic credentials across 9 tables.*
>
> *Every other domain on the right — from Job Opportunities to Community Discussions and Automated Reminders — connects directly back to the `users` table for strict data ownership and security.*
>
> *Currently, **27 tables are in active production use**, and **3 tables are documented legacy tables** preserved from earlier architectural iterations."*

---

## 5. Potential Teacher / Examiner Questions & Model Answers

### Question 1: "Why did you group the tables into these 6 categories instead of just showing one big list?"
> **Answer:**  
> *"In enterprise software engineering, grouping tables by functional domain enforces separation of concerns. It allows developers and evaluators to immediately see which subsystem owns which data — for example, separating authentication and session storage from campus discussions and career applications."*

### Question 2: "Why didn't you just delete the 3 leftover tables with `DROP TABLE`?"
> **Answer:**  
> *"In professional production systems, immediately dropping tables with historical migration states can corrupt migration histories and cause deployment failures. We followed Architectural Decision Record 002 (ADR-002): we safely retired their user-facing endpoints, preserved them as documented legacy tables, and verified that all 194 of our automated test suites pass cleanly."*

### Question 3: "What database engine and ORM are you using?"
> **Answer:**  
> *"We use **PostgreSQL 16** hosted on **Neon Serverless**, connected through **Prisma ORM (Prisma 7)**. This guarantees strict ACID transactions, foreign key referential integrity, and type-safe schema queries."*

### Question 4: "Why is 'People and login' considered the central hub?"
> **Answer:**  
> *"Because UniCareer Community uses a **Single Unified Account Architecture**. Instead of having separate disconnected tables for students, alumni, and administrators, every person is stored in the `users` table and distinguished by their `membershipType` and `systemRole`. Having one central identity hub makes authentication, permission gating, and relational links clean and consistent across the whole platform."*
