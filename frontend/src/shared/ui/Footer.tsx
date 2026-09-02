"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function Footer() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isPt = locale === "pt";

  return (
    <footer id="footer" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", background: "#030408", padding: "32px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Link href={`/${locale}`} style={{ fontWeight: 800, fontSize: "1.4rem", color: "#ffffff", textDecoration: "none" }}>
              NOVA <span style={{ fontWeight: 300, fontSize: "1rem", opacity: 0.8 }}>psychology</span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.7, marginTop: 16, maxWidth: 280 }}>
              {isPt
                ? "Uma plataforma de bem-estar mental focada em privacidade, prevenção e inteligência artificial responsável."
                : "A privacy-first mental wellness platform built around prevention and responsible AI."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 20, fontSize: "0.85rem" }}>
            <Link href={`/${locale}/privacy`} className="footer-link">{isPt ? "Política de Privacidade" : "Privacy Policy"}</Link>
            <Link href={`/${locale}/terms`} className="footer-link">{isPt ? "Termos de Utilização" : "Terms of Use"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
