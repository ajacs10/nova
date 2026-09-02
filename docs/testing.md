# Testing

Run backend checks from `backend`:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
npx prisma validate
```

Run frontend checks from `frontend`:

```bash
npm run lint
npm run build
```

Before production, add coverage for authentication, session expiry and revocation, ownership isolation between users, input validation, avatar uploads, legal routes, responsive navigation, and error handling. Dependency audit results must be reviewed rather than fixed with forced major or downgrade changes.
