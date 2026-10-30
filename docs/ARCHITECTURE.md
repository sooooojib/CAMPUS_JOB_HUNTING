# UniCareer Community — Software Architecture & System Design

## 1. Architectural Overview & Runtimes

UniCareer Community is built on the **Next.js App Router (v16.4.3)** with **React 19.3.0** and **TypeScript 5**. It adopts a **server-first execution model** utilizing React Server Components (RSC) for zero-client-bundle data fetching, paired with isolated Client Components for interactive micro-islands.

### Verified Technology Stack
| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 16.4.3 | SSR, SSG, Server Actions, Route Handlers |
| **Frontend Runtime** | React / React DOM | 19.3.0 | Modern concurrent UI engine |
| **Language** | TypeScript | 5.x | Strict type safety, no implicit `any` |
| **Styling & Theme** | Tailwind CSS v4 & shadcn/ui | 4.x / 4.23.0 | CSS variable tokens, University Blue palette |
| **Icons** | Lucide React | 1.65.0 | Consistent iconography |
| **Database** | PostgreSQL | 16.15 | Primary relational data store |
| **ORM & Driver** | Prisma ORM & `@prisma/adapter-pg` | 7.10.1 | Type-safe queries, migration engine, connection pool |
| **Unit Testing** | Vitest | 5.0.5 | Blazing-fast unit and schema tests |
| **Validation** | Zod | 4.6.7 | Mirrored client and server schemas |

---

## 2. Directory Layout & Module Responsibilities

```text
se_project/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with Inter font, AppProviders, Navbar & Footer
│   ├── page.tsx                  # Home / Foundation landing & system readiness view
│   ├── error.tsx                 # Client error boundary with digest reporting
│   ├── global-error.tsx          # Critical root HTML error boundary
│   ├── not-found.tsx             # 404 handler with return home action
│   ├── globals.css               # Design tokens, OKLCH theme palettes, animations
│   ├── (auth)/                   # Public auth routes (Stage 2)
│   ├── (public)/                 # Marketing & about routes
│   ├── (dashboard)/              # Authenticated member core routes (Stage 3+)
│   └── api/                      # Route handlers & webhooks
├── components/                   # UI Presentation Components
│   ├── ui/                       # shadcn/ui primitives (button, card, dialog...)
│   ├── layout/                   # Shared shell (navbar, footer, theme-toggle)
│   ├── providers/                # Global context providers (ThemeProvider, etc.)
│   ├── opportunities/            # Job portal components (Stage 3)
│   ├── community/                # Feed & post components (Stage 5)
│   ├── career-tools/             # Student tools (Stage 6)
│   └── feedback/                 # Skeletons, empty states, error banners
├── lib/                          # Infrastructure & Utilities
│   ├── prisma.ts                 # Prisma Client singleton with PgPool driver adapter
│   ├── config.ts                 # Central application configuration
│   ├── logger.ts                 # Standardized structured logger
│   └── utils.ts                  # cn(), formatDate(), formatCurrency() helpers
├── prisma/                       # Database Definition & Migrations
│   ├── schema.prisma             # PostgreSQL schema definition
│   └── seed.ts                   # Connectivity check & seed runner
├── prisma7.config.ts             # Prisma 7 configuration & datasource resolution
├── types/                        # TypeScript Domain Types
│   └── index.ts                  # Shared role enums, API responses, pagination interfaces
├── validations/                  # Shared Zod Validation Schemas
│   └── common.schema.ts          # Common IDs, email, password, pagination schemas
├── tests/                        # Automated Tests
│   └── unit/                     # Unit test suites (vitest)
├── docs/                         # Living Documentation System
│   └── stages/                   # Chronological stage implementation reports
├── .agents/                      # Antigravity Skills Configuration
│   └── skills/                   # UI/UX Pro Max, Vercel React Best Practices, etc.
└── AGENTS.md                     # Permanent Project Development Guidelines
```

---

## 3. How Core Layers Fit Together

```
                  ┌───────────────────────────────┐
                  │        User Interaction       │
                  │ (React 19 Client UI Islands)  │
                  └───────────────┬───────────────┘
                                  │
                                  │ Zod Validated Submissions
                                  ▼
                  ┌───────────────────────────────┐
                  │     Next.js Server Actions    │
                  │       & Route Handlers        │
                  └───────────────┬───────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
        ┌───────────────────────┐   ┌───────────────────────┐
        │   Auth & Permissions  │   │   Zod Schema Guard    │
        │  (Session & Role API) │   │ (Strict Server Check) │
        └───────────┬───────────┘   └───────────┬───────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │      Domain Service Layer     │
                  │   (Business Logic & Rules)    │
                  └───────┬───────────────┬───────┘
                          │               │
       Prisma Driver Pool │               │ Signed URL Requests
                          ▼               ▼
        ┌───────────────────────┐   ┌───────────────────────┐
        │      PostgreSQL       │   │    Private Storage    │
        │   (Relational DB)     │   │   (Encrypted Resumes) │
        └───────────────────────┘   └───────────────────────┘
```

1. **Frontend / UI**: Clean React Server Components receive pre-fetched data directly; Client Components manage forms, interactive modals, tabs, and filters.
2. **Server Actions & Handlers**: All mutations occur via Server Actions, ensuring zero reliance on public REST endpoints for internal operations.
3. **Validation & Permissions**: Shared Zod schemas validate payload shapes. `lib/permissions.ts` verifies session authenticity, role capabilities, and resource ownership before invoking services.
4. **Domain Services**: Encapsulate transactions, audit logging, status transitions, and data integrity rules.
5. **Database**: Prisma ORM executes typed SQL queries against PostgreSQL via `@prisma/adapter-pg`.
6. **Storage**: Resumes and verification IDs are never saved in public paths; secure, short-lived signed URLs govern candidate document access.
7. **Testing**: Vitest executes fast unit and schema tests; Playwright runs full browser workflows.
