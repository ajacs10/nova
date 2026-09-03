"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Moon, Sun, Sunset } from "lucide-react";
import { Navbar } from "@/shared/ui/Navbar";
import { useAuth } from "@/shared/lib/AuthContext";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { getInsights, getUserFriendlyError } from "@/shared/lib/api";

interface InsightCardData {
  id: string;
  title: string;
  type: string;
  description: string;
  action: string;
  confidence: number;
  period: string[];
}

const INSIGHT_VARIANTS_PT: Omit<InsightCardData, "id" | "period">[] = [
  { title: "Sono regular", type: "Recuperação", description: "Horários de sono consistentes ajudam o corpo a antecipar o descanso e a recuperação.", action: "Mantém uma hora de deitar semelhante durante esta semana.", confidence: 82 },
  { title: "Luz e energia", type: "Ritmo diário", description: "A exposição à luz natural no início do dia ajuda a reforçar o ritmo circadiano.", action: "Passa alguns minutos junto a uma janela ou no exterior pela manhã.", confidence: 76 },
  { title: "Pausa de foco", type: "Carga sustentável", description: "Pausas breves e regulares ajudam a reduzir a acumulação de fadiga durante tarefas exigentes.", action: "Experimenta uma pausa sem ecrã entre dois blocos de trabalho.", confidence: 79 },
  { title: "Transição para a noite", type: "Desaceleração", description: "Um ritual calmo antes de dormir pode facilitar a passagem da atividade para o repouso.", action: "Repete uma rotina simples de cinco minutos ao terminar o dia.", confidence: 74 },
  { title: "Movimento leve", type: "Bem-estar", description: "Movimento moderado ao longo do dia pode apoiar energia e humor sem exigir uma sessão longa.", action: "Faz uma caminhada curta ou alongamentos entre tarefas.", confidence: 73 },
  { title: "Carga percebida", type: "Autorregulação", description: "Observar a carga antes de começar uma tarefa torna mais fácil ajustar o ritmo.", action: "Divide a próxima tarefa exigente em duas etapas menores.", confidence: 77 },
  { title: "Recuperação real", type: "Descanso", description: "Descansar envolve afastar a atenção da tarefa, não apenas trocar de janela.", action: "Escolhe uma pausa sem notificações nem multitarefa.", confidence: 81 },
  { title: "Rotina de manhã", type: "Consistência", description: "Uma sequência curta e repetível pode reduzir decisões desnecessárias no início do dia.", action: "Define uma primeira ação simples para começar a manhã.", confidence: 72 },
  { title: "Limites digitais", type: "Higiene do sono", description: "Reduzir estímulos digitais perto da hora de dormir pode proteger o período de desaceleração.", action: "Ativa um período sem notificações antes do descanso.", confidence: 78 },
  { title: "Respiração e pausa", type: "Regulação", description: "Uma pausa com respiração lenta pode ajudar a reconhecer tensão antes de retomar.", action: "Faz três respirações lentas antes da próxima decisão.", confidence: 70 },
  { title: "Planeamento gentil", type: "Prevenção", description: "Planos realistas preservam energia e tornam mais provável manter uma rotina.", action: "Escolhe apenas uma prioridade principal para o próximo bloco.", confidence: 75 },
  { title: "Check-in consistente", type: "Autoconhecimento", description: "Registos regulares tornam mais fácil comparar energia, sono e carga ao longo do tempo.", action: "Faz o próximo check-in no mesmo momento do dia, se possível.", confidence: 80 },
];

const INSIGHT_VARIANTS_EN: Omit<InsightCardData, "id" | "period">[] = [
  { title: "Regular sleep", type: "Recovery", description: "Consistent sleep timing helps the body anticipate rest and recovery.", action: "Keep a similar bedtime throughout this week.", confidence: 82 },
  { title: "Light and energy", type: "Daily rhythm", description: "Morning daylight exposure can help reinforce the body’s circadian rhythm.", action: "Spend a few minutes by a window or outside in the morning.", confidence: 76 },
  { title: "Focus pause", type: "Sustainable load", description: "Short, regular breaks can reduce fatigue during demanding tasks.", action: "Try a screen-free pause between two work blocks.", confidence: 79 },
  { title: "Evening transition", type: "Wind-down", description: "A calm pre-sleep ritual can make it easier to move from activity to rest.", action: "Repeat a simple five-minute routine when the day ends.", confidence: 74 },
  { title: "Light movement", type: "Well-being", description: "Moderate movement during the day can support energy and mood without a long session.", action: "Take a short walk or stretch between tasks.", confidence: 73 },
  { title: "Perceived load", type: "Self-regulation", description: "Noticing your workload before starting makes it easier to adjust your pace.", action: "Break the next demanding task into two smaller steps.", confidence: 77 },
  { title: "Real recovery", type: "Rest", description: "Recovery means moving attention away from the task, not only switching windows.", action: "Choose a break without notifications or multitasking.", confidence: 81 },
  { title: "Morning routine", type: "Consistency", description: "A short repeatable sequence can reduce unnecessary decisions at the start of the day.", action: "Choose one simple first action for your morning.", confidence: 72 },
  { title: "Digital boundaries", type: "Sleep hygiene", description: "Reducing digital stimulation near bedtime can protect the wind-down period.", action: "Enable a notification-free period before rest.", confidence: 78 },
  { title: "Breathing pause", type: "Regulation", description: "A pause with slow breathing can help you notice tension before resuming.", action: "Take three slow breaths before your next decision.", confidence: 70 },
  { title: "Gentle planning", type: "Prevention", description: "Realistic plans preserve energy and make routines easier to maintain.", action: "Choose one main priority for the next block.", confidence: 75 },
  { title: "Consistent check-in", type: "Self-awareness", description: "Regular entries make it easier to compare energy, sleep, and workload over time.", action: "Complete your next check-in at a similar time if possible.", confidence: 80 },
];

