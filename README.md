# UniCareer Community

> A high-trust, university-connected career, mentorship, and opportunity networking platform.

UniCareer Community connects current university students, alumni, and university administrators within the **Jagannath University** ecosystem to facilitate career growth, vetted internships, job postings, alumni mentorship, and high-trust referrals.

**Live Production Deployment**: [https://jnujobhunting.vercel.app](https://jnujobhunting.vercel.app)

---

## Technology Stack

- **Framework**: Next.js 16.4.3 (App Router, Turbopack, Server Components, Server Actions)
- **Frontend**: React 19.3.0, TypeScript 5 (Strict Mode, zero implicit `any`)
- **Styling**: Tailwind CSS v4, shadcn/ui primitives, Lucide React icons
- **Database & ORM**: PostgreSQL 16 on Neon Lakebase with Prisma ORM 7 & `@prisma/adapter-pg`
- **Authentication**: Better Auth 1.7.17 (Scrypt password hashing, session cookies, verification-first gate)
- **Email Dispatcher**: Nodemailer with Gmail SMTP & Google App Passwords
- **Validation**: React Hook Form with mirrored Zod schemas (client & server)
- **Testing**: Vitest 5.0.5 (194 automated unit, integration, and workflow tests — 100% pass rate)

---

## Architectural Stages & Capabilities

| Stage | Module | Key Capabilities |
| :--- | :--- | :--- |
| **Stage 1** | Foundation & Architecture | Next.js 16 + React 19 shell, Neon PostgreSQL connection pooling, Prisma 7, base scripts. |
| **Stage 2** | UI/UX Design System | OKLCH University Navy palette, Light/Dark/System themes, accessible components. |
| **Stage 3** | Navigation & Shell Layout | Responsive desktop sidebar, mobile drawer, authenticated shell, public landing. |
| **Stage 4** | Authentication & Security | Single unified account model, scrypt password hashing, verification tokens, password recovery. |
| **Stage 5** | Membership & Profiles | Role-tailored onboarding, registrar document review queue, profile editor, student ID privacy redaction. |
| **Stage 6** | Companies & Opportunities | Corporate profiles, community-shared job listings, status lifecycle (`APPROVED`, `REJECTED`, `EXPIRED`, `CLOSED`). |
| **Stage 7** | Job Browsing & Search | Multi-faceted filtering (department, workplace, CGPA, compensation, deadline), bookmarks. |
| **Stage 8** | Applications & External Tracking | Direct external application portal linking ("Apply on Official Website"), duplicate prevention, candidate dashboard. |
| **Stage 9** | Community Feed & Discussions | 7 post channels, threaded comments, atomic reactions, post bookmarks, content reporting. |
| **Stage 10** | Directory & Referrals | Searchable member directory, mutual connection requests, career referral requests hub. |
| **Stage 11** | Skills & Algorithmic Matching | Controlled skills dictionary, explainable mathematical skill match scoring `(Matched/Total * 100)`. |
| **Stage 12** | Notifications & Calendar | 22 notification event triggers, upcoming deadline cron worker, personal career calendar. |
| **Stage 13** | Admin Dashboard & Moderation | Platform KPIs, member governance, opportunity moderation, content review, immutable audit trail. |
| **Stage 14** | Testing, Hardening & Workflows | 23 end-to-end multi-persona workflows, sliding-window rate limiting, 100% test pass rate. |
| **Post-14** | Complete Verification & Gating | Mail-click admin queue enrollment, official approval email dispatch, strict pre-approval login gate. |

---

## Core Security & Business Rules

1. **Two-Stage Verification & Pre-Approval Gate**: Users register and receive a verification email. Clicking the link confirms `emailVerified = true` and dispatches the dossier to the Administrator Verification Queue. Non-admin accounts remain in `PENDING` state and are strictly blocked from logging in until an administrator approves their credentials and dispatches an official approval email.
2. **Single Account Architecture**: Supports the core membership personas (`STUDENT`, `ALUMNI`) unified with platform governance (`systemRole: ADMIN`). Platform administration is strictly decoupled from membership.
3. **External Application Tracking & Privacy**: Candidate applications redirect to official employer portals ("Apply on Official Website") with direct application tracking. Candidate records remain strictly private between the candidate and administrators.
4. **Zero Fake Data**: All feeds, dashboards, statistics, and directories query live PostgreSQL rows. No synthetic arrays exist in production code paths.
5. **Server-Enforced Authorization**: All permission checks (`canPostOpportunities`, `canReviewApplicants`, `isPlatformAdmin`) execute on server actions and route handlers.

---

## Local Development Setup

### 1. Prerequisites
- Node.js 20.x or higher LTS
- npm 10.x or higher
- Access to a PostgreSQL 16 database (e.g. Neon Lakebase)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/sooooojib/CAMPUS_JOB_HUNTING.git
cd CAMPUS_JOB_HUNTING

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Key environment variables:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Authentication
AUTH_SECRET="your-32-character-auth-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Dispatcher (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-google-app-password"
EMAIL_FROM="\"UniCareer Community\" <your-email@gmail.com>"

# Scheduled Reminders Cron Secret
CRON_SECRET="your-24-character-cron-secret"
```

### 4. Database Setup & Start
```bash
# Push Prisma schema to database and generate client
npx prisma db push
npx prisma generate

# Run local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

```bash
# Run all 193 automated unit and integration tests
npm test

# Run tests in watch mode
npx vitest

# Run TypeScript strict type-checking
npm run type-check

# Run production build with Turbopack
npm run build
```

---

## Documentation System

Comprehensive technical documentation is maintained in the `docs/` directory:
- [`docs/ARCHITECTURE.md`](file:///Users/sajib/se_project/docs/ARCHITECTURE.md) — System design and data flow
- [`docs/DATABASE_SCHEMA.md`](file:///Users/sajib/se_project/docs/DATABASE_SCHEMA.md) — Complete 30-model ERD and table specifications
- [`docs/API_REFERENCE.md`](file:///Users/sajib/se_project/docs/API_REFERENCE.md) — Exhaustive REST route documentation
- [`docs/USER_ROLES_AND_PERMISSIONS.md`](file:///Users/sajib/se_project/docs/USER_ROLES_AND_PERMISSIONS.md) — Access control and permission matrix
- [`docs/SECURITY_AND_PRIVACY.md`](file:///Users/sajib/se_project/docs/SECURITY_AND_PRIVACY.md) — Security baseline and privacy redaction
- [`docs/DEPLOYMENT_GUIDE.md`](file:///Users/sajib/se_project/docs/DEPLOYMENT_GUIDE.md) — Vercel and Neon production deployment
- [`docs/ENVIRONMENT_SETUP.md`](file:///Users/sajib/se_project/docs/ENVIRONMENT_SETUP.md) — Environment variables reference
- [`docs/PROGRESS.md`](file:///Users/sajib/se_project/docs/PROGRESS.md) — Chronological progress tracker
- [`docs/CHANGELOG.md`](file:///Users/sajib/se_project/docs/CHANGELOG.md) — Detailed version changelog
- [`docs/stages/`](file:///Users/sajib/se_project/docs/stages/) — Individual stage completion reports (Stages 0–14 + Polish)
