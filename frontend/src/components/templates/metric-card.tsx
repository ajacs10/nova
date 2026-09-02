"use client";

import type { ReactNode } from "react";
import { DefensiveState } from "./defensive-state";

export interface MetricCardProps
{
  label: string;
  value?: number | string | null;
  unit?: string;
  description?: string;
  badge?: string;
  accent?: string;
  loading?: boolean;
  error?: string | null;
}

function safeValue(value: MetricCardProps["value"]): string
 {
  if (typeof value === "number")
    {
        return Number.isFinite(value) ? String(value) : "-";
    }
    return typeof value === "string" && value.trim() ? value : "-";
}

export function MetricCard({
  label,
  value = null,
  unit = "",
  description = "",
  badge = "",
  accent = "#ffffff",
  loading = false,
  error = null,
}: MetricCardProps) {
  const content: ReactNode = (
    <div
      style={{
        background: "#0a0e1a",
        borderRadius: 20,
        padding: "24px 28px",
        height: 128,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 800, color: accent }}>
          {safeValue(value)}
        </span>
        {unit && <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}>{unit}</span>}
        {badge && <span style={{ fontSize: "0.72rem", color: "#00d2b5" }}>{badge}</span>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{description}</span>
        <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>{label}</span>
      </div>
    </div>
  );

  return (
    <DefensiveState
      loading={loading}
      error={error}
      empty={value === null || value === undefined}
    >
      {content}
    </DefensiveState>
  );
}