export function getDailyInsights(locale: string): InsightCardData[] {
  const variants = locale === "pt" ? INSIGHT_VARIANTS_PT : INSIGHT_VARIANTS_EN;
  const daySeed = Math.floor(Date.now() / 86_400_000);
  const start = (daySeed * 5) % variants.length;
  const periods = ["manha", "tarde", "noite", "manha", "tarde"];

  return Array.from({ length: 5 }, (_, index) => ({
    ...variants[(start + index * 2) % variants.length],
    id: String.fromCharCode(65 + index),
    period: [periods[(index + daySeed) % periods.length]],
  }));
}

function polarToCartesian(cx: number, cy: number, r: number, i: number, sides: number) {
  const angle = ((i * 360) / sides - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function getCurrentPeriod(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "manha";
  if (h >= 12 && h < 19) return "tarde";
  return "noite";
}

export default function InsightsPage() {
  const [period, setPeriod] = useState<string>(getCurrentPeriod);
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isPt = locale === "pt";
  const router = useRouter();
  const { isLoggedIn, isReady, logoutUser } = useAuth();

  const handleSidebarLogout = async () => {
    await logoutUser();
    router.push(`/${locale}/auth/login`);
  };

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace(`/${locale}/auth/register`);
    }
  }, [isReady, isLoggedIn, locale, router]);

  const [insightsList, setInsightsList] = useState<InsightCardData[]>([]);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !isLoggedIn) return;
    getInsights()
      .then((items) => setInsightsList(items.map((item) => ({
        id: item.id,
        title: item.type,
        type: item.type,
        description: item.description,
        action: item.suggestion ?? (isPt ? "Continua a observar os teus dados." : "Keep observing your data."),
        confidence: item.confidence,
        period: ["manha", "tarde", "noite"],
      }))))
      .catch((error: unknown) => setInsightsError(getUserFriendlyError(error, isPt)));
  }, [isReady, isLoggedIn, isPt]);

  const periodsList = isPt
    ? [
        { key: "manha", label: "Manhã", range: "06h – 12h" },
        { key: "tarde", label: "Tarde", range: "12h – 19h" },
        { key: "noite", label: "Noite", range: "19h – 06h" },
      ]
    : [
        { key: "manha", label: "Morning", range: "06am – 12pm" },
        { key: "tarde", label: "Afternoon", range: "12pm – 07pm" },
        { key: "noite", label: "Night", range: "07pm – 06am" },
      ];

  if (!isReady || !isLoggedIn) {
    return null;
  }

  if (insightsError) {
    return (
      <div className="insights-private-page" style={{ minHeight: "100vh", background: "#060810", color: "#fff" }}>
        <Navbar />
        <DashboardSidebar locale={locale} activePath={`/${locale}/insights`} onLogout={handleSidebarLogout} />
        <main className="insights-private-content" style={{ padding: 140, textAlign: "center" }}>{insightsError}</main>
      </div>
    );
  }

  if (insightsList.length === 0) {
    return (
      <div className="insights-private-page" style={{ minHeight: "100vh", background: "#060810", color: "#fff" }}>
        <Navbar />
        <DashboardSidebar locale={locale} activePath={`/${locale}/insights`} onLogout={handleSidebarLogout} />
        <main className="insights-private-content" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div style={{ maxWidth: 440 }}>
            <h1 style={{ marginBottom: 10 }}>{isPt ? "O teu primeiro padrão está à espera" : "Your first pattern is waiting"}</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{isPt ? "Completa pelo menos três check-ins para começarmos a comparar os teus dados. Os padrões serão baseados apenas no que registares." : "Complete at least three check-ins so we can start comparing your data. Patterns will be based only on what you record."}</p>
          </div>
        </main>
      </div>
    );
  }

  function changePeriod(p: string) {
    setPeriod(p);
  }

  const cx = 300, cy = 300, radarR = 140, sides = 5;

  const radarPoints = Array.from({ length: sides }, (_, i) =>
    polarToCartesian(cx, cy, radarR, i, sides)
  );
  const dataPoints = insightsList.map((ins, i) =>
    polarToCartesian(cx, cy, radarR * (ins.confidence / 100), i, sides)
  );
  const radarPointsStr = radarPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const dataPointsStr = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [0.33, 0.66, 1];

  // Layout
  const svgSize = 520;
  const wW = 1100, wH = 840;
  const cX = wW / 2, cY = wH / 2;
  const cardW = 230, cardH = 250;
  const dist = 340;

  const cardPositions = insightsList.map((_, i) => {
    const ang = ((i * 360) / sides - 90) * (Math.PI / 180);
    return {
      left: cX + dist * Math.cos(ang) - cardW / 2,
      top: cY + dist * Math.sin(ang) - cardH / 2,
    };
  });

  return (
    <div className={isLoggedIn ? "insights-private-page" : undefined} style={{ minHeight: "100vh", background: "#060810", color: "#fff", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: "hidden" }}>

      <Navbar />
      {isLoggedIn && <DashboardSidebar locale={locale} activePath={`/${locale}/insights`} onLogout={handleSidebarLogout} />}

      <main className={isLoggedIn ? "insights-private-content" : undefined} style={{ paddingTop: 110, paddingBottom: 60 }}>

        {/* CENTRO: Seletor de Período de Tempo (Manhã 06h-12h | Tarde 12h-19h | Noite 19h-06h) */}
        <div
          className="insights-period-selector"
          style={{
            display: "flex",
            justifyContent: isLoggedIn ? "flex-end" : "center",
            width: isLoggedIn ? "calc(100% - 48px)" : undefined,
            margin: isLoggedIn ? "0 24px 36px 24px" : "0 auto 36px",
          }}
        >
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)",
            borderRadius: "100px", padding: "4px", gap: 4
          }}>
            {periodsList.map((p) => {
              const isActive = period === p.key;
              const PeriodIcon = p.key === "manha" ? Sun : p.key === "tarde" ? Sunset : Moon;
              return (
                <button
                  key={p.key}
                  onClick={() => changePeriod(p.key)}
                  aria-label={`${p.label} (${p.range})`}
                  onMouseEnter={() => setHoveredPeriod(p.key)}
                  onMouseLeave={() => setHoveredPeriod(null)}
                  onFocus={() => setHoveredPeriod(p.key)}
                  onBlur={() => setHoveredPeriod(null)}
                  style={{
                    position: "relative",
                    background: isActive ? "#ffffff" : "transparent",
                    color: isActive ? "#060810" : "rgba(255,255,255,0.5)",
                    border: "none", cursor: "pointer",
                    padding: "10px 22px", borderRadius: "100px",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.88rem",
                    transition: "all 0.25s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <PeriodIcon size={18} strokeWidth={2} aria-hidden="true" />
                  {hoveredPeriod === p.key && (
                    <span className="period-tooltip" role="tooltip">
                      <strong>{p.label}</strong>
                      <span>{p.range}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout principal com Radar SVG */}
        <div
          className="insights-radar-layout"
          style={{
            position: "relative",
            width: wW,
            height: wH,
            margin: isLoggedIn ? "0 auto 0 24px" : "0 auto",
          }}
        >

          {/* Radar SVG Plano + Linhas Conectoras aos Cartões */}
          <div style={{
            position: "absolute",
            left: cX - svgSize / 2,
            top: cY - svgSize / 2,
            width: svgSize, height: svgSize,
          }}>
            <svg width={svgSize} height={svgSize} viewBox="0 0 600 600" overflow="visible">

              {gridLevels.map((level, li) => {
                const pts = Array.from({ length: sides }, (_, i) => {
                  const p = polarToCartesian(cx, cy, radarR * level, i, sides);
                  return `${p.x},${p.y}`;
                }).join(" ");
                return <polygon key={li} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
              })}

              {radarPoints.map((p, i) => (
                <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ))}

              <polygon points={radarPointsStr} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

              <polygon points={dataPointsStr} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinejoin="round" />

              {/* LINHAS CONECTORAS TRACEJADAS: Do Vértice do Radar DIRETAMENTE à Ponta do Cartão */}
              {insightsList.map((ins, i) => {
                const isActive = ins.period.includes(period);
                const ang = ((i * 360) / sides - 90) * (Math.PI / 180);
                const cardTipX = cx + (dist - 115) * Math.cos(ang);
                const cardTipY = cy + (dist - 95) * Math.sin(ang);

                return (
                  <g key={i}>
                    <line
                      x1={radarPoints[i].x} y1={radarPoints[i].y}
                      x2={cardTipX} y2={cardTipY}
                      stroke={isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
                      strokeWidth={isActive ? "1.5" : "1"}
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={cardTipX} cy={cardTipY} r={isActive ? "3.5" : "2"}
                      fill={isActive ? "#ffffff" : "rgba(255,255,255,0.3)"}
                    />
                  </g>
                );
              })}

              {dataPoints.map((p, i) => {
                const isActive = insightsList[i].period.includes(period);
                return (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={isActive ? 8 : 5}
                      fill={isActive ? "#ffffff" : "rgba(255,255,255,0.2)"}
                      style={{ transition: "all 0.4s ease" }} />
                    <text x={p.x} y={p.y + 4} textAnchor="middle"
                      fill={isActive ? "#060810" : "rgba(255,255,255,0.4)"}
                      fontSize="9" fontWeight="800">
                      {insightsList[i].id}
                    </text>
                  </g>
                );
              })}

              {radarPoints.map((p, i) => {
                const ang = ((i * 360) / sides - 90) * (Math.PI / 180);
                const lx = cx + (radarR + 22) * Math.cos(ang);
                const ly = cy + (radarR + 22) * Math.sin(ang);
                return (
                  <text key={i} x={lx} y={ly + 4} textAnchor="middle"
                    fill="rgba(255,255,255,0.2)" fontSize="11" fontWeight="700">
                    {insightsList[i].id}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Cards com bloco de ação acoplado no canto interior */}
          {insightsList.map((ins, i) => {
            const isActive = ins.period.includes(period);
            return (
              <div
                key={ins.id}
                style={{
                  position: "absolute",
                  left: cardPositions[i].left,
                  top: cardPositions[i].top,
                  width: cardW,
                  height: cardH,
                  opacity: isActive ? 1 : 0.35,
                  transition: "opacity 0.3s ease",
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <InsightCardUnified insight={ins} isActive={isActive} />
              </div>
            );
          })}

        </div>

      </main>

      <style jsx>{`
        .insights-private-content {
          margin-left: 220px;
          width: calc(100% - 220px);
          padding-top: 117px !important;
        }

        .insights-private-content .insights-period-selector {
          justify-content: flex-end !important;
          width: auto !important;
          margin-left: 24px !important;
          margin-right: 24px !important;
        }

        .period-tooltip {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 128px;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(10, 14, 26, 0.98);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.72rem;
          line-height: 1.3;
          text-align: center;
          pointer-events: none;
          white-space: nowrap;
          animation: period-tooltip-in 0.16s ease-out;
        }

        .period-tooltip strong {
          color: #ffffff;
          font-size: 0.76rem;
          font-weight: 700;
        }

        @keyframes period-tooltip-in {
          from {
            opacity: 0;
            transform: translate(-50%, -4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .insights-private-content .insights-radar-layout {
          margin-left: 24px !important;
          margin-right: auto !important;
          transform: translate(-60px, -60px);
        }

        @media (min-width: 901px) {
          .insights-private-page,
          .insights-private-content {
            height: 100vh;
            overflow: hidden;
          }
        }

        @media (max-width: 900px) {
          .insights-private-content {
            margin-left: 0;
            width: 100%;
          }

          .insights-private-content .insights-period-selector {
            justify-content: center !important;
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            flex-wrap: wrap;
          }

          .insights-private-content .insights-radar-layout {
            margin-left: auto !important;
            margin-right: auto !important;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

{/* Componente Único de Cartão com Bloco de Ação Acoplado no Canto */}
function InsightCardUnified({ insight, isActive }: { insight: InsightCardData; isActive: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.03)",
        border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "16px 18px",
        boxSizing: "border-box",
        backdropFilter: "blur(12px)",
        boxShadow: isActive ? "0 12px 32px rgba(0,0,0,0.5)" : "none",
        position: "relative",
      }}
    >
      {/* Topo do Cartão: ID + Título + Tipo */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>
            {insight.id}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {insight.type}
          </span>
        </div>

        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>
          {insight.title}
        </h3>

        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.45 }}>
          {insight.description}
        </p>
      </div>

      {/* Bloco de Ação / Recomendação Acoplado na Parte Inferior do Cartão */}
      <div
        style={{
          marginTop: 10,
          padding: "10px 12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontSize: "0.74rem",
          color: "rgba(255,255,255,0.9)",
          lineHeight: 1.4,
          fontWeight: 500,
        }}
      >
        {insight.action}
      </div>
    </div>
  );
}
