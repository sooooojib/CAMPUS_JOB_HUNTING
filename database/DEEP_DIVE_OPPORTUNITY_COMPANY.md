# Deep Dive 5: The Connection Between `Opportunity` and `Company`

> **File:** `database/DEEP_DIVE_OPPORTUNITY_COMPANY.md`  
> **Topic:** The relationship between Job Postings and Employer Companies  
> **Key Concepts:** One-to-Many (`1 : *`), Nullable Foreign Key (`companyId String?`), Partial Denormalization (`companyName`), `onDelete: SetNull`

---

## 1. What is the Relationship Between `Company` and `Opportunity`?

It is a **One-to-Many (1 : \*) Relationship**:
* **`Company (1)`**: One employer organization (e.g. *bKash Limited*).
* **`Opportunity (*)`**: That one company can have **multiple** job postings on our platform (e.g. *Junior Backend Engineer*, *Frontend React Intern*, *Data Analyst*).

```
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│          Company (1)            │ 1 ──────────────── *  │         Opportunity (*)         │
├─────────────────────────────────┤                       ├─────────────────────────────────┤
│ id: "comp_bkash"                │ (has many jobs)       │ id: "opp_01" (Backend Eng)      │
│ name: "bKash Limited"           │                       │ id: "opp_02" (Frontend Intern)  │
│ slug: "bkash-limited"           │                       │ id: "opp_03" (Data Analyst)     │
│ isVerified: true                │                       │ companyId: "comp_bkash" (FK)    │
└─────────────────────────────────┘                       └─────────────────────────────────┘
```

---

## 2. The Code Definition in `schema.prisma`

Look at how Prisma and PostgreSQL define this connection:

```prisma
model Company {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  isVerified    Boolean       @default(false)
  
  // One company has an array of MANY opportunities:
  opportunities Opportunity[] 
}

model Opportunity {
  id          String   @id @default(cuid())
  title       String
  
  // Notice the question mark (?): NULLABLE Foreign Key!
  companyId   String?  
  company     Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)

  // Denormalized plain-text company name:
  companyName String   
}
```

---

## 3. The 2 Big Architectural Secrets of This Connection

### Secret 1: Why is `companyId` NULLABLE (`String?`)?
Notice the question mark: `companyId String?`. It is an **Optional Foreign Key**.

#### Why isn't every job required to have a `companyId`?
Because UniCareer is a **Community-Shared Platform**:
* Suppose an alumnus works at **Google**, **Microsoft**, or a brand new Dhaka AI startup that does *not* have an official profile in our university `companies` directory yet.
* Should we block the alumnus from sharing the job with juniors? **No!**
* The alumnus can still post the job!
  * `companyId` is stored as **`NULL`**.
  * They simply type the name into `companyName: "Google"`.
* But if the company IS an official verified campus partner (like *bKash* or *Brain Station 23*), `companyId` stores the foreign key pointing to the `Company` row!

---

### Secret 2: Why do we have BOTH `companyId` (FK) and `companyName` (text)?
In pure database theory (3rd Normal Form), storing both an ID and the name looks redundant.  
**In real production engineering, this is called "Partial Denormalization", and it is a deliberate architectural feature:**

1. **Lightning Fast Querying:** When students load the `/opportunities` feed, PostgreSQL can display the company name immediately without having to perform an expensive SQL `JOIN` on the `companies` table for all 50 jobs on the screen.
2. **Resilience & Fault Tolerance:** If an alumnus posts a job for a startup that later gets removed from the partner directory, the job post still remembers what company it was (`companyName`).

---

## 4. What Happens if a Company is Deleted? (`onDelete: SetNull`)

Notice the delete rule:
```prisma
company Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
```

* **If we used `Cascade`:** Deleting a partner company profile would automatically wipe out every job posting associated with that company! That would destroy student job leads.
* **Our Choice (`SetNull`):** If an administrator deletes or suspends a company from the directory:
  * The job posts are **NOT deleted**.
  * The `companyId` simply turns to **`NULL`**.
  * The jobs remain live with their plain text `companyName: "bKash Limited"` and their external application links intact so students can still apply!

---

## 5. Potential Teacher / Examiner Questions & Model Answers

### Question 1: "What is the relationship between Company and Opportunity?"
> **Answer:**  
> *"It is a **One-to-Many (1 : \*) relationship**. One company can have multiple job postings on the platform. In our schema, `Opportunity` holds a nullable foreign key `companyId` referencing `Company.id`."*

### Question 2: "Why is `companyId` nullable in `Opportunity`?"
> **Answer:**  
> *"Because all opportunities on UniCareer are standardized as **Community-Shared leads** (ADR-002). Verified alumni can share job opportunities from any global employer (e.g. Google, Microsoft, remote startups) without requiring that company to register an official campus partner account first. When an opportunity is for an unlisted company, `companyId` is NULL, and the company name is stored directly in `companyName`."*

### Question 3: "Why did you use `onDelete: SetNull` instead of `onDelete: Cascade`?"
> **Answer:**  
> *"To protect historical job data and student applications. If a university administrator removes a company profile, we do not want to delete active job listings shared by our alumni. `onDelete: SetNull` safely unlinks the company while preserving the job post and applicant records."*
