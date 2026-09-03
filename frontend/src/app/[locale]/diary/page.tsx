"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays, Moon, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { PrivateShell } from "@/components/templates/private-shell";
import { getCheckIns, getUserFriendlyError } from "@/shared/lib/api";
import type { WellbeingEntry } from "@/entities/check-in/model/types";

function getSupportMessage(entry: WellbeingEntry, isPt: boolean) {
  if (entry.sleep < 6) {
    return isPt
      ? "Dormiste poucas horas neste registo. Experimenta proteger um período de descanso e observa como te sentes no próximo check-in."
      : "You recorded fewer sleep hours here. Try protecting a period of rest and notice how you feel at your next check-in.";
  }
  if (entry.workload >= 8) {
    return isPt
      ? "A carga deste dia foi elevada. Uma pausa curta entre tarefas pode ajudar-te a ajustar o ritmo."
      : "Your workload was high on this day. A short pause between tasks may help you adjust your pace.";
  }
  if (entry.energy <= 4) {
    return isPt
      ? "A tua energia estava mais baixa neste registo. Observa que pequenas ações tornam o próximo bloco mais leve."
      : "Your energy was lower in this entry. Notice which small actions make the next part of the day feel lighter.";
  }
  return isPt
    ? "Este registo mostra um dia relativamente estável. Continua a observar o que contribui para esse equilíbrio."
    : "This entry shows a relatively steady day. Keep noticing what may support that balance.";
}

