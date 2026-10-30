# UniCareer Community

> A private, university-connected career, mentorship, and opportunity networking platform.

UniCareer Community connects current university students, alumni, faculty, staff, and authorized corporate partners to facilitate career growth, internships, job postings, mentorship, and high-trust referrals within the campus ecosystem.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Server Actions)
- **Frontend**: React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, shadcn/ui, Lucide React
- **Database & ORM**: PostgreSQL via Neon Lakebase & Prisma ORM 7
- **Validation**: Zod & React Hook Form
- **Testing**: Vitest & Playwright

---

## Architecture & Current Status

- **Stage 1 (Foundation & Architecture)**: Clean separation of UI, services, database, validations, types, and testing infrastructure.
- **Stage 2 (Design System)**: Full design tokens, light/dark mode support, professional university-navy palette, accessible UI components.
- **Stage 3 (Navigation & Layout)**: App shell, responsive header & navigation, contextual sidebars, mobile drawers, public entry pages.
- **Cloud Infrastructure**: Provisioned on Neon Lakebase Postgres with branch-aware pooled connectivity and deployed on Vercel.

---

## Local Development

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Health & Diagnostics

Access the diagnostic route at `/api/health` to verify runtime health, memory, and database roundtrip latency:

```bash
curl http://localhost:3000/api/health
```

