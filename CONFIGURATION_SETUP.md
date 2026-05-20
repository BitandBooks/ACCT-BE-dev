CONFIGURATION SETUP
===================

This document describes the external configuration and GitHub Secrets to set for the ACCT project.

Security rules (do NOT commit secrets)
- Never commit real secret values to the repository.
- Do not commit `.env` or service account JSON files.
- Frontend public keys may use `NEXT_PUBLIC_` prefixes; backend secrets must be stored in GitHub Secrets or an external secret manager.

Recommended GitHub Secrets (backend repository: `ACCT-BE-dev`)
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- GCP_SA_KEY (service account JSON content)
- GCP_PROJECT
- CLOUD_RUN_REGION
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (escaped newlines) — store the private key string as a secret
- FIREBASE_STORAGE_BUCKET

Frontend variables (repository: `ACCT-FE-dev`) — these are NOT secrets (public safe values)
- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Where to paste keys
- Stripe publishable `pk_test_...`: paste into `ACCT-FE-dev/frontend/.env.local` as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (local only; do not commit)
- Stripe secret `sk_test_...`: paste into backend runtime secret store or local `ACCT-BE-dev/backend/.env` as `STRIPE_SECRET_KEY` (local only), or set `STRIPE_SECRET_KEY` in GitHub Secrets for CI/production.
- Stripe webhook secret `whsec_...`: set as `STRIPE_WEBHOOK_SECRET` in backend local `.env` or GitHub Secrets.
- Firebase Admin: set `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`, and `FIREBASE_STORAGE_BUCKET` in GitHub Secrets or local `backend/.env`.

Local developer steps (recommended)
1. Backend
   - Copy the example env: `cp backend/.env.example backend/.env`
   - Edit `backend/.env` and fill values for:
     - `DATABASE_URL` (local Postgres or docker compose)
     - `JWT_SECRET`, `JWT_REFRESH_SECRET`
     - `STRIPE_SECRET_KEY` (test secret) — do not commit
     - `STRIPE_WEBHOOK_SECRET` (after creating via Stripe CLI) — do not commit
     - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET` (only if using Firebase Admin locally)

2. Frontend
   - Copy example: `cp frontend/.env.local.example frontend/.env.local`
   - Fill `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (do not commit)

Untracking secrets that were accidentally committed
- Remove `backend/.env` from git tracking (do NOT delete the file locally):
  git rm --cached backend/.env
  git commit -m "Remove tracked backend .env containing secrets"

- If any Firebase service account JSON was committed (e.g. `acct-dev-firebase-adminsdk-...json`), remove it from tracking:
  git rm --cached acct-dev-firebase-adminsdk-*.json
  git commit -m "Remove committed Firebase service account JSON from repo"

Notes about Firebase private key formatting
- When storing `FIREBASE_PRIVATE_KEY` in a single-line GitHub Secret, ensure the newlines are escaped (\n). Example:
  -----BEGIN PRIVATE KEY-----\nMIIEvgIBADANB...\n-----END PRIVATE KEY-----\n

CI considerations
- For backend Cloud Run deploy workflow, ensure the following GitHub Secrets exist in the backend repo: `GCP_SA_KEY`, `GCP_PROJECT`, `CLOUD_RUN_REGION`, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and Firebase secrets if used.

End of file.
