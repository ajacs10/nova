import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateActivityEntryDto } from './dto/create-activity-entry.dto.js';
import { CreateRecoveryEntryDto } from './dto/create-recovery-entry.dto.js';
import { UpdateActivityEntryDto } from './dto/update-activity-entry.dto.js';
import { UpdateRecoveryEntryDto } from './dto/update-recovery-entry.dto.js';
import { UpdateReturnToActivityDto, UpdateReturnToLearnDto } from './dto/update-return-plans.dto.js';

@Injectable()
export class RecoveryService {
  constructor(private readonly prisma: PrismaService) {}

  createEntry(dto: CreateRecoveryEntryDto, userId: string) {
    return this.prisma.withUserContext(userId, (tx) => tx.recoveryEntry.create({ data: { ...dto, userId } }));
  }

  listEntries(userId: string) {
    return this.prisma.withUserContext(userId, (tx) => tx.recoveryEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 90 }));
  }

  async updateEntry(id: string, dto: UpdateRecoveryEntryDto, userId: string) {
    return this.prisma.withUserContext(userId, async (tx) => {
      const entry = await tx.recoveryEntry.findFirst({ where: { id, userId }, select: { id: true } });
      if (!entry) throw new NotFoundException('Recovery entry not found');
      return tx.recoveryEntry.update({ where: { id }, data: dto });
    });
  }

  async deleteEntry(id: string, userId: string) {
    return this.prisma.withUserContext(userId, async (tx) => {
      const entry = await tx.recoveryEntry.findFirst({ where: { id, userId }, select: { id: true } });
      if (!entry) throw new NotFoundException('Recovery entry not found');
      return tx.recoveryEntry.delete({ where: { id } });
    });
  }

  createActivity(dto: CreateActivityEntryDto, userId: string) {
    return this.prisma.withUserContext(userId, (tx) => tx.activityEntry.create({ data: { ...dto, userId } }));
  }

  listActivities(userId: string) {
    return this.prisma.withUserContext(userId, (tx) => tx.activityEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 90 }));
  }

  async updateActivity(id: string, dto: UpdateActivityEntryDto, userId: string) {
    return this.prisma.withUserContext(userId, async (tx) => {
      const entry = await tx.activityEntry.findFirst({ where: { id, userId }, select: { id: true } });
      if (!entry) throw new NotFoundException('Activity entry not found');
      return tx.activityEntry.update({ where: { id }, data: dto });
    });
  }

  async deleteActivity(id: string, userId: string) {
    return this.prisma.withUserContext(userId, async (tx) => {
      const entry = await tx.activityEntry.findFirst({ where: { id, userId }, select: { id: true } });
      if (!entry) throw new NotFoundException('Activity entry not found');
      return tx.activityEntry.delete({ where: { id } });
    });
  }

  getReturnToLearn(userId: string) { return this.prisma.withUserContext(userId, (tx) => tx.returnToLearn.findUnique({ where: { userId } })); }

  saveReturnToLearn(dto: UpdateReturnToLearnDto, userId: string) { return this.prisma.withUserContext(userId, (tx) => tx.returnToLearn.upsert({ where: { userId }, create: { ...dto, userId }, update: dto })); }

  getReturnToActivity(userId: string) { return this.prisma.withUserContext(userId, (tx) => tx.returnToActivity.findUnique({ where: { userId } })); }

  saveReturnToActivity(dto: UpdateReturnToActivityDto, userId: string) { return this.prisma.withUserContext(userId, (tx) => tx.returnToActivity.upsert({ where: { userId }, create: { ...dto, userId }, update: dto })); }
}
