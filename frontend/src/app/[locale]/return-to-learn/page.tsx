"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { BookOpen, Save } from "lucide-react";
import { PrivateShell } from "@/components/templates/private-shell";
import { getReturnToLearn, saveReturnToLearn, type ReturnToLearnPlan } from "@/shared/lib/api";
import { usePreferredLocale } from "@/shared/lib/locale";

const stages = [
  ["Daily activities", "Atividades diárias"],
  ["Light cognitive activity", "Atividade cognitiva leve"],
  ["Modified / part-time learning", "Aprendizagem adaptada / parcial"],
  ["Increasing academic load", "Aumento gradual da carga académica"],
  ["Full learning activities", "Atividades de aprendizagem completas"],
];

export default function ReturnToLearnPage() {
  const params = useParams();
  const locale = usePreferredLocale("private", (params?.locale as string) || "en");
  const isPt = locale === "pt";

  const [plan, setPlan] = React.useState<ReturnToLearnPlan>({
    currentStage: 1,
    schoolHours: 0,
    breaks: "",
    screenTimeMinutes: 0,
    cognitiveActivity: "",
    accommodations: "",
    symptoms: "",
    notes: "",
  });

  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      getReturnToLearn()
        .then((value) => {
          if (value) setPlan(value);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const update = (key: keyof ReturnToLearnPlan, value: string | number) =>
    setPlan((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    await saveReturnToLearn(plan);
    setMessage(isPt ? "Registo guardado." : "Tracking information saved.");
  }

  return (
    <PrivateShell>
      <main className="return-page">
        {loading ? (
          <div className="loading-state">
            <p>{isPt ? "A carregar dados..." : "Loading data..."}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="return-grid-layout">
            {/* CARD 1: PROGRESSÃO INFORMATIVA */}
            <section className="return-card">
              <div className="return-title">
                <BookOpen size={22} />
                <h2>{isPt ? "Progressão informativa" : "Information-only progression"}</h2>
              </div>
              <div className="stage-list">
                {stages.map((stage, index) => (
                  <label
                    key={stage[0]}
                    className={plan.currentStage === index + 1 ? "stage active" : "stage"}
                  >
                    <input
                      type="radio"
                      name="stage"
                      checked={plan.currentStage === index + 1}
                      onChange={() => update("currentStage", index + 1)}
                    />
                    <span className="stage-number">0{index + 1}</span>
                    <span className="stage-info">
                      <strong>{isPt ? stage[1] : stage[0]}</strong>
                      <small>
                        {isPt
                          ? "Registar e discutir conforme tolerância"
                          : "Track and discuss according to tolerance"}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* CARD 2: PAINEL DE CHECK-IN E ATIVIDADE */}
            <section className="return-card form-grid-wrapper">
              <div className="form-grid">
                <label>
                  {isPt ? "Horas de aprendizagem" : "Learning hours"}
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={plan.schoolHours ?? 0}
                    onChange={(event) => update("schoolHours", Number(event.target.value))}
                  />
                </label>

                <label>
                  {isPt ? "Tempo de ecrã (minutos)" : "Screen time (minutes)"}
                  <input
                    type="number"
                    min="0"
                    max="1440"
                    value={plan.screenTimeMinutes ?? 0}
                    onChange={(event) =>
                      update("screenTimeMinutes", Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  {isPt ? "Pausas" : "Breaks"}
                  <input
                    value={plan.breaks ?? ""}
                    onChange={(event) => update("breaks", event.target.value)}
                    placeholder={isPt ? "Ex.: 10 min a cada hora" : "e.g. 10 min each hour"}
                  />
                </label>

                <label>
                  {isPt ? "Atividade cognitiva" : "Cognitive activity"}
                  <input
                    value={plan.cognitiveActivity ?? ""}
                    onChange={(event) => update("cognitiveActivity", event.target.value)}
                    placeholder={isPt ? "Ex.: leitura, aula, estudo" : "e.g. reading, class, study"}
                  />
                </label>

                <label className="full">
                  {isPt ? "Adaptações" : "Accommodations"}
                  <textarea
                    value={plan.accommodations ?? ""}
                    onChange={(event) => update("accommodations", event.target.value)}
                    placeholder={isPt ? "Pausas, ambiente, carga" : "Breaks, environment, workload"}
                  />
                </label>

                <label className="full">
                  {isPt ? "Sintomas observados" : "Observed symptoms"}
                  <textarea
                    value={plan.symptoms ?? ""}
                    onChange={(event) => update("symptoms", event.target.value)}
                  />
                </label>

                <label className="full">
                  {isPt ? "Notas" : "Notes"}
                  <textarea
                    value={plan.notes ?? ""}
                    onChange={(event) => update("notes", event.target.value)}
                  />
                </label>

                <div className="full action-area">
                  <button className="return-primary" type="submit">
                    <Save size={18} />
                    {isPt ? "Guardar registo" : "Save tracking"}
                  </button>
                  {message && (
                    <p role="status" className="return-message">
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </form>
        )}

        <p className="return-footnote">
          {isPt
            ? "A NOVA não determina prontidão, progressão ou autorização médica."
            : "NOVA does not determine readiness, progression, or medical clearance."}
        </p>
      </main>

      <style jsx>{`
        .return-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 20px 48px;
        }

        .loading-state {
          padding: 48px 0;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        /* Disposição no eixo X para telas Desktop (2 Colunas) */
        .return-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .return-card {
          background: #0a0e1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.36);
        }

        .return-title {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
        }

        .return-title svg {
          color: #00d2b5;
        }

        .return-title h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .stage-list {
          display: grid;
          gap: 12px;
        }

        .stage {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stage:hover {
          border-color: rgba(0, 210, 181, 0.4);
          background: rgba(0, 210, 181, 0.03);
        }

        .stage input {
          accent-color: #00d2b5;
          width: 18px;
          height: 18px;
        }

        .stage.active {
          border-color: #00d2b5;
          background: rgba(0, 210, 181, 0.08);
          color: #ffffff;
        }

        .stage-number {
          color: #00d2b5;
          font-weight: 800;
          font-size: 1rem;
        }

        .stage-info {
          display: flex;
          flex-direction: column;
        }

        .stage small {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2px;
          font-size: 0.8rem;
        }

        .form-grid-wrapper {
          display: flex;
          flex-direction: column;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-grid label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .form-grid input,
        .form-grid textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .form-grid input:focus,
        .form-grid textarea:focus {
          border-color: #00d2b5;
          background: rgba(255, 255, 255, 0.07);
        }

        .form-grid textarea {
          min-height: 96px;
          resize: vertical;
        }

        .form-grid .full {
          grid-column: 1 / -1;
        }

        .action-area {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }

        .return-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 10px;
          padding: 14px 24px;
          background: #00d2b5;
          color: #061018;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .return-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .return-footnote {
          margin-top: 24px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.8rem;
          text-align: center;
        }

        .return-message {
          color: #00d2b5;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
        }

        /* Responsividade para Tablet/Mobile */
        @media (max-width: 960px) {
          .return-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .action-area {
            flex-direction: column;
            align-items: stretch;
          }

          .return-primary {
            width: 100%;
          }
        }
      `}</style>
    </PrivateShell>
  );
}