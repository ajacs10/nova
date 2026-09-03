import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateCheckInDto } from './dto/create-check-in.dto.js';

@Injectable()
export class CheckInService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCheckInDto: CreateCheckInDto, userId: string) {
    return this.prisma.withUserContext(userId, (tx) =>
      tx.checkIn.create({ data: { ...createCheckInDto, userId } }),
    );
  }

  findAll(userId: string) {
    return this.prisma.withUserContext(userId, (tx) =>
      tx.checkIn.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }
}