function getMoodImage(mood: number) {
  const images = [
    "/mascotes/mascote_exaustao_v2.svg",
    "/mascotes/mascote_cansaco_ligeiro_v2.svg",
    "/mascotes/mascote_equilibrado_v2.svg",
    "/mascotes/mascote_bom_v2.svg",
    "/mascotes/mascote_excelente_v2.svg",
  ];
  return images[Math.max(0, Math.min(4, mood - 1))];
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<WellbeingEntry[]>([]);
  const [selected, setSelected] = useState<WellbeingEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const isPt = locale === "pt";

  useEffect(() => {
    const pathLocale = window.location.pathname.split("/")[1];
    getCheckIns()
      .then(setEntries)
      .catch((requestError: unknown) => setError(getUserFriendlyError(requestError, pathLocale !== "en")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PrivateShell>
      <div className="diary-page">
        <header className="diary-heading">
          <div>
            <p className="eyebrow"><BookOpen size={15} /> {isPt ? "Registos privados" : "Private entries"}</p>
            <h1>{isPt ? "Meu Diário" : "My Diary"}</h1>
            <p>{isPt ? "Revê o que escreveste e percebe o contexto por trás dos teus dados." : "Review what you wrote and understand the context behind your data."}</p>
          </div>
          <span className="entry-count">{entries.length} {isPt ? "registos" : "entries"}</span>
        </header>

        {loading && <div className="state">{isPt ? "A carregar os teus registos..." : "Loading your entries..."}</div>}
        {error && <div className="state error">{error}</div>}
        {!loading && !error && entries.length === 0 && (
          <div className="empty-state">
            <BookOpen size={30} />
            <h2>{isPt ? "O teu diário começa no primeiro check-in" : "Your diary starts with your first check-in"}</h2>
            <p>{isPt ? "Escreve uma nota no próximo check-in para guardares o contexto do teu dia." : "Write a note in your next check-in to keep the context of your day."}</p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="diary-layout">
            <section className="entry-list" aria-label={isPt ? "Lista de registos" : "Entry list"}>
              {entries.map((entry) => (
                <button key={entry.id} className={`entry-card ${selected?.id === entry.id ? "active" : ""}`} onClick={() => setSelected(entry)}>
                  <span className="entry-card-top"><Image src={getMoodImage(entry.mood)} alt="" width={42} height={42} /><span className="entry-date"><CalendarDays size={15} /> {new Date(entry.createdAt).toLocaleDateString(isPt ? "pt-PT" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                  <span className="entry-preview">{entry.note?.trim() || (isPt ? "Sem nota escrita" : "No written note")}</span>
                  <span className="entry-metrics">{entry.sleep}h sleep · {entry.energy}/10 energy · {entry.mood}/5 mood</span>
                </button>
              ))}
            </section>

            <section className="entry-detail" aria-live="polite">
              {selected ? (
                <>
                  <div className="detail-top"><button className="back-button" onClick={() => setSelected(null)}><ArrowLeft size={16} /> {isPt ? "Todos os registos" : "All entries"}</button><span>{new Date(selected.createdAt).toLocaleDateString(isPt ? "pt-PT" : "en-US")}</span></div>
                  <h2>{isPt ? "O que escreveste" : "What you wrote"}</h2>
                  <Image src={getMoodImage(selected.mood)} alt={isPt ? "Avatar correspondente ao humor registado" : "Avatar matching the recorded mood"} width={110} height={62} style={{ objectFit: "contain", marginBottom: 14 }} />
                  <p className="note-text">{selected.note?.trim() || (isPt ? "Não adicionaste uma nota a este check-in." : "You did not add a note to this check-in.")}</p>
                  <div className="metric-row"><span><Moon size={16} /> {selected.sleep}h</span><span><Zap size={16} /> {selected.energy}/10</span><span><Sparkles size={16} /> {selected.mood}/5</span></div>
                  <div className="support-box"><strong>{isPt ? "Uma reflexão para este dia" : "A reflection for this day"}</strong><p>{getSupportMessage(selected, isPt)}</p><small>{isPt ? "É uma sugestão de reflexão, não uma conclusão médica." : "This is a reflection prompt, not a medical conclusion."}</small></div>
                </>
              ) : <div className="detail-placeholder"><Sparkles size={24} /><p>{isPt ? "Seleciona um registo para o abrir." : "Select an entry to open it."}</p></div>}
            </section>
          </div>
        )}
      </div>
      <style jsx>{`
        .diary-page { max-width: 1120px; margin: 0 auto; }
        .diary-heading { display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; margin-bottom: 34px; }
        .eyebrow { display: flex; align-items: center; gap: 7px; color: #00d2b5; font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
        h1 { margin: 12px 0 8px; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: 0; }
        .diary-heading p:not(.eyebrow) { color: rgba(255,255,255,.6); margin: 0; }
        .entry-count { color: rgba(255,255,255,.55); font-size: .82rem; }
        .diary-layout { display: grid; grid-template-columns: minmax(260px, .9fr) minmax(0, 1.3fr); gap: 24px; }
        .entry-list { display: flex; flex-direction: column; gap: 10px; }
        .entry-card { text-align: left; border: 1px solid rgba(255,255,255,.1); background: #0a0e1a; color: #fff; padding: 18px; border-radius: 6px; cursor: pointer; }
        .entry-card:hover, .entry-card.active { border-color: #00d2b5; background: #0d1720; }
        .entry-card-top { display: flex; align-items: center; gap: 12px; }
        .entry-date, .entry-metrics { display: flex; align-items: center; gap: 7px; color: rgba(255,255,255,.48); font-size: .75rem; }
        .entry-preview { display: block; margin: 12px 0; color: rgba(255,255,255,.88); line-height: 1.45; }
        .entry-detail { min-height: 390px; padding: 28px; border: 1px solid rgba(255,255,255,.1); background: #0a0e1a; border-radius: 6px; }
        .detail-top { display: flex; justify-content: space-between; color: rgba(255,255,255,.45); font-size: .78rem; }
        .back-button { display: inline-flex; align-items: center; gap: 7px; padding: 0; border: 0; background: none; color: #00d2b5; cursor: pointer; }
        .entry-detail h2 { margin: 34px 0 12px; }
        .note-text { white-space: pre-wrap; color: rgba(255,255,255,.78); line-height: 1.7; }
        .metric-row { display: flex; gap: 18px; flex-wrap: wrap; margin: 24px 0; color: rgba(255,255,255,.7); font-size: .8rem; }
        .metric-row span { display: flex; align-items: center; gap: 6px; }
        .support-box { padding: 18px; border-left: 3px solid #00d2b5; background: rgba(0,210,181,.07); }
        .support-box p { color: rgba(255,255,255,.7); line-height: 1.6; margin: 8px 0; }
        .support-box small { color: rgba(255,255,255,.4); }
        .state, .empty-state, .detail-placeholder { display: grid; place-items: center; min-height: 280px; text-align: center; color: rgba(255,255,255,.6); }
        .empty-state { border: 1px dashed rgba(255,255,255,.18); padding: 28px; }
        .empty-state svg, .detail-placeholder svg { color: #00d2b5; }
        .empty-state h2 { color: #fff; margin: 16px 0 8px; }
        .error { color: #fca5a5; }
        @media (max-width: 760px) { .diary-heading { align-items: flex-start; flex-direction: column; } .diary-layout { grid-template-columns: 1fr; } .entry-detail { min-height: 260px; } }
      `}</style>
    </PrivateShell>
  );
}
