# Page 20: Group 3 — "Community and referrals" (7 tables)

> **Slide Number in Deck:** Slide 20 of 42 (Slides 21–27 are its interactive Zoom slides)  
> **Slide Title:** `Community and referrals`  
> **Header Badge:** `7 tables`  
> **Interactive Morph:** Clicking any card in presentation mode zooms into its full column specification!

---

## 1. Visual Layout (What is Physically on Screen?)

When looking at Slide 20 in PowerPoint, you see 4 columns with **`posts`** acting as the central anchor for the discussion feed:

```
    Column 0                       Column 1                    Column 2 (Center)                  Column 3
┌───────────────────────┐   ┌───────────────────────┐      ┌───────────────────────┐      ┌─────────────────────────┐
│      connections      │   │    post_reactions     │─────►│         posts         │◄─────│        comments         │
│(Peer-to-peer network) │   │ (Atomic 'Like' button)│      │  (Feed Discussions)   │      │ (Threaded with parentId)│
├───────────────────────┤   ├───────────────────────┤      └───────────────────────┘      ├─────────────────────────┤
│   referral_requests   │   │    post_bookmarks     │─────────────────▲                   │     content_reports     │
│(Direct alumni pitches)│   │  (Saved feed posts)   │                 │                   │  (Spam/safety flags)    │
└───────────────────────┘   └───────────────────────┘                 └───────────────────┴─────────────────────────┘
```

### The 4 Visual Zones:
1. **Column 0 (Networking & Career Advocacy):**
   * **`connections`**: Direct connection between two users (`senderId` + `receiverId`).
   * **`referral_requests`**: Private pitches where a student requests an internal company referral from an alumnus.
2. **Column 1 (Feed Engagement):**
   * **`post_reactions`**: The "Like" button with atomic toggling.
   * **`post_bookmarks`**: Student's saved reading list for career advice.
3. **Column 2 (The Central Content Hub):**
   * **`posts`**: Main feed discussions (`GENERAL_DISCUSSION`, `REFERRAL_REQUEST`, `ACHIEVEMENT`).
4. **Column 3 (Threaded Discussions & Moderation):**
   * **`comments`**: Nested replies powered by a self-referencing `parentId`.
   * **`content_reports`**: Moderation flagging system for spam, harassment, or false information.

---

## 2. Plain-English Concept (The Campus Student Lounge & Mentorship Club)

Think of Slide 20 as the **Campus Student Lounge & Alumni Mentorship Hall**:
* **`posts`** is a student standing on the stage sharing an interview tip or campus achievement.
* **`comments`** is a conversation circle under that talk, where students ask questions and reply directly to each other.
* **`post_reactions`** is the audience clapping (the "Like" button).
* **`post_bookmarks`** is writing down the advice in your personal notebook to re-read later.
* **`content_reports`** is the security whistle: if someone posts inappropriate spam, students report it. If 3 students report it, the proctor (admin) is automatically alerted.
* **`connections`** is exchanging business cards / shaking hands with a senior.
* **`referral_requests`** is walking up to an alumnus at Databricks or bKash and saying: *"Here is my portfolio, could you refer me internally for the junior opening?"*

---

## 3. Deep Dive into the 7 Tables

### 1. `posts` (The Content Hub)
* **What it stores:** All community posts.
* **Key Columns:** `id`, `authorId`, `title`, `content`, `postType`, `status`, `likesCount`, `commentsCount`.
* **Post Types:**
  * `GENERAL_DISCUSSION`: Career prep tips, interview questions, tech discussions.
  * `REFERRAL_REQUEST`: Open requests asking for guidance at specific companies.
  * `ACHIEVEMENT`: Sharing job offers, graduation milestones, or contest wins.
* **Cached Counters:** Stores `likesCount` and `commentsCount` directly on the row so loading the feed doesn't require slow `COUNT(*)` database queries on every page scroll!

### 2. `comments` (Nested Threaded Discussions)
* **What it stores:** Replies to posts.
* **The Secret (Adjacency List Pattern):**  
  Contains a self-referencing foreign key: `parentId String?`.
  * If you reply directly to the post: `parentId = null`.
  * If you reply to another student's comment: `parentId = "comment_123"`.
  * This allows infinite, tree-structured comment threads (like Reddit).

