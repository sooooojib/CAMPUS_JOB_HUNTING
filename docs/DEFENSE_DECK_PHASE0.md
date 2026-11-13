# UniCareer Community: Defense Deck Phase 0 (rev. 2: Context and Slide Map)

Revised after reading AGENTS.md, README, PROJECT_OVERVIEW, ARCHITECTURE, DATABASE_SCHEMA, schema.prisma, USER_ROLES_AND_PERMISSIONS, lib/permissions.ts, PRODUCT_REQUIREMENTS, API_REFERENCE, ROUTES_AND_PAGES, SECURITY_AND_PRIVACY, DECISIONS and KNOWN_ISSUES. Code is treated as the source of truth wherever a doc disagrees with it.

## A. Extracted project context

| Item | Fact | Source |
|---|---|---|
| Title | UniCareer Community: a private, university-connected career and job-seeking community. It is "NOT a generic public job board" | AGENTS.md section 1 |
| Institution / URL | Jagannath University (JnU); https://jnujobhunting.vercel.app | README |
| 5 pillars | Curated portal, professional feed, alumni directory, high-trust referrals, student career toolkit | PROJECT_OVERVIEW |
| Account model | One `User` record. 3 active personas: `STUDENT`, `ALUMNI`, `ADMIN`. Capability flags `canPostOpportunities` and `canReviewApplicants` | AGENTS section 2, ADR-001 |
| Status enums | verificationStatus: PENDING, VERIFIED, REJECTED, SUSPENDED. accountStatus: ACTIVE, PENDING_VERIFICATION, SUSPENDED, DEACTIVATED | schema.prisma |
| Opportunity lifecycle | APPROVED, REJECTED, EXPIRED, CLOSED. Types: INTERNSHIP, FULL_TIME, PART_TIME, CONTRACT, OTHER. Standardized as COMMUNITY_SHARED | AGENTS, ADR-002, ADR-003 |
| Application pipeline | SUBMITTED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED, WITHDRAWN. Every change is written to `application_status_history` | schema.prisma |
| Referral pipeline | PENDING, ACCEPTED, DECLINED, COMPLETED, CANCELLED. Self-referral is prohibited | schema, USER_ROLES section 6 |
| Post types | GENERAL_DISCUSSION, JOB_ANNOUNCEMENT, REFERRAL_REQUEST, ACHIEVEMENT. Reactions are one per type per user | schema.prisma |
| Stack | Next.js 16.4.3 App Router (server-first, ADR-004), React 19.3, TypeScript strict, Tailwind v4 + shadcn/ui, PostgreSQL 16 on Neon, Prisma 7.10 + `@prisma/adapter-pg` with pg.Pool (ADR-005), Better Auth 1.7.17, Zod 4, React Hook Form, Recharts, Nodemailer and Gmail SMTP (ADR-008), Vitest 5, Vercel | package.json, ARCHITECTURE |
| Layers | UI (RSC + client islands), then route handlers / server actions, then auth + Zod guard, then `lib/services` (17 domain services), then Prisma, then PostgreSQL and private storage | ARCHITECTURE section 3 |
| Database | **30 models, 28 enums**, 3NF, composite indexes, e.g. `[status, deadline]` | schema.prisma |
| API / UI surface | 22 API route groups; 6 public routes, 19 member routes, `/career-tools` (STUDENT only), `/admin` | API_REFERENCE, ROUTES_AND_PAGES |
| Server gates | `isAccountActive`, `isPlatformAdmin`, `isVerifiedMember`, `canPostOpportunity`, `canReviewApplicants`, `canAccessStudentTools`, `assertCanPostOpportunity`, `assertAdmin`; plus per-resource `assertCanManageApplicantsForOpportunity` and `assertCanAccessReferral` | lib/permissions.ts, SECURITY |
| Limits | Password at least 8 characters with uppercase, number and symbol. Login blocked until email verified (HTTP 403 `EMAIL_NOT_VERIFIED`, ADR-007). Rate limits: verification 10 per 10 min, applications 30 per hour (HTTP 429). Opportunity page size 12. Reminder cron covers the next 72 hours with de-duplication | PRD, SECURITY, API_REFERENCE section 8.3 |
| Integrity | Unique `[opportunityId, applicantId]`, `[userId, opportunityId]` bookmark, `[postId, userId, type]` reaction, `[companyId, userId]`; `$transaction` used in application, community and resume services | schema, lib/services |
| Matching | Match = matched / required x 100; at least 80% is green, at least 50% yellow, otherwise red. Eligibility checks department, CGPA, academic year and deadline. CGPA verified separately (ADR-009) | matching.ts |
| Privacy filtering | `studentId`, `phone` and `proofDetails` are stripped unless the viewer is the owner or an ADMIN. Email is shown only if `showEmail` is true. Password hashes stay in `accounts`. Another member's academic records return 403 | SECURITY, USER_ROLES section 7 |
| Admin seed data | Dean Arthur Vance (admin); Farhan Ahmed (CSE, 3.88) and Nusrat Jahan (SWE, 3.72); Tariqul Islam (Databricks) and Sabrina Rahman (bKash); Sarah Jenkins (Vercel recruiter); Dr. Mahbubur Rahman; 16 departments across 6 faculties | seed.ts |
| Audit | `admin_audit_logs`: 16 actions, 7 target types, reason, JSON details, IP address; indexed by admin, action, target and time | schema.prisma |
| Admin KPIs | `/api/admin/stats`: 13 live counts (members, verified, pending, opportunities by status, applications, posts, reports, suspended, companies) and `/api/admin/analytics` | API_REFERENCE section 9.1 |
| Testing | 193 / 193 Vitest tests in 16 files; 4 persona workflows (9, 4, 4 and 6 steps); tsc, ESLint and build all at 0 errors; 68 routes | FINAL_TEST_REPORT |
| Deferred | In-memory rate limiter (per instance), private messaging, live SIS sync, career-fair ticketing | KNOWN_ISSUES |
| 10 ADRs | 001 Unified account, 002 Provenance, 003 Moderation gate, 004 App Router/RSC, 005 Prisma adapter-pg, 006 useSyncExternalStore, 007 Verification-first, 008 Gmail SMTP, 009 CGPA decoupling, 010 De-AI-ified UI | DECISIONS |

