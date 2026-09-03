import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateCheckInDto } from './dto/create-check-in.dto.js';

@Injectable()
export class CheckInService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCheckInDto: CreateCheckInDto, userId: string) {
    if (this.isCrisisMessage(createCheckInDto.note)) {
      return Promise.resolve({
        crisis: true,
        message: 'Procura ajuda imediata. Afasta-te de janelas, produtos perigosos e outras pessoas em risco. Liga para o 112 ou vai ao hospital mais próximo.',
      });
    }

    return this.prisma.withUserContext(userId, (tx) =>
      tx.checkIn.create({ data: { ...createCheckInDto, userId } }),
    );
  }

  private isCrisisMessage(note?: string) {
    if (!note) return false;
    return /(matar-me|matar me|suicid|enforcar|beber lix[ií]via|kill myself|suicide|hang myself|drink bleach|hurt other|matar outras pessoas)/i.test(note);
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
