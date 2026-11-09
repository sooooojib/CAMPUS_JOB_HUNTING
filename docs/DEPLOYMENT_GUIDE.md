# UniCareer Community — Production Deployment Guide

> **Scope**: Step-by-step production deployment instructions, environment provisioning, database migrations, security hardening, and operational runbooks for UniCareer Community.

---

## 1. Architecture Overview

UniCareer Community is deployed as a modern full-stack web application:
- **Application Host**: Vercel or Node.js Docker Container (Node 20+ LTS).
- **Database Engine**: Neon Lakebase PostgreSQL 16 (Serverless, Autoscaling, Connection Pooling).
- **Object Storage**: Neon S3-compatible Object Storage or Private Cloud Storage with signed stream routing.
- **Background Cron**: Vercel Cron, GitHub Actions, or Kubernetes CronJob invoking `/api/cron/reminders`.

```
                    ┌───────────────────────────┐
                    │     Client / Browser      │
                    └─────────────┬─────────────┘
                                  │ HTTPS
                                  ▼
                    ┌───────────────────────────┐
                    │     Vercel / Edge Proxy   │
                    │   (Middleware Auth Check) │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Next.js 16 App Server   │
                    │ (Server Actions & Routes) │
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌─────────────────────────────────┐        ┌─────────────────────────────────┐
│     Neon Lakebase Postgres      │        │       Neon Object Storage       │
│    (Prisma ORM via pgBouncer)   │        │     (Private Resumes & Docs)    │
└─────────────────────────────────┘        └─────────────────────────────────┘
```

---

## 2. Infrastructure Provisioning

### A. Database Provisioning (Neon Lakebase Postgres)
1. Log in to the [Neon Console](https://console.neon.tech) and create a new project: `unicareer-production`.
2. Configure PostgreSQL version: `16`.
3. Obtain the pooled database connection string (`postgresql://...?sslmode=require&pgbouncer=true`) and direct migration connection string (`postgresql://...?sslmode=require`).
4. Set compute autoscaling parameters (e.g., Min 0.25 CU, Max 2 CU).

### B. Storage Provisioning
1. In the Neon Console or cloud provider, provision a private bucket: `unicareer-production-resumes`.
2. Ensure public read access is **DISABLED** to guarantee candidate privacy.
3. Configure credentials: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`.

---

## 3. Environment Configuration

Create production environment variables in your deployment dashboard (e.g., Vercel Project Settings > Environment Variables):

| Variable Name | Description | Example / Recommendation |
| :--- | :--- | :--- |
| `DATABASE_URL` | Pooled connection string for runtime queries | `postgresql://user:pass@ep-xxx-pooler.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Direct connection string for Prisma migrations | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | 32+ byte cryptographic secret for token signing | Generate via `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Production canonical base URL | `https://jnujobhunting.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Frontend public domain URL | `https://jnujobhunting.vercel.app` |
| `SMTP_HOST` | Gmail SMTP Host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP Port | `587` |
| `SMTP_USER` | Gmail Address | `sooooooooojib@gmail.com` |
| `SMTP_PASS` | 16-character Google App Password | `ahgiungxrzcxlndg` |
| `EMAIL_FROM` | Sender Name & Address | `"\"UniCareer Community\" <sooooooooojib@gmail.com>"` |
| `CRON_SECRET` | Bearer token to authorize scheduled reminder crons | Generate via `openssl rand -hex 24` |
| `NODE_ENV` | Environment identifier | `production` |

---

## 4. Pre-Deployment Database Migration Runbook

Before serving live traffic, apply Prisma schema migrations using the direct database connection:

```bash
# 1. Install production dependencies
npm ci

# 2. Generate Prisma Client
npx prisma generate

# 3. Apply schema migrations
npx prisma migrate deploy

# 4. (Optional) Run sanity connection check
npx vitest run tests/unit/database.test.ts
```

> [!IMPORTANT]
> Never use `prisma db push` in production. Always use `prisma migrate deploy` to ensure migration integrity and zero data loss.

---

## 5. Build and Deployment Execution

### Deploying on Vercel
1. Connect the GitHub repository `origin/main` to Vercel.
2. Select Framework Preset: `Next.js`.
3. Configure Build Command: `npm run build`.
4. Configure Output Directory: `.next`.
5. Trigger initial deployment.
6. Verify Build Logs confirm `✓ Generating static pages (68/68)` with code 0.

### Deploying via Docker (Self-Hosted / Kubernetes)
Use the production multi-stage Dockerfile:

```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 6. Post-Deployment Verification Checklist

Immediately following deployment, run the following health checks:

- [ ] **Health Endpoint**: `GET https://unicareer.university.edu/api/health` returns `200 OK` with database latency `< 50ms`.
- [ ] **SSL / TLS**: Verify HTTPS certificate is active with HSTS enabled.
- [ ] **Public Routes**: Verify landing page `/`, `/login`, `/register`, and `/about` load cleanly without auth redirects.
- [ ] **Protected Routes**: Verify `/opportunities`, `/community`, and `/dashboard` redirect unauthenticated visitors to `/login`.
- [ ] **Admin Authorization**: Verify non-admin accounts accessing `/admin` are redirected with HTTP 403 / access denied.
- [ ] **Cron Execution**: Verify scheduled cron triggers `POST /api/cron/reminders` with `Authorization: Bearer <CRON_SECRET>` returning `200 OK`.

---

## 7. Disaster Recovery & Backup Runbooks

### Neon Instant Point-in-Time Restore (PITR)
Neon automatically records WAL logs for point-in-time recovery:
1. In the Neon Console, navigate to `Operations` > `Restore`.
2. Select the recovery timestamp (up to 7 days in past).
3. Restore to a new branch, verify database state, and update `DATABASE_URL`.

### Database Schema Rollback
If a faulty migration was applied:
```bash
# 1. Roll back the problematic migration in schema.prisma
# 2. Create corrective migration
npx prisma migrate dev --name revert_faulty_migration
# 3. Deploy corrective migration
npx prisma migrate deploy
```

