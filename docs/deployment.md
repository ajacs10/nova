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
