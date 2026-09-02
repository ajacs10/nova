import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaService } from '../database/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { validateAndSanitizeAvatar } from '../lib/security/avatar-validator.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto, request: FastifyRequest) {
    const email = registerDto.email.trim().toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name.trim(),
        email,
        passwordHash: await argon2.hash(registerDto.password, { type: argon2.argon2id }),
      },
      select: { id: true, name: true, email: true, phone: true, avatarData: true, role: true },
    });

    return { user, sessionToken: await this.createSession(user.id, request) };
  }

  async login(loginDto: LoginDto, request: FastifyRequest) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email.trim().toLowerCase() } });
    if (!user || !(await argon2.verify(user.passwordHash, loginDto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatarData: user.avatarData, role: user.role },
      sessionToken: await this.createSession(user.id, request),
    };
  }

  async logout(sessionToken?: string) {
    if (sessionToken) {
      await this.prisma.session.updateMany({
        where: { refreshTokenHash: this.hashToken(sessionToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  async getUserFromSession(sessionToken: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        refreshTokenHash: this.hashToken(sessionToken),
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { user: { select: { id: true, name: true, email: true, phone: true, avatarData: true, role: true } } },
    });
    return session?.user ?? null;
  }

  async updateProfile(userId: string, profile: { name: string; email: string; phone?: string }) {
    const email = profile.email.trim().toLowerCase();
    const existing = await this.prisma.user.findFirst({ where: { email, NOT: { id: userId } } });
    if (existing) throw new ConflictException('Email already registered');
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: profile.name.trim(), email, phone: profile.phone?.trim() || null },
      select: { id: true, name: true, email: true, phone: true, avatarData: true, role: true },
    });
    return { user };
  }

  async changePassword(userId: string, passwords: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    if (passwords.newPassword !== passwords.confirmPassword) {
      throw new UnauthorizedException('New passwords do not match');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
    if (!user || !(await argon2.verify(user.passwordHash, passwords.currentPassword))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await argon2.hash(passwords.newPassword, { type: argon2.argon2id }) },
    });
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Password updated' };
  }

  async updateAvatar(userId: string, dataUrl?: string, declaredMimeType?: string) {
    if (!dataUrl || !declaredMimeType || !dataUrl.startsWith(`data:${declaredMimeType};base64,`)) {
      throw new UnauthorizedException('Invalid avatar upload');
    }

    const buffer = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    const result = await validateAndSanitizeAvatar(buffer, declaredMimeType);
    if (!result.success || !result.sanitizedBuffer) {
      throw new UnauthorizedException(result.error ?? 'Invalid avatar upload');
    }

    const avatarData = `data:image/webp;base64,${result.sanitizedBuffer.toString('base64')}`;
    await this.prisma.user.update({ where: { id: userId }, data: { avatarData } });
    return { avatarData };
  }

  setSessionCookie(reply: FastifyReply, sessionToken: string) {
    reply.setCookie('nova_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  clearSessionCookie(reply: FastifyReply) {
    reply.clearCookie('nova_session', { httpOnly: true, sameSite: 'strict', path: '/api' });
  }

  private async createSession(userId: string, request: FastifyRequest) {
    const token = randomBytes(32).toString('base64url');
    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: this.hashToken(token),
        userAgent: request.headers['user-agent']?.slice(0, 512),
        ipAddress: request.ip,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
    return token;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
