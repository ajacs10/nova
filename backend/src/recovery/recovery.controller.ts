import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { SessionGuard } from '../auth/session.guard.js';
import { CreateActivityEntryDto } from './dto/create-activity-entry.dto.js';
import { CreateRecoveryEntryDto } from './dto/create-recovery-entry.dto.js';
import { UpdateReturnToActivityDto, UpdateReturnToLearnDto } from './dto/update-return-plans.dto.js';
import { UpdateRecoveryEntryDto } from './dto/update-recovery-entry.dto.js';
import { UpdateActivityEntryDto as UpdateActivityDto } from './dto/update-activity-entry.dto.js';
import { RecoveryService } from './recovery.service.js';

@Controller('recovery')
@UseGuards(SessionGuard)
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post('entries')
  createEntry(@Body() dto: CreateRecoveryEntryDto, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.createEntry(dto, request.user.id);
  }

  @Get('entries')
  listEntries(@Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.listEntries(request.user.id);
  }

  @Patch('entries/:id')
  updateEntry(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRecoveryEntryDto, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.updateEntry(id, dto, request.user.id);
  }

  @Delete('entries/:id')
  deleteEntry(@Param('id', ParseUUIDPipe) id: string, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.deleteEntry(id, request.user.id);
  }

  @Post('activities')
  createActivity(@Body() dto: CreateActivityEntryDto, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.createActivity(dto, request.user.id);
  }

  @Get('activities')
  listActivities(@Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.listActivities(request.user.id);
  }

  @Patch('activities/:id')
  updateActivity(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateActivityDto, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.updateActivity(id, dto, request.user.id);
  }

  @Delete('activities/:id')
  deleteActivity(@Param('id', ParseUUIDPipe) id: string, @Req() request: FastifyRequest & { user: { id: string } }) {
    return this.recoveryService.deleteActivity(id, request.user.id);
  }

  @Get('return-to-learn')
  getReturnToLearn(@Req() request: FastifyRequest & { user: { id: string } }) { return this.recoveryService.getReturnToLearn(request.user.id); }

  @Patch('return-to-learn')
  saveReturnToLearn(@Body() dto: UpdateReturnToLearnDto, @Req() request: FastifyRequest & { user: { id: string } }) { return this.recoveryService.saveReturnToLearn(dto, request.user.id); }

  @Get('return-to-activity')
  getReturnToActivity(@Req() request: FastifyRequest & { user: { id: string } }) { return this.recoveryService.getReturnToActivity(request.user.id); }

  @Patch('return-to-activity')
  saveReturnToActivity(@Body() dto: UpdateReturnToActivityDto, @Req() request: FastifyRequest & { user: { id: string } }) { return this.recoveryService.saveReturnToActivity(dto, request.user.id); }
}