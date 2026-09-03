"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Activity, CheckCircle2, FileText, ShieldAlert } from "lucide-react";
import { PrivateShell } from "@/components/templates/private-shell";
import { usePreferredLocale } from "@/shared/lib/locale";
import { createActivityEntry, createRecoveryEntry, getActivityEntries, getRecoveryEntries, type ActivityEntry, type RecoveryEntry } from "@/shared/lib/api";

const symptoms = [
  ["headache", "Headache", "Dor de cabeça"],
  ["dizziness", "Dizziness", "Tontura"],
  ["fatigue", "Fatigue", "Fadiga"],
  ["nausea", "Nausea", "Náusea"],
  ["lightSensitivity", "Sensitivity to light", "Sensibilidade à luz"],
  ["noiseSensitivity", "Sensitivity to noise", "Sensibilidade ao som"],
  ["concentration", "Concentration difficulty", "Dificuldade de concentração"],
  ["memory", "Memory difficulty", "Dificuldade de memória"],
  ["balance", "Balance symptoms", "Sintomas de equilíbrio"],
  ["sleepDifficulty", "Sleep difficulty", "Dificuldade em dormir"],
] as const;

type SymptomKey = typeof symptoms[number][0];
type SymptomForm = Record<SymptomKey, number>;
const initialSymptoms = Object.fromEntries(symptoms.map(([key]) => [key, 0])) as SymptomForm;

