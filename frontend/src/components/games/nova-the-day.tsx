"use client";

import * as React from "react";
import type { GameProps } from "./game-types";

type Choice = [string, string, number, number, number];
type Scene = { time: string; title: [string, string]; choices: Choice[] };

const SCENES: Scene[] = [
  { time: "07:00", title: ["Um novo dia começa.", "A new day begins."], choices: [["Começar já", "Start immediately", 0, 1, 0], ["Planear a manhã", "Plan your morning", 1, 0, 1], ["Fazer uma pequena pausa", "Take a short pause", 0, 1, 1]] },
  { time: "10:00", title: ["A agenda fica mais preenchida.", "Your schedule gets busier."], choices: [["Escolher uma tarefa", "Choose one task", 1, 1, 0], ["Aceitar tudo", "Take everything on", -1, 1, -1], ["Pedir clareza", "Ask for clarity", 1, 0, 1]] },
  { time: "12:30", title: ["Chega um acontecimento inesperado.", "Something unexpected happens."], choices: [["Adaptar o plano", "Adapt the plan", 0, 1, 1], ["Parar por um momento", "Pause for a moment", 1, 0, 1], ["Ignorar o sinal", "Ignore the signal", -1, 1, -1]] },
  { time: "14:00", title: ["É hora de fazer uma pausa.", "It is time for a break."], choices: [["Sair um pouco", "Step outside", 1, 1, 1], ["Continuar sem parar", "Keep going", -1, 1, -1], ["Conversar com alguém", "Talk with someone", 0, 1, 1]] },
  { time: "16:30", title: ["A tarde pede uma nova escolha.", "The afternoon asks for a new choice."], choices: [["Focar no essencial", "Focus on the essential", 1, 1, 0], ["Mudar de tarefa", "Switch tasks", 0, 1, 1], ["Deixar para depois", "Leave it for later", 1, -1, 0]] },
  { time: "19:00", title: ["O tempo livre aparece.", "Free time appears."], choices: [["Fazer algo criativo", "Do something creative", 1, 1, 1], ["Organizar amanhã", "Prepare tomorrow", 1, 0, 1], ["Desligar por completo", "Fully disconnect", 0, 1, 1]] },
  { time: "22:30", title: ["O dia chega ao fim.", "The day comes to an end."], choices: [["Fazer uma reflexão", "Reflect on the day", 0, 1, 1], ["Ler um pouco", "Read for a while", 1, 0, 1], ["Ir diretamente dormir", "Go straight to sleep", 1, 1, 0]] },
];

export function NovaTheDay({ isPt, onComplete }: GameProps) {
  const [scene, setScene] = React.useState(0);
  const [stats, setStats] = React.useState({ energy: 70, focus: 70, mood: 70 });
  const [history, setHistory] = React.useState<string[]>([]);
  const [finished, setFinished] = React.useState(false);
  const current = SCENES[scene];
  const choose = (choice: typeof current.choices[number]) => {
    const nextStats = { energy: clamp(stats.energy + choice[2]), focus: clamp(stats.focus + choice[3]), mood: clamp(stats.mood + choice[4]) };
    setStats(nextStats); setHistory((items) => [...items, isPt ? choice[0] : choice[1]]);
    if (scene === SCENES.length - 1) { setFinished(true); onComplete(nextStats.energy + nextStats.focus + nextStats.mood); }
    else setScene((value) => value + 1);
  };
  if (finished) return <div className="nova-game-result"><div className="result-mark">✓</div><h2>{isPt ? "O teu dia" : "Your day"}</h2><p>{isPt ? "Diferentes escolhas moldaram este dia fictício." : "Different choices shaped this fictional day."}</p><div className="result-grid"><span><strong>{stats.energy}</strong>{isPt ? "Energia" : "Energy"}</span><span><strong>{stats.focus}</strong>{isPt ? "Foco" : "Focus"}</span><span><strong>{stats.mood}</strong>{isPt ? "Humor" : "Mood"}</span></div><button type="button" className="game-primary" onClick={() => { setScene(0); setStats({ energy: 70, focus: 70, mood: 70 }); setHistory([]); setFinished(false); }}>{isPt ? "Jogar novamente" : "Play again"}</button></div>;
  return <div className="nova-game-play nova-story"><div className="nova-game-play-head"><span>{current.time}</span><strong>{scene + 1} / 7</strong></div><div className="story-sky"><span className="story-orbit" aria-hidden="true">◒</span><h2>{current.title[isPt ? 0 : 1]}</h2></div><div className="story-choices">{current.choices.map((choice) => <button type="button" key={choice[0]} className="game-answer" onClick={() => choose(choice)}>{choice[isPt ? 0 : 1]}</button>)}</div><div className="story-stats"><span>{isPt ? "Energia" : "Energy"} <b>{stats.energy}</b></span><span>{isPt ? "Foco" : "Focus"} <b>{stats.focus}</b></span><span>{isPt ? "Humor" : "Mood"} <b>{stats.mood}</b></span></div>{history.length > 0 && <small>{isPt ? "As escolhas moldam este dia fictício." : "Your choices shape this fictional day."}</small>}</div>;
}

function clamp(value: number) { return Math.max(0, Math.min(100, value)); }
