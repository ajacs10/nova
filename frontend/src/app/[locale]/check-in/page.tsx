"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { MoodAvatarSelector } from "@/components/ui/mood-avatar-selector";
import Clock from "@/components/ui/clock";
import { Battery } from "@/components/ui/battery-indicator";
import FolderInteraction from "@/components/ui/folder-interaction";
import { useAuth } from "@/shared/lib/AuthContext";
import { checkIn, getCheckIns, getUserFriendlyError } from "@/shared/lib/api";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { usePreferredLocale } from "@/shared/lib/locale";

export default function CheckInPage() {
  const [step, setStep] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [crisisMessage, setCrisisMessage] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = React.useState(false);
  const params = useParams();
  const router = useRouter();
  const routeLocale = (params?.locale as string) || "en";
  const locale = usePreferredLocale("private", routeLocale);
  const { isLoggedIn, isReady, logoutUser } = useAuth();
  const isPt = locale === "pt";
  const text = {
    step: (current: number) => isPt ? `Passo ${current} de 4` : `Step ${current} of 4`,
    next: isPt ? "Seguinte" : "Next",
    previous: isPt ? "Anterior" : "Back",
    moodTitle: isPt ? "Como te sentes hoje?" : "How are you feeling today?",
    sleepTitle: isPt ? "Recuperação e Sono" : "Recovery and Sleep",
    energyTitle: isPt ? "Nível de Energia e Carga de Trabalho" : "Energy Level and Workload",
    noteTitle: isPt ? "Nota ou Reflexão Diária" : "Daily Note or Reflection",
  };

  const recoveryTools = [
    {
      href: `/${locale}/recovery`,
      title: isPt ? "Sintomas e atividades" : "Symptoms & activities",
    },
    {
      href: `/${locale}/return-to-learn`,
      title: isPt ? "Regresso à aprendizagem" : "Return to Learn",
    },
    {
      href: `/${locale}/return-to-activity`,
      title: isPt ? "Regresso à atividade" : "Return to Activity",
    },
  ];

  const recoveryToolsPanel = (
    <section className="recovery-tools" aria-labelledby="recovery-tools-title">
      <div className="recovery-tools-heading">
        <h2 id="recovery-tools-title">
          {isPt ? "Continua o teu acompanhamento" : "Continue your recovery tracking"}
        </h2>
        <p>
          {isPt
            ? "Regista o que observas para apoiar conversas com profissionais de saúde."
            : "Record what you observe to support conversations with healthcare professionals."}
        </p>
      </div>
      <div className="recovery-tools-grid">
        {recoveryTools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="recovery-tool-link">
            <strong>{tool.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );

  const handleSidebarLogout = async () => {
    await logoutUser();
    router.push(`/${locale}/auth/login`);
  };

  React.useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace(`/${locale}/auth/login`);
    }
  }, [isReady, isLoggedIn, locale, router]);

  React.useEffect(() => {
    if (!isReady || !isLoggedIn) return;
    getCheckIns().then((entries) => {
      const today = new Date().toLocaleDateString("en-CA");
      setAlreadyCheckedIn(entries.some((entry) => new Date(entry.createdAt).toLocaleDateString("en-CA") === today));
    }).catch(() => undefined);
  }, [isReady, isLoggedIn]);
  const [formData, setFormData] = React.useState({
    mood: null as 1 | 2 | 3 | 4 | 5 | null,
    sleepStart: "23:00",
    sleepEnd: "07:00",
    sleep: 0,
    energy: 0,
    workload: 0,
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mood || !formData.sleep || !formData.energy || !formData.workload) return;

    if (!isLoggedIn) {
      setSubmitted(true);
      return;
    }

    if (alreadyCheckedIn) {
      setSubmitError(locale === "pt" ? "Já completaste o check-in de hoje. O próximo abre à meia-noite." : "You already completed today's check-in. The next one opens at midnight.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await checkIn({
        mood: formData.mood,
        sleep: formData.sleep,
        energy: formData.energy,
        workload: formData.workload,
        note: formData.note.trim() || undefined,
      });
      if ("crisis" in result) {
        setCrisisMessage(result.message);
        return;
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(getUserFriendlyError(error, locale === "pt"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepComplete =
    step === 1
      ? formData.sleep > 0
      : step === 2
      ? formData.energy > 0 && formData.workload > 0
      : step === 3
      ? formData.note.trim().length > 0
      : true;

  if (!isReady || !isLoggedIn) return null;

  if (crisisMessage) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#060810", color: "#ffffff", textAlign: "center" }}>
        <section style={{ maxWidth: 560, padding: 32, border: "1px solid #f87171", borderRadius: 8, background: "rgba(127,29,29,0.18)" }}>
            <h1 style={{ marginBottom: 16, color: "#fecaca" }}>{isPt ? "Precisas de ajuda agora" : "You need help now"}</h1>
          <p style={{ lineHeight: 1.7, marginBottom: 24 }}>{crisisMessage}</p>
          <p style={{ lineHeight: 1.7, fontWeight: 700 }}>{isPt ? "Não fiques sozinho. Liga agora para alguém de confiança e pede-lhe para ficar contigo." : "Do not stay alone. Call someone you trust now and ask them to stay with you."}</p>
        </section>
      </main>
    );
  }

  if (alreadyCheckedIn && !submitted) {
    return (
      <div className="checkin-page min-h-screen" style={{ background: "#060810", color: "#ffffff" }}>
        <Navbar />
        <DashboardSidebar locale={locale} activePath={`/${locale}/check-in`} onLogout={handleSidebarLogout} />
        <main className="checkin-private-content" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "140px 24px 80px", textAlign: "center" }}>
          <section style={{ maxWidth: 560 }}>
            <div style={{ fontSize: "3rem", marginBottom: 20 }}>✓</div>
            <h1 style={{ marginBottom: 16 }}>{isPt ? "Check-in concluído" : "Check-in complete"}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 28 }}>
              {isPt ? "O próximo fica disponível à meia-noite." : "Your next check-in is available at midnight."}
            </p>
            <Link href={`/${locale}/dashboard`} style={{ display: "inline-block", padding: "12px 22px", borderRadius: 999, background: "#00d2b5", color: "#060810", fontWeight: 700, textDecoration: "none" }}>
              {isPt ? "Ver o meu painel" : "View my dashboard"}
            </Link>
            <div style={{ marginTop: 32, textAlign: "left" }}>{recoveryToolsPanel}</div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div
      className="checkin-page min-h-screen overflow-y-auto flex flex-col"
      style={{
        background: "#060810",
        backgroundColor: "#060810",
        color: "#ffffff",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar />
      {isLoggedIn && (
        <DashboardSidebar
          locale={locale}
          activePath={`/${locale}/check-in`}
          onLogout={handleSidebarLogout}
        />
      )}

      <main
        className={`checkin-main min-h-screen flex-1 flex flex-col items-center justify-center${isLoggedIn ? " checkin-private-content" : ""}`}
        style={{
          paddingTop: "140px",
          paddingBottom: "80px",
          flex: 1,
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="container checkin-page-shell"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 20px",
            width: "100%",
            boxSizing: "border-box",
            alignSelf: "center",
          }}
        >
          {/* Passo 0: Seletor de Humor */}
          {!submitted && step === 0 && (
            <div className="step-zero-container">
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(0,210,181,0.15)",
                    color: "#00d2b5",
                    padding: "6px 16px",
                    borderRadius: "100px",
                    fontWeight: 700,
                  }}
                >
                  {text.step(1)}
                </span>
                <h2
                  className="checkin-mood-title"
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginTop: 16,
                  }}
                >
                  {text.moodTitle}
                </h2>
              </div>

              {/* Avatares */}
              <div className="mood-avatar-wrapper">
                <MoodAvatarSelector
                  selected={formData.mood}
                  onSelect={(v) => setFormData({ ...formData, mood: v })}
                />
              </div>

              {/* Botão Seguinte (Junto ao Avatar e Centralizado) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: 36,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={formData.mood === null}
                  style={{
                    padding: "14px 48px",
                    background:
                      formData.mood === null
                        ? "rgba(255,255,255,0.1)"
                        : "#00d2b5",
                    border: "none",
                    color:
                      formData.mood === null
                        ? "rgba(255,255,255,0.3)"
                        : "#060810",
                    borderRadius: "100px",
                    cursor:
                      formData.mood === null ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  {text.next}
                </button>
              </div>
              <div className="recovery-tools-placement">{recoveryToolsPanel}</div>
            </div>
          )}

          {/* Passos 1, 2, 3 */}
          {!submitted && step > 0 && (
            <div className="checkin-step-form" style={{ maxWidth: step === 3 ? 680 : 850, margin: "0 auto" }}>
              <div className="checkin-step-header" style={{ marginBottom: 36, textAlign: "center" }}>
                <span
                  className="checkin-step-badge"
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(0,210,181,0.15)",
                    color: "#00d2b5",
                    padding: "6px 16px",
                    borderRadius: "100px",
                    fontWeight: 700,
                  }}
                >
                  {text.step(step + 1)}
                </span>
                <h2
                  className="checkin-step-title"
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginTop: 16,
                  }}
                >
                  {step === 1 && text.sleepTitle}
                  {step === 2 && text.energyTitle}
                  {step === 3 && text.noteTitle}
                </h2>
                {step === 2 && (
                  <div
                    className="step-helper-text"
                    style={{
                      marginTop: 12,
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.65)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {isPt ? "Arrasta as linhas para ajustar a tua energia e a carga de trabalho." : "Drag the sliders to adjust your energy and workload."}
                  </div>
                )}
              </div>

              {submitError && (
                <div role="alert" style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.12)", color: "#fca5a5", textAlign: "center" }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Passo 1 */}
                {step === 1 && (
                  <div style={{ marginBottom: 36 }}>
                    <div
                      className="checkin-step-one-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "280px 1fr",
                        gap: 40,
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="clock-container"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Clock timeZone="Europe/Lisbon" initialSecondsMode="smooth" />
                      </div>

                      <div>
                        <div
                          className="sleep-section-label"
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.7)",
                            textTransform: "uppercase",
                            marginBottom: 24,
                          }}
                        >
                          {isPt ? "PREENCHER HORAS DE SONO" : "ENTER SLEEP HOURS"}
                        </div>

                        <div
                          className="sleep-figure-row"
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 12,
                            marginBottom: 12,
                          }}
                        >
                          <span
                            className="sleep-figure-number"
                            style={{
                              fontSize: "3.8rem",
                              fontWeight: 800,
                              color: "#ffffff",
                              lineHeight: 1,
                            }}
                          >
                            {formData.sleep}
                          </span>
                          <span
                            className="sleep-figure-unit"
                            style={{
                              fontSize: "1.3rem",
                              fontWeight: 600,
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {isPt ? "horas dormidas" : "hours slept"}
                          </span>
                        </div>

                        <div
                          className="sleep-helper-text"
                          style={{
                            marginBottom: 18,
                            fontSize: "0.82rem",
                            color: "rgba(255,255,255,0.6)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {isPt ? "Arrasta a linha para ajustar as horas de sono." : "Drag the slider to adjust your sleep hours."}
                        </div>

                        <div style={{ position: "relative", marginBottom: 28 }}>
                          <input
                            type="range"
                            min="0"
                            max="14"
                            step="1"
                            value={formData.sleep}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sleep: parseInt(e.target.value),
                              })
                            }
                            style={{
                              width: "100%",
                              accentColor: "#00d2b5",
                              height: 10,
                              borderRadius: 6,
                              cursor: "pointer",
                              outline: "none",
                              background: "rgba(255, 255, 255, 0.1)",
                            }}
                          />

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 10,
                              fontSize: "0.75rem",
                              color: "rgba(255, 255, 255, 0.4)",
                              fontWeight: 600,
                            }}
                          >
                            <span>0h</span>
                            <span>4h</span>
                            <span>8h</span>
                            <span>12h</span>
                            <span>14h</span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color:
                              formData.sleep >= 7
                                ? "#00d2b5"
                                : formData.sleep >= 5
                                ? "#eab308"
                                : "#ef4444",
                          }}
                        >
                          {formData.sleep >= 8 && (isPt ? "Descanso excelente e reparador" : "Excellent, restorative sleep")}
                          {formData.sleep === 7 && (isPt ? "Sono adequado para recuperar energia" : "Enough sleep to restore energy")}
                          {formData.sleep >= 5 && formData.sleep < 7 && (isPt ? "Sono moderado, atenção ao cansaço" : "Moderate sleep, watch for fatigue")}
                          {formData.sleep < 5 && (isPt ? "Sono insuficiente, prioriza o descanso" : "Not enough sleep, prioritise rest")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Passo 2 */}
                {step === 2 && (
                  <div
                    className="checkin-energy-grid energy-step-panel"
                    style={{
                      marginBottom: 36,
                      display: "grid",
                      gridTemplateColumns: "1fr 1px 1fr",
                      gap: "0 40px",
                      alignItems: "start",
                    }}
                  >
                    <div className="energy-column" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                      <div className="energy-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="energy-title" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>
                          {isPt ? "Energia" : "Energy"}
                        </span>
                        <div
                          className="energy-value-badge"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "14px",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "baseline",
                            gap: 3,
                          }}
                        >
                          <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00d2b5", lineHeight: 1 }}>
                            {formData.energy}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                            /10
                          </span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={formData.energy}
                        onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                        style={{ width: "100%", accentColor: "#00d2b5", height: 10, borderRadius: 6, cursor: "pointer", outline: "none" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                        <span>{isPt ? "Exausto" : "Exhausted"}</span>
                        <span>{isPt ? "Cheio de energia" : "Full of energy"}</span>
                      </div>

                      <div className="battery-visual" style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
                        <Battery
                          level={formData.energy * 10}
                          size={240}
                          theme="neon"
                          showPercentage={true}
                          colorScheme="auto"
                          className="text-teal-400"
                        />
                      </div>
                    </div>

                    <div className="checkin-divider" style={{ width: 1, background: "rgba(255,255,255,0.08)", alignSelf: "stretch", minHeight: 200 }} />

                    <div className="workload-column" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                      <div className="workload-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="workload-title" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>
                          {isPt ? "Carga de Trabalho" : "Workload"}
                        </span>
                        <div
                          className="workload-value-badge"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "14px",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "baseline",
                            gap: 3,
                          }}
                        >
                          <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6", lineHeight: 1 }}>
                            {formData.workload}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                            /10
                          </span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={formData.workload}
                        onChange={(e) => setFormData({ ...formData, workload: parseInt(e.target.value) })}
                        style={{ width: "100%", accentColor: "#3b82f6", height: 10, borderRadius: 6, cursor: "pointer", outline: "none" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                        <span>{isPt ? "Leve" : "Light"}</span>
                        <span>{isPt ? "Sobrecarga total" : "Fully overloaded"}</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 12 }}>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                          {isPt ? "Clique para abrir os seus projetos" : "Click to open your projects"}
                        </div>
                        <FolderInteraction forceOpen={formData.workload >= 6} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Passo 3 */}
                {step === 3 && (
                  <div style={{ marginBottom: 36 }}>
                    <label style={{ display: "block", fontSize: "1rem", color: "rgba(255,255,255,0.9)", marginBottom: 12, fontWeight: 500 }}>
                      {isPt ? "Nota pessoal ou observação sobre o teu dia:" : "Personal note or observation about your day:"}
                    </label>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      placeholder={isPt ? "Escreve como correu o teu dia ou os teus pensamentos principais..." : "Write about your day or your main thoughts..."}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "18px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "18px",
                        color: "#ffffff",
                        outline: "none",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6, color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>
                      {formData.note.length}/1000
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div
                  className="checkin-button-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                    gap: 24,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    style={{
                      minWidth: 140,
                      padding: "14px 28px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#ffffff",
                      borderRadius: "100px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textAlign: "center",
                    }}
                  >
                    {text.previous}
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={!isCurrentStepComplete}
                      style={{
                        minWidth: 140,
                        padding: "14px 28px",
                        background: isCurrentStepComplete ? "#00d2b5" : "rgba(255,255,255,0.1)",
                        border: "none",
                        color: isCurrentStepComplete ? "#060810" : "rgba(255,255,255,0.35)",
                        borderRadius: "100px",
                        cursor: isCurrentStepComplete ? "pointer" : "not-allowed",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        textAlign: "center",
                      }}
                    >
                      {text.next}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isCurrentStepComplete || isSubmitting || alreadyCheckedIn}
                      style={{
                        minWidth: 180,
                        padding: "14px 32px",
                        background: isCurrentStepComplete && !isSubmitting ? "#ffffff" : "rgba(255,255,255,0.1)",
                        border: "none",
                        color: isCurrentStepComplete && !isSubmitting ? "#060810" : "rgba(255,255,255,0.35)",
                        borderRadius: "100px",
                        cursor: isCurrentStepComplete && !isSubmitting ? "pointer" : "not-allowed",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        textAlign: "center",
                      }}
                    >
                      {alreadyCheckedIn ? (isPt ? "Check-in concluído hoje" : "Check-in completed today") : isSubmitting ? (isPt ? "A guardar..." : "Saving...") : (isPt ? "Concluir e guardar" : "Complete and save")}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Sucesso (Totalmente Centralizado) */}
          {submitted && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px 0",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              {isLoggedIn ? (
                <>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(0, 210, 181, 0.12)",
                      border: "2px solid #00d2b5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                      color: "#00d2b5",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
                    {isPt ? "O teu cuidado diário foi registado." : "Your daily care has been recorded."}
                  </h2>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.7,
                      marginBottom: 36,
                    }}
                  >
                    {isPt ? "Cada check-in ajuda a perceber melhor como o teu sono, a tua energia e a carga de trabalho influenciam o teu bem-estar. Este registo fica privado e vai permitir detetar padrões úteis para te ajudares a cuidar melhor de ti." : "Each check-in helps you understand how sleep, energy and workload affect your well-being. This record stays private and helps identify useful patterns for taking better care of yourself."}
                  </p>
                  <Link
                    href={`/${locale}/dashboard`}
                    style={{
                      display: "inline-block",
                      padding: "16px 36px",
                      background: "#00d2b5",
                      color: "#060810",
                      borderRadius: "100px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {isPt ? "Ver o meu painel" : "View my dashboard"}
                  </Link>
                  <div style={{ width: "100%", marginTop: 32, textAlign: "left" }}>{recoveryToolsPanel}</div>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
                    {isPt ? "Guarda o teu progresso e continua a acompanhar o teu bem-estar." : "Save your progress and keep tracking your well-being."}
                  </h2>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.7,
                      marginBottom: 36,
                    }}
                  >
                    {isPt ? "O teu check-in foi preenchido, mas ainda não foi guardado porque a tua sessão não está ativa. Ao criar a conta, podes guardar o teu histórico e acompanhar os teus padrões de sono, energia, rotina e equilíbrio emocional." : "Your check-in is complete, but it was not saved because your session is not active. Create an account to save your history and track your sleep, energy, routine and emotional balance patterns."}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                    <Link
                      href={`/${locale}/auth/register`}
                      style={{
                        display: "inline-block",
                        padding: "16px 36px",
                        background: "#00d2b5",
                        color: "#060810",
                        borderRadius: "100px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {isPt ? "Criar conta" : "Create account"}
                    </Link>
                    <Link
                      href={`/${locale}/auth/login`}
                      style={{
                        display: "inline-block",
                        padding: "16px 36px",
                        background: "transparent",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "100px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {isPt ? "Entrar na conta" : "Sign in"}
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {isReady && !isLoggedIn && <Footer />}

      <style jsx global>{`
        html,
        body {
          background-color: #060810 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
        }
      `}</style>

      <style jsx>{`
        .checkin-step-badge {
          display: inline-block;
          white-space: nowrap;
        }

        .checkin-private-content {
          margin-left: 220px;
          width: calc(100% - 220px) !important;
          padding-top: 117px !important;
          margin-right: 0;
        }

        .energy-step-panel {
          width: 100%;
        }

        .battery-visual {
          width: 100%;
          max-width: 240px;
          margin: 0 auto;
        }

        .battery-visual svg {
          display: block;
          width: 100% !important;
          height: auto !important;
        }

        .checkin-page-shell {
          width: 100%;
          max-width: 900px;
        }

        .checkin-step-form {
          width: 100%;
          max-width: 850px;
          margin-left: auto;
          margin-right: auto;
        }

        .step-zero-container {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          width: 100%;
        }

        .recovery-tools-placement {
          width: min(100%, 820px);
          margin-top: 40px;
        }

        .recovery-tools {
          padding: 22px;
          border: 1px solid rgba(0, 210, 181, 0.24);
          border-radius: 18px;
          background: rgba(0, 210, 181, 0.055);
        }

        .recovery-tools-heading h2 {
          margin: 0 0 6px;
          color: #ffffff;
          font-size: 1.15rem;
        }

        .recovery-tools-heading p {
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .recovery-tools-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .recovery-tool-link {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          padding: 13px 15px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 12px;
          background: rgba(6, 8, 16, 0.45);
          color: #ffffff;
          text-decoration: none;
          transition: border-color 0.16s ease, transform 0.16s ease;
        }

        .recovery-tool-link:hover,
        .recovery-tool-link:focus-visible {
          border-color: #00d2b5;
          outline: none;
          transform: translateY(-2px);
        }

        .recovery-tool-link strong {
          color: #00d2b5;
          font-size: 0.88rem;
        }

        .mood-avatar-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .mood-avatar-wrapper :global(svg),
        .mood-avatar-wrapper :global(img) {
          max-width: 100%;
          height: auto;
        }

        .clock-container :global(svg) {
          width: 100% !important;
          max-width: 260px !important;
          height: auto !important;
        }

        .sleep-section-label,
        .sleep-figure-row,
        .sleep-helper,
        .sleep-status {
          max-width: 100%;
          word-break: break-word;
        }

        .sleep-helper-text {
          margin-bottom: 24px !important;
          line-height: 1.5;
        }

        .sleep-status {
          display: block;
          margin-top: 22px;
          line-height: 1.5;
        }

        .step-helper-text {
          margin-bottom: 24px !important;
          line-height: 1.5;
        }

        @media (min-width: 901px) {
          .checkin-step-header {
            margin-bottom: 24px !important;
          }

          .checkin-step-title {
            font-size: 1.45rem !important;
            margin-top: 12px !important;
          }

          .step-helper-text {
            margin-top: 8px !important;
          }
        }

        @media (max-width: 900px) {
          .checkin-private-content {
            margin-left: 0;
            width: 100%;
          }
          .checkin-main {
            padding-top: 110px !important;
            padding-bottom: 60px !important;
            justify-content: flex-start !important;
            overflow-y: visible !important;
          }

          .checkin-page-shell {
            max-width: 100% !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            transform: none;
          }

          .checkin-step-form {
            max-width: 100% !important;
          }

          .energy-step-panel {
            width: 100% !important;
          }

          .checkin-step-one-grid,
          .checkin-energy-grid {
            grid-template-columns: 1fr !important;
          }

          .checkin-divider {
            display: none !important;
          }

          .energy-title,
          .workload-title {
            font-size: clamp(0.98rem, 3.4vw, 1.06rem) !important;
          }

          .energy-value-badge,
          .workload-value-badge {
            padding: 6px 10px !important;
          }

          .energy-column,
          .workload-column {
            gap: 18px !important;
            min-width: 0 !important;
          }

          .energy-row,
          .workload-row {
            min-width: 0 !important;
          }

          .energy-value-badge,
          .workload-value-badge {
            flex-shrink: 0 !important;
          }

          .checkin-button-row {
            flex-direction: row !important;
            justify-content: space-between !important;
            gap: 12px !important;
          }

          .checkin-button-row button {
            width: calc(50% - 6px) !important;
            min-width: 0 !important;
            flex: 1 1 0 !important;
          }
        }

        @media (max-width: 640px) {
          .recovery-tools-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .checkin-step-header {
            margin-bottom: 16px !important;
          }

          .checkin-mood-title {
            font-size: clamp(1.3rem, 6vw, 1.7rem) !important;
            line-height: 1.2 !important;
            margin-top: 12px !important;
          }

          .checkin-step-badge {
            display: inline-block !important;
            white-space: nowrap !important;
            font-size: clamp(0.62rem, 2.4vw, 0.72rem) !important;
            padding: 5px 11px !important;
            letter-spacing: 0.02em !important;
          }

          .checkin-step-title {
            font-size: clamp(1.08rem, 5vw, 1.35rem) !important;
            margin-top: 10px !important;
            line-height: 1.15 !important;
          }

          .step-helper-text {
            margin-top: 8px !important;
            font-size: 0.68rem !important;
            line-height: 1.35 !important;
          }

          .sleep-section-label {
            font-size: 0.7rem !important;
            letter-spacing: 0.06em !important;
            line-height: 1.5 !important;
            margin-bottom: 16px !important;
          }

          .sleep-figure-number {
            font-size: clamp(2.2rem, 10vw, 3rem) !important;
          }

          .sleep-figure-unit {
            font-size: 1rem !important;
          }

          .sleep-helper-text {
            font-size: 0.72rem !important;
            line-height: 1.5 !important;
          }

          .checkin-main {
            padding-top: 120px !important;
            padding-bottom: 52px !important;
          }

          .checkin-page-shell {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .checkin-step-one-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .energy-step-panel {
            transform: none !important;
            width: 100% !important;
            margin: 0 auto !important;
          }

          .energy-row,
          .workload-row {
            gap: 8px !important;
            align-items: center !important;
          }

          .energy-title,
          .workload-title {
            font-size: 0.92rem !important;
            line-height: 1.25 !important;
          }

          .energy-value-badge,
          .workload-value-badge {
            padding: 5px 8px !important;
          }

          .energy-value-badge span:first-child,
          .workload-value-badge span:first-child {
            font-size: 1.3rem !important;
          }

          .energy-value-badge span:last-child,
          .workload-value-badge span:last-child {
            font-size: 0.7rem !important;
          }

          .battery-visual {
            max-width: min(170px, 52vw) !important;
          }

          .sleep-figure-row {
            gap: 8px !important;
            margin-bottom: 10px !important;
            flex-wrap: nowrap !important;
            align-items: baseline !important;
          }

          .clock-container {
            display: none !important;
          }

          .checkin-step-form {
            max-width: 100% !important;
          }

          .sleep-figure-row {
            flex-wrap: wrap !important;
            gap: 6px !important;
            align-items: flex-end !important;
          }

          .sleep-figure-unit {
            white-space: nowrap !important;
          }

          .checkin-energy-grid {
            gap: 12px !important;
            margin-bottom: 20px !important;
          }

          .energy-column,
          .workload-column {
            gap: 12px !important;
          }

          .checkin-button-row {
            flex-direction: row !important;
            gap: 10px !important;
          }

          .checkin-button-row button {
            width: calc(42% - 5px) !important;
            min-width: 0 !important;
            padding: 10px 8px !important;
            font-size: 0.72rem !important;
          }
        }
      `}</style>
    </div>
  );
}
