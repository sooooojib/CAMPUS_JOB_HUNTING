# Page 2: "The full ER diagram" (30 tables · 48 links)

> **Slide Number in Deck:** Slide 02 of 42  
> **Slide Title:** `The full ER diagram`  
> **Header Badge:** `30 tables · 48 links`  
> **Reference Files:** `UniCareer_ER_Diagram.pdf` (High-res vector) & `UniCareer_Database_Tables.pdf`

---

## 1. Visual Layout (What is Physically on Screen?)

When looking at Slide 2 in PowerPoint:
1. **Header**:  
   - Left: `"The full ER diagram"`  
   - Right: `"30 tables · 48 links"`
2. **The Main Visual**:  
   A full-canvas architectural map showing all 30 database tables grouped into color-coded zones:
   - **Top Zone (Light Blue)**: **People and login** (9 tables: `users`, `profiles`, `membership_requests`, `departments`, `academic_records`, `skills`, `sessions`, `accounts`, `verifications`).
   - **Left Zone (Soft Teal)**: **Community and referrals** (7 tables: `posts`, `comments`, `post_reactions`, `post_bookmarks`, `content_reports`, `connections`, `referral_requests`).
   - **Right Zone (Warm Orange)**: **Jobs and applications** (6 tables: `opportunities`, `companies`, `applications`, `opportunity_bookmarks`, `opportunity_comments`, `manual_applications`).
   - **Center Zone (Soft Purple)**: **Alerts and calendar** (4 tables: `notifications`, `notification_preferences`, `career_calendar_events`, `deadline_reminder_logs`).
   - **Center Bottom (Light Grey)**: **Admin** (1 table: `admin_audit_logs`).
   - **Bottom Right (Dashed Grey Box)**: **Left over (no longer used)** (3 tables: `resumes`, `application_status_history`, `company_members`).

3. **The Connection Lines**:
   - **Thick Orange Lines**: Route from all domain tables directly into the `users` table at the top.
   - **Blue Lines with `1` and `*`**: Show specific relationships between entities (e.g. from `companies` to `opportunities`, or `posts` to `comments`).
   - **Dashed Grey Lines**: Connect into the 3 retired legacy tables.

---

## 2. Plain-English Concept (The City Road Map Analogy)

Think of Slide 1 as a **high-level overview of city districts** (Commercial, Residential, Campus).  
**Slide 2 is the detailed Google Maps street view showing how every building is connected:**

1. **Why do cards only show PK and FK here instead of all 328 columns?**  
   If we listed all columns on one slide, the text would be unreadable. By showing only **PK (Primary Keys)** and **FK (Foreign Keys)**, this diagram focuses purely on the **structural skeleton** of the system.
2. **The "Orange Bus Route" Analogy**:  
   Almost every table needs to know *which user* created it. If we drew 27 individual lines across the screen into `users`, it would look like tangled spaghetti. Instead, we used an **orange bus-line design**: each cluster bundles its user-links into one clean orange route leading straight to `users.id`.
3. **Cardinality (`1` and `*`)**:  
   - **`1`** means Parent (The One).
   - **`*`** means Children (The Many).
   - *Example:* On the blue line between `opportunities (1)` and `applications (*)`:
     * One job opportunity (`1`) can receive multiple student applications (`*`).
   - *Example:* On the blue line between `posts (1)` and `comments (*)`:
     * One feed discussion (`1`) can have multiple replies (`*`).

---

## 3. Deep Dive into the 48 Relationships (Links)

In a relational database (RDBMS), a **link** is not just a visual arrow — it is a **Foreign Key constraint** enforced by PostgreSQL:
1. **Referential Integrity**:  
   If a table has `FK users`, PostgreSQL physically forbids inserting an ID that doesn't exist in `users`. You cannot create "ghost" data.
2. **Cascade vs. Restrict Rules**:
   - **`onDelete: Cascade`**: If a student account is deleted, their personal bookmarks, draft applications, and session tokens are automatically cleaned up to prevent orphaned junk data.
   - **`onDelete: Restrict` or `SetNull`**: If a company profile is removed or an admin reviewer leaves, the job posts and audit logs are preserved with `companyId = null` so historical records are never destroyed.

---

## 4. Word-for-Word Presentation Script (30–45 Seconds)

> *"Moving to Slide 2, this is the complete Entity-Relationship diagram of our database, mapping all **30 tables and 48 relational links**.*
>
> *To keep this architectural view clean and readable, each table card displays only its key columns: **Orange PK** for Primary Keys, and **Blue or Brown FK** for Foreign Keys.*
>
> *Notice the **thick orange lines**: these represent foreign keys connecting back to the `users` hub at the top.*
>
> *The **blue lines** depict entity-to-entity business logic, labeled with **1** and **asterisk (*)** for One-to-Many relationships — for instance, one company linking to multiple opportunities, or one post containing multiple threaded comments.*
>
> *Finally, the **grey dashed cluster** at the bottom right highlights our 3 legacy tables, clearly separated from active production data.*
>
> *A high-resolution, vector copy of this exact diagram is available in our documentation as `UniCareer_ER_Diagram.pdf`."*

---

## 5. Potential Teacher / Examiner Questions & Model Answers

### Question 1: "What does the asterisk (*) on the relationship lines mean?"
> **Answer:**  
> *"The asterisk represents the 'Many' side of a One-to-Many relationship. For example, between `users` (1) and `applications` (*), it means one student can submit many external application records, but each specific application record belongs to exactly one student."*

### Question 2: "Why are the lines leading to `users` grouped into thick orange lines?"
> **Answer:**  
> *"In diagram architecture, this is known as a **bus routing pattern**. Because almost every table in a user-centric platform references `users.id`, drawing 27 individual crisscrossing lines creates visual clutter. Bundling them into regional bus lines clearly communicates that every subsystem is rooted in user identity while preserving diagram readability."*

### Question 3: "Are these relationships enforced at the application layer or database layer?"
> **Answer:**  
> *"They are enforced directly at the **database layer** in PostgreSQL 16 via Foreign Key constraints managed by Prisma ORM. This guarantees that even if a backend script has a bug, the database engine will reject invalid, mismatched, or orphaned foreign keys."*

### Question 4: "Where can we see the complete list of all 328 columns?"
> **Answer:**  
> *"The upcoming slides break down each cluster individually with interactive zoom capabilities. Additionally, the complete column-by-column schema specification with data types and indices is exported in `UniCareer_Database_Tables.pdf`."*
