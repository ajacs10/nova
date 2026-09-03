"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { useAuth } from "@/shared/lib/AuthContext";
import { ArrowLeft, Play, Trophy } from "lucide-react";
import { PatternDetective } from "@/components/games/pattern-detective";
import { FocusRush } from "@/components/games/focus-rush";
import { MemoryNova } from "@/components/games/memory-nova";
import { NovaTheDay } from "@/components/games/nova-the-day";
import type { GameId } from "@/components/games/game-types";

type ArcadeStats = { played: number; completed: number; points: number; best: number; level: number };

function loadArcadeStats(): ArcadeStats {
  if (typeof window === "undefined") return { played: 0, completed: 0, points: 0, best: 0, level: 1 };
  try {
    return { played: 0, completed: 0, points: 0, best: 0, level: 1, ...JSON.parse(window.localStorage.getItem("nova-games-progress") || "{}") };
  } catch {
    return { played: 0, completed: 0, points: 0, best: 0, level: 1 };
  }
}

export default function NovaGamePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const isPt = locale === "pt";
  const { isLoggedIn, isReady, logoutUser } = useAuth();
  const [, setArcadeStats] = React.useState(() => loadArcadeStats());
  const [activeGame, setActiveGame] = React.useState<GameId | "sequence" | "focus" | "breathing" | null>(null);
  const [sequenceStep, setSequenceStep] = React.useState(0);
  const [breathingStep, setBreathingStep] = React.useState(0);
  if (!isReady || !isLoggedIn) return null;

  const sequence = [1, 3, 0, 2];
  const breathingLabels = isPt ? ["Inspira", "Segura", "Expira"] : ["Breathe in", "Hold", "Breathe out"];
  const selectGame = (game: "sequence" | "focus" | "breathing") => { setActiveGame(game); setSequenceStep(0); setBreathingStep(0); };

  const arcadeGames = [
    { id: "pattern" as const, icon: "🧠", title: isPt ? "Detetive de Padrões" : "Pattern Detective", text: isPt ? "Encontra a pista. Descobre o padrão." : "Find the clue. Discover the pattern.", meta: isPt ? "5 rondas" : "5 rounds", accent: "#a78bfa" },
    { id: "focus" as const, icon: "⚡", title: "Focus Rush", text: isPt ? "Segue a regra. Supera a pontuação." : "Follow the rule. Beat your score.", meta: isPt ? "3 rondas" : "3 rounds", accent: "#f59e0b" },
    { id: "memory" as const, icon: "🧩", title: "Memory NOVA", text: isPt ? "Encontra todos os pares." : "Find every pair.", meta: isPt ? "8 pares" : "8 pairs", accent: "#38bdf8" },
    { id: "day" as const, icon: "🌎", title: isPt ? "NOVA: O Dia" : "NOVA: The Day", text: isPt ? "As tuas escolhas. Uma história fictícia." : "Your choices. A fictional story.", meta: isPt ? "7 cenas" : "7 scenes", accent: "#fb7185" },
  ];
  const completeGame = (score: number) => setArcadeStats((value) => { const next = { ...value, completed: value.completed + 1, points: value.points + score, best: Math.max(value.best, score), level: value.level + 1 }; localStorage.setItem("nova-games-progress", JSON.stringify(next)); return next; });
  const launchArcadeGame = (game: GameId) => { setActiveGame(game); setArcadeStats((value) => { const next = { ...value, played: value.played + 1 }; localStorage.setItem("nova-games-progress", JSON.stringify(next)); return next; }); };
  const renderArcadeGame = () => {
    if (activeGame === "pattern") return <PatternDetective isPt={isPt} onComplete={completeGame} />;
    if (activeGame === "focus") return <FocusRush isPt={isPt} onComplete={completeGame} />;
    if (activeGame === "memory") return <MemoryNova isPt={isPt} onComplete={completeGame} />;
    return <NovaTheDay isPt={isPt} onComplete={completeGame} />;
  };

  if (activeGame === "pattern" || activeGame === "focus" || activeGame === "memory" || activeGame === "day") {
    const game = arcadeGames.find((item) => item.id === activeGame);
    return <div className="nova-arcade-page"><Navbar /><DashboardSidebar locale={locale} activePath={`/${locale}/novagame`} onLogout={async () => { await logoutUser(); router.push(`/${locale}/auth/login`); }} /><main className="nova-arcade-main"><section className="game-view"><button type="button" className="back-games" onClick={() => setActiveGame(null)}><ArrowLeft size={17} /> {isPt ? "Voltar aos jogos" : "Back to games"}</button><div className="game-view-title"><span style={{ background: game?.accent }}>{game?.icon}</span><div><span className="nova-eyebrow">NOVA GAMES</span><h1>{game?.title}</h1></div></div>{renderArcadeGame()}</section></main></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060810", color: "#fff" }}>
      <Navbar />
      <DashboardSidebar locale={locale} activePath={`/${locale}/novagame`} onLogout={async () => { await logoutUser(); router.push(`/${locale}/auth/login`); }} />
      <main className="checkin-private-content nova-arcade-main" style={{ minHeight: "100vh", padding: "140px 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <section className="arcade-section"><div className="arcade-section-title"><div><span className="nova-eyebrow">ARCADE</span><h2>{isPt ? "Escolhe a tua experiência" : "Choose your experience"}</h2></div><span className="arcade-level"><Trophy size={16} /> {isPt ? "Sem competição" : "No competition"}</span></div><div className="game-grid">{arcadeGames.map((game) => <button type="button" className="game-card" key={game.id} onClick={() => launchArcadeGame(game.id)} style={{ "--game-accent": game.accent } as React.CSSProperties}><div className="game-card-art"><span>{game.icon}</span><i /></div><div className="game-card-copy"><span className="game-card-meta">{game.meta}</span><h3>{game.title}</h3><p>{game.text}</p><span className="game-play"><Play size={14} fill="currentColor" /> {isPt ? "Jogar" : "Play"}</span></div></button>)}</div></section>
        <section style={{ marginTop: 44, display: "none" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>{isPt ? "Escolhe um jogo" : "Choose a game"}</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: 20 }}>{isPt ? "Pequenas pausas para atenção e presença. Joga ao teu ritmo." : "Small pauses for attention and presence. Play at your own pace."}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
            {[
              { id: "sequence" as const, title: isPt ? "Sequência NOVA" : "NOVA Sequence", text: isPt ? "Repete a sequência de luzes." : "Repeat the light sequence.", symbol: "◈" },
              { id: "focus" as const, title: isPt ? "Encontra o ponto" : "Find the point", text: isPt ? "Encontra o símbolo diferente." : "Find the different symbol.", symbol: "⊙" },
              { id: "breathing" as const, title: isPt ? "Pausa de respiração" : "Breathing pause", text: isPt ? "Segue três ciclos tranquilos." : "Follow three calm cycles.", symbol: "○" },
            ].map((game) => (
              <button key={game.id} type="button" onClick={() => selectGame(game.id)} style={{ textAlign: "left", padding: 20, border: activeGame === game.id ? "1px solid #00d2b5" : "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: activeGame === game.id ? "rgba(0,210,181,0.1)" : "rgba(255,255,255,0.03)", color: "#fff", cursor: "pointer" }}>
                <span aria-hidden="true" style={{ display: "block", color: "#00d2b5", fontSize: "1.8rem", marginBottom: 12 }}>{game.symbol}</span>
                <strong style={{ display: "block", marginBottom: 7 }}>{game.title}</strong>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>{game.text}</span>
              </button>
            ))}
          </div>
        </section>
        {activeGame && (
          <section aria-live="polite" style={{ marginTop: 22, padding: 24, border: "1px solid rgba(0,210,181,0.35)", borderRadius: 8, background: "rgba(0,210,181,0.05)" }}>
            {activeGame === "sequence" && (
              <div>
                <h2 style={{ marginTop: 0 }}>{isPt ? "Repete a sequência" : "Repeat the sequence"}</h2>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>{sequenceStep === sequence.length ? (isPt ? "Muito bem. Terminaste esta pausa." : "Well done. You completed this pause.") : (isPt ? `Escolhe a luz ${sequenceStep + 1} de ${sequence.length}.` : `Choose light ${sequenceStep + 1} of ${sequence.length}.`)}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[0, 1, 2, 3].map((button) => <button key={button} type="button" aria-label={`${isPt ? "Luz" : "Light"} ${button + 1}`} onClick={() => setSequenceStep((step) => step < sequence.length && button === sequence[step] ? step + 1 : 0)} style={{ width: 54, height: 54, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: ["#00d2b5", "#f59e0b", "#60a5fa", "#f472b6"][button], cursor: "pointer" }} />)}
                </div>
              </div>
            )}
            {activeGame === "breathing" && (
              <div>
                <h2 style={{ marginTop: 0 }}>{isPt ? "Pausa de respiração" : "Breathing pause"}</h2>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>{isPt ? "Segue o teu ritmo, sem forçar." : "Follow your own pace, without forcing it."}</p>
                <button type="button" onClick={() => setBreathingStep((step) => (step + 1) % breathingLabels.length)} style={{ width: 150, height: 150, borderRadius: "50%", border: "2px solid #00d2b5", background: "rgba(0,210,181,0.12)", color: "#fff", fontSize: "1.1rem", cursor: "pointer" }}>{breathingLabels[breathingStep]}</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}