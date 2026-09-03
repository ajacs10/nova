"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { useAuth } from "@/shared/lib/AuthContext";
import { getDashboard } from "@/shared/lib/api";

export default function NovaGamePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const isPt = locale === "pt";
  const { isLoggedIn, isReady, logoutUser } = useAuth();
  const [progress, setProgress] = React.useState({ totalCheckins: 0, streak: 0 });
  const [activeGame, setActiveGame] = React.useState<"sequence" | "focus" | "breathing" | null>(null);
  const [sequenceStep, setSequenceStep] = React.useState(0);
  const [focusFound, setFocusFound] = React.useState(false);
  const [breathingStep, setBreathingStep] = React.useState(0);

  React.useEffect(() => {
    if (!isReady || !isLoggedIn) return;
    getDashboard().then(({ totalCheckins, streak }) => setProgress({ totalCheckins, streak })).catch(() => undefined);
  }, [isReady, isLoggedIn]);

  if (!isReady || !isLoggedIn) return null;

  const level = Math.max(1, Math.floor(progress.totalCheckins / 3) + 1);
  const badges = [
    progress.totalCheckins >= 1 ? (isPt ? "Primeiro passo" : "First step") : null,
    progress.totalCheckins >= 3 ? (isPt ? "A observar" : "Observing" ) : null,
    progress.streak >= 3 ? (isPt ? "Ritmo presente" : "Present rhythm") : null,
  ].filter((badge): badge is string => Boolean(badge));

  const sequence = [1, 3, 0, 2];
  const breathingLabels = isPt ? ["Inspira", "Segura", "Expira"] : ["Breathe in", "Hold", "Breathe out"];
  const selectGame = (game: "sequence" | "focus" | "breathing") => {
    setActiveGame(game);
    setSequenceStep(0);
    setFocusFound(false);
    setBreathingStep(0);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060810", color: "#fff" }}>
      <Navbar />
      <DashboardSidebar locale={locale} activePath={`/${locale}/novagame`} onLogout={async () => { await logoutUser(); router.push(`/${locale}/auth/login`); }} />
      <main className="checkin-private-content" style={{ minHeight: "100vh", padding: "140px 32px 80px", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: "#00d2b5", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem" }}>NOVA Game</p>
        <h1 style={{ margin: "12px 0", fontSize: "2.4rem" }}>{isPt ? "O teu progresso, sem pressão" : "Your progress, without pressure"}</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 580 }}>{isPt ? "Cada check-in ajuda-te a observar a tua rotina. Não há pontos perdidos nem competição." : "Each check-in helps you observe your routine. There are no lost points and no competition."}</p>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 36 }}>
          <div style={{ padding: 22, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}><strong style={{ display: "block", fontSize: "2rem" }}>{level}</strong><span style={{ color: "rgba(255,255,255,0.65)" }}>{isPt ? "Nível atual" : "Current level"}</span></div>
          <div style={{ padding: 22, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}><strong style={{ display: "block", fontSize: "2rem" }}>{progress.totalCheckins}</strong><span style={{ color: "rgba(255,255,255,0.65)" }}>{isPt ? "Check-ins" : "Check-ins"}</span></div>
          <div style={{ padding: 22, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}><strong style={{ display: "block", fontSize: "2rem" }}>{progress.streak}</strong><span style={{ color: "rgba(255,255,255,0.65)" }}>{isPt ? "Dias seguidos" : "Days in a row"}</span></div>
        </section>
        <section style={{ marginTop: 28 }}><h2 style={{ fontSize: "1.2rem" }}>{isPt ? "Distintivos" : "Badges"}</h2><p style={{ color: "rgba(255,255,255,0.65)" }}>{badges.length ? badges.join(" · ") : (isPt ? "O teu primeiro distintivo aparece depois do primeiro check-in." : "Your first badge appears after your first check-in.")}</p></section>
        <section style={{ marginTop: 44 }}>
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
            {activeGame === "focus" && (
              <div>
                <h2 style={{ marginTop: 0 }}>{isPt ? "Encontra o ponto" : "Find the point"}</h2>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>{focusFound ? (isPt ? "Encontraste. Boa atenção." : "You found it. Nice attention.") : (isPt ? "Toca no símbolo que é diferente." : "Tap the symbol that is different.")}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 54px)", gap: 10 }}>
                  {Array.from({ length: 12 }, (_, index) => <button key={index} type="button" onClick={() => index === 7 && setFocusFound(true)} aria-label={isPt ? `Símbolo ${index + 1}` : `Symbol ${index + 1}`} style={{ width: 54, height: 54, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#00d2b5", fontSize: "1.5rem", cursor: "pointer" }}>{index === 7 ? "◉" : "○"}</button>)}
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