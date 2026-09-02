# Security Notes

The backend is the authority for authentication, authorization, validation, and ownership checks. The frontend must not be treated as a security boundary.

Current controls include Argon2id password hashing, hashed session tokens, HttpOnly cookies, SameSite cookies, Fastify security headers, restricted CORS, request limits, DTO validation, parameterized Prisma queries, and avatar content validation.

Before a public launch, complete tests for login abuse, session lifecycle, CSRF behavior, IDOR/BOLA, role enforcement, malformed input, upload quotas, data deletion, retention, backups, and production configuration. Review the legal pages with qualified counsel.
