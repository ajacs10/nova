"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { useAuth } from "@/shared/lib/AuthContext";
import { MetricCard } from "@/components/templates/metric-card";
import { getDashboard, getUserFriendlyError } from "@/shared/lib/api";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";

type ChartTab = "sleep" | "workload" | "metrics";

export default function DashboardPage() {
  const [activeChartTab, setActiveChartTab] = React.useState<ChartTab>("sleep");
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null);
  const [activeBalanceMetric, setActiveBalanceMetric] = React.useState<"sleep" | "workload">("sleep");
  const [dashboard, setDashboard] = React.useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [dashboardError, setDashboardError] = React.useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const { isLoggedIn, isReady, logoutUser } = useAuth();
  const weekDayLabels = locale === "pt"
    ? ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]
    : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSidebarLogout = async () => {
    await logoutUser();
    router.push(`/${locale}/auth/login`);
  };

  React.useEffect(() => {
    if (!isReady || !isLoggedIn) return;
    getDashboard()
      .then(setDashboard)
      .catch((error: unknown) => setDashboardError(getUserFriendlyError(error, locale === "pt")));
  }, [isReady, isLoggedIn, locale]);

  React.useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace(`/${locale}/auth/register`);
    }
  }, [isReady, isLoggedIn, locale, router]);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBalanceMetric((metric) => metric === "sleep" ? "workload" : "sleep");
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  if (!isReady || !isLoggedIn) return null;

  if (dashboardError) {
    return (
      <main style={{ padding: 140, color: "#fff", textAlign: "center" }}>
        <p>{dashboardError}</p>
        <button type="button" onClick={() => window.location.reload()}>Tentar novamente</button>
      </main>
    );
  }

  if (!dashboard) {
    return <main style={{ padding: 140, color: "rgba(255,255,255,0.65)", textAlign: "center" }}>A carregar o teu painel...</main>;
  }

  const weeklyData = dashboard?.weekEntries ?? [];
  const weeklyDataByDay = weekDayLabels.map((_, index) => {
    const weekday = (index + 1) % 7;
    return weeklyData.find((item) => new Date(item.createdAt).getDay() === weekday);
  });

  const getY = (hours: number) => 220 - (hours / 12) * 200;
  const getX = (index: number) => 50 + index * 80;

  const points = weeklyData.map((d, i) => `${getX(i)},${getY(d.sleep)}`);
  const pathD = points.length ? `M ${points.join(" L ")}` : "";
  const areaD = weeklyData.length ? `M ${getX(0)},220 L ${points.join(" L ")} L ${getX(weeklyData.length - 1)},220 Z` : "";

  const avgSleepHours = weeklyData.length
    ? (weeklyData.reduce((sum, item) => sum + item.sleep, 0) / weeklyData.length).toFixed(1)
    : "0";

  const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  const averageWorkload = weeklyData.length
    ? weeklyData.reduce((sum, item) => sum + item.workload, 0) / weeklyData.length
    : 0;
  const averageEnergy = weeklyData.length
    ? weeklyData.reduce((sum, item) => sum + item.energy, 0) / weeklyData.length
    : 0;
  const sleepScore = clampPercent((Number(avgSleepHours) / 8) * 100);
  const workloadScore = clampPercent(100 - averageWorkload * 10);
  const balanceScore = clampPercent((sleepScore + workloadScore) / 2);
  const funnelItems = [
    { label: locale === "pt" ? "Check-in Diário" : "Daily Check-in", pct: clampPercent((weeklyData.length / 7) * 100) },
    { label: locale === "pt" ? "Qualidade de Sono" : "Sleep Quality", pct: sleepScore },
    { label: locale === "pt" ? "Registo de Energia" : "Energy Log", pct: clampPercent((averageEnergy / 10) * 100) },
    { label: locale === "pt" ? "Reflexão & Notas" : "Reflection & Notes", pct: weeklyData.length ? clampPercent((weeklyData.filter((item) => item.note?.trim()).length / weeklyData.length) * 100) : 0 },
  ];
  const balanceMetric = activeBalanceMetric === "sleep" ? sleepScore : workloadScore;
  const balanceColor = activeBalanceMetric === "sleep" ? "#00d2b5" : "#3b82f6";
  const balanceLabel = activeBalanceMetric === "sleep"
    ? (locale === "pt" ? "Sono" : "Sleep")
    : (locale === "pt" ? "Trabalho" : "Workload");
  const weeklyCompletion = clampPercent((weeklyData.length / 7) * 100);

  return (
    <div style={{ background: "#060810", color: "#ffffff", width: "100%", minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* NAVBAR FIXA */}
      <Navbar />

      {/* SIDEBAR FIXA */}
      <DashboardSidebar
        locale={locale}
        activePath={`/${locale}/dashboard`}
        onLogout={handleSidebarLogout}
      />

      {/* ÁREA PRINCIPAL DA PÁGINA (Ajustada à direita da Sidebar) */}
      <main className="dashboard-content" style={{ paddingTop: "100px", paddingBottom: "60px", boxSizing: "border-box" }}>
        <div className="dashboard-wrapper" style={{ width: "100%", maxWidth: 1440, margin: "0 auto", padding: "0 32px", boxSizing: "border-box" }}>

          {/* CABEÇALHO DO PAINEL */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24, width: "100%" }}>
            <Link
              href={`/${locale}/check-in`}
              style={{
                background: "#00d2b5",
                color: "#060810",
                padding: "10px 22px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none"
              }}
            >
              Fazer Check-in Agora
            </Link>
          </div>

          {/* GRELHA PRINCIPAL DO DASHBOARD */}
          <div className="dashboard-grid">

            {/* COLUNA ESQUERDA */}
            <div className="dashboard-left-column" style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "flex-end", minWidth: 0 }}>

              {/* MÉTRICAS / CARDS SUPERIORES */}
              <div className="dashboard-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, gridAutoRows: 128, width: "100%" }}>
                <div style={{ height: "100%", background: "#0a0e1a", padding: "18px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
                  <div>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{dashboard.streak} Dias</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Check-ins</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid #00d2b5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: "#00d2b5" }}>
                    {weeklyCompletion}%
                  </div>
                </div>

                <div style={{ height: "100%", background: "#0a0e1a", padding: "18px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
                  <div>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{dashboard.totalCheckins}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Total Registos</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                    {weeklyCompletion}%
                  </div>
                </div>

                <div style={{ height: "100%", background: "#0a0e1a", padding: "18px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
                  <div>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#00d2b5" }}>{dashboard.avgMood}/5</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Humor Médio</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid #00d2b5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: "#00d2b5" }}>
                    {clampPercent((averageEnergy / 10) * 100)}%
                  </div>
                </div>

                <MetricCard
                  label="Média de Sono"
                  value={Number(avgSleepHours)}
                  unit="h"
                  description="Descanso reparador"
                />
              </div>

              {/* CARD DO GRÁFICO */}
              <div
                style={{
                  background: "#0a0e1a",
                  borderRadius: 0,
                  padding: "28px",
                  height: "480px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: "translateY(20px)",
                }}
              >
                {/* TAB SELECTOR INTERNO DO CARD */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      background: "rgba(255, 255, 255, 0.04)",
                      padding: "4px",
                      borderRadius: "10px",
                    }}
                  >
                    {[
                      { id: "sleep", label: "Horas de Sono" },
                      { id: "workload", label: "Carga & Descanso" },
                      { id: "metrics", label: "Equilíbrio & Funil" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveChartTab(tab.id as ChartTab)}
                        style={{
                          background: activeChartTab === tab.id ? "#00d2b5" : "transparent",
                          color: activeChartTab === tab.id ? "#060810" : "rgba(255, 255, 255, 0.7)",
                          border: "none",
                          padding: "8px 18px",
                          borderRadius: "8px",
                          fontWeight: activeChartTab === tab.id ? 700 : 500,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTEÚDO DOS GRÁFICOS */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

                  {/* ABA: SONO */}
                  {activeChartTab === "sleep" && (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ height: 390, width: "100%", position: "relative" }}>
                        <svg width="100%" height="100%" viewBox="0 0 580 260" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="sleepRealGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00d2b5" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#00d2b5" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          <line x1="40" y1="0" x2="40" y2="220" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
                          <line x1="40" y1="220" x2="570" y2="220" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
                          <text x="305" y="257" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="700" textAnchor="middle">Dias</text>
                          <text x="12" y="110" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="700" textAnchor="middle" transform="rotate(-90 12 110)">Horas</text>

                          {[12, 10, 8, 6, 4, 2, 0].map((h) => {
                            const yPos = getY(h);
                            return (
                              <g key={h}>
                                <text x="30" y={yPos + 4} fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="700" textAnchor="end">
                                  {h}h
                                </text>
                                <line x1="40" y1={yPos} x2="570" y2={yPos} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                              </g>
                            );
                          })}

                          {areaD && <path d={areaD} fill="url(#sleepRealGrad)" />}
                          {pathD && <path d={pathD} fill="none" stroke="#00d2b5" strokeWidth="3" />}

                          {weeklyData.map((d, i) => {
                            const cx = getX(i);
                            const cy = getY(d.sleep);
                            const isHovered = hoveredPoint === i;

                            return (
                              <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: "pointer" }}>
                                {isHovered && <circle cx={cx} cy={cy} r="8" fill="rgba(0,210,181,0.3)" />}
                                <circle cx={cx} cy={cy} r="4" fill="#00d2b5" />
                                <text x={cx} y={cy - 10} fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                                  {d.sleep}h
                                </text>
                              </g>
                            );
                          })}

                          {weekDayLabels.map((day, i) => (
                            <text key={day} x={getX(i)} y="238" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600" textAnchor="middle">
                              {day}
                            </text>
                          ))}
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* ABA: CARGA */}
                  {activeChartTab === "workload" && (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, background: "#3b82f6", borderRadius: 2 }} /> {locale === "pt" ? "Carga" : "Workload"}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, background: "#00d2b5", borderRadius: 2 }} /> {locale === "pt" ? "Descanso" : "Rest"}</span>
                      </div>
                      <div style={{ flex: 1, minHeight: 0, display: "flex", position: "relative", paddingLeft: 34 }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "0.68rem", color: "rgba(255,255,255,0.45)" }}>
                          {[10, 8, 6, 4, 2, 0].map((value) => <span key={value}>{value}</span>)}
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-around", borderLeft: "1px solid rgba(255,255,255,0.22)", borderBottom: "1px solid rgba(255,255,255,0.22)", background: "repeating-linear-gradient(to bottom, transparent 0, transparent calc(20% - 1px), rgba(255,255,255,0.06) calc(20% - 1px), rgba(255,255,255,0.06) 20%)" }}>
                            {weeklyDataByDay.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 5, height: "100%", flex: 1 }}>
                                <div title={item ? `${locale === "pt" ? "Carga" : "Workload"}: ${item.workload}/10` : undefined} style={{ width: "min(18px, 35%)", height: item ? `${item.workload * 10}%` : 0, minHeight: item?.workload ? 3 : 0, background: "#3b82f6", borderRadius: "3px 3px 0 0" }} />
                                <div title={item ? `${locale === "pt" ? "Rest" : "Rest"}: ${item.sleep}/12h` : undefined} style={{ width: "min(18px, 35%)", height: item ? `${(item.sleep / 12) * 100}%` : 0, minHeight: item?.sleep ? 3 : 0, background: "#00d2b5", borderRadius: "3px 3px 0 0" }} />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 8 }}>
                            {weekDayLabels.map((day) => <span key={day} style={{ flex: 1, textAlign: "center", fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{day}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ABA: MÉTRICAS */}
                  {activeChartTab === "metrics" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 30, alignItems: "center", height: "100%" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>Índice de Estabilidade</div>
                        <div style={{ position: "relative", width: 180, height: 100, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                          <svg width="180" height="100" viewBox="0 0 220 120">
                            <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="18" />
                            <path d="M 20 110 A 90 90 0 0 1 180 45" fill="none" stroke="#00d2b5" strokeWidth="18" strokeDasharray="283" strokeDashoffset={283 - (283 * balanceScore) / 100} />
                          </svg>
                          <div style={{ position: "absolute", bottom: 0, textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>{balanceScore}%</div>
                            <div style={{ fontSize: "0.75rem", color: "#00d2b5", fontWeight: 700, marginTop: 2 }}>{balanceScore >= 80 ? (locale === "pt" ? "Excelente" : "Excellent") : balanceScore >= 60 ? (locale === "pt" ? "Equilibrado" : "Balanced") : (locale === "pt" ? "A melhorar" : "Needs attention")}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", marginBottom: 14 }}>Funil de Consistência</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {funnelItems.map((item, i) => (
                            <div key={i}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                                <span>{item.label}</span>
                                <span style={{ fontWeight: 700, color: "#00d2b5" }}>{item.pct}%</span>
                              </div>
                              <div style={{ height: 8, width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${item.pct}%`, background: "#00d2b5", borderRadius: 4, transition: "width 0.3s ease" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* COLUNA DIREITA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "flex-end" }}>
              <div style={{ background: "#0a0e1a", padding: "16px", borderRadius: 0, height: 480, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", transform: "translateY(20px)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 20px 0", alignSelf: "flex-start" }}>Equilíbrio Geral</h3>
                <div style={{ position: "relative", width: 300, height: 300, margin: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="300" height="300" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke={balanceColor} strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset={251 - (251 * balanceMetric) / 100} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke 0.5s ease, stroke-dashoffset 0.5s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", textAlign: "center" }}>
                    <span aria-live="polite" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{balanceMetric}%</span>
                    <div style={{ color: balanceColor, fontSize: "0.72rem", fontWeight: 700, marginTop: 4, transition: "color 0.5s ease" }}>{balanceLabel}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: "auto", paddingTop: 20, fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d2b5" }} /> {locale === "pt" ? "Sono" : "Sleep"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} /> {locale === "pt" ? "Trabalho" : "Workload"}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <style jsx>{`
        .dashboard-content {
          margin-left: 220px;
          width: calc(100% - 220px);
          box-sizing: border-box;
          padding-top: 117px !important;
          transition: margin-left 0.3s ease, width 0.3s ease;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        @media (min-width: 1025px) {
          .dashboard-left-column {
            display: contents !important;
          }

          .dashboard-metrics {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 900px) {
          .dashboard-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}