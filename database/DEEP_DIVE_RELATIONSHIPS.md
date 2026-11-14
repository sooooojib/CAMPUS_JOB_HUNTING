# Deep Dive 2: Database Relationships (1-to-1, 1-to-Many, Many-to-Many & Self-Referencing)

> **File:** `database/DEEP_DIVE_RELATIONSHIPS.md`  
> **Topic:** How tables communicate and link together  
> **Key Concepts:** Cardinality, Crow's Foot Notation, 1:1, 1:*, *:* (Junction Tables), Adjacency List Pattern

---

## 1. Overview of Relationships in UniCareer

```
1. One-to-One (1 : 1)       ───►  User  ──(1:1)──►  Profile
2. One-to-Many (1 : *)      ───►  User  ──(1:*)──►  Posts
3. Many-to-Many (* : *)     ───►  User  ◄─(Junction)─►  Opportunity (via Bookmarks/Applications)
4. Self-Referencing (Tree)  ───►  Comment ──(parentId)──► Comment (Threaded replies)
```

---

## 2. One-to-One (1 : 1) Relationship

### Plain-English Concept
* **Definition:** Exactly **one** record in Table A matches exactly **one** record in Table B.
* **Metaphor:** A Person and their **Passport**. One citizen can only have one active passport, and that passport belongs to only one citizen.

