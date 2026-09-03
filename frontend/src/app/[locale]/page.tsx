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
      {/* Wrapper Fixo para a Navbar que esconde tudo por baixo */}
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
            padding: "clamp(40px, 6vh, 80px) clamp(20px, 5vw, 40px)",
            backgroundImage: `linear-gradient(to bottom, rgba(6, 8, 16, 0.45) 0%, rgba(6, 8, 16, 0.75) 60%, rgba(6, 8, 16, 1) 100%), url('/iamgem1.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            boxSizing: "border-box",
          }}
        >
          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              maxWidth: 820,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <span style={{ display: "inline-block", color: "#00d2b5", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", marginBottom: 16 }}>NOVA RECOVERY</span>
            <h1
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: 20,
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.6)",
              }}
            >
              {isPt ? "Torna a tua recuperação mais fácil de compreender." : "Make recovery easier to understand."}
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(255, 255, 255, 0.85)",
                maxWidth: 760,
                margin: "0 auto 36px",
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
              }}
            >
              {isPt
                ? "Acompanha sintomas, sono, atividades e mudanças diárias ao longo do tempo — e transforma experiências dispersas numa história de recuperação mais clara."
                : "Track symptoms, sleep, activities and daily changes over time — and turn scattered experiences into a clearer recovery story."}
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
              <Link
                href={`/${locale}/auth/login`}
                style={{
                  background: "#ffffff",
                  color: "#060810",
                  padding: "14px 32px",
                  borderRadius: "100px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {isPt ? "Explorar NOVA Recovery" : "Explore NOVA Recovery"}
              </Link>
              <a href="#recovery-workflow" style={{ color: "#ffffff", padding: "14px 22px", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                {isPt ? "Ver como funciona" : "See how it works"}
              </a>
            </div>
            <p style={{ maxWidth: 560, margin: "22px auto 0", color: "rgba(255,255,255,0.62)", fontSize: "0.78rem", lineHeight: 1.5 }}>
              {isPt ? "A NOVA é uma ferramenta de acompanhamento e educação. Não diagnostica, trata nem fornece autorização médica." : "NOVA is a tracking and education tool. It does not diagnose, treat, or provide medical clearance."}
            </p>
          </div>
        </section>

        {/* SECÇÃO CARROSSEL DE VÍDEOS DE BEM-ESTAR */}
        <section
          id="features"
          style={{
            padding: "80px 0 100px",
            background: "#060810",
            position: "relative",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div className="container" style={{ textAlign: "center", marginBottom: 40, padding: "0 20px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: 12 }}>
              {isPt ? "Explora os teus padrões e experiências." : "Explore your patterns and experiences."}
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255, 255, 255, 0.65)", maxWidth: 620, margin: "0 auto" }}>
              {isPt
                ? "Descobre cada tema em movimento. Clica num cartão para ver a demonstração e perceber como a NOVA pode apoiar o teu bem-estar diário."
                : "Discover each theme in motion. Click a card to watch the demonstration and see how NOVA can support your daily well-being."}
            </p>
          </div>

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
            <CoverflowCarousel slides={wellnessVideoSlides} />
          </div>
        </section>

        <section id="recovery-workflow" style={{ padding: "96px 20px", background: "#080b15" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <span style={{ color: "#00d2b5", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em" }}>NOVA RECOVERY</span>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 4vw, 3.2rem)", margin: "12px 0", maxWidth: 650 }}>{isPt ? "Uma história de recuperação mais clara." : "A clearer recovery story."}</h2>
            <p style={{ color: "rgba(255,255,255,.65)", maxWidth: 620, lineHeight: 1.7 }}>{isPt ? "Acompanha o que sentes, compreende o que registaste, organiza a informação e leva uma história mais clara para as tuas conversas." : "Track what you feel, understand what you recorded, organize the information, and bring a clearer story to conversations."}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginTop: 40, background: "rgba(255,255,255,.12)" }}>
              {[["TRACK", isPt ? "Sintomas, sono, atividade e aprendizagem." : "Symptoms, sleep, activity and learning."], ["UNDERSTAND", isPt ? "Timeline e padrões observados." : "Timeline and observed patterns."], ["ORGANIZE", isPt ? "Resumo de recuperação." : "Recovery Summary."], ["COMMUNICATE", isPt ? "Informação para conversas com profissionais." : "Information for conversations with professionals."]].map(([title, text], index) => <div key={title} style={{ padding: "24px 20px", background: "#0d1220" }}><strong style={{ color: "#00d2b5", fontSize: ".72rem" }}>0{index + 1} · {title}</strong><p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.55, fontSize: ".88rem" }}>{text}</p></div>)}
            </div>
          </div>
        </section>

        <section style={{ padding: "96px 20px", background: "#060810" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {[["Recovery Check-in", isPt ? "Regista sintomas, sono e como te sentes hoje." : "Record symptoms, sleep and how you're doing today.", "/recovery"], ["Activity Before / After", isPt ? "Acompanha atividades e o que registaste antes e depois." : "Track activities and what you recorded before and after.", "/recovery"], ["Recovery Timeline", isPt ? "Vê os teus registos ao longo do tempo." : "See your recovery entries over time.", "/recovery"], ["Observed Patterns", isPt ? "Explora padrões repetidos nos teus próprios dados." : "Explore repeated patterns in your own recorded data.", "/insights"], ["Return to Learn", isPt ? "Regista aprendizagem, pausas e adaptações." : "Track learning activities, breaks and accommodations.", "/return-to-learn"], ["Recovery Summary", isPt ? "Organiza informação para conversas com profissionais." : "Turn entries into a structured conversation summary.", "/summary"]].map(([title, text, href]) => <Link key={title} href={href} style={{ padding: 26, border: "1px solid rgba(255,255,255,.1)", background: "#0a0e1a", color: "#fff", textDecoration: "none", borderRadius: 12 }}><span style={{ color: "#00d2b5", fontSize: ".72rem", fontWeight: 800 }}>NOVA RECOVERY</span><h3 style={{ margin: "10px 0 7px", fontSize: "1.2rem" }}>{title}</h3><p style={{ margin: 0, color: "rgba(255,255,255,.62)", lineHeight: 1.6, fontSize: ".88rem" }}>{text}</p></Link>)}
          </div>
        </section>

        <section style={{ padding: "86px 20px", background: "#0a0e1a" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <span style={{ color: "#f59e0b", fontSize: ".7rem", fontWeight: 900, letterSpacing: ".14em" }}>DEMO DATA</span>
            <h2 style={{ color: "#fff", margin: "12px 0 26px" }}>{isPt ? "O que foi registado antes e depois" : "What was recorded before and after"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
              <div style={{ padding: 24, border: "1px solid rgba(255,255,255,.1)" }}><strong style={{ color: "#00d2b5" }}>{isPt ? "ANTES" : "BEFORE"}</strong><p style={{ color: "#fff" }}>Fatigue <b>3/10</b><br/>Headache <b>2/10</b></p></div><span style={{ color: "#00d2b5", fontSize: "1.5rem" }}>→</span><div style={{ padding: 24, border: "1px solid rgba(255,255,255,.1)" }}><strong style={{ color: "#00d2b5" }}>{isPt ? "DEPOIS · 30 MIN DE ESTUDO" : "AFTER · 30 MIN STUDY"}</strong><p style={{ color: "#fff" }}>Fatigue <b>4/10</b><br/>Headache <b>2/10</b></p></div>
            </div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".82rem", marginTop: 18 }}>{isPt ? "A NOVA descreve o que foi registado. Não assume o que causou a mudança." : "NOVA describes what was recorded. It does not assume what caused the change."}</p>
          </div>
        </section>

        <section style={{ padding: "96px 20px", background: "#060810" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div><span style={{ color: "#00d2b5", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".14em" }}>RETURN TO LEARN</span><h2 style={{ color: "#fff", margin: "12px 0" }}>{isPt ? "Progressão para aprender, informação para discutir." : "Progression for learning, information to discuss."}</h2><p style={{ color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>{isPt ? "Acompanha atividades cognitivas, pausas, adaptações e sintomas sem a NOVA decidir se estás pronto para avançar." : "Track cognitive activities, breaks, accommodations and symptoms without NOVA deciding whether you are ready to progress."}</p><Link href="/return-to-learn" style={{ color: "#00d2b5", fontWeight: 800 }}>{isPt ? "Explorar Return to Learn" : "Explore Return to Learn"}</Link></div>
            <div style={{ display: "grid", gap: 8 }}>{["Daily activities", "Light cognitive activity", "Modified learning", "Increasing academic load", "Full learning activities"].map((item, index) => <div key={item} style={{ display: "flex", gap: 14, alignItems: "center", padding: "13px 16px", borderLeft: "2px solid #00d2b5", background: "#0a0e1a", color: "rgba(255,255,255,.78)" }}><strong style={{ color: "#00d2b5" }}>0{index + 1}</strong>{isPt ? ["Atividades diárias", "Atividade cognitiva leve", "Aprendizagem adaptada", "Aumento da carga académica", "Atividades completas"][index] : item}</div>)}</div>
          </div>
        </section>

        <section style={{ padding: "84px 20px", background: "#080b15" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ padding: 28, border: "1px solid rgba(255,255,255,.1)" }}><h2 style={{ color: "#fff" }}>{isPt ? "Padrões, não diagnósticos." : "Patterns, not diagnoses."}</h2><p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7 }}>{isPt ? "Em 4 dos teus últimos 6 períodos de estudo mais longos, a fadiga foi registada mais alta depois." : "In 4 of your last 6 longer study sessions, fatigue was recorded higher afterward."}</p><span style={{ color: "#00d2b5", fontWeight: 700 }}>{isPt ? "Ver entradas de suporte" : "View supporting entries"}</span><small style={{ display: "block", color: "rgba(255,255,255,.5)", marginTop: 18 }}>{isPt ? "Observação baseada em dados registados, não uma conclusão médica." : "An observation from recorded data, not a medical conclusion."}</small></div>
            <div style={{ padding: 28, background: "#0a0e1a", border: "1px solid rgba(0,210,181,.25)" }}><h2 style={{ color: "#fff" }}>{isPt ? "Transforma entradas numa conversa mais clara." : "Turn your entries into a clearer conversation."}</h2><p style={{ color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>{isPt ? "Sintomas, sono, atividade, aprendizagem, padrões observados e perguntas para um profissional." : "Symptoms, sleep, activity, learning, observed patterns and questions for a professional."}</p><Link href="/summary" style={{ color: "#00d2b5", fontWeight: 800 }}>{isPt ? "Explorar Recovery Summary" : "Explore Recovery Summary"}</Link></div>
          </div>
        </section>

        <section style={{ padding: "80px 20px", background: "#060810" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}><h2 style={{ color: "#fff" }}>{isPt ? "Construída com limites." : "Built with boundaries."}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>{[["No diagnosis", "NOVA does not diagnose concussion or other medical conditions."], ["No medical clearance", "NOVA does not determine readiness for high-risk activities."], ["Professional care matters", "NOVA supports conversations with professionals; it does not replace them."]].map(([title, text]) => <div key={title} style={{ padding: 22, borderTop: "2px solid #00d2b5", background: "#0a0e1a" }}><h3 style={{ color: "#fff", fontSize: "1rem" }}>{isPt ? ({ "No diagnosis": "Sem diagnóstico", "No medical clearance": "Sem autorização médica", "Professional care matters": "O cuidado profissional importa" }[title] ?? title) : title}</h3><p style={{ color: "rgba(255,255,255,.62)", lineHeight: 1.6, fontSize: ".86rem" }}>{isPt ? ({ "No diagnosis": "A NOVA não diagnostica concussão nem outras condições médicas.", "No medical clearance": "A NOVA não determina prontidão para atividades de alto risco.", "Professional care matters": "A NOVA apoia conversas com profissionais; não os substitui." }[title] ?? text) : text}</p></div>)}</div><p style={{ color: "rgba(255,255,255,.55)", marginTop: 24, fontSize: ".82rem" }}>{isPt ? "O desenho educativo e de acompanhamento é informado pelo Amsterdam Consensus Statement, Living Concussion Guidelines e PedsConcussion Living Guideline." : "NOVA's education and tracking design is informed by the Amsterdam Consensus Statement, Living Concussion Guidelines and PedsConcussion Living Guideline."}</p><Link href="/evidence" style={{ color: "#00d2b5", fontWeight: 800 }}>{isPt ? "Ver evidência e fontes" : "View evidence and sources"}</Link></div>
        </section>

        <section style={{ padding: "64px 20px", background: "#0a0e1a", textAlign: "center" }}><h2 style={{ color: "#fff" }}>{isPt ? "Torna a tua recuperação mais fácil de compreender." : "Make your recovery easier to understand."}</h2><p style={{ color: "rgba(255,255,255,.62)" }}>{isPt ? "Regista o que importa. Observa o que mudou. Leva uma história mais clara para a conversa." : "Track what matters. See what you've recorded. Bring a clearer story to the conversation."}</p><Link href="/recovery" style={{ display: "inline-block", marginTop: 12, padding: "13px 24px", background: "#00d2b5", color: "#061018", borderRadius: 999, fontWeight: 800, textDecoration: "none" }}>{isPt ? "Explorar NOVA Recovery" : "Explore NOVA Recovery"}</Link></section>
      </main>

      <Footer />
    </div>
  );
}