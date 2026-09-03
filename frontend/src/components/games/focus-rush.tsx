"use client";

import * as React from "react";
import type { GameProps } from "./game-types";

const SHAPES = ["●", "▲", "◆", "■"];

export function FocusRush({ isPt, onComplete }: GameProps) {
  const [round, setRound] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [combo, setCombo] = React.useState(0);
  const [bestCombo, setBestCombo] = React.useState(0);
  const [target, setTarget] = React.useState(0);
  const [items, setItems] = React.useState<number[]>(() => makeItems(0));
  const [done, setDone] = React.useState(false);
  const choose = (index: number) => {
    const hit = items[index] === target;
    const nextCombo = hit ? combo + 1 : 0;
    const nextScore = Math.max(0, score + (hit ? 10 : -5));
    setScore(nextScore); setCombo(nextCombo); setBestCombo((value) => Math.max(value, nextCombo));
    if (round === 3) { setDone(true); onComplete(nextScore); return; }
    setRound((value) => value + 1); setTarget((value) => (value + 1) % SHAPES.length); setItems(makeItems(round));
  };
  if (done) return <div className="nova-game-result"><div className="result-mark">✓</div><h2>{isPt ? "Ronda completa" : "Round complete"}</h2><p>{isPt ? "Joga para superar a tua própria pontuação." : "Play again to beat your own score."}</p><div className="result-grid"><span><strong>{score}</strong>{isPt ? "pontos" : "score"}</span><span><strong>{bestCombo}</strong>{isPt ? "melhor combo" : "best combo"}</span></div><button type="button" className="game-primary" onClick={() => { setRound(1); setScore(0); setCombo(0); setBestCombo(0); setDone(false); setTarget(0); setItems(makeItems(0)); }}>{isPt ? "Jogar novamente" : "Play again"}</button></div>;
  return <div className="nova-game-play"><div className="nova-game-play-head"><span>{isPt ? `Ronda ${round} de 3` : `Round ${round} of 3`}</span><strong>{score} pts · {combo} combo</strong></div><h2>{isPt ? `Toca apenas em ${SHAPES[target]}` : `Tap only ${SHAPES[target]}`}</h2><p className="game-muted">{isPt ? "Segue a regra. Errar não tira mais do que os pontos desta jogada." : "Follow the rule. A miss only costs this turn's points."}</p><div className="focus-grid">{items.map((shape, index) => <button type="button" key={`${shape}-${index}`} aria-label={`${isPt ? "Forma" : "Shape"} ${SHAPES[shape]}`} onClick={() => choose(index)}>{SHAPES[shape]}</button>)}</div></div>;
}

function makeItems(round: number) { return Array.from({ length: 12 + round * 4 }, (_, index) => index % (round + 2) === 0 ? 0 : (index + round) % 4); }
