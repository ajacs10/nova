export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface WellbeingEntry {
  id: string;
  userId: string;
  date: string;
  mood: MoodLevel;
  sleep: number;
  energy: number;
  workload: number;
  note?: string;
  createdAt: string;
}

export interface CheckInFormData {
  mood: MoodLevel;
  sleep: number;
  energy: number;
  workload: number;
  note?: string;
}

export interface InsightPattern {
  id: string;
  type: string;
  description: string;
  sampleSize: number;
  suggestion?: string;
  observedAt: string;
}

export interface WeeklyStats {
  avgMood: number;
  avgSleep: number;
  avgEnergy: number;
  streak: number;
  totalCheckins: number;
  weekEntries: WellbeingEntry[];
}
