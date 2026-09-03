"use client";

import * as React from "react";
import type { GameProps } from "./game-types";

const DATASETS = [
  { rows: [["Mon", "7.5", "4", "8"], ["Tue", "5.5", "8", "4"], ["Wed", "6", "9", "5"], ["Thu", "7.5", "4", "8"]], correct: 0, answers: ["More sleep coincided with higher energy", "Workload always improved energy", "The days had identical moods"] },
  { rows: [["Mon", "8", "3", "7"], ["Tue", "7.5", "4", "7"], ["Wed", "6", "7", "5"], ["Thu", "5.5", "8", "4"]], correct: 0, answers: ["Higher workload coincided with lower energy", "Less sleep coincided with higher energy", "Energy stayed exactly the same"] },
  { rows: [["Mon", "6", "6", "6"], ["Tue", "8", "5", "8"], ["Wed", "6", "5", "6"], ["Thu", "8", "4", "8"]], correct: 1, answers: ["Workload doubled each day", "Longer sleep coincided with higher energy", "Mood was always lower after sleep"] },
  { rows: [["Mon", "7", "8", "5"], ["Tue", "7", "3", "8"], ["Wed", "6", "8", "5"], ["Thu", "8", "3", "9"]], correct: 2, answers: ["Sleep never changed", "Higher workload coincided with higher energy", "Lower workload coincided with higher energy"] },
  { rows: [["Mon", "5", "7", "4"], ["Tue", "6", "6", "5"], ["Wed", "7", "5", "7"], ["Thu", "8", "4", "8"]], correct: 1, answers: ["Energy fell as sleep increased", "Longer sleep coincided with higher energy", "Workload increased with sleep"] },
];
const TOTAL_ROUNDS = 20;

const PORTUGUESE_ANSWERS: Record<string, string> = {
  "More sleep coincided with higher energy": "Mais sono coincidiu com mais energia",
  "Workload always improved energy": "A carga melhorou sempre a energia",
  "The days had identical moods": "Os dias tiveram humores iguais",
  "Higher workload coincided with lower energy": "Mais carga coincidiu com menos energia",
  "Less sleep coincided with higher energy": "Menos sono coincidiu com mais energia",
  "Energy stayed exactly the same": "A energia ficou exatamente igual",
  "Workload doubled each day": "A carga duplicou todos os dias",
  "Longer sleep coincided with higher energy": "Mais horas de sono coincidiram com mais energia",
  "Mood was always lower after sleep": "O humor foi sempre mais baixo depois do sono",
  "Sleep never changed": "O sono nunca mudou",
  "Higher workload coincided with higher energy": "Mais carga coincidiu com mais energia",
  "Lower workload coincided with higher energy": "Menos carga coincidiu com mais energia",
  "Energy fell as sleep increased": "A energia caiu quando o sono aumentou",
  "Workload increased with sleep": "A carga aumentou com o sono",
};

export function PatternDetective({ isPt, onComplete }: GameProps) {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [finished, setFinished] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished]);
  React.useEffect(() => {
    if (elapsed < 90 || finished) return;
    const timeout = window.setTimeout(() => {
      setFinished(true);
      onComplete(score);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [elapsed, finished, onComplete, score]);
  const dataset = DATASETS[round % DATASETS.length];
  const correct = dataset.correct;
  const answers = dataset.answers.map((text) => isPt ? PORTUGUESE_ANSWERS[text] : text);

  const answer = (index: number) => {
    if (choice !== null) return;
    const nextScore = score + (index === correct ? 100 : 0);
    setChoice(index);
    setScore(nextScore);
    if (round === TOTAL_ROUNDS - 1) {
      setFinished(true);
      onComplete(nextScore);
    } else window.setTimeout(() => { setRound((value) => value + 1); setChoice(null); }, 900);
  };

  if (finished) return <Result title={isPt ? "Padrão encontrado" : "Pattern found"} text={isPt ? `Completaste ${Math.min(round + 1, TOTAL_ROUNDS)} rondas.` : `You completed ${Math.min(round + 1, TOTAL_ROUNDS)} rounds.`} score={score} isPt={isPt} onAgain={() => { setRound(0); setScore(0); setChoice(null); setFinished(false); setElapsed(0); }} />;
  const dayLabels = isPt ? { Mon: "Seg", Tue: "Ter", Wed: "Qua", Thu: "Qui" } : { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu" };
  return <div className="nova-game-play">
    <div className="nova-game-play-head"><span>{isPt ? `Ronda ${round + 1} de ${TOTAL_ROUNDS}` : `Round ${round + 1} of ${TOTAL_ROUNDS}`}</span><strong>{Math.max(0, 90 - elapsed)}s · {score} pts</strong></div>
    <h2>{isPt ? "Que padrão encontras?" : "What pattern do you see?"}</h2>
    <div className="pattern-table" role="table"><div className="pattern-row pattern-head">{(isPt ? ["DIA", "SONO", "CARGA", "ENERGIA"] : ["DAY", "SLEEP", "LOAD", "ENERGY"]).map((cell) => <span key={cell}>{cell}</span>)}</div>{dataset.rows.map((row) => <div className="pattern-row" role="row" key={row[0]}>{row.map((cell, index) => <span key={cell}>{index === 0 ? dayLabels[cell as keyof typeof dayLabels] : cell}</span>)}</div>)}</div>
    <div className="pattern-answers">{answers.map((text, index) => <button key={text} type="button" className={choice === index ? (index === correct ? "game-answer correct" : "game-answer wrong") : "game-answer"} onClick={() => answer(index)}>{text}</button>)}</div>
    {choice !== null && <p className="game-feedback">{choice === correct ? (isPt ? "Padrão encontrado." : "Pattern found.") : (isPt ? "Observa novamente os dados." : "Take another look at the data.")}</p>}
  </div>;
}

function Result({ title, text, score, isPt, onAgain }: { title: string; text: string; score: number; isPt: boolean; onAgain: () => void }) {
  return <div className="nova-game-result"><div className="result-mark">✓</div><h2>{title}</h2><p>{text}</p><strong className="result-score">{score}</strong><span>{isPt ? "pontuação" : "score"}</span><button type="button" className="game-primary" onClick={onAgain}>{isPt ? "Jogar novamente" : "Play again"}</button></div>;
}
