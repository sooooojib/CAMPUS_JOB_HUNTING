# Page 3: Group 1 — "People and login" (9 tables)

> **Slide Number in Deck:** Slide 03 of 42 (Slides 04–12 are its interactive Zoom slides)  
> **Slide Title:** `People and login`  
> **Header Badge:** `9 tables`  
> **Interactive Morph:** Clicking any table card in presentation mode zooms into its full schema slide!

---

## 1. Visual Layout (What is Physically on Screen?)

When looking at Slide 3 in PowerPoint, you see 4 vertical columns of table cards arranged around `users`:

```
 Column 0                Column 1                  Column 2 (Center)            Column 3
┌──────────────┐       ┌─────────────────────┐    ┌────────────────────┐      ┌───────────┐
│ departments  │       │      profiles       │───►│       users        │◄─────│ sessions  │
│  (Lookup)    │       │   (1:1 with user)   │    │    (Central Hub)   │      │ (Cookies) │
├──────────────┤       ├─────────────────────┤    └────────────────────┘      ├───────────┤
│    skills    │       │ membership_requests │───────────────▲                │ accounts  │
│  (Lookup)    │       │    (Verification)   │               │                │(Passwords)│
├──────────────┤       ├─────────────────────┤               │                └───────────┘
│verifications │       │  academic_records   │───────────────┘
│(Email Tokens)│       │ (Semester Transcripts)
└──────────────┘       └─────────────────────┘
```

### The 4 Visual Zones:
1. **Column 0 (Lookup Lists & Tokens):**
   * **`departments`**: Official university department lookup list (`id`, `code`, `name`, `faculty`).
   * **`skills`**: Standardized industry skills dictionary (`id`, `name`, `category`).
   * **`verifications`**: One-time cryptographic email link tokens (`identifier`, `value`, `expiresAt`).
2. **Column 1 (Academic & Verification Dossiers):**
   * **`profiles`**: 1-to-1 extension holding student bio, CGPA, and social links.
   * **`membership_requests`**: The approval queue dossier storing institutional claims and registrar review notes.
   * **`academic_records`**: Student transcript records by semester (`semester`, `gpa`, `credits`).
3. **Column 2 (The Central Heart):**
   * **`users`**: The core account identity (`email`, `name`, `membershipType`, `systemRole`, `verificationStatus`, `emailVerified`).
4. **Column 3 (Better Auth Security Infrastructure):**
   * **`sessions`**: Active login sessions, device IP addresses, and cookie expiry dates.
   * **`accounts`**: Credential store holding the scrypt-hashed password.

---

## 2. Plain-English Concept (The Campus ID & Registrar Office)

Think of Slide 3 as the **University Registrar & Security Office**:
* **`users`** is your **Student Identity File**.
* **`accounts` & `sessions`** are the **Keys to the Front Gate** (passwords and electronic keycards).
* **`profiles`** is your **Public Student Portfolio** (what people see in the campus yearbook).
* **`membership_requests`** is the **Application Form on the Registrar's Desk** waiting for approval.
* **`academic_records`** is your **Official Grade Transcript** (Semester by Semester).
* **`departments` & `skills`** are the **Pre-Printed Dropdown Menus** so people don't misspell "Computer Science" as "Comp Sci".

---

## 3. Deep Dive into the 9 Tables

### 1. `users` (The Central Sun)
* **What it stores:** Core identity and permission flags.
* **Key Columns:** `id` (PK), `email` (UQ), `name`, `membershipType` (`STUDENT`/`ALUMNI`), `systemRole` (`MEMBER`/`ADMIN`), `verificationStatus` (`PENDING`/`VERIFIED`/`REJECTED`), `emailVerified` (Boolean).
* **Why it's in the center:** Every other table in this group (and in the entire database) points to `users.id`.

### 2. `profiles` (1-to-1 Student/Alumni Biography)
* **What it stores:** University ID, CGPA, graduation year, LinkedIn/GitHub links, bio.
* **Foreign Key:** `userId` points to `users.id`.
* **Constraint:** `userId` is marked `@unique` $\rightarrow$ Enforcing that 1 user has exactly 1 profile.

### 3. `membership_requests` (The Administrator Verification Queue)
* **What it stores:** When a student confirms their email, a request row is created here with their uploaded proof (thesis topic, ID card scan, advisor name).
* **Two Foreign Keys:**
  1. `userId`: The student requesting access.
  2. `reviewerId`: The Administrator who approved or rejected the dossier.
* **Columns:** `status` (`PENDING`, `APPROVED`, `REJECTED`), `rejectionReason`.

