import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { InsightsService } from './insights.service.js';
import { SessionGuard } from '../auth/session.guard.js';

@Controller('insights')
@UseGuards(SessionGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getInsights(@Req() request: FastifyRequest & { user: { id: string } }) {
    return this.insightsService.getInsights(request.user.id);
  }

  @Get('dashboard')
  getDashboard(@Req() request: FastifyRequest & { user: { id: string } }) {
    return this.insightsService.getDashboard(request.user.id);
  }
}
