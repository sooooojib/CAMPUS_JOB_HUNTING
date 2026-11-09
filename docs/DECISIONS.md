# UniCareer Community — Architecture Decision Records (ADR)

## ADR-001: Unified Account Model vs Multi-Account Split

- **Status**: Accepted
- **Context**: Platforms often split candidate and employer accounts into distinct tables or authentication domains. In a university community, members frequently switch roles (e.g. an alumnus who works as a senior software engineer might want to both apply for advanced opportunities and refer/post openings for their company).
- **Decision**: Implement a single `User` account model with configurable `membershipType` (`STUDENT`, `ALUMNI`, etc.) and capability flags. An authorized member can post opportunities while retaining applicant features.
- **Consequence**: Dramatically simplifies user experience, avoids multi-account confusion, and mirrors real-world collegiate networks.

---

## ADR-002: Opportunity Provenance Classification

- **Status**: Accepted
- **Context**: In university networks, informal job leads and referrals are common alongside official campus recruitment drives. Conflating the two causes applicant frustration when a poster has no hiring authority.
- **Decision**: Classify all opportunities as either `OFFICIAL_EMPLOYER` or `COMMUNITY_SHARED`. Community-shared postings explicitly indicate the poster is sharing a lead or offering a referral rather than representing the hiring committee.
- **Consequence**: Preserves trust and transparent communication between candidates and posters.

---

## ADR-003: Mandatory Pre-Publication Moderation Gate

- **Status**: Accepted
- **Context**: Open posting risks spam, outdated third-party scrapes, and low-quality offers that erode platform credibility.
- **Decision**: All new opportunities default to `PENDING` status and require administrative review prior to public member visibility.
- **Consequence**: Ensures high quality, verified listings, and adherence to university compensation standards.

---

## ADR-004: Next.js App Router & Server Components

- **Status**: Accepted
- **Context**: Need maximum rendering performance, SEO on marketing pages, secure server-side data fetching, and tight integration with PostgreSQL.
- **Decision**: Use Next.js App Router with Server Components by default; reserve Client Components strictly for interactive micro-islands (forms, modal dialogs, client state).
- **Consequence**: Minimal JavaScript bundles shipped to the client, optimal performance, and elimination of client-side secret exposure.


---

## ADR-005: Prisma 7 with Driver Adapter (`@prisma/adapter-pg`)

- **Status**: Accepted
- **Context**: In Prisma 7, standard PostgreSQL database connections require explicit driver adapters to manage connection pools reliably and support serverless/edge environments.
- **Decision**: Configure Prisma 7 using `@prisma/adapter-pg` coupled with `pg.Pool` inside `lib/prisma.ts`.
- **Consequence**: Provides high-throughput connection pooling, clean TypeScript client generation into `lib/generated/prisma`, and verified PostgreSQL 16 connectivity.

---

## ADR-006: React 19 Client Hydration Sync via `useSyncExternalStore`

- **Status**: Accepted
- **Context**: Calling `setState` inside `useEffect` on mount triggers React compiler warnings (`react-hooks/set-state-in-effect`) and causes unnecessary cascading re-renders.
- **Decision**: Use `useSyncExternalStore` in client-only components (such as `ThemeToggle`) to evaluate mounted state on the client without invoking `useEffect` state synchronization.
- **Consequence**: Zero cascading renders, full React 19 compiler compliance, and flicker-free client hydration.

---

## ADR-007: Mandatory Verification-First Authentication Gate

- **Status**: Accepted
- **Context**: Previously, newly registered users could potentially sign in before confirming their email. In a high-trust campus community, unverified emails introduce spam risk and identity spoofing.
- **Decision**: Configure Better Auth with `requireEmailVerification: true` and `autoSignIn: false`. Intercept `EMAIL_NOT_VERIFIED` HTTP 403 errors on the login form and prompt the user to verify their inbox before session creation.
- **Consequence**: Unverified members are strictly locked out of login until the cryptographic email link is clicked, guaranteeing 100% verified identities.

---

## ADR-008: Gmail SMTP & Nodemailer for Universal Transactional Delivery

- **Status**: Accepted
- **Context**: Third-party email API sandbox domains (such as Resend's free tier) restrict outbound delivery exclusively to the account owner's email address. Testing external student Gmail or university addresses resulted in HTTP 403 delivery blocks.
- **Decision**: Wire `nodemailer` with Gmail SMTP and a 16-character Google App Password (`lib/email.ts`), keeping `devEmailStore` active for unit testing.
- **Consequence**: Real transactional verification and password reset emails are delivered to any valid inbox globally without requiring a purchased custom domain.

---

## ADR-009: Academic CGPA Verification Decoupling

- **Status**: Accepted
- **Context**: Academic performance (CGPA) directly determines job and internship eligibility, but university registrar credentials and institutional identity are reviewed separately from transcripts.
- **Decision**: Add `isCgpaVerified` to the `Profile` model with dedicated admin toggle endpoint (`POST /api/admin/members/[id]/verify-cg`) and directory filter options (`CG_VERIFIED`, `CG_PENDING`).
- **Consequence**: Enables administrators to review and verify student GPAs independently of general membership claims.

---

## ADR-010: De-AI-ified Institutional Design & Grounded Identity

- **Status**: Accepted
- **Context**: Generic AI templates often rely on floating capsule pills with pulsing radar dots (`animate-ping`). This looks synthetic and detracts from an authoritative university portal aesthetic.
- **Decision**: Remove floating bubble pills and pulsing animations. Replace with grounded institutional typography, university crest anchors (`Jagannath University / Campus Career Community`), and crisp micro-tags (`rounded-md` / `rounded-lg`).
- **Consequence**: The application presents an authentic, professional, human-crafted institutional appearance.
