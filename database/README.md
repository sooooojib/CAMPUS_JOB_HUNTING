# UniCareer Database Defense Presentation Guide

This folder contains a complete, page-by-page breakdown of **`04_Database.pptx`** designed for defense preparation and study.

---

## Complete Serial Guide & Deep Dives

### Core Slide Presentations (Page by Page)
1. **[01. Page 01: Overview — 30 tables, 6 groups](file:///Users/sajib/se_project/database/PAGE_01.md)**
   - Visual layout, Campus Metaphor, Table counts (30 vs 27 vs 3), presentation script, and examiner Q&A.
2. **[02. Page 02: The Full ER Diagram (30 tables · 48 links)](file:///Users/sajib/se_project/database/PAGE_02.md)**
   - City Map Metaphor, 48 relational links, orange bus routing, blue 1-to-many links, presentation script, and Q&A.
3. **[03. Page 03: Group 1 — People and Login (9 tables)](file:///Users/sajib/se_project/database/PAGE_03.md)**
   - Visual layout, Campus ID metaphor, 9 tables deep dive, interactive zoom feature, presentation speech, and Q&A.
4. **04–12. Deep-Dive Zoom Slides for People & Login** *(Covered in Slide 3 + Deep Dives)*
5. **[13. Page 13: Group 2 — Jobs and Applications (6 tables)](file:///Users/sajib/se_project/database/PAGE_13.md)**
   - Visual layout, Career Notice Board metaphor, 6 tables breakdown, nullable company links, presentation speech, and Q&A.
6. **14–19. Deep-Dive Zoom Slides for Jobs & Applications**
7. **[20. Page 20: Group 3 — Community and Referrals (7 tables)](file:///Users/sajib/se_project/database/PAGE_20.md)**
   - Visual layout, Student Lounge metaphor, 7 tables breakdown, threaded comments, atomic likes, presentation speech, and Q&A.
8. **21–27. Deep-Dive Zoom Slides for Community & Referrals**
9. **28. Group 4 — Alerts and Calendar (4 tables)** *(Next)*
10. **29–32. Deep-Dive Zoom Slides for Alerts & Calendar**
11. **33. Group 5 & 6 — Admin and Left-over Tables (1 + 3 tables)**
12. **34–37. Deep-Dive Zoom Slides for Admin & Legacy Tables**
13. **38. State Machine — Life of a Member**
14. **39. State Machine — Life of a Job Post**
15. **40. Step-by-Step Transaction — One Click ("Save to My Applications")**
16. **41. Automated Worker — The Reminder Robot (Cron Scheduler)**
17. **42. Security & Integrity — Keeping Data Safe (4 Pillars)**

---

### Technical Deep Dives (Core Concepts & Examiner FAQs)
* **[Deep Dive 1: Primary Keys & Foreign Keys](file:///Users/sajib/se_project/database/DEEP_DIVE_PK_FK.md)**
  - What are PKs and FKs? Why CUIDs instead of numbers? Referential integrity, cascade rules, composite unique keys.
* **[Deep Dive 2: Database Relationships & Cardinality](file:///Users/sajib/se_project/database/DEEP_DIVE_RELATIONSHIPS.md)**
  - 1-to-1, 1-to-Many, Many-to-Many, Junction / Bridge Tables, Self-Referencing / Adjacency List pattern.
* **[Deep Dive 3: Why Two Tables for Users & Profiles? (+ Better Auth)](file:///Users/sajib/se_project/database/DEEP_DIVE_USERS_VS_PROFILES.md)**
  - What is Better Auth? The 5 architectural reasons for separating `users` and `profiles`, the Wallet vs. 50 kg Suitcase analogy, and the exact defense speech.
* **[Deep Dive 4: Opportunity (1) ──► applications (*)](file:///Users/sajib/se_project/database/DEEP_DIVE_OPPORTUNITY_APPLICATIONS.md)**
  - The Notice Board flyer metaphor, database tables view, `onDelete: Cascade`, and anti-duplication constraints.
* **[Deep Dive 5: The Connection Between Opportunity and Company](file:///Users/sajib/se_project/database/DEEP_DIVE_OPPORTUNITY_COMPANY.md)**
  - One-to-Many relationship, Nullable Foreign Key (`companyId String?`), Partial Denormalization (`companyName`), and `onDelete: SetNull`.
* **[Deep Dive 6: Why the Password is in `accounts` and Not in `users`](file:///Users/sajib/se_project/database/DEEP_DIVE_ACCOUNTS_PASSWORD.md)**
  - The Face vs. Room Key metaphor, preventing accidental JSON leaks, multi-provider OAuth, `scrypt` hashing.
* **[Deep Dive 7: Sessions, Verifications & Membership Requests](file:///Users/sajib/se_project/database/DEEP_DIVE_SESSIONS_AND_VERIFICATIONS.md)**
  - Hotel Keycard metaphor, database sessions vs JWT, temporary email tokens, two-stage approval gate, and rejection lifecycle.
