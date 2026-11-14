# Deep Dive 3: Why Two Tables for `users` and `profiles`? (+ What is Better Auth?)

> **File:** `database/DEEP_DIVE_USERS_VS_PROFILES.md`  
> **Topic:** The architectural separation between Authentication and Campus Identity  
> **Key Concepts:** Separation of Concerns, Better Auth, Disk I/O & RAM Cache Optimization, Data Redaction & Privacy

---

## 1. What is "Better Auth"?

**"Auth"** is short for **Authentication** — the system responsible for:
* Signing up new accounts.
* Logging users in securely.
* Scrambling (hashing) passwords so even database administrators cannot read them.
* Generating temporary cryptographic tokens for email confirmation.
* Managing session cookies so users stay logged in across page refreshes.

### The Real-World Metaphor: Hiring a Professional Security Firm
Instead of building a bank vault door yourself out of wood, you hire a licensed security firm (like Brinks) that specializes in armored doors.  
Writing custom authentication code from scratch in web applications is notoriously dangerous: one tiny mistake can expose all student passwords.

**Better Auth** is a modern, enterprise-grade open-source authentication framework for Next.js and TypeScript (`lib/auth.ts`).

In our PostgreSQL database, Better Auth automatically manages 3 specific tables:
1. **`accounts`**: Stores the password scrambled using the industry-standard `scrypt` hashing algorithm.
2. **`sessions`**: Stores active login tokens, device IP addresses, and expiration timestamps.
3. **`verifications`**: Stores temporary one-time tokens for email verification links and password resets.

---

## 2. Why Two Separate Tables: `users` vs. `profiles`?

A common question from database examiners is:
> *"Why did you create two separate tables (`users` and `profiles`)? Why not just put all the profile columns directly inside `users`?"*

While a beginner project might put all 40 columns into one table, **separating them into a 1-to-1 relationship is an industry standard best practice** (used by GitHub, LinkedIn, Supabase, and Auth0).

Here are the **5 architectural reasons** why:

```
┌───────────────────────────────────────┐         ┌──────────────────────────────────────┐
│           users Table (15 Cols)       │         │        profiles Table (25 Cols)      │
├───────────────────────────────────────┤         ├──────────────────────────────────────┤
│ • Pure Authentication & Role Security │ 1 ─── 1 │ • Campus Academic & Biography Data   │
│ • Handled by Better Auth              │         │ • Handled by UniCareer Domain        │
│ • Lean row size: fast session checks  │         │ • Heavy row size: loaded on demand   │
└───────────────────────────────────────┘         └──────────────────────────────────────┘
```

---

### Reason 1: Separation of Concerns (Auth Engine vs. University Domain)
Look at what each table actually holds in our project:
* **`users` (15 fields)**: `id`, `name`, `email`, `emailVerified`, `membershipType` (STUDENT/ALUMNI), `systemRole` (MEMBER/ADMIN), `accountStatus` (ACTIVE/SUSPENDED), `verificationStatus` (PENDING/VERIFIED).
* **`profiles` (25 fields)**: `headline`, `bio`, `department`, `studentId`, `academicYear`, `graduationYear`, `degree`, `currentCgpa`, `isCgpaVerified`, `company`, `designation`, `skills`, `projects`, `experience`, `linkedinUrl`, `githubUrl`, `phone`.

Better Auth manages login credentials. It does not know (and should not know) what a university "CGPA" or "Department" is. By separating them, we can upgrade Better Auth, add OAuth providers (like Google or GitHub), or implement biometric passkeys without touching campus academic models.

---

### Reason 2: Database Speed, RAM & Disk I/O (The Wallet vs. 50 kg Suitcase)

#### The Real-World Metaphor:
Imagine walking through the university campus gate every morning. The security guard stops you and says:
> *"Show me your Student ID Card."*

* **Case A: Your ID is in a Small Pocket Wallet (`users` table)**  
  You pull your slim wallet out of your pocket in **1 second**, show the guard your card, and walk right in.
* **Case B: Your ID is at the bottom of a 50 kg Giant Suitcase (`users + profiles` combined)**  
  Inside your suitcase, you packed winter coats, 10 textbooks, boots, and 200 family photos. Every time the guard asks for your ID, you have to heave the **50 kg suitcase** onto the table, unzip it, and dig through heavy coats just to find the ID card at the bottom.

#### In Computer Science:
1. PostgreSQL reads data from your hard drive/SSD in **8 Kilobyte disk pages**.
2. On **every single mouse click** in our web app (`/feed`, `/jobs`, `/calendar`), the server must verify the user's session:
   ```sql
   SELECT id, email, membershipType, systemRole, accountStatus FROM users WHERE id = $1;
   ```
3. If `users` is kept lean (just the pocket wallet), PostgreSQL can pack hundreds of user rows into a single 8KB disk page and keep them in fast RAM cache.
4. If bios, project descriptions, skills arrays, and portfolio links were in `users` (the 50 kg suitcase), the database would have to load heavy text off the disk on **every single click**, wasting RAM and slowing down the whole system.
5. **The solution:** The server checks the slim `users` table on every request, and only opens the heavy `profiles` table when someone specifically clicks on a profile page!

---

### Reason 3: Preventing Accidental Data Leaks (Security & Privacy)

In UniCareer, we have a **Public Member Directory** (`/community/members`) where students browse alumni and peers:
* If everything were in `users`, a simple backend query `SELECT * FROM users` could accidentally serialize sensitive security fields (`accountStatus`, password link tokens, internal admin flags) into the public JSON response.
* By isolating `profiles`, our public API queries `prisma.profile.findUnique(...)`. Sensitive authentication states are physically impossible to expose.

---

### Reason 4: The Problem of Blank Columns (Nullability & 3NF)

When a student first registers:
1. They enter **Name**, **Email**, and **Password**.
2. They click Submit.
3. At that exact second, **they do not have a bio, graduation year, LinkedIn link, or CGPA entered yet**.

* **If merged:** 25 columns would sit completely empty (`NULL`) in the `users` table for every new registration.
* **With 2 tables:** The `users` row is created lean with zero waste. The `profiles` row is created cleanly when onboarding completes.

---

### Reason 5: Role Polymorphism (Students vs. Alumni vs. Admins)

Our university platform has 3 different personas:
* **Students** have `currentCgpa`, `studentId`, `academicYear`.
* **Alumni** have `company`, `designation`, `graduationYear`.
* **Admins** (like Dean Arthur Vance) have **neither**! (The Dean does not have a student roll number or CGPA).

If merged into `users`, the table becomes a cluttered "junk drawer" of attributes that only apply to some people. Keeping profile data in its own table keeps the core user model pure.

---

## 3. Word-for-Word Defense Speech

When asked: *"Why do you have two tables for users and profiles?"*, recite this:

> *"Respected teachers, while we could technically combine them, separating `users` and `profiles` into a 1-to-1 relationship is an intentional architectural decision based on three principles:*
>
> 1. *First, **Separation of Concerns**: `users` handles authentication, sessions, and Better Auth system roles; `profiles` handles academic credentials and portfolios.*
> 2. *Second, **Performance and Disk I/O**: Session validation runs on every single request. Keeping `users` lean ensures authentication queries are fast without loading heavy bio text and portfolio arrays into memory.*
> 3. *Third, **Security**: It creates a hard boundary between private account authorization states and public member directory data, preventing accidental information disclosure."*
