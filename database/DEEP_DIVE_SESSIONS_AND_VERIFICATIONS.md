# Deep Dive 7: Sessions, Verifications & Membership Requests

> **File:** `database/DEEP_DIVE_SESSIONS_AND_VERIFICATIONS.md`  
> **Topic:** Active device logins, temporary email tokens, and the admin approval queue  
> **Key Concepts:** Database Sessions, Instant Revocation, Ephemeral Verification Tokens, Two-Stage Verification Gate

---

## 1. What Does the `sessions` Table Keep?

In one sentence:  
**The `sessions` table acts as an "Electronic Hotel Keycard" that remembers you are logged in on your browser so you don't have to re-type your password on every single mouse click.**

### The Columns in `sessions`:
* **`id`**: Primary Key for this session.
* **`userId`**: **Foreign Key** pointing to `users.id` (tells the database *who* this session belongs to).
* **`token`**: The secret cryptographic string stored in your browser cookie (`better-auth.session_token`).
* **`expiresAt`**: Expiration timestamp (e.g. valid for 30 days).
* **`ipAddress`**: The device's internet IP address (e.g. `103.114.98.12` from Dhaka) for security monitoring.
* **`userAgent`**: The browser and device operating system (e.g. `Chrome on macOS` or `Safari on iPhone`).

### Why Database Sessions Over Stateless JWTs? (Instant Revocation!)
Examiners often ask: *"Why store sessions in the database instead of stateless JWTs?"*
* **The Answer:** **Instant Revocation.**
* With stateless JWTs, if a student loses their laptop or an administrator suspends a malicious account, you cannot kick them out until the token expires (which might take days).
* With database sessions, if an admin clicks "Suspend User" in `/admin`, deleting their row from `sessions` kicks them out of the platform **in zero seconds**!

---

## 2. What Does the `verifications` Table Keep?

In one sentence:  
**The `verifications` table is a temporary security vault storing secret one-time tokens sent to your email (e.g. "Confirm your Email" or "Reset your Password").**

### The Columns in `verifications`:
* **`identifier`**: What is being verified (the student's email, e.g. `farhan@jnu.ac.bd`).
* **`value`**: The unguessable cryptographic token string sent in the email link.
* **`expiresAt`**: The countdown timer (e.g. expires in 24 hours).

### How it Prevents Replay Attacks:
As soon as the student clicks the link in their email:
1. The server checks that `value` exists and `expiresAt` has not passed.
2. The user's `emailVerified` is set to `true`.
3. **The row is immediately DELETED from `verifications`.** If someone intercepts the link later and clicks it again, the database rejects it because the token no longer exists.

---

## 3. What Does `membership_requests` Keep? (The Two-Stage Gate)

In one sentence:  
**`membership_requests` is the Administrator Verification Queue — the digital "application form" where students and alumni submit their academic credentials for human approval.**

### The 4-Step Registration Lifecycle:
1. **Student Signs Up:** Account created in `users` with `emailVerified = false` and `verificationStatus = "PENDING"`. (User cannot log in; Admin cannot see them yet).
2. **Student Confirms Email:** Clicks link in email $\rightarrow$ `emailVerified` becomes `true` $\rightarrow$ Better Auth hook submits dossier to `membership_requests`.
3. **Admin Reviews in `/admin`:** Dean Vance inspects the claimed Student Roll and Department.
4. **Decision:**
   * **If APPROVED:** `membership_requests.status = "APPROVED"`, `users.verificationStatus = "VERIFIED"`, approval email sent, login unlocked!
   * **If REJECTED:** Admin enters a required reason (e.g. *"Student roll invalid"*), rejection email sent with feedback, student can log in to view reason and resubmit!
