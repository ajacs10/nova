"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Activity, Save } from "lucide-react";
import { PrivateShell } from "@/components/templates/private-shell";
import { getReturnToActivity, saveReturnToActivity, type ReturnToActivityPlan } from "@/shared/lib/api";
import { usePreferredLocale } from "@/shared/lib/locale";

const stages = [
  ["Daily activities", "Atividades diárias"],
  ["Light physical activity", "Atividade física leve"],
  ["Non-contact activity", "Atividade sem contacto"],
  ["Higher-intensity activity", "Atividade de maior intensidade"],
  ["Contact / high-risk activity", "Atividade de contacto / alto risco"],
];

export default function ReturnToActivityPage() {
  const params = useParams();
  const locale = usePreferredLocale("private", (params?.locale as string) || "en");
  const isPt = locale === "pt";

  const [plan, setPlan] = React.useState<ReturnToActivityPlan>({
    currentStage: 1,
    activityType: "",
    durationMinutes: 0,
    intensity: "",
    symptomsBefore: "",
    symptomsAfter: "",
    notes: "",
  });

  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      getReturnToActivity()
        .then((value) => {
          if (value) setPlan(value);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const update = (key: keyof ReturnToActivityPlan, value: string | number) =>
    setPlan((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    await saveReturnToActivity(plan);
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
                <Activity size={22} />
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
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* CARD 2: FORMULÁRIO DE REGISTO DE ATIVIDADE */}
            <section className="return-card form-grid-wrapper">
              <div className="form-grid">
                <label>
                  {isPt ? "Tipo de atividade" : "Activity type"}
                  <input
                    value={plan.activityType ?? ""}
                    onChange={(event) => update("activityType", event.target.value)}
                    placeholder={isPt ? "Ex.: caminhada" : "e.g. walking"}
                  />
                </label>

                <label>
                  {isPt ? "Duração (minutos)" : "Duration (minutes)"}
                  <input
                    type="number"
                    min="0"
                    max="1440"
                    value={plan.durationMinutes ?? 0}
                    onChange={(event) =>
                      update("durationMinutes", Number(event.target.value))
                    }
                  />
                </label>

                <label className="full">
                  {isPt ? "Intensidade/categoria" : "Intensity/category"}
                  <input
                    value={plan.intensity ?? ""}
                    onChange={(event) => update("intensity", event.target.value)}
                    placeholder={isPt ? "Ex.: leve" : "e.g. light"}
                  />
                </label>

                <label>
                  {isPt ? "Sintomas antes" : "Symptoms before"}
                  <textarea
                    value={plan.symptomsBefore ?? ""}
                    onChange={(event) => update("symptomsBefore", event.target.value)}
                  />
                </label>

                <label>
                  {isPt ? "Sintomas depois" : "Symptoms after"}
                  <textarea
                    value={plan.symptomsAfter ?? ""}
                    onChange={(event) => update("symptomsAfter", event.target.value)}
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
            ? "A NOVA não determina prontidão, progressão ou medical clearance."
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

        /* Layout em 2 colunas para telas Desktop */
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