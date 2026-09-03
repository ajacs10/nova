"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isPt = locale === "pt";

  return (
    <footer id="footer" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", background: "#030408", padding: "56px 0 28px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 2fr) repeat(3, minmax(130px, 1fr))", gap: 40, paddingBottom: 44 }}>
          <div>
            <Link href={`/${locale}`} aria-label="NOVA Psychology" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: "1.4rem", color: "#ffffff", textDecoration: "none" }}>
              <Image src="/icons/nova-icon-192.svg" alt="" width={38} height={38} />
              <span>NOVA <span style={{ fontWeight: 300, fontSize: "1rem", opacity: 0.8 }}>psychology</span></span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.7, marginTop: 16, maxWidth: 280 }}>
              {isPt
                ? "Uma plataforma de bem-estar mental focada em privacidade, prevenção e inteligência artificial responsável."
                : "A privacy-first mental wellness platform built around prevention and responsible AI."}
            </p>
          </div>

          <div>
            <strong style={{ display: "block", marginBottom: 16, color: "#b9c3db", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{isPt ? "Plataforma" : "Platform"}</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: "0.85rem" }}>
              <Link href={`/${locale}`} className="footer-link">{isPt ? "Início" : "Home"}</Link>
              <Link href={`/${locale}/auth/register`} className="footer-link">{isPt ? "Criar conta" : "Create account"}</Link>
              <Link href={`/${locale}/auth/login`} className="footer-link">{isPt ? "Iniciar sessão" : "Sign in"}</Link>
            </div>
          </div>

          <div>
            <strong style={{ display: "block", marginBottom: 16, color: "#b9c3db", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{isPt ? "Informação" : "Information"}</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: "0.85rem" }}>
              <Link href={`/${locale}/privacy`} className="footer-link">{isPt ? "Privacidade" : "Privacy"}</Link>
              <Link href={`/${locale}/security`} className="footer-link">{isPt ? "Segurança" : "Security"}</Link>
              <Link href={`/${locale}/terms`} className="footer-link">{isPt ? "Termos de utilização" : "Terms of use"}</Link>
              <Link href="/recovery" className="footer-link">{isPt ? "Recovery" : "Recovery"}</Link>
              <Link href="/summary" className="footer-link">{isPt ? "Resumo" : "Summary"}</Link>
              <Link href="/safety" className="footer-link">{isPt ? "Segurança" : "Safety"}</Link>
              <Link href="/evidence" className="footer-link">{isPt ? "Evidência" : "Evidence"}</Link>
            </div>
          </div>

          <div>
            <strong style={{ display: "block", marginBottom: 16, color: "#b9c3db", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{isPt ? "Contacto" : "Contact"}</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: "0.85rem" }}>
              <a href="mailto:info@novapsychology.ao" className="footer-link">info@novapsychology.ao</a>
              <span style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{isPt ? "Estamos aqui para ouvir." : "We are here to listen."}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 24 }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.45)", lineHeight: 1.6, maxWidth: 720, margin: 0 }}>
            {isPt
              ? "A NOVA é uma ferramenta de acompanhamento de bem-estar e não substitui diagnóstico, tratamento ou aconselhamento profissional."
              : "NOVA is a well-being tracking tool and does not replace diagnosis, treatment, or professional advice."}
          </p>
          <p style={{ fontSize: "0.75rem", color: "#6378a3", margin: "16px 0 0" }}>
            © 2026 NOVA Psychology · {isPt ? "Todos os direitos reservados" : "All rights reserved"} · {isPt ? "Criado por" : "Created by"}{" "}
            <a href="https://www.anasobrinho.me/" target="_blank" rel="noreferrer" className="footer-link">
              Ana Sobrinho
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