### Code Implementation (`User` $\leftrightarrow$ `Profile`):
```prisma
model User {
  id      String   @id @default(cuid())
  email   String   @unique
  profile Profile? // 1-to-1 link
}

model Profile {
  id         String  @id @default(cuid())
  department String
  currentCgpa Float?
  
  userId     String  @unique // <--- UNIQUE CONSTRAINT LOCKS IT TO 1-TO-1!
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### The Technical Secret: How does SQL know it's 1-to-1?
Notice that `@unique` on `userId` in `Profile`.
* In a normal relationship, the same `userId` could appear 10 times in a child table.
* By adding a **`UNIQUE` constraint** on the foreign key column, PostgreSQL physically forbids that ID from ever being used in a second profile row.
* **Result:** It is mathematically locked to exactly one match.

*(Another 1-to-1 example in our database: `User` $\leftrightarrow$ `NotificationPreference`)*

---

## 3. One-to-Many (1 : * or 1 : N) Relationship

### Plain-English Concept
* **Definition:** **One** record in Table A can connect to **Many** records in Table B. But each record in Table B belongs to only **one** parent in Table A.
* **Metaphor:** A **Mother and her Children**. A mother can have 3 children, but each child has only one biological mother.
* **Frequency:** ~80% of all relationships in real-world databases are One-to-Many.

### Code Implementation (`User` $\leftrightarrow$ `Post`):
* An alumnus can write **50 community posts**.
* But each post was authored by **only 1 person** (`authorId`).

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[] // One user has MANY posts (*)
}

model Post {
  id       String @id @default(cuid())
  title    String
  content  String
  
  authorId String // Foreign key pointing to User (NO @unique here!)
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

### Other 1-to-Many Examples in UniCareer:
* `Opportunity (1)` $\rightarrow$ `applications (*)` (One job post receives many student applications).
* `Post (1)` $\rightarrow$ `comments (*)` (One feed post contains many discussion comments).
* `User (1)` $\rightarrow$ `academic_records (*)` (One student has multiple semester GPA records).
* `Company (1)` $\rightarrow$ `opportunities (*)` (One partner company has multiple job openings).

---

## 4. Many-to-Many (* : * or M : N) Relationship

### Plain-English Concept
* **Definition:** Multiple records in Table A connect to multiple records in Table B.
* **Metaphor:** **Students and Courses**. 
  * Farhan takes 5 courses.
  * The "Database" course has 60 students enrolled in it.

### Why Relational Databases CANNOT Do Many-to-Many Directly:
In SQL, you cannot put a list of IDs into one column (e.g. `courseIds = "1, 4, 7, 12"`).  
That violates **First Normal Form (1NF)** because values must be atomic (single).

### The Solution: The "Junction Table" (Bridge / Pivot Table)
To connect two tables in a Many-to-Many relationship, we create a **third table in the middle** called a **Junction Table**.  
The Junction table turns **one Many-to-Many** into **two One-to-Many** relationships!

```
┌─────────┐                ┌───────────────────────────┐                ┌───────────────┐
│  User   │ 1 ─────────── *│    opportunity_bookmarks   │* ─────────── 1 │  Opportunity  │
│ (Table) │   (saves many) │      (Junction Table)     │  (saved by)    │    (Table)    │
└─────────┘                └───────────────────────────┘                └───────────────┘
```

### Real Example 1: `opportunity_bookmarks` (Simple Junction)
```prisma
model OpportunityBookmark {
  id            String      @id @default(cuid())
  userId        String      // FK to User
  opportunityId String      // FK to Opportunity

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  opportunity   Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)

  @@unique([userId, opportunityId]) // Cannot bookmark the same job twice!
}
```

### Real Example 2: `applications` (Rich Associative Junction)
A junction table doesn't have to hold only IDs. It can hold **business payload data** about the relationship!
* `User` (Student) applies to `Opportunity` (Job).
* The **`applications`** table is a Junction Table that connects `applicantId` + `opportunityId`, but also stores:
  * `status`: `SUBMITTED`, `SHORTLISTED`, `REJECTED`
  * `method`: `EXTERNAL`
  * `externalAppliedAt`: Timestamp of application

---

## 5. Self-Referencing / Recursive Relationships

### Plain-English Concept
* **Definition:** A table where a Foreign Key points back to **another row in the same table**.
* **Metaphor:** A **Family Tree** or **Organizational Chart**. Every Employee has a Manager, but the Manager is also an Employee in the same company!

### Real Example: Threaded Comments (`parentId`)
In `comments`, students can reply to a post, or reply to another student's reply:

```prisma
model Comment {
  id        String    @id @default(cuid())
  content   String
  postId    String    // Belongs to this post
  
  parentId  String?   // Points to ANOTHER comment.id!
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
}
```
* **Top-Level Comment (Farhan):** `id: "c1"`, `parentId: null`
* **Reply (Sabrina):** `id: "c2"`, `parentId: "c1"` (Sabrina replied to Farhan)
* **Sub-Reply (Farhan):** `id: "c3"`, `parentId: "c2"` (Farhan replied back to Sabrina)

This is known in computer science as the **Adjacency List Pattern**.

---

## 6. Summary Matrix of Relationships

| Relationship Type | Left Table (1) | Right Table (*) | Junction Table | Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **1-to-1** | `User` | `Profile` | None (Direct FK) | `Profile.userId` has `@unique` |
| **1-to-1** | `User` | `NotificationPreference` | None (Direct FK) | `NotificationPreference.userId` has `@unique` |
| **1-to-Many** | `User` | `Post` | None (Direct FK) | `Post.authorId` (No unique constraint) |
| **1-to-Many** | `Opportunity` | `Application` | None (Direct FK) | `Application.opportunityId` |
| **Many-to-Many** | `User` | `Opportunity` | **`opportunity_bookmarks`** | `@@unique([userId, opportunityId])` |
| **Many-to-Many** | `User` | `Opportunity` | **`applications`** | `@@unique([opportunityId, applicantId])` |
| **Many-to-Many** | `User` | `Post` | **`post_reactions`** | `@@unique([postId, userId, type])` |
| **Self-Referencing** | `Comment` | `Comment` | None (Direct FK) | `parentId` references `Comment.id` |
| **Peer-to-Peer** | `User` (Sender) | `User` (Receiver) | **`connections`** | `@@unique([senderId, receiverId])` |

---

## 7. Teacher / Examiner Q&A

### Q1: "How do you implement a Many-to-Many relationship in a relational database?"
> **Answer:**  
> *"Relational databases cannot store Many-to-Many relationships directly without violating 1NF. We implement a **Junction Table** (such as `opportunity_bookmarks` or `applications`) that holds foreign keys to both parent tables, turning the Many-to-Many relationship into two clean One-to-Many relationships."*

### Q2: "What is the technical difference between a 1:1 and a 1:* relationship in SQL?"
> **Answer:**  
> *"Both use a Foreign Key pointing to the parent table. The only technical difference in SQL is that in a **1-to-1 relationship, the Foreign Key column has a UNIQUE constraint**, which prevents the same parent ID from ever appearing more than once in the child table."*

### Q3: "What is an Associative Entity?"
> **Answer:**  
> *"An associative entity is a junction table that contains its own descriptive attributes beyond the foreign keys. For example, our `applications` table connects students to opportunities, but also stores `status`, `method`, and `notes`."*