### 4. `academic_records` (Official Transcript by Semester)
* **What it stores:** Semester GPA and credits earned (e.g. *Semester 1: GPA 3.85, Credits 18*).
* **Composite Unique Rule:** `@@unique([userId, semester])` $\rightarrow$ A student cannot enter two conflicting grade records for the same semester!

### 5. `departments` (University Faculty Directory)
* **What it stores:** Jagannath University’s canonical academic departments (e.g., Code `CSE`, Name `Computer Science and Engineering`, Faculty `Science`).
* **Relationship:** Standalone reference lookup list (no foreign keys).

### 6. `skills` (Master Skills Dictionary)
* **What it stores:** Categorized tech and professional skills (`React`, `PostgreSQL`, `Docker`, `Public Speaking`).
* **Relationship:** Standalone reference lookup list.

### 7. `accounts` (Better Auth Secure Password Vault)
* **What it stores:** The encrypted password.
* **Security:** Uses `scrypt` hashing algorithm with salts. Plain-text passwords never exist on our server or database.

### 8. `sessions` (Device Cookie Storage)
* **What it stores:** Every time you log in from Chrome or your phone, a session row is inserted with a random cryptographic `token` and `expiresAt` timestamp. When you log out, this row is deleted.

### 9. `verifications` (Temporary Email Tokens)
* **What it stores:** The secret one-time token sent in your signup link: `unicareer.com/verify-email?token=xyz`. Once clicked or expired, it is deleted.

---

## 4. The Interactive Zoom Feature (Slides 04–12)

During your presentation in PowerPoint:
* **Every card on Slide 3 is clickable!**
* If a teacher points to `academic_records` or `users` and asks: *"What exact data types are stored in that table?"*
  * **Click the card** $\rightarrow$ PowerPoint smoothly Morphs to that table's dedicated slide (e.g. Slide 10 for `users` or Slide 09 for `academic_records`).
  * You will see every column, its PostgreSQL type (`text`, `timestamp`, `bool`, `enum`), and tags for **PK**, **FK**, and **UQ**.
  * **Click anywhere on the zoomed slide** $\rightarrow$ It smoothly zooms back to Slide 3!

---

## 5. Word-for-Word Presentation Script (30–45 Seconds)

> *"Moving to Slide 3, this is our core domain: **'People and login'**, composed of 9 tables.*
>
> *At the center is **`users`**, which serves as the single source of truth for identity and permissions across our 3 active personas: Students, Alumni, and Administrators.*
>
> *To the left, we separate academic credentials into **`profiles`** via a strict 1-to-1 relationship, alongside **`academic_records`** for semester-by-semester transcripts, and **`membership_requests`** for the administrative approval queue.*
>
> *On the right, we delegate security plumbing to **Better Auth**, which manages encrypted scrypt password hashes in **`accounts`**, active device cookies in **`sessions`**, and cryptographic email tokens in **`verifications`**.*
>
> *Finally, **`departments`** and **`skills`** serve as standardized lookup lists to maintain data integrity across the campus community."*

---

## 6. Potential Teacher / Examiner Questions & Model Answers

### Question 1: "Why do you have a separate `membership_requests` table if you already have `users.verificationStatus`?"
> **Answer:**  
> *"Separation of audit state from user identity. The `users` table only records the current status (`PENDING` or `VERIFIED`). The `membership_requests` table stores the actual verification dossier: who the reviewing administrator was (`reviewerId`), the submitted institutional proof details, the decision timestamp, and the actionable feedback (`rejectionReason`) if rejected. This preserves a complete historical record if a student resubmits their credentials."*

### Question 2: "How does `academic_records` prevent a student from entering conflicting grades for the same semester?"
> **Answer:**  
> *"PostgreSQL enforces a composite unique constraint: `@@unique([userId, semester])`. Even if a user attempts to submit multiple grades for 'Semester 3', the database engine rejects the duplicate write."*

### Question 3: "Where are user passwords stored, and how are they protected?"
> **Answer:**  
> *"Passwords are stored in the `accounts` table managed by Better Auth. They are never stored as plain text; they are encrypted using the memory-hard `scrypt` hashing algorithm with unique cryptographic salts."*

### Question 4: "Why are `departments` and `skills` not linked with foreign keys to `profiles`?"
> **Answer:**  
> *"They act as standardized lookup dictionaries. Storing canonical department names and skills arrays as text in `profiles` gives us fast read performance without complex joins, while the `departments` and `skills` tables populate UI dropdowns and autocomplete menus."*
