export type GameId = "pattern" | "focus" | "memory" | "day";

export interface GameProps {
  isPt: boolean;
  onComplete: (score: number) => void;
}
