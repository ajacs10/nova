"use client";

import * as React from "react";
import type { GameProps } from "./game-types";

const SHAPES = ["circle", "triangle", "diamond", "square"] as const;
const shapeLabels = { circle: ["círculo", "circle"], triangle: ["triângulo", "triangle"], diamond: ["losango", "diamond"], square: ["quadrado", "square"] };

export function FocusRush({ isPt, onComplete }: GameProps) {
  const [round, setRound] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [combo, setCombo] = React.useState(0);
  const [bestCombo, setBestCombo] = React.useState(0);
  const [target, setTarget] = React.useState(() => randomTarget());
  const [items, setItems] = React.useState<number[]>(() => makeItems(0, randomTarget()));
  const [done, setDone] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const completedRef = React.useRef(false);

  React.useEffect(() => {
    if (done) return;
    const timer = window.setInterval(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [done]);

  React.useEffect(() => {
    if (timeLeft !== 0 || done || completedRef.current) return;
    completedRef.current = true;
    setDone(true);
    onComplete(score);
  }, [timeLeft, done, score, onComplete]);

  const choose = (index: number) => {
    if (done || timeLeft === 0) return;
    const hit = items[index] === target;
    const nextCombo = hit ? combo + 1 : 0;
    const nextScore = Math.max(0, score + (hit ? 10 : -5));
    setScore(nextScore); setCombo(nextCombo); setBestCombo((value) => Math.max(value, nextCombo));
    const nextTarget = randomTarget();
    setRound((value) => value + 1); setTarget(nextTarget); setItems(makeItems(round, nextTarget));
  };
  if (done) return <div className="nova-game-result"><div className="result-mark">✓</div><h2>{isPt ? "Ronda completa" : "Round complete"}</h2><p>{isPt ? "Joga para superar a tua própria pontuação." : "Play again to beat your own score."}</p><div className="result-grid"><span><strong>{score}</strong>{isPt ? "pontos" : "score"}</span><span><strong>{bestCombo}</strong>{isPt ? "melhor combo" : "best combo"}</span></div><button type="button" className="game-primary" onClick={() => { const nextTarget = randomTarget(); setRound(1); setScore(0); setCombo(0); setBestCombo(0); setDone(false); setTarget(nextTarget); setItems(makeItems(0, nextTarget)); setTimeLeft(30); completedRef.current = false; }}>{isPt ? "Jogar novamente" : "Play again"}</button></div>;
  const targetName = shapeLabels[SHAPES[target]][isPt ? 0 : 1];
  return <div className="nova-game-play"><div className="nova-game-play-head"><span>{isPt ? `Ronda ${round}` : `Round ${round}`}</span><strong>{isPt ? `Tempo ${timeLeft}s` : `Time ${timeLeft}s`} · {score} pts · {combo} combo</strong></div><h2>{isPt ? "Toca apenas em" : "Tap only"} <ShapeIcon shape={SHAPES[target]} label={targetName} /></h2><p className="game-muted">{isPt ? "Continua enquanto houver tempo. O jogo termina aos 30 segundos." : "Keep going while there is time. The game ends after 30 seconds."}</p><div className="focus-grid">{items.map((shape, index) => { const name = shapeLabels[SHAPES[shape]][isPt ? 0 : 1]; return <button type="button" key={`${shape}-${index}`} aria-label={`${isPt ? "Forma" : "Shape"}: ${name}`} onClick={() => choose(index)}><ShapeIcon shape={SHAPES[shape]} label={name} /></button>; })}</div></div>;
}

function ShapeIcon({ shape, label }: { shape: typeof SHAPES[number]; label: string }) { return <span className={`focus-shape focus-shape-${shape}`} role="img" aria-label={label} />; }

function randomTarget() { return Math.floor(Math.random() * SHAPES.length); }
function makeItems(round: number, target: number) {
  const items = Array.from({ length: 12 + round * 4 }, () => Math.floor(Math.random() * SHAPES.length));
  items[Math.floor(Math.random() * items.length)] = target;
  return items;
}