### 3. `post_reactions` (The Atomic Like Button)
* **What it stores:** Likes on posts.
* **Composite Unique Rule:** `@@unique([postId, userId, type])`.
  * A student can only like a post **once**. If they click like again, the system toggles it off (deletes the row).

### 4. `post_bookmarks` (Saved Feed Posts)
* **What it stores:** Bookmarked posts.
* **Composite Unique Rule:** `@@unique([postId, userId])` $\rightarrow$ Prevents duplicate bookmarks.

### 5. `content_reports` (Automated Content Moderation)
* **What it stores:** Reports submitted against bad posts or comments.
* **Columns:** `reporterId`, `postId`, `commentId`, `reason` (`SPAM`, `HARASSMENT`, `INAPPROPRIATE`, `MISINFORMATION`, `OTHER`), `status`.
* **Polymorphic Target:** Can flag either a post (`postId`) OR a comment (`commentId`).
* **Automated Escalation Rule:** If a post receives **3 or more reports**, the system automatically changes its status to `FLAGGED` and alerts administrators in `/admin`.

### 6. `connections` (Peer-to-Peer Networking)
* **What it stores:** Professional relationships between students and alumni.
* **Two Foreign Keys:** `senderId` (points to `users`) and `receiverId` (points to `users`).
* **Statuses:** `PENDING`, `ACCEPTED`, `REJECTED`.
* **Composite Unique Rule:** `@@unique([senderId, receiverId])` $\rightarrow$ You cannot send multiple pending invites to the same person.

### 7. `referral_requests` (Direct Alumni Referral Pitches)
* **What it stores:** Formal elevator pitches sent from a student directly to an alumnus working at a target company.
* **Key Columns:** `requesterId`, `recipientId`, `companyName`, `roleTitle`, `message`, `status` (`PENDING`, `ACCEPTED`, `DECLINED`), `responseNote`.
* **Why it matters:** Referrals are the #1 way university graduates land interviews. This table structures the entire referral process.

---

## 4. Word-for-Word Presentation Script (30–45 Seconds)

> *"Moving to Slide 20, this is our **'Community and referrals'** domain, consisting of 7 tables.*
>
> *Unlike open public social media, our community feed is anchored to verified institutional identity. The **`posts`** table serves as the primary content hub, supporting career discussions, referral calls, and student achievements.*
>
> *Threaded replies are handled by **`comments`** using an Adjacency List pattern with a self-referencing `parentId` column.*
>
> *For engagement, **`post_reactions`** and **`post_bookmarks`** use composite unique constraints to guarantee atomic toggling without duplicate spam.*
>
> *Campus safety is enforced by **`content_reports`**, which automatically escalates flagged content to the administrator dashboard when 3 reports are reached.*
>
> *Finally, peer networking and high-trust career advocacy are managed through **`connections`** and **`referral_requests`**, allowing students to pitch verified alumni for direct company recommendations."*

---

## 5. Potential Teacher / Examiner Questions & Model Answers

### Question 1: "How do you implement threaded comment replies?"
> **Answer:**  
> *"In the `comments` table, we use a self-referencing foreign key column called `parentId`. Top-level comments have `parentId = null`, while replies store the ID of the parent comment they are responding to. When rendering the UI, our service reconstructs the hierarchical reply tree."*

### Question 2: "How does your system prevent a student from clicking 'Like' 100 times to inflate a post?"
> **Answer:**  
> *"We enforce a composite unique constraint at the database engine level in PostgreSQL: `@@unique([postId, userId, type])`. The combination of post and user can only exist once. Clicking 'Like' again triggers an atomic toggle that removes the row and decrements `likesCount`."*

### Question 3: "Why did you store `likesCount` and `commentsCount` on the `posts` table when you could just count the rows?"
> **Answer:**  
> *"This is an intentional performance optimization called counter caching. On a high-traffic feed, running SQL `COUNT(*)` across thousands of reaction and comment rows on every page scroll degrades database performance. Maintaining an atomic integer counter on the post row allows fast $O(1)$ reads for feed queries."*

### Question 4: "What happens when content is reported by multiple users?"
> **Answer:**  
> *"Each flag creates a row in `content_reports`. Our moderation service tracks the count per entity; when a post accumulates 3 or more reports, the database triggers an automated escalation that flags the post and routes it to the Administrative Governance Center (`/admin`) for immediate triage."*
