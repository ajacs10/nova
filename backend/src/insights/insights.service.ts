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

    if (checkIns.length < 3) return [];

    const averageSleep = checkIns.reduce((sum, item) => sum + Number(item.sleep), 0) / checkIns.length;
    const averageEnergy = checkIns.reduce((sum, item) => sum + item.energy, 0) / checkIns.length;
    const averageWorkload = checkIns.reduce((sum, item) => sum + item.workload, 0) / checkIns.length;
    const sleepThreshold = averageSleep;
    const higherSleep = checkIns.filter((item) => Number(item.sleep) >= sleepThreshold);
    const lowerSleep = checkIns.filter((item) => Number(item.sleep) < sleepThreshold);
    const higherSleepEnergy = higherSleep.length ? higherSleep.reduce((sum, item) => sum + item.energy, 0) / higherSleep.length : 0;
    const lowerSleepEnergy = lowerSleep.length ? lowerSleep.reduce((sum, item) => sum + item.energy, 0) / lowerSleep.length : 0;
    const workloadThreshold = averageWorkload;
    const higherWorkload = checkIns.filter((item) => item.workload >= workloadThreshold);
    const lowerWorkload = checkIns.filter((item) => item.workload < workloadThreshold);
    const higherWorkloadEnergy = higherWorkload.length ? higherWorkload.reduce((sum, item) => sum + item.energy, 0) / higherWorkload.length : 0;
    const lowerWorkloadEnergy = lowerWorkload.length ? lowerWorkload.reduce((sum, item) => sum + item.energy, 0) / lowerWorkload.length : 0;
    return [
      higherSleepEnergy - lowerSleepEnergy >= 0.5 ? {
        id: 'sleep-energy', type: 'sono-energia', title: 'Sono & Energia',
        description: `Nos teus ${checkIns.length} registos, a energia média foi ${higherSleepEnergy.toFixed(1)}/10 em dias com mais sono e ${lowerSleepEnergy.toFixed(1)}/10 nos restantes.`,
        action: 'Observa se este padrão continua nos próximos check-ins.', sampleSize: checkIns.length,
        period: ['manha', 'noite'], observedAt: new Date().toISOString(),
      } : null,
      lowerWorkloadEnergy - higherWorkloadEnergy >= 0.5 ? {
        id: 'workload-energy', type: 'carga-energia', title: 'Carga & Energia',
        description: `A energia média foi ${lowerWorkloadEnergy.toFixed(1)}/10 em dias de menor carga e ${higherWorkloadEnergy.toFixed(1)}/10 nos dias de maior carga.`,
        action: 'Experimenta observar pausas e ritmo nos dias de maior carga.', sampleSize: checkIns.length,
        period: ['tarde'], observedAt: new Date().toISOString(),
      } : null,
      {
        id: 'overview', type: 'visao-geral', title: 'Resumo dos teus dados',
        description: `A média recente é ${averageSleep.toFixed(1)} horas de sono, ${averageEnergy.toFixed(1)}/10 de energia e ${averageWorkload.toFixed(1)}/10 de carga.`,
        action: 'Continua a registar para tornar as comparações mais significativas.', sampleSize: checkIns.length,
        period: ['manha', 'tarde', 'noite'], observedAt: new Date().toISOString(),
      },
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
