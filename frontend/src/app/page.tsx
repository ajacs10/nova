import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOVA — Mental Wellness Companion",
  description:
    "A privacy-first mental wellness platform built around responsible AI. Understand your well-being through your own patterns.",
};

/* ── icon helpers ───────────────────────────────────────────────────────── */
function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBrain() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5a4 4 0 00-4 4v1H7a3 3 0 000 6h1v1a4 4 0 008 0v-1h1a3 3 0 000-6h-1V9a4 4 0 00-4-4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17l4-8 4 6 3-4 4 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="9" fill="var(--nova-800)" />
      <path d="M5.5 9l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Navbar (static, no client hooks needed here) ────────────────────────── */
function Navbar() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(248,249,252,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border-light)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", height: 64, gap: 32 }}>
        {/* Wordmark */}
        <Link href="/" style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.04em", color: "var(--nova-900)", textDecoration: "none" }}>
          NOVA
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Privacy", href: "#privacy" },
          ].map((l) => (
            <a key={l.label} href={l.href} className="btn btn-ghost btn-sm" style={{ fontSize: "0.875rem" }}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div aria-label="Language" style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 4 }}>
            <Link href="/" className="btn btn-ghost btn-sm" aria-label="English">EN</Link>
            <Link href="/pt" className="btn btn-ghost btn-sm" aria-label="Português">PT</Link>
          </div>
          <Link href="/en/auth/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/en/auth/login" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </div>
    </header>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Check-in", href: "/en/check-in" },
        { label: "Insights", href: "/en/insights" },
        { label: "Dashboard", href: "/en/dashboard" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use", href: "#" },
      ],
    },
    {
      title: "Author",
      links: [
        { label: "GitHub", href: "https://github.com/ajacs10" },
        { label: "LinkedIn", href: "https://linkedin.com/in/ana-juliana-sobrinho/" },
      ],
    },
  ];

  return (
    <footer style={{ background: "var(--nova-950)", color: "var(--text-on-dark)", padding: "64px 0 32px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.04em", marginBottom: 12 }}>NOVA</div>
            <p style={{ color: "var(--nova-300)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 240 }}>
              A privacy-first mental wellness platform built around responsible AI.
            </p>
          </div>
          {/* Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div style={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nova-400)", marginBottom: 16 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: "0.75rem", color: "var(--nova-500)", maxWidth: 600 }}>
            NOVA is not a medical or diagnostic system and does not replace qualified mental health professionals.
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--nova-600)" }}>
            © 2025 NOVA · Ana Juliana Sobrinho
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  const stats = [
    { value: "100%", label: "Private by design" },
    { value: "0", label: "Medical claims" },
    { value: "AI", label: "With clear limits" },
  ];

  return (
    <section style={{ padding: "96px 0 80px", background: "linear-gradient(160deg, var(--nova-50) 0%, var(--accent-light) 50%, var(--nova-100) 100%)" }}>
      <div className="container">
        {/* Badge */}
        <div className="animate-fade-up" style={{ marginBottom: 28 }}>
          <span className="badge badge-subtle">
            🔒 Privacy-first · Responsible AI
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up delay-100"
          style={{ maxWidth: 640, marginBottom: 24, whiteSpace: "pre-line" }}
        >
          {`Understand your\nwell-being through\nyour own patterns`}
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-up delay-200"
          style={{ maxWidth: 520, fontSize: "1.125rem", marginBottom: 40 }}
        >
          NOVA helps you reflect on your daily routine, discover recurring patterns, and receive gentle, responsible AI-powered insights — without ever replacing a professional.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 72 }}>
          <Link href="/en/auth/login" className="btn btn-primary btn-lg">
            Start your first check-in →
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">
            Learn how it works
          </a>
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-up delay-400"
          style={{ display: "flex", gap: 48, flexWrap: "wrap" }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.04em", color: "var(--nova-800)" }}>{s.value}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <IconUser />,
      title: "Daily Check-in",
      desc: "Record how you feel, your sleep, energy and workload in under a minute.",
    },
    {
      num: "02",
      icon: <IconChart />,
      title: "Pattern Analysis",
      desc: "NOVA looks for relationships in your history — not assumptions, just observations.",
    },
    {
      num: "03",
      icon: <IconSpark />,
      title: "AI-assisted Insight",
      desc: "Responsible AI translates patterns into understandable, honest observations.",
    },
    {
      num: "04",
      icon: <IconBrain />,
      title: "Routine Suggestion",
      desc: "Small, realistic changes for you to experiment with. You're always in control.",
    },
  ];

  return (
    <section id="how-it-works" className="section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-muted" style={{ marginBottom: 20 }}>The flow</span>
          <h2>Simple, consistent, meaningful</h2>
          <p style={{ maxWidth: 480, margin: "16px auto 0" }}>
            Four steps that turn daily reflections into personal understanding.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {steps.map((step, i) => (
            <div key={step.num} className="card" style={{ position: "relative", overflow: "hidden" }}>
              {/* Step number watermark */}
              <div style={{ position: "absolute", top: -8, right: 12, fontSize: "4.5rem", fontWeight: 800, color: "var(--border-light)", lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>
                {step.num}
              </div>

              {/* Icon */}
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--nova-700)", marginBottom: 20 }}>
                {step.icon}
              </div>

              {/* Arrow connector (except last) */}
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: "50%", right: -14, transform: "translateY(-50%)", color: "var(--nova-300)", fontSize: "1.25rem", zIndex: 2 }}>
                  →
                </div>
              )}

              <h4 style={{ marginBottom: 8 }}>{step.title}</h4>
              <p style={{ fontSize: "0.9rem" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ───────────────────────────────────────────────────────────── */
function Features() {
  const cards = [
    {
      icon: <IconChart />,
      title: "Pattern Detection",
      desc: "NOVA analyses your history to surface recurring relationships between your habits and reported well-being.",
      items: ["Sleep vs energy correlation", "Workload fatigue patterns", "Routine consistency tracking"],
    },
    {
      icon: <IconBrain />,
      title: "Personalised Insights",
      desc: "Plain-language observations from your own data — periods of lower energy, sleep relationships, consistency patterns.",
      items: ["Plain language output", "Confidence-aware insights", "No false certainty"],
    },
    {
      icon: <IconSpark />,
      title: "Routine Support",
      desc: "When a pattern is found, NOVA suggests small, realistic experiments. You decide what to try.",
      items: ["Small, actionable steps", "You stay in control", "No prescriptions"],
    },
  ];

  return (
    <section id="features" className="section" style={{ background: "var(--bg-subtle)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-muted" style={{ marginBottom: 20 }}>Core features</span>
          <h2 style={{ whiteSpace: "pre-line" }}>{`Everything you need to\nunderstand your routine`}</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {cards.map((c) => (
            <div key={c.title} className="card" style={{ background: "white" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)", marginBottom: 20 }}>
                {c.icon}
              </div>
              <h3 style={{ marginBottom: 10 }}>{c.title}</h3>
              <p style={{ marginBottom: 20, fontSize: "0.9375rem" }}>{c.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {c.items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    <IconCheck />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Privacy ─────────────────────────────────────────────────────────────── */
function Privacy() {
  const points = [
    { icon: <IconLock />, title: "Data Minimisation", desc: "Only information needed for the functionality is collected. Nothing more." },
    { icon: <IconShield />, title: "No Diagnosis", desc: "Patterns in your data are not medical conclusions. NOVA never claims otherwise." },
    { icon: <IconUser />, title: "Human Agency", desc: "AI suggestions are suggestions. You remain fully responsible for your own choices." },
    { icon: <IconCheck />, title: "Least Privilege", desc: "Each component of the system only has access to what it strictly needs." },
  ];

  return (
    <section id="privacy" className="section" style={{ background: "var(--nova-950)", color: "white" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        {/* Left */}
        <div>
          <span className="badge badge-subtle" style={{ marginBottom: 24, background: "rgba(255,255,255,0.1)", color: "var(--nova-200)" }}>
            Privacy by design
          </span>
          <h2 style={{ color: "white", whiteSpace: "pre-line", marginBottom: 20 }}>{`Your data is yours.\nAlways.`}</h2>
          <p style={{ color: "var(--nova-300)", fontSize: "1.0625rem", marginBottom: 32 }}>
            Privacy isn&apos;t a feature added after the fact — it&apos;s how NOVA is built from the ground up.
          </p>
          <Link href="/en/auth/login" className="btn btn-primary">
            Get started →
          </Link>
        </div>

        {/* Right grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {points.map((p) => (
            <div key={p.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-lg)", padding: 20 }}>
              <div style={{ color: "var(--accent-mid)", marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: 6, color: "white" }}>{p.title}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--nova-400)", lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Responsible AI Banner ───────────────────────────────────────────────── */
function AiBanner() {
  return (
    <section className="section-sm" style={{ background: "var(--accent-light)", borderTop: "1px solid var(--border)" }}>
      <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
        <span className="badge badge-navy" style={{ marginBottom: 20 }}>Responsible AI</span>
        <h2 style={{ marginBottom: 16 }}>{`AI with clear,\nenforced boundaries`}</h2>
        <p style={{ fontSize: "1.0625rem", marginBottom: 24 }}>
          NOVA uses AI to identify patterns and generate supportive insights. It does <strong>not</strong> diagnose, prescribe, or replace qualified professionals.
        </p>
        <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 10, background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", textAlign: "left", maxWidth: 560 }}>
          <IconShield />
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
            <strong>Disclaimer:</strong> NOVA is not a medical or diagnostic system and does not replace qualified mental health professionals.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */
function CallToAction() {
  return (
    <section className="section" style={{ background: "var(--nova-900)" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2 style={{ color: "white", marginBottom: 16 }}>Ready to understand yourself better?</h2>
        <p style={{ color: "var(--nova-300)", marginBottom: 40, fontSize: "1.125rem" }}>
          Start your first check-in today — it takes less than a minute.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/en/auth/login" className="btn btn-primary btn-lg" style={{ background: "white", color: "var(--nova-900)" }}>
            Get started — it&apos;s free
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg" style={{ borderColor: "rgba(255,255,255,0.2)", color: "var(--nova-200)" }}>
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Privacy />
        <AiBanner />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
