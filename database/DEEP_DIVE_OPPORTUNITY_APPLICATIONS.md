# Deep Dive 4: `Opportunity (1)` ──► `applications (*)`

> **File:** `database/DEEP_DIVE_OPPORTUNITY_APPLICATIONS.md`  
> **Topic:** One-to-Many relationship between Job Postings and Student Applications  
> **Key Concepts:** One-to-Many Cardinality, Foreign Key (`opportunityId`), `onDelete: Cascade`, Anti-Duplication Constraint (`@@unique`)

---

## 1. The Real-Life Metaphor: The Campus Notice Board

Imagine walking past the Jagannath University Career Notice Board:

1. **The "1" (The Job Flyer):**  
   Sabrina (an alumna working at bKash) pins **ONE single paper flyer** to the board:  
   > *"bKash is hiring a Junior Backend Engineer! Apply on our official portal."*  
   * That single flyer is **`Opportunity (1)`**. It has its own unique ID: `opp_101`.

2. **The "\*" (The Student Applications):**  
   Over the next two weeks, 50 different students walk past that board, read the flyer, and click apply:
   * **Farhan** applies $\rightarrow$ The database creates application record #1 (`app_001`).
   * **Nusrat** applies $\rightarrow$ The database creates application record #2 (`app_002`).
   * **Tariqul** applies $\rightarrow$ The database creates application record #3 (`app_003`).
   * ...and 47 more students apply!

* That flyer is **ONE** (`1`).
* The students who applied to it are **MANY** (`*`).

---

## 2. What This Looks Like Inside the Database Spreadsheets

Look at how the two tables store this data:

### Table 1: `opportunities` (The Parent Table — "1")
There is **only ONE row** for this job post:

| `id` (PK) | `title` | `companyName` | `salaryOrStipend` | `externalUrl` |
| :--- | :--- | :--- | :--- | :--- |
| **`opp_101`** | Junior Backend Engineer | bKash Limited | BDT 60,000 / month | `https://bkash.com/careers` |

---

### Table 2: `applications` (The Child Table — "*")
There are **MANY rows**, but every single row has `opportunityId = "opp_101"`:

| `id` (PK) | `opportunityId` (FK) | `applicantId` (FK) | `status` | `externalAppliedAt` |
| :--- | :--- | :--- | :--- | :--- |
| `app_001` | **`opp_101`** | `user_farhan` | `SUBMITTED` | Nov 14, 2026 |
| `app_002` | **`opp_101`** | `user_nusrat` | `SUBMITTED` | Nov 14, 2026 |
| `app_003` | **`opp_101`** | `user_tariqul` | `SUBMITTED` | Nov 14, 2026 |
| `app_004` | **`opp_101`** | `user_sakib` | `SUBMITTED` | Nov 15, 2026 |

* Notice the column **`opportunityId`**:  
  All rows point back to the **exact same job (`opp_101`)**.
* That is why it is called a **One-to-Many** relationship.

---

## 3. How Prisma & PostgreSQL Enforce This in Code

In our file `prisma/schema.prisma`:

```prisma
model Opportunity {
  id           String        @id @default(cuid()) // The 1
  title        String
  
  // An Opportunity holds an array / list of MANY applications:
  applications Application[] 
}

model Application {
  id            String      @id @default(cuid())
  
  // The Foreign Key pointing back to the 1 Opportunity:
  opportunityId String      
  opportunity   Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  
  applicantId   String      // The student who applied
}
```

---

## 4. The Two Crucial Rules for This Relationship

### Rule 1: What happens if the job post is deleted? (`onDelete: Cascade`)
If bKash cancels the position and an admin deletes `opp_101`:
* Does the database keep 50 orphan applications pointing to a deleted job?
* **No!** Because we set `onDelete: Cascade`, PostgreSQL automatically cleans up all 50 application rows so no broken ghost data remains.

### Rule 2: Can Farhan apply to the same job twice?
* A job post can have **many** applications from **different** students.
* But **one student cannot submit duplicate applications to the exact same job post**.
* How does PostgreSQL stop Farhan from spamming?  
  Through this composite unique rule at the bottom of the `Application` model:
  ```prisma
  @@unique([opportunityId, applicantId])
  ```
  The pair `(opp_101 + user_farhan)` is allowed **only once**. If Farhan tries to save it a second time, PostgreSQL physically rejects the request.

---

## 5. Summary in 1 Sentence (For Your Defense)

> *"In our database, `Opportunity (1) ──► applications (*)` is a One-to-Many relationship where a single job posting can receive application records from multiple verified students, linked together via the `opportunityId` foreign key and protected against duplicate clicks by a database composite unique constraint."*
