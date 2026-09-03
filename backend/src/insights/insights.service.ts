import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getInsights(userId: string) {
    const checkIns = await this.prisma.withUserContext(userId, (tx) =>
      tx.checkIn.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    );

    if (checkIns.length === 0) return [];

    const averageSleep = checkIns.reduce((sum, item) => sum + Number(item.sleep), 0) / checkIns.length;
    const averageEnergy = checkIns.reduce((sum, item) => sum + item.energy, 0) / checkIns.length;
    const averageWorkload = checkIns.reduce((sum, item) => sum + item.workload, 0) / checkIns.length;

    return [
      averageSleep < 6.5 ? {
        id: 'sleep', type: 'recuperacao', title: 'Sono & Estabilidade',
        description: `A tua média de sono é ${averageSleep.toFixed(1)} horas.`,
        action: 'Experimenta proteger um horário regular de descanso.', confidence: 80,
        period: ['manha', 'noite'], observedAt: new Date().toISOString(),
      } : null,
      averageEnergy < 5 ? {
        id: 'energy', type: 'energia', title: 'Nível de Energia',
        description: `A tua energia média está em ${averageEnergy.toFixed(1)}/10.`,
        action: 'Observa quais rotinas coincidem com dias de menor energia.', confidence: 76,
        period: ['tarde'], observedAt: new Date().toISOString(),
      } : null,
      averageWorkload > 7 ? {
        id: 'workload', type: 'carga', title: 'Carga de Trabalho',
        description: `A tua carga média está em ${averageWorkload.toFixed(1)}/10.`,
        action: 'Planeia pausas curtas antes de períodos de maior carga.', confidence: 78,
        period: ['tarde'], observedAt: new Date().toISOString(),
      } : null,
    ].filter((insight): insight is NonNullable<typeof insight> => insight !== null);
  }

  async getDashboard(userId: string) {
    const { checkIns, totalCheckins } = await this.prisma.withUserContext(userId, async (tx) => ({
      checkIns: await tx.checkIn.findMany({
        where: { userId }, orderBy: { createdAt: 'desc' }, take: 30,
      }),
      totalCheckins: await tx.checkIn.count({ where: { userId } }),
    }));
    const avgMood = checkIns.length ? checkIns.reduce((sum, item) => sum + item.mood, 0) / checkIns.length : 0;
    const checkInDates = new Set(checkIns.map((item) => item.createdAt.toISOString().slice(0, 10)));
    let streak = 0;
    const cursor = new Date();
    while (checkInDates.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return {
      streak,
      totalCheckins,
      avgMood: Number(avgMood.toFixed(1)),
      weekEntries: checkIns.slice(0, 7).reverse().map((item) => ({
        id: item.id,
        userId: item.userId,
        date: item.createdAt.toISOString().slice(0, 10),
        mood: item.mood,
        sleep: Number(item.sleep),
        energy: item.energy,
        workload: item.workload,
        note: item.note ?? undefined,
        createdAt: item.createdAt.toISOString(),
      })),
    };
  }
}
