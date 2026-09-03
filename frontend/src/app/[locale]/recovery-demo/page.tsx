"use client";

import { useParams } from "next/navigation";
import { PrivateShell } from "@/components/templates/private-shell";
import { usePreferredLocale } from "@/shared/lib/locale";

const days = [["Day 1", "Higher fatigue · limited study", "6 hours sleep"], ["Day 2", "Walking · fatigue 3 → 4", "15 minutes"], ["Day 3", "Study activity recorded", "20 minutes"], ["Day 4", "Observed pattern", "Longer study entries were followed by higher fatigue"], ["Day 5+", "Variation continues", "No clinical conclusion"]];
export default function RecoveryDemoPage() {
  const params = useParams();
  const locale = usePreferredLocale("private", (params?.locale as string) || "en");
  const isPt = locale === "pt";
  return <PrivateShell><main className="demo-page"><span className="demo-badge">DEMO DATA</span><h1>{isPt ? "Demonstração da Recovery" : "Recovery demo"}</h1><p>{isPt ? "Dados fictícios para demonstrar o fluxo. Não representam resultados clínicos reais." : "Fictional data to demonstrate the flow. It does not represent real clinical outcomes."}</p><div className="demo-days">{days.map(([day, detail, extra]) => <article key={day}><strong>{isPt ? ({ "Day 1": "Dia 1", "Day 2": "Dia 2", "Day 3": "Dia 3", "Day 4": "Dia 4", "Day 5+": "Dia 5+" }[day] ?? day) : day}</strong><h2>{detail}</h2><p>{extra}</p></article>)}</div></main><style jsx>{`.demo-page{max-width:850px;margin:0 auto;padding:12px 20px 48px}.demo-badge{display:inline-block;padding:6px 10px;border-radius:6px;background:#f59e0b;color:#201000;font-size:.7rem;font-weight:900;letter-spacing:.12em}.demo-page h1{margin:14px 0 8px}.demo-page>p{color:rgba(255,255,255,.65);margin-bottom:24px}.demo-days{display:grid;gap:10px}.demo-days article{padding:18px;border-left:3px solid #00d2b5;background:#0a0e1a;border-radius:0 10px 10px 0}.demo-days strong{color:#00d2b5;font-size:.8rem}.demo-days h2{font-size:1rem;margin:7px 0}.demo-days p{color:rgba(255,255,255,.65);margin:0;font-size:.85rem}`}</style></PrivateShell>;
}