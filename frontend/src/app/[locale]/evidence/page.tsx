"use client";

import { useParams } from "next/navigation";
import { BookOpen, ExternalLink } from "lucide-react";
import { PrivateShell } from "@/components/templates/private-shell";
import { usePreferredLocale } from "@/shared/lib/locale";

const sources = [
  { title: "Consensus statement on concussion in sport — Amsterdam 2022", href: "https://bjsm.bmj.com/content/57/11/695" },
  { title: "Living Concussion Guidelines", href: "https://concussionsontario.org/" },
  { title: "PedsConcussion Living Guideline", href: "https://pedsconcussion.com/" },
];

export default function EvidencePage() {
  const params = useParams();
  const locale = usePreferredLocale("private", (params?.locale as string) || "en");
  const isPt = locale === "pt";

  return (
    <PrivateShell>
      <main className="evidence-page">
        <span className="evidence-kicker">NOVA · {isPt ? "BASE CIENTÍFICA" : "RESEARCH FOUNDATION"}</span>
        <h1>{isPt ? "Evidência e fontes" : "Evidence & sources"}</h1>
        <p className="evidence-lead">{isPt ? "A NOVA organiza informação autorrelatada sobre sintomas, sono e atividades. Não diagnostica, não indica progressão e não substitui um profissional de saúde." : "NOVA organizes self-reported information about symptoms, sleep, and activities. It does not diagnose, determine progression, or replace a healthcare professional."}</p>
        <section className="evidence-boundary">
          <BookOpen size={22} />
          <p>{isPt ? "As fontes abaixo orientam a forma como apresentamos acompanhamento, adaptações temporárias e conversas com profissionais — não são usadas para gerar aconselhamento médico personalizado." : "The sources below guide how we present tracking, temporary adaptations, and conversations with professionals — they are not used to generate personalized medical advice."}</p>
        </section>
        <section className="source-list" aria-label={isPt ? "Fontes científicas" : "Scientific sources"}>
          {sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer"><span>{source.title}</span><ExternalLink size={17} aria-hidden="true" /></a>)}
        </section>
      </main>
      <style jsx>{`
        .evidence-page{max-width:880px;margin:0 auto;padding:12px 20px 48px}.evidence-kicker{color:#00d2b5;font-size:.7rem;font-weight:800;letter-spacing:.14em}.evidence-page h1{margin:8px 0 12px;font-size:2.1rem}.evidence-lead{max-width:720px;color:rgba(255,255,255,.68);line-height:1.65}.evidence-boundary{display:flex;gap:14px;margin:28px 0 16px;padding:20px;border:1px solid rgba(0,210,181,.24);border-radius:12px;background:rgba(0,210,181,.055)}.evidence-boundary svg{flex:0 0 auto;color:#00d2b5}.evidence-boundary p{margin:0;color:rgba(255,255,255,.76);line-height:1.6}.source-list{display:grid;gap:10px}.source-list a{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:#0a0e1a;color:#fff;line-height:1.45;text-decoration:none}.source-list a:hover,.source-list a:focus-visible{border-color:#00d2b5;color:#00d2b5;outline:none}@media(max-width:600px){.evidence-page h1{font-size:1.75rem}}
      `}</style>
    </PrivateShell>
  );
}
