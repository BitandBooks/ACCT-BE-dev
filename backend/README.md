# ACCT Backend

This folder contains the NestJS backend for the ACCT platform.

Local development (stabilization) steps

1. Install dependencies

```bash
cd backend
npm install
```

2. Start a local Postgres 15 instance

```bash
docker compose -f docker-compose.local.yml up -d
```

3. Copy environment example

```bash
cp .env.example .env
```

4. Generate Prisma client

```bash
npx prisma generate
```

5. Run Prisma migrations (applies existing migrations)

```bash
npx prisma migrate dev
```

6. Start the development server

```bash
npm run start:dev
```

7. Run end-to-end tests

```bash
npm run test:e2e
```

Notes:
- The included `docker-compose.local.yml` creates Postgres on port `5432`.
- Matching `DATABASE_URL` example:
	`postgresql://postgres:postgres@localhost:5432/acct_dev?schema=public`
- Do not commit real secrets. Copy `.env.example` to `.env` and update values.

API docs: http://localhost:3001/api/docs
