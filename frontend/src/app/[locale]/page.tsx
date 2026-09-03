"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { useAuth } from "@/shared/lib/AuthContext";

export default function LandingPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const isPt = locale === "pt";
  const { isReady, isLoggedIn } = useAuth();

  React.useEffect(() => {
    if (isReady && isLoggedIn) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [isReady, isLoggedIn, locale, router]);

  if (!isReady) return null;
  if (isLoggedIn) return null;

  const wellnessVideoSlides = isPt
    ? [
        {
          src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=640&fit=crop&q=80",
          alt: "Respiração & Controlo Emocional",
          title: "Respiração & Controlo Emocional",
          subtitle: "Técnica de respiração diafragmática para reduzir o stress e ansiedade",
          youtubeId: "tEmt1Znux58",
        },
        {
          src: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=640&h=640&fit=crop&q=80",
          alt: "Qualidade do Sono & Energia",
          title: "Qualidade do Sono & Energia",
          subtitle: "Como o sono afecta o teu humor, memória e bem-estar emocional",
          youtubeId: "nm1TxQj9IsQ",
        },
        {
          src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=640&h=640&fit=crop&q=80",
          alt: "A Ciência da Felicidade",
          title: "A Ciência da Felicidade",
          subtitle: "Dan Gilbert (TED) sobre o que realmente nos faz felizes — e o que não faz",
          youtubeId: "4q1dgn_C0AU",
        },
        {
          src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=640&h=640&fit=crop&q=80",
          alt: "Foco & Alta Performance",
          title: "Foco & Alta Performance",
          subtitle: "Daniel Goleman sobre inteligência emocional, foco e bem-estar diário",
          youtubeId: "HTfYv3IEOqM",
        },
        {
          src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=640&h=640&fit=crop&q=80",
          alt: "O Antídoto à Insatisfação",
          title: "O Antídoto à Insatisfação",
          subtitle: "Kurzgesagt: como a gratidão e a perspectiva mudam o teu bem-estar",
          youtubeId: "WPPPFqsECz0",
        },
      ]
    : [
        {
          src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=640&fit=crop&q=80",
          alt: "Breathing & Emotional Control",
          title: "Breathing & Emotional Control",
          subtitle: "Box breathing technique to reduce stress and anxiety",
          youtubeId: "tEmt1Znux58",
        },
        {
          src: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=640&h=640&fit=crop&q=80",
          alt: "Sleep Quality & Energy",
          title: "Sleep Quality & Energy",
          subtitle: "How sleep affects your mood, memory and emotional well-being",
          youtubeId: "nm1TxQj9IsQ",
        },
        {
          src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=640&h=640&fit=crop&q=80",
          alt: "The Science of Happiness",
          title: "The Science of Happiness",
          subtitle: "Dan Gilbert (TED) on what really makes us happy — and what doesn't",
          youtubeId: "4q1dgn_C0AU",
        },
        {
          src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=640&h=640&fit=crop&q=80",
          alt: "Focus & High Performance",
          title: "Focus & High Performance",
          subtitle: "Daniel Goleman on emotional intelligence, focus and daily well-being",
          youtubeId: "HTfYv3IEOqM",
        },
        {
          src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=640&h=640&fit=crop&q=80",
          alt: "An Antidote to Dissatisfaction",
          title: "An Antidote to Dissatisfaction",
          subtitle: "Kurzgesagt: how gratitude and perspective change your well-being",
          youtubeId: "WPPPFqsECz0",
        },
      ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#060810",
        color: "var(--text)",
        overflowX: "hidden",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#060810",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Navbar />
      </header>

      <main style={{ flex: 1, width: "100%", background: "#060810" }}>
        {/* HERO SECTION */}
        <section
          style={{
            position: "relative",
            minHeight: "calc(100vh - 70px)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(60px, 10vh, 120px) clamp(20px, 5vw, 40px)",
            backgroundImage: `linear-gradient(to bottom, rgba(6, 8, 16, 0.40) 0%, rgba(6, 8, 16, 0.80) 70%, rgba(6, 8, 16, 1) 100%), url('/iamgem1.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              maxWidth: 840,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                marginBottom: 24,
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.6)",
              }}
            >
              {isPt ? "Torna a tua recuperação mais fácil de compreender." : "Make recovery easier to understand."}
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
                color: "rgba(255, 255, 255, 0.82)",
                maxWidth: 720,
                margin: "0 auto 40px",
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
              }}
            >
              {isPt
                ? "Acompanha sintomas, sono e atividades num único lugar."
                : "Track symptoms, sleep, and activities in one place."}
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <Link
                href={`/${locale}/auth/login`}
                style={{
                  background: "#ffffff",
                  color: "#060810",
                  padding: "16px 36px",
                  borderRadius: "100px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(255, 255, 255, 0.25)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {isPt ? "Explorar NOVA Recovery" : "Explore NOVA Recovery"}
              </Link>
            </div>
          </div>
        </section>

        <section style={{ padding: "72px 20px", background: "#080b15" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.7rem, 3vw, 2.4rem)", margin: "0 0 14px" }}>{isPt ? "Regista. Organiza. Conversa." : "Record. Organize. Discuss."}</h2>
            <p style={{ color: "rgba(255,255,255,.65)", margin: "0 auto 30px", maxWidth: 600, lineHeight: 1.6 }}>{isPt ? "Informação clara para a tua recuperação e para conversas com profissionais." : "Clear information for your recovery and conversations with professionals."}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, textAlign: "left" }}>
              {[
                [isPt ? "Check-in diário" : "Daily check-in", isPt ? "Sintomas, sono e rotina." : "Symptoms, sleep, and routine."],
                [isPt ? "Os teus dados" : "Your data", isPt ? "Histórico e tendências autorrelatadas." : "History and self-reported trends."],
                [isPt ? "Resumo claro" : "Clear summary", isPt ? "Prepara a próxima conversa clínica." : "Prepare the next clinical conversation."],
              ].map(([title, text]) => <article key={title} style={{ padding: 22, border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, background: "rgba(255,255,255,.025)" }}><strong style={{ display: "block", color: "#00d2b5", marginBottom: 8 }}>{title}</strong><span style={{ color: "rgba(255,255,255,.68)", fontSize: ".9rem" }}>{text}</span></article>)}
            </div>
          </div>
        </section>

        <>

        {/* SECÇÃO CARROSSEL DE VÍDEOS DE BEM-ESTAR (INTACTO) */}
        <section
          id="features"
          style={{
            padding: "100px 0 120px",
            background: "#060810",
            position: "relative",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div className="container" style={{ textAlign: "center", marginBottom: 48, padding: "0 20px" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: 14 }}>
              {isPt ? "Explora os teus padrões e experiências." : "Explore your patterns and experiences."}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.65)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              {isPt
                ? "Descobre cada tema em movimento. Clica num cartão para ver a demonstração e perceber como a NOVA pode apoiar o teu bem-estar diário."
                : "Discover each theme in motion. Click a card to watch the demonstration and see how NOVA can support your daily well-being."}
            </p>
          </div>

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
            <CoverflowCarousel slides={wellnessVideoSlides} />
          </div>
        </section>

        {false && <>
        {/* WORKFLOW (ESTILO APPLE BENTO CARDS) */}
        <section id="recovery-workflow" style={{ padding: "120px 20px", background: "#080b15" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span style={{ color: "#00d2b5", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>NOVA RECOVERY</span>
              <h2 style={{ color: "#fff", fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", margin: "14px auto", maxWidth: 700, fontWeight: 800, letterSpacing: "-0.03em" }}>
                {isPt ? "Uma história de recuperação mais clara." : "A clearer recovery story."}
              </h2>
              <p style={{ color: "rgba(255,255,255,.65)", maxWidth: 640, margin: "0 auto", lineHeight: 1.7, fontSize: "1.05rem" }}>
                {isPt ? "Acompanha o que sentes, compreende o que registaste, organiza a informação e leva uma história mais clara para as tuas conversas." : "Track what you feel, understand what you recorded, organize the information, and bring a clearer story to conversations."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {[
                ["TRACK", isPt ? "Sintomas, sono, atividade e aprendizagem." : "Symptoms, sleep, activity and learning."],
                ["UNDERSTAND", isPt ? "Timeline e padrões observados." : "Timeline and observed patterns."],
                ["ORGANIZE", isPt ? "Resumo de recuperação." : "Recovery Summary."],
                ["COMMUNICATE", isPt ? "Informação para conversas com profissionais." : "Information for conversations with professionals."],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  style={{
                    padding: "32px 26px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 20,
                    backdropFilter: "blur(20px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 180,
                  }}
                >
                  <strong style={{ color: "#00d2b5", fontSize: ".75rem", letterSpacing: "0.1em" }}>
                    0{index + 1} · {title}
                  </strong>
                  <p style={{ color: "rgba(255,255,255,.85)", lineHeight: 1.6, fontSize: "1rem", margin: 0, fontWeight: 500 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section style={{ padding: "120px 20px", background: "#060810" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {[
              ["Recovery Check-in", isPt ? "Regista sintomas, sono e como te sentes hoje." : "Record symptoms, sleep and how you're doing today.", "/recovery"],
              ["Activity Before / After", isPt ? "Acompanha atividades e o que registaste antes e depois." : "Track activities and what you recorded before and after.", "/recovery"],
              ["Recovery Timeline", isPt ? "Vê os teus registos ao longo do tempo." : "See your recovery entries over time.", "/recovery"],
              ["Observed Patterns", isPt ? "Explora padrões repetidos nos teus próprios dados." : "Explore repeated patterns in your own recorded data.", "/insights"],
              ["Return to Learn", isPt ? "Regista aprendizagem, pausas e adaptações." : "Track learning activities, breaks and accommodations.", "/return-to-learn"],
              ["Recovery Summary", isPt ? "Organiza informação para conversas com profissionais." : "Turn entries into a structured conversation summary.", "/summary"],
            ].map(([title, text, href]) => (
              <Link
                key={title}
                href={href}
                style={{
                  padding: 32,
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "rgba(255, 255, 255, 0.02)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 24,
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ color: "#00d2b5", fontSize: ".72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>NOVA RECOVERY</span>
                  <h3 style={{ margin: "14px 0 10px", fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,.65)", lineHeight: 1.6, fontSize: ".95rem" }}>{text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* DEMO DATA COMPARISON */}
        <section style={{ padding: "100px 20px", background: "#0a0e1a" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "#f59e0b", fontSize: ".75rem", fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>DEMO DATA</span>
            <h2 style={{ color: "#fff", margin: "16px 0 40px", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {isPt ? "O que foi registado antes e depois" : "What was recorded before and after"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 20 }}>
              <div style={{ padding: 32, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", borderRadius: 20, textAlign: "left" }}>
                <strong style={{ color: "#00d2b5", display: "block", marginBottom: 12, fontSize: ".8rem", letterSpacing: ".1em" }}>
                  {isPt ? "ANTES" : "BEFORE"}
                </strong>
                <p style={{ color: "#fff", margin: 0, lineHeight: 1.8, fontSize: "1.1rem" }}>
                  Fatigue <b style={{ color: "#00d2b5" }}>3/10</b><br />
                  Headache <b style={{ color: "#00d2b5" }}>2/10</b>
                </p>
              </div>
              <span style={{ color: "#00d2b5", fontSize: "1.8rem", fontWeight: 300 }}>→</span>
              <div style={{ padding: 32, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", borderRadius: 20, textAlign: "left" }}>
                <strong style={{ color: "#00d2b5", display: "block", marginBottom: 12, fontSize: ".8rem", letterSpacing: ".1em" }}>
                  {isPt ? "DEPOIS · 30 MIN DE ESTUDO" : "AFTER · 30 MIN STUDY"}
                </strong>
                <p style={{ color: "#fff", margin: 0, lineHeight: 1.8, fontSize: "1.1rem" }}>
                  Fatigue <b style={{ color: "#00d2b5" }}>4/10</b><br />
                  Headache <b style={{ color: "#00d2b5" }}>2/10</b>
                </p>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,.55)", fontSize: ".88rem", marginTop: 28, lineHeight: 1.5 }}>
              {isPt ? "A NOVA descreve o que foi registado. Não assume o que causou a mudança." : "NOVA describes what was recorded. It does not assume what caused the change."}
            </p>
          </div>
        </section>

        {/* RETURN TO LEARN */}
        <section style={{ padding: "120px 20px", background: "#060810" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 60, alignItems: "center" }}>
            <div>
              <span style={{ color: "#00d2b5", fontSize: ".75rem", fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase" }}>RETURN TO LEARN</span>
              <h2 style={{ color: "#fff", margin: "16px 0 20px", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {isPt ? "Progressão para aprender, informação para discutir." : "Progression for learning, information to discuss."}
              </h2>
              <p style={{ color: "rgba(255,255,255,.65)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: 28 }}>
                {isPt
                  ? "Acompanha atividades cognitivas, pausas, adaptações e sintomas sem a NOVA decidir se estás pronto para avançar."
                  : "Track cognitive activities, breaks, accommodations and symptoms without NOVA deciding whether you are ready to progress."}
              </p>
              <Link href="/return-to-learn" style={{ color: "#00d2b5", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>
                {isPt ? "Explorar Return to Learn →" : "Explore Return to Learn →"}
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {["Daily activities", "Light cognitive activity", "Modified learning", "Increasing academic load", "Full learning activities"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,.02)",
                    border: "1px solid rgba(255,255,255,.06)",
                    color: "rgba(255,255,255,.85)",
                    fontSize: ".95rem",
                    fontWeight: 500,
                  }}
                >
                  <strong style={{ color: "#00d2b5" }}>0{index + 1}</strong>
                  {isPt ? ["Atividades diárias", "Atividade cognitiva leve", "Aprendizagem adaptada", "Aumento da carga académica", "Atividades completas"][index] : item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PATTERNS & SUMMARY */}
        <section style={{ padding: "100px 20px", background: "#080b15" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <div style={{ padding: 36, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", borderRadius: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
                  {isPt ? "Padrões, não diagnósticos." : "Patterns, not diagnoses."}
                </h2>
                <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7, fontSize: ".98rem", marginBottom: 24 }}>
                  {isPt ? "Em 4 dos teus últimos 6 períodos de estudo mais longos, a fadiga foi registada mais alta depois." : "In 4 of your last 6 longer study sessions, fatigue was recorded higher afterward."}
                </p>
              </div>
              <div>
                <span style={{ color: "#00d2b5", fontWeight: 700, fontSize: ".95rem" }}>
                  {isPt ? "Ver entradas de suporte" : "View supporting entries"}
                </span>
                <small style={{ display: "block", color: "rgba(255,255,255,.45)", marginTop: 16, fontSize: ".8rem" }}>
                  {isPt ? "Observação baseada em dados registados, não uma conclusão médica." : "An observation from recorded data, not a medical conclusion."}
                </small>
              </div>
            </div>

            <div style={{ padding: 36, background: "rgba(0,210,181,.03)", border: "1px solid rgba(0,210,181,.2)", borderRadius: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
                  {isPt ? "Transforma entradas numa conversa mais clara." : "Turn your entries into a clearer conversation."}
                </h2>
                <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7, fontSize: ".98rem", marginBottom: 24 }}>
                  {isPt ? "Sintomas, sono, atividade, aprendizagem, padrões observados e perguntas para um profissional." : "Symptoms, sleep, activity, learning, observed patterns and questions for a professional."}
                </p>
              </div>
              <Link href="/summary" style={{ color: "#00d2b5", fontWeight: 800, fontSize: ".95rem", textDecoration: "none" }}>
                {isPt ? "Explorar Recovery Summary →" : "Explore Recovery Summary →"}
              </Link>
            </div>
          </div>
        </section>

        {/* BOUNDARIES & EVIDENCES */}
        <section style={{ padding: "100px 20px", background: "#060810" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 36 }}>
              {isPt ? "Construída com limites." : "Built with boundaries."}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {[
                ["No diagnosis", "NOVA does not diagnose concussion or other medical conditions."],
                ["No medical clearance", "NOVA does not determine readiness for high-risk activities."],
                ["Professional care matters", "NOVA supports conversations with professionals; it does not replace them."],
              ].map(([title, text]) => (
                <div key={title} style={{ padding: 28, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", borderRadius: 20 }}>
                  <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginTop: 0, marginBottom: 10 }}>
                    {isPt ? ({ "No diagnosis": "Sem diagnóstico", "No medical clearance": "Sem autorização médica", "Professional care matters": "O cuidado profissional importa" }[title] ?? title) : title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,.62)", lineHeight: 1.6, fontSize: ".9rem", margin: 0 }}>
                    {isPt
                      ? {
                          "No diagnosis": "A NOVA não diagnostica concussão nem outras condições médicas.",
                          "No medical clearance": "A NOVA não determina prontidão para atividades de alto risco.",
                          "Professional care matters": "A NOVA apoia conversas com profissionais; não os substitui.",
                        }[title] ?? text
                      : text}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,.5)", marginTop: 32, fontSize: ".85rem", lineHeight: 1.6 }}>
              {isPt
                ? "O desenho educativo e de acompanhamento é informado pelo Amsterdam Consensus Statement, Living Concussion Guidelines e PedsConcussion Living Guideline."
                : "NOVA's education and tracking design is informed by the Amsterdam Consensus Statement, Living Concussion Guidelines and PedsConcussion Living Guideline."}
            </p>
            <Link href="/evidence" style={{ color: "#00d2b5", fontWeight: 700, fontSize: ".95rem", textDecoration: "none" }}>
              {isPt ? "Ver evidência e fontes →" : "View evidence and sources →"}
            </Link>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section style={{ padding: "100px 20px", background: "#0a0e1a", textAlign: "center" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
              {isPt ? "Torna a tua recuperação mais fácil de compreender." : "Make your recovery easier to understand."}
            </h2>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 32 }}>
              {isPt ? "Regista o que importa. Observa o que mudou. Leva uma história mais clara para a conversa." : "Track what matters. See what you've recorded. Bring a clearer story to the conversation."}
            </p>
            <Link
              href="/recovery"
              style={{
                display: "inline-block",
                padding: "16px 36px",
                background: "#00d2b5",
                color: "#061018",
                borderRadius: 100,
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 8px 25px rgba(0, 210, 181, 0.25)",
              }}
            >
              {isPt ? "Explorar NOVA Recovery" : "Explore NOVA Recovery"}
            </Link>
          </div>
        </section>
        </>}
        </>
      </main>

      <Footer />
    </div>
  );
}
