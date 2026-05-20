# ACCT Platform (backend workspace)

This repository contains the backend workspace for the ACCT platform.

See `MASTER_IMPLEMENTATION_PROMPT.md` in the frontend repo for the full implementation plan.

Quick start (backend):

```bash
cd backend
npm install
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```
