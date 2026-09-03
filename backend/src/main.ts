import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';
  const frontendUrls = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const frontendUrl = frontendUrls[0];
  const allowedOrigins = new Set(frontendUrls);

  if (
    isProduction &&
    (frontendUrls.length === 0 ||
      frontendUrls.some((url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol !== 'https:' || parsed.pathname !== '/' || parsed.search || parsed.hash;
        } catch {
          return true;
        }
      }))
  ) {
    throw new Error('FRONTEND_URL must be an HTTPS URL in production');
  }
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 3 * 1024 * 1024,
      connectionTimeout: 10_000,
      requestTimeout: 15_000,
    }),
  );

  await app.register(fastifyCookie);
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    hook: 'onRequest',
    keyGenerator: (request) => request.ip,
  });

  const authRequestCounts = new Map<string, { count: number; resetAt: number }>();
  const authPaths = new Set([
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/change-password',
  ]);

  // Security headers
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", frontendUrl!],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    hsts: isProduction
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
  });

  // CORS — only allow the frontend origin
  app.enableCors({
    origin: frontendUrls.length > 0 ? frontendUrls : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });

  app.getHttpAdapter().getInstance().addHook('onRequest', async (request, reply) => {
    const origin = request.headers.origin;
    const protectedMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    if (protectedMethod && origin && !allowedOrigins.has(origin)) {
      return reply.code(403).send({ message: 'Origin not allowed' });
    }

    if (authPaths.has(request.url.split('?')[0])) {
      const key = `${request.ip}:${request.url.split('?')[0]}`;
      const now = Date.now();
      const current = authRequestCounts.get(key);
      if (!current || current.resetAt <= now) {
        authRequestCounts.set(key, { count: 1, resetAt: now + 60_000 });
      } else if (current.count >= 10) {
        return reply.code(429).send({ message: 'Too many requests' });
      } else {
        current.count += 1;
      }

      if (authRequestCounts.size > 10_000) {
        for (const [entryKey, entry] of authRequestCounts) {
          if (entry.resetAt <= now) authRequestCounts.delete(entryKey);
        }
      }
    }
  });

  // Global input validation — strip unknown fields, transform types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // All routes under /api
  app.setGlobalPrefix('api');

  const port = parseInt(String(process.env.PORT ?? '3001'), 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`NOVA API running on http://localhost:${port}/api`);
}
await bootstrap();
