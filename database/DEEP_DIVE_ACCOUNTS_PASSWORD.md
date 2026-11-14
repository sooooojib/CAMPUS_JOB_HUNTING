# Deep Dive 6: Why the Password is in `accounts` and Not in `users`

> **File:** `database/DEEP_DIVE_ACCOUNTS_PASSWORD.md`  
> **Topic:** Credential isolation, password security, and OAuth multi-provider design  
> **Key Concepts:** Separation of Identity vs. Authentication, Accidental Data Leaks, `scrypt` Password Hashing, Better Auth Specification

---

## 1. The Real-World Metaphor: The Face vs. The Room Key

* **Your `users` table** is your **Face and Name**:
  * Everyone on campus can see who you are when you walk into class or post in the community feed.
* **Your `accounts` table** is the **Brass Key in your pocket**:
  * It unlocks your dorm room. You keep it locked away in your pocket keychain; you would never tape your room key to your forehead where everyone can see it!

---

## 2. The 4 Major Architectural Reasons

### Reason 1: Preventing Accidental Password Leaks (The #1 Security Vulnerability in Web Development)
In web development, one of the most common security mistakes happens like this:
```ts
// Developer fetches user data to display on a profile or comment:
const user = await prisma.user.findUnique({ where: { id: authorId } });

// Developer sends the user object to the frontend browser:
return NextResponse.json(user);
```
* **If `password` is inside the `users` table:**  
  The `user` object in JavaScript contains `user.password`! When converted to JSON, **the scrambled password hash is accidentally transmitted over the internet to the client browser's Network tab**, where anyone using Chrome DevTools can inspect it.
* **With our `accounts` table:**  
  The `users` table does not even have a `password` column! A query to `prisma.user.findUnique()` physically **cannot** leak the password hash because credentials live in a completely separate table that is only queried at the moment of login verification.

---

### Reason 2: Support for Multi-Provider Login (Google / GitHub OAuth)
What happens if Jagannath University later enables **"Sign in with Google"** or **"Sign in with GitHub"**?
* **When you log in with Google, there is NO password!**  
  Google does not give our website your password; Google sends an `accessToken` and a Google ID token.
* **If `password` were inside `users`:**  
  Every student who logs in with Google would have `password = NULL` sitting in the `users` table.
* **What if a student wants to log in with BOTH Google AND an Email Password?**  
  With our `accounts` table, Farhan is **ONE** user in `users`. In `accounts`, Farhan has **TWO rows (keys)** linked to his `userId`:
  1. **Row 1:** `providerId: "credential"` $\rightarrow$ Stores his Email + `scrypt` password hash.
  2. **Row 2:** `providerId: "google"` $\rightarrow$ Stores his Google OAuth tokens.

---

### Reason 3: Separation of Identity vs. Authentication Method
In software architecture, this is called the **Principle of Separation of Concerns**:
* **Identity (`users` table):**  
  *Who are you?* (Your name, your email, whether you are a Student, Alumni, or Admin). This identity remains the same forever.
* **Credential / Authentication (`accounts` table):**  
  *How do you prove it's you?* (A password? An SMS code? A Google login? A biometric passkey?). Your login method can change or be rotated without touching your core identity.

---

### Reason 4: Industry Standard Compliance (Better Auth Specification)
Our project uses **Better Auth**, which implements the universal authentication schema standard (also used by NextAuth, Supabase, and Auth0):
* `users` = The Person.
* `accounts` = The Login Credentials (Passwords / OAuth).
* `sessions` = The Active Device Logins (Cookies).
* `verifications` = The Temporary Email Tokens.

---

## 3. Word-for-Word Defense Speech (30 Seconds)

When an examiner asks: *"Why did you put the password in a separate accounts table instead of putting it directly in users?"*, recite this:

> *"Respected teachers, separating the password into the `accounts` table rather than embedding it inside `users` provides two major advantages:*
>
> 1. *First, **Data Leak Prevention**: On a community platform, user records are frequently queried for member directories, author tags, and comment threads. Keeping password hashes isolated in `accounts` guarantees that general queries never accidentally expose password hashes in client JSON payloads.*
> 2. *Second, **Multi-Provider Architecture**: It decouples identity from authentication, allowing a single student account to support both traditional email-password logins and third-party OAuth providers like Google or GitHub under one unified profile."*