## B. Review findings: where docs and code disagree

| # | Severity | Finding | Evidence | Deck treatment |
|---|---|---|---|---|
| 1 | High | `isPlatformAdmin` also accepts `membershipType === "ADMIN"`. That value is not in the MembershipType enum, and it breaks the "strictly decoupled" rule. The seed relies on it | permissions.ts line 33, seed.ts | Show `systemRole` only. Recommend fixing the code |
| 2 | High | Posting rights in the matrix differ from the code. The matrix gives Faculty, Staff and Employer posting rights. The code gives them only to verified STUDENT or ALUMNI accounts, or to accounts with `canPostOpportunities` set | USER_ROLES section 2 vs permissions.ts | Present the code's rule |
| 3 | High | Applicant review in the matrix differs from the code. The matrix says Alumni cannot review and Employers can. The code lets any verified ALUMNI review, and an EMPLOYER only with the flag set. The per-opportunity company check still applies | USER_ROLES section 5 vs permissions.ts | Present the code rule plus the company check |
| 4 | Medium | AGENTS.md requires signed URLs that expire. The code streams files through an authenticated route instead | AGENTS section 2, SECURITY section 14 | Stream = implemented; signed URL = PROPOSED |
| 5 | Medium | AGENTS.md requires Playwright end-to-end tests, but Playwright is not installed. The "workflows" are Vitest integration tests | package.json | Call them integration workflows; Playwright = PROPOSED |
| 6 | Medium | MODERATOR exists in the enum but grants no capability in the code | permissions.ts | Mark MODERATOR as PROPOSED |
| 7 | Low | Post categories: the PRD lists 6, the README says 7 channels, and the schema has 4 PostTypes | PRD 2.7, README, schema | Use the 4 schema types |
| 8 | Low | Application statuses: the PRD says INTERVIEWING / OFFERED, but the schema has INTERVIEW / SELECTED | PRD 2.6, schema | Use the schema values |
| 9 | Low | Model count: README and test report say 27; schema has 30 | schema | Use 30 models and 28 enums |
| 10 | Low | Password hashing: README says scrypt, test report says argon2id | README, FINAL_TEST_REPORT | Say "Better Auth hashing" unless you confirm which |
| 11 | Low | In the seed, the recruiter and the faculty member are typed ALUMNI | seed.ts | Show the type each persona should have |

## C. Chapter-by-chapter slide map (51 slides)

Tags: DESIGNED = implemented and tested; PROPOSED = planned. `[IMG]` = empty image placeholder.

### Chapter 1: Opening, Problem and User Workflow (1–6)
| # | Title | Layout / content |
|---|---|---|
| 1 | UniCareer Community | COVER: tagline, course, instructor, team, live URL |
| 2 | Four People, One Broken Campus Hiring Loop | Personas Farhan (student), Tariqul (alumnus), Sarah (recruiter), Dean Vance (admin) + 3 cited stats |
| 3 | From Problem to Solution | Table: problem, root cause, feature, ADR |
| 4 | End-to-End Workflow: PREPARE, ACTION, AFTER | 9 steps: register, verify, onboard, then browse, match, apply, then track, refer, remind |
| 5 | User Stories: Students and Alumni | As a / I want / so that |
| 6 | User Stories: Employers, Faculty/Staff and Admins | As a / I want / so that |

