"use client";

import type { ReactNode } from "react";

export interface DefensiveStateProps
{
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  emptyFallback?: ReactNode;
  children: ReactNode;
}

export function DefensiveState({
  loading = false,
  error = null,
  empty = false,
  loadingFallback = <StatePlaceholder />,
  errorFallback = <StateMessage>Não foi possível carregar os dados.</StateMessage>,
  emptyFallback = <StateMessage>Não existem dados disponíveis.</StateMessage>,
  children,
}: DefensiveStateProps) {
  if (loading) return <>{loadingFallback}</>;
  if (error) return <>{errorFallback}</>;
  if (empty) return <>{emptyFallback}</>;
  return <>{children}</>;
}

export function StatePlaceholder()
{
  return (
    <div
      aria-label="A carregar"
      className="animate-pulse"
      style={{
        minHeight: 112,
        width: "100%",
        borderRadius: 18,
        background: "rgba(255,255,255,0.06)",
      }}
    />
  );
}

export function StateMessage({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      style={{
        width: "100%",
        padding: "24px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.65)",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}
