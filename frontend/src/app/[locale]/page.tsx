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
              {isPt ? "Compreende a tua mente. Cuida do teu ritmo." : "Understand your mind. Protect your rhythm."}
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
                ? "A NOVA ajuda-te a observar o teu sono, a energia, a carga emocional e o teu dia a dia com clareza para que possas tomar decisões mais conscientes, mais calmas e mais sustentáveis."
                : "NOVA helps you observe your sleep, energy, emotional load, and daily rhythm with clarity so you can make calmer, wiser, and more sustainable decisions."}
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
                {isPt ? "Começar Agora" : "Get Started Now"}
              </Link>
            </div>
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
      </main>

      <Footer />
    </div>
  );
}