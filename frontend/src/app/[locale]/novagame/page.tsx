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
      </main>
    </div>
  );
}