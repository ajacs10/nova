import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { SessionGuard } from './session.guard.js';
import { UploadAvatarDto } from './dto/upload-avatar.dto.js';

class UpdateProfileDto
{
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}

class ChangePasswordDto
{
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  newPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  confirmPassword!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.authService.register(registerDto, request);
    this.authService.setSessionCookie(reply, result.sessionToken);
    return { user: result.user };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.authService.login(loginDto, request);
    this.authService.setSessionCookie(reply, result.sessionToken);
    return { user: result.user };
  }

  @Post('logout')
  async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    await this.authService.logout(request.cookies?.nova_session);
    this.authService.clearSessionCookie(reply);
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  getMe(@Req() request: FastifyRequest & { user: { id: string; name: string; email: string; role: string } }) {
    return { user: request.user };
  }

  @Patch('me')
  @UseGuards(SessionGuard)
  updateProfile(
    @Body() profile: UpdateProfileDto,
    @Req() request: FastifyRequest & { user: { id: string } },
  ) {
    return this.authService.updateProfile(request.user.id, profile);
  }

  @Post('change-password')
  @UseGuards(SessionGuard)
  changePassword(
    @Body() passwords: ChangePasswordDto,
    @Req() request: FastifyRequest & { user: { id: string } },
  ) {
    return this.authService.changePassword(request.user.id, passwords);
  }

  @Post('avatar')
  @UseGuards(SessionGuard)
  async uploadAvatar(
    @Body() body: UploadAvatarDto,
    @Req() request: FastifyRequest & { user: { id: string } },
  ) {
    return this.authService.updateAvatar(request.user.id, body.data, body.mimeType);
  }
}
