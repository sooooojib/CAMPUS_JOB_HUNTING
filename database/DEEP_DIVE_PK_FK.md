# Deep Dive 1: Primary Keys (PK) & Foreign Keys (FK)

> **File:** `database/DEEP_DIVE_PK_FK.md`  
> **Topic:** The fundamental building blocks of database relations  
> **Key Concepts:** Primary Key (PK), Foreign Key (FK), CUIDs vs Integers, Cascade Rules, Composite Unique Keys

---

## 1. What is a Primary Key (PK)?

### The Real-World Metaphor: Your Student ID Roll Number
In Jagannath University, there might be multiple students with the same name (e.g. *"Farhan Ahmed"*). How does the exam office know who got an A+?
* **They don't use the name.**
* They use the unique **Student Roll / Registration Number** (e.g., `2022-CSE-042`).
* That unique roll number is the **Primary Key**.

### The 3 Non-Negotiable Rules of a Primary Key:
1. **Uniqueness:** No two rows in the same table can ever share the same PK.
2. **Never NULL:** A primary key cannot be blank or empty (`NOT NULL`).
3. **Immutability:** Once an ID is assigned to a record, it never changes.

---

## 2. Why UniCareer Uses CUIDs Instead of Numbers (1, 2, 3...)

In beginner tutorials, tables use auto-incrementing integers (`id = 1, 2, 3...`).  
**Why did we use CUID strings like `cmw3cokvg0000q2r7j7ihiggv`?**

### The Security Problem: ID Enumeration / IDOR Attack
If user IDs are simple numbers:
* Farhan logs in and sees his profile URL: `unicareer.com/profile/104`.
* Farhan immediately realizes he can type `105` or `103` into the browser address bar to snoop on other students' private data.
* Hackers can easily write a Python script to scrape every user from `1` to `10000`.

### The Production Solution: CUID (Collision-resistant Unique Identifier)
* CUIDs combine timestamps, machine fingerprints, and cryptographically secure random characters.
* They are completely unpredictable, preventing unauthorized scraping and enumeration attacks.
* They are distributed-safe and performant in serverless cloud environments (Neon PostgreSQL).

---

## 3. What is a Foreign Key (FK)?

### The Real-World Metaphor: Parent's NID on an Admission Form
When a student fills out a university admission form, there is a field:
> **Father's National ID (NID):** `1975-XXXX-XXXX`

* The student is NOT the father.
* But by writing the father's NID on the student's paper, the university can instantly look up the father's record from the national database.
* That NID on the student's paper is a **Foreign Key**. It is a **reference pointing to the Primary Key of another table**.

### Real Code Example from UniCareer:
In `Opportunity` (Job Post), we connect to the student who shared it (`User`):

```prisma
model Opportunity {
  id        String   @id @default(cuid())   // <-- PK (Opportunity's own ID)
  title     String
  
  posterId  String                          // <-- FK (Stores the User's id)
  poster    User     @relation(fields: [posterId], references: [id], onDelete: Cascade)
}
```

When someone views a job post, the system reads `posterId = "user_999"`, jumps over to the `users` table, and displays: *"Shared by Sabrina Rahman, verified alumna"*.

---

## 4. Referential Integrity & Cascade Rules (What Happens When You Delete?)

What happens to a student's applications or comments if their account is deleted?  
PostgreSQL enforces **Referential Integrity Actions**:

| Rule | What it Does in Plain English | Real Example in UniCareer |
| :--- | :--- | :--- |
| **`onDelete: Cascade`** | If the parent is deleted, **automatically delete all its children**. | When a user account is deleted, their `sessions`, `accounts`, and `profiles` are automatically wiped clean so no orphaned data remains. |
| **`onDelete: SetNull`** | If the parent is deleted, **keep the child row, but set the FK column to NULL**. | If an administrator who reviewed a job post leaves the university, the job post is NOT deleted. The `reviewerId` is set to `null` so the job stays online. |
| **`onDelete: Restrict`** | **Forbid the deletion.** The database throws an error and refuses to delete the parent if it has active children. | An admin cannot delete a university department if there are still active students enrolled in it. You must reassign the students first! |

---

## 5. Can a Foreign Key be NULL?

**Yes! Absolutely.**  
A Primary Key can **never** be NULL, but a Foreign Key **can** be NULL whenever a relationship is optional.

* **Real Example in UniCareer:**  
  In the `opportunities` table:
  ```prisma
  companyId String? // <-- Notice the question mark: Nullable Foreign Key!
  ```
  * When an alumnus posts a lead for a company that does not have an official verified profile in our directory, `companyId` is **NULL**.
  * The poster simply types `"Google"` or `"Brain Station 23"` into `companyName`.
  * But if it is an officially verified campus partner, `companyId` links to that company's row.

---

## 6. What is a "Composite Unique Key"? (Anti-Duplication)

Look at our `applications` table:
```prisma
model Application {
  id            String      @id @default(cuid()) // PK
  opportunityId String      // FK
  applicantId   String      // FK

  @@unique([opportunityId, applicantId]) // <-- COMPOSITE UNIQUE RULE
}
```
* What stops a student from double-clicking the *"Save Application"* button and inserting 2 identical records?
* **PostgreSQL enforces a Composite Unique Constraint (`@@unique`)**:  
  The combination of `(opportunityId + applicantId)` can only exist **once**. If the database sees the same student applying to the same job a second time, PostgreSQL physically rejects the second write.

---

## 7. Teacher / Examiner Q&A

### Q1: "What is the difference between a Primary Key and a Unique Key?"
> **Answer:**  
> *"A table can have only **one** Primary Key, and it cannot be NULL. However, a table can have **multiple** Unique Keys (such as `email` on users, or `slug` on companies), and Unique Keys can be nullable unless marked NOT NULL."*

### Q2: "What prevents orphan records in your database?"
> **Answer:**  
> *"Foreign Key constraints enforced directly by PostgreSQL. If someone tries to insert an application pointing to an `opportunityId` that does not exist, the database engine aborts the transaction with a Foreign Key Violation error."*

### Q3: "Why did you use CUID strings instead of auto-incrementing integers?"
> **Answer:**  
> *"Auto-incrementing integers (1, 2, 3...) expose predictable sequential IDs, leaving the system vulnerable to IDOR / URL enumeration attacks. Using CUIDs guarantees collision-resistant, unpredictable, and distributed-safe primary keys across our serverless PostgreSQL cluster."*
