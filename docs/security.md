# Security Notes

The backend is the authority for authentication, authorization, validation, and ownership checks. The frontend must not be treated as a security boundary.

Current controls include Argon2id password hashing, hashed session tokens, HttpOnly cookies, Secure cross-site production cookies, SameSite protection for local development, origin checks for state-changing requests, restricted CORS, global and authentication-specific request limits, DTO validation, parameterized Prisma queries, avatar content validation, and PostgreSQL RLS for check-in records when the pending migration is deployed.

The application uses Supabase as a PostgreSQL host through Prisma. It does not expose a Supabase service key or call Supabase directly from the browser. The RLS policy uses the transaction-local `app.user_id` setting because authentication is implemented by the NestJS session guard rather than Supabase Auth.

Before a public launch, complete tests for login abuse, session lifecycle, CSRF behavior, IDOR/BOLA, role enforcement, malformed input, upload quotas, data deletion, retention, backups, and production configuration. Review the legal pages with qualified counsel.
