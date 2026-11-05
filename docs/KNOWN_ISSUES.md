# UniCareer Community — Known Issues, Technical Limitations & Intentional Decisions

> **Document Purpose**: Complete, transparent record of intentional architecture decisions, current operational limits, and deferred features across all 14 development stages.

---

## 1. Intentional Architectural Decisions

| Decision | Rationale | AGENTS.md Directive |
| :--- | :--- | :--- |
| **Unified Single Account Model** | Multiple roles (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`) are modeled on a single `User` record with verification status flags rather than separate auth tables. | *"Do NOT create separate authentication systems for different roles. A single unified account model manages membership types, verification statuses, and capabilities."* |
| **Server-Enforced Authorization** | All permission and role checks are executed on route handlers and server actions. Frontend UI elements conditionally render for UX, but API security never relies on client state. | *"Server Enforcement: All permission, membership, and role checks must be executed on the server. Never rely on frontend UI hiding alone."* |
| **Explainable Algorithmic Matching** | Skill match scores use deterministic, transparent formula: `(Matched Required Skills / Total Required Skills) * 100`, coupled with strict eligibility rules (Department, CGPA, Academic Year, Deadline). No opaque black-box AI algorithms. | *"Use actual profile, academic, skill, and opportunity data. Do not use fabricated AI recommendations. Calculate skill match percentage using: Matched required skills / Total required skills × 100."* |
| **Private Resume File Routing** | Resumes are never exposed via public URLs or static asset directories. Downloads must stream through authenticated endpoint `/api/resumes/[id]/download` verifying owner or authorized recruiter identity. | *"Resumes and candidate data must be stored in private storage with time-limited signed URLs. Never expose candidate records publicly."* |
| **Zero Mock Data in Core Feeds** | Feeds, dashboards, candidate rosters, and administrative KPIs strictly query live database rows. Zero hardcoded mock arrays exist in production code paths. | *"Zero Fake Data: Never use hardcoded mock data as a substitute for real backend functionality."* |

---

## 2. Current Technical Limitations & Mitigations

### A. Sliding-Window In-Memory Rate Limiting
- **Current Behavior**: Rate limits are enforced in-memory per Node process. In multi-instance serverless deployments with hundreds of concurrent lambda containers, counters are local to each container instance.
- **Mitigation / Next Step**: For ultra-high concurrency distributed multi-region fleets, connect the sliding-window limiter to a shared Redis / Upstash cluster via `@upstash/ratelimit`. The current implementation provides strong protection against single-origin bursts and automated scrapers.

### B. Dev Mode Email Output
- **Current Behavior**: In non-production environments (`NODE_ENV !== "production"`), emails (verification links, password reset tokens, application alerts, status updates) are rendered to formatted stdout boxes.
- **Production Migration**: To deliver real SMTP emails in production, configure an enterprise email provider (Resend, SendGrid, Amazon SES) in `lib/email/sender.ts`. The template and notification engine is already decoupled and ready for SMTP integration.

### C. Large File Upload Boundary
- **Current Behavior**: Resume uploads are capped at 5 MB with strict magic-bytes inspection (`%PDF-`, `PK\x03\x04`). Files larger than 5 MB are rejected with HTTP 400.
- **Rationale**: 5 MB is more than adequate for 2–4 page PDF/DOCX resumes while protecting the server against denial-of-service via large binary uploads.

---

## 3. Deferred Features (Per Architecture Specification)

The following items are explicitly marked in `AGENTS.md` and project requirements as deferred to future release phases:
- **Real-Time WebSockets / Private Direct Messaging**: Direct member-to-member real-time chat is deferred. Current communication occurs through connection requests, referral request notes, community comments, and official employer email contacts.
- **University Registrar SIS Live Integration**: Verification requests are processed through an administrative queue with document proof verification. Direct automated REST/LDAP synchronization with campus SIS (Student Information Systems) will be integrated in Phase 2 via university API gateways.
- **Advanced Live Campus Events & Ticketing**: Career fair live booth ticketing and virtual video interview rooms are deferred.

