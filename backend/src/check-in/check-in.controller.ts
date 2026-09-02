import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { CheckInService } from './check-in.service.js';
import { CreateCheckInDto } from './dto/create-check-in.dto.js';
import { SessionGuard } from '../auth/session.guard.js';

@Controller('check-in')
@UseGuards(SessionGuard)
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  create(@Body() createCheckInDto: CreateCheckInDto, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.checkInService.create(createCheckInDto, request.user.id);
  }

  @Get()
  findAll(@Req() request: FastifyRequest & { user: { id: string } }) {
    return this.checkInService.findAll(request.user.id);
  }
}
