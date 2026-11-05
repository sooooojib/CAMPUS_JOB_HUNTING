# UniCareer Community — Environment Setup Reference

> **Purpose**: Complete reference of environment variables, secrets, configuration flags, and local/staging setup steps.

---

## 1. Environment Variables Matrix

| Variable | Required In | Purpose | Default / Format |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | All | Pooled connection string for Prisma ORM | `postgresql://user:pass@host/db?sslmode=require&pgbouncer=true` |
| `DIRECT_URL` | Staging/Prod | Unpooled connection string for Prisma migrations | `postgresql://user:pass@host/db?sslmode=require` |
| `BETTER_AUTH_SECRET` | All | Cryptographic key for session token signing and encryption | Min 32 characters (`openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | All | Base URL for authentication callbacks | `http://localhost:3000` (Dev) / `https://domain.edu` (Prod) |
| `NEXT_PUBLIC_APP_URL` | All | Public domain URL exposed to client components | `http://localhost:3000` (Dev) / `https://domain.edu` (Prod) |
| `CRON_SECRET` | All | Secret header protecting scheduled cron task endpoints | Min 24 characters (`openssl rand -hex 24`) |
| `NODE_ENV` | All | Node execution environment | `development` / `production` / `test` |
| `AWS_ACCESS_KEY_ID` | Optional | S3-compatible storage credential for private files | String |
| `AWS_SECRET_ACCESS_KEY` | Optional | S3-compatible storage secret key | String |
| `AWS_REGION` | Optional | Object storage region | e.g. `us-east-1` |
| `AWS_BUCKET_NAME` | Optional | Private storage bucket name | e.g. `unicareer-resumes` |

---

## 2. Local Development Setup (Step-by-Step)

### Prerequisites
- Node.js 20.x or higher LTS
- npm 10.x or higher
- Access to a Neon PostgreSQL instance or local PostgreSQL 16 database

### Step 1: Clone and Install
```bash
git clone https://github.com/organization/unicareer-community.git
cd unicareer-community
npm install
```

### Step 2: Configure Environment
Copy the example environment template:
```bash
cp .env.example .env
```
Fill in the database connection string and generate local secrets:
```bash
# Generate BETTER_AUTH_SECRET
openssl rand -hex 32

# Generate CRON_SECRET
openssl rand -hex 24
```

### Step 3: Initialize Database
Generate the Prisma Client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Automated Testing Execution

To run unit, integration, and workflow tests locally:

```bash
# Run all 16 test suites
npm test

# Run tests in watch mode
npx vitest

# Run workflow tests specifically
npx vitest run tests/unit/complete-user-workflows.test.ts

# Run TypeScript type check
npm run type-check

# Run ESLint validation
npm run lint

# Run production build validation
npm run build
```

---

## 4. Staging & CI/CD Pipeline Configuration

In GitHub Actions or CI runner:

```yaml
name: Continuous Integration & Verification

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
      DIRECT_URL: ${{ secrets.STAGING_DIRECT_URL }}
      BETTER_AUTH_SECRET: ${{ secrets.BETTER_AUTH_SECRET }}
      BETTER_AUTH_URL: http://localhost:3000
      NEXT_PUBLIC_APP_URL: http://localhost:3000
      CRON_SECRET: ${{ secrets.CRON_SECRET }}
      NODE_ENV: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run type-check
      - run: npm run lint
      - run: npm test
      - run: npm run build
```
