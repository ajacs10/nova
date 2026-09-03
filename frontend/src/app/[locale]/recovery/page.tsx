"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Activity, CheckCircle2 } from "lucide-react";
import { PrivateShell } from "@/components/templates/private-shell";
import { usePreferredLocale } from "@/shared/lib/locale";
import {
  createActivityEntry,
  createRecoveryEntry,
} from "@/shared/lib/api";

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

type SymptomKey = (typeof symptoms)[number][0];
type SymptomForm = Record<SymptomKey, number>;
const initialSymptoms = Object.fromEntries(
  symptoms.map(([key]) => [key, 0])
) as SymptomForm;

export default function RecoveryPage() {
  const params = useParams();
  const locale = usePreferredLocale(
    "private",
    (params?.locale as string) || "en"
  );
  const isPt = locale === "pt";

  const [form, setForm] = React.useState<SymptomForm>(initialSymptoms);
  const [sleepHours, setSleepHours] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [activity, setActivity] = React.useState("walking");
  const [duration, setDuration] = React.useState(15);
  const [before, setBefore] = React.useState({
    headache: 0,
    fatigue: 0,
    dizziness: 0,
  });
  const [after, setAfter] = React.useState({
    headache: 0,
    fatigue: 0,
    dizziness: 0,
  });
  const [activityNote, setActivityNote] = React.useState("");
  const [message, setMessage] = React.useState("");

  async function saveRecovery(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    await createRecoveryEntry({ ...form, sleepHours, note });
    setMessage(
      isPt ? "Registo de recuperação guardado." : "Recovery entry saved."
    );
    setForm(initialSymptoms);
    setSleepHours(0);
    setNote("");
  }

  async function saveActivity(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    await createActivityEntry({
      activity,
      durationMinutes: duration,
      headacheBefore: before.headache,
      fatigueBefore: before.fatigue,
      dizzinessBefore: before.dizziness,
      headacheAfter: after.headache,
      fatigueAfter: after.fatigue,
      dizzinessAfter: after.dizziness,
      note: activityNote,
    });
    setMessage(isPt ? "Atividade guardada." : "Activity saved.");
  }

  const label = (item: (typeof symptoms)[number]) =>
    isPt ? item[2] : item[1];

  return (
    <PrivateShell>
      <div className="recovery-page">
        {message && (
          <p className="recovery-message" role="status">
            <CheckCircle2 size={18} />
            {message}
          </p>
        )}

        <div className="recovery-grid">
          {/* CARD 1: DAILY CHECK-IN */}
          <section className="recovery-panel">
            <div className="panel-heading">
              <Activity size={24} />
              <div>
                <span>{isPt ? "CHECK-IN DIÁRIO" : "DAILY CHECK-IN"}</span>
                <h2>
                  {isPt
                    ? "Sintomas e funcionamento"
                    : "Symptoms and daily functioning"}
                </h2>
              </div>
            </div>

            <form onSubmit={saveRecovery}>
              <div className="symptom-grid">
                {symptoms.map((item) => (
                  <label key={item[0]}>
                    <div className="symptom-header">
                      <span>{label(item)}</span>
                      <output>{form[item[0]]}/10</output>
                    </div>
                    <input
                      aria-label={`${label(item)} 0 to 10`}
                      type="range"
                      min="0"
                      max="10"
                      value={form[item[0]]}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          [item[0]]: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="form-fields">
                <label className="field-label">
                  {isPt ? "Horas de sono" : "Sleep hours"}
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHours}
                    onChange={(event) =>
                      setSleepHours(Number(event.target.value))
                    }
                  />
                </label>

                <label className="field-label">
                  {isPt ? "Nota" : "Note"}
                  <textarea
                    maxLength={2000}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={
                      isPt ? "Como correu o teu dia?" : "How did your day go?"
                    }
                  />
                </label>
              </div>

              <button className="recovery-primary" type="submit">
                {isPt ? "Guardar check-in" : "Save check-in"}
              </button>
            </form>
          </section>

          {/* CARD 2: ACTIVITY CHECK-IN */}
          <section className="recovery-panel">
            <div className="panel-heading">
              <Activity size={24} />
              <div>
                <span>{isPt ? "ACTIVIDADE" : "ACTIVITY"}</span>
                <h2>{isPt ? "Antes e depois" : "Before and after"}</h2>
              </div>
            </div>

            <form onSubmit={saveActivity}>
              <div className="form-fields">
                <label className="field-label">
                  {isPt ? "Atividade" : "Activity"}
                  <select
                    value={activity}
                    onChange={(event) => setActivity(event.target.value)}
                  >
                    <option value="walking">
                      {isPt ? "Caminhada" : "Walking"}
                    </option>
                    <option value="study">{isPt ? "Estudo" : "Study"}</option>
                    <option value="screen">
                      {isPt ? "Ecrã" : "Screen use"}
                    </option>
                    <option value="reading">
                      {isPt ? "Leitura" : "Reading"}
                    </option>
                    <option value="social">
                      {isPt ? "Atividade social" : "Social activity"}
                    </option>
                    <option value="rest">{isPt ? "Descanso" : "Rest"}</option>
                  </select>
                </label>

                <label className="field-label">
                  {isPt ? "Duração (minutos)" : "Duration (minutes)"}
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={duration}
                    onChange={(event) =>
                      setDuration(Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="before-after">
                <fieldset>
                  <legend>{isPt ? "Antes" : "Before"}</legend>
                  {(
                    [
                      ["headache", "Headache"],
                      ["fatigue", "Fatigue"],
                      ["dizziness", "Dizziness"],
                    ] as const
                  ).map(([key, text]) => (
                    <label key={key}>
                      {isPt
                        ? {
                            headache: "Dor de cabeça",
                            fatigue: "Fadiga",
                            dizziness: "Tontura",
                          }[key]
                        : text}
                      <input
                        aria-label={`${isPt ? text : text} before activity`}
                        type="number"
                        min="0"
                        max="10"
                        value={before[key]}
                        onChange={(event) =>
                          setBefore({
                            ...before,
                            [key]: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  ))}
                </fieldset>

                <fieldset>
                  <legend>{isPt ? "Depois" : "After"}</legend>
                  {(
                    [
                      ["headache", "Headache"],
                      ["fatigue", "Fatigue"],
                      ["dizziness", "Dizziness"],
                    ] as const
                  ).map(([key, text]) => (
                    <label key={key}>
                      {isPt
                        ? {
                            headache: "Dor de cabeça",
                            fatigue: "Fadiga",
                            dizziness: "Tontura",
                          }[key]
                        : text}
                      <input
                        aria-label={`${isPt ? text : text} after activity`}
                        type="number"
                        min="0"
                        max="10"
                        value={after[key]}
                        onChange={(event) =>
                          setAfter({
                            ...after,
                            [key]: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  ))}
                </fieldset>
              </div>

              <div className="form-fields">
                <label className="field-label">
                  {isPt ? "Nota" : "Note"}
                  <textarea
                    maxLength={2000}
                    value={activityNote}
                    onChange={(event) => setActivityNote(event.target.value)}
                  />
                </label>
              </div>

              <button className="recovery-primary" type="submit">
                {isPt ? "Guardar atividade" : "Save activity"}
              </button>
            </form>
          </section>
        </div>
      </div>

      <style jsx>{`
        .recovery-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 20px 48px;
          color: #fff;
        }

        .recovery-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(0, 210, 181, 0.1);
          border: 1px solid #00d2b5;
          border-radius: 12px;
          color: #00d2b5;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .recovery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .recovery-panel {
          background: #0a0e1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.36);
        }

        .panel-heading {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .panel-heading svg {
          color: #00d2b5;
          margin-top: 2px;
        }

        .panel-heading div span {
          color: #00d2b5;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .panel-heading h2 {
          margin: 4px 0 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .symptom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 20px;
          margin-bottom: 20px;
        }

        .symptom-grid label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 12px 14px;
          border-radius: 10px;
        }

        .symptom-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        .symptom-header output {
          color: #00d2b5;
          font-weight: 800;
        }

        .symptom-grid input[type="range"] {
          width: 100%;
          accent-color: #00d2b5;
          cursor: pointer;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .field-label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .field-label input,
        .field-label select,
        .field-label textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #fff;
          padding: 12px 16px;
          box-sizing: border-box;
          width: 100%;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .field-label input:focus,
        .field-label select:focus,
        .field-label textarea:focus {
          border-color: #00d2b5;
          background: rgba(255, 255, 255, 0.07);
        }

        .field-label select option {
          background: #0a0e1a;
          color: #fff;
        }

        .field-label textarea {
          min-height: 96px;
          resize: vertical;
        }

        .before-after {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .before-after fieldset {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 16px;
        }

        .before-after legend {
          color: #00d2b5;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0 6px;
        }

        .before-after label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .before-after label:last-child {
          margin-bottom: 0;
        }

        .before-after input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #fff;
          padding: 8px 12px;
          font-size: 0.9rem;
        }

        .recovery-primary {
          width: 100%;
          margin-top: 24px;
          background: #00d2b5;
          color: #061018;
          border: 0;
          border-radius: 10px;
          padding: 14px 20px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .recovery-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        @media (max-width: 960px) {
          .recovery-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .symptom-grid {
            grid-template-columns: 1fr;
          }

          .before-after {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PrivateShell>
  );
}