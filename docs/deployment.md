# Deployment

This repository is currently configured for local development. It is not yet a production deployment package.

## Required production configuration

Set these values through the hosting provider secret manager:

- `NODE_ENV=production`
- `PORT`
- `FRONTEND_URL` as an HTTPS origin
- `DATABASE_URL` for the production PostgreSQL pool
- `DIRECT_URL` for Prisma migrations
- `JWT_SECRET` as a long random value if the authentication implementation uses it
- `NEXT_PUBLIC_API_URL` as the public API URL
- `RESEND_API_KEY` as a private Resend API key
- `EMAIL_FROM` as `onboarding@resend.dev` for Resend testing, or an address on a verified production domain

For the current production deployment, configure the Render backend with:

- Root directory: `backend`
- Build command: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
- Start command: `npm run start:prod`
- `FRONTEND_URL=https://nova-psychology.vercel.app`

Configure the Vercel frontend with:

- `NEXT_PUBLIC_API_URL=https://nova-api-n8qb.onrender.com/api`

After changing the Render build command, manually deploy the latest commit. The
recovery endpoints (`/api/recovery/entries` and `/api/recovery/activities`) were
introduced after the backend currently serving the public site, so a frontend-only
deployment cannot make those endpoints available.

`FRONTEND_URL` may contain comma-separated HTTPS origins when preview deployments
also need access. Do not add a trailing slash to the API origin or frontend origin.

Never commit `.env`, `.env.local`, database passwords, tokens, or provider keys.

## Release sequence

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start:prod
```

```bash
cd frontend
npm ci
npm run build
npm run start
```

Run the checks in the root README before releasing. Use separate databases, credentials, and storage for development, testing, and production. Define backups, restore tests, health checks, monitoring, rollback, and secret rotation before public launch.
