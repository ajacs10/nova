"use client";

import * as React from "react";
import type { GameProps } from "./game-types";

const SYMBOLS = ["★", "☾", "◉", "∿", "ϟ", "✦", "◌", "◒"];
type Card = { id: number; symbol: string; open: boolean; matched: boolean };

export function MemoryNova({ isPt, onComplete }: GameProps) {
  const [cards, setCards] = React.useState<Card[]>(() => createCards());
  const [selected, setSelected] = React.useState<number[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (done) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [done]);
  const clickCard = (id: number) => {
    if (selected.length === 2 || cards[id].open || cards[id].matched) return;
    const next = [...selected, id]; setCards((items) => items.map((card) => card.id === id ? { ...card, open: true } : card)); setSelected(next);
    if (next.length !== 2) return;
    setMoves((value) => value + 1);
    const match = cards[next[0]].symbol === cards[next[1]].symbol;
    window.setTimeout(() => {
      setCards((items) => items.map((card) => next.includes(card.id) ? { ...card, open: match, matched: match } : card));
      setSelected([]);
      if (match) setScore((value) => value + 100);
      if (match && cards.filter((card) => card.matched).length === 14) { setDone(true); onComplete(score + 100); }
    }, match ? 250 : 700);
  };
  if (done) return <div className="nova-game-result"><div className="result-mark">✓</div><h2>{isPt ? "Encontraste todos" : "You found them all"}</h2><p>{isPt ? "Uma pausa concluída, ao teu ritmo." : "A pause completed at your own pace."}</p><div className="result-grid"><span><strong>{moves}</strong>{isPt ? "jogadas" : "moves"}</span><span><strong>{score}</strong>{isPt ? "pontos" : "score"}</span></div><button type="button" className="game-primary" onClick={() => { setCards(createCards()); setSelected([]); setMoves(0); setScore(0); setDone(false); }}>{isPt ? "Jogar novamente" : "Play again"}</button></div>;
  return <div className="nova-game-play"><div className="nova-game-play-head"><span>{isPt ? "8 pares" : "8 pairs"}</span><strong>{Math.max(0, 60 - elapsed)}s · {moves} {isPt ? "jogadas" : "moves"}</strong></div><h2>{isPt ? "Encontra todos os pares" : "Find every pair"}</h2><div className="memory-grid">{cards.map((card) => <button type="button" key={card.id} aria-label={card.open || card.matched ? card.symbol : (isPt ? "Carta fechada" : "Face down card")} className={card.open || card.matched ? "memory-card is-open" : "memory-card"} onClick={() => clickCard(card.id)}>{card.open || card.matched ? card.symbol : "?"}</button>)}</div></div>;
}

function createCards(): Card[] { return [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5).map((symbol, id) => ({ id, symbol, open: false, matched: false })); }
