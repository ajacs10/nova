import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Resend } from 'resend';
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

    const verificationToken = randomBytes(32).toString('base64url');
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name.trim(),
        email,
        phone: registerDto.phone?.trim() || null,
        passwordHash: await argon2.hash(registerDto.password, { type: argon2.argon2id }),
        emailVerificationTokenHash: this.hashToken(verificationToken),
        emailVerificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      select: { id: true, name: true, email: true },
    });

    try {
      await this.sendVerificationEmail(user.name, user.email, verificationToken);
    } catch {
      await this.prisma.user.delete({ where: { id: user.id } });
      throw new InternalServerErrorException('Verification email could not be sent');
    }

    return { message: 'Verification email sent' };
  }

  async login(loginDto: LoginDto, request: FastifyRequest) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email.trim().toLowerCase() } });
    if (!user || !(await argon2.verify(user.passwordHash, loginDto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email not verified');
    }

    return {
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatarData: user.avatarData, role: user.role },
      sessionToken: await this.createSession(user.id, request),
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: this.hashToken(token),
        emailVerificationExpiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    if (!user) throw new UnauthorizedException('Invalid or expired verification link');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });
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

  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });
    const checkIns = await this.prisma.withUserContext(userId, (tx) =>
      tx.checkIn.findMany({ orderBy: { createdAt: 'asc' } }),
    );
    return { user, checkIns };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  setSessionCookie(reply: FastifyReply, sessionToken: string) {
    reply.setCookie('nova_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  clearSessionCookie(reply: FastifyReply) {
    reply.clearCookie('nova_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api',
    });
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

  private escapeHtml(value: string) {
    return value.replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    })[character] ?? character);
  }

  private async sendVerificationEmail(name: string, email: string, token: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const frontendUrl = process.env.FRONTEND_URL;
    if (!apiKey || !from || !frontendUrl) {
      throw new Error('Email environment variables are missing');
    }

    const resend = new Resend(apiKey);
    const verificationUrl = `${frontendUrl}/pt/auth/verify-email?token=${encodeURIComponent(token)}`;
    const safeName = this.escapeHtml(name);
    const safeVerificationUrl = this.escapeHtml(verificationUrl);
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Confirma o teu email na NOVA Psychology',
      html: `<!DOCTYPE html>
<html lang="pt">
<body style="margin:0;padding:0;background-color:#060810;font-family:Arial,Helvetica,sans-serif;color:#f8f9fc;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Confirma o teu email para terminares a criação da tua conta NOVA Psychology.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#060810;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#0d1530;border:1px solid #364876;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;background-color:#060810;">
          <img src="https://nova-psychology.vercel.app/icons/nova-icon-192.svg" alt="NOVA Psychology" width="52" height="52" style="display:block;margin-bottom:16px;border:0;">
          <div style="font-size:25px;line-height:1;font-weight:700;letter-spacing:1px;color:#00d2b5;">NOVA</div>
          <div style="margin-top:6px;font-size:12px;line-height:1;letter-spacing:1.5px;color:#b9c3db;">PSYCHOLOGY</div>
        </td></tr>
        <tr><td style="padding:38px 32px 34px;">
          <h1 style="margin:0 0 22px;font-size:26px;line-height:1.3;font-weight:700;color:#f8f9fc;">A tua conta NOVA está quase pronta</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#dde2ef;">Olá, ${safeName}!</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#dde2ef;">Obrigado por te juntares à NOVA Psychology.</p>
          <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#dde2ef;">Para terminares a criação da tua conta, confirma o teu endereço de email através do botão abaixo:</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 30px;"><tr><td align="center" style="border-radius:9px;background-color:#00d2b5;">
            <a href="${safeVerificationUrl}" target="_blank" style="display:inline-block;padding:15px 26px;border-radius:9px;background-color:#00d2b5;color:#060810;font-size:16px;line-height:1;font-weight:700;text-decoration:none;">Confirmar o meu email</a>
          </td></tr></table>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#b9c3db;">A confirmação ajuda-nos a manter a tua conta segura. Este link é válido durante 24 horas.</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#b9c3db;">Se não foste tu a criar esta conta, podes ignorar este email.</p>
          <p style="margin:28px 0 0;font-size:15px;line-height:1.7;color:#dde2ef;">Até já,<br><strong style="color:#00d2b5;">A equipa NOVA Psychology</strong></p>
        </td></tr>
        <tr><td style="padding:22px 32px;background-color:#182350;border-top:1px solid #364876;">
          <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:#b9c3db;">O botão não funcionou? Copia e cola este endereço no teu navegador:</p>
          <p style="margin:0;font-size:12px;line-height:1.6;word-break:break-all;color:#00d2b5;">${safeVerificationUrl}</p>
        </td></tr>
      </table>
      <p style="max-width:560px;margin:20px auto 0;text-align:center;font-size:11px;line-height:1.6;color:#6378a3;">NOVA Psychology · Bem-estar, autoconsciência e cuidado diário</p>
    </td></tr>
  </table>
</body>
</html>`,
    });
    if (error) throw new Error(error.message);
  }
}