export default function RecoveryPage() {
  const params = useParams();
  const locale = usePreferredLocale("private", (params?.locale as string) || "en");
  const isPt = locale === "pt";
  const [form, setForm] = React.useState<SymptomForm>(initialSymptoms);
  const [sleepHours, setSleepHours] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [activity, setActivity] = React.useState("walking");
  const [duration, setDuration] = React.useState(15);
  const [before, setBefore] = React.useState({ headache: 0, fatigue: 0, dizziness: 0 });
  const [after, setAfter] = React.useState({ headache: 0, fatigue: 0, dizziness: 0 });
  const [activityNote, setActivityNote] = React.useState("");
  const [entries, setEntries] = React.useState<RecoveryEntry[]>([]);
  const [activities, setActivities] = React.useState<ActivityEntry[]>([]);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [nextEntries, nextActivities] = await Promise.all([getRecoveryEntries(), getActivityEntries()]);
      setEntries(nextEntries); setActivities(nextActivities);
    } finally { setLoading(false); }
  }, []);
  React.useEffect(() => {
    const timeout = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadData]);

  async function saveRecovery(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    await createRecoveryEntry({ ...form, sleepHours, note });
    setMessage(isPt ? "Registo de recuperação guardado." : "Recovery entry saved.");
    setForm(initialSymptoms); setSleepHours(0); setNote(""); await loadData();
  }

  async function saveActivity(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    await createActivityEntry({ activity, durationMinutes: duration, headacheBefore: before.headache, fatigueBefore: before.fatigue, dizzinessBefore: before.dizziness, headacheAfter: after.headache, fatigueAfter: after.fatigue, dizzinessAfter: after.dizziness, note: activityNote });
    setMessage(isPt ? "Atividade guardada." : "Activity saved."); await loadData();
  }

  const label = (item: typeof symptoms[number]) => isPt ? item[2] : item[1];
  return <PrivateShell>
    <div className="recovery-page">
      <header className="recovery-heading"><span className="recovery-eyebrow">NOVA RECOVERY</span><h1>{isPt ? "Como estão as coisas a mudar?" : "How are things changing?"}</h1><p>{isPt ? "Organiza os teus registos e observa mudanças ao longo do tempo." : "Organize your entries and observe changes over time."}</p></header>
      <div className="safety-notice"><ShieldAlert size={20} /><span>{isPt ? "A NOVA organiza informação autorrelatada. Não diagnostica, não confirma recuperação e não substitui profissionais de saúde." : "NOVA organizes self-reported information. It does not diagnose, confirm recovery, or replace healthcare professionals."}</span></div>
      {message && <p className="recovery-message" role="status"><CheckCircle2 size={17} />{message}</p>}
      <div className="recovery-grid">
        <section className="recovery-panel"><div className="panel-heading"><Activity size={20} /><div><span>{isPt ? "CHECK-IN DIÁRIO" : "DAILY CHECK-IN"}</span><h2>{isPt ? "Sintomas e funcionamento" : "Symptoms and daily functioning"}</h2></div></div><form onSubmit={saveRecovery}><div className="symptom-grid">{symptoms.map((item) => <label key={item[0]}><span>{label(item)}</span><output>{form[item[0]]}/10</output><input aria-label={`${label(item)} 0 to 10`} type="range" min="0" max="10" value={form[item[0]]} onChange={(event) => setForm({ ...form, [item[0]]: Number(event.target.value) })} /></label>)}</div><label className="field-label">{isPt ? "Horas de sono" : "Sleep hours"}<input type="number" min="0" max="24" step="0.5" value={sleepHours} onChange={(event) => setSleepHours(Number(event.target.value))} /></label><label className="field-label">{isPt ? "Nota" : "Note"}<textarea maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} placeholder={isPt ? "Como correu o teu dia?" : "How did your day go?"} /></label><button className="recovery-primary" type="submit">{isPt ? "Guardar check-in" : "Save check-in"}</button></form></section>
        <section className="recovery-panel"><div className="panel-heading"><Activity size={20} /><div><span>{isPt ? "ACTIVIDADE" : "ACTIVITY"}</span><h2>{isPt ? "Antes e depois" : "Before and after"}</h2></div></div><form onSubmit={saveActivity}><label className="field-label">{isPt ? "Atividade" : "Activity"}<select value={activity} onChange={(event) => setActivity(event.target.value)}><option value="walking">{isPt ? "Caminhada" : "Walking"}</option><option value="study">{isPt ? "Estudo" : "Study"}</option><option value="screen">{isPt ? "Ecrã" : "Screen use"}</option><option value="reading">{isPt ? "Leitura" : "Reading"}</option><option value="social">{isPt ? "Atividade social" : "Social activity"}</option><option value="rest">{isPt ? "Descanso" : "Rest"}</option></select></label><label className="field-label">{isPt ? "Duração (minutos)" : "Duration (minutes)"}<input type="number" min="1" max="1440" value={duration} onChange={(event) => setDuration(Number(event.target.value))} /></label><div className="before-after"><fieldset><legend>{isPt ? "Antes" : "Before"}</legend>{([["headache", "Headache"], ["fatigue", "Fatigue"], ["dizziness", "Dizziness"]] as const).map(([key, text]) => <label key={key}>{isPt ? ({ headache: "Dor de cabeça", fatigue: "Fadiga", dizziness: "Tontura" }[key]) : text}<input aria-label={`${isPt ? text : text} before activity`} type="number" min="0" max="10" value={before[key]} onChange={(event) => setBefore({ ...before, [key]: Number(event.target.value) })} /></label>)}</fieldset><fieldset><legend>{isPt ? "Depois" : "After"}</legend>{([["headache", "Headache"], ["fatigue", "Fatigue"], ["dizziness", "Dizziness"]] as const).map(([key, text]) => <label key={key}>{isPt ? ({ headache: "Dor de cabeça", fatigue: "Fadiga", dizziness: "Tontura" }[key]) : text}<input aria-label={`${isPt ? text : text} after activity`} type="number" min="0" max="10" value={after[key]} onChange={(event) => setAfter({ ...after, [key]: Number(event.target.value) })} /></label>)}</fieldset></div><label className="field-label">{isPt ? "Nota" : "Note"}<textarea maxLength={2000} value={activityNote} onChange={(event) => setActivityNote(event.target.value)} /></label><button className="recovery-primary" type="submit">{isPt ? "Guardar atividade" : "Save activity"}</button></form></section>
      </div>
      <section className="recovery-panel timeline-panel"><div className="panel-heading"><FileText size={20} /><div><span>{isPt ? "TIMELINE" : "TIMELINE"}</span><h2>{isPt ? "Mudanças observadas" : "Observed changes"}</h2></div></div>{loading ? <p>{isPt ? "A carregar registos..." : "Loading entries..."}</p> : entries.length === 0 && activities.length === 0 ? <p>{isPt ? "Ainda não há dados. O teu primeiro registo aparecerá aqui." : "No data yet. Your first entry will appear here."}</p> : <div className="timeline-list">{entries.map((entry) => <article key={entry.id}><strong>{new Date(entry.createdAt).toLocaleDateString(isPt ? "pt-PT" : "en-GB")}</strong><span>{isPt ? "Check-in de sintomas" : "Symptom check-in"}</span><p>{isPt ? `Fadiga: ${entry.fatigue}/10 · Dor de cabeça: ${entry.headache}/10` : `Fatigue: ${entry.fatigue}/10 · Headache: ${entry.headache}/10`}</p></article>)}{activities.map((item) => <article key={item.id}><strong>{new Date(item.createdAt).toLocaleDateString(isPt ? "pt-PT" : "en-GB")}</strong><span>{item.activity} · {item.durationMinutes} min</span><p>{isPt ? `Fadiga: ${item.fatigueBefore} → ${item.fatigueAfter}. O valor depois foi ${item.fatigueAfter > item.fatigueBefore ? "mais alto" : "igual ou mais baixo"}.` : `Fatigue: ${item.fatigueBefore} → ${item.fatigueAfter}. The after-entry was ${item.fatigueAfter > item.fatigueBefore ? "higher" : "the same or lower"}.`}</p></article>)}</div>}</section>
    </div>
    <style jsx>{`.recovery-page{max-width:1100px;margin:0 auto;padding:12px 20px 48px;color:#fff}.recovery-heading h1{margin:8px 0;font-size:2.1rem}.recovery-heading p{color:rgba(255,255,255,.62);margin:0 0 22px}.recovery-eyebrow,.panel-heading>div>span{color:#00d2b5;font-size:.7rem;font-weight:800;letter-spacing:.14em}.safety-notice{display:flex;gap:10px;align-items:flex-start;padding:14px 16px;border:1px solid rgba(245,158,11,.35);background:rgba(245,158,11,.08);color:#fde68a;border-radius:10px;line-height:1.5;font-size:.82rem;margin-bottom:18px}.recovery-message{display:flex;align-items:center;gap:8px;color:#00d2b5}.recovery-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.recovery-panel{background:#0a0e1a;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:22px}.panel-heading{display:flex;gap:12px;align-items:flex-start;margin-bottom:20px}.panel-heading h2{margin:5px 0 0;font-size:1.1rem}.symptom-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px}.symptom-grid label{display:grid;grid-template-columns:1fr auto;gap:6px;color:rgba(255,255,255,.78);font-size:.8rem}.symptom-grid output{color:#00d2b5;font-weight:700}.symptom-grid input{grid-column:1/-1;width:100%;accent-color:#00d2b5}.field-label{display:grid;gap:7px;margin-top:15px;color:rgba(255,255,255,.75);font-size:.82rem}.field-label input,.field-label select,.field-label textarea,.before-after input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);border-radius:8px;color:#fff;padding:10px;box-sizing:border-box;width:100%}.field-label textarea{min-height:74px;resize:vertical}.recovery-primary{margin-top:16px;background:#00d2b5;color:#061018;border:0;border-radius:8px;padding:12px 16px;font-weight:800;cursor:pointer}.before-after{display:grid;grid-template-columns:1fr 1fr;gap:12px}.before-after fieldset{border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px}.before-after legend{color:#00d2b5;font-size:.78rem;font-weight:700}.before-after label{display:grid;gap:5px;margin:8px 0;font-size:.75rem}.timeline-panel{margin-top:18px}.timeline-list{display:grid;gap:10px}.timeline-list article{display:grid;grid-template-columns:125px 1fr;gap:4px 12px;padding:12px;border-left:2px solid #00d2b5;background:rgba(255,255,255,.035)}.timeline-list article strong{grid-row:span 2;color:#00d2b5;font-size:.8rem}.timeline-list article span{font-weight:700}.timeline-list article p{grid-column:2;margin:0;color:rgba(255,255,255,.62);font-size:.8rem}@media(max-width:800px){.recovery-grid{grid-template-columns:1fr}.symptom-grid{grid-template-columns:1fr}.timeline-list article{grid-template-columns:1fr}.timeline-list article strong{grid-row:auto}.timeline-list article p{grid-column:auto}}`}</style>
  </PrivateShell>;
}