### Chapter 2: Requirements Engineering and Competitive Analysis (7–14)
| # | Title | Layout / content |
|---|---|---|
| 7 | One NFR Drives Many FRs | "Trust and privacy" NFR traced to the verification gate, moderation gate, redaction and link protection |
| 8 | Functional Requirements: Identity, Opportunities, Applications | FR-1 to FR-6 with password, 403, 30 per hour and duplicate rules |
| 9 | Functional Requirements: Community, Referrals, Tools, Admin | FR-7 to FR-12 with self-referral ban, 80/50 thresholds, 72-hour reminders, audit |
| 10 | Non-Functional Requirements | Product / Organizational / External with measurable targets |
| 11 | How UniCareer Compares | vs LinkedIn, Bdjobs, Handshake, JnU Facebook job groups (researched) |
| 12 | Where UniCareer Stands Out | 6 differentiators, each backed by an ADR |
| 13 | Defense Q&A: Requirement Boundaries | e.g. why students can post leads; why external application URLs; why admin pre-moderation |
| 14 | Defense Q&A: Trade-offs and Limits | e.g. in-memory rate limiter; streaming vs signed URL; no chat |

### Chapter 3: System Diagrams, 4 UML only (15–28)
| # | Title |
|---|---|
| 15 | Four Diagrams, One System (index) |
| 16–18 | Use Case: overview; Student and Alumni; Employer and Admin |
| 19–21 | Sequence (apply to opportunity): overview; session, rate-limit, Zod and eligibility; transaction, history and notification |
| 22–25 | Class: overview; Identity (User, Profile, MembershipRequest, Session); Opportunity, Application, Resume, Company; Community and Referral |
| 26–28 | Activity with swimlanes (post, approve, apply, review): overview; Poster and Admin lanes; Student and Employer lanes |

### Chapter 4: Database Design, Concurrency and Filtering (29–40)
| # | Title | Layout / content |
|---|---|---|
| 29 | Database at a Glance: 30 Models, 28 Enums | Client to HTTPS/session cookie to Route handler to services to Prisma pool to Neon PostgreSQL; private storage; cron |
| 30 | Handling Simultaneous Requests | Stateless handlers, pg.Pool, `$transaction`, unique constraints, PostgreSQL MVCC; idempotency keys = PROPOSED |
| 31 | Entity-Relationship Diagram | Core ER + legend + 3 insights |
| 32 | Tables: users and profiles | Mono table, PK/FK/UNIQUE badges, seed rows |
| 33 | Tables: opportunities and applications | Mono table, seed rows |
| 34 | Tables: referral_requests and admin_audit_logs | Mono table, seed rows |
| 35 | Admin-Inserted Master Data | Departments, skills dictionary, verification and CGPA decisions; `assertAdmin` writes to the audit log |
| 36 | From Filter Tap to Filtered JSON | `/opportunities` filters, then query params, then Zod, then Prisma `where` (status = APPROVED), then JSON |
| 37 | What the API Never Returns | Redaction and permission matrix by viewer |
| 38 | From Rows to Reports | COUNT / GROUP BY feeding `/api/admin/stats` (13 KPIs) and the analytics charts |
| 39 | Why PostgreSQL | PostgreSQL vs MongoDB vs MySQL |
| 40 | Delivery Roadmap | Built (Stages 0–14), Hardening (findings 1–6), Next (chat, SIS sync, Redis limiter) |

### Chapter 5: UI/UX Input-to-Output Flows (41–46)
| # | Title |
|---|---|
| 41 | Register and Verify Email |
| 42 | Post an Opportunity and Admin Approval |
| 43 | Filter Jobs and See the Match Score |
| 44 | Apply via External Portal and Track Status |
| 45 | Request a Referral and Alumni Response |
| 46 | Admin Moderation with Live KPIs (native chart in OUTPUT) |

Each slide: INPUT `[IMG]` and OUTPUT `[IMG]` with validation callouts and a USER INPUT / SYSTEM OUTPUT bar.

### Chapter 6: Domain Data and Design Justification (47–50)
| # | Title |
|---|---|
| 47 | 193 Tests, 16 Suites, 0 Failures (native bar chart) |
| 48 | Four Persona Workflows Verified |
| 49 | Security Controls Under Test |
| 50 | What the Data Means for UniCareer |

### Chapter 7: Conclusion (51)
| 51 | What We Built / What Testing Showed / What Comes Next |
|---|---|
